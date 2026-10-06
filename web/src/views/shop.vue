<template lang="pug">
StoreLayout
  div(class='bg-page min-h-screen')

    div(class='border-b border-soft bg-page')
      div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8')
        nav(class='flex text-fine font-medium text-muted gap-2 items-center mb-3 uppercase tracking-editorial')
          router-link(class='hover:text-ink transition-colors', to='/') Home
          span /
          span(class='text-ink') {{ currentCategoryName || 'All Products' }}

        div(class='flex flex-col sm:flex-row sm:items-end justify-between gap-4')
          div
            h1(class='heading-lg text-ink leading-none') {{ currentCategoryName || 'ALL PRODUCTS' }}
            p(class='text-cap text-muted mt-1 uppercase tracking-editorial') {{ totalProducts }} items

          div(class='flex items-center gap-2')
            span(class='label-muted') Sort by:
            select(class='select-base', v-model='currentSortId', @change='handleSortChange')
              option(v-for='opt in sortOptions', :key='opt.id', :value='opt.id') {{ opt.name }}

    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8')
      div(class='grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr] items-start')

        aside(class='hidden lg:block')
          div(class='bg-page')
            div(class='flex items-center justify-between pb-4 border-b border-soft mb-4')
              span(class='label-ink') Filters
              button(v-if='hasActiveFilters', class='text-fine text-muted hover:text-ink uppercase tracking-editorial cursor-pointer', @click='clearAllFilters') Clear all

            div(class='mb-4')
              div(class='relative')
                input(class='input-base', type='text', placeholder='Search products…', v-model='searchQuery', @input='debounceSearch')

            div(class='mb-5')
              div(class='flex items-center justify-between py-2 border-b border-subtle')
                span(class='label-ink') Category
              div(class='pt-2 space-y-1')
                button(class='w-full text-left py-1.5 text-cap transition-all flex items-center justify-between cursor-pointer', :class='!selectedCategory ? "font-bold text-ink" : "text-muted hover:text-ink"', @click='selectCategory(null)')
                  span All
                button(v-for='cat in categories', :key='cat.id', class='w-full text-left py-1.5 text-cap transition-all flex items-center justify-between cursor-pointer', :class='selectedCategory === cat.slug ? "font-bold text-ink" : "text-muted hover:text-ink"', @click='selectCategory(cat.slug)')
                  span {{ cat.name }}

            div(v-for='filter in dynamicFilters', :key='filter.id', class='mb-5')
              div(class='flex items-center justify-between py-2 border-b border-subtle mb-2')
                span(class='label-ink') {{ filter.name }}
                button(v-if='hasActiveValuesForFilter(filter.id)', class='text-fine text-muted hover:text-sale uppercase tracking-editorial cursor-pointer', @click='clearFilterGroup(filter.id)') Reset

              div(class='space-y-1.5')
                label(v-for='val in filter.values', :key='val.id', class='flex items-center justify-between cursor-pointer group')
                  div(class='flex items-center gap-2.5')
                    input(type='checkbox', class='w-3.5 h-3.5 border border-soft rounded-none cursor-pointer', :checked='isFilterValueSelected(val.id)', @change='toggleFilterValue(val.id)')
                    span(class='text-cap text-muted group-hover:text-ink transition-colors') {{ val.name }}
                  span(v-if='val.productCount !== undefined', class='text-fine text-subtle') {{ val.productCount }}

            button(class='btn-primary w-full py-3 mt-2', @click='fetchProducts') Apply Filter

        div(class='space-y-6')
          div(v-if='hasActiveFilters', class='flex flex-wrap items-center gap-2')
            span(class='label-muted mr-1') Active:
            span(v-if='selectedCategory', class='inline-flex items-center gap-2 bg-white border border-soft text-ink text-fine py-1 px-3 uppercase tracking-editorial font-bold')
              span {{ currentCategoryName }}
              button(class='text-muted hover:text-sale transition-colors cursor-pointer', @click='selectCategory(null)') ✕
            span(v-if='searchQuery', class='inline-flex items-center gap-2 bg-white border border-soft text-ink text-fine py-1 px-3 uppercase tracking-editorial font-bold')
              span "{{ searchQuery }}"
              button(class='text-muted hover:text-sale transition-colors cursor-pointer', @click='clearSearch') ✕
            span(v-for='val in activeFilterValueList', :key='val.id', class='inline-flex items-center gap-2 bg-white border border-soft text-ink text-fine py-1 px-3 uppercase tracking-editorial font-bold')
              span {{ val.name }}
              button(class='text-muted hover:text-sale transition-colors cursor-pointer', @click='toggleFilterValue(val.id)') ✕

          div(v-if='products.length > 0', class='grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4')
            ProductCard(v-for='product in products', :key='product.id', :product='product')

          div(v-else-if='isLoading', class='grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4')
            div(v-for='n in 6', :key='n', class='bg-white')
              div(class='bg-page-alt animate-pulse aspect-portrait')
              div(class='pt-3 px-0 space-y-2')
                div(class='h-2 bg-page-alt animate-pulse w-1/4')
                div(class='h-3 bg-page-alt animate-pulse')
                div(class='h-4 bg-page-alt animate-pulse w-1/3 mt-2')

          div(v-else, class='panel-editorial py-20 text-center')
            p(class='text-3xl mb-3') 🔍
            h3(class='heading-xs text-ink mb-1') No Products Found
            p(class='text-cap text-muted uppercase tracking-editorial') Try adjusting your filters or search terms.
            button(class='btn-primary mt-4', @click='clearAllFilters') Reset Filters

          div(v-if='totalPages > 1', class='flex items-center justify-between pt-8 border-t border-soft text-fine text-muted uppercase tracking-editorial')
            button(class='btn-outline px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed', :disabled='currentPage <= 1', @click='changePage(currentPage - 1)') ← Prev

            span Page {{ currentPage }} / {{ totalPages }}

            button(class='btn-outline px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed', :disabled='currentPage >= totalPages', @click='changePage(currentPage + 1)') Next →
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
  return categories.value.find((c) => c.slug === selectedCategory.value)?.name || selectedCategory.value;
});

const hasActiveFilters = computed(() =>
  !!selectedCategory.value || !!searchQuery.value || selectedFilterValueIds.value.size > 0
);

const activeFilterValueList = computed(() => {
  const result = [];
  dynamicFilters.value.forEach((f) => {
    (f.values || []).forEach((v) => {
      if (selectedFilterValueIds.value.has(String(v.id))) result.push(v);
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
  if (next.has(strId)) next.delete(strId);
  else next.add(strId);
  selectedFilterValueIds.value = next;
  currentPage.value = 1;
  fetchProducts();
}

function clearFilterGroup(filterId) {
  const f = dynamicFilters.value.find((item) => item.id === filterId);
  if (!f?.values) return;
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
    if (selectedCategory.value) params.set('category', selectedCategory.value);
    if (searchQuery.value.trim()) params.set('search', searchQuery.value.trim());
    if (currentSortId.value) params.set('sortId', currentSortId.value);
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
  if (route.query.category) selectedCategory.value = route.query.category;
  if (route.query.search) searchQuery.value = route.query.search;
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
