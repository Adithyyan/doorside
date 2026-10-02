const helpers = require('../helpers.js');
const db = require('../db.js');
const dayjs = require('dayjs');
const { MESSAGES } = require('../strings.js');
const {
  HTTP_STATUS,
  ERROR_CODES,
  AUDIT_ACTIONS,
} = require('../constants.js');

const api = {
  // ==========================================
  // STOREFRONT PRODUCTS
  // ==========================================
  async getProducts(req, res) {
    const { page, pageSize, offset } = helpers.extractPagination(req.query);
    const targetCategory = req.query.category || req.query.categorySlug;
    const sortKey = req.query.sortId || req.query.sort_id || req.query.sort;
    const rawFilterIds = req.query.filterValueIds || req.query.filter_value_ids || req.query.filterValues;

    let filterIds = [];
    if (typeof rawFilterIds === 'string') {
      filterIds = rawFilterIds.split(',').map((s) => s.trim()).filter(Boolean);
    } else if (Array.isArray(rawFilterIds)) {
      filterIds = rawFilterIds.map((s) => String(s).trim()).filter(Boolean);
    }

    const qObj = {
      page,
      pageSize,
      offset,
      limit: pageSize,
      category: targetCategory || null,
      search: req.query.search ? `%${req.query.search}%` : null,
      minPrice: req.query.minPrice ? helpers.rupeesToPaisa(req.query.minPrice) : null,
      maxPrice: req.query.maxPrice ? helpers.rupeesToPaisa(req.query.maxPrice) : null,
      sortKey: sortKey || null,
      filterIds,
      distinctFilterCount: 1,
    };

    try {
      // -----------------------------------------------------------
      // Dynamic Sort Resolution via product_sort_options ID or code
      // -----------------------------------------------------------
      let sortField = 'created_at';
      let direction = 'desc';

      if (qObj.sortKey) {
        try {
          const sortRow = await db.oneOrNone(
            req,
            `select field, direction from product_sort_options
             where is_active = true and (id::text = $/sortKey/ or code = $/sortKey/)
             limit 1`,
            qObj,
          );
          if (sortRow) {
            sortField = sortRow.field;
            direction = sortRow.direction || 'asc';
          } else {
            const parsed = helpers.parseSort(qObj.sortKey, ['name', 'selling_price_paisa', 'created_at', 'is_featured', 'average_rating'], 'created_at');
            sortField = parsed.field;
            direction = parsed.direction;
          }
        } catch {
          const parsed = helpers.parseSort(qObj.sortKey, ['name', 'selling_price_paisa', 'created_at', 'is_featured', 'average_rating'], 'created_at');
          sortField = parsed.field;
          direction = parsed.direction;
        }
      }

      const conditions = ["p.is_active = true and p.status = 'active'"];

      if (qObj.category) {
        conditions.push('(c.slug = $/category/ or c.id in (select id from categories where parent_id = (select id from categories where slug = $/category/)))');
      }
      if (qObj.search) {
        conditions.push('(p.name ilike $/search/ or p.description ilike $/search/ or p.tags::text ilike $/search/)');
      }
      if (qObj.minPrice !== null) {
        conditions.push('p.selling_price_paisa >= $/minPrice/');
      }
      if (qObj.maxPrice !== null) {
        conditions.push('p.selling_price_paisa <= $/maxPrice/');
      }

      // -----------------------------------------------------------
      // Dynamic Filter Value IDs matching via product_filter_mappings
      // -----------------------------------------------------------
      if (qObj.filterIds.length > 0) {
        let distinctFilterCount = 1;
        try {
          const valRows = await db.any(
            req,
            `select distinct filter_id from filter_values where id::text in ($/filterIds:list/) or id in ($/filterIds:list/)`,
            qObj,
          );
          if (valRows && valRows.length > 0) {
            distinctFilterCount = valRows.length;
          }
        } catch {
          // fallback
        }

        conditions.push(`p.id in (
          select pfm.product_id
          from product_filter_mappings pfm
          where pfm.filter_value_id::text in ($/filterIds:list/) or pfm.filter_value_id in ($/filterIds:list/)
          group by pfm.product_id
          having count(distinct pfm.filter_id) >= $/distinctFilterCount/
        )`);
        qObj.distinctFilterCount = distinctFilterCount;
      }

      const whereClause = `where ${conditions.join(' and ')}`;

      let orderBy = `order by p.created_at desc`;
      if (sortField === 'price' || sortField === 'selling_price_paisa') {
        orderBy = `order by p.selling_price_paisa ${direction}`;
      } else if (sortField === 'name') {
        orderBy = `order by p.name ${direction}`;
      } else if (sortField === 'is_featured' || sortField === 'featured') {
        orderBy = `order by p.is_featured desc, p.created_at desc`;
      } else if (sortField === 'average_rating' || sortField === 'rating') {
        orderBy = `order by average_rating ${direction}, p.created_at desc`;
      } else if (sortField === 'created_at' || sortField === 'newest') {
        orderBy = `order by p.created_at ${direction}`;
      } else {
        orderBy = `order by p.created_at desc`;
      }

      const [rows, countResult] = await Promise.all([
        db.any(
          req,
          `select
              p.id, p.name, p.slug, p.short_description,
              p.selling_price_paisa, p.compare_at_price_paisa,
              p.stock_quantity, p.is_featured, p.created_at,
              c.name as category_name, c.slug as category_slug,
              m.url as primary_image_url,
              coalesce(avg(r.rating), 0) as average_rating,
              count(distinct case when r.status = 'approved' then r.id end) as review_count
           from products p
           left join categories c on c.id = p.category_id
           left join product_images pi on pi.product_id = p.id and pi.is_primary = true
           left join media m on m.id = pi.media_id
           left join reviews r on r.product_id = p.id
           ${whereClause}
           group by p.id, p.name, p.slug, p.short_description, p.selling_price_paisa, p.compare_at_price_paisa, p.stock_quantity, p.is_featured, p.created_at, c.name, c.slug, m.url
           ${orderBy}
           limit $/limit/ offset $/offset/`,
          qObj,
        ),
        db.one(req, `select count(*) as total from products p left join categories c on c.id = p.category_id ${whereClause}`, qObj),
      ]);

      const paginated = helpers.paginatedResponse(rows, parseInt(countResult.total, 10), page, pageSize);
      return res.status(200).json({
        success: true,
        data: {
          ...paginated,
          products: rows,
        },
      });
    } catch (error) {
      req.log.error('products.getProducts(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get products.');
    }
  },

  async getFiltersAndSortOptions(req, res) {
    const qObj = {};
    try {
      const [filterRows, valueRows, sortRows] = await Promise.all([
        db.any(req, `select id, name, code, sort_order from filters where is_active = true order by sort_order asc, name asc`, qObj),
        db.any(
          req,
          `select fv.id, fv.filter_id, fv.name, fv.value, fv.sort_order,
                  count(distinct pfm.product_id) as product_count
           from filter_values fv
           left join product_filter_mappings pfm on pfm.filter_value_id = fv.id
           left join products p on p.id = pfm.product_id and p.is_active = true and p.status = 'active'
           where fv.is_active = true
           group by fv.id, fv.filter_id, fv.name, fv.value, fv.sort_order
           order by fv.sort_order asc, fv.name asc`,
          qObj,
        ),
        db.any(req, `select id, name, code, field, direction, sort_order from product_sort_options where is_active = true order by sort_order asc`, qObj),
      ]);

      const filters = (filterRows || []).map((f) => ({
        id: f.id,
        name: f.name,
        code: f.code,
        sortOrder: f.sort_order,
        values: (valueRows || [])
          .filter((v) => v.filter_id === f.id)
          .map((v) => ({
            id: v.id,
            name: v.name,
            value: v.value,
            sortOrder: v.sort_order,
            productCount: parseInt(v.product_count, 10) || 0,
          })),
      }));

      const sortOptions = (sortRows || []).map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        field: s.field,
        direction: s.direction,
        sortOrder: s.sort_order,
      }));

      return res.status(200).json({
        success: true,
        data: { filters, sortOptions },
      });
    } catch (error) {
      req.log.error('products.getFiltersAndSortOptions(): Unexpected error', { error });
      return helpers.psqlError(error, req, res, 'Unable to get filters and sort options.');
    }
  },

  async getFeatured(req, res) {
    const qObj = {
      limit: Math.min(parseInt(req.query?.limit, 10) || 8, 20),
    };
    try {
      const rows = await db.any(
        req,
        `select
            p.id, p.name, p.slug, p.short_description,
            p.selling_price_paisa, p.compare_at_price_paisa,
            p.stock_quantity, p.is_featured,
            c.name as category_name, c.slug as category_slug,
            m.url as primary_image_url,
            coalesce(avg(r.rating), 0) as average_rating,
            count(distinct case when r.status = 'approved' then r.id end) as review_count
         from products p
         left join categories c on c.id = p.category_id
         left join product_images pi on pi.product_id = p.id and pi.is_primary = true
         left join media m on m.id = pi.media_id
         left join reviews r on r.product_id = p.id
         where p.is_featured = true and p.is_active = true and p.status = 'active'
         group by p.id, p.name, p.slug, p.short_description, p.selling_price_paisa, p.compare_at_price_paisa, p.stock_quantity, p.is_featured, c.name, c.slug, m.url
         order by p.created_at desc
         limit $/limit/`,
        qObj,
      );
      return res.status(200).json({
        success: true,
        data: { products: rows },
      });
    } catch (error) {
      req.log.error('products.getFeatured(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get featured products.');
    }
  },

  async getProductBySlug(req, res) {
    const qObj = {
      slug: req.params.slug || req.params.urlHandle || req.params.id,
    };
    try {
      const product = await db.oneOrNone(
        req,
        `select
            p.*,
            c.name as category_name,
            c.slug as category_slug
         from products p
         left join categories c on c.id = p.category_id
         where (p.slug = $/slug/ or p.id::text = $/slug/) and p.is_active = true and p.status = 'active'`,
        qObj,
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          msg: MESSAGES.PRODUCT_NOT_FOUND,
          error: { code: ERROR_CODES.NOT_FOUND, message: MESSAGES.PRODUCT_NOT_FOUND },
        });
      }

      // Fetch rating & review count
      const reviewStats = await db.oneOrNone(
        req,
        `select
            coalesce(avg(rating), 0) as average_rating,
            count(distinct case when status = 'approved' then id end) as review_count
         from reviews
         where product_id = $/id/`,
        { id: product.id },
      );
      product.average_rating = reviewStats ? Number(reviewStats.average_rating) : 0;
      product.review_count = reviewStats ? Number(reviewStats.review_count) : 0;

      // Fetch images
      const images = await db.any(
        req,
        `select pi.id, pi.media_id as "mediaId", m.url, m.alt_text as "altText", pi.is_primary as "isPrimary", pi.sort_order as "sortOrder"
         from product_images pi
         left join media m on m.id = pi.media_id
         where pi.product_id = $/id/
         order by pi.sort_order asc, pi.is_primary desc`,
        { id: product.id },
      );

      // Fetch variants
      const variants = await db.any(
        req,
        `select pv.id, pv.name, pv.sku, pv.attributes, pv.selling_price_paisa as "sellingPricePaisa",
                pv.compare_at_price_paisa as "compareAtPricePaisa", pv.stock_quantity as "stockQuantity",
                pv.is_active as "isActive", pv.sort_order as "sortOrder", vm.url as "imageUrl"
         from product_variants pv
         left join media vm on vm.id = pv.media_id
         where pv.product_id = $/id/ and pv.is_active = true
         order by pv.sort_order asc`,
        { id: product.id },
      );

      product.images = images || [];
      product.variants = variants || [];

      try {
        const filterMappings = await db.any(
          req,
          `select pfm.filter_id, pfm.filter_value_id,
                  f.name as filter_name, f.code as filter_code,
                  fv.name as value_name, fv.value as value_code
           from product_filter_mappings pfm
           join filters f on f.id = pfm.filter_id
           join filter_values fv on fv.id = pfm.filter_value_id
           where pfm.product_id = $/id/`,
          { id: product.id },
        );
        product.filterMappings = filterMappings || [];
        product.filterValueIds = (filterMappings || []).map((m) => m.filter_value_id);
      } catch {
        product.filterMappings = [];
        product.filterValueIds = [];
      }

      return res.status(200).json({
        success: true,
        data: { product },
      });
    } catch (error) {
      req.log.error('products.getProductBySlug(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get product details.');
    }
  },

  async getOne(req, res) {
    req.params.slug = req.params.urlHandle || req.params.slug || req.params.id;
    return api.getProductBySlug(req, res);
  },

  // ==========================================
  // ADMIN PRODUCTS
  // ==========================================
  async adminGetProducts(req, res) {
    const { page, pageSize, offset } = helpers.extractPagination(req.query);
    const qObj = {
      page,
      pageSize,
      offset,
      limit: pageSize,
      search: req.query.search ? `%${req.query.search}%` : null,
      status: req.query.status || null,
      categoryId: req.query.categoryId || null,
    };

    try {
      const conditions = [];

      if (qObj.search) {
        conditions.push('(p.name ilike $/search/ or p.sku ilike $/search/)');
      }
      if (qObj.status) {
        conditions.push('p.status = $/status/');
      }
      if (qObj.categoryId) {
        conditions.push('p.category_id = $/categoryId/');
      }

      const whereClause = conditions.length > 0 ? `where ${conditions.join(' and ')}` : '';

      const [rows, countResult] = await Promise.all([
        db.any(
          req,
          `select
              p.id, p.name, p.slug, p.sku, p.status, p.is_active, p.is_featured,
              p.selling_price_paisa, p.cost_price_paisa, p.stock_quantity,
              p.created_at, p.updated_at,
              c.name as category_name,
              m.url as primary_image_url
           from products p
           left join categories c on c.id = p.category_id
           left join product_images pi on pi.product_id = p.id and pi.is_primary = true
           left join media m on m.id = pi.media_id
           ${whereClause}
           order by p.created_at desc
           limit $/limit/ offset $/offset/`,
          qObj,
        ),
        db.one(req, `select count(*) as total from products p ${whereClause}`, qObj),
      ]);

      const paginated = helpers.paginatedResponse(rows, parseInt(countResult.total, 10), page, pageSize);
      return res.status(200).json({
        success: true,
        data: {
          ...paginated,
          products: rows,
        },
      });
    } catch (error) {
      req.log.error('products.adminGetProducts(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get products.');
    }
  },

  async adminGetProductById(req, res) {
    const qObj = {
      id: req.params.id,
    };
    try {
      const product = await db.oneOrNone(
        req,
        `select
            p.*,
            c.name as category_name,
            c.slug as category_slug
         from products p
         left join categories c on c.id = p.category_id
         where p.id = $/id/`,
        qObj,
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          msg: MESSAGES.PRODUCT_NOT_FOUND,
          error: { code: ERROR_CODES.NOT_FOUND, message: MESSAGES.PRODUCT_NOT_FOUND },
        });
      }

      // Fetch images
      const images = await db.any(
        req,
        `select pi.id, pi.media_id as "mediaId", m.url, m.alt_text as "altText", pi.is_primary as "isPrimary", pi.sort_order as "sortOrder"
         from product_images pi
         left join media m on m.id = pi.media_id
         where pi.product_id = $/id/
         order by pi.sort_order asc, pi.is_primary desc`,
        qObj,
      );

      // Fetch variants
      const variants = await db.any(
        req,
        `select pv.id, pv.name, pv.sku, pv.attributes, pv.selling_price_paisa as "sellingPricePaisa",
                pv.compare_at_price_paisa as "compareAtPricePaisa", pv.cost_price_paisa as "costPricePaisa",
                pv.stock_quantity as "stockQuantity", pv.is_active as "isActive", pv.sort_order as "sortOrder",
                vm.url as "imageUrl"
         from product_variants pv
         left join media vm on vm.id = pv.media_id
         where pv.product_id = $/id/
         order by pv.sort_order asc`,
        qObj,
      );

      product.images = images || [];
      product.variants = variants || [];

      try {
        const filterMappings = await db.any(
          req,
          `select pfm.filter_id, pfm.filter_value_id,
                  f.name as filter_name, f.code as filter_code,
                  fv.name as value_name, fv.value as value_code
           from product_filter_mappings pfm
           join filters f on f.id = pfm.filter_id
           join filter_values fv on fv.id = pfm.filter_value_id
           where pfm.product_id = $/id/`,
          qObj,
        );
        product.filterMappings = filterMappings || [];
        product.filterValueIds = (filterMappings || []).map((m) => m.filter_value_id);
      } catch {
        product.filterMappings = [];
        product.filterValueIds = [];
      }

      return res.status(200).json({
        success: true,
        data: { product },
      });
    } catch (error) {
      req.log.error('products.adminGetProductById(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get product.');
    }
  },

  async adminCreateProduct(req, res) {
    const qObj = {
      name: req.body?.name?.trim(),
      slug: req.body?.slug?.trim() || (req.body?.name ? helpers.createSlug(req.body.name) : null),
      description: req.body?.description || null,
      shortDescription: req.body?.shortDescription || null,
      sku: req.body?.sku || `SKU-${Date.now()}`,
      categoryId: req.body?.categoryId || null,
      costPricePaisa: req.body?.costPricePaisa || 0,
      sellingPricePaisa: req.body?.sellingPricePaisa || 0,
      compareAtPricePaisa: req.body?.compareAtPricePaisa || null,
      stockQuantity: req.body?.stockQuantity !== undefined ? req.body.stockQuantity : 0,
      status: req.body?.status || 'draft',
      isActive: req.body?.isActive !== undefined ? req.body.isActive : true,
      isFeatured: req.body?.isFeatured || false,
      tags: req.body?.tags || [],
      supplierId: req.body?.supplierId || null,
      images: Array.isArray(req.body?.images) ? req.body.images : [],
      filterValueIds: Array.isArray(req.body?.filterValueIds) ? req.body.filterValueIds : [],
    };

    if (!qObj.name) {
      return res.status(400).json({
        success: false,
        msg: 'Product name is required.',
        error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'Product name is required.' },
      });
    }

    try {
      const product = await db.tx(async (t) => {
        const p = await t.one(
          `insert into products
           (name, slug, description, short_description, sku, category_id,
            cost_price_paisa, selling_price_paisa, compare_at_price_paisa,
            stock_quantity, status, is_active, is_featured, tags, supplier_id)
           values
           ($/name/, $/slug/, $/description/, $/shortDescription/, $/sku/, $/categoryId/,
            $/costPricePaisa/, $/sellingPricePaisa/, $/compareAtPricePaisa/,
            $/stockQuantity/, $/status/, $/isActive/, $/isFeatured/, $/tags/, $/supplierId/)
           returning *`,
          qObj,
        );

        // Images
        if (qObj.images.length > 0) {
          for (let i = 0; i < qObj.images.length; i++) {
            const img = qObj.images[i];
            await t.none(
              `insert into product_images (product_id, media_id, is_primary, sort_order)
               values ($/productId/, $/mediaId/, $/isPrimary/, $/sortOrder/)`,
              {
                productId: p.id,
                mediaId: img.mediaId || img.id,
                isPrimary: img.isPrimary !== undefined ? img.isPrimary : i === 0,
                sortOrder: img.sortOrder || i,
              },
            );
          }
        }

        // Dynamic Filter Mappings
        if (qObj.filterValueIds.length > 0) {
          for (const valId of qObj.filterValueIds) {
            const fVal = await t.oneOrNone('select filter_id from filter_values where id = $/valId/', { valId });
            if (fVal) {
              await t.none(
                `insert into product_filter_mappings (product_id, filter_id, filter_value_id)
                 values ($/productId/, $/filterId/, $/filterValueId/)
                 on conflict (product_id, filter_value_id) do nothing`,
                { productId: p.id, filterId: fVal.filter_id, filterValueId: valId },
              );
            }
          }
        }

        return p;
      });

      req.log.info('adminCreateProduct(): Product created successfully', { id: product.id, name: product.name });
      return res.status(201).json({
        success: true,
        msg: 'Product created successfully',
        data: { product },
      });
    } catch (error) {
      req.log.error('products.adminCreateProduct(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to create product.');
    }
  },

  async adminUpdateProduct(req, res) {
    const qObj = {
      id: req.params.id,
      name: req.body?.name !== undefined ? req.body.name : null,
      description: req.body?.description !== undefined ? req.body.description : null,
      shortDescription: req.body?.shortDescription !== undefined ? req.body.shortDescription : null,
      categoryId: req.body?.categoryId !== undefined ? req.body.categoryId : null,
      sellingPricePaisa: req.body?.sellingPricePaisa !== undefined ? req.body.sellingPricePaisa : null,
      compareAtPricePaisa: req.body?.compareAtPricePaisa !== undefined ? req.body.compareAtPricePaisa : null,
      costPricePaisa: req.body?.costPricePaisa !== undefined ? req.body.costPricePaisa : null,
      stockQuantity: req.body?.stockQuantity !== undefined ? req.body.stockQuantity : null,
      status: req.body?.status !== undefined ? req.body.status : null,
      isActive: req.body?.isActive !== undefined ? req.body.isActive : null,
      isFeatured: req.body?.isFeatured !== undefined ? req.body.isFeatured : null,
      filterValueIds: Array.isArray(req.body?.filterValueIds) ? req.body.filterValueIds : null,
    };

    try {
      const updated = await db.tx(async (t) => {
        const prod = await t.one(
          `update products set
             name = coalesce($/name/, name),
             description = coalesce($/description/, description),
             short_description = coalesce($/shortDescription/, short_description),
             category_id = coalesce($/categoryId/, category_id),
             selling_price_paisa = coalesce($/sellingPricePaisa/, selling_price_paisa),
             compare_at_price_paisa = coalesce($/compareAtPricePaisa/, compare_at_price_paisa),
             cost_price_paisa = coalesce($/costPricePaisa/, cost_price_paisa),
             stock_quantity = coalesce($/stockQuantity/, stock_quantity),
             status = coalesce($/status/, status),
             is_active = coalesce($/isActive/, is_active),
             is_featured = coalesce($/isFeatured/, is_featured),
             updated_at = now()
           where id = $/id/
           returning *`,
          qObj,
        );

        // Dynamic Filter Mappings update
        if (qObj.filterValueIds) {
          await t.none('delete from product_filter_mappings where product_id = $/productId/', { productId: qObj.id });
          for (const valId of qObj.filterValueIds) {
            const fVal = await t.oneOrNone('select filter_id from filter_values where id = $/valId/', { valId });
            if (fVal) {
              await t.none(
                `insert into product_filter_mappings (product_id, filter_id, filter_value_id)
                 values ($/productId/, $/filterId/, $/filterValueId/)
                 on conflict (product_id, filter_value_id) do nothing`,
                { productId: qObj.id, filterId: fVal.filter_id, filterValueId: valId },
              );
            }
          }
        }

        return prod;
      });

      req.log.info('adminUpdateProduct(): Product updated successfully', { id: updated.id });
      return res.status(200).json({
        success: true,
        msg: 'Product updated successfully',
        data: { product: updated },
      });
    } catch (error) {
      req.log.error('products.adminUpdateProduct(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to update product.');
    }
  },

  async adminDeleteProduct(req, res) {
    const qObj = {
      id: req.params.id,
    };
    try {
      await db.none(
        req,
        `update products set is_active = false, status = 'archived', updated_at = now() where id = $/id/`,
        qObj,
      );
      req.log.info('adminDeleteProduct(): Product archived', { id: qObj.id });
      return res.status(200).json({
        success: true,
        msg: 'Product archived successfully',
        data: { message: 'Product archived successfully' },
      });
    } catch (error) {
      req.log.error('products.adminDeleteProduct(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to delete product.');
    }
  },

  // ==========================================
  // DYNAMIC FILTERS & VALUES MANAGEMENT (ADMIN)
  // ==========================================
  async adminGetFilters(req, res) {
    const qObj = {};
    try {
      const [filterRows, valueRows] = await Promise.all([
        db.any(req, `select * from filters order by sort_order asc, name asc`, qObj),
        db.any(req, `select * from filter_values order by sort_order asc, name asc`, qObj),
      ]);

      const filters = (filterRows || []).map((f) => ({
        ...f,
        values: (valueRows || []).filter((v) => v.filter_id === f.id),
      }));

      return res.status(200).json({
        success: true,
        data: { filters },
      });
    } catch (error) {
      req.log.error('products.adminGetFilters(): Unexpected error', { error });
      return helpers.psqlError(error, req, res, 'Unable to get filters.');
    }
  },

  async adminCreateFilter(req, res) {
    const qObj = {
      name: req.body?.name?.trim(),
      code: req.body?.code?.trim() || (req.body?.name ? helpers.createSlug(req.body.name) : null),
      sortOrder: req.body?.sortOrder || 0,
      isActive: req.body?.isActive !== undefined ? req.body.isActive : true,
    };

    if (!qObj.name) {
      return res.status(400).json({
        success: false,
        msg: 'Filter name is required.',
        error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'Filter name is required.' },
      });
    }

    try {
      const row = await db.one(
        req,
        `insert into filters (name, code, sort_order, is_active)
         values ($/name/, $/code/, $/sortOrder/, $/isActive/)
         returning *`,
        qObj,
      );
      req.log.info('adminCreateFilter(): Filter created', { id: row.id, name: row.name });
      return res.status(201).json({
        success: true,
        msg: 'Filter created successfully',
        data: { filter: row },
      });
    } catch (error) {
      req.log.error('products.adminCreateFilter(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to create filter.');
    }
  },

  async adminUpdateFilter(req, res) {
    const qObj = {
      id: req.params.id,
      name: req.body?.name !== undefined ? req.body.name : null,
      code: req.body?.code !== undefined ? req.body.code : null,
      sortOrder: req.body?.sortOrder !== undefined ? req.body.sortOrder : null,
      isActive: req.body?.isActive !== undefined ? req.body.isActive : null,
    };

    try {
      const updated = await db.one(
        req,
        `update filters set
           name = coalesce($/name/, name),
           code = coalesce($/code/, code),
           sort_order = coalesce($/sortOrder/, sort_order),
           is_active = coalesce($/isActive/, is_active),
           updated_at = now()
         where id = $/id/
         returning *`,
        qObj,
      );
      req.log.info('adminUpdateFilter(): Filter updated', { id: updated.id });
      return res.status(200).json({
        success: true,
        msg: 'Filter updated successfully',
        data: { filter: updated },
      });
    } catch (error) {
      req.log.error('products.adminUpdateFilter(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to update filter.');
    }
  },

  async adminDeleteFilter(req, res) {
    const qObj = {
      id: req.params.id,
    };
    try {
      await db.none(req, 'delete from filters where id = $/id/', qObj);
      req.log.info('adminDeleteFilter(): Filter deleted', { id: qObj.id });
      return res.status(200).json({
        success: true,
        msg: 'Filter deleted successfully',
        data: { message: 'Filter deleted successfully' },
      });
    } catch (error) {
      req.log.error('products.adminDeleteFilter(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to delete filter.');
    }
  },

  async adminCreateFilterValue(req, res) {
    const qObj = {
      filterId: req.params.id,
      name: req.body?.name?.trim(),
      value: req.body?.value?.trim() || (req.body?.name ? helpers.createSlug(req.body.name) : null),
      sortOrder: req.body?.sortOrder || 0,
      isActive: req.body?.isActive !== undefined ? req.body.isActive : true,
    };

    if (!qObj.name) {
      return res.status(400).json({
        success: false,
        msg: 'Filter value name is required.',
        error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'Filter value name is required.' },
      });
    }

    try {
      const row = await db.one(
        req,
        `insert into filter_values (filter_id, name, value, sort_order, is_active)
         values ($/filterId/, $/name/, $/value/, $/sortOrder/, $/isActive/)
         returning *`,
        qObj,
      );
      req.log.info('adminCreateFilterValue(): Filter value created', { id: row.id, name: row.name });
      return res.status(201).json({
        success: true,
        msg: 'Filter value created successfully',
        data: { filterValue: row },
      });
    } catch (error) {
      req.log.error('products.adminCreateFilterValue(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to create filter value.');
    }
  },

  async adminDeleteFilterValue(req, res) {
    const qObj = {
      valueId: req.params.valueId,
    };
    try {
      await db.none(req, 'delete from filter_values where id = $/valueId/', qObj);
      req.log.info('adminDeleteFilterValue(): Filter value deleted', { valueId: qObj.valueId });
      return res.status(200).json({
        success: true,
        msg: 'Filter value deleted successfully',
        data: { message: 'Filter value deleted successfully' },
      });
    } catch (error) {
      req.log.error('products.adminDeleteFilterValue(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to delete filter value.');
    }
  },

  // ==========================================
  // DYNAMIC SORT OPTIONS MANAGEMENT (ADMIN)
  // ==========================================
  async adminGetSortOptions(req, res) {
    const qObj = {};
    try {
      const rows = await db.any(req, `select * from product_sort_options order by sort_order asc`, qObj);
      return res.status(200).json({
        success: true,
        data: { sortOptions: rows },
      });
    } catch (error) {
      req.log.error('products.adminGetSortOptions(): Unexpected error', { error });
      return helpers.psqlError(error, req, res, 'Unable to get sort options.');
    }
  },

  async adminCreateSortOption(req, res) {
    const qObj = {
      name: req.body?.name?.trim(),
      code: req.body?.code?.trim() || (req.body?.name ? helpers.createSlug(req.body.name) : null),
      field: req.body?.field || 'created_at',
      direction: req.body?.direction || 'desc',
      sortOrder: req.body?.sortOrder || 0,
      isActive: req.body?.isActive !== undefined ? req.body.isActive : true,
    };

    if (!qObj.name) {
      return res.status(400).json({
        success: false,
        msg: 'Sort option name is required.',
        error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'Sort option name is required.' },
      });
    }

    try {
      const row = await db.one(
        req,
        `insert into product_sort_options (name, code, field, direction, sort_order, is_active)
         values ($/name/, $/code/, $/field/, $/direction/, $/sortOrder/, $/isActive/)
         returning *`,
        qObj,
      );
      req.log.info('adminCreateSortOption(): Sort option created', { id: row.id, name: row.name });
      return res.status(201).json({
        success: true,
        msg: 'Sort option created successfully',
        data: { sortOption: row },
      });
    } catch (error) {
      req.log.error('products.adminCreateSortOption(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to create sort option.');
    }
  },

  async adminUpdateSortOption(req, res) {
    const qObj = {
      id: req.params.id,
      name: req.body?.name !== undefined ? req.body.name : null,
      code: req.body?.code !== undefined ? req.body.code : null,
      field: req.body?.field !== undefined ? req.body.field : null,
      direction: req.body?.direction !== undefined ? req.body.direction : null,
      sortOrder: req.body?.sortOrder !== undefined ? req.body.sortOrder : null,
      isActive: req.body?.isActive !== undefined ? req.body.isActive : null,
    };

    try {
      const updated = await db.one(
        req,
        `update product_sort_options set
           name = coalesce($/name/, name),
           code = coalesce($/code/, code),
           field = coalesce($/field/, field),
           direction = coalesce($/direction/, direction),
           sort_order = coalesce($/sortOrder/, sort_order),
           is_active = coalesce($/isActive/, is_active),
           updated_at = now()
         where id = $/id/
         returning *`,
        qObj,
      );
      req.log.info('adminUpdateSortOption(): Sort option updated', { id: updated.id });
      return res.status(200).json({
        success: true,
        msg: 'Sort option updated successfully',
        data: { sortOption: updated },
      });
    } catch (error) {
      req.log.error('products.adminUpdateSortOption(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to update sort option.');
    }
  },

  async adminDeleteSortOption(req, res) {
    const qObj = {
      id: req.params.id,
    };
    try {
      await db.none(req, 'delete from product_sort_options where id = $/id/', qObj);
      req.log.info('adminDeleteSortOption(): Sort option deleted', { id: qObj.id });
      return res.status(200).json({
        success: true,
        msg: 'Sort option deleted successfully',
        data: { message: 'Sort option deleted successfully' },
      });
    } catch (error) {
      req.log.error('products.adminDeleteSortOption(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to delete sort option.');
    }
  },
};

module.exports = api;
