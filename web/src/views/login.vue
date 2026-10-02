<template lang="pug">
StoreLayout
  div(class='bg-[#f5f5f7] min-h-[80vh] flex items-center justify-center py-14 px-4')
    div(class='apple-card max-w-md w-full bg-white p-8 sm:p-10 rounded-[28px] space-y-6 shadow-md')
      div(class='text-center space-y-2')
        div(class='w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-xl mx-auto') 👤
        h1(class='text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]') Sign in to Store
        p(class='text-xs text-[#6e6e73] max-w-xs mx-auto')
          | Manage your orders, saved delivery addresses, and personal preferences.

      form(class='space-y-4 pt-2', @submit.prevent='handleLogin')
        div(class='space-y-1')
          label(class='block text-xs font-semibold text-[#1d1d1f]') Email Address *
          input(
            class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
            type='email',
            placeholder='name@example.com',
            v-model='email',
            required
          )

        div(class='space-y-1')
          label(class='block text-xs font-semibold text-[#1d1d1f]') Password *
          input(
            class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
            type='password',
            placeholder='Enter your password',
            v-model='password',
            required
          )

        button(
          class='w-full apple-btn-primary py-3.5 text-sm font-semibold shadow-md disabled:opacity-50 mt-2',
          type='submit',
          :disabled='isLoading'
        )
          span(v-if='isLoading') Signing In...
          span(v-else) Sign In →

      div(class='text-center pt-4 border-t border-[#e5e5ea] space-y-3')
        p(class='text-xs text-[#6e6e73]')
          | Don't have an account yet? 
          router-link(class='font-semibold text-[#0071e3] hover:underline', to='/register') Create Account
        
        div(class='bg-[#f5f5f7] p-3 rounded-xl text-[11px] text-[#6e6e73]')
          | Placed an order without an account? 
          router-link(class='font-semibold text-[#1d1d1f] underline', to='/track-order') Track Your Order
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
  if (!email.value || !password.value) return;
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
