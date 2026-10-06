<template lang="pug">
div(v-if='mainStore().toastMsg?.msg', class='fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none')
  div(class='pointer-events-auto flex items-center gap-4 px-5 py-3.5 bg-ink text-white border border-soft shadow-2xl transition-all')
    span(class='text-fine uppercase tracking-editorial font-bold') {{ mainStore().toastMsg.msg }}
    button(class='ml-auto text-xs text-white/60 hover:text-white p-1 cursor-pointer transition-colors', @click='mainStore().removeToastMsg()') ✕
</template>

<script setup>
import { mainStore } from '@/store';
</script>
