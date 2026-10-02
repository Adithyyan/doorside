<template lang="pug">
StoreLayout
  div(class='bg-slate-50 min-h-screen py-10 sm:py-14')
    div(class='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6')
        div
          h1(class='text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900') Profile & Addresses
          p(class='text-xs text-slate-500 mt-1')
            | Manage your personal details and saved delivery destinations.
        
        div(class='flex items-center gap-2.5')
          router-link(class='px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors', to='/account/orders')
            | View Orders
          button(class='px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors', @click='handleLogout')
            | Sign Out

      div(class='flex gap-6 border-b border-slate-200 text-sm font-semibold')
        router-link(class='pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800', to='/account/orders') Order History
        router-link(class='pb-3 border-b-2 border-teal-600 text-teal-700', to='/account/profile') Addresses & Details

      div(class='grid grid-cols-1 gap-8 lg:grid-cols-3 items-start')
        div(class='lg:col-span-1')
          div(class='p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5')
            h2(class='text-base font-bold text-slate-900') Personal Details
            form(class='space-y-4', @submit.prevent='updateProfile')
              div(class='space-y-1')
                label(class='block text-xs font-semibold text-slate-700') Full Name
                input(
                  class='w-full py-2.5 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
                  type='text',
                  v-model='profileForm.name',
                  required
                )
              div(class='space-y-1')
                label(class='block text-xs font-semibold text-slate-700') Email Address
                input(
                  class='w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-400 bg-slate-100 cursor-not-allowed',
                  type='email',
                  :value='mainStore().customer?.email',
                  disabled
                )
                span(class='text-[10px] text-slate-400') Registered email reference.
              div(class='space-y-1')
                label(class='block text-xs font-semibold text-slate-700') Mobile Phone
                input(
                  class='w-full py-2.5 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
                  type='tel',
                  v-model='profileForm.phone',
                  placeholder='10-digit mobile'
                )
              button(
                class='w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-98 mt-2',
                type='submit',
                :disabled='isUpdatingProfile'
              )
                span(v-if='!isUpdatingProfile') Save Changes
                span(v-else) Saving...

        div(class='lg:col-span-2')
          div(class='p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6')
            div(class='flex items-center justify-between')
              div
                h2(class='text-base font-bold text-slate-900') Saved Delivery Destinations
                p(class='text-xs text-slate-500') Pre-filled at checkout for faster ordering
              button(
                class='px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors',
                @click='showAddressForm = !showAddressForm'
              )
                span(v-if='!showAddressForm') + Add New Address
                span(v-else) Cancel

            div(v-if='showAddressForm', class='bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4')
              h3(class='text-xs font-bold text-slate-900 uppercase tracking-wider') New Delivery Address
              form(class='space-y-3.5', @submit.prevent='saveNewAddress')
                div(class='grid grid-cols-1 gap-3 sm:grid-cols-2')
                  div(class='space-y-1')
                    label(class='block text-[11px] font-semibold text-slate-700') Recipient Name *
                    input(
                      class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-teal-600 focus:outline-none',
                      type='text',
                      v-model='addressForm.name',
                      required
                    )
                  div(class='space-y-1')
                    label(class='block text-[11px] font-semibold text-slate-700') 10-Digit Mobile *
                    input(
                      class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-teal-600 focus:outline-none',
                      type='tel',
                      v-model='addressForm.phone',
                      maxlength='10',
                      placeholder='9876543210',
                      required
                    )

                div(class='space-y-1')
                  label(class='block text-[11px] font-semibold text-slate-700') House / Flat No., Street, Building *
                  input(
                    class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-teal-600 focus:outline-none',
                    type='text',
                    v-model='addressForm.houseStreet',
                    required
                  )

                div(class='grid grid-cols-1 gap-3 sm:grid-cols-2')
                  div(class='space-y-1')
                    label(class='block text-[11px] font-semibold text-slate-700') Area / Sector / Colony
                    input(
                      class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-teal-600 focus:outline-none',
                      type='text',
                      v-model='addressForm.area'
                    )
                  div(class='space-y-1')
                    label(class='block text-[11px] font-semibold text-slate-700') Landmark
                    input(
                      class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-teal-600 focus:outline-none',
                      type='text',
                      v-model='addressForm.landmark',
                      placeholder='e.g. Near City Hospital'
                    )

                div(class='grid grid-cols-1 gap-3 sm:grid-cols-3')
                  div(class='space-y-1')
                    label(class='block text-[11px] font-semibold text-slate-700') PIN Code *
                    input(
                      class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-teal-600 focus:outline-none',
                      type='text',
                      v-model='addressForm.pincode',
                      maxlength='6',
                      placeholder='6 digits',
                      required
                    )
                  div(class='space-y-1')
                    label(class='block text-[11px] font-semibold text-slate-700') City *
                    input(
                      class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-teal-600 focus:outline-none',
                      type='text',
                      v-model='addressForm.city',
                      required
                    )
                  div(class='space-y-1')
                    label(class='block text-[11px] font-semibold text-slate-700') State *
                    select(
                      class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-teal-600 focus:outline-none',
                      v-model='addressForm.state',
                      required
                    )
                      option(value='', disabled) Select State
                      option(v-for='state in indianStates', :key='state', :value='state') {{ state }}

                div(class='flex items-center gap-2 pt-2')
                  input(
                    id='isDefault',
                    class='rounded text-teal-600 focus:ring-0',
                    type='checkbox',
                    v-model='addressForm.isDefault'
                  )
                  label(class='text-xs text-slate-700', for='isDefault') Set as default delivery destination

                div(class='flex justify-end gap-2 pt-3')
                  button(
                    class='px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-200 transition-colors',
                    type='button',
                    @click='showAddressForm = false'
                  ) Cancel
                  button(
                    class='px-5 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors',
                    type='submit',
                    :disabled='isSavingAddress'
                  )
                    span(v-if='!isSavingAddress') Save Address
                    span(v-else) Saving...

            div(v-if='addresses.length > 0', class='space-y-3')
              div(
                v-for='addr in addresses',
                :key='addr.id',
                class='p-5 rounded-xl border transition-all',
                :class='addr.is_default ? "border-teal-600 bg-teal-50/30" : "bg-white border-slate-200"'
              )
                div(class='flex items-start justify-between gap-3')
                  div(class='space-y-1')
                    div(class='flex items-center gap-2 mb-1')
                      h4(class='text-xs font-bold text-slate-900') {{ addr.name }}
                      span(v-if='addr.is_default', class='text-[10px] bg-teal-700 text-white font-bold rounded-full px-2 py-0.5') DEFAULT
                    p(class='text-xs text-slate-600') {{ addr.house_street }}{{ addr.area ? ', ' + addr.area : '' }}
                    p(v-if='addr.landmark', class='text-xs text-slate-600') Landmark: {{ addr.landmark }}
                    p(class='text-xs text-slate-600') {{ addr.city }}, {{ addr.state }} – {{ addr.pincode }}
                    p(class='text-xs text-slate-400 pt-1') Phone: {{ addr.phone }}
                  
                  button(
                    class='text-xs text-red-600 hover:underline font-medium px-2 py-1',
                    @click='deleteAddress(addr.id)'
                  ) Remove

            div(v-else-if='!isLoadingAddresses', class='text-center py-12 bg-slate-50 rounded-2xl border border-slate-100')
              p(class='text-xs text-slate-500') No saved addresses found. Add an address to speed up your checkout.
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import StoreLayout from '@/components/StoreLayout.vue';
import { mainStore } from '@/store';
import { api } from '@/helpers';

