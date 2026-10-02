<template lang="pug">
StoreLayout
  div(class='bg-slate-50 min-h-[80vh] flex items-center justify-center py-16 px-4')
    div(class='max-w-2xl w-full bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 text-center space-y-6 shadow-xs')
      div(class='w-16 h-16 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center text-3xl mx-auto')
        | ✓

      div(class='space-y-1.5')
        h1(class='text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900')
          | You're all set! Order confirmed.
        p(class='text-xs sm:text-sm text-slate-500')
          | We've received your order and our fulfillment team is preparing it for prompt dispatch.

      div(class='bg-slate-50 border border-slate-200 rounded-xl p-6 text-left space-y-4')
        div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4')
          div
            span(class='text-2xs font-semibold text-slate-400 uppercase tracking-wider') Order Reference
            h2(class='text-lg font-bold text-slate-900 font-mono') {{ orderNumber }}
          div(class='sm:text-right')
            span(class='text-2xs font-semibold text-slate-400 uppercase tracking-wider') Estimated Delivery
            p(class='text-xs font-bold text-teal-700') 3 – 5 Business Days across India

        div(class='space-y-2 text-xs text-slate-600')
          div(class='flex items-center gap-2')
            span 📱
            span Real-time milestone updates will be sent via SMS / WhatsApp.
          div(class='flex items-center gap-2')
            span 🚚
            span Track this package anytime using your order reference number.

      div(class='pt-4 flex flex-col sm:flex-row items-center justify-center gap-4')
        router-link(
          class='w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98',
          :to='{ name: "track-order", query: { orderNumber } }'
        ) Track Delivery 📦
        
        router-link(
          class='w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-xl transition-all',
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
