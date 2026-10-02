<template lang="pug">
AdminLayout
  div(class='space-y-6')
    div(class='flex flex-col justify-between gap-4 sm:flex-row sm:items-center')
      div
        h1(class='text-2xl font-black text-slate-900 tracking-tight') Customers
        p(class='text-xs text-slate-500 mt-1') Directory of registered and guest shoppers with order history.
      
      div(class='relative w-full sm:w-72')
        input(
          class='w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900',
          type='text',
          v-model='searchQuery',
          placeholder='Search by name, email, or phone...',
          @keyup.enter='handleSearch'
        )
        span(class='absolute left-3 text-slate-400 text-xs top-2.5') 🔍

    div(
      v-if='selectedCustomer',
      class='fixed inset-0 bg-slate-900 bg-opacity-50 z-50 flex items-center justify-center p-4'
    )
      div(class='bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4')
        div(class='flex items-center justify-between border-b border-slate-100 pb-3')
          div
            h2(class='text-base font-black text-slate-900') {{ selectedCustomer.name }}
            p(class='text-xs text-slate-400') {{ selectedCustomer.email || 'No email' }} • {{ selectedCustomer.phone }}
          button(class='text-slate-400 hover:text-slate-600', @click='selectedCustomer = null') ✕

        div(class='space-y-3 text-xs')
          div(class='grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl')
            div
              span(class='text-2xs font-bold text-slate-400') Total Orders
              p(class='text-sm font-black text-slate-900') {{ selectedCustomer.total_orders || 0 }}
            div
              span(class='text-2xs font-bold text-slate-400') Total Spent
              p(class='text-sm font-black text-slate-900') {{ formatPrice(selectedCustomer.total_spent_paisa || 0) }}

          div
            h3(class='text-xs font-bold text-slate-900 mb-2') Saved Shipping Addresses
            div(v-if='customerAddresses.length > 0', class='space-y-2')
              div(
                v-for='addr in customerAddresses',
                :key='addr.id',
                class='p-3 rounded-xl bg-slate-50 border border-slate-200'
              )
                p(class='font-bold text-slate-800') {{ addr.name }} ({{ addr.phone }})
                p(class='text-slate-600') {{ addr.house_street }}{{ addr.area ? ', ' + addr.area : '' }}
                p(class='text-slate-600') {{ addr.city }}, {{ addr.state }} - {{ addr.pincode }}
            p(v-else, class='text-xs text-slate-400 py-2') No saved addresses on file.

        div(class='flex justify-end pt-2')
          button(
            class='px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold',
            @click='selectedCustomer = null'
          ) Close

    div(class='bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden')
      div(class='overflow-x-auto')
        table(class='w-full text-left border-collapse')
          thead(class='bg-slate-50 border-b border-slate-200 text-2xs font-bold text-slate-500 uppercase tracking-wider')
            tr
              th(class='px-6 py-3.5') Customer Name
              th(class='px-6 py-3.5') Contact Details
              th(class='px-6 py-3.5') Account Type
              th(class='px-6 py-3.5') Orders Placed
              th(class='px-6 py-3.5') Total Spent
              th(class='px-6 py-3.5') Joined Date
              th(class='px-6 py-3.5') Actions
          tbody(class='divide-y divide-slate-100 text-xs')
            tr(
              v-for='cust in customers',
              :key='cust.id',
              class='transition-colors hover:bg-slate-50'
            )
              td(class='py-4 px-6')
                div(class='font-extrabold text-slate-900') {{ cust.name }}
              td(class='py-4 px-6')
                div(class='text-slate-700 font-medium') {{ cust.phone || 'N/A' }}
                div(class='text-2xs text-slate-400') {{ cust.email || 'N/A' }}
              td(class='py-4 px-6')
                span(
                  class='text-2xs px-2 py-0.5 rounded-full font-bold',
                  :class='cust.is_guest ? "bg-slate-100 text-slate-600" : "bg-blue-100 text-blue-800"'
                ) {{ cust.is_guest ? 'Guest Shopper' : 'Registered Member' }}
              td(class='py-4 px-6 font-bold text-slate-800')
                | {{ cust.total_orders || 0 }}
              td(class='py-4 px-6 font-extrabold text-slate-900')
                | {{ formatPrice(cust.total_spent_paisa || 0) }}
              td(class='py-4 px-6 text-slate-500')
                | {{ formatDate(cust.created_at) }}
              td(class='py-4 px-6')
                button(
                  class='px-3 py-1 rounded-lg border border-slate-200 text-2xs font-bold text-slate-700 hover:bg-slate-100',
                  @click='viewCustomer(cust.id)'
                ) View Details →

            tr(v-if='customers.length === 0 && !isLoading')
              td(class='py-12 text-center text-slate-400', colspan='7')
                p(class='text-xs font-semibold') No customers found matching search.

            tr(v-if='isLoading')
              td(class='py-12 text-center text-slate-400', colspan='7')
                | Loading customers...

      div(v-if='totalPages > 1', class='p-4 border-t border-slate-100 flex items-center justify-between')
        span(class='text-xs text-slate-500') Page {{ currentPage }} of {{ totalPages }} ({{ totalCustomers }} customers)
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
import AdminLayout from '@/components/AdminLayout.vue';
import { api, formatPrice, formatDate } from '@/helpers';

const customers = ref([]);
const totalCustomers = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const pageSize = 15;
const isLoading = ref(true);
const searchQuery = ref('');

const selectedCustomer = ref(null);
const customerAddresses = ref([]);

function handleSearch() {
  currentPage.value = 1;
  getCustomers();
}

function changePage(page) {
  currentPage.value = page;
  getCustomers();
}

async function viewCustomer(id) {
  try {
    const res = await api.get(`/admin/customers/${id}`);
    if (res.success && res.data) {
      selectedCustomer.value = res.data.customer;
      customerAddresses.value = res.data.addresses || [];
    }
  } catch {
  }
}

async function getCustomers() {
  isLoading.value = true;
  try {
    let url = `/admin/customers?page=${currentPage.value}&pageSize=${pageSize}`;
    if (searchQuery.value.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.value.trim())}`;
    }
    const res = await api.get(url);
    if (res.success && res.data) {
      customers.value = res.data.items || [];
      totalCustomers.value = res.data.total || 0;
      totalPages.value = res.data.totalPages || 1;
    }
  } catch {
    customers.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getCustomers();
});
</script>
