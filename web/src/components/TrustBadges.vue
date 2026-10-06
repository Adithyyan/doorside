<template lang="pug">
section(class='bg-page-alt border-y border-soft')
  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
    div(class='grid grid-cols-2 lg:grid-cols-4 divide-x divide-soft')
      div(class='flex items-center gap-3 py-4 px-4 sm:px-6')
        span(class='text-lg shrink-0') 🚚
        div
          p(class='label-ink') Free Delivery
          p(class='text-fine text-muted mt-0.5') Above {{ formatPrice(mainStore().freeShippingThreshold) }}

      div(class='flex items-center gap-3 py-4 px-4 sm:px-6')
        span(class='text-lg shrink-0') 🔄
        div
          p(class='label-ink') Easy Returns
          p(class='text-fine text-muted mt-0.5') 7-day hassle-free

      div(class='flex items-center gap-3 py-4 px-4 sm:px-6')
        span(class='text-lg shrink-0') 🔒
        div
          p(class='label-ink') Secure Payment
          p(class='text-fine text-muted mt-0.5') 100% encrypted

      div(class='flex items-center gap-3 py-4 px-4 sm:px-6')
        span(class='text-lg shrink-0') 💵
        div
          p(class='label-ink') Cash on Delivery
          p(class='text-fine text-muted mt-0.5') Pay when you receive
</template>

<script setup>
import { mainStore } from '@/store';
import { formatPrice } from '@/helpers';
</script>
