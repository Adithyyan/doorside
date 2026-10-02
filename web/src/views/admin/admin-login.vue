<template lang="pug">
div(class='min-h-screen bg-slate-900 flex items-center justify-center p-4')
  div(class='max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl')
    div(class='text-center mb-8')
      div(class='inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 text-2xl font-black mb-4 shadow-lg')
        | ⚡
      h1(class='text-2xl font-black text-white tracking-tight') Admin Portal
      p(class='text-xs text-slate-400 mt-1') Store operations, catalog, and manual fulfillment

    div(
      v-if='errorMessage',
      class='rounded-xl bg-rose-500 bg-opacity-10 border border-rose-500 border-opacity-20 text-rose-400 text-xs mb-6 p-3.5'
    )
      | {{ errorMessage }}

    // Quick Demo Credentials Card
    div(class='mb-6 p-3.5 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-between gap-3')
      div
        p(class='text-xs font-bold text-amber-400') Demo Admin Credentials
        p(class='text-[11px] text-slate-400 font-mono mt-0.5') admin@{{ ($brandName || 'doorside').toLowerCase() }}.test &bull; AdminPass@123!
      button(
        type='button',
        class='px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-[11px] hover:bg-amber-300 transition-colors shrink-0 shadow-sm',
        @click='fillDemo'
      ) Auto Fill

    form(class='space-y-4', @submit.prevent='handleLogin')
      div
        label(class='block text-xs font-bold text-slate-300 mb-1.5') Admin Email Address
        input(
          class='w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400',
          type='email',
          v-model='email',
          :placeholder='`admin@${($brandName || "doorside").toLowerCase()}.test or admin@example.com`',
          required,
          autofocus
        )

      div
        label(class='block text-xs font-bold text-slate-300 mb-1.5') Password
        input(
          class='w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400',
          type='password',
          v-model='password',
          placeholder='••••••••••••',
          required
        )

      button(
        class='w-full py-3 rounded-xl bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors mt-2 shadow-md hover:bg-amber-300',
        type='submit',
        :disabled='isLoading'
      )
        span(v-if='!isLoading') Sign In to Dashboard →
        span(v-else) Authenticating...

    div(class='mt-8 pt-6 border-t border-slate-700 text-center')
      router-link(class='text-xs text-slate-400 transition-colors hover:text-amber-400', to='/')
        | ← Return to Storefront
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { mainStore } from '@/store';

const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

function fillDemo() {
  const brand = (import.meta.env.VITE_BRAND_NAME || 'doorside').toLowerCase();
  email.value = `admin@${brand}.test`;
  password.value = 'AdminPass@123!';
  errorMessage.value = '';
}

async function handleLogin() {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    await mainStore().adminLogin(email.value, password.value);
    const redirect = route.query.redirect || '/admin/dashboard';
    router.push(redirect);
  } catch (err) {
    errorMessage.value = err.message || 'Invalid admin credentials';
  } finally {
    isLoading.value = false;
  }
}
</script>
