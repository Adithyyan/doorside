const helpers = require('../helpers.js');
const db = require('../db.js');
const { MESSAGES } = require('../strings.js');
const {
  ORDER_STATUS,
  PAYMENT_STATUS,
  FULFILLMENT_STATUS,
  HTTP_STATUS,
  ERROR_CODES,
} = require('../constants.js');

const api = {
  // ==========================================
  // CUSTOMER / STOREFRONT ORDER CREATION
  // ==========================================
  async placeOrder(req, res) {
    const qObj = {
      userId: req.user?.id || null,
      items: req.body?.items,
      couponCode: req.body?.couponCode || null,
      paymentMethod: req.body?.paymentMethod || 'cod',
      shippingAddress: req.body?.shippingAddress || {},
      billingAddress: req.body?.billingAddress || {},
      userName: req.body?.userName || req.body?.customerName || req.body?.shippingAddress?.name || 'Customer',
      userEmail: req.body?.userEmail || req.body?.customerEmail || req.body?.shippingAddress?.email || null,
      userPhone: req.body?.userPhone || req.body?.customerPhone || req.body?.shippingAddress?.phone || '',
      note: req.body?.note || null,
      ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null,
    };

    if (!qObj.items || !Array.isArray(qObj.items) || qObj.items.length === 0) {
      req.log.warn('orders.placeOrder(): Missing or empty order items');
      return res.status(400).json({ success: false, msg: MESSAGES.CART_EMPTY });
    }

    try {
      req.log.info('orders.placeOrder(): Calculating totals for checkout', {
        itemCount: qObj.items.length,
        userId: qObj.userId,
      });

      // 1. Calculate pricing server-side
      const calculation = await helpers.calculateCartTotals(
        qObj.items,
        qObj.couponCode,
        qObj.userId,
      );

      // 2. Validate payment method against store settings
      const isCod = qObj.paymentMethod === 'cod';
      const settings = await db.any(
        req,
        `select key, value from settings where category = 'checkout' and key in ('cod_enabled', 'prepaid_enabled', 'order_prefix')`,
        qObj,
      );
      const settingsMap = {};
      (settings || []).forEach((s) => { settingsMap[s.key] = s.value; });

      if (isCod && settingsMap.cod_enabled === 'false') {
        req.log.warn('orders.placeOrder(): COD is disabled');
        return res.status(400).json({ success: false, msg: 'Cash on Delivery is currently disabled.' });
      }
      if (!isCod && settingsMap.prepaid_enabled === 'false') {
        req.log.warn('orders.placeOrder(): Online payment is disabled');
        return res.status(400).json({ success: false, msg: 'Online payments are currently disabled.' });
      }

      // 3. Generate sequential order number
      let orderNumber;
      try {
        const seqRow = await db.one(req, "select nextval('order_number_seq') as seq", qObj);
        const orderPrefix = settingsMap.order_prefix || 'ORD';
        orderNumber = helpers.generateOrderNumber(orderPrefix, parseInt(seqRow.seq, 10));
      } catch {
        orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      }
      qObj.orderNumber = orderNumber;

      // 4. Create gateway order if online payment
      let gatewayOrderId = null;
      let keyId = null;

      if (!isCod) {
        const paymentResult = await helpers.createPaymentOrder({
          amountPaisa: calculation.totalPaisa,
          currency: 'INR',
          receipt: orderNumber,
          notes: {
            orderNumber,
            customerName: qObj.userName,
            customerPhone: qObj.userPhone,
          },
        });
        gatewayOrderId = paymentResult.gatewayOrderId;
        keyId = paymentResult.keyId;
      }
      qObj.gatewayOrderId = gatewayOrderId;

      // 5. Execute Order, Items, Addresses & Stock decrement in a Transaction
      const order = await db.tx(async (t) => {
        const insertedOrder = await t.one(
          `insert into orders
           (order_number, user_id, user_name, user_email, user_phone,
            order_status, payment_status, fulfillment_status,
            subtotal_paisa, discount_paisa, shipping_paisa, tax_paisa, total_paisa,
            total_cost_paisa, estimated_profit_paisa,
            coupon_id, coupon_code, payment_method,
            gateway_order_id, user_note, ip_address, source)
           values
           ($/orderNumber/, $/userId/, $/userName/, $/userEmail/, $/userPhone/,
            $/orderStatus/, $/paymentStatus/, $/fulfillmentStatus/,
            $/subtotalPaisa/, $/discountPaisa/, $/shippingPaisa/, $/taxPaisa/, $/totalPaisa/,
            $/totalCostPaisa/, $/estimatedProfitPaisa/,
            $/couponId/, $/couponCode/, $/paymentMethod/,
            $/gatewayOrderId/, $/note/, $/ipAddress/, 'web')
           returning *`,
          {
            ...qObj,
            orderStatus: ORDER_STATUS.PLACED,
            paymentStatus: PAYMENT_STATUS.PENDING,
            fulfillmentStatus: FULFILLMENT_STATUS.PENDING,
            subtotalPaisa: calculation.subtotalPaisa,
            discountPaisa: calculation.discountPaisa || 0,
            shippingPaisa: calculation.shippingPaisa || 0,
            taxPaisa: calculation.taxPaisa || 0,
            totalPaisa: calculation.totalPaisa,
            totalCostPaisa: calculation.totalCostPaisa,
            estimatedProfitPaisa: calculation.estimatedProfitPaisa,
            couponId: calculation.coupon?.id || null,
            couponCode: calculation.coupon?.code || null,
          },
        );

        // Insert order items & reduce stock
        for (const item of calculation.items) {
          await t.none(
            `insert into order_items
             (order_id, product_id, variant_id, product_name, product_sku, variant_name,
              variant_attributes, quantity, unit_price_paisa, compare_price_paisa, unit_cost_paisa,
              tax_percentage, tax_amount_paisa, discount_paisa, subtotal_paisa,
              supplier_id, supplier_product_url, supplier_external_product_id)
             values
             ($/orderId/, $/productId/, $/variantId/, $/productName/, $/productSku/, $/variantName/,
              $/variantAttributes/, $/quantity/, $/unitPricePaisa/, $/comparePricePaisa/, $/unitCostPaisa/,
              $/taxPercentage/, $/taxAmountPaisa/, $/discountPaisa/, $/subtotalPaisa/,
              $/supplierId/, $/supplierProductUrl/, $/supplierExternalProductId/)`,
            {
              orderId: insertedOrder.id,
              productId: item.productId,
              variantId: item.variantId || null,
              productName: item.productName,
              productSku: item.productSku || null,
              variantName: item.variantName || null,
              variantAttributes: JSON.stringify(item.variantAttributes || {}),
              quantity: item.quantity,
              unitPricePaisa: item.unitPricePaisa,
              comparePricePaisa: item.comparePricePaisa || null,
              unitCostPaisa: item.unitCostPaisa || null,
              taxPercentage: item.taxPercentage || 0,
              taxAmountPaisa: item.taxAmountPaisa || 0,
              discountPaisa: item.discountPaisa || 0,
              subtotalPaisa: item.subtotalPaisa,
              supplierId: item.supplierId || null,
              supplierProductUrl: item.supplierProductUrl || null,
              supplierExternalProductId: item.supplierExternalProductId || null,
            },
          );

          // Update stock quantity
          await t.none(
            `update products set stock_quantity = greatest(0, stock_quantity - $/quantity/), updated_at = now() where id = $/productId/`,
            { productId: item.productId, quantity: item.quantity },
          );

          if (item.variantId) {
            await t.none(
              `update product_variants set stock_quantity = greatest(0, stock_quantity - $/quantity/), updated_at = now() where id = $/variantId/`,
              { variantId: item.variantId, quantity: item.quantity },
            );
          }
        }

        // Insert shipping address
        const sa = qObj.shippingAddress;
        await t.none(
          `insert into order_addresses
           (order_id, address_type, name, phone, email, house_street, area, landmark, city, state, district, country, pincode, gstin)
           values ($/orderId/, 'shipping', $/name/, $/phone/, $/email/, $/houseStreet/, $/area/, $/landmark/, $/city/, $/state/, $/district/, $/country/, $/pincode/, $/gstin/)`,
          {
            orderId: insertedOrder.id,
            name: sa.name || qObj.userName,
            phone: sa.phone || qObj.userPhone,
            email: sa.email || qObj.userEmail,
            houseStreet: sa.houseStreet || '',
            area: sa.area || null,
            landmark: sa.landmark || null,
            city: sa.city || '',
            state: sa.state || '',
            district: sa.district || null,
            country: sa.country || 'India',
            pincode: sa.pincode || '',
            gstin: sa.gstin || null,
          },
        );

        // Initial status history entry
        await t.none(
          `insert into order_status_history (order_id, status_type, new_status, source)
           values ($/orderId/, 'order_status', $/status/, 'system')`,
          { orderId: insertedOrder.id, status: insertedOrder.order_status },
        );

        // Record coupon redemption
        if (calculation.coupon) {
          await t.none('update coupons set current_usage = current_usage + 1, updated_at = now() where id = $/id/', {
            id: calculation.coupon.id,
          });
          await t.none(
            `insert into coupon_redemptions (coupon_id, user_id, order_id, discount_paisa)
             values ($/couponId/, $/userId/, $/orderId/, $/discountPaisa/)`,
            {
              couponId: calculation.coupon.id,
              userId: qObj.userId,
              orderId: insertedOrder.id,
              discountPaisa: calculation.discountPaisa,
            },
          );
        }

        // Update user stats
        if (qObj.userId) {
          await t.none(
            `update users set total_orders = total_orders + 1, total_spent_paisa = total_spent_paisa + $/totalPaisa/, updated_at = now() where id = $/userId/`,
            { userId: qObj.userId, totalPaisa: calculation.totalPaisa },
          );
        }

        return insertedOrder;
      });

      req.log.info('orders.placeOrder(): Order placed successfully', {
        orderId: order.id,
        orderNumber: order.order_number,
        totalPaisa: order.total_paisa,
      });

      return res.status(201).json({
        success: true,
        msg: MESSAGES.ORDER_PLACED_SUCCESS,
        data: {
          orderId: order.id,
          orderNumber: order.order_number,
          gatewayOrderId,
          keyId,
          totalPaisa: order.total_paisa,
          paymentMethod: qObj.paymentMethod,
          message: MESSAGES.ORDER_PLACED_SUCCESS,
        },
      });
    } catch (error) {
      req.log.error('orders.placeOrder(): Order creation failed', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Error placing order. Please try again.');
    }
  },

  async getOrderById(req, res) {
    const qObj = {
      id: req.params?.id,
      userId: req.user?.id || null,
      isAdmin: !!req.user?.isAdmin,
    };

    try {
      const order = await db.oneOrNone(
        req,
        `select
            o.id, o.order_number, o.order_status, o.payment_status, o.fulfillment_status,
            o.subtotal_paisa, o.discount_paisa, o.shipping_paisa, o.tax_paisa, o.total_paisa,
            o.payment_method, o.courier_name, o.tracking_number, o.tracking_url,
            o.shipped_at, o.expected_delivery_at, o.delivered_at, o.created_at, o.user_id
         from orders o
         where o.id = $/id/`,
        qObj,
      );

      if (!order) {
        req.log.warn('orders.getOrderById(): Order not found', qObj);
        return res.status(404).json({ success: false, msg: MESSAGES.ORDER_NOT_FOUND });
      }

      if (qObj.userId && order.user_id && order.user_id !== qObj.userId && !qObj.isAdmin) {
        req.log.warn('orders.getOrderById(): Access denied', { orderId: qObj.id, userId: qObj.userId });
        return res.status(403).json({ success: false, msg: 'Access denied' });
      }

      const items = await db.any(
        req,
        `select
            oi.id, oi.product_id as "productId", oi.product_name as "productName",
            oi.product_sku as "productSku", oi.variant_name as "variantName",
            oi.variant_attributes as "variantAttributes", oi.quantity,
            oi.unit_price_paisa as "unitPricePaisa", oi.subtotal_paisa as "subtotalPaisa",
            pi_m.url as "imageUrl"
         from order_items oi
         left join product_images pi on pi.product_id = oi.product_id and pi.is_primary = true
         left join media pi_m on pi_m.id = pi.media_id
         where oi.order_id = $/id/`,
        qObj,
      );

      const shippingAddress = await db.oneOrNone(
        req,
        `select * from order_addresses where order_id = $/id/ and address_type = 'shipping'`,
        qObj,
      );

      order.items = items || [];
      order.shipping_address = shippingAddress;

      return res.status(200).json({ success: true, data: { order } });
    } catch (error) {
      req.log.error('orders.getOrderById(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get order details.');
    }
  },

  async getMyOrders(req, res) {
    const { page, pageSize, offset } = helpers.extractPagination(req.query, 10);
    const qObj = {
      userId: req.user?.id,
      limit: pageSize,
      offset,
    };

    try {
      const [rows, countResult] = await Promise.all([
        db.any(
          req,
          `select o.id, o.order_number, o.order_status, o.payment_status, o.fulfillment_status,
                  o.total_paisa, o.payment_method, o.created_at,
                  count(oi.id) as item_count
           from orders o
           left join order_items oi on oi.order_id = o.id
           where o.user_id = $/userId/
           group by o.id
           order by o.created_at desc
           limit $/limit/ offset $/offset/`,
          qObj,
        ),
        db.one(req, 'select count(*) as total from orders where user_id = $/userId/', qObj),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          orders: rows,
          pagination: {
            total: parseInt(countResult.total, 10),
            page,
            pageSize,
            totalPages: Math.ceil(parseInt(countResult.total, 10) / pageSize),
          },
        },
      });
    } catch (error) {
      req.log.error('orders.getMyOrders(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to fetch customer orders.');
    }
  },

  // ==========================================
  // ADMIN ORDER MANAGEMENT
  // ==========================================
  async adminGetOrders(req, res) {
    const { page, pageSize, offset } = helpers.extractPagination(req.query);
    const qObj = {
      limit: pageSize,
      offset,
      search: req.query?.search ? `%${req.query.search.trim()}%` : null,
      orderStatus: req.query?.orderStatus || null,
      paymentStatus: req.query?.paymentStatus || null,
      fulfillmentStatus: req.query?.fulfillmentStatus || null,
      startDate: req.query?.startDate || null,
      endDate: req.query?.endDate || null,
    };

    try {
      const conditions = [];
      if (qObj.search) {
        conditions.push('(o.order_number ilike $/search/ or o.user_name ilike $/search/ or o.user_phone ilike $/search/ or o.user_email ilike $/search/)');
      }
      if (qObj.orderStatus) {
        conditions.push('o.order_status = $/orderStatus/');
      }
      if (qObj.paymentStatus) {
        conditions.push('o.payment_status = $/paymentStatus/');
      }
      if (qObj.fulfillmentStatus) {
        conditions.push('o.fulfillment_status = $/fulfillmentStatus/');
      }
      if (qObj.startDate) {
        conditions.push('o.created_at >= $/startDate/');
      }
      if (qObj.endDate) {
        conditions.push('o.created_at <= $/endDate/');
      }

      const whereClause = conditions.length > 0 ? `where ${conditions.join(' and ')}` : '';

      const [rows, countResult] = await Promise.all([
        db.any(
          req,
          `select o.id, o.order_number, o.user_name, o.user_phone, o.user_email,
                  o.user_name as customer_name, o.user_phone as customer_phone, o.user_email as customer_email,
                  o.order_status, o.payment_status, o.fulfillment_status,
                  o.subtotal_paisa, o.total_paisa, o.total_cost_paisa, o.estimated_profit_paisa,
                  o.payment_method, o.courier_name, o.tracking_number, o.created_at,
                  count(oi.id) as item_count
           from orders o
           left join order_items oi on oi.order_id = o.id
           ${whereClause}
           group by o.id
           order by o.created_at desc
           limit $/limit/ offset $/offset/`,
          qObj,
        ),
        db.one(req, `select count(*) as total from orders o ${whereClause}`, qObj),
      ]);

      return res.status(200).json({
        success: true,
        data: helpers.paginatedResponse(rows, parseInt(countResult.total, 10), page, pageSize),
      });
    } catch (error) {
      req.log.error('orders.adminGetOrders(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to fetch orders.');
    }
  },

  async adminGetOrderById(req, res) {
    const qObj = {
      id: req.params?.id,
    };

    try {
      const order = await db.oneOrNone(
        req,
        `select o.*, s.name as supplier_name, s.code as supplier_code
         from orders o
         left join suppliers s on s.id = o.supplier_id
         where o.id = $/id/`,
        qObj,
      );

      if (!order) {
        req.log.warn('orders.adminGetOrderById(): Order not found', qObj);
        return res.status(404).json({ success: false, msg: MESSAGES.ORDER_NOT_FOUND });
      }

      const items = await db.any(
        req,
        `select
            oi.id, oi.product_id as "productId", oi.product_name as "productName",
            oi.product_sku as "productSku", oi.variant_name as "variantName",
            oi.variant_attributes as "variantAttributes", oi.quantity,
            oi.unit_price_paisa as "unitPricePaisa", oi.unit_cost_paisa as "unitCostPaisa",
            oi.subtotal_paisa as "subtotalPaisa", oi.supplier_product_url as "supplierProductUrl",
            oi.supplier_external_product_id as "supplierExternalProductId",
            pi_m.url as "imageUrl"
         from order_items oi
         left join product_images pi on pi.product_id = oi.product_id and pi.is_primary = true
         left join media pi_m on pi_m.id = pi.media_id
         where oi.order_id = $/id/`,
        qObj,
      );

      const [shippingAddress, billingAddress, history] = await Promise.all([
        db.oneOrNone(req, `select * from order_addresses where order_id = $/id/ and address_type = 'shipping'`, qObj),
        db.oneOrNone(req, `select * from order_addresses where order_id = $/id/ and address_type = 'billing'`, qObj),
        db.any(
          req,
          `select osh.*, au.name as admin_name
           from order_status_history osh
           left join admin_users au on au.id = osh.created_by
           where osh.order_id = $/id/
           order by osh.created_at asc`,
          qObj,
        ),
      ]);

      order.items = items || [];
      order.shipping_address = shippingAddress;
      order.billing_address = billingAddress;
      order.history = history || [];

      return res.status(200).json({ success: true, data: { order, history: history || [] } });
    } catch (error) {
      req.log.error('orders.adminGetOrderById(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get admin order details.');
    }
  },

  async adminUpdateStatus(req, res) {
    const qObj = {
      id: req.params?.id,
      statusType: req.body?.statusType || 'order_status',
      newStatus: req.body?.newStatus,
      note: req.body?.note || null,
      adminUserId: req.user?.id,
    };

    if (!qObj.newStatus) {
      return res.status(400).json({ success: false, msg: 'newStatus is required.' });
    }

    try {
      const order = await db.oneOrNone(req, 'select * from orders where id = $/id/', qObj);
      if (!order) {
        req.log.warn('orders.adminUpdateStatus(): Order not found', qObj);
        return res.status(404).json({ success: false, msg: MESSAGES.ORDER_NOT_FOUND });
      }

      qObj.oldStatus = order[qObj.statusType];

      const updatedOrder = await db.tx(async (t) => {
        const u = await t.one(
          `update orders set ${qObj.statusType} = $/newStatus/, updated_at = now() where id = $/id/ returning *`,
          qObj,
        );

        await t.none(
          `insert into order_status_history (order_id, status_type, new_status, old_status, created_by, source, note)
           values ($/id/, $/statusType/, $/newStatus/, $/oldStatus/, $/adminUserId/, 'admin', $/note/)`,
          qObj,
        );

        return u;
      });

      req.log.info('orders.adminUpdateStatus(): Status updated', { orderId: qObj.id, newStatus: qObj.newStatus });
      return res.status(200).json({ success: true, msg: 'Order status updated', data: { order: updatedOrder } });
    } catch (error) {
      req.log.error('orders.adminUpdateStatus(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to update order status.');
    }
  },

  async adminUpdateTracking(req, res) {
    const qObj = {
      id: req.params?.id,
      trackingNumber: req.body?.trackingNumber || null,
      courierName: req.body?.courierName || null,
      trackingUrl: req.body?.trackingUrl || null,
      expectedDeliveryAt: req.body?.expectedDeliveryAt || null,
    };

    try {
      const updatedOrder = await db.one(
        req,
        `update orders set
           tracking_number = coalesce($/trackingNumber/, tracking_number),
           courier_name = coalesce($/courierName/, courier_name),
           tracking_url = coalesce($/trackingUrl/, tracking_url),
           expected_delivery_at = coalesce($/expectedDeliveryAt/, expected_delivery_at),
           shipped_at = coalesce(shipped_at, now()),
           fulfillment_status = 'shipped',
           order_status = case when order_status in ('placed', 'confirmed', 'processing') then 'shipped' else order_status end,
           updated_at = now()
         where id = $/id/
         returning *`,
        qObj,
      );

      req.log.info('orders.adminUpdateTracking(): Tracking updated', qObj);
      return res.status(200).json({ success: true, msg: 'Tracking details updated', data: { order: updatedOrder } });
    } catch (error) {
      req.log.error('orders.adminUpdateTracking(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to update tracking details.');
    }
  },

  async adminPlaceSupplierOrder(req, res) {
    const qObj = {
      id: req.params?.id,
      supplierOrderId: req.body?.supplierOrderId,
      supplierId: req.body?.supplierId || null,
    };

    try {
      const updatedOrder = await db.one(
        req,
        `update orders set
           supplier_order_id = $/supplierOrderId/,
           supplier_id = coalesce($/supplierId/, supplier_id),
           supplier_ordered_at = now(),
           fulfillment_status = 'supplier_ordered',
           updated_at = now()
         where id = $/id/
         returning *`,
        qObj,
      );

      req.log.info('orders.adminPlaceSupplierOrder(): Supplier order linked', qObj);
      return res.status(200).json({ success: true, msg: 'Supplier order linked', data: { order: updatedOrder } });
    } catch (error) {
      req.log.error('orders.adminPlaceSupplierOrder(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to link supplier order.');
    }
  },

  async adminUpdateNote(req, res) {
    const qObj = {
      id: req.params?.id,
      adminNote: req.body?.adminNote || '',
    };

    try {
      const updatedOrder = await db.one(
        req,
        'update orders set admin_note = $/adminNote/, updated_at = now() where id = $/id/ returning id, admin_note',
        qObj,
      );
      req.log.info('orders.adminUpdateNote(): Note updated', { orderId: qObj.id });
      return res.status(200).json({ success: true, msg: 'Order note updated', data: { order: updatedOrder } });
    } catch (error) {
      req.log.error('orders.adminUpdateNote(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to update order note.');
    }
  },
};

module.exports = api;
