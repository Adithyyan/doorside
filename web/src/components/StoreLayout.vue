<template lang="pug">
div(class='store-layout min-h-screen flex flex-col bg-page')
  AnnouncementBar
  AppNavbar
  main(class='flex-1')
    slot
  CartDrawer
  AppFooter
</template>

<script setup>
import AnnouncementBar from '@/components/AnnouncementBar.vue';
import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from '@/components/AppFooter.vue';
import CartDrawer from '@/components/CartDrawer.vue';
</script>
