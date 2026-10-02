<template lang="pug">
StoreLayout
  div(class='bg-slate-50 min-h-[80vh] flex items-center justify-center py-14 px-4')
    div(class='max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 space-y-6 shadow-xs')
      div(class='text-center space-y-2')
        div(class='w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-xl mx-auto') 👤
        h1(class='text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900') Sign in to Store
        p(class='text-xs text-slate-500 max-w-xs mx-auto')
          | Manage your orders, saved delivery addresses, and personal preferences.

      form(class='space-y-4 pt-2', @submit.prevent='handleLogin')
        div(class='space-y-1')
          label(class='block text-xs font-semibold text-slate-700') Email Address *
          input(
            class='w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
            type='email',
            placeholder='name@example.com',
            v-model='email',
            required
          )

        div(class='space-y-1')
          label(class='block text-xs font-semibold text-slate-700') Password *
          input(
            class='w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
            type='password',
            placeholder='Enter your password',
            v-model='password',
            required
          )

        button(
          class='w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50 mt-2',
          type='submit',
          :disabled='isLoading'
        )
          span(v-if='isLoading') Signing In...
          span(v-else) Sign In →

      div(class='text-center pt-4 border-t border-slate-100 space-y-3')
        p(class='text-xs text-slate-500')
          | Don't have an account yet? 
          router-link(class='font-semibold text-teal-700 hover:underline', to='/register') Create Account
        
        div(class='bg-slate-50 p-3 rounded-xl text-[11px] text-slate-600 border border-slate-100')
          | Placed an order without an account? 
          router-link(class='font-semibold text-slate-900 underline', to='/track-order') Track Your Order
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import StoreLayout from '@/components/StoreLayout.vue';
import { mainStore } from '@/store';

const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const isLoading = ref(false);

async function handleLogin() {
  if (!email.value || !password.value) {
    return;
  }
  isLoading.value = true;
  try {
    await mainStore().login(email.value.trim(), password.value);
    mainStore().success('Logged in successfully!');
    const redirect = route.query.redirect || '/account/orders';
    router.push(redirect);
  } catch (error) {
    mainStore().error(error.message || 'Login failed. Please check your credentials.');
  } finally {
    isLoading.value = false;
  }
}
</script>
