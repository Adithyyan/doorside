const express = require('express');
const router = express.Router();
const helpers = require('../helpers.js');
const db = require('../db.js');

router.get('/', async (req, res) => {
  const query = req.query.q || '';
  if (!query || query.length < 2) {
    return res.status(200).json({
      success: true,
      data: { products: [], categories: [], total: 0 },
    });
  }

  const { page, pageSize, offset } = helpers.extractPagination(req.query, 10);
  const qObj = {
    search: `%${query}%`,
    limit: pageSize,
    offset,
    query,
  };

  try {
    const [products, countResult, categories] = await Promise.all([
      db.any(
        req,
        `select p.id, p.name, p.slug, p.short_description, p.selling_price_paisa, p.compare_at_price_paisa,
                m.url as primary_image_url
         from products p
         left join product_images pi on pi.product_id = p.id and pi.is_primary = true
         left join media m on m.id = pi.media_id
         where p.is_active = true and p.status = 'active'
           and (p.name ilike $/search/ or p.description ilike $/search/)
         order by p.created_at desc
         limit $/limit/ offset $/offset/`,
        qObj,
      ),
      db.one(
        req,
        `select count(*) as total from products where is_active = true and status = 'active' and (name ilike $/search/ or description ilike $/search/)`,
        qObj,
      ),
      db.any(
        req,
        `select c.id, c.name, c.slug, m.url as image_url
         from categories c
         left join media m on m.id = c.image_id
         where c.is_active = true and (c.name ilike $/search/ or c.description ilike $/search/)
         limit 5`,
        qObj,
      ),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        query: qObj.query,
        products,
        categories,
        total: parseInt(countResult.total, 10),
      },
    });
  } catch (error) {
    req.log?.error?.('search route error:', { error, ...qObj });
    return helpers.psqlError(error, req, res, 'Error performing search.');
  }
});

module.exports = router;
