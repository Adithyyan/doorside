<template lang="pug">
StoreLayout
  div(class='bg-page min-h-screen py-10 sm:py-14')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      div(class='border-b border-soft pb-4')
        h1(class='heading-lg text-ink') Your Bag
        p(class='text-fine text-muted uppercase tracking-editorial mt-1')
          | Nationwide delivery across India on eligible orders.

      div(v-if='mainStore().items.length > 0', class='grid grid-cols-1 gap-10 lg:grid-cols-12 items-start')
        div(class='space-y-5 lg:col-span-8')
          div(class='panel-editorial p-4')
            div(class='flex items-center justify-between label-muted mb-2')
              span(v-if='mainStore().amountNeededForFreeShipping > 0')
                | Add 
                strong(class='text-ink mx-1') {{ formatPrice(mainStore().amountNeededForFreeShipping) }}
                | more for Free Delivery
              span(v-else, class='text-ink font-bold flex items-center gap-1')
                span ✓
                span You've unlocked Free Delivery!
              span(class='text-fine text-muted') {{ mainStore().freeShippingProgress }}%

            div(class='w-full bg-surface border border-soft h-1 overflow-hidden')
              div(class='bg-ink h-full transition-all duration-500', :style='{ width: `${mainStore().freeShippingProgress}%` }')

          div(class='panel-editorial divide-y divide-soft overflow-hidden')
            div(v-for='item in mainStore().items', :key='item.id', class='p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5 bg-white hover:bg-surface/50 transition-colors')
              div(class='w-20 h-24 bg-surface border border-soft flex items-center justify-center p-2 shrink-0 overflow-hidden')
                img(class='h-full w-full object-cover', :src='item.product.primary_image_url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80"', :alt='item.product.name')

              div(class='flex-1 min-w-0 space-y-1')
                router-link(class='text-body-sm font-semibold text-ink line-clamp-1 hover:opacity-70 transition-opacity', :to='`/product/${item.product.slug}`') {{ item.product.name }}
                p(v-if='item.variantName', class='text-fine text-muted uppercase tracking-editorial') {{ item.variantName }}
                p(class='text-fine text-muted uppercase tracking-editorial') Instant Dispatch

              div(class='flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto')
                div(class='flex items-center border border-soft bg-white')
                  button(class='w-8 h-8 flex items-center justify-center text-sm font-bold text-muted hover:text-ink', @click='mainStore().updateQuantity(item.id, item.quantity - 1)') −
                  span(class='w-8 text-center text-cap font-semibold text-ink') {{ item.quantity }}
                  button(class='w-8 h-8 flex items-center justify-center text-sm font-bold text-muted hover:text-ink', @click='mainStore().updateQuantity(item.id, item.quantity + 1)') +

                span(class='text-body-sm font-bold text-ink w-24 text-right')
                  | {{ formatPrice(item.price * item.quantity) }}

                button(class='text-muted hover:text-sale transition-colors p-1', @click='mainStore().removeItem(item.id)', title='Remove')
                  IconTrash(class='w-4 h-4')

          div(class='flex justify-between items-center text-fine uppercase tracking-editorial pt-2')
            router-link(class='btn-outline px-4 py-2', to='/shop') ‹ Continue Shopping
            button(class='btn-danger', @click='mainStore().clearCart()') Clear Bag

        div(class='space-y-5 lg:col-span-4')
          div(class='panel-editorial p-6 space-y-5')
            h2(class='heading-sm text-ink') Order Summary

            div(class='space-y-2')
              div(class='flex gap-2')
                input(class='input-base flex-1 uppercase tracking-editorial', type='text', placeholder='Promo code', v-model='couponInput', @keyup.enter='applyCoupon')
                button(class='btn-secondary px-4 py-2 text-fine tracking-editorial', @click='applyCoupon') Apply

              div(v-if='mainStore().appliedCoupon', class='text-fine text-ink p-3 bg-surface border border-soft flex items-center justify-between uppercase tracking-editorial font-bold')
                span Code "{{ mainStore().appliedCoupon.code }}" applied (−{{ formatPrice(mainStore().discountPaisa) }})
                button(class='text-sale font-bold', @click='mainStore().removeCoupon()') ✕

            div(class='space-y-2 pt-3 border-t border-soft text-cap text-muted uppercase tracking-editorial')
              div(class='flex justify-between')
                span Subtotal
                span(class='text-ink font-semibold') {{ formatPrice(mainStore().subtotalPaisa) }}
              div(v-if='mainStore().discountPaisa > 0', class='flex justify-between text-ink font-semibold')
                span Coupon Savings
                span −{{ formatPrice(mainStore().discountPaisa) }}
              div(class='flex justify-between')
                span Shipping
                span(v-if='mainStore().shippingPaisa === 0', class='text-ink font-bold') FREE
                span(v-else, class='text-ink font-semibold') {{ formatPrice(mainStore().shippingPaisa) }}
              div(class='flex justify-between text-body-sm font-bold text-ink pt-3 border-t border-soft')
                span Total Amount
                span {{ formatPrice(mainStore().totalPaisa) }}

            router-link(class='btn-primary w-full py-4 text-center justify-center', to='/checkout') Proceed to Checkout →

          div(class='panel-editorial p-5 text-fine text-muted uppercase tracking-editorial space-y-2')
            div(class='flex items-center gap-2') 🔒 100% Encrypted Checkout
            div(class='flex items-center gap-2') 🔄 7-Day Hassle-Free Returns
            div(class='flex items-center gap-2') 📦 Verified Tracking Updates

      div(v-else, class='panel-editorial p-16 text-center space-y-4 max-w-md mx-auto my-12')
        div(class='text-5xl') 🛍️
        h2(class='heading-md text-ink') Your bag is empty
        p(class='text-cap text-muted leading-relaxed') Explore our curated collections with express delivery across India.
        router-link(class='btn-primary mt-2', to='/shop') Continue Shopping
</template>

<script setup>
import { ref } from 'vue';
import StoreLayout from '@/components/StoreLayout.vue';
import { mainStore } from '@/store';
import { formatPrice } from '@/helpers';
import IconTrash from '@/components/icons/trash.vue';

const couponInput = ref('');

async function applyCoupon() {
  if (!couponInput.value.trim()) {
    return;
  }
  try {
    await mainStore().applyCoupon(couponInput.value);
    mainStore().success(`Coupon ${couponInput.value} applied!`);
    couponInput.value = '';
  } catch (error) {
    mainStore().error(error.message || 'Invalid coupon');
  }
}
</script>
