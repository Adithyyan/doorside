<template lang="pug">
div(class='ticker-wrapper')
  div(class='ticker-track')
    span(v-for='item in repeatedItems', :key='item.key', class='inline-flex items-center gap-3 px-6 text-fine font-bold uppercase tracking-editorial text-white shrink-0')
      span(class='text-white/50 text-sm leading-none') ✳
      | {{ item.text }}
</template>

<script setup>
const rawItems = [
  'Cash on Delivery Available',
  'Curated Watches & Trending Finds',
  '100% Secure Checkout',
  'Verified Quality Checked',
  'Pan-India Tracked Dispatch',
  'Customer Support Assistance',
];

const repeatedItems = [...rawItems, ...rawItems].map((text, i) => ({ text, key: i }));
</script>
