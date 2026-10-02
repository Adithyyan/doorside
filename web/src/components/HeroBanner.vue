<template lang="pug">
section(class='bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden')
  div(class='absolute inset-0 pointer-events-none')
    div(class='absolute top-0 right-0 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4')
    div(class='absolute bottom-0 left-0 w-[350px] h-[350px] bg-slate-600/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/4')

  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 relative z-10')
    div(class='grid lg:grid-cols-2 gap-10 items-center')
      div(class='space-y-6')
        div(class='inline-flex items-center gap-2 px-3 py-1.5 bg-teal-600/15 border border-teal-500/25 rounded-full')
          span(class='w-2 h-2 rounded-full bg-teal-400 animate-pulse block')
          span(class='text-xs font-semibold text-teal-300 uppercase tracking-wider') New Arrivals · Limited Stock

        h1(class='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight')
          | Top-Rated Gadgets
          br
          span(class='text-teal-400') Delivered to Your Door

        p(class='text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg')
          | Premium tech accessories, wearables & smart gadgets — fast delivery, easy returns, guaranteed quality.

        div(class='flex flex-wrap gap-6 pt-2')
          div(class='flex items-center gap-2')
            span(class='text-2xl font-black text-white') 10K+
            span(class='text-xs text-slate-400 leading-tight') Happy
              br
              | Customers
          div(class='w-px h-8 bg-slate-700')
          div(class='flex items-center gap-2')
            span(class='text-2xl font-black text-white') 4.8★
            span(class='text-xs text-slate-400 leading-tight') Avg.
              br
              | Rating
          div(class='w-px h-8 bg-slate-700')
          div(class='flex items-center gap-2')
            span(class='text-2xl font-black text-white') 500+
            span(class='text-xs text-slate-400 leading-tight') Products
              br
              | In Stock

        div(class='flex flex-wrap gap-3 pt-2')
          router-link(
            class='inline-flex items-center gap-2 px-6 py-3.5 bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-teal-700 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-700/25 active:translate-y-0',
            to='/shop'
          )
            span Shop Now
            span →

          router-link(
            class='inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-all',
            to='/shop?sale=true'
          )
            span View Deals

      div(class='hidden lg:flex items-center justify-center relative')
        div(class='relative w-[420px] h-[420px]')
          div(class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl flex items-center justify-center shadow-2xl')
            img(
              class='w-40 h-40 object-contain animate-float',
              src='https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
              alt='Featured Product'
            )

          div(class='absolute top-8 right-8 bg-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg') Up to 40% OFF
          div(class='absolute bottom-14 left-4 bg-white text-slate-900 text-xs font-semibold px-3 py-2 rounded-xl shadow-xl flex items-center gap-1.5')
            span(class='text-amber-400') ★★★★★
            span 4.8 / 5
          div(class='absolute top-20 left-2 bg-teal-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg') ✓ Free Delivery
          div(class='absolute bottom-8 right-2 bg-slate-800 border border-white/15 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xl') COD Available

          div(class='absolute inset-8 rounded-full border border-white/8 opacity-60')
          div(class='absolute inset-0 rounded-full border border-white/4 opacity-40')
</template>

<script setup>
import { mainStore } from '@/store';
</script>
