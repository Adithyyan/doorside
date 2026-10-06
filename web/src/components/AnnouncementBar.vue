<template lang="pug">
div(class='ticker-wrapper')
  div(class='ticker-track')
    span(v-for='item in repeatedItems', :key='item.key', class='inline-flex items-center gap-3 px-6 text-fine font-bold uppercase tracking-editorial text-white shrink-0')
      span(class='text-white/50 text-sm leading-none') ✳
      | {{ item.text }}
</template>

<script setup>
const rawItems = [
  'Free Delivery on Orders Above ₹499',
  'Fresh Tech Drops',
  'Cash on Delivery Available',
  'New Season Gadgets',
  '7-Day Easy Returns',
  'Limited Stock Alert',
  '100% Secure Checkout',
  'Verified Suppliers',
];

const repeatedItems = [...rawItems, ...rawItems].map((text, i) => ({ text, key: i }));
</script>
