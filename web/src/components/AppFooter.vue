<template lang="pug">
footer(class='bg-ink text-muted')
  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12')
    div(class='grid grid-cols-2 gap-10 md:grid-cols-4 border-b border-white/10 pb-12')
      div(class='col-span-2 md:col-span-1 space-y-5')
        div
          span(class='heading-xs text-white tracking-widest') {{ mainStore().brandName }}
          p(class='text-fine text-white/40 mt-1 uppercase tracking-editorial') India's Trusted Online Store
        p(class='text-cap text-muted leading-relaxed') Curated tech accessories, wearables &amp; smart gadgets. Fast delivery, guaranteed quality.
        div(class='flex items-center gap-2 pt-1')
          a(href='#', class='w-8 h-8 border border-white/10 hover:border-white/40 flex items-center justify-center text-fine uppercase text-white/60 hover:text-white transition-all', aria-label='Instagram') ig
          a(href='#', class='w-8 h-8 border border-white/10 hover:border-white/40 flex items-center justify-center text-fine uppercase text-white/60 hover:text-white transition-all', aria-label='Pinterest') pt
          a(href='#', class='w-8 h-8 border border-white/10 hover:border-white/40 flex items-center justify-center text-fine uppercase text-white/60 hover:text-white transition-all', aria-label='YouTube') yt

      div(class='space-y-4')
        h4(class='text-fine font-bold text-white uppercase tracking-editorial') Shop
        ul(class='space-y-2 text-cap')
          li: router-link(class='hover:text-white transition-colors', to='/shop') All Products
          li: router-link(class='hover:text-white transition-colors', to='/shop?category=audio') Audio & Sound
          li: router-link(class='hover:text-white transition-colors', to='/shop?category=wearables') Wearables
          li: router-link(class='hover:text-white transition-colors', to='/shop?category=accessories') Accessories
          li: router-link(class='hover:text-white transition-colors', to='/shop?category=gadgets') Smart Gadgets
          li: router-link(class='hover:text-white transition-colors font-bold text-white', to='/shop?sale=true') Deals

      div(class='space-y-4')
        h4(class='text-fine font-bold text-white uppercase tracking-editorial') Support
        ul(class='space-y-2 text-cap')
          li: router-link(class='hover:text-white transition-colors', to='/track-order') Track My Order
          li: router-link(class='hover:text-white transition-colors', to='/account/orders') My Orders
          li: router-link(class='hover:text-white transition-colors', to='/refund-policy') Returns & Refunds
          li: router-link(class='hover:text-white transition-colors', to='/shipping-policy') Shipping Info
          li: router-link(class='hover:text-white transition-colors', to='/cancellation-policy') Cancellations

      div(class='space-y-4')
        h4(class='text-fine font-bold text-white uppercase tracking-editorial') Contact
        div(class='space-y-3 text-cap')
          div(v-if='mainStore().supportEmail', class='flex items-start gap-2')
            span(class='text-muted mt-0.5') ✉
            a(:href='`mailto:${mainStore().supportEmail}`', class='text-muted hover:text-white transition-colors') {{ mainStore().supportEmail }}
          div(v-if='mainStore().supportPhone', class='flex items-start gap-2')
            span(class='text-muted mt-0.5') ☎
            span(class='text-muted') {{ mainStore().supportPhone }}
          div(class='flex items-start gap-2')
            span(class='text-muted mt-0.5') ◷
            span(class='text-muted') Mon–Sat · 9AM – 7PM IST
        div(class='flex items-center gap-1.5 flex-wrap pt-2')
          span(class='text-fine border border-white/15 text-white/40 px-2 py-1 uppercase tracking-editorial') UPI
          span(class='text-fine border border-white/15 text-white/40 px-2 py-1 uppercase tracking-editorial') Cards
          span(class='text-fine border border-white/15 text-white/40 px-2 py-1 uppercase tracking-editorial') COD
          span(class='text-fine border border-white/15 text-white/40 px-2 py-1 uppercase tracking-editorial') EMI

  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-fine text-white/30 uppercase tracking-editorial')
    span Copyright © {{ currentYear }} {{ mainStore().brandName }}. All rights reserved.
    div(class='flex flex-wrap items-center gap-x-5 gap-y-1')
      router-link(class='hover:text-white/60 transition-colors', to='/privacy-policy') Privacy Policy
      router-link(class='hover:text-white/60 transition-colors', to='/terms-and-conditions') Terms
      router-link(class='hover:text-white/60 transition-colors', to='/shipping-policy') Shipping
      router-link(class='hover:text-white/60 transition-colors', to='/admin/login') Admin
    span 🇮🇳 Made in India · Secured by Razorpay
</template>

<script setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import { mainStore } from '@/store';

const currentYear = computed(() => dayjs().format('YYYY'));
</script>
