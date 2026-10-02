import { createRouter, createWebHistory } from 'vue-router';
import { mainStore } from '@/store';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
  routes: [
    // Storefront routes
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home.vue'),
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('@/views/shop.vue'),
    },
    {
      path: '/category/:slug',
      name: 'category',
      component: () => import('@/views/shop.vue'),
      props: true,
    },
    {
      path: '/product/:slug',
      name: 'product-detail',
      component: () => import('@/views/product-detail.vue'),
      props: true,
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/cart.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/checkout.vue'),
    },
    {
      path: '/order-success',
      name: 'order-success',
      component: () => import('@/views/order-success.vue'),
    },
    {
      path: '/track-order',
      name: 'track-order',
      component: () => import('@/views/track-order.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register.vue'),
    },

    // Customer Account routes (Protected)
    {
      path: '/account',
      redirect: '/account/orders',
    },
    {
      path: '/account/orders',
      name: 'account-orders',
      component: () => import('@/views/account-orders.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/account/orders/:id',
      name: 'account-order-detail',
      component: () => import('@/views/account-order-detail.vue'),
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/account/profile',
      name: 'account-profile',
      component: () => import('@/views/account-profile.vue'),
      meta: { requiresAuth: true },
    },

    // Editable Legal & Info Pages
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: () => import('@/views/policy.vue'),
      props: { slug: 'privacy-policy', defaultTitle: 'Privacy Policy' },
    },
    {
      path: '/terms-and-conditions',
      name: 'terms-and-conditions',
      component: () => import('@/views/policy.vue'),
      props: { slug: 'terms-and-conditions', defaultTitle: 'Terms & Conditions' },
    },
    {
      path: '/shipping-policy',
      name: 'shipping-policy',
      component: () => import('@/views/policy.vue'),
      props: { slug: 'shipping-policy', defaultTitle: 'Shipping Policy' },
    },
    {
      path: '/refund-policy',
      name: 'refund-policy',
      component: () => import('@/views/policy.vue'),
      props: { slug: 'refund-policy', defaultTitle: 'Refund Policy' },
    },
    {
      path: '/cancellation-policy',
      name: 'cancellation-policy',
      component: () => import('@/views/policy.vue'),
      props: { slug: 'cancellation-policy', defaultTitle: 'Cancellation Policy' },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/policy.vue'),
      props: { slug: 'contact', defaultTitle: 'Contact Us' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/policy.vue'),
      props: { slug: 'about', defaultTitle: 'About Us' },
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('@/views/policy.vue'),
      props: { slug: 'faq', defaultTitle: 'Frequently Asked Questions' },
    },

    // Admin Routes
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/admin-login.vue'),
    },
    {
      path: '/admin',
      redirect: '/admin/dashboard',
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('@/views/admin/dashboard.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: () => import('@/views/admin/orders.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/orders/:id',
      name: 'admin-order-detail',
      component: () => import('@/views/admin/order-detail.vue'),
      meta: { requiresAdmin: true },
      props: true,
    },
    {
      path: '/admin/products',
      name: 'admin-products',
      component: () => import('@/views/admin/products.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/products/new',
      name: 'admin-product-create',
      component: () => import('@/views/admin/product-edit.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/products/:id/edit',
      name: 'admin-product-edit',
      component: () => import('@/views/admin/product-edit.vue'),
      meta: { requiresAdmin: true },
      props: true,
    },
    {
      path: '/admin/categories',
      name: 'admin-categories',
      component: () => import('@/views/admin/categories.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/suppliers',
      name: 'admin-suppliers',
      component: () => import('@/views/admin/suppliers.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/customers',
      name: 'admin-customers',
      component: () => import('@/views/admin/customers.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/coupons',
      name: 'admin-coupons',
      component: () => import('@/views/admin/coupons.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/reviews',
      name: 'admin-reviews',
      component: () => import('@/views/admin/reviews.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: () => import('@/views/admin/settings.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/audit',
      name: 'admin-audit',
      component: () => import('@/views/admin/audit.vue'),
      meta: { requiresAdmin: true },
    },

    // 404 Catch-All
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  
  if (to.meta.requiresAdmin) {
    if (!mainStore().isAdminLoggedIn) {
      return next({ name: 'admin-login', query: { redirect: to.fullPath } });
    }
  }

  if (to.meta.requiresAuth) {
    if (!mainStore().isCustomerLoggedIn) {
      return next({ name: 'login', query: { redirect: to.fullPath } });
    }
  }

  next();
});

export default router;
