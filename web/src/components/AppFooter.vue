<template lang="pug">
footer(class='bg-slate-900 text-slate-400')
  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10')
    div(class='grid grid-cols-2 gap-10 md:grid-cols-4')
      div(class='col-span-2 md:col-span-1 space-y-4')
        div
          span(class='text-xl font-black text-white') {{ mainStore().brandName }}
          p(class='text-xs text-slate-500 mt-1') India's trusted online store.
        p(class='text-sm text-slate-400 leading-relaxed') Curated tech accessories, wearables & smart gadgets. Delivered fast, with love.
        div(class='flex items-center gap-3 pt-2')
          a(href='#', class='w-8 h-8 bg-slate-800 hover:bg-teal-700 rounded-lg flex items-center justify-center text-sm text-white transition-colors', aria-label='Instagram') 📸
          a(href='#', class='w-8 h-8 bg-slate-800 hover:bg-teal-700 rounded-lg flex items-center justify-center text-sm text-white transition-colors', aria-label='WhatsApp') 💬
          a(href='#', class='w-8 h-8 bg-slate-800 hover:bg-teal-700 rounded-lg flex items-center justify-center text-sm text-white transition-colors', aria-label='Facebook') 👍

      div(class='space-y-3')
        h4(class='text-sm font-bold text-white') Quick Links
        ul(class='space-y-2.5 text-sm')
          li: router-link(class='hover:text-teal-400 transition-colors', to='/shop') All Products
          li: router-link(class='hover:text-teal-400 transition-colors', to='/shop?category=audio') Audio & Sound
          li: router-link(class='hover:text-teal-400 transition-colors', to='/shop?category=wearables') Smart Wearables
          li: router-link(class='hover:text-teal-400 transition-colors', to='/shop?category=accessories') Accessories
          li: router-link(class='hover:text-teal-400 transition-colors', to='/shop?category=chargers') Chargers
          li: router-link(class='hover:text-teal-400 transition-colors font-semibold text-teal-400', to='/shop') Sale

      div(class='space-y-3')
        h4(class='text-sm font-bold text-white') Customer Service
        ul(class='space-y-2.5 text-sm')
          li: router-link(class='hover:text-teal-400 transition-colors', to='/track-order') Track My Order
          li: router-link(class='hover:text-teal-400 transition-colors', to='/account/orders') My Orders
          li: router-link(class='hover:text-teal-400 transition-colors', to='/refund-policy') Returns & Refunds
          li: router-link(class='hover:text-teal-400 transition-colors', to='/shipping-policy') Shipping Info
          li: router-link(class='hover:text-teal-400 transition-colors', to='/contact') Contact Support
          li: router-link(class='hover:text-teal-400 transition-colors', to='/cancellation-policy') Cancellation Policy

      div(class='space-y-4')
        h4(class='text-sm font-bold text-white') Get in Touch
        div(class='space-y-3 text-sm')
          div(v-if='mainStore().supportEmail', class='flex items-start gap-2')
            span(class='text-teal-400 mt-0.5') ✉
            div
              p(class='text-slate-500 text-xs') Email us at
              a(:href='`mailto:${mainStore().supportEmail}`', class='text-white hover:text-teal-400 transition-colors text-xs') {{ mainStore().supportEmail }}
          div(v-if='mainStore().supportPhone', class='flex items-start gap-2')
            span(class='text-teal-400 mt-0.5') 📞
            div
              p(class='text-slate-500 text-xs') Call or WhatsApp
              span(class='text-white text-xs') {{ mainStore().supportPhone }}
          div(class='flex items-start gap-2')
            span(class='text-teal-400 mt-0.5') 🕘
            div
              p(class='text-slate-500 text-xs') Support Hours
              span(class='text-white text-xs') Mon–Sat · 9AM – 7PM IST

        div(class='flex items-center gap-2 flex-wrap pt-2')
          span(class='text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded') UPI
          span(class='text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded') Cards
          span(class='text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded') COD
          span(class='text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded') EMI

  div(class='border-t border-slate-800')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500')
      span Copyright © {{ currentYear }} {{ mainStore().brandName }}. All rights reserved.
      div(class='flex flex-wrap items-center gap-x-4 gap-y-1')
        router-link(class='hover:text-white transition-colors', to='/privacy-policy') Privacy Policy
        router-link(class='hover:text-white transition-colors', to='/terms-and-conditions') Terms of Use
        router-link(class='hover:text-white transition-colors', to='/shipping-policy') Shipping
        router-link(class='hover:text-white transition-colors', to='/admin/login') Admin
      span 🇮🇳 Made in India · Secured by Razorpay
</template>

<script setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import { mainStore } from '@/store';

const currentYear = computed(() => dayjs().format('YYYY'));
</script>
