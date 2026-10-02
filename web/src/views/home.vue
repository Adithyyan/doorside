<template lang="pug">
StoreLayout
  HeroBanner
  TrustBadges
  CategoryGrid(:categories='categories')

  section(class='py-12 bg-slate-50')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
      div(class='flex items-end justify-between mb-8')
        div
          p(class='section-label') Best Sellers
          h2(class='text-2xl sm:text-3xl font-black text-slate-900 tracking-tight') Trending Right Now
        router-link(class='hidden sm:flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors', to='/shop')
          span View All
          span →

      div(v-if='featuredProducts.length > 0', class='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5')
        ProductCard(v-for='product in featuredProducts.slice(0, 8)', :key='product.id', :product='product')

      div(v-else-if='isLoading', class='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5')
        div(v-for='n in 8', :key='n', class='bg-white rounded-2xl overflow-hidden border border-slate-100')
          div(class='aspect-square bg-slate-100 animate-pulse')
          div(class='p-4 space-y-2')
            div(class='h-3 bg-slate-100 rounded animate-pulse w-1/3')
            div(class='h-4 bg-slate-100 rounded animate-pulse')
            div(class='h-6 bg-slate-100 rounded animate-pulse w-1/2 mt-3')

      div(v-else, class='text-center py-16 bg-white rounded-2xl border border-slate-100')
        p(class='text-2xl mb-2') 🛍️
        p(class='text-sm text-slate-500') Products are syncing. Check back in a moment.

      div(class='mt-8 text-center sm:hidden')
        router-link(class='inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors', to='/shop')
          span Explore All Products
          span →

  section(class='py-8 bg-white')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
      div(class='relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 sm:p-12 overflow-hidden')
        div(class='absolute top-0 right-0 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none')

        div(class='relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8')
          div(class='text-center sm:text-left space-y-3')
            div(class='inline-flex items-center gap-2 px-3 py-1 bg-teal-600/20 border border-teal-500/30 rounded-full text-xs font-bold text-teal-300 uppercase tracking-wide')
              span Welcome Offer
            h3(class='text-2xl sm:text-3xl font-black text-white') Get 10% Off Your First Order
            p(class='text-slate-400 text-sm max-w-md')
              | Use code&nbsp;
              span(class='font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/20 select-all') WELCOME10
              | &nbsp;at checkout.

          div(class='shrink-0')
            router-link(
              class='inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-700/30 text-sm',
              to='/shop'
            )
              span Shop Now
              span →

  section(class='py-12 bg-slate-50')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
      div(class='flex items-end justify-between mb-8')
        div
          p(class='section-label') Just Landed
          h2(class='text-2xl sm:text-3xl font-black text-slate-900 tracking-tight') New Arrivals
        router-link(class='hidden sm:flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors', to='/shop')
          span See All
          span →

      div(v-if='featuredProducts.length > 0', class='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5')
        ProductCard(v-for='product in featuredProducts.slice(0, 4)', :key='`n-${product.id}`', :product='product')

  WhyShopWithUs

  section(class='py-14 bg-teal-700')
    div(class='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center')
      h2(class='text-2xl sm:text-3xl font-black text-white mb-3') Stay in the Loop
      p(class='text-teal-100 text-sm mb-6') Get exclusive deals, new arrivals, and coupon codes straight to your inbox.
      div(class='flex flex-col sm:flex-row gap-3 max-w-md mx-auto')
        input(
          class='flex-1 px-4 py-3 text-sm bg-white/15 border border-white/25 text-white placeholder:text-white/55 rounded-lg focus:outline-none focus:border-white focus:bg-white/20 transition-all',
          type='email',
          placeholder='Enter your email address'
        )
        button(class='px-6 py-3 bg-white text-teal-700 text-sm font-bold rounded-lg hover:bg-teal-50 transition-colors shrink-0') Subscribe
      p(class='text-teal-200/70 text-xs mt-3') No spam, ever. Unsubscribe anytime.
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

onMounted(async () => {
  try {
    const [catRes, prodRes] = await Promise.all([
      api.get('/categories'),
      api.get('/products?isFeatured=true&pageSize=8'),
    ]);
    if (catRes.success && catRes.data) {
      categories.value = catRes.data.categories || [];
    }
    if (prodRes.success && prodRes.data) {
      featuredProducts.value = prodRes.data.products || prodRes.data.items || [];
    }
  } catch {
  } finally {
    isLoading.value = false;
  }
});
</script>
