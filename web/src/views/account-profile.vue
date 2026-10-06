<template lang="pug">
StoreLayout
  div(class='bg-page min-h-screen py-10 sm:py-14')
    div(class='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-soft pb-6')
        div
          h1(class='heading-lg text-ink') Profile & Addresses
          p(class='text-fine text-muted uppercase tracking-editorial mt-1')
            | Manage your personal details and saved delivery destinations.
        
        div(class='flex items-center gap-2.5')
          router-link(class='btn-outline px-4 py-2', to='/account/orders')
            | View Orders
          button(class='btn-danger', @click='handleLogout')
            | Sign Out

      div(class='flex gap-8 border-b border-soft')
        router-link(class='tab-editorial', to='/account/orders') Order History
        router-link(class='tab-editorial tab-editorial-active', to='/account/profile') Addresses & Details

      div(class='grid grid-cols-1 gap-8 lg:grid-cols-3 items-start')
        div(class='lg:col-span-1')
          div(class='panel-editorial p-6 space-y-5')
            h2(class='heading-sm text-ink') Personal Details
            form(class='space-y-4', @submit.prevent='updateProfile')
              div(class='space-y-1')
                label(class='label-ink block') Full Name
                input(class='input-base', type='text', v-model='profileForm.name', required)
              div(class='space-y-1')
                label(class='label-ink block') Email Address
                input(class='input-base bg-surface text-muted cursor-not-allowed', type='email', :value='mainStore().customer?.email', disabled)
                span(class='text-fine text-muted uppercase tracking-editorial') Registered email reference.
              div(class='space-y-1')
                label(class='label-ink block') Mobile Phone
                input(class='input-base', type='tel', v-model='profileForm.phone', placeholder='10-digit mobile')
              button(class='btn-primary w-full py-3 mt-2 disabled:opacity-50', type='submit', :disabled='isUpdatingProfile')
                span(v-if='!isUpdatingProfile') Save Changes
                span(v-else) Saving...

        div(class='lg:col-span-2')
          div(class='panel-editorial p-6 sm:p-8 space-y-6')
            div(class='flex items-center justify-between')
              div
                h2(class='heading-sm text-ink') Saved Delivery Destinations
                p(class='text-fine text-muted uppercase tracking-editorial') Pre-filled at checkout for faster ordering
              button(class='btn-outline px-4 py-2 text-fine', @click='showAddressForm = !showAddressForm')
                span(v-if='!showAddressForm') + Add New Address
                span(v-else) Cancel

            div(v-if='showAddressForm', class='bg-page-alt p-5 sm:p-6 border border-soft space-y-4')
              h3(class='label-ink') New Delivery Address
              form(class='space-y-3.5', @submit.prevent='saveNewAddress')
                div(class='grid grid-cols-1 gap-3 sm:grid-cols-2')
                  div(class='space-y-1')
                    label(class='label-ink block') Recipient Name *
                    input(class='input-base', type='text', v-model='addressForm.name', required)
                  div(class='space-y-1')
                    label(class='label-ink block') 10-Digit Mobile *
                    input(class='input-base', type='tel', v-model='addressForm.phone', maxlength='10', placeholder='9876543210', required)

                div(class='space-y-1')
                  label(class='label-ink block') House / Flat No., Street, Building *
                  input(class='input-base', type='text', v-model='addressForm.houseStreet', required)

                div(class='grid grid-cols-1 gap-3 sm:grid-cols-2')
                  div(class='space-y-1')
                    label(class='label-ink block') Area / Sector / Colony
                    input(class='input-base', type='text', v-model='addressForm.area')
                  div(class='space-y-1')
                    label(class='label-ink block') Landmark
                    input(class='input-base', type='text', v-model='addressForm.landmark', placeholder='e.g. Near City Hospital')

                div(class='grid grid-cols-1 gap-3 sm:grid-cols-3')
                  div(class='space-y-1')
                    label(class='label-ink block') PIN Code *
                    input(class='input-base', type='text', v-model='addressForm.pincode', maxlength='6', placeholder='6 digits', required)
                  div(class='space-y-1')
                    label(class='label-ink block') City *
                    input(class='input-base', type='text', v-model='addressForm.city', required)
                  div(class='space-y-1')
                    label(class='label-ink block') State *
                    select(class='select-base w-full', v-model='addressForm.state', required)
                      option(value='', disabled) Select State
                      option(v-for='state in indianStates', :key='state', :value='state') {{ state }}

                div(class='flex items-center gap-2 pt-2')
                  input(id='isDefault', class='w-3.5 h-3.5 border border-soft rounded-none cursor-pointer', type='checkbox', v-model='addressForm.isDefault')
                  label(class='text-fine text-muted uppercase tracking-editorial cursor-pointer', for='isDefault') Set as default delivery destination

                div(class='flex justify-end gap-2 pt-3')
                  button(class='btn-outline px-4 py-2 text-fine', type='button', @click='showAddressForm = false') Cancel
                  button(class='btn-primary px-5 py-2 text-fine', type='submit', :disabled='isSavingAddress')
                    span(v-if='!isSavingAddress') Save Address
                    span(v-else) Saving...

            div(v-if='addresses.length > 0', class='space-y-3')
              div(v-for='addr in addresses', :key='addr.id', class='p-5 border transition-all', :class='addr.is_default ? "border-ink bg-surface" : "bg-white border-soft"')
                div(class='flex items-start justify-between gap-3')
                  div(class='space-y-1')
                    div(class='flex items-center gap-2 mb-1')
                      h4(class='text-cap font-bold text-ink') {{ addr.name }}
                      span(v-if='addr.is_default', class='badge-status-success') DEFAULT
                    p(class='text-cap text-soft') {{ addr.house_street }}{{ addr.area ? ', ' + addr.area : '' }}
                    p(v-if='addr.landmark', class='text-fine text-muted') Landmark: {{ addr.landmark }}
                    p(class='text-cap text-soft') {{ addr.city }}, {{ addr.state }} – {{ addr.pincode }}
                    p(class='text-fine text-muted pt-1') Phone: {{ addr.phone }}
                  
                  button(class='btn-danger', @click='deleteAddress(addr.id)') Remove

            div(v-else-if='!isLoadingAddresses', class='panel-editorial text-center py-12')
              p(class='text-cap text-muted uppercase tracking-editorial') No saved addresses found. Add an address to speed up your checkout.
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
