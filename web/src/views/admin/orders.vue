<template lang="pug">
AdminLayout
  div(class='space-y-6')
    div(class='flex flex-col justify-between gap-4 sm:flex-row sm:items-center')
      div
        h1(class='text-2xl font-black text-slate-900 tracking-tight') Orders & Fulfillment
        p(class='text-xs text-slate-500 mt-1') Manage customer orders, supplier placements, and shipment tracking.
      
      div(class='flex items-center gap-2')
        button(
          class='px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800',
          @click='getOrders'
        ) 🔄 Refresh

    div(class='flex gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold')
      button(
        v-for='tab in filterTabs',
        :key='tab.id',
        class='px-3 py-2 rounded-lg transition-colors',
        :class='activeFilter === tab.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"',
        @click='selectFilter(tab.id)'
      )
        span {{ tab.label }}
        span(
          v-if='tab.badge',
          class='rounded-full text-2xs ml-1.5 px-1.5 py-0.5',
          :class='activeFilter === tab.id ? "bg-amber-400 text-slate-950" : "bg-slate-200 text-slate-700"'
        ) {{ tab.badge }}

    div(class='bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center justify-between gap-4 sm:flex-row')
      div(class='relative flex-1 w-full sm:max-w-md')
        input(
          class='w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900',
          type='text',
          v-model='searchQuery',
          placeholder='Search by order #, customer name, or phone...',
          @keyup.enter='handleSearch'
        )
        span(class='absolute left-3 text-slate-400 text-xs top-2.5') 🔍

      div(class='flex items-center gap-3 w-full sm:w-auto')
        select(
          class='px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700',
          v-model='paymentStatusFilter',
          @change='getOrders'
        )
          option(value='') All Payment Statuses
          option(value='paid') Paid
          option(value='pending') Pending (COD)
          option(value='failed') Failed

    div(class='bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden')
      div(class='overflow-x-auto')
        table(class='w-full text-left border-collapse')
          thead(class='bg-slate-50 border-b border-slate-200 text-2xs font-bold text-slate-500 uppercase tracking-wider')
            tr
              th(class='px-6 py-3.5') Order Number
              th(class='px-6 py-3.5') Customer
              th(class='px-6 py-3.5') Date
              th(class='px-6 py-3.5') Items
              th(class='px-6 py-3.5') Total & Payment
              th(class='px-6 py-3.5') Fulfillment Status
              th(class='px-6 py-3.5') Action
          tbody(class='divide-y divide-slate-100 text-xs')
            tr(
              v-for='order in orders',
              :key='order.id',
              class='transition-colors hover:bg-slate-50'
            )
              td(class='py-4 px-6')
                router-link(class='font-black text-slate-900 block hover:text-blue-600', :to='`/admin/orders/${order.id}`')
                  | {{ order.order_number }}
                span(class='text-2xs text-slate-400 block') {{ order.order_status }}

              td(class='py-4 px-6')
                div(class='font-bold text-slate-800') {{ order.customer_name }}
                div(class='text-2xs text-slate-500') {{ order.customer_phone }}
                div(class='text-2xs text-slate-400') {{ order.shipping_city }}, {{ order.shipping_state }}

              td(class='py-4 px-6 text-slate-500 whitespace-nowrap')
                | {{ formatDate(order.created_at, true) }}

              td(class='py-4 px-6')
                span(class='font-semibold text-slate-700') {{ order.item_count || 1 }} items

              td(class='py-4 px-6')
                div(class='font-extrabold text-slate-900') {{ formatPrice(order.total_amount_paisa) }}
                div(class='flex items-center gap-1.5 mt-0.5')
                  span(
                    class='text-2xs font-bold uppercase rounded px-1.5 py-0.5',
                    :class='order.payment_method === "cod" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"'
                  ) {{ order.payment_method }}
                  span(class='text-2xs text-slate-500') ({{ order.payment_status }})

              td(class='py-4 px-6')
                span(
                  class='inline-flex items-center gap-1 text-2xs py-1 px-2.5 rounded-full font-bold',
                  :class='getFulfillmentBadge(order.fulfillment_status)'
                )
                  span {{ getFulfillmentIcon(order.fulfillment_status) }}
                  span {{ order.fulfillment_status }}

              td(class='py-4 px-6')
                router-link(
                  class='inline-block px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold transition-colors hover:bg-amber-400 hover:text-slate-950',
                  :to='`/admin/orders/${order.id}`'
                )
                  span(v-if='order.fulfillment_status === "unfulfilled"') Fulfill Now ⚡
                  span(v-else) Manage →

            tr(v-if='orders.length === 0 && !isLoading')
              td(class='py-12 text-center text-slate-400', colspan='7')
                div(class='text-3xl mb-2') 📦
                p(class='text-xs font-semibold') No orders match your selected filters.

            tr(v-if='isLoading')
              td(class='py-12 text-center text-slate-400', colspan='7')
                | Loading orders...

      div(v-if='totalPages > 1', class='p-4 border-t border-slate-100 flex items-center justify-between')
        span(class='text-xs text-slate-500') Page {{ currentPage }} of {{ totalPages }} ({{ totalOrders }} total orders)
        div(class='flex items-center gap-2')
          button(
            class='px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40',
            :disabled='currentPage <= 1',
            @click='changePage(currentPage - 1)'
          ) Previous
          button(
            class='px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40',
            :disabled='currentPage >= totalPages',
            @click='changePage(currentPage + 1)'
          ) Next
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AdminLayout from '@/components/AdminLayout.vue';
import { api, formatPrice, formatDate } from '@/helpers';

const route = useRoute();

const orders = ref([]);
const totalOrders = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const pageSize = 15;
const isLoading = ref(true);

const searchQuery = ref('');
const activeFilter = ref(route.query.fulfillmentStatus || 'all');
const paymentStatusFilter = ref('');

const filterTabs = [
  { id: 'all', label: 'All Orders' },
  { id: 'unfulfilled', label: 'Pending Supplier Placement ⚠️' },
  { id: 'supplier_ordered', label: 'Supplier Ordered (Waiting Tracking)' },
  { id: 'shipped', label: 'Shipped & In Transit' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

function selectFilter(filterId) {
  activeFilter.value = filterId;
  currentPage.value = 1;
  getOrders();
}

function handleSearch() {
  currentPage.value = 1;
  getOrders();
}

function changePage(page) {
  currentPage.value = page;
  getOrders();
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
  return 'bg-amber-100 text-amber-900 border border-amber-300';
}

function getFulfillmentIcon(status) {
  if (status === 'delivered') {
    return '✅';
  }
  if (status === 'shipped') {
    return '🚚';
  }
  if (status === 'supplier_ordered') {
    return '🛒';
  }
  return '⚠️';
}

async function getOrders() {
  isLoading.value = true;
  try {
    let url = `/admin/orders?page=${currentPage.value}&pageSize=${pageSize}`;
    if (activeFilter.value && activeFilter.value !== 'all') {
      url += `&fulfillmentStatus=${activeFilter.value}`;
    }
    if (searchQuery.value.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.value.trim())}`;
    }
    if (paymentStatusFilter.value) {
      url += `&paymentStatus=${paymentStatusFilter.value}`;
    }

    const res = await api.get(url);
    if (res.success && res.data) {
      orders.value = res.data.items || [];
      totalOrders.value = res.data.total || 0;
      totalPages.value = res.data.totalPages || 1;
    }
  } catch {
    orders.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  if (route.query.fulfillmentStatus) {
    activeFilter.value = route.query.fulfillmentStatus;
  }
  getOrders();
});
</script>
