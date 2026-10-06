<template lang="pug">
StoreLayout
  div(class='bg-page min-h-screen py-10 sm:py-14')
    div(class='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      div(class='text-center space-y-1.5')
        h1(class='heading-lg text-ink') Track Your Order
        p(class='text-fine text-muted uppercase tracking-editorial')
          | Check real-time shipment milestones, courier partner updates, and delivery status.

      div(class='panel-editorial p-6 sm:p-8')
        form(class='grid grid-cols-1 gap-4 sm:grid-cols-12 items-end', @submit.prevent='lookupOrder')
          div(class='sm:col-span-6 space-y-1.5')
            label(class='label-ink block') Order Number *
            input(class='input-base uppercase font-mono', type='text', placeholder='e.g. ORD-100001', v-model='orderNumberInput', required)
          
          div(class='sm:col-span-6 space-y-1.5')
            label(class='label-ink block') Mobile Phone or Email *
            input(class='input-base', type='text', placeholder='Phone or email used at checkout', v-model='contactInput', required)
          
          div(class='sm:col-span-12 pt-2')
            button(class='btn-primary w-full py-4 text-center justify-center disabled:opacity-50 flex items-center gap-2', type='submit', :disabled='isLoading')
              span(v-if='isLoading') Checking Shipment Milestones...
              span(v-else) Track Order Status 🔍

      div(v-if='order', class='panel-editorial p-6 sm:p-8 space-y-8')
        div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-soft pb-5')
          div
            span(class='label-muted') Order Reference
            h2(class='heading-sm text-ink font-mono') {{ order.order_number }}
            p(class='text-fine text-muted uppercase tracking-editorial mt-0.5') Placed on {{ formatDate(order.created_at, true) }}
          
          div
            span(class='badge-status-pending')
              | {{ getOrderStatusBadge(order.order_status).label }}

        div(class='py-4')
          div(class='relative')
            div(class='absolute top-4 left-0 right-0 h-1 bg-surface border border-soft', style='z-index: 1;')
            div(class='absolute top-4 left-0 h-1 bg-ink transition-all duration-500', :style='{ width: `${progressPercentage}%` }', style='z-index: 2;')
            
            div(class='relative flex justify-between', style='z-index: 3;')
              div(v-for='(step, idx) in steps', :key='step.key', class='flex flex-col items-center')
                div(class='w-8 h-8 flex items-center justify-center text-fine font-bold transition-all', :class='isStepComplete(idx) ? "bg-ink text-white" : "bg-white text-muted border border-soft"') {{ isStepComplete(idx) ? '✓' : idx + 1 }}
                span(class='text-fine mt-2 text-center max-w-16 uppercase tracking-editorial', :class='isStepComplete(idx) ? "text-ink font-bold" : "text-muted"') {{ step.label }}

        div(v-if='order.tracking_number || order.courier_name', class='p-5 bg-page-alt border border-soft space-y-3')
          h3(class='label-ink') Carrier & Dispatch Info
          div(class='grid grid-cols-1 sm:grid-cols-3 gap-4 text-cap')
            div
              span(class='label-muted') Courier Partner:
              p(class='font-bold text-ink') {{ order.courier_name || 'Standard Courier' }}
            div
              span(class='label-muted') Air Waybill (AWB):
              p(class='font-mono font-bold text-ink') {{ order.tracking_number || 'Processing' }}
            div
              span(class='label-muted') Dispatched On:
              p(class='font-medium text-ink') {{ formatDate(order.shipped_at) }}
          
          div(v-if='order.tracking_url', class='pt-2')
            a(class='btn-outline px-4 py-2 text-fine inline-flex items-center gap-1', :href='order.tracking_url', target='_blank', rel='noopener noreferrer')
              span Open Live Courier Tracking
              span ↗

        div(class='space-y-3')
          h3(class='label-ink') Items in Shipment
          div(class='divide-y divide-soft')
            div(v-for='item in (order.items || [])', :key='item.id', class='py-3 flex items-center justify-between gap-4')
              div(class='flex items-center gap-3')
                div(class='w-14 h-16 bg-surface border border-soft flex items-center justify-center p-1 overflow-hidden shrink-0')
                  img(class='h-full w-full object-cover', :src='item.primary_image_url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=100&q=80"', :alt='item.product_name')
                div
                  p(class='text-cap font-bold text-ink') {{ item.product_name }}
                  p(v-if='item.variant_name', class='text-fine text-muted uppercase tracking-editorial') {{ item.variant_name }}
                  p(class='text-fine text-muted uppercase tracking-editorial') Qty: {{ item.quantity }}
              span(class='text-cap font-bold text-ink')
                | {{ formatPrice(item.unit_price_paisa * item.quantity) }}

        div(class='border-t border-soft pt-4 flex justify-between text-cap font-semibold text-ink uppercase tracking-editorial')
          span Total Paid
          span(class='text-body-sm font-bold text-ink') {{ formatPrice(order.total_amount_paisa) }}
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
  if (!order.value) {
    return 0;
  }
  const status = order.value.order_status;
  if (status === 'delivered') {
    return 4;
  }
  if (status === 'shipped') {
    return 3;
  }
  if (status === 'processing') {
    return 2;
  }
  if (status === 'confirmed') {
    return 1;
  }
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
