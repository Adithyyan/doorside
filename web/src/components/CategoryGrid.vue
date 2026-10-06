<template lang="pug">
section(class='py-14 bg-page')
  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
    div(class='flex items-end justify-between mb-8')
      div
        p(class='section-label') Collections
        h2(class='heading-lg') SHOP BY CATEGORY
      router-link(class='hidden sm:inline-flex items-center gap-1.5 label-ink border-b border-ink pb-0.5 hover:opacity-60 transition-opacity', to='/shop') View All →

    div(v-if='displayCategories.length > 0')
      div(class='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3')
        router-link(v-for='(cat, idx) in displayCategories.slice(0, 8)', :key='cat.id', class='category-img-card group relative block overflow-hidden', :class='getCategoryHeight(idx)', :to='`/shop?category=${cat.slug}`')
          img(class='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105', :src='cat.image_url || getCatImage(cat.name)', :alt='cat.name', loading='lazy')
          div(class='absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent z-[1]')
          div(class='absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10')
            p(class='text-white font-bold text-xs sm:text-sm uppercase tracking-wide leading-tight') {{ cat.name }}
            p(class='text-white/60 text-fine mt-0.5 uppercase tracking-editorial hidden sm:block') Explore →
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  categories: { type: Array, default: () => [] },
});

const fallbackList = [
  { id: 'c1', name: 'Audio & Sound',     slug: 'audio',       image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
  { id: 'c2', name: 'Smart Wearables',   slug: 'wearables',   image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
  { id: 'c3', name: 'Phone Accessories', slug: 'accessories', image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80' },
  { id: 'c4', name: 'Fast Chargers',     slug: 'chargers',    image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80' },
  { id: 'c5', name: 'Desk & Lifestyle',  slug: 'lifestyle',   image_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=600&q=80' },
  { id: 'c6', name: 'Smart Gadgets',     slug: 'gadgets',     image_url: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=600&q=80' },
  { id: 'c7', name: 'Gaming Gear',       slug: 'gaming',      image_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80' },
  { id: 'c8', name: 'Travel Tech',       slug: 'travel',      image_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80' },
];

const displayCategories = computed(() =>
  props.categories?.length > 0 ? props.categories : fallbackList
);

function getCategoryHeight(idx) {
  return idx === 0 ? 'h-52 sm:h-64 lg:row-span-2 lg:h-auto' : 'h-44 sm:h-52';
}

function getCatImage(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('audio') || lower.includes('ear') || lower.includes('head'))
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
  if (lower.includes('watch') || lower.includes('wear'))
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
  return 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=600&q=80';
}
</script>
