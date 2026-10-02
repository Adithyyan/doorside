<template lang="pug">
StoreLayout
  div(class='bg-[#f5f5f7] min-h-[80vh] flex items-center justify-center py-16 px-4')
    div(class='max-w-2xl w-full apple-card bg-white p-8 sm:p-12 rounded-[28px] text-center space-y-6 shadow-md')
      div(class='w-16 h-16 bg-[#edf7ee] text-[#1b7a3a] rounded-full flex items-center justify-center text-3xl mx-auto shadow-2xs')
        | ✓

      div(class='space-y-1.5')
        h1(class='text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]')
          | You're all set. Order confirmed.
        p(class='text-xs sm:text-sm text-[#6e6e73]')
          | We've received your order and our fulfillment team is preparing it for dispatch.

      // Order Reference Card
      div(class='bg-[#f5f5f7] border border-[#e5e5ea] rounded-2xl p-6 text-left space-y-4')
        div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e5e5ea] pb-4')
          div
            span(class='text-2xs font-semibold text-[#86868b] uppercase tracking-wider') Order Reference
            h2(class='text-lg font-bold text-[#1d1d1f] font-mono') {{ orderNumber }}
          div(class='sm:text-right')
            span(class='text-2xs font-semibold text-[#86868b] uppercase tracking-wider') Estimated Delivery
            p(class='text-xs font-bold text-[#1b7a3a]') 3 – 5 Business Days across India

        div(class='space-y-2 text-xs text-[#6e6e73]')
          div(class='flex items-center gap-2')
            span 📱
            span Real-time milestone updates will be sent via SMS / WhatsApp.
          div(class='flex items-center gap-2')
            span 🚚
            span Track this package anytime using your order reference number.

      div(class='pt-4 flex flex-col sm:flex-row items-center justify-center gap-4')
        router-link(
          class='w-full sm:w-auto apple-btn-primary px-8 py-3.5 text-sm font-semibold shadow-md',
          :to='{ name: "track-order", query: { orderNumber } }'
        ) Track Delivery 📦
        
        router-link(
          class='w-full sm:w-auto apple-btn-secondary px-6 py-3.5 text-sm font-semibold',
          to='/shop'
        ) Continue Shopping
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import StoreLayout from '@/components/StoreLayout.vue';

const route = useRoute();
const orderNumber = computed(() => route.query.orderNumber || 'ORD-NEW');
</script>
