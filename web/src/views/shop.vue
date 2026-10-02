<template lang="pug">
StoreLayout
  div(class='bg-[#f5f5f7] min-h-screen py-8 sm:py-12')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      // Breadcrumb Navigation
      nav(class='flex text-xs font-normal text-[#86868b] gap-2 items-center')
        router-link(class='hover:text-[#1d1d1f] hover:underline', to='/') Store
        span /
        span(class='text-[#1d1d1f] font-medium') {{ currentCategoryName || 'All Products' }}
      
      // Page Header Row
      div(class='flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[#e5e5ea]')
        div
          h1(class='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1d1d1f]')
            | {{ currentCategoryName || 'All Products' }}
          p(class='text-sm text-[#6e6e73] mt-2')
            | Showing {{ totalProducts }} curated essentials engineered for quality and longevity.

        // Search & Dynamic Sort Bar
        div(class='flex flex-wrap items-center gap-3')
          div(class='relative w-full sm:w-64')
            input(
              class='w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#d2d2d7] rounded-full text-[#1d1d1f] placeholder:text-[#86868b] focus:border-[#0071e3] focus:outline-hidden transition-all',
              type='text',
              placeholder='Search collection...',
              v-model='searchQuery',
              @input='debounceSearch'
            )
            span(class='absolute text-[#86868b] text-xs left-3 top-2.5') 🔍

          div(class='relative')
            select(
              class='px-4 py-2 text-xs bg-white border border-[#d2d2d7] rounded-full text-[#1d1d1f] font-medium focus:border-[#0071e3] focus:outline-hidden cursor-pointer transition-all shadow-2xs',
              v-model='currentSortId',
              @change='handleSortChange'
            )
              option(
                v-for='opt in sortOptions',
                :key='opt.id',
                :value='opt.id'
              ) Sort: {{ opt.name }}

      // Content Grid: [Filter Sidebar] [Product Cards Grid]
      div(class='grid grid-cols-1 gap-8 lg:grid-cols-4 items-start')
        // Left Filter Column (Apple Style Sidebar)
        aside(class='hidden space-y-5 lg:block')
          // Categories Filter Card
          div(class='apple-card p-5 bg-white space-y-3')
            h3(class='text-xs font-bold text-[#1d1d1f] uppercase tracking-wider') Categories
            ul(class='space-y-1.5 text-xs')
              li
                button(
                  class='w-full text-left py-2 px-3 rounded-full text-xs font-medium transition-all',
                  :class='!selectedCategory ? "bg-[#1d1d1f] text-white" : "text-[#6e6e73] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"',
                  @click='selectCategory(null)'
                ) All Categories
              li(v-for='cat in categories', :key='cat.id')
                button(
                  class='w-full text-left py-2 px-3 rounded-full text-xs font-medium transition-all',
                  :class='selectedCategory === cat.slug ? "bg-[#1d1d1f] text-white" : "text-[#6e6e73] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"',
                  @click='selectCategory(cat.slug)'
                ) {{ cat.name }}

          // Dynamic Filters
          div(
            v-for='filter in dynamicFilters',
            :key='filter.id',
            class='apple-card p-5 bg-white space-y-3'
          )
            div(class='flex items-center justify-between')
              h3(class='text-xs font-bold text-[#1d1d1f] uppercase tracking-wider') {{ filter.name }}
              button(
                v-if='hasActiveValuesForFilter(filter.id)',
                class='text-2xs font-semibold text-[#bf4800] hover:underline',
                @click='clearFilterGroup(filter.id)'
              ) Reset
            
            ul(class='text-xs space-y-2.5')
              li(v-for='val in filter.values', :key='val.id')
                label(class='flex items-center justify-between cursor-pointer group select-none')
                  div(class='flex items-center gap-2.5')
                    input(
                      type='checkbox',
                      class='rounded border-[#d2d2d7] text-[#0071e3] focus:ring-0 w-4 h-4',
                      :checked='isFilterValueSelected(val.id)',
                      @change='toggleFilterValue(val.id)'
                    )
                    span(class='text-[#6e6e73] group-hover:text-[#1d1d1f] transition-colors') {{ val.name }}
                  span(
                    v-if='val.productCount !== undefined',
                    class='text-[10px] text-[#86868b] bg-[#f5f5f7] px-2 py-0.5 rounded-full font-medium'
                  ) {{ val.productCount }}

        // Right Product Grid Column
        div(class='lg:col-span-3 space-y-6')
          // Active Filter Chips
          div(v-if='hasActiveFilters', class='flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-[rgba(0,0,0,0.08)]')
            span(class='text-xs text-[#86868b]') Filters:
            span(
              v-if='selectedCategory',
              class='inline-flex items-center gap-1.5 bg-[#f5f5f7] text-[#1d1d1f] text-xs py-1 px-3 rounded-full font-medium'
            )
              span {{ currentCategoryName }}
              button(class='text-[#86868b] hover:text-[#bf4800]', @click='selectCategory(null)') ✕
            span(
              v-if='searchQuery',
              class='inline-flex items-center gap-1.5 bg-[#f5f5f7] text-[#1d1d1f] text-xs py-1 px-3 rounded-full font-medium'
            )
              span "{{ searchQuery }}"
              button(class='text-[#86868b] hover:text-[#bf4800]', @click='clearSearch') ✕
            span(
              v-for='val in activeFilterValueList',
              :key='val.id',
              class='inline-flex items-center gap-1.5 bg-[#f5f5f7] text-[#1d1d1f] text-xs py-1 px-3 rounded-full font-medium'
            )
              span {{ val.name }}
              button(class='text-[#86868b] hover:text-[#bf4800]', @click='toggleFilterValue(val.id)') ✕
            
            button(
              class='text-xs font-semibold text-[#0071e3] hover:underline ml-auto',
              @click='clearAllFilters'
            ) Clear all

          // Product Cards Grid
          div(
            v-if='products.length > 0',
            class='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6'
          )
            ProductCard(
              v-for='product in products',
              :key='product.id',
              :product='product'
            )

          // Loading Skeleton
          div(v-else-if='isLoading', class='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6')
            div(v-for='n in 6', :key='n', class='apple-card h-96 bg-white animate-pulse p-6')

          // Empty Results State
          div(v-else, class='apple-card p-12 text-center bg-white space-y-4 max-w-md mx-auto my-12')
            div(class='text-4xl') 🔍
            h3(class='text-lg font-bold text-[#1d1d1f]') No products found
            p(class='text-xs text-[#6e6e73] leading-relaxed')
              | We couldn't find any products matching your selected criteria. Try adjusting your filters or search terms.
            button(
              class='apple-btn-secondary text-xs mt-2',
              @click='clearAllFilters'
            ) Reset All Filters

          // Apple Style Pagination
          div(
            v-if='totalPages > 1',
            class='flex items-center justify-between pt-6 border-t border-[#e5e5ea] text-xs text-[#6e6e73]'
          )
            button(
              class='apple-btn-secondary text-xs px-4 py-2',
              :disabled='currentPage <= 1',
              :class='currentPage <= 1 ? "opacity-40 cursor-not-allowed" : ""',
              @click='changePage(currentPage - 1)'
            ) ‹ Previous
            
            span Page {{ currentPage }} of {{ totalPages }}
            
            button(
              class='apple-btn-secondary text-xs px-4 py-2',
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
  if (!selectedCategory.value) return null;
  const match = categories.value.find((c) => c.slug === selectedCategory.value);
  return match?.name || selectedCategory.value;
});

const hasActiveFilters = computed(() => {
  return !!selectedCategory.value || !!searchQuery.value || selectedFilterValueIds.value.size > 0;
});

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
  if (!f || !f.values) return false;
  return f.values.some((v) => selectedFilterValueIds.value.has(String(v.id)));
}

function toggleFilterValue(valId) {
  const strId = String(valId);
  const next = new Set(selectedFilterValueIds.value);
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
  if (!f || !f.values) return;
  const next = new Set(selectedFilterValueIds.value);
  f.values.forEach((v) => next.delete(String(v.id)));
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
  } catch {
    // fallback
  }
}

async function loadCategories() {
  try {
    const res = await api.get('/categories');
    if (res.success && res.data) {
      categories.value = res.data.categories || [];
    }
  } catch {
    // fallback
  }
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

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.category !== undefined && newQuery.category !== selectedCategory.value) {
      selectedCategory.value = newQuery.category || null;
      fetchProducts();
    }
  }
);
</script>
