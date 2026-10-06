<template lang="pug">
div(v-if='mainStore().isDrawerOpen', class='fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity', @click='mainStore().closeDrawer()')

div(v-if='mainStore().isDrawerOpen', class='fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-50')
  div(class='w-screen max-w-md bg-page shadow-2xl flex flex-col border-l border-soft')
    div(class='p-5 bg-page border-b border-soft flex items-center justify-between')
      div(class='flex items-center gap-3')
        h2(class='heading-sm text-ink') Your Bag
        span(class='label-muted') {{ mainStore().totalItemsCount }} {{ mainStore().totalItemsCount === 1 ? 'item' : 'items' }}
      button(class='w-8 h-8 border border-soft text-muted hover:text-ink hover:border-ink flex items-center justify-center transition-colors', @click='mainStore().closeDrawer()', aria-label='Close cart')
        IconClose(class='w-4 h-4')

    div(v-if='mainStore().items.length > 0', class='bg-page-alt px-5 py-3 border-b border-soft')
      div(class='flex items-center justify-between label-muted mb-2')
        span(v-if='mainStore().amountNeededForFreeShipping > 0')
          | Add 
          strong(class='text-ink mx-1') {{ formatPrice(mainStore().amountNeededForFreeShipping) }}
          | more for Free Delivery
        span(v-else, class='text-ink font-bold flex items-center gap-1')
          span ✓
          span Free Delivery Unlocked!
        span(class='text-fine text-muted') {{ mainStore().freeShippingProgress }}%
      
      div(class='w-full bg-surface border border-soft h-1 overflow-hidden')
        div(class='bg-ink h-full transition-all duration-500', :style='{ width: `${mainStore().freeShippingProgress}%` }')

    div(v-if='mainStore().items.length > 0', class='flex-1 overflow-y-auto p-4 space-y-2')
      div(v-for='item in mainStore().items', :key='item.id', class='p-3 border border-soft flex gap-3 bg-white hover:border-ink transition-colors')
        div(class='w-16 h-20 bg-surface flex items-center justify-center shrink-0 overflow-hidden')
          img(class='h-full w-full object-cover', :src='item.product.primary_image_url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=200&q=80"', :alt='item.product.name')
        
        div(class='flex-1 flex flex-col justify-between min-w-0')
          div
            div(class='flex justify-between items-start gap-2')
              h4(class='text-cap font-semibold text-ink line-clamp-1') {{ item.product.name }}
              button(class='text-muted hover:text-sale transition-colors p-0.5', @click='mainStore().removeItem(item.id)', aria-label='Remove item')
                IconTrash(class='w-3 h-3')
            
            p(v-if='item.variantName', class='text-fine text-muted mt-0.5 uppercase tracking-editorial') {{ item.variantName }}
            p(class='text-cap font-bold text-ink mt-1') {{ formatPrice(item.price) }}
          
          div(class='flex items-center gap-1 mt-2')
            div(class='flex items-center border border-soft bg-white')
              button(class='w-6 h-6 flex items-center justify-center text-xs font-bold text-muted hover:text-ink', @click='mainStore().updateQuantity(item.id, item.quantity - 1)') −
              span(class='w-7 text-center text-cap font-semibold text-ink') {{ item.quantity }}
              button(class='w-6 h-6 flex items-center justify-center text-xs font-bold text-muted hover:text-ink', @click='mainStore().updateQuantity(item.id, item.quantity + 1)') +

    div(v-else, class='flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4')
      div(class='text-4xl mb-1') 🛍️
      h3(class='heading-md text-ink') Your Bag is Empty
      p(class='text-cap text-muted max-w-xs leading-relaxed') Explore our curated collections with fast delivery across India.
      button(class='btn-primary mt-2', @click='goToShop') Start Shopping

    div(v-if='mainStore().items.length > 0', class='p-4 bg-page border-t border-soft space-y-3')
      div(class='flex gap-2')
        input(class='input-base flex-1 uppercase tracking-editorial', type='text', placeholder='Promo code', v-model='couponInput', @keyup.enter='applyCoupon')
        button(class='btn-secondary px-4 py-2 text-fine tracking-editorial', @click='applyCoupon') Apply
      
      div(v-if='mainStore().appliedCoupon', class='text-fine text-ink flex items-center justify-between bg-white border border-soft px-3 py-2 uppercase tracking-editorial font-bold')
        span Code "{{ mainStore().appliedCoupon.code }}" applied (-{{ formatPrice(mainStore().discountPaisa) }})
        button(class='text-sale font-bold', @click='mainStore().removeCoupon()') ✕

      div(class='space-y-1.5 text-cap text-muted pt-1 uppercase tracking-editorial')
        div(class='flex justify-between')
          span Subtotal
          span(class='text-ink font-semibold') {{ formatPrice(mainStore().subtotalPaisa) }}
        div(v-if='mainStore().discountPaisa > 0', class='flex justify-between text-ink font-semibold')
          span Discount
          span -{{ formatPrice(mainStore().discountPaisa) }}
        div(class='flex justify-between')
          span Shipping
          span(v-if='mainStore().shippingPaisa === 0', class='text-ink font-bold') FREE
          span(v-else, class='text-ink font-semibold') {{ formatPrice(mainStore().shippingPaisa) }}
        div(class='flex justify-between text-body-sm font-bold text-ink pt-2 border-t border-soft')
          span Total
          span {{ formatPrice(mainStore().totalPaisa) }}

      div(class='space-y-2 pt-1')
        button(class='btn-primary w-full py-3.5 flex items-center justify-center gap-2', @click='goToCheckout')
          span Proceed to Checkout
          span →
        
        button(class='btn-outline w-full py-2.5 text-center', @click='goToCart')
          span View Bag & Details
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

function goToCart() {
  mainStore().closeDrawer();
  router.push('/cart');
}

function goToShop() {
  mainStore().closeDrawer();
  router.push('/shop');
}
</script>
