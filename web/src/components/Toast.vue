<template lang="pug">
transition(
  enter-active-class='transition duration-300 ease-out transform',
  enter-from-class='opacity-0 translate-y-4 sm:translate-y-0 sm:translate-x-4 scale-95',
  enter-to-class='opacity-100 translate-y-0 sm:translate-x-0 scale-100',
  leave-active-class='transition duration-200 ease-in transform',
  leave-from-class='opacity-100 translate-y-0 sm:translate-x-0 scale-100',
  leave-to-class='opacity-0 translate-y-2 scale-95'
)
  div(v-if='store.toastMsg?.msg', class='fixed bottom-5 right-5 left-5 sm:left-auto sm:max-w-md z-[9999] pointer-events-none flex flex-col items-end')
    div(
      class='pointer-events-auto w-full flex items-start gap-3 p-4 bg-ink text-white border shadow-2xl transition-all',
      :class='toastBorderClass'
    )
      div(class='shrink-0 mt-0.5')
        div(v-if='store.toastMsg.type === "error"', class='w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold') ✕
        div(v-else-if='store.toastMsg.type === "success"', class='w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold') ✓
        div(v-else, class='w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold') ℹ

      div(class='flex-1 min-w-0 pr-1')
        p(class='text-[10px] uppercase tracking-editorial font-bold', :class='toastTitleColor') {{ toastTitle }}
        p(class='text-xs sm:text-sm text-white/90 mt-0.5 leading-snug break-words') {{ store.toastMsg.msg }}

      button(
        type='button',
        class='shrink-0 text-white/50 hover:text-white p-1 cursor-pointer transition-colors leading-none',
        @click='store.removeToastMsg()',
        aria-label='Dismiss notification'
      ) ✕
</template>

<script setup>
import { computed } from 'vue';
import { main } from '@/store';

const store = main();

const toastBorderClass = computed(() => {
  if (store.toastMsg?.type === 'error') {
    return 'border-l-4 border-l-red-500 border-neutral-800';
  }
  if (store.toastMsg?.type === 'success') {
    return 'border-l-4 border-l-emerald-500 border-neutral-800';
  }
  return 'border-l-4 border-l-amber-500 border-neutral-800';
});

const toastTitleColor = computed(() => {
  if (store.toastMsg?.type === 'error') {
    return 'text-red-400';
  }
  if (store.toastMsg?.type === 'success') {
    return 'text-emerald-400';
  }
  return 'text-amber-400';
});

const toastTitle = computed(() => {
  if (store.toastMsg?.type === 'error') {
    return 'Error';
  }
  if (store.toastMsg?.type === 'success') {
    return 'Success';
  }
  return 'Notice';
});
</script>
