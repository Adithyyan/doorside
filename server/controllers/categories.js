const helpers = require('../helpers.js');
const db = require('../db.js');
const { MESSAGES } = require('../strings.js');

const api = {
  async getCategoryTree(req, res) {
    const qObj = {};
    try {
      const categories = await db.any(
        req,
        `select
            c.*,
            m.url as image_url,
            m.alt_text as image_alt,
            bm.url as banner_url
         from categories c
         left join media m on m.id = c.image_id
         left join media bm on bm.id = c.banner_image_id
         where c.is_active = true
         order by c.sort_order asc, c.name asc`,
        qObj,
      );

      // Build hierarchical tree
      const map = {};
      const roots = [];

      (categories || []).forEach((cat) => {
        map[cat.id] = { ...cat, children: [] };
      });

      (categories || []).forEach((cat) => {
        if (cat.parent_id && map[cat.parent_id]) {
          map[cat.parent_id].children.push(map[cat.id]);
        } else {
          roots.push(map[cat.id]);
        }
      });

      return res.status(200).json({ success: true, data: { categories: roots } });
    } catch (error) {
      req.log.error('categories.getCategoryTree(): Unexpected error', { error });
      return helpers.psqlError(error, req, res, 'Unable to get category tree.');
    }
  },

  async getFeatured(req, res) {
    const qObj = {
      limit: Math.min(parseInt(req.query?.limit, 10) || 8, 20),
    };

    try {
      const categories = await db.any(
        req,
        `select c.*, m.url as image_url
         from categories c
         left join media m on m.id = c.image_id
         where c.is_featured = true and c.is_active = true
         order by c.sort_order asc, c.name asc
         limit $/limit/`,
        qObj,
      );
      return res.status(200).json({ success: true, data: { categories } });
    } catch (error) {
      req.log.error('categories.getFeatured(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get featured categories.');
    }
  },

  async getCategoryBySlug(req, res) {
    const qObj = {
      slug: req.params?.slug?.trim(),
    };

    if (!qObj.slug) {
      return res.status(400).json({ success: false, msg: 'Category slug is required.' });
    }

    try {
      const category = await db.oneOrNone(
        req,
        `select c.*, m.url as image_url, bm.url as banner_url
         from categories c
         left join media m on m.id = c.image_id
         left join media bm on bm.id = c.banner_image_id
         where c.slug = $/slug/ and c.is_active = true`,
        qObj,
      );

      if (!category) {
        req.log.warn('categories.getCategoryBySlug(): Category not found', qObj);
        return res.status(404).json({ success: false, msg: MESSAGES.CATEGORY_NOT_FOUND });
      }

      qObj.parentId = category.id;
      const children = await db.any(
        req,
        `select c.*, m.url as image_url
         from categories c
         left join media m on m.id = c.image_id
         where c.parent_id = $/parentId/ and c.is_active = true
         order by c.sort_order asc, c.name asc`,
        qObj,
      );

      return res.status(200).json({ success: true, data: { category, children } });
    } catch (error) {
      req.log.error('categories.getCategoryBySlug(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get category by slug.');
    }
  },

  async getCategoryProducts(req, res) {
    const { page, pageSize, offset } = helpers.extractPagination(req.query);
    const qObj = {
      slug: req.params?.slug?.trim(),
      limit: pageSize,
      offset,
    };

    try {
      const category = await db.oneOrNone(
        req,
        'select id from categories where slug = $/slug/ and is_active = true',
        qObj,
      );

      if (!category) {
        req.log.warn('categories.getCategoryProducts(): Category not found', qObj);
        return res.status(404).json({ success: false, msg: MESSAGES.CATEGORY_NOT_FOUND });
      }

      qObj.categoryId = category.id;
      const [rows, countResult] = await Promise.all([
        db.any(
          req,
          `select p.id, p.name, p.slug, p.short_description, p.selling_price_paisa, p.compare_at_price_paisa,
                  p.stock_quantity, m.url as primary_image_url
           from products p
           left join product_images pi on pi.product_id = p.id and pi.is_primary = true
           left join media m on m.id = pi.media_id
           where p.category_id = $/categoryId/ and p.is_active = true and p.status = 'active'
           order by p.created_at desc
           limit $/limit/ offset $/offset/`,
          qObj,
        ),
        db.one(
          req,
          `select count(*) as total from products where category_id = $/categoryId/ and is_active = true and status = 'active'`,
          qObj,
        ),
      ]);

      return res.status(200).json({
        success: true,
        data: helpers.paginatedResponse(rows, parseInt(countResult.total, 10), page, pageSize),
      });
    } catch (error) {
      req.log.error('categories.getCategoryProducts(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get category products.');
    }
  },

  // ==========================================
  // ADMIN CATEGORIES
  // ==========================================
  async adminGetCategories(req, res) {
    const qObj = {};
    try {
      const categories = await db.any(
        req,
        `select c.*, m.url as image_url, p.name as parent_name
         from categories c
         left join media m on m.id = c.image_id
         left join categories p on p.id = c.parent_id
         order by c.sort_order asc, c.name asc`,
        qObj,
      );
      return res.status(200).json({ success: true, data: { categories } });
    } catch (error) {
      req.log.error('categories.adminGetCategories(): Unexpected error', { error });
      return helpers.psqlError(error, req, res, 'Unable to get admin categories.');
    }
  },

  async adminCreateCategory(req, res) {
    const qObj = {
      name: req.body?.name?.trim(),
      slug: req.body?.slug?.trim() || helpers.createSlug(req.body?.name),
      description: req.body?.description || null,
      parentId: req.body?.parentId || null,
      imageId: req.body?.imageId || null,
      bannerImageId: req.body?.bannerImageId || null,
      isActive: req.body?.isActive !== undefined ? req.body.isActive : true,
      isFeatured: req.body?.isFeatured || false,
      sortOrder: req.body?.sortOrder || 0,
    };

    if (!qObj.name) {
      return res.status(400).json({ success: false, msg: 'Category name is required.' });
    }

    try {
      const category = await db.one(
        req,
        `insert into categories (name, slug, description, parent_id, image_id, banner_image_id, is_active, is_featured, sort_order)
         values ($/name/, $/slug/, $/description/, $/parentId/, $/imageId/, $/bannerImageId/, $/isActive/, $/isFeatured/, $/sortOrder/)
         returning *`,
        qObj,
      );

      req.log.info('categories.adminCreateCategory(): Category created', { id: category.id, name: category.name });
      return res.status(201).json({ success: true, msg: 'Category created successfully', data: { category } });
    } catch (error) {
      req.log.error('categories.adminCreateCategory(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to create category.');
    }
  },

  async adminUpdateCategory(req, res) {
    const qObj = {
      id: req.params?.id,
      name: req.body?.name !== undefined ? req.body.name : null,
      description: req.body?.description !== undefined ? req.body.description : null,
      parentId: req.body?.parentId !== undefined ? req.body.parentId : null,
      imageId: req.body?.imageId !== undefined ? req.body.imageId : null,
      bannerImageId: req.body?.bannerImageId !== undefined ? req.body.bannerImageId : null,
      isActive: req.body?.isActive !== undefined ? req.body.isActive : null,
      isFeatured: req.body?.isFeatured !== undefined ? req.body.isFeatured : null,
      sortOrder: req.body?.sortOrder !== undefined ? req.body.sortOrder : null,
    };

    try {
      const updated = await db.one(
        req,
        `update categories set
           name = coalesce($/name/, name),
           description = coalesce($/description/, description),
           parent_id = coalesce($/parentId/, parent_id),
           image_id = coalesce($/imageId/, image_id),
           banner_image_id = coalesce($/bannerImageId/, banner_image_id),
           is_active = coalesce($/isActive/, is_active),
           is_featured = coalesce($/isFeatured/, is_featured),
           sort_order = coalesce($/sortOrder/, sort_order),
           updated_at = now()
         where id = $/id/
         returning *`,
        qObj,
      );

      req.log.info('categories.adminUpdateCategory(): Category updated', { id: qObj.id });
      return res.status(200).json({ success: true, msg: 'Category updated successfully', data: { category: updated } });
    } catch (error) {
      req.log.error('categories.adminUpdateCategory(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to update category.');
    }
  },

  async adminDeleteCategory(req, res) {
    const qObj = {
      id: req.params?.id,
    };

    try {
      await db.none(req, 'update categories set is_active = false, updated_at = now() where id = $/id/', qObj);
      req.log.info('categories.adminDeleteCategory(): Category deactivated', qObj);
      return res.status(200).json({ success: true, msg: 'Category deactivated successfully' });
    } catch (error) {
      req.log.error('categories.adminDeleteCategory(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to delete category.');
    }
  },
};

module.exports = api;
