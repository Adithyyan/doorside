<template lang="pug">
StoreLayout
  div(class='bg-slate-50 min-h-screen py-10 sm:py-14')
    div(class='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6')
        div
          h1(class='text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900') Account Dashboard
          p(class='text-xs text-slate-500 mt-1')
            | Welcome back, 
            strong(class='text-slate-800') {{ mainStore().customer?.name }}
            |  ({{ mainStore().customer?.email }})
        
        div(class='flex items-center gap-2.5')
          router-link(class='px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors', to='/account/profile')
            | Profile Settings
          button(class='px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors', @click='handleLogout')
            | Sign Out

      div(class='flex gap-6 border-b border-slate-200 text-sm font-semibold')
        router-link(class='pb-3 border-b-2 border-teal-600 text-teal-700', to='/account/orders') Order History
        router-link(class='pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800', to='/account/profile') Addresses & Details

      div(v-if='orders.length > 0', class='space-y-4')
        div(v-for='order in orders', :key='order.id', class='p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4')
          div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4')
            div
              span(class='text-2xs font-semibold text-slate-400 uppercase tracking-wider') Reference
              h3(class='text-base font-bold text-slate-900 font-mono') {{ order.order_number }}
              p(class='text-xs text-slate-500') Placed on {{ formatDate(order.created_at, true) }}
            
            div(class='flex items-center gap-3')
              span(
                class='text-xs py-1 px-3 rounded-full font-medium border',
                :class='getOrderStatusBadge(order.order_status).bg'
              ) {{ getOrderStatusBadge(order.order_status).label }}
              
              span(class='text-sm font-bold text-slate-900') {{ formatPrice(order.total_amount_paisa) }}

          div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1')
            p(class='text-xs text-slate-500')
              | Method: 
              strong(class='text-slate-800') {{ order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment' }}
              |  • {{ order.items_count || 1 }} items
            
            div(class='flex items-center gap-2')
              router-link(
                class='px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors',
                :to='{ name: "track-order", query: { orderNumber: order.order_number, contact: mainStore().customer?.email || mainStore().customer?.phone } }'
              ) Track Shipment 📦
              router-link(
                class='px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors',
                :to='`/account/orders/${order.id}`'
              ) View Details ›

      div(v-else-if='isLoading', class='py-20 text-center text-xs text-slate-400')
        | Loading orders...

      div(v-else, class='p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-md mx-auto my-12')
        div(class='text-4xl') 📦
        h3(class='text-lg font-bold text-slate-900') No orders placed yet
        p(class='text-xs text-slate-500')
          | Your order history will appear here once you make your first purchase.
        router-link(class='px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all inline-flex mt-2', to='/shop')
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
