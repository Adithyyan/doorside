const helpers = require('../helpers.js');
const db = require('../db.js');

const api = {
  async adminGetCoupons(req, res) {
    const qObj = {};
    try {
      const coupons = await db.any(req, 'select * from coupons order by created_at desc', qObj);
      return res.status(200).json({ success: true, data: { coupons } });
    } catch (error) {
      req.log.error('coupons.adminGetCoupons(): Unexpected error', { error });
      return helpers.psqlError(error, req, res, 'Unable to get coupons.');
    }
  },

  async adminCreateCoupon(req, res) {
    const qObj = {
      code: req.body?.code ? req.body.code.trim().toUpperCase() : null,
      description: req.body?.description || null,
      couponType: req.body?.couponType || 'percentage',
      discountAmountPaisa: req.body?.discountAmountPaisa !== undefined ? Number(req.body.discountAmountPaisa) : null,
      discountPercentage: req.body?.discountPercentage !== undefined ? Number(req.body.discountPercentage) : null,
      maxDiscountPaisa: req.body?.maxDiscountPaisa !== undefined ? Number(req.body.maxDiscountPaisa) : null,
      minimumOrderPaisa: req.body?.minimumOrderPaisa !== undefined ? Number(req.body.minimumOrderPaisa) : 0,
      usageLimit: req.body?.usageLimit !== undefined ? Number(req.body.usageLimit) : null,
      perCustomerUsageLimit: req.body?.perCustomerUsageLimit !== undefined ? Number(req.body.perCustomerUsageLimit) : null,
      startsAt: req.body?.startsAt || null,
      expiresAt: req.body?.expiresAt || null,
      isActive: req.body?.isActive !== undefined ? req.body.isActive : true,
    };

    if (!qObj.code) {
      return res.status(400).json({ success: false, msg: 'Coupon code is required.' });
    }

    try {
      const coupon = await db.one(
        req,
        `insert into coupons
         (code, description, coupon_type, discount_amount_paisa, discount_percentage, max_discount_paisa,
          minimum_order_paisa, usage_limit, per_customer_usage_limit, starts_at, expires_at, is_active)
         values
         ($/code/, $/description/, $/couponType/, $/discountAmountPaisa/, $/discountPercentage/,
          $/maxDiscountPaisa/, $/minimumOrderPaisa/, $/usageLimit/, $/perCustomerUsageLimit/, $/startsAt/, $/expiresAt/, $/isActive/)
         returning *`,
        qObj,
      );

      req.log.info('coupons.adminCreateCoupon(): Coupon created', { code: coupon.code, id: coupon.id });
      return res.status(201).json({ success: true, msg: 'Coupon created successfully', data: { coupon } });
    } catch (error) {
      req.log.error('coupons.adminCreateCoupon(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to create coupon.');
    }
  },

  async adminUpdateCoupon(req, res) {
    const qObj = {
      id: req.params?.id,
      description: req.body?.description !== undefined ? req.body.description : null,
      couponType: req.body?.couponType || null,
      discountAmountPaisa: req.body?.discountAmountPaisa !== undefined ? req.body.discountAmountPaisa : null,
      discountPercentage: req.body?.discountPercentage !== undefined ? req.body.discountPercentage : null,
      maxDiscountPaisa: req.body?.maxDiscountPaisa !== undefined ? req.body.maxDiscountPaisa : null,
      minimumOrderPaisa: req.body?.minimumOrderPaisa !== undefined ? req.body.minimumOrderPaisa : null,
      usageLimit: req.body?.usageLimit !== undefined ? req.body.usageLimit : null,
      perCustomerUsageLimit: req.body?.perCustomerUsageLimit !== undefined ? req.body.perCustomerUsageLimit : null,
      startsAt: req.body?.startsAt !== undefined ? req.body.startsAt : null,
      expiresAt: req.body?.expiresAt !== undefined ? req.body.expiresAt : null,
      isActive: req.body?.isActive !== undefined ? req.body.isActive : null,
    };

    try {
      const updated = await db.one(
        req,
        `update coupons set
           description = coalesce($/description/, description),
           coupon_type = coalesce($/couponType/, coupon_type),
           discount_amount_paisa = coalesce($/discountAmountPaisa/, discount_amount_paisa),
           discount_percentage = coalesce($/discountPercentage/, discount_percentage),
           max_discount_paisa = coalesce($/maxDiscountPaisa/, max_discount_paisa),
           minimum_order_paisa = coalesce($/minimumOrderPaisa/, minimum_order_paisa),
           usage_limit = coalesce($/usageLimit/, usage_limit),
           per_customer_usage_limit = coalesce($/perCustomerUsageLimit/, per_customer_usage_limit),
           starts_at = coalesce($/startsAt/, starts_at),
           expires_at = coalesce($/expiresAt/, expires_at),
           is_active = coalesce($/isActive/, is_active),
           updated_at = now()
         where id = $/id/
         returning *`,
        qObj,
      );

      req.log.info('coupons.adminUpdateCoupon(): Coupon updated', { id: qObj.id });
      return res.status(200).json({ success: true, msg: 'Coupon updated successfully', data: { coupon: updated } });
    } catch (error) {
      req.log.error('coupons.adminUpdateCoupon(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to update coupon.');
    }
  },

  async adminDeleteCoupon(req, res) {
    const qObj = {
      id: req.params?.id,
    };

    try {
      await db.none(req, 'update coupons set is_active = false, updated_at = now() where id = $/id/', qObj);
      req.log.info('coupons.adminDeleteCoupon(): Coupon deactivated', qObj);
      return res.status(200).json({ success: true, msg: 'Coupon deactivated successfully' });
    } catch (error) {
      req.log.error('coupons.adminDeleteCoupon(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to deactivate coupon.');
    }
  },
};

module.exports = api;
