<template lang="pug">
footer(class='bg-[#f5f5f7] text-[#6e6e73] pt-12 pb-10 border-t border-[#d2d2d7] text-xs font-normal')
  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
    // Footnote & Disclaimers (Apple Footnotes Style)
    div(class='space-y-2 pb-6 border-b border-[#d2d2d7] text-[11px] text-[#86868b] leading-relaxed')
      p * All pricing includes applicable GST and taxes. Free standard shipping applies to orders satisfying the minimum threshold. Delivery timelines may vary by PIN code and courier availability.
      p † Product specifications and feature claims are verified with certified suppliers. Instant cashback and EMI offers subject to issuing bank approval and terms.

    // 4 Directory Columns
    div(class='grid grid-cols-2 gap-8 md:grid-cols-4 pt-2')
      // Column 1: Shop & Explore
      div(class='space-y-3')
        h4(class='text-xs font-semibold text-[#1d1d1f]') Shop & Explore
        ul(class='space-y-2.5 text-xs text-[#424245]')
          li
            router-link(class='hover:text-[#1d1d1f] hover:underline', to='/shop') All Products
          li
            router-link(class='hover:text-[#1d1d1f] hover:underline', to='/shop?category=audio') Audio & Sound
          li
            router-link(class='hover:text-[#1d1d1f] hover:underline', to='/shop?category=wearables') Smart Wearables
          li
            router-link(class='hover:text-[#1d1d1f] hover:underline', to='/shop?category=accessories') Accessories & Cases
          li
            router-link(class='hover:text-[#1d1d1f] hover:underline', to='/shop?category=chargers') Power & Charging

      // Column 2: Account & Orders
      div(class='space-y-3')
        h4(class='text-xs font-semibold text-[#1d1d1f]') Account & Orders
        ul(class='space-y-2.5 text-xs text-[#424245]')
          li
            router-link(class='hover:text-[#1d1d1f] hover:underline', to='/account/orders') Order History
          li
            router-link(class='hover:text-[#1d1d1f] hover:underline', to='/track-order') Track Your Delivery
          li
            router-link(class='hover:text-[#1d1d1f] hover:underline', to='/account/profile') Profile Settings
          li
            router-link(class='hover:text-[#1d1d1f] hover:underline', to='/cart') View Shopping Bag

      // Column 3: Trust & Policies
      div(class='space-y-3')
        h4(class='text-xs font-semibold text-[#1d1d1f]') Policies & Terms
        ul(class='space-y-2.5 text-xs text-[#424245]')
          li
            router-link(class='hover:text-[#1d1d1f] hover:underline', to='/privacy-policy') Privacy Policy
          li
            router-link(class='hover:text-[#1d1d1f] hover:underline', to='/terms-and-conditions') Terms of Sale & Use
          li
            router-link(class='hover:text-[#1d1d1f] hover:underline', to='/shipping-policy') Shipping Information
          li
            router-link(class='hover:text-[#1d1d1f] hover:underline', to='/refund-policy') Return & Refund Policy
          li
            router-link(class='hover:text-[#1d1d1f] hover:underline', to='/cancellation-policy') Cancellation Guidelines

      // Column 4: Specialist Support
      div(class='space-y-3')
        h4(class='text-xs font-semibold text-[#1d1d1f]') Specialist Support
        p(class='text-xs text-[#6e6e73] leading-relaxed')
          | Speak with our dedicated team for product guidance, order inquiries, or corporate bulk purchases.
        ul(class='space-y-2 pt-1 text-xs text-[#424245]')
          li(v-if='mainStore().supportEmail')
            span(class='text-[#86868b]') Email: 
            a(class='text-[#0071e3] hover:underline', :href='`mailto:${mainStore().supportEmail}`') {{ mainStore().supportEmail }}
          li(v-if='mainStore().supportPhone')
            span(class='text-[#86868b]') Phone: 
            span(class='font-medium text-[#1d1d1f]') {{ mainStore().supportPhone }}
          li
            span(class='text-[#86868b]') Hours: 
            span Mon – Sat, 9:00 AM – 7:00 PM IST

    // Bottom Copyright & Legal Links (Apple Standard Row)
    div(class='pt-8 border-t border-[#d2d2d7] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#86868b]')
      div(class='flex flex-wrap items-center gap-x-4 gap-y-1 text-center md:text-left')
        span Copyright © {{ currentYear }} {{ mainStore().brandName }}. All rights reserved.
        span(class='hidden md:inline text-[#d2d2d7]') |
        router-link(class='hover:underline hover:text-[#1d1d1f]', to='/privacy-policy') Privacy Policy
        router-link(class='hover:underline hover:text-[#1d1d1f]', to='/about') Legal
        router-link(class='hover:underline hover:text-[#1d1d1f]', to='/admin/login') Staff / Admin Portal

      div(class='flex items-center gap-2 text-[11px] text-[#6e6e73]')
        span India
        span(class='text-[#d2d2d7]') |
        span 100% Encrypted Transactions
</template>

<script setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import { mainStore } from '@/store';

const currentYear = computed(() => dayjs().format('YYYY'));
</script>
