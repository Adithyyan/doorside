<template lang="pug">
section(class='py-12 sm:py-16 bg-[#f5f5f7] border-t border-[#e5e5ea]')
  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
    // Section Header in Apple's signature Duo typography
    div(class='apple-section-header mb-8')
      h2(class='apple-section-title')
        span(class='heading-primary') The {{ mainStore().brandName }} difference. 
        span(class='heading-secondary') Even more reasons to shop with us.

    // 4 Apple Value Proposition Cards
    div(class='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4')
      div(class='apple-card p-6 flex flex-col justify-between h-full space-y-4')
        div(class='w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-2xl') 🚚
        div(class='space-y-1.5')
          h3(class='text-base font-bold text-[#1d1d1f]') Free Express Delivery
          p(class='text-xs text-[#6e6e73] leading-relaxed')
            | Complimentary fast shipping across India on orders above {{ formatPrice(mainStore().freeShippingThreshold) }}. Fully trackable at every step.
        router-link(class='apple-link text-xs pt-2', to='/shipping-policy')
          span Learn more
          span(class='text-2xs') ›

      div(class='apple-card p-6 flex flex-col justify-between h-full space-y-4')
        div(class='w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-2xl') 🔒
        div(class='space-y-1.5')
          h3(class='text-base font-bold text-[#1d1d1f]') Secure Payment & EMI
          p(class='text-xs text-[#6e6e73] leading-relaxed')
            | Pay securely via UPI, Cards, NetBanking, or Cash on Delivery with bank-grade 256-bit encryption.
        router-link(class='apple-link text-xs pt-2', to='/shop')
          span View options
          span(class='text-2xs') ›

      div(class='apple-card p-6 flex flex-col justify-between h-full space-y-4')
        div(class='w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-2xl') 🛡️
        div(class='space-y-1.5')
          h3(class='text-base font-bold text-[#1d1d1f]') 7-Day Easy Returns
          p(class='text-xs text-[#6e6e73] leading-relaxed')
            | Hassle-free replacement or return window if an item arrives damaged or doesn't meet your expectations.
        router-link(class='apple-link text-xs pt-2', to='/refund-policy')
          span Return policy
          span(class='text-2xs') ›

      div(class='apple-card p-6 flex flex-col justify-between h-full space-y-4')
        div(class='w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-2xl') 💬
        div(class='space-y-1.5')
          h3(class='text-base font-bold text-[#1d1d1f]') Specialist Support
          p(class='text-xs text-[#6e6e73] leading-relaxed')
            | Get real human assistance from our Indian customer care team via WhatsApp or email whenever you need guidance.
        router-link(class='apple-link text-xs pt-2', to='/contact')
          span Connect with us
          span(class='text-2xs') ›
</template>

<script setup>
import { mainStore } from '@/store';
import { formatPrice } from '@/helpers';
</script>
