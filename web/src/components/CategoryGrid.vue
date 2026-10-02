<template lang="pug">
section(class='py-6 sm:py-8 bg-[#f5f5f7] relative')
  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative')
    // Horizontal Category Shelf with Navigation Controls
    div(class='relative group')
      div(
        ref='scrollContainer',
        class='flex items-center gap-6 sm:gap-9 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1'
      )
        router-link(
          v-for='cat in displayCategories',
          :key='cat.id',
          class='flex flex-col items-center shrink-0 group/item text-center cursor-pointer transition-transform hover:-translate-y-0.5',
          :to='`/shop?category=${cat.slug}`'
        )
          div(class='w-24 h-20 sm:w-28 sm:h-22 flex items-center justify-center p-1.5 transition-all')
            img(
              class='max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover/item:scale-105',
              :src='cat.image_url || getFallbackImage(cat.name)',
              :alt='cat.name',
              loading='lazy'
            )
          span(class='text-xs font-semibold text-[#1d1d1f] mt-1.5 group-hover/item:text-[#0071e3] transition-colors')
            | {{ cat.name }}

      // Right scroll chevron arrow (Apple Store scroller button)
      button(
        class='absolute -right-2 top-1/2 -translate-y-1/2 apple-nav-arrow shadow-md hidden sm:flex z-10',
        @click='scrollRight',
        aria-label='Scroll categories right'
      )
        span(class='text-base font-bold leading-none') ›
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
});

const scrollContainer = ref(null);

const fallbackList = [
  { id: 'cat-1', name: 'Audio & Music', slug: 'audio', image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80' },
  { id: 'cat-2', name: 'Smart Wearables', slug: 'wearables', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80' },
  { id: 'cat-3', name: 'Cases & Protection', slug: 'cases', image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=300&q=80' },
  { id: 'cat-4', name: 'Fast Chargers', slug: 'chargers', image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=300&q=80' },
  { id: 'cat-5', name: 'Desk & Lifestyle', slug: 'lifestyle', image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=300&q=80' },
  { id: 'cat-6', name: 'Smart Gadgets', slug: 'gadgets', image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80' },
  { id: 'cat-7', name: 'Accessories', slug: 'accessories', image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80' },
];

const displayCategories = computed(() => {
  if (props.categories && props.categories.length > 0) {
    return props.categories;
  }
  return fallbackList;
});

function getFallbackImage(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('audio') || lower.includes('ear') || lower.includes('head')) {
    return 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80';
  }
  if (lower.includes('watch') || lower.includes('wear')) {
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';
  }
  return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80';
}

function scrollRight() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
</script>
