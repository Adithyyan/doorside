const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const slugify = require('slugify');
const dayjs = require('dayjs');
const config = require('./env.js');
const db = require('./db.js');
const logger = require('./logger.js');
const { MESSAGES, OTP_MESSAGES } = require('./strings.js');
const {
  HTTP_STATUS,
  ERROR_CODES,
  ROLE_PERMISSIONS,
  ADMIN_ROLES,
  ORDER_STATUS,
} = require('./constants.js');
const { DATE_TIME_FORMATS } = require('./date-time-formats.js');

const SECRET_TOKEN = config.tokenSecret || config.jwt.accessSecret;
const SALT_ROUNDS = 12;
const REFRESH_TOKEN_BYTES = 40;

const helpers = {
  userVersions: {},

  // ==========================================
  // TOKEN & AUTHENTICATION
  // ==========================================
  getToken(req) {
    const authorization = req.headers['authorization'];
    if (authorization) {
      const parts = authorization.split(' ');
      if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
        return parts[1];
      }
      return parts[1] || parts[0];
    }
    return req.cookies?.token || req.query?.token || req.body?.token;
  },

  async decodeToken(req) {
    try {
      const token = helpers.getToken(req);
      if (!token) {
        return false;
      }

      const decoded = jwt.verify(token, SECRET_TOKEN);
      req.userId = decoded.id;
      req.email = decoded.email;
      req.name = decoded.name;
      req.role = decoded.role;
      req.isAdmin = !!decoded.isAdmin;
      req.user = decoded;
      req.dt = decoded;

      return decoded;
    } catch (error) {
      logger.debug('decodeToken error:', error.message);
      return false;
    }
  },

  async checkLogin(req, res, next) {
    try {
      const decoded = await helpers.decodeToken(req);
      if (!decoded) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: { code: ERROR_CODES.UNAUTHORIZED, message: MESSAGES.SESSION_EXPIRED },
        });
      }
      return next();
    } catch (error) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: { code: ERROR_CODES.UNAUTHORIZED, message: MESSAGES.SESSION_EXPIRED },
      });
    }
  },

  // Alias for compatibility with requested route format
  async checkLoginForXspan(req, res, next) {
    return helpers.checkLogin(req, res, next);
  },

  async optionalLogin(req, res, next) {
    try {
      await helpers.decodeToken(req);
    } catch {
      // Ignore token failure for optional endpoints
    }
    return next();
  },

  async checkAdmin(req, res, next) {
    try {
      const decoded = await helpers.decodeToken(req);
      if (!decoded) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: { code: ERROR_CODES.UNAUTHORIZED, message: MESSAGES.SESSION_EXPIRED },
        });
      }

      if (!decoded.isAdmin) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          error: { code: ERROR_CODES.FORBIDDEN, message: MESSAGES.FORBIDDEN },
        });
      }

      return next();
    } catch (error) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: { code: ERROR_CODES.UNAUTHORIZED, message: MESSAGES.UNAUTHORIZED },
      });
    }
  },

  requirePermission(permission) {
    return (req, res, next) => {
      if (!req.user || !req.user.isAdmin) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          error: { code: ERROR_CODES.FORBIDDEN, message: 'Forbidden' },
        });
      }

      const permissions = req.user.permissions || ROLE_PERMISSIONS[req.user.role] || [];
      if (req.user.role === ADMIN_ROLES.SUPER_ADMIN || permissions.includes(permission)) {
        return next();
      }

      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: `Permission denied: ${permission} required`,
        },
      });
    };
  },

  async hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  },

  generateAccessToken(customer) {
    return jwt.sign(
      {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        isAdmin: false,
      },
      SECRET_TOKEN,
      { expiresIn: config.jwt.accessExpiresIn || '15m' },
    );
  },

  generateAdminAccessToken(adminUser) {
    return jwt.sign(
      {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role_name || adminUser.role,
        permissions: ROLE_PERMISSIONS[adminUser.role_name || adminUser.role] || [],
        isAdmin: true,
      },
      SECRET_TOKEN,
      { expiresIn: config.jwt.accessExpiresIn || '15m' },
    );
  },

  generateRefreshToken() {
    return crypto.randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
  },

  hashRefreshToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  },

  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  },

  // ==========================================
  // RESPONSES & FORMATTERS
  // ==========================================
  sendSuccess(res, data, statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  },

  sendCreated(res, data) {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data,
    });
  },

  sendError(res, code, message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    const payload = {
      success: false,
      msg: message,
      error: {
        code,
        message,
      },
    };
    if (errors) {
      payload.error.errors = errors;
    }
    return res.status(statusCode).json(payload);
  },

  psqlError(error, req, res, defaultMsg = 'An unexpected database error occurred.') {
    req.log?.error?.('Database/PSQL Error:', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      hint: error?.hint,
      table: error?.table,
    });

    const isDuplicate = error?.code === '23505';
    const isForeignKey = error?.code === '23503';
    let msg = defaultMsg;
    let statusCode = 500;

    if (isDuplicate) {
      msg = 'A record with these details already exists.';
      statusCode = 400;
    } else if (isForeignKey) {
      msg = 'Referenced entity not found or invalid foreign key.';
      statusCode = 400;
    } else if (error?.statusCode && error.statusCode >= 400 && error.statusCode < 600) {
      statusCode = error.statusCode;
    }

    return res.status(statusCode).json({
      success: false,
      msg,
      error: {
        code: error?.code || 'DATABASE_ERROR',
        message: msg,
      },
    });
  },

  paginatedResponse(items, total, page, pageSize) {
    return {
      items,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1,
      },
    };
  },

  extractPagination(query, defaultPageSize = 20) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize, 10) || defaultPageSize));
    const offset = (page - 1) * pageSize;
    return { page, pageSize, offset };
  },

  parseSort(sortString, allowedFields = ['created_at'], defaultField = 'created_at') {
    if (!sortString) {
      return { field: defaultField, direction: 'desc' };
    }
    const [field, direction] = sortString.split(':');
    const safeField = allowedFields.includes(field) ? field : defaultField;
    const safeDirection = direction === 'asc' ? 'asc' : 'desc';
    return { field: safeField, direction: safeDirection };
  },

  createSlug(text) {
    return slugify(text || '', {
      lower: true,
      strict: true,
      trim: true,
    });
  },

  paisaToRupees(paisa) {
    return (paisa / 100).toFixed(2);
  },

  rupeesToPaisa(rupees) {
    return Math.round(parseFloat(rupees) * 100);
  },

  generateOrderNumber(prefix = 'ORD', sequence = 1) {
    const paddedSequence = String(sequence).padStart(6, '0');
    return `${prefix}-${paddedSequence}`;
  },

  formatInvoiceId(invoiceId) {
    return invoiceId ? String(invoiceId).toUpperCase() : '';
  },

  safeJsonParse(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  },

  compactObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
  },

  sanitizeForLog(obj, sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization']) {
    if (!obj || typeof obj !== 'object') return obj;
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const lowerKey = key.toLowerCase();
        const isSensitive = sensitiveKeys.some((s) => lowerKey.includes(s));
        return [key, isSensitive ? '[REDACTED]' : value];
      }),
    );
  },

  // ==========================================
  // CART & SHIPPING CALCULATIONS
  // ==========================================
  async getShippingSettings() {
    const settings = await db.any(
      `select key, value from settings where category = 'checkout' and key in ('free_shipping_threshold_paisa', 'default_shipping_fee_paisa', 'cod_fee_paisa')`,
    );
    const map = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });

    return {
      freeThresholdPaisa: map.free_shipping_threshold_paisa ? parseInt(map.free_shipping_threshold_paisa, 10) : 49900,
      defaultShippingFeePaisa: map.default_shipping_fee_paisa ? parseInt(map.default_shipping_fee_paisa, 10) : 4900,
      codFeePaisa: map.cod_fee_paisa ? parseInt(map.cod_fee_paisa, 10) : 0,
    };
  },

  async validateAndCalculateCoupon(code, subtotalPaisa, customerId) {
    const coupon = await db.oneOrNone('select * from coupons where code = $/code/ and is_active = true', { code });
    if (!coupon) {
      throw new Error(MESSAGES.COUPON_INVALID);
    }

    const now = new Date();
    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
      throw new Error('Coupon is not yet active');
    }
    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
      throw new Error(MESSAGES.COUPON_EXPIRED);
    }
    if (coupon.usage_limit && coupon.current_usage >= coupon.usage_limit) {
      throw new Error(MESSAGES.COUPON_LIMIT_REACHED);
    }
    if (subtotalPaisa < coupon.minimum_order_paisa) {
      const minAmount = coupon.minimum_order_paisa / 100;
      throw new Error(`Minimum order amount of ₹${minAmount} required for this coupon`);
    }

    const userLimit = coupon.per_user_usage_limit ?? coupon.per_customer_usage_limit;
    if (customerId && userLimit) {
      const usage = await db.one(
        'select count(*) as count from coupon_redemptions where coupon_id = $/couponId/ and user_id = $/customerId/',
        { couponId: coupon.id, customerId },
      );
      if (parseInt(usage.count, 10) >= userLimit) {
        throw new Error('You have already used this coupon the maximum allowed times');
      }
    }

    let discountPaisa = 0;
    if (coupon.coupon_type === 'fixed') {
      discountPaisa = Math.min(coupon.discount_amount_paisa, subtotalPaisa);
    } else if (coupon.coupon_type === 'percentage') {
      discountPaisa = Math.round((subtotalPaisa * coupon.discount_percentage) / 100);
      if (coupon.max_discount_paisa) {
        discountPaisa = Math.min(discountPaisa, coupon.max_discount_paisa);
      }
    }

    return {
      id: coupon.id,
      code: coupon.code,
      couponType: coupon.coupon_type,
      discountPaisa,
      discountAmountPaisa: coupon.discount_amount_paisa,
      discountPercentage: coupon.discount_percentage,
    };
  },

  async calculateCartTotals(cartItems, couponCode, customerId) {
    if (!cartItems || cartItems.length === 0) {
      return {
        items: [],
        subtotalPaisa: 0,
        discountPaisa: 0,
        shippingPaisa: 0,
        taxPaisa: 0,
        totalPaisa: 0,
        coupon: null,
        shipping: { isFree: false, freeThresholdPaisa: 0, feePaisa: 0 },
      };
    }

    const calculatedItems = [];
    let subtotalPaisa = 0;
    let totalCostPaisa = 0;

    for (const item of cartItems) {
      const product = await db.oneOrNone('select * from products where id = $/id/ and is_active = true and status = \'active\'', { id: item.productId });
      if (!product) {
        throw new Error(`Product ${item.productId} is not available`);
      }

      let unitPricePaisa = product.selling_price_paisa;
      let comparePricePaisa = product.compare_at_price_paisa;
      let unitCostPaisa = product.cost_price_paisa;
      let variantName = null;
      let variantAttributes = {};
      let variantSku = null;
      let availableStock = product.stock_quantity;

      if (item.variantId) {
        const variant = await db.oneOrNone('select * from product_variants where id = $/variantId/ and product_id = $/productId/ and is_active = true', {
          variantId: item.variantId,
          productId: product.id,
        });
        if (!variant) {
          throw new Error(`Variant not found for product ${product.name}`);
        }
        if (variant.selling_price_paisa) unitPricePaisa = variant.selling_price_paisa;
        if (variant.compare_at_price_paisa) comparePricePaisa = variant.compare_at_price_paisa;
        if (variant.cost_price_paisa) unitCostPaisa = variant.cost_price_paisa;
        variantName = variant.name;
        variantAttributes = variant.attributes || {};
        variantSku = variant.sku;
        availableStock = variant.stock_quantity;
      }

      if (availableStock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const taxPercentage = parseFloat(product.tax_percentage) || 0;
      const taxAmountPaisa = Math.round((unitPricePaisa * item.quantity * taxPercentage) / 100);
      const itemSubtotal = unitPricePaisa * item.quantity;

      calculatedItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        productName: product.name,
        productSku: variantSku || product.sku,
        variantName,
        variantAttributes,
        quantity: item.quantity,
        unitPricePaisa,
        comparePricePaisa,
        unitCostPaisa,
        taxPercentage,
        taxAmountPaisa,
        discountPaisa: 0,
        subtotalPaisa: itemSubtotal,
        supplierId: product.supplier_id || null,
        supplierProductUrl: product.supplier_product_url || null,
        supplierExternalProductId: product.supplier_external_product_id || null,
      });

      subtotalPaisa += itemSubtotal;
      if (unitCostPaisa) totalCostPaisa += unitCostPaisa * item.quantity;
    }

    let discountPaisa = 0;
    let couponData = null;
    if (couponCode) {
      const coupon = await helpers.validateAndCalculateCoupon(couponCode, subtotalPaisa, customerId);
      discountPaisa = coupon.discountPaisa;
      couponData = coupon;
    }

    const shippingSettings = await helpers.getShippingSettings();
    const subtotalAfterDiscount = subtotalPaisa - discountPaisa;
    const shippingPaisa = subtotalAfterDiscount >= shippingSettings.freeThresholdPaisa
      ? 0
      : shippingSettings.defaultShippingFeePaisa;

    const taxRow = await db.oneOrNone('select value from settings where category = \'checkout\' and key = \'tax_inclusive\'');
    const taxInclusive = taxRow ? taxRow.value === 'true' || taxRow.value === true : false;
    const taxPaisa = taxInclusive ? 0 : calculatedItems.reduce((acc, i) => acc + i.taxAmountPaisa, 0);

    const totalPaisa = subtotalAfterDiscount + shippingPaisa + taxPaisa;
    const estimatedProfitPaisa = totalCostPaisa > 0 ? totalPaisa - totalCostPaisa - shippingPaisa : null;

    return {
      items: calculatedItems,
      subtotalPaisa,
      discountPaisa,
      shippingPaisa,
      taxPaisa,
      totalPaisa,
      totalCostPaisa: totalCostPaisa || null,
      estimatedProfitPaisa,
      coupon: couponData,
      shipping: {
        isFree: shippingPaisa === 0,
        freeThresholdPaisa: shippingSettings.freeThresholdPaisa,
        feePaisa: shippingSettings.defaultShippingFeePaisa,
      },
    };
  },

  // ==========================================
  // PAYMENT HELPERS (RAZORPAY)
  // ==========================================
  async createPaymentOrder({ amountPaisa, currency = 'INR', receipt, notes = {} }) {
    const keyId = config.razorpay?.keyId;
    const keySecret = config.razorpay?.keySecret;

    if (!keyId || !keySecret) {
      logger.warn('Razorpay credentials not configured, returning mock gateway order');
      return {
        gatewayOrderId: `mock_order_${Date.now()}`,
        gatewayData: { id: `mock_order_${Date.now()}`, amount: amountPaisa, currency },
        keyId: 'mock_key',
      };
    }

    try {
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        },
        body: JSON.stringify({
          amount: amountPaisa,
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
          notes,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        logger.error({ status: response.status, body: errorBody }, 'Razorpay order creation failed');
        throw new Error('Failed to create payment gateway order');
      }

      const gatewayData = await response.json();
      return {
        gatewayOrderId: gatewayData.id,
        gatewayData,
        keyId,
      };
    } catch (error) {
      logger.error('createPaymentOrder error:', error);
      throw error;
    }
  },

  verifyPaymentSignature({ gatewayOrderId, gatewayPaymentId, signature }) {
    const keySecret = config.razorpay?.keySecret;
    if (!keySecret || !signature || !gatewayOrderId || !gatewayPaymentId) {
      return false;
    }

    try {
      const body = `${gatewayOrderId}|${gatewayPaymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body)
        .digest('hex');

      const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
      const signatureBuffer = Buffer.from(String(signature), 'utf8');

      if (expectedBuffer.length !== signatureBuffer.length) {
        return false;
      }
      return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
    } catch {
      return false;
    }
  },

  verifyWebhookSignature(rawBody, signature) {
    const webhookSecret = config.razorpay?.webhookSecret;
    if (!webhookSecret || !signature || !rawBody) {
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
      const signatureBuffer = Buffer.from(String(signature), 'utf8');

      if (expectedBuffer.length !== signatureBuffer.length) {
        return false;
      }
      return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
    } catch {
      return false;
    }
  },
};

module.exports = helpers;
