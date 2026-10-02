<template lang="pug">
StoreLayout
  div(class='bg-[#f5f5f7] min-h-screen py-10 sm:py-14')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      // Page Heading
      div(class='border-b border-[#e5e5ea] pb-4')
        h1(class='text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]')
          | Review your Bag
        p(class='text-xs text-[#6e6e73] mt-1')
          | Free standard shipping and free returns across India.

      div(v-if='mainStore().items.length > 0', class='grid grid-cols-1 gap-10 lg:grid-cols-12 items-start')
        // Left: Bag Items
        div(class='space-y-5 lg:col-span-8')
          // Free Shipping Callout
          div(class='apple-card p-4 bg-white')
            div(class='flex items-center justify-between text-xs font-medium text-[#1d1d1f] mb-1.5')
              span(v-if='mainStore().amountNeededForFreeShipping > 0')
                | Add 
                strong(class='text-[#0071e3]') {{ formatPrice(mainStore().amountNeededForFreeShipping) }}
                |  more for Free Delivery
              span(v-else, class='text-[#1b7a3a] font-semibold flex items-center gap-1')
                span ✓
                span You've qualified for Free Delivery
              span(class='text-[#86868b] text-[11px]') {{ mainStore().freeShippingProgress }}%
            
            div(class='w-full bg-[#e5e5ea] h-1.5 rounded-full overflow-hidden')
              div(
                class='bg-[#0071e3] h-full rounded-full transition-all duration-300',
                :style='{ width: `${mainStore().freeShippingProgress}%` }'
              )

          // Bag Items List
          div(class='apple-card bg-white divide-y divide-[#f5f5f7] overflow-hidden')
            div(
              v-for='item in mainStore().items',
              :key='`${item.productId}-${item.variantId}`',
              class='p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5'
            )
              div(class='w-24 h-24 rounded-2xl bg-[#f5f5f7] flex items-center justify-center p-2 shrink-0 overflow-hidden')
                img(
                  class='max-h-full max-w-full object-contain',
                  :src='item.product.primary_image_url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80"',
                  :alt='item.product.name'
                )
              
              div(class='flex-1 min-w-0 space-y-1')
                router-link(
                  class='text-sm font-semibold text-[#1d1d1f] line-clamp-1 hover:text-[#0071e3] transition-colors',
                  :to='`/product/${item.product.slug}`'
                ) {{ item.product.name }}
                p(v-if='item.variant', class='text-xs text-[#6e6e73]') {{ item.variant.name }}
                p(class='text-xs text-[#86868b]') Dispatches in 24 hours
              
              div(class='flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto')
                div(class='flex items-center border border-[#d2d2d7] rounded-full bg-white px-1 py-0.5')
                  button(
                    class='w-7 h-7 flex items-center justify-center text-xs font-bold text-[#6e6e73] hover:text-[#1d1d1f]',
                    @click='mainStore().updateQuantity(item.productId, item.variantId, item.quantity - 1)'
                  ) −
                  span(class='w-7 text-center text-xs font-bold text-[#1d1d1f]') {{ item.quantity }}
                  button(
                    class='w-7 h-7 flex items-center justify-center text-xs font-bold text-[#6e6e73] hover:text-[#1d1d1f]',
                    @click='mainStore().updateQuantity(item.productId, item.variantId, item.quantity + 1)'
                  ) +

                span(class='text-sm font-bold text-[#1d1d1f] w-24 text-right')
                  | {{ formatPrice((item.variant?.sellingPricePaisa || item.product.selling_price_paisa) * item.quantity) }}

                button(
                  class='text-[#86868b] hover:text-[#bf4800] transition-colors p-1',
                  @click='mainStore().removeItem(item.productId, item.variantId)',
                  title='Remove from bag'
                )
                  IconTrash(class='w-4 h-4')

          div(class='flex justify-between items-center text-xs pt-2')
            router-link(class='apple-link', to='/shop')
              span ‹ Continue Shopping
            button(class='text-[#86868b] hover:text-[#bf4800] hover:underline transition-colors', @click='mainStore().clearCart()')
              | Clear Bag

        // Right: Order Summary Card
        div(class='space-y-5 lg:col-span-4')
          div(class='apple-card p-6 bg-white space-y-5')
            h2(class='text-base font-bold text-[#1d1d1f]') Summary
            
            // Coupon Box
            div(class='space-y-2')
              div(class='flex gap-2')
                input(
                  class='flex-1 px-3.5 py-2 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-full uppercase text-[#1d1d1f] placeholder:text-[#86868b] focus:bg-white focus:outline-hidden focus:border-[#0071e3]',
                  type='text',
                  placeholder='Promo code',
                  v-model='couponInput',
                  @keyup.enter='applyCoupon'
                )
                button(
                  class='apple-btn-secondary text-xs px-4 py-2',
                  @click='applyCoupon'
                ) Apply
              
              div(
                v-if='mainStore().appliedCoupon',
                class='text-xs text-[#1b7a3a] bg-[#edf7ee] p-2.5 rounded-xl flex items-center justify-between font-medium'
              )
                span Code "{{ mainStore().appliedCoupon.code }}" applied (-{{ formatPrice(mainStore().discountPaisa) }})
                button(class='text-[#bf4800] font-bold hover:scale-110', @click='mainStore().removeCoupon()') ✕

            // Price Details
            div(class='space-y-2 pt-3 border-t border-[#e5e5ea] text-xs text-[#6e6e73]')
              div(class='flex justify-between')
                span Subtotal
                span(class='text-[#1d1d1f] font-medium') {{ formatPrice(mainStore().subtotalPaisa) }}
              div(v-if='mainStore().discountPaisa > 0', class='flex justify-between text-[#1b7a3a]')
                span Coupon Savings
                span(class='font-medium') -{{ formatPrice(mainStore().discountPaisa) }}
              div(class='flex justify-between')
                span Shipping
                span(v-if='mainStore().shippingPaisa === 0', class='text-[#1b7a3a] font-medium') FREE
                span(v-else, class='text-[#1d1d1f] font-medium') {{ formatPrice(mainStore().shippingPaisa) }}
              div(class='flex justify-between text-base font-bold text-[#1d1d1f] pt-3 border-t border-[#e5e5ea]')
                span Total
                span {{ formatPrice(mainStore().totalPaisa) }}

            router-link(
              class='w-full apple-btn-primary py-3.5 text-sm font-semibold shadow-md block text-center',
              to='/checkout'
            ) Check Out

          // Reassurance Box
          div(class='apple-card p-5 bg-white text-xs text-[#6e6e73] space-y-2')
            div(class='flex items-center gap-2')
              span 🔒
              span 100% Encrypted Payment via Razorpay
            div(class='flex items-center gap-2')
              span 🔄
              span 7-Day Hassle-Free Returns

      // Empty State
      div(v-else, class='apple-card p-16 text-center bg-white space-y-4 max-w-md mx-auto my-12')
        div(class='text-5xl') 🛍️
        h2(class='text-xl font-bold text-[#1d1d1f]') Your Bag is empty.
        p(class='text-xs text-[#6e6e73] leading-relaxed')
          | Explore our curated collections of audio, wearables, and accessories with free delivery on all eligible orders.
        router-link(
          class='apple-btn-primary inline-flex mt-2 text-xs',
          to='/shop'
        ) Continue Shopping
</template>

<script setup>
import { ref } from 'vue';
import StoreLayout from '@/components/StoreLayout.vue';
import { mainStore } from '@/store';
import { formatPrice } from '@/helpers';
import IconTrash from '@/components/icons/trash.vue';

const couponInput = ref('');

async function applyCoupon() {
  if (!couponInput.value.trim()) return;
  try {
    await mainStore().applyCoupon(couponInput.value);
    mainStore().success(`Coupon ${couponInput.value} applied successfully!`);
    couponInput.value = '';
  } catch (error) {
    mainStore().error(error.message || 'Invalid coupon code');
  }
}
</script>
