<template lang="pug">
StoreLayout
  div(class='bg-page min-h-[80vh] flex items-center justify-center py-14 px-4')
    div(class='panel-editorial max-w-md w-full p-8 sm:p-10 space-y-6')
      div(class='text-center space-y-2')
        div(class='w-12 h-12 bg-surface border border-soft flex items-center justify-center text-xl mx-auto') 👤
        h1(class='heading-md text-ink') Sign In to Store
        p(class='text-cap text-muted max-w-xs mx-auto')
          | Manage your orders, saved delivery addresses, and personal preferences.

      form(class='space-y-4 pt-2', @submit.prevent='handleLogin')
        div(class='space-y-1')
          label(class='label-ink block') Email Address *
          input(class='input-base', type='email', placeholder='name@example.com', v-model='email', required)

        div(class='space-y-1')
          label(class='label-ink block') Password *
          input(class='input-base', type='password', placeholder='Enter your password', v-model='password', required)

        button(class='btn-primary w-full py-4 text-center justify-center disabled:opacity-50 mt-2', type='submit', :disabled='isLoading')
          span(v-if='isLoading') Signing In...
          span(v-else) Sign In →

      div(class='text-center pt-4 border-t border-soft space-y-3')
        p(class='text-cap text-muted')
          | Don't have an account yet? 
          router-link(class='label-ink ml-1 underline hover:opacity-70', to='/register') Create Account
        
        div(class='bg-surface p-3 border border-soft text-fine text-soft uppercase tracking-editorial')
          | Placed an order without an account? 
          router-link(class='text-ink font-bold underline ml-1', to='/track-order') Track Your Order
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
