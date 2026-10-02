<template lang="pug">
// Backdrop
div(
  v-if='mainStore().isDrawerOpen',
  class='fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity',
  @click='mainStore().closeDrawer()'
)

// Slide-over Drawer
div(
  v-if='mainStore().isDrawerOpen',
  class='fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-50'
)
  div(class='w-screen max-w-md bg-[#f5f5f7] shadow-2xl flex flex-col')
    // Header
    div(class='p-5 bg-white border-b border-[#e5e5ea] flex items-center justify-between')
      div(class='flex items-center gap-2')
        h2(class='text-lg font-bold text-[#1d1d1f]') Review your Bag
        span(class='text-xs font-semibold bg-[#f5f5f7] text-[#6e6e73] px-2.5 py-0.5 rounded-full')
          | {{ mainStore().totalItemsCount }} {{ mainStore().totalItemsCount === 1 ? 'item' : 'items' }}
      button(
        class='w-8 h-8 rounded-full bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#e8e8ed] flex items-center justify-center transition-all',
        @click='mainStore().closeDrawer()',
        aria-label='Close bag'
      )
        IconClose(class='w-4 h-4')

    // Free Shipping Progress
    div(v-if='mainStore().items.length > 0', class='bg-white px-5 py-3 border-b border-[#e5e5ea]')
      div(class='flex items-center justify-between text-xs font-medium text-[#1d1d1f] mb-1.5')
        span(v-if='mainStore().amountNeededForFreeShipping > 0')
          | Add 
          strong(class='text-[#0071e3]') {{ formatPrice(mainStore().amountNeededForFreeShipping) }}
          |  more for Free Delivery
        span(v-else, class='text-[#1b7a3a] font-semibold flex items-center gap-1')
          span ✓
          span You've qualified for Free Delivery
        span(class='text-[#86868b] text-[11px]') {{ mainStore().freeShippingProgress }}%
      
      div(class='w-full bg-[#e5e5ea] rounded-full overflow-hidden h-1.5')
        div(
          class='bg-[#0071e3] h-full rounded-full transition-all duration-300',
          :style='{ width: `${mainStore().freeShippingProgress}%` }'
        )

    // Items List
    div(v-if='mainStore().items.length > 0', class='flex-1 overflow-y-auto p-5 space-y-3')
      div(
        v-for='item in mainStore().items',
        :key='`${item.productId}-${item.variantId}`',
        class='apple-card p-4 flex gap-4 bg-white'
      )
        div(class='w-20 h-20 rounded-xl bg-[#f5f5f7] flex items-center justify-center p-1 shrink-0 overflow-hidden')
          img(
            class='max-h-full max-w-full object-contain',
            :src='item.product.primary_image_url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=200&q=80"',
            :alt='item.product.name'
          )
        
        div(class='flex-1 flex flex-col justify-between min-w-0')
          div
            div(class='flex justify-between items-start gap-2')
              h4(class='text-xs font-semibold text-[#1d1d1f] line-clamp-1') {{ item.product.name }}
              button(
                class='text-[#86868b] hover:text-[#bf4800] transition-colors p-0.5',
                @click='mainStore().removeItem(item.productId, item.variantId)',
                aria-label='Remove item'
              )
                IconTrash(class='w-3.5 h-3.5')
            
            p(v-if='item.variant', class='text-2xs text-[#6e6e73] mt-0.5') {{ item.variant.name }}
            p(class='text-xs font-bold text-[#1d1d1f] mt-1')
              | {{ formatPrice(item.variant?.sellingPricePaisa || item.product.selling_price_paisa) }}
          
          div(class='flex items-center gap-2 mt-2')
            div(class='flex items-center border border-[#d2d2d7] rounded-full bg-white px-1 py-0.5')
              button(
                class='w-6 h-6 flex items-center justify-center text-xs font-bold text-[#6e6e73] hover:text-[#1d1d1f]',
                @click='mainStore().updateQuantity(item.productId, item.variantId, item.quantity - 1)'
              ) −
              span(class='w-6 text-center text-xs font-semibold text-[#1d1d1f]') {{ item.quantity }}
              button(
                class='w-6 h-6 flex items-center justify-center text-xs font-bold text-[#6e6e73] hover:text-[#1d1d1f]',
                @click='mainStore().updateQuantity(item.productId, item.variantId, item.quantity + 1)'
              ) +

    // Empty Bag State
    div(v-else, class='flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3')
      div(class='w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl shadow-xs') 🛍️
      h3(class='text-lg font-bold text-[#1d1d1f]') Your Bag is empty.
      p(class='text-xs text-[#6e6e73] max-w-xs') Explore our curated collections of audio, wearables, and accessories.
      button(
        class='apple-btn-primary text-xs mt-3',
        @click='goToShop'
      ) Continue Shopping

    // Checkout Summary & Footer
    div(v-if='mainStore().items.length > 0', class='p-5 bg-white border-t border-[#e5e5ea] space-y-4')
      // Coupon Input
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
        class='text-xs text-[#1b7a3a] flex items-center justify-between bg-[#edf7ee] px-3.5 py-1.5 rounded-xl font-medium'
      )
        span Code "{{ mainStore().appliedCoupon.code }}" applied (-{{ formatPrice(mainStore().discountPaisa) }})
        button(class='text-[#bf4800] font-bold hover:scale-110', @click='mainStore().removeCoupon()') ✕

      // Price breakdown
      div(class='space-y-1.5 text-xs text-[#6e6e73] pt-1')
        div(class='flex justify-between')
          span Subtotal
          span(class='text-[#1d1d1f] font-medium') {{ formatPrice(mainStore().subtotalPaisa) }}
        div(v-if='mainStore().discountPaisa > 0', class='flex justify-between text-[#1b7a3a]')
          span Discount Savings
          span(class='font-medium') -{{ formatPrice(mainStore().discountPaisa) }}
        div(class='flex justify-between')
          span Shipping
          span(v-if='mainStore().shippingPaisa === 0', class='text-[#1b7a3a] font-medium') FREE
          span(v-else, class='text-[#1d1d1f] font-medium') {{ formatPrice(mainStore().shippingPaisa) }}
        div(class='flex justify-between text-sm font-bold text-[#1d1d1f] pt-2 border-t border-[#e5e5ea]')
          span Total
          span {{ formatPrice(mainStore().totalPaisa) }}

      button(
        class='w-full apple-btn-primary py-3 text-sm font-semibold shadow-md',
        @click='goToCheckout'
      ) Check Out
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
