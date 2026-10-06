<template lang="pug">
header(class='sticky top-0 z-40')

  div(class='hidden md:block border-b border-soft bg-page')
    div(class='max-w-7xl mx-auto px-6 lg:px-8')
      div(class='flex items-center justify-between h-8')
        div(class='flex items-center gap-4')
          a(href='#', class='label-muted hover:text-ink transition-colors') Instagram
          a(href='#', class='label-muted hover:text-ink transition-colors') Pinterest
          a(href='#', class='label-muted hover:text-ink transition-colors') YouTube

        div(class='flex items-center gap-5')
          div(v-if='mainStore().isCustomerLoggedIn')
            router-link(class='label-muted hover:text-ink transition-colors', to='/account/orders') {{ mainStore().customer.name?.split(' ')[0] || 'Account' }}
          div(v-else, class='flex items-center gap-4')
            router-link(class='label-muted hover:text-ink transition-colors', to='/login') Sign In
            router-link(class='label-muted hover:text-ink transition-colors', to='/register') Join Us
          router-link(class='label-muted hover:text-ink transition-colors', to='/track-order') Help

  div(class='bg-page border-b border-soft')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
      div(class='flex items-center justify-between h-14 gap-6')

        button(class='p-1.5 text-ink md:hidden', @click='mobileMenuOpen = !mobileMenuOpen', aria-label='Toggle navigation')
          IconMenu(class='w-5 h-5')

        router-link(class='shrink-0', to='/')
          img(v-if='mainStore().settings.branding?.logo_url', class='h-7 w-auto object-contain', :src='mainStore().settings.branding.logo_url', :alt='mainStore().brandName')
          span(v-else, class='brand-name') {{ mainStore().brandName }}

        nav(class='hidden md:flex items-center gap-1 flex-1 px-6')
          router-link(class='px-3 py-1 label-ink hover:opacity-60 transition-opacity', to='/') Home
          router-link(class='px-3 py-1 label-ink hover:opacity-60 transition-opacity', to='/shop') All Products
          router-link(class='px-3 py-1 label-ink hover:opacity-60 transition-opacity', to='/shop?category=audio') Audio
          router-link(class='px-3 py-1 label-ink hover:opacity-60 transition-opacity', to='/shop?category=wearables') Wearables
          router-link(class='px-3 py-1 label-ink hover:opacity-60 transition-opacity', to='/shop?category=gadgets') Gadgets
          router-link(class='px-3 py-1 label-ink hover:opacity-60 transition-opacity', to='/shop?sale=true') Deals

        div(class='flex items-center gap-2 shrink-0')
          button(class='p-1.5 text-ink hover:opacity-60 transition-opacity hidden md:flex', aria-label='Search', @click='searchOpen = !searchOpen')
            IconSearch(class='w-4 h-4')

          router-link(class='p-1.5 text-ink hover:opacity-60 transition-opacity hidden md:flex', to='/account/orders', aria-label='Account')
            IconUser(class='w-4 h-4')

          button(class='relative flex items-center gap-1.5 px-4 py-2 bg-ink text-white label-ink hover:opacity-80 transition-colors', @click='mainStore().openDrawer()', aria-label='View cart')
            IconCart(class='w-3.5 h-3.5')
            span(class='hidden sm:inline text-white text-fine font-bold uppercase tracking-editorial') Bag
            span(v-if='mainStore().totalItemsCount > 0', class='ml-0.5 text-white text-fine') ({{ mainStore().totalItemsCount }})

  div(v-if='searchOpen', class='bg-page-alt border-b border-soft')
    div(class='max-w-7xl mx-auto px-6 py-3 flex gap-3')
      input(class='input-base', type='text', placeholder='Search for products…', v-model='searchQuery', @keyup.enter='handleSearch', ref='searchInput')
      button(class='btn-primary px-5 py-2', @click='handleSearch') Search
      button(class='px-3 py-2 text-muted text-xs hover:text-ink', @click='searchOpen = false') ✕

  div(v-if='mobileMenuOpen', class='bg-page border-b border-soft md:hidden')
    div(class='p-4 border-b border-soft')
      div(class='flex gap-2')
        input(class='input-base', type='text', placeholder='Search products…', v-model='searchQuery', @keyup.enter='handleSearch')
        button(class='btn-primary px-4 py-2', @click='handleSearch') Go

    div(class='py-2')
      router-link(class='flex items-center px-5 py-3 label-ink border-b border-soft', @click='mobileMenuOpen = false', to='/') Home
      router-link(class='flex items-center px-5 py-3 label-ink border-b border-soft', @click='mobileMenuOpen = false', to='/shop') All Products
      router-link(class='flex items-center px-5 py-3 label-ink border-b border-soft', @click='mobileMenuOpen = false', to='/shop?category=audio') Audio
      router-link(class='flex items-center px-5 py-3 label-ink border-b border-soft', @click='mobileMenuOpen = false', to='/shop?category=wearables') Wearables
      router-link(class='flex items-center px-5 py-3 label-ink border-b border-soft', @click='mobileMenuOpen = false', to='/shop?category=gadgets') Gadgets
      router-link(class='flex items-center px-5 py-3 label-ink border-b border-soft', @click='mobileMenuOpen = false', to='/track-order') Track Order
      router-link(class='flex items-center px-5 py-3 label-ink', @click='mobileMenuOpen = false', to='/shop?sale=true') Deals

    div(class='p-4 border-t border-soft')
      div(v-if='mainStore().isCustomerLoggedIn', class='flex gap-3')
        router-link(class='flex-1 text-center py-2.5 btn-primary', @click='mobileMenuOpen = false', to='/account/orders') My Orders
        button(class='px-4 py-2.5 btn-outline', @click='handleLogout') Sign Out
      div(v-else, class='flex gap-2')
        router-link(class='flex-1 text-center py-2.5 btn-outline', @click='mobileMenuOpen = false', to='/login') Sign In
        router-link(class='flex-1 text-center py-2.5 btn-primary', @click='mobileMenuOpen = false', to='/register') Join Us
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { mainStore } from '@/store';
import IconCart from '@/components/icons/cart.vue';
import IconSearch from '@/components/icons/search.vue';
import IconUser from '@/components/icons/user.vue';
import IconMenu from '@/components/icons/menu.vue';

const router = useRouter();
const searchQuery = ref('');
const searchOpen = ref(false);
const mobileMenuOpen = ref(false);
const searchInput = ref(null);

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/shop', query: { search: searchQuery.value.trim() } });
    searchOpen.value = false;
    mobileMenuOpen.value = false;
    searchQuery.value = '';
  }
}

async function handleLogout() {
  await mainStore().logout();
  mobileMenuOpen.value = false;
  router.push('/');
}
</script>
