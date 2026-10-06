<template lang="pug">
StoreLayout
  div(class='bg-page min-h-[80vh] flex items-center justify-center py-16 px-4')
    div(class='panel-editorial max-w-2xl w-full p-8 sm:p-12 text-center space-y-6')
      div(class='w-14 h-14 bg-ink text-white flex items-center justify-center text-2xl mx-auto')
        | ✓

      div(class='space-y-1.5')
        h1(class='heading-md text-ink leading-tight')
          | Order Confirmed
        p(class='text-cap text-muted uppercase tracking-editorial')
          | We've received your order and our fulfillment team is preparing prompt dispatch.

      div(class='bg-page-alt border border-soft p-6 text-left space-y-4')
        div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-soft pb-4')
          div
            span(class='label-muted') Order Reference
            h2(class='heading-sm text-ink font-mono') {{ orderNumber }}
          div(class='sm:text-right')
            span(class='label-muted') Estimated Delivery
            p(class='text-cap font-bold text-ink uppercase tracking-editorial') 3 – 5 Business Days across India

        div(class='space-y-2 text-fine text-soft uppercase tracking-editorial')
          div(class='flex items-center gap-2')
            span 📱
            span Real-time milestone updates will be sent via SMS / WhatsApp.
          div(class='flex items-center gap-2')
            span 🚚
            span Track this package anytime using your order reference number.

      div(class='pt-4 flex flex-col sm:flex-row items-center justify-center gap-4')
        router-link(class='btn-primary px-8 py-4', :to='{ name: "track-order", query: { orderNumber } }') Track Delivery 📦
        
        router-link(class='btn-outline px-6 py-4', to='/shop') Continue Shopping
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import StoreLayout from '@/components/StoreLayout.vue';

const route = useRoute();
const orderNumber = computed(() => route.query.orderNumber || 'ORD-NEW');
</script>
