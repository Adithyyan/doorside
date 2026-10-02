<template lang="pug">
div(
  class='group relative bg-white border border-[rgba(0,0,0,0.08)] rounded-[22px] p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between'
)
  router-link(
    class='relative aspect-square w-full rounded-xl overflow-hidden bg-[#fafafa] flex items-center justify-center mb-4 block',
    :to='`/product/${product.slug}`'
  )
    img(
      class='max-h-full max-w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105',
      :src='product.primary_image_url || getFallbackProductImage(product.name)',
      :alt='product.name',
      loading='lazy'
    )
    span(
      v-if='discountPercentage > 0',
      class='absolute top-2.5 left-2.5 bg-[#bf4800] text-white text-[11px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow-2xs'
    ) {{ discountPercentage }}% OFF

  div(class='space-y-2 flex-1 flex flex-col justify-between')
    div
      // Color Swatch Dots (Apple Store Accessory Style)
      div(class='flex items-center gap-1.5 py-1 mb-1')
        span(
          v-for='(color, cIdx) in swatchColors',
          :key='cIdx',
          class='color-swatch-dot cursor-pointer',
          :style='{ backgroundColor: color }',
          :title='`Color variant ${cIdx + 1}`'
        )

      // Category / New Badge
      div(class='flex items-center gap-2')
        span(class='apple-badge') New
        span(class='text-2xs font-medium text-[#86868b] uppercase tracking-wider')
          | {{ product.category_name || 'Essentials' }}

      // Product Title
      router-link(
        class='block text-sm font-semibold text-[#1d1d1f] line-clamp-2 mt-1 hover:text-[#0071e3] transition-colors leading-snug',
        :to='`/product/${product.slug}`'
      ) {{ product.name }}

    // Pricing & Quick Add
    div(class='pt-3 mt-2 border-t border-[#f5f5f7] flex items-end justify-between gap-2')
      div
        div(class='text-xs text-[#6e6e73] font-normal') MRP
        div(class='flex items-baseline gap-1.5')
          span(class='text-base font-bold text-[#1d1d1f]') {{ formatPrice(product.selling_price_paisa) }}
          span(
            v-if='product.compare_at_price_paisa && product.compare_at_price_paisa > product.selling_price_paisa',
            class='text-xs text-[#86868b] line-through'
          ) {{ formatPrice(product.compare_at_price_paisa) }}
        div(class='text-[10px] text-[#86868b]') (Incl. of all taxes)

      button(
        class='w-9 h-9 rounded-full bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center transition-all hover:bg-[#0071e3] hover:text-white active:scale-90 shrink-0 shadow-2xs',
        @click.prevent='quickAddToCart',
        aria-label='Add to bag',
        title='Add to bag'
      )
        IconPlus(class='w-4 h-4')
</template>

<script setup>
import { computed } from 'vue';
import { mainStore } from '@/store';
import { formatPrice } from '@/helpers';
import IconPlus from '@/components/icons/plus.vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const swatchColors = computed(() => {
  // Generate consistent color dots from product name
  const name = (props.product?.name || '').toLowerCase();
  if (name.includes('black') || name.includes('audio') || name.includes('pro')) {
    return ['#1d1d1f', '#6e6e73', '#d2d2d7', '#253b52'];
  }
  if (name.includes('watch') || name.includes('wear')) {
    return ['#202428', '#8c6d58', '#4b5563', '#b38b6d'];
  }
  if (name.includes('case')) {
    return ['#5c242e', '#232f3e', '#e3d7bf', '#434c44', '#1f2022'];
  }
  return ['#1d1d1f', '#0071e3', '#e5e5ea', '#a28b79'];
});

const discountPercentage = computed(() => {
  if (!props.product.compare_at_price_paisa || props.product.compare_at_price_paisa <= props.product.selling_price_paisa) {
    return 0;
  }
  const diff = props.product.compare_at_price_paisa - props.product.selling_price_paisa;
  return Math.round((diff / props.product.compare_at_price_paisa) * 100);
});

function getFallbackProductImage(name = '') {
  return 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80';
}

function quickAddToCart() {
  mainStore().addItem(props.product, null, 1);
  mainStore().success(`Added ${props.product.name} to your bag!`);
  mainStore().openDrawer();
}
</script>