const router = useRouter();

const profileForm = ref({
  name: mainStore().customer?.name || '',
  phone: mainStore().customer?.phone || '',
});
const isUpdatingProfile = ref(false);

const addresses = ref([]);
const isLoadingAddresses = ref(true);
const showAddressForm = ref(false);
const isSavingAddress = ref(false);

const addressForm = ref({
  name: '',
  phone: '',
  houseStreet: '',
  area: '',
  landmark: '',
  pincode: '',
  city: '',
  state: '',
  isDefault: false,
});

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh'
];

async function updateProfile() {
  isUpdatingProfile.value = true;
  try {
    const res = await api.put('/users/profile', {
      name: profileForm.value.name.trim(),
      phone: profileForm.value.phone.trim(),
    });
    if (res.success && res.data?.user) {
      mainStore().customer = { ...mainStore().customer, ...res.data.user };
      mainStore().success('Profile updated successfully!');
    }
  } catch (error) {
    mainStore().error(error.message || 'Failed to update profile');
  } finally {
    isUpdatingProfile.value = false;
  }
}

async function loadAddresses() {
  isLoadingAddresses.value = true;
  try {
    const res = await api.get('/users/addresses');
    if (res.success && res.data) {
      addresses.value = res.data.addresses || [];
    }
  } catch {
    addresses.value = [];
  } finally {
    isLoadingAddresses.value = false;
  }
}

async function saveNewAddress() {
  if (addressForm.value.phone.replace(/[^0-9]/g, '').length !== 10) {
    mainStore().error('Please enter a valid 10-digit mobile number.');
    return;
  }
  if (addressForm.value.pincode.replace(/[^0-9]/g, '').length !== 6) {
    mainStore().error('Please enter a valid 6-digit PIN code.');
    return;
  }

  isSavingAddress.value = true;
  try {
    const res = await api.post('/users/addresses', {
      name: addressForm.value.name.trim(),
      phone: addressForm.value.phone.trim(),
      houseStreet: addressForm.value.houseStreet.trim(),
      area: addressForm.value.area.trim() || undefined,
      landmark: addressForm.value.landmark.trim() || undefined,
      pincode: addressForm.value.pincode.trim(),
      city: addressForm.value.city.trim(),
      state: addressForm.value.state,
      isDefault: addressForm.value.isDefault,
    });
    if (res.success) {
      mainStore().success('Address saved successfully!');
      showAddressForm.value = false;
      addressForm.value = {
        name: '',
        phone: '',
        houseStreet: '',
        area: '',
        landmark: '',
        pincode: '',
        city: '',
        state: '',
        isDefault: false,
      };
      await loadAddresses();
    }
  } catch (error) {
    mainStore().error(error.message || 'Failed to save address');
  } finally {
    isSavingAddress.value = false;
  }
}

async function deleteAddress(addressId) {
  try {
    await api.delete(`/users/addresses/${addressId}`);
    mainStore().success('Address deleted');
    addresses.value = addresses.value.filter((a) => a.id !== addressId);
  } catch (error) {
    mainStore().error(error.message || 'Failed to delete address');
  }
}

async function handleLogout() {
  await mainStore().logout();
  router.push('/');
}

onMounted(async () => {
  await loadAddresses();
});
</script>
