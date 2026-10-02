<template lang="pug">
StoreLayout
  div(class='bg-slate-50 min-h-screen py-8 sm:py-12')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      nav(class='flex text-xs font-normal text-slate-400 gap-2 items-center')
        router-link(class='hover:text-slate-700 hover:underline', to='/') Store
        span /
        span(class='text-slate-700 font-medium') {{ currentCategoryName || 'All Products' }}

      div(class='flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200')
        div
          h1(class='text-2xl sm:text-3xl font-black tracking-tight text-slate-900') {{ currentCategoryName || 'All Products' }}
          p(class='text-sm text-slate-500 mt-1') Showing {{ totalProducts }} products

        div(class='flex flex-wrap items-center gap-3')
          div(class='relative w-full sm:w-64')
            input(
              class='w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/15 transition-all',
              type='text',
              placeholder='Search products...',
              v-model='searchQuery',
              @input='debounceSearch'
            )
            span(class='absolute text-slate-400 text-xs left-3 top-2.5') 🔍

          select(
            class='px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:border-teal-600 focus:outline-none cursor-pointer transition-all',
            v-model='currentSortId',
            @change='handleSortChange'
          )
            option(v-for='opt in sortOptions', :key='opt.id', :value='opt.id') Sort: {{ opt.name }}

      div(class='grid grid-cols-1 gap-8 lg:grid-cols-4 items-start')
        aside(class='hidden space-y-4 lg:block')
          div(class='bg-white rounded-xl p-5 border border-slate-100 space-y-3')
            h3(class='text-xs font-bold text-slate-900 uppercase tracking-wider') Categories
            ul(class='space-y-1 text-xs')
              li
                button(
                  class='w-full text-left py-2 px-3 rounded-lg text-xs font-medium transition-all',
                  :class='!selectedCategory ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"',
                  @click='selectCategory(null)'
                ) All Categories
              li(v-for='cat in categories', :key='cat.id')
                button(
                  class='w-full text-left py-2 px-3 rounded-lg text-xs font-medium transition-all',
                  :class='selectedCategory === cat.slug ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"',
                  @click='selectCategory(cat.slug)'
                ) {{ cat.name }}

          div(v-for='filter in dynamicFilters', :key='filter.id', class='bg-white rounded-xl p-5 border border-slate-100 space-y-3')
            div(class='flex items-center justify-between')
              h3(class='text-xs font-bold text-slate-900 uppercase tracking-wider') {{ filter.name }}
              button(
                v-if='hasActiveValuesForFilter(filter.id)',
                class='text-[11px] font-semibold text-red-500 hover:underline',
                @click='clearFilterGroup(filter.id)'
              ) Reset

            ul(class='text-xs space-y-2.5')
              li(v-for='val in filter.values', :key='val.id')
                label(class='flex items-center justify-between cursor-pointer group select-none')
                  div(class='flex items-center gap-2.5')
                    input(
                      type='checkbox',
                      class='rounded border-slate-300 text-teal-600 focus:ring-0 w-4 h-4',
                      :checked='isFilterValueSelected(val.id)',
                      @change='toggleFilterValue(val.id)'
                    )
                    span(class='text-slate-500 group-hover:text-slate-900 transition-colors') {{ val.name }}
                  span(v-if='val.productCount !== undefined', class='text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full') {{ val.productCount }}

        div(class='lg:col-span-3 space-y-6')
          div(v-if='hasActiveFilters', class='flex flex-wrap items-center gap-2 p-3 bg-white rounded-xl border border-slate-100')
            span(class='text-xs text-slate-400') Filters:
            span(v-if='selectedCategory', class='inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs py-1 px-3 rounded-full font-medium')
              span {{ currentCategoryName }}
              button(class='text-slate-400 hover:text-red-500', @click='selectCategory(null)') ✕
            span(v-if='searchQuery', class='inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs py-1 px-3 rounded-full font-medium')
              span "{{ searchQuery }}"
              button(class='text-slate-400 hover:text-red-500', @click='clearSearch') ✕
            span(
              v-for='val in activeFilterValueList',
              :key='val.id',
              class='inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs py-1 px-3 rounded-full font-medium'
            )
              span {{ val.name }}
              button(class='text-slate-400 hover:text-red-500', @click='toggleFilterValue(val.id)') ✕

            button(class='text-xs font-semibold text-teal-700 hover:underline ml-auto', @click='clearAllFilters') Clear all

          div(v-if='products.length > 0', class='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5')
            ProductCard(v-for='product in products', :key='product.id', :product='product')

          div(v-else-if='isLoading', class='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5')
            div(v-for='n in 6', :key='n', class='bg-white rounded-2xl border border-slate-100 overflow-hidden')
              div(class='aspect-square bg-slate-100 animate-pulse')
              div(class='p-4 space-y-2')
                div(class='h-3 bg-slate-100 rounded animate-pulse w-1/3')
                div(class='h-4 bg-slate-100 rounded animate-pulse')
                div(class='h-6 bg-slate-100 rounded animate-pulse w-1/2 mt-2')

          div(v-else, class='p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 max-w-md mx-auto my-12')
            div(class='text-4xl') 🔍
            h3(class='text-lg font-bold text-slate-900') No products found
            p(class='text-xs text-slate-500 leading-relaxed') Try adjusting your filters or search terms.
            button(class='px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors mt-2', @click='clearAllFilters') Reset Filters

          div(v-if='totalPages > 1', class='flex items-center justify-between pt-6 border-t border-slate-200 text-xs text-slate-500')
            button(
              class='px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors',
              :disabled='currentPage <= 1',
              :class='currentPage <= 1 ? "opacity-40 cursor-not-allowed" : ""',
              @click='changePage(currentPage - 1)'
            ) ‹ Previous

            span Page {{ currentPage }} of {{ totalPages }}

            button(
              class='px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors',
              :disabled='currentPage >= totalPages',
              :class='currentPage >= totalPages ? "opacity-40 cursor-not-allowed" : ""',
              @click='changePage(currentPage + 1)'
            ) Next ›
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StoreLayout from '@/components/StoreLayout.vue';
import ProductCard from '@/components/ProductCard.vue';
import { api } from '@/helpers';

