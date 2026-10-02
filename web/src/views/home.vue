<template lang="pug">
StoreLayout
  // 1. Apple Store Header Greeting
  HeroBanner

  // 2. Apple Store Horizontal Category Shelf
  CategoryGrid(:categories='categories')

  // 3. Apple Store "The latest. Take a look at what's new." Carousel (From Screenshot 2)
  section(class='py-10 sm:py-14 bg-[#f5f5f7]')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
      div(class='apple-section-header flex items-end justify-between mb-6')
        h2(class='apple-section-title')
          span(class='heading-primary') The latest. 
          span(class='heading-secondary') Take a look at what's new.
        
        div(class='hidden sm:flex items-center gap-2')
          button(
            class='apple-nav-arrow shadow-xs',
            @click='scrollHeroLeft',
            aria-label='Scroll left'
          )
            span(class='text-base font-bold leading-none') ‹
          button(
            class='apple-nav-arrow shadow-xs',
            @click='scrollHeroRight',
            aria-label='Scroll right'
          )
            span(class='text-base font-bold leading-none') ›

      // Large Immersive Hero Cards Row (Horizontally Scrollable)
      div(
        ref='heroCardsContainer',
        class='flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-0.5'
      )
        // Hero Card 1: Dark Obsidian Luxury Card
        router-link(
          class='apple-card-dark shrink-0 w-[300px] sm:w-[380px] md:w-[420px] h-[480px] sm:h-[500px] p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer',
          to='/shop?category=audio'
        )
          div(class='space-y-2 relative z-10')
            span(class='apple-badge text-[#ff8d36]') NEW RELEASE
            h3(class='text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight')
              | Pro Wireless Audio
            p(class='text-xs sm:text-sm text-[#a1a1a6] max-w-xs leading-relaxed')
              | Spatial acoustic architecture with adaptive hybrid noise cancellation.
            p(class='text-xs font-medium text-[#86868b] pt-1')
              | From ₹1,499.00*
          
          div(class='relative w-full h-56 mt-4 flex items-center justify-center')
            img(
              class='max-h-full max-w-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105',
              src='https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
              alt='Pro Wireless Audio'
            )

        // Hero Card 2: Light Clean Minimal Card
        router-link(
          class='apple-card shrink-0 w-[300px] sm:w-[380px] md:w-[420px] h-[480px] sm:h-[500px] p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer bg-white',
          to='/shop?category=wearables'
        )
          div(class='space-y-2 relative z-10')
            span(class='apple-badge') BESTSELLER
            h3(class='text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] leading-tight')
              | Ultra Active Smartwatch
            p(class='text-xs sm:text-sm text-[#6e6e73] max-w-xs leading-relaxed')
              | Continuous biometric metrics, AMOLED display, and 10-day battery life.
            p(class='text-xs font-medium text-[#6e6e73] pt-1')
              | From ₹2,499.00*
          
          div(class='relative w-full h-56 mt-4 flex items-center justify-center')
            img(
              class='max-h-full max-w-full object-contain filter drop-shadow-xl transition-transform duration-500 group-hover:scale-105',
              src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
              alt='Ultra Active Smartwatch'
            )

        // Hero Card 3: Dark Luxury Protective Case Card
        router-link(
          class='apple-card-dark shrink-0 w-[300px] sm:w-[380px] md:w-[420px] h-[480px] sm:h-[500px] p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer',
          to='/shop?category=cases'
        )
          div(class='space-y-2 relative z-10')
            span(class='apple-badge text-[#ff8d36]') MAGSAFE COMPATIBLE
            h3(class='text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight')
              | TechWoven Cases
            p(class='text-xs sm:text-sm text-[#a1a1a6] max-w-xs leading-relaxed')
              | Precision micro-twill weave with reinforced shock absorption.
            p(class='text-xs font-medium text-[#86868b] pt-1')
              | From ₹699.00*
          
          div(class='relative w-full h-56 mt-4 flex items-center justify-center')
            img(
              class='max-h-full max-w-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105',
              src='https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80',
              alt='TechWoven Protective Case'
            )

        // Hero Card 4: Light Fast Charging & Desk Ecosystem Card
        router-link(
          class='apple-card shrink-0 w-[300px] sm:w-[380px] md:w-[420px] h-[480px] sm:h-[500px] p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer bg-white',
          to='/shop?category=chargers'
        )
          div(class='space-y-2 relative z-10')
            span(class='apple-badge') ESSENTIALS
            h3(class='text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] leading-tight')
              | GaN Fast Power Adapters
            p(class='text-xs sm:text-sm text-[#6e6e73] max-w-xs leading-relaxed')
              | 65W dual USB-C intelligent power delivery in a pocket-sized footprint.
            p(class='text-xs font-medium text-[#6e6e73] pt-1')
              | From ₹999.00*
          
          div(class='relative w-full h-56 mt-4 flex items-center justify-center')
            img(
              class='max-h-full max-w-full object-contain filter drop-shadow-xl transition-transform duration-500 group-hover:scale-105',
              src='https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
              alt='Fast Power Adapters'
            )

  // 4. Apple Store "Accessories & Essentials" Grid (From Screenshot 3)
  section(class='py-12 sm:py-16 bg-[#f5f5f7]')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
      div(class='apple-section-header flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8')
        div
          h2(class='apple-section-title')
            span(class='heading-primary') Essentials. 
            span(class='heading-secondary') Crafted to pair perfectly with your favourite devices.
        router-link(class='apple-link text-sm hidden sm:inline-flex', to='/shop')
          span Explore all products
          span(class='text-2xs') ›

      // Product Grid
      div(
        v-if='featuredProducts.length > 0',
        class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6'
      )
        ProductCard(
          v-for='product in featuredProducts',
          :key='product.id',
          :product='product'
        )
      
      div(v-else-if='isLoading', class='grid grid-cols-2 gap-5 sm:grid-cols-4')
        div(v-for='n in 4', :key='n', class='apple-card h-80 animate-pulse bg-white/60')
      
      div(v-else, class='text-center py-16 apple-card p-8')
        p(class='text-sm text-[#6e6e73]') Products are currently syncing. Please check back in a moment.

  // 5. Apple Store Style Promotional Banner Card
  section(class='py-6 sm:py-8 bg-[#f5f5f7]')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
      div(class='apple-card bg-gradient-to-r from-[#1d1d1f] to-[#2c2c2e] text-white p-8 sm:p-12 rounded-[28px] shadow-lg flex flex-col md:flex-row items-center justify-between gap-8')
        div(class='space-y-3 text-center md:text-left')
          div(class='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#ff8d36]')
            span Special Welcome Invitation
          h3(class='text-2xl sm:text-3xl font-bold tracking-tight text-white')
            | Enjoy 10% instant savings on your first purchase.
          p(class='text-sm text-[#a1a1a6] max-w-xl')
            | Enter code 
            span(class='font-mono font-bold text-white bg-white/15 px-2 py-0.5 rounded-md border border-white/20 select-all') WELCOME10
            |  at checkout. Complimentary express shipping included on all eligible orders.
        
        div(class='shrink-0')
          router-link(
            class='apple-btn-primary px-8 py-3.5 text-sm font-semibold shadow-md',
            to='/shop'
          )
            span Shop the Collection
            span ›

  // 6. Apple Store Difference Section (From Screenshot 3)
  WhyShopWithUs

  // 7. Value & Trust Guarantee Bar
  TrustBadges
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StoreLayout from '@/components/StoreLayout.vue';
import HeroBanner from '@/components/HeroBanner.vue';
import CategoryGrid from '@/components/CategoryGrid.vue';
import ProductCard from '@/components/ProductCard.vue';
import WhyShopWithUs from '@/components/WhyShopWithUs.vue';
import TrustBadges from '@/components/TrustBadges.vue';
import { api } from '@/helpers';

const categories = ref([]);
const featuredProducts = ref([]);
const isLoading = ref(true);
const heroCardsContainer = ref(null);

function scrollHeroLeft() {
  if (heroCardsContainer.value) {
    heroCardsContainer.value.scrollBy({ left: -420, behavior: 'smooth' });
  }
}

function scrollHeroRight() {
  if (heroCardsContainer.value) {
    heroCardsContainer.value.scrollBy({ left: 420, behavior: 'smooth' });
  }
}

onMounted(async () => {
  try {
    const [categoriesRes, productsRes] = await Promise.all([
      api.get('/categories'),
      api.get('/products?isFeatured=true&pageSize=8'),
    ]);

    if (categoriesRes.success && categoriesRes.data) {
      categories.value = categoriesRes.data.categories || [];
    }

    if (productsRes.success && productsRes.data) {
      featuredProducts.value = productsRes.data.products || productsRes.data.items || [];
    }
  } catch {
    // Graceful fallback to default curated state
  } finally {
    isLoading.value = false;
  }
});
</script>
