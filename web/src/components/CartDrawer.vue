<template lang="pug">
div(
  v-if='mainStore().isDrawerOpen',
  class='fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity',
  @click='mainStore().closeDrawer()'
)

div(
  v-if='mainStore().isDrawerOpen',
  class='fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-50'
)
  div(class='w-screen max-w-md bg-slate-50 shadow-2xl flex flex-col')
    div(class='p-5 bg-white border-b border-slate-100 flex items-center justify-between')
      div(class='flex items-center gap-2')
        h2(class='text-lg font-bold text-slate-900') Your Cart
        span(class='text-xs font-semibold bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full')
          | {{ mainStore().totalItemsCount }} {{ mainStore().totalItemsCount === 1 ? 'item' : 'items' }}
      button(
        class='w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-all',
        @click='mainStore().closeDrawer()',
        aria-label='Close cart'
      )
        IconClose(class='w-4 h-4')

    div(v-if='mainStore().items.length > 0', class='bg-white px-5 py-3.5 border-b border-slate-100')
      div(class='flex items-center justify-between text-xs font-medium text-slate-700 mb-2')
        span(v-if='mainStore().amountNeededForFreeShipping > 0')
          | Add 
          strong(class='text-teal-700') {{ formatPrice(mainStore().amountNeededForFreeShipping) }}
          |  more for Free Delivery
        span(v-else, class='text-teal-700 font-semibold flex items-center gap-1')
          span ✓
          span You've unlocked Free Delivery!
        span(class='text-slate-400 text-[11px]') {{ mainStore().freeShippingProgress }}%
      
      div(class='w-full bg-slate-100 rounded-full overflow-hidden h-1.5')
        div(
          class='bg-teal-600 h-full rounded-full transition-all duration-500',
          :style='{ width: `${mainStore().freeShippingProgress}%` }'
        )

    div(v-if='mainStore().items.length > 0', class='flex-1 overflow-y-auto p-5 space-y-3')
      div(
        v-for='item in mainStore().items',
        :key='`${item.productId}-${item.variantId}`',
        class='p-4 rounded-xl border border-slate-200 flex gap-4 bg-white hover:border-teal-200 transition-colors'
      )
        div(class='w-20 h-20 rounded-xl bg-slate-50 flex items-center justify-center p-1 shrink-0 overflow-hidden border border-slate-100')
          img(
            class='max-h-full max-w-full object-contain',
            :src='item.product.primary_image_url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=200&q=80"',
            :alt='item.product.name'
          )
        
        div(class='flex-1 flex flex-col justify-between min-w-0')
          div
            div(class='flex justify-between items-start gap-2')
              h4(class='text-xs font-semibold text-slate-900 line-clamp-1') {{ item.product.name }}
              button(
                class='text-slate-400 hover:text-red-500 transition-colors p-0.5',
                @click='mainStore().removeItem(item.productId, item.variantId)',
                aria-label='Remove item'
              )
                IconTrash(class='w-3.5 h-3.5')
            
            p(v-if='item.variant', class='text-2xs text-slate-500 mt-0.5') {{ item.variant.name }}
            p(class='text-xs font-bold text-slate-900 mt-1')
              | {{ formatPrice(item.variant?.sellingPricePaisa || item.product.selling_price_paisa) }}
          
          div(class='flex items-center gap-2 mt-2')
            div(class='flex items-center border border-slate-200 rounded-lg bg-slate-50 px-1 py-0.5')
              button(
                class='w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-500 hover:text-slate-900',
                @click='mainStore().updateQuantity(item.productId, item.variantId, item.quantity - 1)'
              ) −
              span(class='w-6 text-center text-xs font-semibold text-slate-800') {{ item.quantity }}
              button(
                class='w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-500 hover:text-slate-900',
                @click='mainStore().updateQuantity(item.productId, item.variantId, item.quantity + 1)'
              ) +

    div(v-else, class='flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3')
      div(class='w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-2xl shadow-xs') 🛍️
      h3(class='text-lg font-bold text-slate-900') Your cart is empty
      p(class='text-xs text-slate-500 max-w-xs') Explore our curated collections of trending products with fast delivery.
      button(
        class='btn-primary text-xs mt-3 px-5 py-2.5 rounded-lg font-medium',
        @click='goToShop'
      ) Start Shopping

    div(v-if='mainStore().items.length > 0', class='p-5 bg-white border-t border-slate-200 space-y-4')
      div(class='flex gap-2')
        input(
          class='flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg uppercase text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-teal-600',
          type='text',
          placeholder='Promo code',
          v-model='couponInput',
          @keyup.enter='applyCoupon'
        )
        button(
          class='px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors',
          @click='applyCoupon'
        ) Apply
      
      div(
        v-if='mainStore().appliedCoupon',
        class='text-xs text-teal-800 flex items-center justify-between bg-teal-50 px-3.5 py-1.5 rounded-lg font-medium'
      )
        span Code "{{ mainStore().appliedCoupon.code }}" applied (-{{ formatPrice(mainStore().discountPaisa) }})
        button(class='text-red-500 font-bold hover:scale-110', @click='mainStore().removeCoupon()') ✕

      div(class='space-y-1.5 text-xs text-slate-500 pt-1')
        div(class='flex justify-between')
          span Subtotal
          span(class='text-slate-900 font-medium') {{ formatPrice(mainStore().subtotalPaisa) }}
        div(v-if='mainStore().discountPaisa > 0', class='flex justify-between text-teal-700 font-medium')
          span Discount Savings
          span -{{ formatPrice(mainStore().discountPaisa) }}
        div(class='flex justify-between')
          span Shipping
          span(v-if='mainStore().shippingPaisa === 0', class='text-teal-700 font-semibold') FREE
          span(v-else, class='text-slate-900 font-medium') {{ formatPrice(mainStore().shippingPaisa) }}
        div(class='flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100')
          span Total
          span {{ formatPrice(mainStore().totalPaisa) }}

      button(
        class='w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2',
        @click='goToCheckout'
      )
        span Proceed to Checkout
        span →
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { mainStore } from '@/store';
import { formatPrice } from '@/helpers';
import IconClose from '@/components/icons/close.vue';
import IconTrash from '@/components/icons/trash.vue';

const router = useRouter();
const couponInput = ref('');

async function applyCoupon() {
  if (!couponInput.value.trim()) {
    return;
  }
  try {
    await mainStore().applyCoupon(couponInput.value);
    mainStore().success(`Coupon ${couponInput.value} applied successfully!`);
    couponInput.value = '';
  } catch (error) {
    mainStore().error(error.message || 'Invalid coupon code');
  }
}

function goToCheckout() {
  mainStore().closeDrawer();
  router.push('/checkout');
}

function goToShop() {
  mainStore().closeDrawer();
  router.push('/shop');
}
</script>
