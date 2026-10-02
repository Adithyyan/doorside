<template lang="pug">
AdminLayout
  div(class='space-y-8')
    div(class='flex flex-col justify-between gap-4 sm:flex-row sm:items-center')
      div
        h1(class='text-2xl font-black text-slate-900 tracking-tight') Operations Dashboard
        p(class='text-xs text-slate-500 mt-1') Real-time store performance, revenue, and pending fulfillment queue.
      
      div(class='flex items-center gap-3')
        router-link(
          class='px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold transition-colors hover:bg-slate-800',
          to='/admin/products/new'
        ) + Add Product
        router-link(
          class='px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-black transition-colors hover:bg-amber-300',
          to='/admin/orders?fulfillmentStatus=unfulfilled'
        ) ⚡ Process Fulfillment ({{ stats.pendingFulfillment || 0 }})

    div(class='grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-6')
      div(class='bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs')
        div(class='flex items-center justify-between mb-3')
          span(class='text-xs font-bold text-slate-500') Today's Revenue
          span(class='p-2 rounded-xl bg-emerald-50 text-emerald-600 text-sm') 💰
        div(class='text-2xl font-black text-slate-900') {{ formatPrice(stats.todayRevenuePaisa || 0) }}
        p(class='text-2xs text-slate-400 mt-1') Gross sales today

      div(class='bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs')
        div(class='flex items-center justify-between mb-3')
          span(class='text-xs font-bold text-slate-500') Today's Orders
          span(class='p-2 rounded-xl bg-blue-50 text-blue-600 text-sm') 🛍️
        div(class='text-2xl font-black text-slate-900') {{ stats.todayOrders || 0 }}
        p(class='text-2xs text-slate-400 mt-1') Orders placed today

      div(class='bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50 shadow-2xs')
        div(class='flex items-center justify-between mb-3')
          span(class='text-xs font-black text-amber-900') Pending Fulfillment
          span(class='p-2 rounded-xl bg-amber-200 text-amber-900 text-sm') 📦
        div(class='text-2xl font-black text-amber-950') {{ stats.pendingFulfillment || 0 }}
        router-link(
          class='text-2xs font-bold text-amber-800 mt-1 inline-block hover:underline',
          to='/admin/orders?fulfillmentStatus=unfulfilled'
        ) Needs supplier placement →

      div(class='bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs')
        div(class='flex items-center justify-between mb-3')
          span(class='text-xs font-bold text-slate-500') Shipped & In-Transit
          span(class='p-2 rounded-xl bg-purple-50 text-purple-600 text-sm') 🚚
        div(class='text-2xl font-black text-slate-900') {{ stats.shippedOrders || 0 }}
        p(class='text-2xs text-slate-400 mt-1') Out for delivery

    div(class='grid grid-cols-1 gap-6 lg:grid-cols-2')
      div(class='bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs')
        div(class='flex items-center justify-between mb-4')
          div(class='flex items-center gap-2')
            span(class='text-base') ⚠️
            h2(class='text-sm font-extrabold text-slate-900') Low Stock Products
          span(
            v-if='lowStockProducts.length > 0',
            class='text-2xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700'
          ) {{ lowStockProducts.length }} items
        
        div(v-if='lowStockProducts.length > 0', class='space-y-3')
          div(
            v-for='prod in lowStockProducts',
            :key='prod.id',
            class='flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100'
          )
            div
              h3(class='text-xs font-bold text-slate-800') {{ prod.title }}
              p(class='text-2xs text-slate-400') SKU: {{ prod.sku || 'N/A' }}
            div(class='flex items-center gap-3')
              span(class='text-xs font-black text-rose-600') {{ prod.stock_quantity }} left
              router-link(
                class='text-2xs font-bold text-slate-600 underline hover:text-slate-900',
                :to='`/admin/products/${prod.id}/edit`'
              ) Restock
        div(v-else, class='text-center py-6 text-xs text-slate-400')
          | All products are well stocked 👍

      div(class='bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs')
        div(class='flex items-center justify-between mb-4')
          div(class='flex items-center gap-2')
            span(class='text-base') 🏆
            h2(class='text-sm font-extrabold text-slate-900') Top Selling Products
          router-link(class='text-2xs font-bold text-blue-600 hover:underline', to='/admin/products') View all
        
        div(v-if='topSellingProducts.length > 0', class='space-y-3')
          div(
            v-for='prod in topSellingProducts',
            :key='prod.id',
            class='flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100'
          )
            div
              h3(class='text-xs font-bold text-slate-800') {{ prod.title }}
              p(class='text-2xs text-slate-400') {{ formatPrice(prod.retail_price_paisa) }}
            div(class='text-right')
              span(class='text-xs font-black text-slate-900') {{ prod.total_units_sold || prod.sales_count || 0 }} sold
              p(class='text-2xs text-slate-400') Units
        div(v-else, class='text-center py-6 text-xs text-slate-400')
          | No sales recorded yet.

    div(class='bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden')
      div(class='p-6 border-b border-slate-100 flex items-center justify-between')
        div
          h2(class='text-base font-extrabold text-slate-900') Recent Customer Orders
          p(class='text-xs text-slate-500') Latest orders across all channels
        router-link(class='text-xs font-bold text-blue-600 hover:underline', to='/admin/orders')
          | View All Orders →

      div(class='overflow-x-auto')
        table(class='w-full text-left border-collapse')
          thead(class='bg-slate-50 border-b border-slate-200 text-2xs font-bold text-slate-500 uppercase tracking-wider')
            tr
              th(class='py-3 px-6') Order Number
              th(class='py-3 px-6') Customer
              th(class='py-3 px-6') Date
              th(class='py-3 px-6') Amount
              th(class='py-3 px-6') Payment
              th(class='py-3 px-6') Fulfillment
              th(class='py-3 px-6') Actions
          tbody(class='divide-y divide-slate-100 text-xs')
            tr(
              v-for='order in recentOrders',
              :key='order.id',
              class='transition-colors hover:bg-slate-50'
            )
              td(class='py-4 px-6 font-bold text-slate-900')
                router-link(class='hover:text-blue-600', :to='`/admin/orders/${order.id}`')
                  | {{ order.order_number }}
              td(class='py-4 px-6')
                div(class='font-semibold text-slate-800') {{ order.customer_name }}
                div(class='text-2xs text-slate-400') {{ order.customer_phone }}
              td(class='py-4 px-6 text-slate-500') {{ formatDate(order.created_at) }}
              td(class='py-4 px-6 font-bold text-slate-900') {{ formatPrice(order.total_amount_paisa) }}
              td(class='py-4 px-6')
                span(
                  class='text-2xs px-2 py-0.5 rounded-full font-bold',
                  :class='getPaymentBadge(order.payment_status)'
                ) {{ order.payment_status }}
              td(class='py-4 px-6')
                span(
                  class='text-2xs px-2 py-0.5 rounded-full font-bold',
                  :class='getFulfillmentBadge(order.fulfillment_status)'
                ) {{ order.fulfillment_status }}
              td(class='py-4 px-6')
                router-link(
                  class='px-3 py-1 rounded-lg bg-slate-900 text-white text-2xs font-bold hover:bg-slate-800',
                  :to='`/admin/orders/${order.id}`'
                ) Fulfill →
            
            tr(v-if='recentOrders.length === 0')
              td(class='py-8 text-center text-slate-400', colspan='7')
                | No orders found yet.
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/components/AdminLayout.vue';
import { api, formatPrice, formatDate } from '@/helpers';

