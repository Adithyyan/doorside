const helpers = require('../helpers.js');
const db = require('../db.js');

const api = {
  async getDashboardStats(req, res) {
    const qObj = {};
    try {
      const [orderStats, customerCount, lowStockCount, recentOrders] = await Promise.all([
        db.one(
          req,
          `select
              count(*) as total_orders,
              coalesce(sum(case when payment_status = 'paid' then total_paisa else 0 end), 0) as total_revenue_paisa,
              count(case when order_status = 'placed' then 1 end) as pending_orders,
              count(case when fulfillment_status = 'manual_action_required' then 1 end) as action_required_orders
           from orders`,
          qObj,
        ),
        db.one(req, 'select count(*) as total_customers from users where is_active = true', qObj),
        db.one(req, 'select count(*) as low_stock_count from products where stock_quantity <= 5 and is_active = true', qObj),
        db.any(
          req,
          `select id, order_number, user_name, user_name as customer_name, total_paisa, order_status, payment_status, created_at
           from orders order by created_at desc limit 10`,
          qObj,
        ),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          stats: {
            totalOrders: parseInt(orderStats.total_orders, 10),
            totalRevenuePaisa: parseInt(orderStats.total_revenue_paisa, 10),
            pendingOrders: parseInt(orderStats.pending_orders, 10),
            actionRequiredOrders: parseInt(orderStats.action_required_orders, 10),
            totalCustomers: parseInt(customerCount.total_customers, 10),
            lowStockCount: parseInt(lowStockCount.low_stock_count, 10),
          },
          recentOrders,
        },
      });
    } catch (error) {
      req.log.error('dashboard.getDashboardStats(): Unexpected error', { error });
      return helpers.psqlError(error, req, res, 'Unable to get dashboard statistics.');
    }
  },

  async getSalesReport(req, res) {
    const qObj = {};
    try {
      const rows = await db.any(
        req,
        `select
            date_trunc('day', created_at) as date,
            count(*) as order_count,
            sum(total_paisa) as revenue_paisa
         from orders
         where payment_status = 'paid' and created_at >= now() - interval '30 days'
         group by date_trunc('day', created_at)
         order by date asc`,
        qObj,
      );
      return res.status(200).json({ success: true, data: { sales: rows } });
    } catch (error) {
      req.log.error('dashboard.getSalesReport(): Unexpected error', { error });
      return helpers.psqlError(error, req, res, 'Unable to get sales report.');
    }
  },

  async getAuditLogs(req, res) {
    const { page, pageSize, offset } = helpers.extractPagination(req.query);
    const qObj = {
      limit: pageSize,
      offset,
    };

    try {
      const [rows, countResult] = await Promise.all([
        db.any(
          req,
          `select al.*, au.name as admin_name
           from audit_logs al
           left join admin_users au on au.id = al.admin_user_id
           order by al.created_at desc
           limit $/limit/ offset $/offset/`,
          qObj,
        ),
        db.one(req, 'select count(*) as total from audit_logs', qObj),
      ]);
      return res.status(200).json({
        success: true,
        data: helpers.paginatedResponse(rows, parseInt(countResult.total, 10), page, pageSize),
      });
    } catch (error) {
      req.log.error('dashboard.getAuditLogs(): Unexpected error', { error, ...qObj });
      return helpers.psqlError(error, req, res, 'Unable to get audit logs.');
    }
  },
};

module.exports = api;
