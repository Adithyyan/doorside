<template lang="pug">
header(class='sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[rgba(0,0,0,0.08)] transition-all')
  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
    div(class='flex items-center justify-between h-13 gap-4')
      // Left: Logo & Mobile Toggle
      div(class='flex items-center gap-3')
        button(
          class='p-1.5 text-[#1d1d1f] rounded-lg md:hidden hover:bg-black/5 transition-colors',
          @click='mobileMenuOpen = !mobileMenuOpen',
          aria-label='Toggle navigation menu'
        )
          IconMenu(class='w-5 h-5')
        
        router-link(class='flex items-center gap-2 text-lg font-bold tracking-tight text-[#1d1d1f]', to='/')
          img(
            v-if='mainStore().settings.branding?.logo_url',
            class='h-7 w-auto object-contain',
            :src='mainStore().settings.branding.logo_url',
            :alt='mainStore().brandName'
          )
          span(v-else, class='font-bold tracking-tight text-[#1d1d1f]') {{ mainStore().brandName }}

      // Center: Desktop Apple-style Navigation Links
      nav(class='hidden items-center gap-7 text-[12px] font-normal text-[#1d1d1f]/80 md:flex')
        router-link(class='transition-opacity hover:text-[#1d1d1f] hover:opacity-100', to='/') Store
        router-link(class='transition-opacity hover:text-[#1d1d1f] hover:opacity-100', to='/shop') All Products
        router-link(class='transition-opacity hover:text-[#1d1d1f] hover:opacity-100', to='/shop?category=audio') Audio
        router-link(class='transition-opacity hover:text-[#1d1d1f] hover:opacity-100', to='/shop?category=wearables') Wearables
        router-link(class='transition-opacity hover:text-[#1d1d1f] hover:opacity-100', to='/shop?category=accessories') Accessories
        router-link(class='transition-opacity hover:text-[#1d1d1f] hover:opacity-100', to='/track-order') Track Order
        router-link(class='transition-opacity hover:text-[#1d1d1f] hover:opacity-100', to='/about') Support

      // Right: Search, Account, Bag
      div(class='flex items-center gap-3')
        // Desktop Search Bar
        div(class='hidden items-center relative lg:flex w-48 xl:w-56')
          input(
            class='w-full pl-8 pr-3 text-xs bg-[#f5f5f7] border border-transparent rounded-full transition-all py-1.5 text-[#1d1d1f] placeholder:text-[#86868b] focus:bg-white focus:border-[#d2d2d7] focus:outline-hidden',
            type='text',
            placeholder='Search store...',
            v-model='searchQuery',
            @keyup.enter='handleSearch'
          )
          IconSearch(class='w-3.5 h-3.5 absolute left-2.5 text-[#86868b]')

        // Account Link
        div(v-if='mainStore().isCustomerLoggedIn', class='hidden sm:flex')
          router-link(
            class='flex items-center gap-1.5 text-xs text-[#1d1d1f] hover:text-[#0071e3] transition-colors',
            to='/account/orders'
          )
            IconUser(class='w-4 h-4')
            span(class='truncate max-w-24') {{ mainStore().customer.name?.split(' ')[0] || 'Account' }}
        div(v-else, class='hidden sm:flex')
          router-link(
            class='text-xs text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-opacity px-2 py-1',
            to='/login'
          ) Sign In

        // Apple Bag / Cart
        button(
          class='relative p-2 text-[#1d1d1f] rounded-full transition-all hover:bg-black/5 active:scale-95',
          @click='mainStore().openDrawer()',
          aria-label='View shopping bag'
        )
          IconCart(class='w-5 h-5')
          span(
            v-if='mainStore().totalItemsCount > 0',
            class='absolute bg-[#0071e3] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center -top-0.5 -right-0.5 shadow-xs'
          ) {{ mainStore().totalItemsCount }}

  // Mobile Menu Dropdown
  div(
    v-if='mobileMenuOpen',
    class='border-t border-[#e5e5ea] bg-white px-5 py-4 space-y-3 md:hidden shadow-lg'
  )
    div(class='relative mb-2')
      input(
        class='w-full pl-8 pr-3 py-2 text-xs bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-[#1d1d1f] focus:outline-hidden',
        type='text',
        placeholder='Search products, accessories...',
        v-model='searchQuery',
        @keyup.enter='handleSearch'
      )
      IconSearch(class='w-3.5 h-3.5 absolute left-3 top-2.5 text-[#86868b]')
    
    div(class='divide-y divide-[#f5f5f7] text-sm')
      router-link(class='block py-2.5 text-[#1d1d1f] font-medium', @click='mobileMenuOpen = false', to='/') Store
      router-link(class='block py-2.5 text-[#1d1d1f]', @click='mobileMenuOpen = false', to='/shop') All Products
      router-link(class='block py-2.5 text-[#1d1d1f]', @click='mobileMenuOpen = false', to='/track-order') Track Order
      router-link(class='block py-2.5 text-[#1d1d1f]', @click='mobileMenuOpen = false', to='/about') About Us
      router-link(class='block py-2.5 text-[#1d1d1f]', @click='mobileMenuOpen = false', to='/contact') Support
    
    div(class='border-t border-[#e5e5ea] pt-3')
      div(v-if='mainStore().isCustomerLoggedIn', class='space-y-1')
        router-link(class='block py-2 text-xs text-[#1d1d1f]', @click='mobileMenuOpen = false', to='/account/orders') My Orders
        router-link(class='block py-2 text-xs text-[#1d1d1f]', @click='mobileMenuOpen = false', to='/account/profile') Profile Settings
        button(class='block w-full text-left py-2 text-xs font-medium text-[#bf4800]', @click='handleLogout') Sign Out
      div(v-else, class='flex items-center gap-3 pt-1')
        router-link(class='apple-btn-secondary text-xs flex-1 text-center py-2', @click='mobileMenuOpen = false', to='/login') Sign In
        router-link(class='apple-btn-primary text-xs flex-1 text-center py-2', @click='mobileMenuOpen = false', to='/register') Register
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
