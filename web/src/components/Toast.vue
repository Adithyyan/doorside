<template lang="pug">
div(v-if='mainStore().toastMsg?.msg', class='fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none')
  div(
    class='pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium transition-all'
    :class='getToastClass(mainStore().toastMsg.type)'
  )
    span {{ mainStore().toastMsg.msg }}
    button(class='ml-auto text-xs opacity-60 p-1 hover:opacity-100', @click='mainStore().removeToastMsg()') ✕
</template>

<script setup>
import { mainStore } from '@/store';


function getToastClass(type) {
  if (type === 'success') {
    return 'bg-emerald-900 text-white border-emerald-700';
  }
  if (type === 'error') {
    return 'bg-rose-900 text-white border-rose-700';
  }
  return 'bg-slate-900 text-white border-slate-700';
}
</script>
