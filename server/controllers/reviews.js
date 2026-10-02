const helpers = require('../helpers.js');
const db = require('../db.js');
const { MESSAGES } = require('../strings.js');

const api = {
  async getReviews(req, res) {
    const { page, pageSize, offset } = helpers.extractPagination(req.query);
    const qObj = {
      productId: req.query?.productId || null,
      limit: pageSize,
      offset,
    };

    try {
      const [rows, countResult] = await Promise.all([
        db.any(
          req,
          `select r.id, r.product_id, r.rating, r.title, r.message,
                  r.is_verified_purchase, r.admin_reply, r.created_at,
                  coalesce(u.name, 'User') as customer_name,
                  coalesce(u.name, 'User') as user_name
           from reviews r
           left join users u on u.id = r.user_id
           where r.status = 'approved'
             and ($/productId/ is null or r.product_id = $/productId/)
           order by r.created_at desc
           limit $/limit/ offset $/offset/`,
          qObj,
        ),
        db.one(
          req,
          `select count(*) as total
           from reviews
           where status = 'approved'
             and ($/productId/ is null or product_id = $/productId/)`,
          qObj,
        ),
      ]);

      return res.status(200).json({
        success: true,
        data: helpers.paginatedResponse(rows, parseInt(countResult.total, 10), page, pageSize),
      });
    } catch (error) {
      req.log.error('reviews.getReviews(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get reviews.');
    }
  },

  async submitReview(req, res) {
    const qObj = {
      productId: req.body?.productId,
      userId: req.user?.id || null,
      rating: Number(req.body?.rating),
      title: req.body?.title || null,
      message: req.body?.message || null,
    };

    if (!qObj.productId || !qObj.rating || qObj.rating < 1 || qObj.rating > 5) {
      req.log.warn('reviews.submitReview(): Validation failed', qObj);
      return res.status(400).json({ success: false, msg: 'Product ID and a valid rating (1-5) are required' });
    }

    try {
      const review = await db.one(
        req,
        `insert into reviews (product_id, user_id, rating, title, message, status)
         values ($/productId/, $/userId/, $/rating/, $/title/, $/message/, 'pending')
         returning id, product_id, rating, title, message, status, created_at`,
        qObj,
      );

      req.log.info('reviews.submitReview(): Review submitted', { reviewId: review.id, productId: qObj.productId });
      return res.status(201).json({
        success: true,
        msg: MESSAGES.REVIEW_SUBMITTED,
        data: {
          review,
          message: MESSAGES.REVIEW_SUBMITTED,
        },
      });
    } catch (error) {
      req.log.error('reviews.submitReview(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to submit review.');
    }
  },

  async adminGetReviews(req, res) {
    const { page, pageSize, offset } = helpers.extractPagination(req.query);
    const qObj = {
      status: req.query?.status || null,
      limit: pageSize,
      offset,
    };

    try {
      const conditions = [];
      if (qObj.status) {
        conditions.push('r.status = $/status/');
      }
      const whereClause = conditions.length > 0 ? `where ${conditions.join(' and ')}` : '';

      const [rows, countResult] = await Promise.all([
        db.any(
          req,
          `select r.*, p.name as product_name, coalesce(u.name, 'User') as customer_name, coalesce(u.name, 'User') as user_name
           from reviews r
           left join products p on p.id = r.product_id
           left join users u on u.id = r.user_id
           ${whereClause}
           order by r.created_at desc
           limit $/limit/ offset $/offset/`,
          qObj,
        ),
        db.one(req, `select count(*) as total from reviews r ${whereClause}`, qObj),
      ]);

      return res.status(200).json({
        success: true,
        data: helpers.paginatedResponse(rows, parseInt(countResult.total, 10), page, pageSize),
      });
    } catch (error) {
      req.log.error('reviews.adminGetReviews(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get admin reviews.');
    }
  },

  async adminUpdateReviewStatus(req, res) {
    const qObj = {
      id: req.params?.id,
      status: req.body?.status,
    };

    if (!qObj.status) {
      return res.status(400).json({ success: false, msg: 'Status is required' });
    }

    try {
      const updated = await db.one(
        req,
        'update reviews set status = $/status/, updated_at = now() where id = $/id/ returning *',
        qObj,
      );
      req.log.info('reviews.adminUpdateReviewStatus(): Review status updated', qObj);
      return res.status(200).json({ success: true, msg: 'Review status updated', data: { review: updated } });
    } catch (error) {
      req.log.error('reviews.adminUpdateReviewStatus(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to update review status.');
    }
  },

  async adminReplyReview(req, res) {
    const qObj = {
      id: req.params?.id,
      adminReply: req.body?.adminReply || '',
    };

    try {
      const updated = await db.one(
        req,
        'update reviews set admin_reply = $/adminReply/, updated_at = now() where id = $/id/ returning *',
        qObj,
      );
      req.log.info('reviews.adminReplyReview(): Admin reply saved', { reviewId: qObj.id });
      return res.status(200).json({ success: true, msg: 'Reply saved', data: { review: updated } });
    } catch (error) {
      req.log.error('reviews.adminReplyReview(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to save review reply.');
    }
  },
};

module.exports = api;
