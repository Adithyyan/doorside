<template lang="pug">
StoreLayout
  div(class='bg-page min-h-[85vh] flex items-center justify-center py-14 px-4')
    div(class='panel-editorial max-w-md w-full p-8 sm:p-10 space-y-6')
      div(class='text-center space-y-2')
        div(class='w-12 h-12 bg-surface border border-soft flex items-center justify-center text-xl mx-auto') ✨
        h1(class='heading-md text-ink') Create Your Account
        p(class='text-cap text-muted max-w-xs mx-auto')
          | Enjoy expedited checkout, package tracking notifications, and saved preferences.

      form(class='space-y-4 pt-2', @submit.prevent='handleRegister')
        div(class='space-y-1')
          label(class='label-ink block') Full Name *
          input(class='input-base', type='text', placeholder='Your full name', v-model='form.name', required)

        div(class='space-y-1')
          label(class='label-ink block') Mobile Phone *
          input(class='input-base', type='tel', placeholder='10-digit mobile number', maxlength='10', v-model='form.phone', required)

        div(class='space-y-1')
          label(class='label-ink block') Email Address *
          input(class='input-base', type='email', placeholder='name@example.com', v-model='form.email', required)

        div(class='space-y-1')
          label(class='label-ink block') Password * (8+ characters)
          input(class='input-base', type='password', placeholder='Create a secure password', minlength='8', v-model='form.password', required)

        button(class='btn-primary w-full py-4 text-center justify-center disabled:opacity-50 mt-2', type='submit', :disabled='isLoading')
          span(v-if='isLoading') Creating Account...
          span(v-else) Create Account →

      div(class='text-center pt-4 border-t border-soft')
        p(class='text-cap text-muted')
          | Already have an account? 
          router-link(class='label-ink ml-1 underline hover:opacity-70', to='/login') Sign In
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import StoreLayout from '@/components/StoreLayout.vue';
import { mainStore } from '@/store';

const router = useRouter();

const form = ref({
  name: '',
  phone: '',
  email: '',
  password: '',
});

const isLoading = ref(false);

async function handleRegister() {
  if (form.value.phone.replace(/[^0-9]/g, '').length !== 10) {
    mainStore().error('Please enter a valid 10-digit Indian mobile number.');
    return;
  }

  isLoading.value = true;
  try {
    await mainStore().register({
      name: form.value.name.trim(),
      phone: form.value.phone.trim(),
      email: form.value.email.trim(),
      password: form.value.password,
    });
    mainStore().success('Account created successfully!');
    router.push('/account/orders');
  } catch (error) {
    mainStore().error(error.message || 'Registration failed');
  } finally {
    isLoading.value = false;
  }
}
</script>