const route = useRoute();
const router = useRouter();

const products = ref([]);
const categories = ref([]);
const dynamicFilters = ref([]);
const sortOptions = ref([]);
const totalProducts = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const pageSize = 12;
const searchQuery = ref('');
const selectedCategory = ref(null);
const selectedFilterValueIds = ref(new Set());
const currentSortId = ref('');
const isLoading = ref(true);

let debounceTimeout = null;

const currentCategoryName = computed(() => {
  if (!selectedCategory.value) {
    return null;
  }
  return categories.value.find((c) => c.slug === selectedCategory.value)?.name || selectedCategory.value;
});

const hasActiveFilters = computed(() =>
  !!selectedCategory.value || !!searchQuery.value || selectedFilterValueIds.value.size > 0
);

const activeFilterValueList = computed(() => {
  const result = [];
  dynamicFilters.value.forEach((f) => {
    (f.values || []).forEach((v) => {
      if (selectedFilterValueIds.value.has(String(v.id))) {
        result.push(v);
      }
    });
  });
  return result;
});

function isFilterValueSelected(valId) {
  return selectedFilterValueIds.value.has(String(valId));
}

function hasActiveValuesForFilter(filterId) {
  const f = dynamicFilters.value.find((item) => item.id === filterId);
  return f?.values?.some((v) => selectedFilterValueIds.value.has(String(v.id))) ?? false;
}

function toggleFilterValue(valId) {
  const next = new Set(selectedFilterValueIds.value);
  const strId = String(valId);
  if (next.has(strId)) {
    next.delete(strId);
  } else {
    next.add(strId);
  }
  selectedFilterValueIds.value = next;
  currentPage.value = 1;
  fetchProducts();
}

function clearFilterGroup(filterId) {
  const f = dynamicFilters.value.find((item) => item.id === filterId);
  if (!f?.values) {
    return;
  }
  const next = new Set(selectedFilterValueIds.value);
  f.values.forEach((v) => {
    next.delete(String(v.id));
  });
  selectedFilterValueIds.value = next;
  currentPage.value = 1;
  fetchProducts();
}

function selectCategory(slug) {
  selectedCategory.value = slug;
  currentPage.value = 1;
  fetchProducts();
}

function debounceSearch() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchProducts();
  }, 350);
}

function clearSearch() {
  searchQuery.value = '';
  currentPage.value = 1;
  fetchProducts();
}

function handleSortChange() {
  currentPage.value = 1;
  fetchProducts();
}

function clearAllFilters() {
  searchQuery.value = '';
  selectedCategory.value = null;
  selectedFilterValueIds.value = new Set();
  currentPage.value = 1;
  fetchProducts();
}

function changePage(page) {
  currentPage.value = page;
  fetchProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadFiltersAndSort() {
  try {
    const res = await api.get('/products/filters');
    if (res.success && res.data) {
      dynamicFilters.value = res.data.filters || [];
      sortOptions.value = res.data.sortOptions || [];
      if (sortOptions.value.length > 0 && !currentSortId.value) {
        currentSortId.value = sortOptions.value[0].id;
      }
    }
  } catch {}
}

async function loadCategories() {
  try {
    const res = await api.get('/categories');
    if (res.success && res.data) {
      categories.value = res.data.categories || [];
    }
  } catch {}
}

async function fetchProducts() {
  isLoading.value = true;
  try {
    const params = new URLSearchParams();
    params.set('page', String(currentPage.value));
    params.set('pageSize', String(pageSize));
    if (selectedCategory.value) {
      params.set('category', selectedCategory.value);
    }
    if (searchQuery.value.trim()) {
      params.set('search', searchQuery.value.trim());
    }
    if (currentSortId.value) {
      params.set('sortId', currentSortId.value);
    }
    if (selectedFilterValueIds.value.size > 0) {
      params.set('filterValueIds', Array.from(selectedFilterValueIds.value).join(','));
    }

    const res = await api.get(`/products?${params.toString()}`);
    if (res.success && res.data) {
      products.value = res.data.products || res.data.items || [];
      totalProducts.value = res.data.pagination?.total || products.value.length;
      totalPages.value = res.data.pagination?.totalPages || 1;
    }
  } catch {
    products.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  if (route.query.category) {
    selectedCategory.value = route.query.category;
  }
  if (route.query.search) {
    searchQuery.value = route.query.search;
  }
  await Promise.all([loadCategories(), loadFiltersAndSort()]);
  await fetchProducts();
});

watch(() => route.query, (newQuery) => {
  if (newQuery.category !== undefined && newQuery.category !== selectedCategory.value) {
    selectedCategory.value = newQuery.category || null;
    fetchProducts();
  }
});
</script>
