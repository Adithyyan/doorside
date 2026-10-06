<template lang="pug">
AdminLayout
  div(class='space-y-6')
    div(class='flex flex-col justify-between gap-4 sm:flex-row sm:items-center')
      div
        h1(class='text-2xl font-black text-slate-900 tracking-tight') Product Catalog
        p(class='text-xs text-slate-500 mt-1') Manage store merchandise, supplier links, retail prices, and stock inventory.
      
      div(class='flex items-center gap-3')
        router-link(class='btn-primary px-4 py-2 rounded-xl text-xs font-bold', to='/admin/products/new') + Add New Product

    div(class='bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center justify-between gap-4 sm:flex-row')
      div(class='relative flex-1 w-full sm:max-w-md')
        input(class='w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900', type='text', v-model='searchQuery', placeholder='Search products by title, SKU, or supplier...', @keyup.enter='handleSearch')
        span(class='absolute left-3 text-slate-400 text-xs top-2.5') 🔍

      div(class='flex items-center gap-3 w-full sm:w-auto')
        select(class='px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700', v-model='categoryFilter', @change='getProducts')
          option(value='') All Categories
          option(v-for='cat in categories', :key='cat.id', :value='cat.id') {{ cat.name }}

        select(class='px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700', v-model='statusFilter', @change='getProducts')
          option(value='') All Statuses
          option(value='active') Active Only
          option(value='inactive') Inactive / Drafts

    div(class='bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden')
      div(class='overflow-x-auto')
        table(class='w-full text-left border-collapse')
          thead(class='bg-slate-50 border-b border-slate-200 text-2xs font-bold text-slate-500 uppercase tracking-wider')
            tr
              th(class='px-6 py-3.5') Product
              th(class='px-6 py-3.5') Category
              th(class='px-6 py-3.5') Retail Price
              th(class='px-6 py-3.5') Estimated Cost & Margin
              th(class='px-6 py-3.5') Inventory Stock
              th(class='px-6 py-3.5') Status
              th(class='px-6 py-3.5') Actions
          tbody(class='divide-y divide-slate-100 text-xs')
            tr(v-for='product in products', :key='product.id', class='transition-colors hover:bg-slate-50')
              td(class='py-4 px-6')
                div(class='flex items-center gap-3')
                  img(class='w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200', :src='product.primary_image_url || "/placeholder.png"', :alt='product.title')
                  div
                    router-link(class='font-extrabold text-slate-900 block hover:text-blue-600', :to='`/admin/products/${product.id}/edit`') {{ product.title }}
                    div(class='flex items-center gap-2 mt-0.5')
                      span(class='text-2xs text-slate-400') SKU: {{ product.sku || 'N/A' }}
                      span(v-if='product.is_featured', class='text-2xs rounded bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5') Featured

              td(class='py-4 px-6 text-slate-600')
                | {{ product.category_name || 'Uncategorized' }}

              td(class='py-4 px-6')
                div(class='font-black text-slate-900') {{ formatPrice(product.retail_price_paisa) }}
                span(v-if='product.compare_at_price_paisa > product.retail_price_paisa', class='text-2xs text-slate-400 line-through') {{ formatPrice(product.compare_at_price_paisa) }}

              td(class='py-4 px-6')
                div(class='font-semibold text-slate-700') {{ product.cost_price_paisa ? formatPrice(product.cost_price_paisa) : 'N/A' }}
                span(v-if='product.cost_price_paisa && product.retail_price_paisa > product.cost_price_paisa', class='text-2xs font-bold text-emerald-600') {{ calculateMargin(product.retail_price_paisa, product.cost_price_paisa) }}% Margin

              td(class='py-4 px-6')
                div(class='flex items-center gap-2')
                  span(class='font-bold', :class='product.stock_quantity <= (product.low_stock_threshold || 5) ? "text-rose-600" : "text-slate-800"') {{ product.stock_quantity }}
                  span(v-if='product.stock_quantity <= (product.low_stock_threshold || 5)', class='text-2xs rounded-full bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5') LOW

              td(class='py-4 px-6')
                span(class='text-2xs px-2 py-0.5 rounded-full font-bold', :class='product.is_active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"') {{ product.is_active ? 'Active' : 'Draft' }}

              td(class='py-4 px-6')
                div(class='flex items-center gap-2')
                  router-link(class='rounded-lg border border-slate-200 text-slate-700 font-semibold p-1.5 hover:bg-slate-100', :to='`/admin/products/${product.id}/edit`', title='Edit Product') ✏️ Edit
                  button(class='rounded-lg border border-rose-200 text-rose-600 p-1.5 hover:bg-rose-50', @click='deleteProduct(product.id)', title='Delete Product') 🗑️

            tr(v-if='products.length === 0 && !isLoading')
              td(class='py-12 text-center text-slate-400', colspan='7')
                div(class='text-3xl mb-2') 🏷️
                p(class='text-xs font-semibold') No products found. Click "+ Add New Product" to create one.

            tr(v-if='isLoading')
              td(class='py-12 text-center text-slate-400', colspan='7')
                | Loading products catalog...

      div(v-if='totalPages > 1', class='p-4 border-t border-slate-100 flex items-center justify-between')
        span(class='text-xs text-slate-500') Page {{ currentPage }} of {{ totalPages }} ({{ totalProducts }} products)
        div(class='flex items-center gap-2')
          button(class='px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40', :disabled='currentPage <= 1', @click='changePage(currentPage - 1)') Previous
          button(class='px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40', :disabled='currentPage >= totalPages', @click='changePage(currentPage + 1)') Next
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/components/AdminLayout.vue';
import { mainStore } from '@/store';
import { api, formatPrice } from '@/helpers';


const products = ref([]);
const categories = ref([]);
const totalProducts = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const pageSize = 15;
const isLoading = ref(true);

const searchQuery = ref('');
const categoryFilter = ref('');
const statusFilter = ref('');

function calculateMargin(retail, cost) {
  if (!retail || !cost || retail <= 0) {
    return 0;
  }
  return Math.round(((retail - cost) / retail) * 100);
}

function handleSearch() {
  currentPage.value = 1;
  getProducts();
}

function changePage(page) {
  currentPage.value = page;
  getProducts();
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }
  try {
    const res = await api.delete(`/admin/products/${id}`);
    if (res.success) {
      mainStore().toast('Product deleted successfully', 'info');
      await getProducts();
    }
  } catch (err) {
    mainStore().toast(err.message || 'Failed to delete product', 'error');
  }
}

async function getProducts() {
  isLoading.value = true;
  try {
    let url = `/admin/products?page=${currentPage.value}&pageSize=${pageSize}`;
    if (searchQuery.value.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.value.trim())}`;
    }
    if (categoryFilter.value) {
      url += `&categoryId=${categoryFilter.value}`;
    }
    if (statusFilter.value) {
      url += `&isActive=${statusFilter.value === 'active'}`;
    }

    const [prodRes, catRes] = await Promise.all([
      api.get(url),
      api.get('/categories'),
    ]);

    if (prodRes.success && prodRes.data) {
      products.value = prodRes.data.items || [];
      totalProducts.value = prodRes.data.total || 0;
      totalPages.value = prodRes.data.totalPages || 1;
    }

    if (catRes.success && catRes.data) {
      categories.value = catRes.data.categories || [];
    }
  } catch {
    products.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getProducts();
});
</script>
