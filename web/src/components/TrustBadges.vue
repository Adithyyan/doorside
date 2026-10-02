<template lang="pug">
section(class='bg-white border-y border-slate-100')
  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
    div(class='grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100')
      div(class='flex items-center gap-3 py-5 px-4 sm:px-6 hover:bg-slate-50 transition-colors')
        div(class='trust-item-icon')
          span(class='text-lg') 🚚
        div
          p(class='text-sm font-bold text-slate-900') Free Delivery
          p(class='text-xs text-slate-500 mt-0.5') Orders above {{ formatPrice(mainStore().freeShippingThreshold) }}

      div(class='flex items-center gap-3 py-5 px-4 sm:px-6 hover:bg-slate-50 transition-colors')
        div(class='trust-item-icon')
          span(class='text-lg') 🔄
        div
          p(class='text-sm font-bold text-slate-900') Easy Returns
          p(class='text-xs text-slate-500 mt-0.5') 7-day hassle-free returns

      div(class='flex items-center gap-3 py-5 px-4 sm:px-6 hover:bg-slate-50 transition-colors')
        div(class='trust-item-icon')
          span(class='text-lg') 🔒
        div
          p(class='text-sm font-bold text-slate-900') Secure Payment
          p(class='text-xs text-slate-500 mt-0.5') 100% encrypted checkout

      div(class='flex items-center gap-3 py-5 px-4 sm:px-6 hover:bg-slate-50 transition-colors')
        div(class='trust-item-icon')
          span(class='text-lg') 💵
        div
          p(class='text-sm font-bold text-slate-900') Cash on Delivery
          p(class='text-xs text-slate-500 mt-0.5') Pay when you receive
</template>

<script setup>
import { mainStore } from '@/store';
import { formatPrice } from '@/helpers';
</script>
