<template lang="pug">
div(class='admin-layout min-h-screen bg-slate-100 flex')
  div(
    v-if='sidebarOpen',
    class='fixed inset-0 bg-slate-900 bg-opacity-50 z-40 lg:hidden',
    @click='sidebarOpen = false'
  )

  aside(
    class='fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 lg:translate-x-0',
    :class='sidebarOpen ? "translate-x-0" : "-translate-x-full"'
  )
    div(class='h-16 flex items-center justify-between px-6 border-b border-slate-800')
      router-link(class='flex items-center gap-2 text-white font-black tracking-tight', to='/admin/dashboard')
        span(class='text-amber-400 text-xl') ⚡
        span(class='text-base font-extrabold') {{ mainStore().brandName || 'Store' }}
        span(class='text-2xs bg-slate-800 text-amber-400 font-bold px-2 py-0.5 rounded border border-slate-700') ADMIN
      button(class='text-slate-400 lg:hidden hover:text-white', @click='sidebarOpen = false')
        IconClose(class='w-5 h-5')

    nav(class='flex-1 px-3 py-4 space-y-1 overflow-y-auto')
      router-link(
        v-for='item in navItems',
        :key='item.path',
        class='flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors',
        :to='item.path',
        :class='isActive(item.path) ? "bg-amber-400 text-slate-950 font-black" : "hover:bg-slate-800 text-slate-300 hover:text-white"',
        @click='sidebarOpen = false'
      )
        span(class='text-base') {{ item.icon }}
        span {{ item.label }}
        span(
          v-if='item.badge && item.badge > 0',
          class='ml-auto bg-rose-500 text-white text-2xs rounded-full px-1.5 py-0.5'
        ) {{ item.badge }}

    div(class='p-4 border-t border-slate-800')
      a(
        class='flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold transition-colors hover:bg-slate-700',
        href='/',
        target='_blank'
      )
        span 🛍️ View Storefront
        IconExternal(class='w-3.5 h-3.5')

  div(class='flex-1 flex flex-col lg:pl-64')
    header(class='sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8')
      div(class='flex items-center gap-3')
        button(
          class='p-2 text-slate-600 rounded-lg lg:hidden hover:text-slate-900',
          @click='sidebarOpen = true',
          aria-label='Open sidebar'
        )
          IconMenu(class='w-6 h-6')
        
        div
          h2(class='text-sm font-bold text-slate-800') Administration Portal
          p(class='text-2xs text-slate-400') {{ $brandName }} Operations & Fulfillment

      div(class='flex items-center gap-4')
        div(class='hidden items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 sm:flex')
          span(class='w-2 h-2 rounded-full bg-emerald-500')
          span(class='text-xs font-semibold text-slate-700') {{ mainStore().adminUser?.name || 'Administrator' }}
          span(class='text-2xs text-slate-400') ({{ mainStore().adminUser?.role || 'Admin' }})

        button(
          class='px-3 py-1.5 text-xs font-bold text-rose-600 rounded-xl border border-rose-200 transition-colors hover:bg-rose-50',
          @click='handleLogout'
        ) Logout

    main(class='flex-1 p-4 sm:p-6 lg:p-8')
      slot
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { mainStore } from '@/store';
import IconClose from '@/components/icons/close.vue';
import IconMenu from '@/components/icons/menu.vue';
import IconExternal from '@/components/icons/external.vue';

const route = useRoute();
const router = useRouter();

const sidebarOpen = ref(false);

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  { label: 'Orders & Fulfillment', path: '/admin/orders', icon: '📦' },
  { label: 'Products', path: '/admin/products', icon: '🏷️' },
  { label: 'Categories', path: '/admin/categories', icon: '🗂️' },
  { label: 'Suppliers', path: '/admin/suppliers', icon: '🏭' },
  { label: 'Customers', path: '/admin/customers', icon: '👥' },
  { label: 'Coupons & Promo', path: '/admin/coupons', icon: '🎟️' },
  { label: 'Customer Reviews', path: '/admin/reviews', icon: '⭐' },
  { label: 'Store Settings', path: '/admin/settings', icon: '⚙️' },
  { label: 'Audit Trail', path: '/admin/audit', icon: '📜' },
];

function isActive(path) {
  if (path === '/admin/dashboard') {
    return route.path === '/admin/dashboard' || route.path === '/admin';
  }
  return route.path.startsWith(path);
}

async function handleLogout() {
  await mainStore().adminLogout();
  router.push('/admin/login');
}
</script>
