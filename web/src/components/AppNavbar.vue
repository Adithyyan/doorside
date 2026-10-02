<template lang="pug">
header(class='sticky top-0 z-40 transition-all')
  div(class='bg-white border-b border-slate-200')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
      div(class='flex items-center justify-between h-16 gap-4')
        div(class='flex items-center gap-3')
          button(
            class='p-2 text-slate-500 rounded-lg md:hidden hover:bg-slate-100 transition-colors',
            @click='mobileMenuOpen = !mobileMenuOpen',
            aria-label='Toggle navigation'
          )
            IconMenu(class='w-5 h-5')

          router-link(class='flex items-center gap-2 shrink-0', to='/')
            img(
              v-if='mainStore().settings.branding?.logo_url',
              class='h-8 w-auto object-contain',
              :src='mainStore().settings.branding.logo_url',
              :alt='mainStore().brandName'
            )
            span(v-else, class='text-xl font-black tracking-tight text-slate-900') {{ mainStore().brandName }}

        div(class='hidden md:flex flex-1 max-w-xl mx-6 relative')
          input(
            class='w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/15 transition-all',
            type='text',
            placeholder='Search for products...',
            v-model='searchQuery',
            @keyup.enter='handleSearch'
          )
          IconSearch(class='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400')

        div(class='flex items-center gap-1')
          router-link(
            class='hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-teal-700 transition-colors rounded-lg hover:bg-teal-50',
            to='/track-order'
          )
            span 📦
            span Track

          div(v-if='mainStore().isCustomerLoggedIn')
            router-link(
              class='hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-teal-700 transition-colors rounded-lg hover:bg-teal-50',
              to='/account/orders'
            )
              IconUser(class='w-4 h-4')
              span(class='truncate max-w-[80px]') {{ mainStore().customer.name?.split(' ')[0] || 'Account' }}
          div(v-else)
            router-link(
              class='hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-teal-700 transition-colors rounded-lg hover:bg-teal-50',
              to='/login'
            )
              IconUser(class='w-4 h-4')
              span Sign In

          button(
            class='relative flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all active:scale-95 ml-1',
            @click='mainStore().openDrawer()',
            aria-label='View cart'
          )
            IconCart(class='w-4 h-4')
            span(class='hidden sm:inline text-xs font-semibold') Cart
            span(
              v-if='mainStore().totalItemsCount > 0',
              class='absolute -top-1.5 -right-1.5 bg-teal-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center'
            ) {{ mainStore().totalItemsCount }}

  div(class='hidden md:block bg-slate-800')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
      nav(class='flex items-center h-10 text-xs font-medium overflow-x-auto no-scrollbar')
        router-link(class='whitespace-nowrap px-4 h-full flex items-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors', to='/shop') All Products
        router-link(class='whitespace-nowrap px-4 h-full flex items-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors', to='/shop?category=audio') Audio
        router-link(class='whitespace-nowrap px-4 h-full flex items-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors', to='/shop?category=wearables') Wearables
        router-link(class='whitespace-nowrap px-4 h-full flex items-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors', to='/shop?category=accessories') Accessories
        router-link(class='whitespace-nowrap px-4 h-full flex items-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors', to='/shop?category=chargers') Chargers
        router-link(class='whitespace-nowrap px-4 h-full flex items-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors', to='/shop?category=gadgets') Smart Gadgets
        router-link(class='whitespace-nowrap px-4 h-full flex items-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors', to='/track-order') Track Order
        div(class='flex-1')
        router-link(class='whitespace-nowrap px-4 h-full flex items-center text-teal-400 font-semibold hover:text-teal-300 transition-colors', to='/shop') Sale

  div(v-if='mobileMenuOpen', class='bg-white border-t border-slate-100 shadow-lg md:hidden')
    div(class='p-4 border-b border-slate-100')
      div(class='relative')
        input(
          class='w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none',
          type='text',
          placeholder='Search products...',
          v-model='searchQuery',
          @keyup.enter='handleSearch'
        )
        IconSearch(class='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400')

    div(class='py-2 divide-y divide-slate-50')
      router-link(class='flex items-center gap-3 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-teal-50 hover:text-teal-700', @click='mobileMenuOpen = false', to='/shop')
        span 🛍️
        span All Products
      router-link(class='flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50', @click='mobileMenuOpen = false', to='/shop?category=audio')
        span 🎧
        span Audio & Sound
      router-link(class='flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50', @click='mobileMenuOpen = false', to='/shop?category=wearables')
        span ⌚
        span Smart Wearables
      router-link(class='flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50', @click='mobileMenuOpen = false', to='/shop?category=accessories')
        span 📱
        span Accessories
      router-link(class='flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50', @click='mobileMenuOpen = false', to='/track-order')
        span 📦
        span Track Order
      router-link(class='flex items-center gap-3 px-5 py-3 text-sm font-semibold text-teal-700 hover:bg-teal-50', @click='mobileMenuOpen = false', to='/shop')
        span Sale & Offers

    div(class='border-t border-slate-100 p-4')
      div(v-if='mainStore().isCustomerLoggedIn', class='space-y-1')
        router-link(class='block py-2 text-sm text-slate-700', @click='mobileMenuOpen = false', to='/account/orders') My Orders
        router-link(class='block py-2 text-sm text-slate-700', @click='mobileMenuOpen = false', to='/account/profile') Profile
        button(class='block py-2 text-sm font-medium text-red-600 w-full text-left', @click='handleLogout') Sign Out
      div(v-else, class='flex gap-3')
        router-link(class='flex-1 text-center py-2.5 text-sm font-semibold border border-slate-200 rounded-lg text-slate-700 hover:border-teal-600 hover:text-teal-700 transition-colors', @click='mobileMenuOpen = false', to='/login') Sign In
        router-link(class='flex-1 text-center py-2.5 text-sm font-bold bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors', @click='mobileMenuOpen = false', to='/register') Register
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { mainStore } from '@/store';
import IconMenu from '@/components/icons/menu.vue';
import IconSearch from '@/components/icons/search.vue';
import IconUser from '@/components/icons/user.vue';
import IconCart from '@/components/icons/cart.vue';

const router = useRouter();
const searchQuery = ref('');
const mobileMenuOpen = ref(false);

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'shop', query: { search: searchQuery.value.trim() } });
    mobileMenuOpen.value = false;
  }
}

async function handleLogout() {
  await mainStore().logout();
  mobileMenuOpen.value = false;
  router.push('/');
}
</script>
