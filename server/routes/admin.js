const express = require('express');
const router = express.Router();
const helpers = require('../helpers.js');

const users = require('../controllers/users.js');
const products = require('../controllers/products.js');
const orders = require('../controllers/orders.js');
const categories = require('../controllers/categories.js');
const coupons = require('../controllers/coupons.js');
const reviews = require('../controllers/reviews.js');
const suppliers = require('../controllers/suppliers.js');
const settings = require('../controllers/settings.js');
const media = require('../controllers/media.js');
const dashboard = require('../controllers/dashboard.js');

// Admin Auth (Public & Protected)
router.post('/auth/login', users.adminLogin);
router.post('/auth/refresh', users.adminRefresh);
router.post('/auth/logout', helpers.checkAdmin, users.adminLogout);
router.get('/auth/me', helpers.checkAdmin, users.getAdminProfile);

// Dashboard, Reports & Audit
router.get('/dashboard', helpers.checkAdmin, dashboard.getDashboardStats);
router.get('/reports', helpers.checkAdmin, dashboard.getSalesReport);
router.get('/audit', helpers.checkAdmin, dashboard.getAuditLogs);

// Orders
router.get('/orders', helpers.checkAdmin, orders.adminGetOrders);
router.get('/orders/:id', helpers.checkAdmin, orders.adminGetOrderById);
router.patch('/orders/:id/status', helpers.checkAdmin, orders.adminUpdateStatus);
router.patch('/orders/:id/tracking', helpers.checkAdmin, orders.adminUpdateTracking);
router.post('/orders/:id/supplier-order', helpers.checkAdmin, orders.adminPlaceSupplierOrder);
router.patch('/orders/:id/note', helpers.checkAdmin, orders.adminUpdateNote);

// Products
router.get('/products', helpers.checkAdmin, products.adminGetProducts);
router.get('/products/:id', helpers.checkAdmin, products.adminGetProductById);
router.post('/products', helpers.checkAdmin, products.adminCreateProduct);
router.put('/products/:id', helpers.checkAdmin, products.adminUpdateProduct);
router.patch('/products/:id', helpers.checkAdmin, products.adminUpdateProduct);
router.delete('/products/:id', helpers.checkAdmin, products.adminDeleteProduct);

// Dynamic Filters & Values
router.get('/filters', helpers.checkAdmin, products.adminGetFilters);
router.post('/filters', helpers.checkAdmin, products.adminCreateFilter);
router.put('/filters/:id', helpers.checkAdmin, products.adminUpdateFilter);
router.delete('/filters/:id', helpers.checkAdmin, products.adminDeleteFilter);
router.post('/filters/:id/values', helpers.checkAdmin, products.adminCreateFilterValue);
router.delete('/filters/values/:valueId', helpers.checkAdmin, products.adminDeleteFilterValue);

// Dynamic Sort Options
router.get('/sort-options', helpers.checkAdmin, products.adminGetSortOptions);
router.post('/sort-options', helpers.checkAdmin, products.adminCreateSortOption);
router.put('/sort-options/:id', helpers.checkAdmin, products.adminUpdateSortOption);
router.delete('/sort-options/:id', helpers.checkAdmin, products.adminDeleteSortOption);

// Categories
router.get('/categories', helpers.checkAdmin, categories.adminGetCategories);
router.post('/categories', helpers.checkAdmin, categories.adminCreateCategory);
router.put('/categories/:id', helpers.checkAdmin, categories.adminUpdateCategory);
router.patch('/categories/:id', helpers.checkAdmin, categories.adminUpdateCategory);
router.delete('/categories/:id', helpers.checkAdmin, categories.adminDeleteCategory);

// Customers & Users
router.get('/customers', helpers.checkAdmin, users.getCustomers);
router.get('/users', helpers.checkAdmin, users.getAdminUsers);

// Suppliers
router.get('/suppliers', helpers.checkAdmin, suppliers.adminGetSuppliers);
router.post('/suppliers', helpers.checkAdmin, suppliers.adminCreateSupplier);
router.put('/suppliers/:id', helpers.checkAdmin, suppliers.adminUpdateSupplier);
router.patch('/suppliers/:id', helpers.checkAdmin, suppliers.adminUpdateSupplier);
router.delete('/suppliers/:id', helpers.checkAdmin, suppliers.adminDeleteSupplier);

// Coupons
router.get('/coupons', helpers.checkAdmin, coupons.adminGetCoupons);
router.post('/coupons', helpers.checkAdmin, coupons.adminCreateCoupon);
router.put('/coupons/:id', helpers.checkAdmin, coupons.adminUpdateCoupon);
router.patch('/coupons/:id', helpers.checkAdmin, coupons.adminUpdateCoupon);
router.delete('/coupons/:id', helpers.checkAdmin, coupons.adminDeleteCoupon);

// Reviews
router.get('/reviews', helpers.checkAdmin, reviews.adminGetReviews);
router.patch('/reviews/:id/status', helpers.checkAdmin, reviews.adminUpdateReviewStatus);
router.patch('/reviews/:id/reply', helpers.checkAdmin, reviews.adminReplyReview);

// Settings & Pages
router.get('/settings', helpers.checkAdmin, settings.adminGetSettings);
router.put('/settings', helpers.checkAdmin, settings.adminUpdateSettings);
router.patch('/settings', helpers.checkAdmin, settings.adminUpdateSettings);
router.get('/settings/pages', helpers.checkAdmin, settings.adminGetPages);
router.post('/settings/pages', helpers.checkAdmin, settings.adminCreatePage);

// Media
router.get('/media', helpers.checkAdmin, media.getMedia);
router.delete('/media/:id', helpers.checkAdmin, media.deleteMedia);

module.exports = router;
