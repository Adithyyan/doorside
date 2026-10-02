<template lang="pug">
section(class='py-14 bg-slate-50')
  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
    div(class='text-center mb-10')
      p(class='section-label justify-center') Why Choose Us
      h2(class='text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2') The {{ mainStore().brandName }} Promise
      p(class='text-slate-500 text-sm mt-3 max-w-xl mx-auto') Everything we do is designed to give you the best shopping experience in India.

    div(class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5')
      div(class='bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group')
        div(class='w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform') 🚀
        h3(class='text-base font-bold text-slate-900 mb-2') Express Delivery
        p(class='text-sm text-slate-500 leading-relaxed') Fast shipping across India. Orders above {{ formatPrice(mainStore().freeShippingThreshold) }} get free delivery, fully trackable.
        router-link(class='inline-flex items-center gap-1 text-xs font-semibold text-teal-700 mt-3 hover:gap-2 transition-all', to='/shipping-policy')
          span Know more
          span →

      div(class='bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group')
        div(class='w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform') 🔒
        h3(class='text-base font-bold text-slate-900 mb-2') 100% Secure
        p(class='text-sm text-slate-500 leading-relaxed') Pay via UPI, Cards, NetBanking, or Cash on Delivery with bank-grade 256-bit encryption.
        router-link(class='inline-flex items-center gap-1 text-xs font-semibold text-teal-700 mt-3 hover:gap-2 transition-all', to='/shop')
          span Pay securely
          span →

      div(class='bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group')
        div(class='w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform') 🔄
        h3(class='text-base font-bold text-slate-900 mb-2') Easy Returns
        p(class='text-sm text-slate-500 leading-relaxed') Not satisfied? Return or replace within 7 days — no questions, no stress.
        router-link(class='inline-flex items-center gap-1 text-xs font-semibold text-teal-700 mt-3 hover:gap-2 transition-all', to='/refund-policy')
          span Return policy
          span →

      div(class='bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group')
        div(class='w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform') 💬
        h3(class='text-base font-bold text-slate-900 mb-2') Live Support
        p(class='text-sm text-slate-500 leading-relaxed') Real humans available via WhatsApp & email — whenever you need help.
        router-link(class='inline-flex items-center gap-1 text-xs font-semibold text-teal-700 mt-3 hover:gap-2 transition-all', to='/contact')
          span Get in touch
          span →
</template>

<script setup>
import { mainStore } from '@/store';
import { formatPrice } from '@/helpers';
</script>
