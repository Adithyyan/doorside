<template lang="pug">
div(class='group relative bg-white flex flex-col cursor-pointer')
  router-link(class='relative block overflow-hidden bg-surface aspect-portrait', :to='`/product/${product.slug}`')
    img(class='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105', :src='product.primary_image_url || getFallbackImage()', :alt='product.name', loading='lazy')

    div(class='absolute top-2.5 left-2.5 flex flex-col gap-1 z-10')
      span(v-if='discountPercentage > 0', class='badge-sale') -{{ discountPercentage }}%
      span(v-else, class='badge-new') New

    div(class='absolute bottom-0 left-0 right-0 bg-ink text-white text-fine font-bold uppercase tracking-editorial py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 cursor-pointer', @click.prevent='quickAdd') + Add to Bag

  div(class='pt-3 pb-4 flex-1 flex flex-col')
    p(class='label-muted mb-1') {{ product.category_name || 'Gadgets' }}

    router-link(class='text-xs font-semibold text-ink leading-snug hover:opacity-60 transition-opacity line-clamp-2 mb-2', :to='`/product/${product.slug}`') {{ product.name }}

    div(class='mt-auto flex items-center justify-between')
      div(class='flex items-baseline gap-2')
        span(class='text-sm font-bold text-ink') {{ formatPrice(product.selling_price_paisa) }}
        span(v-if='product.compare_at_price_paisa && product.compare_at_price_paisa > product.selling_price_paisa', class='text-xs text-subtle line-through') {{ formatPrice(product.compare_at_price_paisa) }}

      button(class='w-7 h-7 border border-soft text-ink flex items-center justify-center hover:bg-ink hover:text-white hover:border-ink transition-all text-sm font-bold', @click.prevent='quickAdd', aria-label='Add to cart') +
</template>

<script setup>
import { computed } from 'vue';
import { mainStore } from '@/store';
import { formatPrice } from '@/helpers';

const props = defineProps({
  product: { type: Object, required: true },
});

const discountPercentage = computed(() => {
  if (!props.product.compare_at_price_paisa || props.product.compare_at_price_paisa <= props.product.selling_price_paisa) {
    return 0;
  }
  return Math.round(
    ((props.product.compare_at_price_paisa - props.product.selling_price_paisa) / props.product.compare_at_price_paisa) * 100
  );
});

function getFallbackImage() {
  return 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80';
}

function quickAdd() {
  mainStore().addItem(props.product, null, 1);
  mainStore().success(`${props.product.name} added to bag!`);
  mainStore().openDrawer();
}
</script>
