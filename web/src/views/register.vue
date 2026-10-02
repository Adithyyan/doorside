<template lang="pug">
StoreLayout
  div(class='bg-[#f5f5f7] min-h-[85vh] flex items-center justify-center py-14 px-4')
    div(class='apple-card max-w-md w-full bg-white p-8 sm:p-10 rounded-[28px] space-y-6 shadow-md')
      div(class='text-center space-y-2')
        div(class='w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-xl mx-auto') ✨
        h1(class='text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]') Create Your Account
        p(class='text-xs text-[#6e6e73] max-w-xs mx-auto')
          | Enjoy expedited checkout, package tracking notifications, and saved preferences.

      form(class='space-y-4 pt-2', @submit.prevent='handleRegister')
        div(class='space-y-1')
          label(class='block text-xs font-semibold text-[#1d1d1f]') Full Name *
          input(
            class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
            type='text',
            placeholder='Your full name',
            v-model='form.name',
            required
          )

        div(class='space-y-1')
          label(class='block text-xs font-semibold text-[#1d1d1f]') Mobile Phone *
          input(
            class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
            type='tel',
            placeholder='10-digit mobile number',
            maxlength='10',
            v-model='form.phone',
            required
          )

        div(class='space-y-1')
          label(class='block text-xs font-semibold text-[#1d1d1f]') Email Address *
          input(
            class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
            type='email',
            placeholder='name@example.com',
            v-model='form.email',
            required
          )

        div(class='space-y-1')
          label(class='block text-xs font-semibold text-[#1d1d1f]') Password * (8+ characters)
          input(
            class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
            type='password',
            placeholder='Create a secure password',
            minlength='8',
            v-model='form.password',
            required
          )

        button(
          class='w-full apple-btn-primary py-3.5 text-sm font-semibold shadow-md disabled:opacity-50 mt-2',
          type='submit',
          :disabled='isLoading'
        )
          span(v-if='isLoading') Creating Account...
          span(v-else) Create Account →

      div(class='text-center pt-4 border-t border-[#e5e5ea]')
        p(class='text-xs text-[#6e6e73]')
          | Already have an account? 
          router-link(class='font-semibold text-[#0071e3] hover:underline', to='/login') Sign In
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
