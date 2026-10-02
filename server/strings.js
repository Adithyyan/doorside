const MESSAGES = {
  ORDER_PLACED_SUCCESS: 'Order placed successfully',
  ORDER_NOT_FOUND: 'Order not found',
  ORDER_CANCELLED_SUCCESS: 'Order cancelled successfully',
  PRODUCT_NOT_FOUND: 'Product not found',
  CATEGORY_NOT_FOUND: 'Category not found',
  CART_EMPTY: 'Cart must contain at least one item',
  PAYMENT_VERIFIED_SUCCESS: 'Payment verified successfully',
  PAYMENT_FAILED: 'Payment verification failed',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REGISTER_SUCCESS: 'Registered successfully',
  SESSION_EXPIRED: 'Session expired, please log in again',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access denied',
  PRODUCT_OUT_OF_STOCK: 'is out of stock',
  ERROR_CHECKING_STOCK: 'Error checking product stock',
  ERROR_PLACING_ORDER: 'Error placing order',
  COUPON_INVALID: 'Invalid coupon code',
  COUPON_EXPIRED: 'Coupon has expired',
  COUPON_LIMIT_REACHED: 'Coupon usage limit reached',
  REVIEW_SUBMITTED: 'Review submitted successfully and is pending approval',
  ADDRESS_DELETED: 'Address deleted successfully',
};

const OTP_MESSAGES = {
  SESSION_EXPIRED: 'Session expired. Please request a new code.',
  INCORRECT_CODE: 'Incorrect verification code. Please try again.',
  EMAIL_OR_MOBILE_REQUIRED: 'Email or mobile number is required.',
  OTP_SENT_SUCCESS: 'Verification code sent successfully.',
};

module.exports = {
  MESSAGES,
  OTP_MESSAGES,
};
