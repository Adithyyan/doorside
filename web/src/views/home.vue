<template lang="pug">
StoreLayout
  HeroBanner

  AnnouncementBar

  section(class='py-14 bg-page')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
      div(class='flex items-end justify-between mb-8')
        div
          p(class='section-label') Best Sellers
          h2(class='heading-lg text-ink leading-none') SHOP THE EDIT

        router-link(class='hidden sm:inline-flex items-center gap-1.5 label-ink hover:opacity-60 transition-opacity border-b border-ink pb-0.5', to='/shop') View All →

      div(v-if='featuredProducts.length > 0', class='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4')
        ProductCard(v-for='product in featuredProducts.slice(0, 8)', :key='product.id', :product='product')

      div(v-else-if='isLoading', class='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4')
        div(v-for='n in 8', :key='n', class='bg-white border border-soft flex flex-col')
          div(class='bg-page-alt animate-pulse aspect-portrait')
          div(class='p-3.5 sm:p-4 space-y-2.5 flex-1 flex flex-col justify-between')
            div(class='space-y-2')
              div(class='h-2 bg-page-alt animate-pulse w-1/4')
              div(class='h-3 bg-page-alt animate-pulse')
              div(class='h-3 bg-page-alt animate-pulse w-3/4')
            div(class='flex items-center justify-between pt-2')
              div(class='h-4 bg-page-alt animate-pulse w-1/3')
              div(class='w-7 h-7 bg-page-alt animate-pulse')

      div(v-else, class='text-center py-16')
        p(class='text-muted text-cap uppercase tracking-editorial') Products are syncing. Check back soon.

      div(class='mt-8 text-center sm:hidden')
        router-link(class='btn-primary inline-flex', to='/shop') Shop All Products

  section(class='py-14 bg-page')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
      div(class='grid lg:grid-cols-2 gap-8 lg:gap-12 items-start')

        div(class='space-y-3')
          div(class='relative overflow-hidden bg-muted aspect-landscape')
            img(class='absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105', src='https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80', alt='Curated Watches Collection', loading='lazy')
            div(class='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent')
            div(class='absolute bottom-4 left-4')
              p(class='text-white text-fine font-bold uppercase tracking-editorial mb-0.5') Signature Watches
              router-link(class='text-white/70 text-fine uppercase tracking-editorial hover:text-white transition-colors', to='/shop?category=watches') Explore Watches →

          div(class='relative overflow-hidden bg-muted aspect-landscape')
            img(class='absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105', src='https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', alt='Everyday Carry Collection', loading='lazy')
            div(class='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent')
            div(class='absolute bottom-4 left-4')
              p(class='text-white text-fine font-bold uppercase tracking-editorial mb-0.5') Everyday Carry &amp; Gear
              router-link(class='text-white/70 text-fine uppercase tracking-editorial hover:text-white transition-colors', to='/shop?category=accessories') Shop Essentials →

        div
          div(class='mb-6')
            p(class='section-label') Just Landed
            h2(class='heading-xl text-ink leading-none')
              | NEW
              br
              | ARRIVALS

          div(v-if='featuredProducts.length > 0', class='grid grid-cols-2 gap-3')
            ProductCard(v-for='product in featuredProducts.slice(0, 4)', :key='`n-${product.id}`', :product='product')

          div(class='mt-6')
            router-link(class='inline-flex items-center gap-2 label-ink hover:opacity-60 transition-opacity border-b border-ink pb-0.5', to='/shop') See More →

  section(class='py-14 bg-page')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
      div(class='flex items-end justify-between mb-6')
        h2(class='heading-lg text-ink leading-none') CURATOR'S JOURNAL

        router-link(class='inline-flex items-center gap-1.5 label-ink hover:opacity-60 transition-opacity border-b border-ink pb-0.5', to='/shop') Discover All →

      div(class='grid grid-cols-1 md:grid-cols-3 gap-3')
        div(class='md:col-span-2 relative overflow-hidden bg-ink aspect-wide')
          img(class='absolute inset-0 w-full h-full object-cover opacity-60', src='https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80', alt='Watchmaking & Style', loading='lazy')
          div(class='absolute inset-0 flex flex-col justify-end p-6')
            p(class='text-fine font-bold uppercase tracking-wide-xl text-white/60 mb-2') Editorial · Timepieces
            h3(class='heading-sm text-white leading-tight mb-1') The Modern Watch Guide: Classic Styles for Everyday Wear
            p(class='text-white/60 text-cap leading-relaxed') Hand-picked dials, chronographs, and strap pairings designed to elevate your personal wardrobe.

        div(class='space-y-3')
          div(class='relative overflow-hidden bg-page-alt aspect-landscape')
            img(class='absolute inset-0 w-full h-full object-cover', src='https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80', alt='Everyday Carry', loading='lazy')
            div(class='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent')
            div(class='absolute bottom-3 left-3')
              p(class='text-white text-fine font-bold uppercase tracking-editorial') Daily Carry Essentials
          div(class='panel-editorial p-4')
            p(class='label-muted mb-1') Buyer's Guide
            p(class='text-cap font-semibold text-ink leading-snug') Trending Accessories &amp; Watches That Offer High-End Aesthetic at Honest Prices

  section(class='py-0')
    div(class='bg-ink py-16')
      div(class='max-w-3xl mx-auto px-4 sm:px-6 text-center')
        p(class='text-fine font-bold uppercase tracking-wide-xl text-white/50 mb-4') Welcome Offer
        h2(class='heading-lg text-white leading-none mb-4') 10% OFF YOUR FIRST ORDER
        p(class='text-white/60 text-cap mb-6')
          | Use code&nbsp;
          span(class='font-mono font-bold text-white bg-white/10 px-2 py-0.5 border border-white/20 select-all') WELCOME10
          | &nbsp;at checkout.
        div(class='flex flex-col sm:flex-row gap-2 max-w-sm mx-auto')
          input(class='input-dark', type='email', placeholder='Enter your email')
          button(class='px-6 py-3 bg-white text-ink text-fine font-bold uppercase tracking-editorial hover:bg-white/90 transition-colors cursor-pointer') Subscribe
        p(class='text-white/30 text-fine mt-3 uppercase tracking-editorial') No spam. Unsubscribe anytime.
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StoreLayout from '@/components/StoreLayout.vue';
import HeroBanner from '@/components/HeroBanner.vue';
import ProductCard from '@/components/ProductCard.vue';
import AnnouncementBar from '@/components/AnnouncementBar.vue';
import { http } from '@/helpers';
import { main } from '@/store';

const featuredProducts = ref([]);
const isLoading = ref(true);

async function getFeaturedProducts() {
  try {
    const res = await http.get('/products?isFeatured=true&pageSize=8');
    featuredProducts.value = res.data.products;
  } catch (err) {
    main().toast('Failed to fetch featured products', 'error');
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await getFeaturedProducts();
});
</script>
