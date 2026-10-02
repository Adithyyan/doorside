<template lang="pug">
StoreLayout
  div(class='bg-slate-50 min-h-[85vh] flex items-center justify-center py-14 px-4')
    div(class='max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 space-y-6 shadow-xs')
      div(class='text-center space-y-2')
        div(class='w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-xl mx-auto') ✨
        h1(class='text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900') Create Your Account
        p(class='text-xs text-slate-500 max-w-xs mx-auto')
          | Enjoy expedited checkout, package tracking notifications, and saved preferences.

      form(class='space-y-4 pt-2', @submit.prevent='handleRegister')
        div(class='space-y-1')
          label(class='block text-xs font-semibold text-slate-700') Full Name *
          input(
            class='w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
            type='text',
            placeholder='Your full name',
            v-model='form.name',
            required
          )

        div(class='space-y-1')
          label(class='block text-xs font-semibold text-slate-700') Mobile Phone *
          input(
            class='w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
            type='tel',
            placeholder='10-digit mobile number',
            maxlength='10',
            v-model='form.phone',
            required
          )

        div(class='space-y-1')
          label(class='block text-xs font-semibold text-slate-700') Email Address *
          input(
            class='w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
            type='email',
            placeholder='name@example.com',
            v-model='form.email',
            required
          )

        div(class='space-y-1')
          label(class='block text-xs font-semibold text-slate-700') Password * (8+ characters)
          input(
            class='w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
            type='password',
            placeholder='Create a secure password',
            minlength='8',
            v-model='form.password',
            required
          )

        button(
          class='w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50 mt-2',
          type='submit',
          :disabled='isLoading'
        )
          span(v-if='isLoading') Creating Account...
          span(v-else) Create Account →

      div(class='text-center pt-4 border-t border-slate-100')
        p(class='text-xs text-slate-500')
          | Already have an account? 
          router-link(class='font-semibold text-teal-700 hover:underline', to='/login') Sign In
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
