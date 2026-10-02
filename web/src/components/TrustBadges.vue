<template lang="pug">
div(class='border-b border-[#e5e5ea] bg-[#f5f5f7] py-3.5')
  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
    div(class='flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#6e6e73]')
      div(class='flex items-center gap-1.5')
        span(class='text-[#1d1d1f]') 📦
        span Free delivery over {{ formatPrice(mainStore().freeShippingThreshold) }}
      span(class='hidden sm:inline text-[#d2d2d7]') •
      div(class='flex items-center gap-1.5')
        span(class='text-[#1d1d1f]') 🔄
        span 7-Day Easy Returns
      span(class='hidden sm:inline text-[#d2d2d7]') •
      div(class='flex items-center gap-1.5')
        span(class='text-[#1d1d1f]') 🔒
        span Secure Razorpay Checkout
      span(class='hidden sm:inline text-[#d2d2d7]') •
      div(class='flex items-center gap-1.5')
        span(class='text-[#1d1d1f]') 🇮🇳
        span Fast Dispatch Across India
</template>

<script setup>
import { mainStore } from '@/store';
import { formatPrice } from '@/helpers';
</script>
