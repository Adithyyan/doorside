<template lang="pug">
AdminLayout
  div(class='space-y-6')
    div(class='flex flex-col justify-between gap-4 sm:flex-row sm:items-center')
      div
        h1(class='text-2xl font-black text-slate-900 tracking-tight') {{ $brandName }} Suppliers
        p(class='text-xs text-slate-500 mt-1') Configure wholesale source marketplaces (Meesho, IndiaMART, custom vendors) and API automation.
      
      button(class='btn-primary px-4 py-2 rounded-xl text-xs font-bold', @click='openCreateModal') + Add New Supplier

    div(v-if='showModal', class='fixed inset-0 bg-slate-900 bg-opacity-50 z-50 flex items-center justify-center p-4')
      div(class='bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4')
        div(class='flex items-center justify-between')
          h2(class='text-sm font-black text-slate-900') {{ editingId ? 'Edit Supplier' : 'Add New Supplier' }}
          button(class='text-slate-400 hover:text-slate-600', @click='showModal = false') ✕

        form(class='space-y-3', @submit.prevent='saveSupplier')
          div
            label(class='block text-2xs font-bold text-slate-700 mb-1') Supplier / Vendor Name *
            input(class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs', type='text', v-model='form.name', placeholder='e.g. Meesho Marketplace', required, @input='handleNameInput')

          div(class='grid grid-cols-2 gap-3')
            div
              label(class='block text-2xs font-bold text-slate-700 mb-1') Identifier Code *
              input(class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono', type='text', v-model='form.code', placeholder='e.g. meesho', required)
            div
              label(class='block text-2xs font-bold text-slate-700 mb-1') Integration Type
              select(class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs', v-model='form.integrationType')
                option(value='manual') Manual (Web Portal)
                option(value='api') Direct API (Automated)

          div
            label(class='block text-2xs font-bold text-slate-700 mb-1') Supplier Website Portal URL
            input(class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs', type='url', v-model='form.website', placeholder='https://meesho.com')

          div(class='grid grid-cols-2 gap-3')
            div
              label(class='block text-2xs font-bold text-slate-700 mb-1') Support Email
              input(class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs', type='email', v-model='form.email')
            div
              label(class='block text-2xs font-bold text-slate-700 mb-1') Support Phone
              input(class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs', type='tel', v-model='form.phone')

          div(class='flex items-center gap-2 pt-2')
            input(id='isActiveSup', type='checkbox', v-model='form.isActive')
            label(class='text-xs font-bold text-slate-700', for='isActiveSup') Active & Enabled for Products

          div(class='flex justify-end gap-2 pt-3')
            button(class='px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50', type='button', @click='showModal = false') Cancel
            button(class='btn-primary px-5 py-2 rounded-xl text-xs font-bold', type='submit', :disabled='isSaving')
              span(v-if='!isSaving') Save Supplier
              span(v-else) Saving...

    div(v-if='suppliers.length > 0', class='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3')
      div(v-for='sup in suppliers', :key='sup.id', class='bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between')
        div
          div(class='flex items-start justify-between gap-2 mb-3')
            div
              h3(class='text-base font-black text-slate-900') {{ sup.name }}
              span(class='text-2xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600') {{ sup.code }}
            
            span(class='text-2xs px-2 py-0.5 rounded-full font-bold', :class='sup.is_active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"') {{ sup.is_active ? 'Active' : 'Disabled' }}

          div(class='space-y-1 text-xs text-slate-600 mb-4')
            p
              strong(class='font-semibold') Integration: 
              span(class='uppercase font-bold', :class='sup.integration_type === "api" ? "text-blue-600" : "text-slate-700"') {{ sup.integration_type || 'Manual' }}
            p(v-if='sup.website')
              a(class='text-blue-600 hover:underline', :href='sup.website', target='_blank')
                | Visit Supplier Website ↗
            p(v-if='sup.email') Email: {{ sup.email }}
            p(v-if='sup.phone') Phone: {{ sup.phone }}

        div(class='pt-4 border-t border-slate-100 flex items-center justify-end gap-2')
          button(class='px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50', @click='openEditModal(sup)') ✏️ Edit Details

    div(v-else-if='!isLoading', class='text-center py-16 bg-white rounded-2xl border border-slate-200')
      div(class='text-3xl mb-2') 🏭
      p(class='text-xs font-semibold text-slate-500') No suppliers configured yet. Add Meesho or your wholesale vendor.

    div(v-else, class='py-16 text-center text-xs text-slate-400')
      | Loading suppliers...
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/components/AdminLayout.vue';
import { mainStore } from '@/store';
import { api } from '@/helpers';


const suppliers = ref([]);
const isLoading = ref(true);
const showModal = ref(false);
const editingId = ref(null);
const isSaving = ref(false);

const form = ref({
  name: '',
  code: '',
  integrationType: 'manual',
  website: '',
  email: '',
  phone: '',
  isActive: true,
});

function handleNameInput() {
  if (!editingId.value && !form.value.code) {
    form.value.code = form.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 20);
  }
}

function openCreateModal() {
  editingId.value = null;
  form.value = {
    name: '',
    code: '',
    integrationType: 'manual',
    website: '',
    email: '',
    phone: '',
    isActive: true,
  };
  showModal.value = true;
}

function openEditModal(sup) {
  editingId.value = sup.id;
  form.value = {
    name: sup.name,
    code: sup.code,
    integrationType: sup.integration_type || 'manual',
    website: sup.website || '',
    email: sup.email || '',
    phone: sup.phone || '',
    isActive: sup.is_active ?? true,
  };
  showModal.value = true;
}

async function saveSupplier() {
  isSaving.value = true;
  try {
    if (editingId.value) {
      await api.patch(`/admin/suppliers/${editingId.value}`, form.value);
      mainStore().toast('Supplier updated', 'success');
    } else {
      await api.post('/admin/suppliers', form.value);
      mainStore().toast('Supplier created', 'success');
    }
    showModal.value = false;
    await getSuppliers();
  } catch (err) {
    mainStore().toast(err.message || 'Failed to save supplier', 'error');
  } finally {
    isSaving.value = false;
  }
}

async function getSuppliers() {
  isLoading.value = true;
  try {
    const res = await api.get('/admin/suppliers?pageSize=50');
    if (res.success && res.data) {
      suppliers.value = res.data.items || [];
    }
  } catch {
    suppliers.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getSuppliers();
});
</script>
