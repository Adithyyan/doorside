<template lang="pug">
div(id='app-root', class='min-h-screen flex flex-col')
  router-view
  Toast
</template>

<script setup>
import { onMounted } from 'vue';
import { mainStore } from '@/store';
import Toast from '@/components/Toast.vue';


onMounted(async () => {
  await mainStore().getSettings();
  if (mainStore().items.length > 0) {
    mainStore().calculateServerTotals();
  }
});
</script>