const stats = ref({});
const lowStockProducts = ref([]);
const topSellingProducts = ref([]);
const recentOrders = ref([]);
const isLoading = ref(true);

function getPaymentBadge(status) {
  if (status === 'paid') {
    return 'bg-emerald-100 text-emerald-800';
  }
  if (status === 'pending') {
    return 'bg-amber-100 text-amber-800';
  }
  return 'bg-rose-100 text-rose-800';
}

function getFulfillmentBadge(status) {
  if (status === 'delivered') {
    return 'bg-emerald-100 text-emerald-800';
  }
  if (status === 'shipped') {
    return 'bg-purple-100 text-purple-800';
  }
  if (status === 'supplier_ordered') {
    return 'bg-blue-100 text-blue-800';
  }
  return 'bg-amber-100 text-amber-800';
}

onMounted(async () => {
  try {
    const [dashRes, ordersRes] = await Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/orders?pageSize=5'),
    ]);

    if (dashRes.success && dashRes.data) {
      stats.value = dashRes.data.stats || {};
      lowStockProducts.value = dashRes.data.lowStockProducts || [];
      topSellingProducts.value = dashRes.data.topSellingProducts || [];
    }

    if (ordersRes.success && ordersRes.data) {
      recentOrders.value = ordersRes.data.items || [];
    }
  } catch {
    // If empty DB, display empty values
  } finally {
    isLoading.value = false;
  }
});
</script>
