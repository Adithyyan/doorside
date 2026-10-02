<template lang="pug">
section(class='pt-8 pb-6 sm:pt-12 sm:pb-8 bg-[#f5f5f7]')
  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
    // Apple Store Top Greeting Row: [Big Store Title] [Helper Statement & Specialist Links]
    div(class='flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-2')
      div
        h1(class='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1d1d1f]')
          | Store
        p(class='text-xs font-semibold uppercase tracking-wider text-[#bf4800] mt-1.5 flex items-center gap-1.5')
          span(class='w-2 h-2 rounded-full bg-[#bf4800] inline-block animate-pulse')
          span Verified Quality & Instant Dispatch Across India

      div(class='max-w-md text-left md:text-right space-y-1.5')
        p(class='text-lg sm:text-xl font-semibold text-[#1d1d1f]')
          | The best way to buy the 
          span(class='text-[#6e6e73]') products you love.
        
        div(class='flex flex-wrap items-center gap-4 text-xs font-medium md:justify-end')
          router-link(class='apple-link', to='/contact')
            span Connect with a Specialist
            span(class='text-2xs') ↗
          router-link(class='apple-link', to='/track-order')
            span Track an Order
            span(class='text-2xs') ↗
</template>

<script setup>
import { mainStore } from '@/store';
</script>
