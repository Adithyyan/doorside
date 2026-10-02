const crypto = require('crypto');
const helpers = require('../../helpers');
const config = require('../../env');

describe('Payment Provider & Signature Verification Unit Tests', () => {
  const orderId = 'order_test_12345';
  const paymentId = 'pay_test_67890';
  const keySecret = config.razorpay?.keySecret || 'test_secret';
  config.razorpay = config.razorpay || {};
  config.razorpay.keySecret = keySecret;
  config.razorpay.webhookSecret = 'test_webhook_secret_key_123';

  it('should verify a valid HMAC SHA256 payment signature', () => {
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isValid = helpers.verifyPaymentSignature({
      gatewayOrderId: orderId,
      gatewayPaymentId: paymentId,
      signature: expectedSignature,
    });

    expect(isValid).toBe(true);
  });

  it('should reject an invalid or tampered signature', () => {
    const isInvalid = helpers.verifyPaymentSignature({
      gatewayOrderId: orderId,
      gatewayPaymentId: paymentId,
      signature: 'tampered_invalid_signature_hex_value',
    });

    expect(isInvalid).toBe(false);
  });

  it('should verify webhook signature correctly', () => {
    const payload = JSON.stringify({ event: 'payment.captured', entity: { id: paymentId } });
    const signature = crypto
      .createHmac('sha256', config.razorpay.webhookSecret)
      .update(payload)
      .digest('hex');

    const isValid = helpers.verifyWebhookSignature(payload, signature);
    expect(isValid).toBe(true);
  });
});
