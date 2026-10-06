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
        div(v-for='n in 8', :key='n', class='bg-white')
          div(class='bg-page-alt animate-pulse aspect-portrait')
          div(class='pt-3 space-y-2')
            div(class='h-2 bg-page-alt animate-pulse w-1/4')
            div(class='h-3 bg-page-alt animate-pulse')
            div(class='h-4 bg-page-alt animate-pulse w-1/3 mt-3')

      div(v-else, class='text-center py-16')
        p(class='text-muted text-cap uppercase tracking-editorial') Products are syncing. Check back soon.

      div(class='mt-8 text-center sm:hidden')
        router-link(class='btn-primary inline-flex', to='/shop') Shop All Products

  section(class='py-14 bg-page')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
      div(class='grid lg:grid-cols-2 gap-8 lg:gap-12 items-start')

        div(class='space-y-3')
          div(class='relative overflow-hidden bg-muted aspect-landscape')
            img(class='absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105', src='https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80', alt='New Tech Collection', loading='lazy')
            div(class='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent')
            div(class='absolute bottom-4 left-4')
              p(class='text-white text-fine font-bold uppercase tracking-editorial mb-0.5') Tech Essentials
              router-link(class='text-white/70 text-fine uppercase tracking-editorial hover:text-white transition-colors', to='/shop?category=gadgets') Shop Now

          div(class='relative overflow-hidden bg-muted aspect-landscape')
            img(class='absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105', src='https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80', alt='Audio Collection', loading='lazy')
            div(class='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent')
            div(class='absolute bottom-4 left-4')
              p(class='text-white text-fine font-bold uppercase tracking-editorial mb-0.5') Smart Audio
              router-link(class='text-white/70 text-fine uppercase tracking-editorial hover:text-white transition-colors', to='/shop?category=audio') Shop Now

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
        h2(class='heading-lg text-ink leading-none') TECH STORIES

        router-link(class='inline-flex items-center gap-1.5 label-ink hover:opacity-60 transition-opacity border-b border-ink pb-0.5', to='/shop') See More →

      div(class='grid grid-cols-1 md:grid-cols-3 gap-3')
        div(class='md:col-span-2 relative overflow-hidden bg-ink aspect-wide')
          img(class='absolute inset-0 w-full h-full object-cover opacity-60', src='https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', alt='Tech Article', loading='lazy')
          div(class='absolute inset-0 flex flex-col justify-end p-6')
            p(class='text-fine font-bold uppercase tracking-wide-xl text-white/60 mb-2') Editorial · Gadgets
            h3(class='heading-sm text-white leading-tight mb-1') What's Ahead in Modern Tech
            p(class='text-white/60 text-cap leading-relaxed') Insider notes on future gadgets and everyday carry essentials.

        div(class='space-y-3')
          div(class='relative overflow-hidden bg-page-alt aspect-landscape')
            img(class='absolute inset-0 w-full h-full object-cover', src='https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80', alt='Article 2', loading='lazy')
            div(class='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent')
            div(class='absolute bottom-3 left-3')
              p(class='text-white text-fine font-bold uppercase tracking-editorial') Wearables Guide
          div(class='panel-editorial p-4')
            p(class='label-muted mb-1') Buyer's Guide
            p(class='text-cap font-semibold text-ink leading-snug') Top 10 Wireless Earbuds Under ₹2000

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
import { api } from '@/helpers';

const featuredProducts = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const prodRes = await api.get('/products?isFeatured=true&pageSize=8');
    if (prodRes.success && prodRes.data) {
      featuredProducts.value = prodRes.data.products || prodRes.data.items || [];
    }
  } catch {
  } finally {
    isLoading.value = false;
  }
});
</script>
