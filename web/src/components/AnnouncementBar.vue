<template lang="pug">
div(class='ticker-wrapper')
  div(class='ticker-track')
    span(v-for='item in tickerItems', :key='item', class='inline-flex items-center gap-2 px-8 text-xs font-medium text-white/80 shrink-0')
      span(class='text-teal-400 text-sm') ·
      | {{ item }}
    span(v-for='item in tickerItems', :key='`d-${item}`', class='inline-flex items-center gap-2 px-8 text-xs font-medium text-white/80 shrink-0')
      span(class='text-teal-400 text-sm') ·
      | {{ item }}
</template>

<script setup>
import { mainStore } from '@/store';

const tickerItems = [
  mainStore().announcement || 'Free Delivery on orders above ₹499',
  'Cash on Delivery Available Across India',
  '100% Secure Razorpay Checkout',
  '7-Day Easy Returns & Replacements',
  'Genuine Products · Verified Suppliers',
  'Same-Day Dispatch on Orders Before 2PM',
];
</script>
