<template lang="pug">
section(class='bg-page overflow-hidden')
  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
    div(class='grid lg:grid-cols-2 gap-0 hero-min-h')

      div(class='flex flex-col justify-center py-14 lg:py-20 pr-0 lg:pr-12 order-2 lg:order-1')
        p(class='label-muted mb-4') Curated Collection · {{ currentYear }} Edition

        h1(class='heading-display mb-6')
          | CURATED
          br
          span WATCHES
          br
          | &amp; DROPS

        p(class='text-sm text-soft leading-relaxed mb-8 max-w-sm')
          | Handpicked statement timepieces, trending lifestyle accessories &amp; everyday statement pieces. Direct-to-you value, quality checked before dispatch.

        div(class='flex items-center gap-3 flex-wrap')
          router-link(class='btn-primary', to='/shop?category=watches')
            span Shop Watches
            span →

          router-link(class='btn-outline', to='/shop') Explore All Drops

        div(class='flex items-center gap-8 mt-10 pt-8 border-t border-soft')
          div
            p(class='heading-md mb-0') 100%
            p(class='label-muted') Quality Checked
          div(class='w-px h-8 bg-page-alt')
          div
            p(class='heading-md mb-0') COD
            p(class='label-muted') Available
          div(class='w-px h-8 bg-page-alt')
          div
            p(class='heading-md mb-0') Pan-India
            p(class='label-muted') Tracked Delivery

      div(class='relative order-1 lg:order-2 h-80 sm:h-96 lg:h-auto')
        div(class='absolute inset-0 grid grid-cols-2 gap-2 py-6')
          div(class='relative overflow-hidden bg-page-alt')
            img(class='absolute inset-0 w-full h-full object-cover', src='https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80', alt='Luxury Timepiece', loading='eager')
            div(class='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent')
            div(class='absolute bottom-3 left-3')
              p(class='text-white text-fine font-bold uppercase tracking-editorial') Signature Timepieces
            div(class='absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center')
              span(class='text-ink text-xs font-bold') ↗

          div(class='flex flex-col gap-2')
            div(class='relative flex-1 overflow-hidden bg-page-alt')
              img(class='absolute inset-0 w-full h-full object-cover', src='https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80', alt='Classic Watch', loading='eager')
              div(class='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent')
              div(class='absolute bottom-3 left-3')
                p(class='text-white text-fine font-bold uppercase tracking-editorial') Classic Chrono
            div(class='relative flex-1 overflow-hidden bg-page-alt')
              img(class='absolute inset-0 w-full h-full object-cover', src='https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80', alt='Everyday Carry', loading='eager')
              div(class='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent')
              div(class='absolute bottom-3 left-3 right-3')
                p(class='text-white text-fine font-bold uppercase tracking-editorial leading-tight')
                  | Trending Lifestyle Drops
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>
