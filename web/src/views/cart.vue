<template lang="pug">
StoreLayout
  div(class='bg-slate-50 min-h-screen py-10 sm:py-14')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      div(class='border-b border-slate-200 pb-4')
        h1(class='text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900') Your Cart
        p(class='text-xs text-slate-500 mt-1') Free delivery across India on eligible orders.

      div(v-if='mainStore().items.length > 0', class='grid grid-cols-1 gap-10 lg:grid-cols-12 items-start')
        div(class='space-y-5 lg:col-span-8')
          div(class='p-4 bg-white rounded-2xl border border-slate-200 shadow-xs')
            div(class='flex items-center justify-between text-xs font-medium text-slate-700 mb-2')
              span(v-if='mainStore().amountNeededForFreeShipping > 0')
                | Add 
                strong(class='text-teal-700') {{ formatPrice(mainStore().amountNeededForFreeShipping) }}
                |  more for Free Delivery
              span(v-else, class='text-teal-700 font-semibold flex items-center gap-1')
                span ✓
                span You've unlocked Free Delivery!
              span(class='text-slate-400 text-[11px]') {{ mainStore().freeShippingProgress }}%

            div(class='w-full bg-slate-100 h-1.5 rounded-full overflow-hidden')
              div(
                class='bg-teal-600 h-full rounded-full transition-all duration-500',
                :style='{ width: `${mainStore().freeShippingProgress}%` }'
              )

          div(class='bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden')
            div(
              v-for='item in mainStore().items',
              :key='`${item.productId}-${item.variantId}`',
              class='p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5'
            )
              div(class='w-24 h-24 rounded-2xl bg-slate-50 flex items-center justify-center p-2 shrink-0 overflow-hidden border border-slate-100')
                img(
                  class='max-h-full max-w-full object-contain',
                  :src='item.product.primary_image_url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80"',
                  :alt='item.product.name'
                )

              div(class='flex-1 min-w-0 space-y-1')
                router-link(
                  class='text-sm font-semibold text-slate-900 line-clamp-1 hover:text-teal-700 transition-colors',
                  :to='`/product/${item.product.slug}`'
                ) {{ item.product.name }}
                p(v-if='item.variant', class='text-xs text-slate-500') {{ item.variant.name }}
                p(class='text-xs text-slate-400') Dispatches in 24 hours

              div(class='flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto')
                div(class='flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden')
                  button(
                    class='w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors',
                    @click='mainStore().updateQuantity(item.productId, item.variantId, item.quantity - 1)'
                  ) −
                  span(class='w-8 text-center text-xs font-bold text-slate-900') {{ item.quantity }}
                  button(
                    class='w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors',
                    @click='mainStore().updateQuantity(item.productId, item.variantId, item.quantity + 1)'
                  ) +

                span(class='text-sm font-bold text-slate-900 w-24 text-right')
                  | {{ formatPrice((item.variant?.sellingPricePaisa || item.product.selling_price_paisa) * item.quantity) }}

                button(
                  class='text-slate-400 hover:text-red-500 transition-colors p-1',
                  @click='mainStore().removeItem(item.productId, item.variantId)',
                  title='Remove'
                )
                  IconTrash(class='w-4 h-4')

          div(class='flex justify-between items-center text-xs pt-2')
            router-link(class='text-teal-700 hover:text-teal-800 font-semibold', to='/shop') ‹ Continue Shopping
            button(class='text-slate-400 hover:text-red-500 hover:underline transition-colors', @click='mainStore().clearCart()') Clear Cart

        div(class='space-y-5 lg:col-span-4')
          div(class='p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5')
            h2(class='text-base font-bold text-slate-900') Order Summary

            div(class='space-y-2')
              div(class='flex gap-2')
                input(
                  class='flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg uppercase text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-teal-600 transition-all',
                  type='text',
                  placeholder='Promo code',
                  v-model='couponInput',
                  @keyup.enter='applyCoupon'
                )
                button(class='px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors', @click='applyCoupon') Apply

              div(v-if='mainStore().appliedCoupon', class='text-xs text-teal-800 bg-teal-50 p-2.5 rounded-xl flex items-center justify-between font-medium border border-teal-100')
                span Code "{{ mainStore().appliedCoupon.code }}" applied (−{{ formatPrice(mainStore().discountPaisa) }})
                button(class='text-red-400 font-bold hover:scale-110', @click='mainStore().removeCoupon()') ✕

            div(class='space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-500')
              div(class='flex justify-between')
                span Subtotal
                span(class='text-slate-900 font-medium') {{ formatPrice(mainStore().subtotalPaisa) }}
              div(v-if='mainStore().discountPaisa > 0', class='flex justify-between text-teal-700')
                span Coupon Savings
                span(class='font-medium') −{{ formatPrice(mainStore().discountPaisa) }}
              div(class='flex justify-between')
                span Shipping
                span(v-if='mainStore().shippingPaisa === 0', class='text-teal-700 font-medium') FREE
                span(v-else, class='text-slate-900 font-medium') {{ formatPrice(mainStore().shippingPaisa) }}
              div(class='flex justify-between text-sm font-bold text-slate-900 pt-3 border-t border-slate-100')
                span Total
                span {{ formatPrice(mainStore().totalPaisa) }}

            router-link(
              class='w-full block text-center py-3.5 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-md active:scale-98',
              to='/checkout'
            ) Proceed to Checkout →

          div(class='p-5 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs text-slate-500 space-y-2')
            div(class='flex items-center gap-2') 🔒 100% Encrypted Payment via Razorpay
            div(class='flex items-center gap-2') 🔄 7-Day Hassle-Free Returns

      div(v-else, class='p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-md mx-auto my-12')
        div(class='text-5xl') 🛍️
        h2(class='text-xl font-bold text-slate-900') Your cart is empty
        p(class='text-xs text-slate-500 leading-relaxed') Explore our curated collections of audio, wearables, and accessories.
        router-link(class='px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all inline-flex mt-2', to='/shop') Continue Shopping
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
