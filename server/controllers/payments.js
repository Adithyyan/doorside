const helpers = require('../helpers.js');
const db = require('../db.js');
const { MESSAGES } = require('../strings.js');

const api = {
  async verifyPayment(req, res) {
    const qObj = {
      gatewayOrderId: req.body?.gatewayOrderId,
      gatewayPaymentId: req.body?.gatewayPaymentId,
      signature: req.body?.signature,
    };

    if (!qObj.gatewayOrderId || !qObj.gatewayPaymentId || !qObj.signature) {
      req.log.warn('payments.verifyPayment(): Missing required payment verification parameters');
      return res.status(400).json({ success: false, msg: 'Payment verification details missing' });
    }

    try {
      // 1. Signature check
      const isValid = helpers.verifyPaymentSignature(qObj);
      if (!isValid) {
        req.log.warn('payments.verifyPayment(): Invalid signature', { gatewayOrderId: qObj.gatewayOrderId });
        return res.status(400).json({ success: false, msg: MESSAGES.PAYMENT_FAILED });
      }

      // 2. Update order and payment record in a transaction
      const result = await db.tx(async (t) => {
        const order = await t.oneOrNone(
          'select id, order_number from orders where gateway_order_id = $/gatewayOrderId/',
          qObj,
        );

        if (!order) {
          throw new Error('Order not found for gateway order ID');
        }

        qObj.orderId = order.id;

        await t.none(
          `update orders set
             payment_status = 'paid',
             order_status = 'confirmed',
             updated_at = now()
           where id = $/orderId/`,
          qObj,
        );

        await t.none(
          `insert into payments (order_id, payment_method, gateway, gateway_order_id, gateway_payment_id, gateway_signature, is_verified, status)
           values ($/orderId/, 'razorpay', 'razorpay', $/gatewayOrderId/, $/gatewayPaymentId/, $/signature/, true, 'captured')
           on conflict (gateway_order_id) do update set
             gateway_payment_id = $/gatewayPaymentId/,
             gateway_signature = $/signature/,
             is_verified = true,
             status = 'captured',
             updated_at = now()`,
          qObj,
        );

        await t.none(
          `insert into order_status_history (order_id, status_type, new_status, source, note)
           values ($/orderId/, 'payment_status', 'paid', 'payment_webhook', 'Payment verified online')`,
          qObj,
        );

        return order;
      });

      req.log.info('payments.verifyPayment(): Payment verified successfully', {
        orderId: result.id,
        orderNumber: result.order_number,
      });

      return res.status(200).json({
        success: true,
        msg: MESSAGES.PAYMENT_VERIFIED_SUCCESS,
        data: {
          verified: true,
          orderId: result.id,
          orderNumber: result.order_number,
          message: MESSAGES.PAYMENT_VERIFIED_SUCCESS,
        },
      });
    } catch (error) {
      req.log.error('payments.verifyPayment(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Payment verification failed.');
    }
  },

  async handleWebhook(req, res) {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.body;
    const qObj = { signature };

    try {
      let payload;
      try {
        payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : (rawBody instanceof Buffer ? JSON.parse(rawBody.toString()) : rawBody);
      } catch {
        return res.status(400).json({ success: false, msg: 'Invalid payload' });
      }

      const isValid = helpers.verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        req.log.warn('payments.handleWebhook(): Invalid webhook signature');
        return res.status(400).json({ success: false, msg: 'Invalid webhook signature' });
      }

      const eventType = payload.event;
      if (eventType === 'payment.captured') {
        const entity = payload.payload?.payment?.entity;
        const gatewayOrderId = entity?.order_id;
        if (gatewayOrderId) {
          qObj.gatewayOrderId = gatewayOrderId;
          await db.none(
            req,
            `update orders set payment_status = 'paid', order_status = 'confirmed', updated_at = now()
             where gateway_order_id = $/gatewayOrderId/`,
            qObj,
          );
        }
      }

      req.log.info('payments.handleWebhook(): Webhook processed', { event: eventType });
      return res.status(200).json({ success: true, received: true });
    } catch (error) {
      req.log.error('payments.handleWebhook(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Webhook processing failed.');
    }
  },
};

module.exports = api;
