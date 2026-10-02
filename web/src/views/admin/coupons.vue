<template lang="pug">
AdminLayout
  div(class='space-y-6')
    div(class='flex flex-col justify-between gap-4 sm:flex-row sm:items-center')
      div
        h1(class='text-2xl font-black text-slate-900 tracking-tight') Coupons & Discounts
        p(class='text-xs text-slate-500 mt-1') Create and manage promotional discount vouchers for customers.
      
      button(
        class='btn-primary px-4 py-2 rounded-xl text-xs font-bold',
        @click='openCreateModal'
      ) + Create Coupon

    div(
      v-if='showModal',
      class='fixed inset-0 bg-slate-900 bg-opacity-50 z-50 flex items-center justify-center p-4'
    )
      div(class='bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4')
        div(class='flex items-center justify-between')
          h2(class='text-sm font-black text-slate-900') {{ editingId ? 'Edit Coupon' : 'Create New Coupon' }}
          button(class='text-slate-400 hover:text-slate-600', @click='showModal = false') ✕

        form(class='space-y-3', @submit.prevent='saveCoupon')
          div(class='grid grid-cols-2 gap-3')
            div
              label(class='block text-2xs font-bold text-slate-700 mb-1') Coupon Code *
              input(
                class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase',
                type='text',
                v-model='form.code',
                placeholder='e.g. FESTIVE20',
                required
              )
            div
              label(class='block text-2xs font-bold text-slate-700 mb-1') Discount Type
              select(
                class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs',
                v-model='form.couponType'
              )
                option(value='percentage') Percentage (%)
                option(value='fixed') Fixed Flat Amount (₹)

          div(v-if='form.couponType === "percentage"')
            div(class='grid grid-cols-2 gap-3')
              div
                label(class='block text-2xs font-bold text-slate-700 mb-1') Discount Percentage (%) *
                input(
                  class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs',
                  type='number',
                  min='1',
                  max='100',
                  v-model.number='form.discountPercentage',
                  required
                )
              div
                label(class='block text-2xs font-bold text-slate-700 mb-1') Max Discount Cap (₹)
                input(
                  class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs',
                  type='number',
                  min='0',
                  v-model.number='maxDiscountRupees',
                  placeholder='e.g. 500'
                )

          div(v-else)
            label(class='block text-2xs font-bold text-slate-700 mb-1') Flat Discount Amount (₹) *
            input(
              class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs',
              type='number',
              min='1',
              v-model.number='discountAmountRupees',
              required
            )

          div(class='grid grid-cols-2 gap-3')
            div
              label(class='block text-2xs font-bold text-slate-700 mb-1') Min Order Amount (₹)
              input(
                class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs',
                type='number',
                min='0',
                v-model.number='minOrderRupees',
                placeholder='0 for no minimum'
              )
            div
              label(class='block text-2xs font-bold text-slate-700 mb-1') Usage Limit
              input(
                class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs',
                type='number',
                min='0',
                v-model.number='form.usageLimit',
                placeholder='Leave blank for infinite'
              )

          div
            label(class='block text-2xs font-bold text-slate-700 mb-1') Description / Campaign Note
            input(
              class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs',
              type='text',
              v-model='form.description',
              placeholder='e.g. 10% off for first-time shoppers'
            )

          div(class='flex items-center gap-2 pt-2')
            input(id='isActiveCpn', type='checkbox', v-model='form.isActive')
            label(class='text-xs font-bold text-slate-700', for='isActiveCpn') Active & Redeemable

          div(class='flex justify-end gap-2 pt-3')
            button(
              class='px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50',
              type='button',
              @click='showModal = false'
            ) Cancel
            button(
              class='btn-primary px-5 py-2 rounded-xl text-xs font-bold',
              type='submit',
              :disabled='isSaving'
            )
              span(v-if='!isSaving') Save Coupon
              span(v-else) Saving...

    div(class='bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden')
      div(class='overflow-x-auto')
        table(class='w-full text-left border-collapse')
          thead(class='bg-slate-50 border-b border-slate-200 text-2xs font-bold text-slate-500 uppercase tracking-wider')
            tr
              th(class='px-6 py-3.5') Coupon Code
              th(class='px-6 py-3.5') Discount Value
              th(class='px-6 py-3.5') Min Order
              th(class='px-6 py-3.5') Max Cap
              th(class='px-6 py-3.5') Usage
              th(class='px-6 py-3.5') Status
              th(class='px-6 py-3.5') Actions
          tbody(class='divide-y divide-slate-100 text-xs')
            tr(
              v-for='cpn in coupons',
              :key='cpn.id',
              class='transition-colors hover:bg-slate-50'
            )
              td(class='py-4 px-6')
                span(class='font-mono font-black text-slate-900 bg-slate-100 px-2 py-1 rounded') {{ cpn.code }}
                p(class='text-2xs text-slate-400 mt-1') {{ cpn.description || 'General promotion' }}

              td(class='py-4 px-6')
                span(v-if='cpn.coupon_type === "percentage"', class='font-bold text-emerald-700')
                  | {{ cpn.discount_percentage }}% OFF
                span(v-else, class='font-bold text-emerald-700')
                  | {{ formatPrice(cpn.discount_amount_paisa) }} OFF

              td(class='py-4 px-6')
                | {{ cpn.minimum_order_paisa > 0 ? formatPrice(cpn.minimum_order_paisa) : 'None' }}

              td(class='py-4 px-6')
                | {{ cpn.max_discount_paisa ? formatPrice(cpn.max_discount_paisa) : 'No Cap' }}

              td(class='py-4 px-6')
                span(class='font-semibold') {{ cpn.current_usage || 0 }}
                span(v-if='cpn.usage_limit', class='text-slate-400')  / {{ cpn.usage_limit }}

              td(class='py-4 px-6')
                span(
                  class='text-2xs px-2 py-0.5 rounded-full font-bold',
                  :class='cpn.is_active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"'
                ) {{ cpn.is_active ? 'Active' : 'Disabled' }}

              td(class='py-4 px-6')
                div(class='flex items-center gap-2')
                  button(
                    class='rounded-lg border border-slate-200 text-slate-700 p-1.5 hover:bg-slate-100',
                    @click='openEditModal(cpn)'
                  ) ✏️ Edit
                  button(
                    class='rounded-lg border border-rose-200 text-rose-600 p-1.5 hover:bg-rose-50',
                    @click='deleteCoupon(cpn.id)'
                  ) 🗑️

            tr(v-if='coupons.length === 0 && !isLoading')
              td(class='py-12 text-center text-slate-400', colspan='7')
                p(class='text-xs font-semibold') No coupons created yet. Click "+ Create Coupon" to add WELCOME10 or festive discounts.

            tr(v-if='isLoading')
              td(class='py-12 text-center text-slate-400', colspan='7')
                | Loading coupons...
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/components/AdminLayout.vue';
import { mainStore } from '@/store';
import { api, formatPrice } from '@/helpers';


