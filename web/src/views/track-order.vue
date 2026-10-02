<template lang="pug">
StoreLayout
  div(class='bg-[#f5f5f7] min-h-screen py-10 sm:py-14')
    div(class='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      // Page Title
      div(class='text-center space-y-1.5')
        h1(class='text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]') Track Your Order
        p(class='text-xs text-[#6e6e73]')
          | Check real-time shipment milestones, courier partner updates, and delivery status.

      // Search Card
      div(class='apple-card p-6 sm:p-8 bg-white')
        form(class='grid grid-cols-1 gap-4 sm:grid-cols-12 items-end', @submit.prevent='lookupOrder')
          div(class='sm:col-span-6 space-y-1.5')
            label(class='block text-xs font-semibold text-[#1d1d1f]') Order Number *
            input(
              class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl uppercase text-[#1d1d1f] font-mono focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
              type='text',
              placeholder='e.g. ORD-100001',
              v-model='orderNumberInput',
              required
            )
          
          div(class='sm:col-span-6 space-y-1.5')
            label(class='block text-xs font-semibold text-[#1d1d1f]') Mobile Phone or Email *
            input(
              class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
              type='text',
              placeholder='Phone or email used at checkout',
              v-model='contactInput',
              required
            )
          
          div(class='sm:col-span-12 pt-2')
            button(
              class='w-full apple-btn-primary py-3.5 text-sm font-semibold shadow-md disabled:opacity-50',
              type='submit',
              :disabled='isLoading'
            )
              span(v-if='isLoading') Checking Shipment Milestones...
              span(v-else) Track Order Status 🔍

      // Order Progress & Details Card
      div(v-if='order', class='apple-card p-6 sm:p-8 bg-white space-y-8')
        // Order Meta Header
        div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e5ea] pb-5')
          div
            span(class='text-2xs font-semibold text-[#86868b] uppercase tracking-wider') Order Reference
            h2(class='text-xl font-bold text-[#1d1d1f] font-mono') {{ order.order_number }}
            p(class='text-xs text-[#6e6e73] mt-0.5') Placed on {{ formatDate(order.created_at, true) }}
          
          div
            span(
              class='text-xs px-3.5 py-1 rounded-full font-semibold border',
              :class='getOrderStatusBadge(order.order_status).bg'
            ) {{ getOrderStatusBadge(order.order_status).label }}

        // Apple Milestone Stepper
        div(class='py-4')
          div(class='relative')
            div(class='absolute top-4 left-0 right-0 h-1 bg-[#e5e5ea]', style='z-index: 1;')
            div(
              class='absolute top-4 left-0 h-1 bg-[#0071e3] transition-all duration-500',
              :style='{ width: `${progressPercentage}%` }',
              style='z-index: 2;'
            )
            
            div(class='relative flex justify-between', style='z-index: 3;')
              div(v-for='(step, idx) in steps', :key='step.key', class='flex flex-col items-center')
                div(
                  class='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  :class='isStepComplete(idx) ? "bg-[#0071e3] text-white shadow-xs" : "bg-[#f5f5f7] text-[#86868b] border border-[#d2d2d7]"'
                ) {{ isStepComplete(idx) ? '✓' : idx + 1 }}
                span(
                  class='text-[11px] font-medium mt-2 text-center max-w-16',
                  :class='isStepComplete(idx) ? "text-[#1d1d1f] font-semibold" : "text-[#86868b]"'
                ) {{ step.label }}

        // Courier & Live Tracking Info
        div(v-if='order.tracking_number || order.courier_name', class='apple-card p-5 bg-[#f5f5f7] border border-[#e5e5ea] space-y-3')
          h3(class='text-xs font-bold text-[#1d1d1f] uppercase tracking-wider') Carrier & Dispatch Info
          div(class='grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs')
            div
              span(class='text-[#86868b]') Courier Partner:
              p(class='font-bold text-[#1d1d1f]') {{ order.courier_name || 'BlueDart / Delhivery' }}
            div
              span(class='text-[#86868b]') Air Waybill (AWB):
              p(class='font-mono font-bold text-[#1d1d1f]') {{ order.tracking_number || 'Processing' }}
            div
              span(class='text-[#86868b]') Dispatched On:
              p(class='font-medium text-[#1d1d1f]') {{ formatDate(order.shipped_at) }}
          
          div(v-if='order.tracking_url', class='pt-2')
            a(
              class='apple-btn-secondary text-xs px-4 py-2 inline-flex items-center gap-1',
              :href='order.tracking_url',
              target='_blank',
              rel='noopener noreferrer'
            )
              span Open Live Courier Tracking
              span ↗

        // Order Items List
        div(class='space-y-3')
          h3(class='text-xs font-bold text-[#1d1d1f] uppercase tracking-wider') Items in Shipment
          div(class='divide-y divide-[#f5f5f7]')
            div(
              v-for='item in (order.items || [])',
              :key='item.id',
              class='py-3 flex items-center justify-between gap-4'
            )
              div(class='flex items-center gap-3')
                div(class='w-12 h-12 rounded-xl bg-[#f5f5f7] flex items-center justify-center p-1 overflow-hidden shrink-0')
                  img(
                    class='max-h-full max-w-full object-contain',
                    :src='item.primary_image_url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=100&q=80"',
                    :alt='item.product_name'
                  )
                div
                  p(class='text-xs font-bold text-[#1d1d1f]') {{ item.product_name }}
                  p(v-if='item.variant_name', class='text-2xs text-[#6e6e73]') {{ item.variant_name }}
                  p(class='text-2xs text-[#86868b]') Qty: {{ item.quantity }}
              span(class='text-xs font-bold text-[#1d1d1f]')
                | {{ formatPrice(item.unit_price_paisa * item.quantity) }}

        div(class='border-t border-[#e5e5ea] pt-4 flex justify-between text-xs font-semibold text-[#1d1d1f]')
          span Total Paid
          span(class='text-base font-bold') {{ formatPrice(order.total_amount_paisa) }}
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import StoreLayout from '@/components/StoreLayout.vue';
import { mainStore } from '@/store';
import { formatPrice, formatDate, getOrderStatusBadge, api } from '@/helpers';

const route = useRoute();

const orderNumberInput = ref(route.query.orderNumber || '');
const contactInput = ref(route.query.contact || '');
const order = ref(null);
const isLoading = ref(false);

const steps = [
  { key: 'placed', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Dispatched' },
  { key: 'delivered', label: 'Delivered' },
];

const currentStepIndex = computed(() => {
  if (!order.value) return 0;
  const status = order.value.order_status;
  if (status === 'delivered') return 4;
  if (status === 'shipped') return 3;
  if (status === 'processing') return 2;
  if (status === 'confirmed') return 1;
  return 0;
});

const progressPercentage = computed(() => {
  return (currentStepIndex.value / (steps.length - 1)) * 100;
});

function isStepComplete(stepIdx) {
  return stepIdx <= currentStepIndex.value;
}

async function lookupOrder() {
  if (!orderNumberInput.value.trim() || !contactInput.value.trim()) {
    mainStore().error('Please enter both Order Number and Phone or Email');
    return;
  }

  isLoading.value = true;
  try {
    const res = await api.get(`/orders/track?orderNumber=${encodeURIComponent(orderNumberInput.value.trim())}&contact=${encodeURIComponent(contactInput.value.trim())}`);
    if (res.success && res.data?.order) {
      order.value = res.data.order;
    } else {
      mainStore().error('No matching order found. Please check your order details.');
    }
  } catch (error) {
    mainStore().error(error.message || 'Order lookup failed');
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  if (orderNumberInput.value && contactInput.value) {
    lookupOrder();
  }
});
</script>
