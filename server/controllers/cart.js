const helpers = require('../helpers.js');
const { MESSAGES } = require('../strings.js');

const api = {
  async calculate(req, res) {
    const qObj = {
      items: req.body?.items,
      couponCode: req.body?.couponCode || null,
      customerId: req.user?.id || null,
    };

    if (!qObj.items || !Array.isArray(qObj.items) || qObj.items.length === 0) {
      req.log.warn('cart.calculate(): Validation failed - cart is empty');
      return res.status(400).json({ success: false, msg: MESSAGES.CART_EMPTY });
    }

    try {
      const calculation = await helpers.calculateCartTotals(qObj.items, qObj.couponCode, qObj.customerId);
      req.log.info('cart.calculate(): Totals calculated successfully', {
        itemCount: qObj.items.length,
        subtotalPaisa: calculation.subtotalPaisa,
        totalPaisa: calculation.totalPaisa,
      });

      return res.status(200).json({
        success: true,
        data: { cart: calculation },
      });
    } catch (error) {
      req.log.error('cart.calculate(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Error calculating cart totals.');
    }
  },

  async validateCoupon(req, res) {
    const qObj = {
      code: req.body?.code?.trim(),
      subtotalPaisa: Number(req.body?.subtotalPaisa) || 0,
      customerId: req.user?.id || null,
    };

    if (!qObj.code) {
      req.log.warn('cart.validateCoupon(): Missing coupon code');
      return res.status(400).json({ success: false, msg: 'Coupon code is required.' });
    }

    try {
      const coupon = await helpers.validateAndCalculateCoupon(qObj.code, qObj.subtotalPaisa, qObj.customerId);
      req.log.info('cart.validateCoupon(): Coupon valid', { code: qObj.code, discount: coupon.discountPaisa });

      return res.status(200).json({
        success: true,
        msg: 'Coupon applied successfully',
        data: { coupon },
      });
    } catch (error) {
      req.log.warn('cart.validateCoupon(): Coupon invalid', { code: qObj.code, error: error.message });
      return res.status(400).json({
        success: false,
        msg: error.message || 'Invalid coupon code',
        error: { code: 'INVALID_COUPON', message: error.message },
      });
    }
  },

  async getShippingSettings(req, res) {
    const qObj = {};
    try {
      const settings = await helpers.getShippingSettings();
      return res.status(200).json({
        success: true,
        data: { shipping: settings },
      });
    } catch (error) {
      req.log.error('cart.getShippingSettings(): Unexpected error', { error });
      return helpers.psqlError(error, req, res, 'Unable to get shipping settings.');
    }
  },
};

module.exports = api;
