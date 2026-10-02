<template lang="pug">
div(
  class='bg-[#f5f5f7] border-b border-[#e5e5ea] text-[#1d1d1f] py-2.5 px-4 text-center text-xs font-normal tracking-normal transition-all'
)
  div(class='max-w-7xl mx-auto flex items-center justify-center gap-1.5 flex-wrap')
    span(class='text-[#1d1d1f]') {{ mainStore().announcement || 'Get free delivery across India on orders above ₹499.' }}
    router-link(
      class='text-[#0071e3] hover:underline font-medium inline-flex items-center gap-0.5 ml-1',
      to='/shop'
    )
      span Shop offers
      span(class='text-2xs') ↗
</template>

<script setup>
import { mainStore } from '@/store';
</script>
