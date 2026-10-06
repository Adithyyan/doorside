<template lang="pug">
StoreLayout
  div(class='bg-page min-h-screen py-10 sm:py-14')
    div(class='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-soft pb-6')
        div
          h1(class='heading-lg text-ink') Account Dashboard
          p(class='text-fine text-muted uppercase tracking-editorial mt-1')
            | Welcome back, 
            strong(class='text-ink') {{ mainStore().customer?.name }}
            |  ({{ mainStore().customer?.email }})
        
        div(class='flex items-center gap-2.5')
          router-link(class='btn-outline px-4 py-2', to='/account/profile')
            | Profile Settings
          button(class='btn-danger', @click='handleLogout')
            | Sign Out

      div(class='flex gap-8 border-b border-soft')
        router-link(class='tab-editorial tab-editorial-active', to='/account/orders') Order History
        router-link(class='tab-editorial', to='/account/profile') Addresses & Details

      div(v-if='orders.length > 0', class='space-y-4')
        div(v-for='order in orders', :key='order.id', class='panel-editorial p-6 space-y-4')
          div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-soft pb-4')
            div
              span(class='label-muted') Reference
              h3(class='heading-xs text-ink font-mono') {{ order.order_number }}
              p(class='text-fine text-muted uppercase tracking-editorial mt-0.5') Placed on {{ formatDate(order.created_at, true) }}
            
            div(class='flex items-center gap-3')
              span(class='badge-status-pending')
                | {{ getOrderStatusBadge(order.order_status).label }}
              
              span(class='text-body-sm font-bold text-ink') {{ formatPrice(order.total_amount_paisa) }}

          div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1')
            p(class='text-fine text-muted uppercase tracking-editorial')
              | Method: 
              strong(class='text-ink') {{ order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment' }}
              |  • {{ order.items_count || 1 }} items
            
            div(class='flex items-center gap-2')
              router-link(class='btn-outline px-4 py-2 text-fine', :to='{ name: "track-order", query: { orderNumber: order.order_number, contact: mainStore().customer?.email || mainStore().customer?.phone } }') Track Shipment 📦
              router-link(class='btn-primary px-4 py-2 text-fine', :to='`/account/orders/${order.id}`') View Details ›

      div(v-else-if='isLoading', class='py-20 text-center text-fine text-muted uppercase tracking-editorial')
        | Loading orders...

      div(v-else, class='panel-editorial p-16 text-center space-y-4 max-w-md mx-auto my-12')
        div(class='text-4xl') 📦
        h3(class='heading-md text-ink') No orders placed yet
        p(class='text-cap text-muted uppercase tracking-editorial')
          | Your order history will appear here once you make your first purchase.
        router-link(class='btn-primary mt-2', to='/shop')
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
