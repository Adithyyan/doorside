<template lang="pug">
div(id='app-root', class='min-h-screen flex flex-col')
  router-view
  Toast
</template>

<script setup>
import { onMounted } from 'vue';
import { main } from '@/store';
import Toast from '@/components/Toast.vue';


onMounted(async () => {
  await main().getSettings();
  if (main().items.length > 0) {
    main().calculateServerTotals();
  }
});
</script>
