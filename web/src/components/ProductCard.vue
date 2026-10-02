<template lang="pug">
div(class='group relative bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col')
  router-link(class='relative block bg-slate-50 overflow-hidden', :to='`/product/${product.slug}`')
    div(class='aspect-square flex items-center justify-center p-5')
      img(
        class='max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105',
        :src='product.primary_image_url || getFallbackImage()',
        :alt='product.name',
        loading='lazy'
      )

    div(class='absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10')
      span(v-if='discountPercentage > 0', class='badge-sale') {{ discountPercentage }}% OFF
      span(v-else, class='badge-new') New

    button(
      class='absolute top-2.5 right-2.5 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10 text-slate-400 hover:text-red-400',
      @click.prevent='',
      aria-label='Wishlist'
    ) ♡

    div(
      class='absolute bottom-0 left-0 right-0 bg-slate-900 text-white text-xs font-bold py-2.5 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer z-10',
      @click.prevent='quickAdd'
    ) + Add to Cart

  div(class='p-4 flex-1 flex flex-col')
    p(class='text-[11px] font-semibold text-teal-700 uppercase tracking-wider mb-1') {{ product.category_name || 'Essentials' }}

    router-link(
      class='text-sm font-semibold text-slate-900 line-clamp-2 leading-snug hover:text-teal-700 transition-colors mb-2',
      :to='`/product/${product.slug}`'
    ) {{ product.name }}

    div(class='flex items-center gap-1.5 mb-3')
      div(class='flex text-amber-400 text-xs') ★★★★
      span(class='text-amber-300 text-xs') ★
      span(class='text-xs text-slate-400') ({{ randomReviews }} reviews)

    div(class='mt-auto flex items-center justify-between')
      div
        div(class='flex items-baseline gap-2')
          span(class='text-lg font-black text-slate-900') {{ formatPrice(product.selling_price_paisa) }}
          span(
            v-if='product.compare_at_price_paisa && product.compare_at_price_paisa > product.selling_price_paisa',
            class='text-xs text-slate-400 line-through'
          ) {{ formatPrice(product.compare_at_price_paisa) }}
        p(class='text-[10px] text-slate-400') Incl. of all taxes

      button(
        class='w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 active:scale-90 transition-all shrink-0',
        @click.prevent='quickAdd',
        aria-label='Add to cart'
      )
        span(class='text-sm font-bold leading-none') +
</template>

<script setup>
import { computed } from 'vue';
import { mainStore } from '@/store';
import { formatPrice } from '@/helpers';

const props = defineProps({
  product: { type: Object, required: true },
});

const randomReviews = Math.floor(Math.random() * 120) + 20;

const discountPercentage = computed(() => {
  if (!props.product.compare_at_price_paisa || props.product.compare_at_price_paisa <= props.product.selling_price_paisa) {
    return 0;
  }
  return Math.round(((props.product.compare_at_price_paisa - props.product.selling_price_paisa) / props.product.compare_at_price_paisa) * 100);
});

function getFallbackImage() {
  return 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80';
}

function quickAdd() {
  mainStore().addItem(props.product, null, 1);
  mainStore().success(`${props.product.name} added to cart!`);
  mainStore().openDrawer();
}
</script>