const coupons = ref([]);
const isLoading = ref(true);
const showModal = ref(false);
const editingId = ref(null);
const isSaving = ref(false);

const discountAmountRupees = ref(100);
const maxDiscountRupees = ref(500);
const minOrderRupees = ref(0);

const form = ref({
  code: '',
  description: '',
  couponType: 'percentage',
  discountPercentage: 10,
  usageLimit: null,
  isActive: true,
});

function openCreateModal() {
  editingId.value = null;
  form.value = {
    code: '',
    description: '',
    couponType: 'percentage',
    discountPercentage: 10,
    usageLimit: null,
    isActive: true,
  };
  discountAmountRupees.value = 100;
  maxDiscountRupees.value = 500;
  minOrderRupees.value = 0;
  showModal.value = true;
}

function openEditModal(cpn) {
  editingId.value = cpn.id;
  form.value = {
    code: cpn.code,
    description: cpn.description || '',
    couponType: cpn.coupon_type || 'percentage',
    discountPercentage: cpn.discount_percentage || 10,
    usageLimit: cpn.usage_limit || null,
    isActive: cpn.is_active ?? true,
  };
  discountAmountRupees.value = cpn.discount_amount_paisa ? cpn.discount_amount_paisa / 100 : 100;
  maxDiscountRupees.value = cpn.max_discount_paisa ? cpn.max_discount_paisa / 100 : null;
  minOrderRupees.value = cpn.minimum_order_paisa ? cpn.minimum_order_paisa / 100 : 0;
  showModal.value = true;
}

async function saveCoupon() {
  isSaving.value = true;
  const payload = {
    code: form.value.code.toUpperCase().trim(),
    description: form.value.description,
    couponType: form.value.couponType,
    discountPercentage: form.value.couponType === 'percentage' ? form.value.discountPercentage : null,
    discountAmountPaisa: form.value.couponType === 'fixed' ? Math.round(discountAmountRupees.value * 100) : null,
    maxDiscountPaisa: form.value.couponType === 'percentage' && maxDiscountRupees.value ? Math.round(maxDiscountRupees.value * 100) : null,
    minimumOrderPaisa: minOrderRupees.value ? Math.round(minOrderRupees.value * 100) : 0,
    usageLimit: form.value.usageLimit || null,
    isActive: form.value.isActive,
  };

  try {
    if (editingId.value) {
      await api.patch(`/admin/coupons/${editingId.value}`, payload);
      mainStore().toast('Coupon updated', 'success');
    } else {
      await api.post('/admin/coupons', payload);
      mainStore().toast('Coupon created', 'success');
    }
    showModal.value = false;
    await getCoupons();
  } catch (err) {
    mainStore().toast(err.message || 'Failed to save coupon', 'error');
  } finally {
    isSaving.value = false;
  }
}

async function deleteCoupon(id) {
  if (!confirm('Are you sure you want to delete this coupon?')) {
    return;
  }
  try {
    await api.delete(`/admin/coupons/${id}`);
    mainStore().toast('Coupon deleted', 'info');
    await getCoupons();
  } catch (err) {
    mainStore().toast(err.message || 'Failed to delete coupon', 'error');
  }
}

async function getCoupons() {
  isLoading.value = true;
  try {
    const res = await api.get('/admin/coupons?pageSize=50');
    if (res.success && res.data) {
      coupons.value = res.data.items || [];
    }
  } catch {
    coupons.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getCoupons();
});
</script>
