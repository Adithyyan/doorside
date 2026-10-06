<template lang="pug">
section(class='bg-page overflow-hidden')
  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
    div(class='grid lg:grid-cols-2 gap-0 hero-min-h')

      div(class='flex flex-col justify-center py-14 lg:py-20 pr-0 lg:pr-12 order-2 lg:order-1')
        p(class='label-muted mb-4') New Season Drop · {{ currentYear }}

        h1(class='heading-display mb-6')
          | GEAR
          br
          span DROP
          br
          | {{ currentYear }}

        p(class='text-sm text-soft leading-relaxed mb-8 max-w-xs')
          | Next-gen tech accessories, wearables &amp; smart gadgets. Bold picks for bold people.

        div(class='flex items-center gap-3 flex-wrap')
          router-link(class='btn-primary', to='/shop')
            span Shop Now
            span →

          router-link(class='btn-outline', to='/shop?sale=true') View Deals

        div(class='flex items-center gap-8 mt-10 pt-8 border-t border-soft')
          div
            p(class='heading-md mb-0') 10K+
            p(class='label-muted') Customers
          div(class='w-px h-8 bg-page-alt')
          div
            p(class='heading-md mb-0') 500+
            p(class='label-muted') Products
          div(class='w-px h-8 bg-page-alt')
          div
            p(class='heading-md mb-0') 4.8★
            p(class='label-muted') Rating

      div(class='relative order-1 lg:order-2 h-80 sm:h-96 lg:h-auto')
        div(class='absolute inset-0 grid grid-cols-2 gap-2 py-6')
          div(class='relative overflow-hidden bg-page-alt')
            img(class='absolute inset-0 w-full h-full object-cover', src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', alt='Featured Gadget', loading='eager')
            div(class='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent')
            div(class='absolute bottom-3 left-3')
              p(class='text-white text-fine font-bold uppercase tracking-editorial') Premium Audio
            div(class='absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center')
              span(class='text-ink text-xs font-bold') ↗

          div(class='flex flex-col gap-2')
            div(class='relative flex-1 overflow-hidden bg-page-alt')
              img(class='absolute inset-0 w-full h-full object-cover', src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', alt='Smart Watch', loading='eager')
              div(class='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent')
            div(class='relative flex-1 overflow-hidden bg-page-alt')
              img(class='absolute inset-0 w-full h-full object-cover', src='https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80', alt='Smart Device', loading='eager')
              div(class='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent')
              div(class='absolute bottom-3 left-3 right-3')
                p(class='text-white text-fine font-bold uppercase tracking-editorial leading-tight')
                  | Discover our newest drops for the season
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>
