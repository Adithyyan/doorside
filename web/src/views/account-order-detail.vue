<template lang="pug">
StoreLayout
  div(v-if='order', class='bg-page min-h-screen py-10 sm:py-14')
    div(class='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6')
      div
        router-link(class='btn-outline px-4 py-2 text-fine inline-flex items-center gap-1', to='/account/orders')
          span ‹ Back to Order History

      div(class='panel-editorial p-6 sm:p-10 space-y-8')
        div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-soft pb-6')
          div
            span(class='label-muted') Order Reference
            h1(class='heading-md text-ink font-mono') {{ order.order_number }}
            p(class='text-fine text-muted uppercase tracking-editorial mt-0.5') Placed on {{ formatDate(order.created_at, true) }}
          
          div(class='flex items-center gap-3')
            span(class='badge-status-pending')
              | {{ getOrderStatusBadge(order.order_status).label }}
            
            router-link(class='btn-outline px-3.5 py-1.5 text-fine', :to='{ name: "track-order", query: { orderNumber: order.order_number, contact: order.customer_email || order.customer_phone } }') Track Shipment 📦

        div(v-if='order.tracking_number || order.courier_name', class='p-5 bg-page-alt border border-soft')
          h3(class='label-ink mb-2.5') Carrier & Delivery Tracking
          div(class='grid grid-cols-1 sm:grid-cols-3 gap-4 text-cap')
            div
              span(class='label-muted') Carrier:
              p(class='font-bold text-ink') {{ order.courier_name || 'Standard Courier' }}
            div
              span(class='label-muted') AWB Tracking No:
              p(class='font-mono font-bold text-ink') {{ order.tracking_number }}
            div(v-if='order.tracking_url')
              a(class='label-ink underline inline-flex items-center gap-1', :href='order.tracking_url', target='_blank', rel='noopener noreferrer')
                span Open Carrier Tracking ↗

        div(class='space-y-4')
          h3(class='label-ink') Items in this Order
          div(class='divide-y divide-soft')
            div(v-for='item in (order.items || [])', :key='item.id', class='py-4 flex items-center justify-between gap-4')
              div(class='flex items-center gap-4')
                div(class='w-16 h-20 bg-surface border border-soft flex items-center justify-center p-1 overflow-hidden shrink-0')
                  img(class='h-full w-full object-cover', :src='item.primary_image_url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=150&q=80"', :alt='item.product_name')
                div
                  h4(class='text-cap font-semibold text-ink') {{ item.product_name }}
                  p(v-if='item.variant_name', class='text-fine text-muted uppercase tracking-editorial') Variant: {{ item.variant_name }}
                  p(class='text-fine text-muted uppercase tracking-editorial') Qty: {{ item.quantity }} × {{ formatPrice(item.unit_price_paisa) }}
              
              span(class='text-cap font-bold text-ink')
                | {{ formatPrice(item.unit_price_paisa * item.quantity) }}

        div(class='grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-soft pt-6 text-cap')
          div(class='space-y-1.5')
            h3(class='label-muted mb-2') Delivery Address
            p(class='font-bold text-ink') {{ order.customer_name }}
            p(class='text-soft') {{ order.shipping_address?.addressLine1 }}
            p(v-if='order.shipping_address?.addressLine2', class='text-soft') {{ order.shipping_address?.addressLine2 }}
            p(class='text-soft') {{ order.shipping_address?.city }}, {{ order.shipping_address?.state }} – {{ order.shipping_address?.pincode }}
            p(class='text-fine text-muted pt-1') Phone: {{ order.customer_phone }}

          div(class='space-y-2')
            h3(class='label-muted mb-2') Payment Summary
            div(class='space-y-1.5 text-soft uppercase tracking-editorial text-fine')
              div(class='flex justify-between')
                span Method
                span(class='font-bold text-ink') {{ order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment' }}
              div(class='flex justify-between')
                span Status
                span(class='font-bold capitalize text-ink') {{ order.payment_status }}
              div(class='flex justify-between')
                span Subtotal
                span(class='font-bold text-ink') {{ formatPrice(order.subtotal_amount_paisa) }}
              div(v-if='order.discount_amount_paisa > 0', class='flex justify-between text-ink')
                span Discount Savings
                span(class='font-bold') -{{ formatPrice(order.discount_amount_paisa) }}
              div(class='flex justify-between')
                span Delivery Fee
                span(class='font-bold text-ink') {{ order.shipping_fee_paisa === 0 ? 'FREE' : formatPrice(order.shipping_fee_paisa) }}
              div(class='flex justify-between text-body-sm font-bold text-ink pt-2 border-t border-soft')
                span Total Paid
                span {{ formatPrice(order.total_amount_paisa) }}
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import StoreLayout from '@/components/StoreLayout.vue';
import { formatPrice, formatDate, getOrderStatusBadge, api } from '@/helpers';

const route = useRoute();
const order = ref(null);

onMounted(async () => {
  try {
    const res = await api.get(`/orders/${route.params.id}`);
    if (res.success && res.data?.order) {
      order.value = res.data.order;
    }
  } catch {}
});
</script>
