<template lang="pug">
StoreLayout
  div(class='bg-[#f5f5f7] min-h-screen py-10 sm:py-14')
    div(class='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      // Account Header
      div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-6')
        div
          h1(class='text-3xl font-bold tracking-tight text-[#1d1d1f]') Account
          p(class='text-xs text-[#6e6e73] mt-1')
            | Welcome back, 
            strong(class='text-[#1d1d1f]') {{ mainStore().customer?.name }}
            |  ({{ mainStore().customer?.email }})
        
        div(class='flex items-center gap-2.5')
          router-link(class='apple-btn-secondary text-xs px-4 py-2', to='/account/profile')
            | Profile Settings
          button(class='apple-btn-secondary text-xs px-4 py-2 text-[#bf4800] hover:bg-[#fff0e6]', @click='handleLogout')
            | Sign Out

      // Tab Switcher
      div(class='flex gap-6 border-b border-[#e5e5ea] text-sm font-semibold')
        router-link(class='pb-3 border-b-2 border-[#1d1d1f] text-[#1d1d1f]', to='/account/orders') Order History
        router-link(class='pb-3 border-b-2 border-transparent text-[#86868b] hover:text-[#1d1d1f]', to='/account/profile') Addresses & Details

      // Orders List
      div(v-if='orders.length > 0', class='space-y-4')
        div(v-for='order in orders', :key='order.id', class='apple-card p-6 bg-white space-y-4')
          div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f5f5f7] pb-4')
            div
              span(class='text-2xs font-semibold text-[#86868b] uppercase tracking-wider') Reference
              h3(class='text-base font-bold text-[#1d1d1f] font-mono') {{ order.order_number }}
              p(class='text-xs text-[#6e6e73]') Placed on {{ formatDate(order.created_at, true) }}
            
            div(class='flex items-center gap-3')
              span(
                class='text-xs py-1 px-3 rounded-full font-medium border',
                :class='getOrderStatusBadge(order.order_status).bg'
              ) {{ getOrderStatusBadge(order.order_status).label }}
              
              span(class='text-sm font-bold text-[#1d1d1f]') {{ formatPrice(order.total_amount_paisa) }}

          div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1')
            p(class='text-xs text-[#6e6e73]')
              | Method: 
              strong(class='text-[#1d1d1f]') {{ order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment' }}
              |  • {{ order.items_count || 1 }} items
            
            div(class='flex items-center gap-2')
              router-link(
                class='apple-btn-secondary text-xs px-3.5 py-1.5',
                :to='{ name: "track-order", query: { orderNumber: order.order_number, contact: mainStore().customer?.email || mainStore().customer?.phone } }'
              ) Track Shipment 📦
              router-link(
                class='apple-btn-primary text-xs px-4 py-1.5',
                :to='`/account/orders/${order.id}`'
              ) View Details ›

      div(v-else-if='isLoading', class='py-20 text-center text-xs text-[#86868b]')
        | Loading orders...

      div(v-else, class='apple-card p-16 text-center bg-white space-y-4 max-w-md mx-auto my-12')
        div(class='text-4xl') 📦
        h3(class='text-lg font-bold text-[#1d1d1f]') No orders placed yet
        p(class='text-xs text-[#6e6e73]')
          | Your order history will appear here once you make your first purchase.
        router-link(class='apple-btn-primary text-xs inline-flex mt-2', to='/shop')
          | Start Shopping
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import StoreLayout from '@/components/StoreLayout.vue';
import { mainStore } from '@/store';
import { formatPrice, formatDate, getOrderStatusBadge, api } from '@/helpers';

const router = useRouter();

const orders = ref([]);
const isLoading = ref(true);

async function getOrders() {
  isLoading.value = true;
  try {
    const res = await api.get('/orders');
    if (res.success && res.data) {
      orders.value = res.data.orders || [];
    }
  } catch {
    orders.value = [];
  } finally {
    isLoading.value = false;
  }
}

async function handleLogout() {
  await mainStore().logout();
  router.push('/');
}

onMounted(() => {
  getOrders();
});
</script>
