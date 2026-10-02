<template lang="pug">
StoreLayout
  div(v-if='order', class='bg-slate-50 min-h-screen py-10 sm:py-14')
    div(class='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6')
      div
        router-link(class='text-teal-700 hover:text-teal-800 text-xs font-semibold inline-flex items-center gap-1', to='/account/orders')
          span ‹ Back to Order History

      div(class='p-6 sm:p-10 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-8')
        div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6')
          div
            span(class='text-2xs font-semibold text-slate-400 uppercase tracking-wider') Order Reference
            h1(class='text-2xl font-bold text-slate-900 font-mono') {{ order.order_number }}
            p(class='text-xs text-slate-500 mt-0.5') Placed on {{ formatDate(order.created_at, true) }}
          
          div(class='flex items-center gap-3')
            span(
              class='text-xs px-3.5 py-1 rounded-full font-semibold border',
              :class='getOrderStatusBadge(order.order_status).bg'
            ) {{ getOrderStatusBadge(order.order_status).label }}
            
            router-link(
              class='px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors',
              :to='{ name: "track-order", query: { orderNumber: order.order_number, contact: order.customer_email || order.customer_phone } }'
            ) Track Shipment 📦

        div(v-if='order.tracking_number || order.courier_name', class='p-5 bg-slate-50 rounded-xl border border-slate-200')
          h3(class='text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5') Carrier & Delivery Tracking
          div(class='grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs')
            div
              span(class='text-slate-400') Carrier:
              p(class='font-bold text-slate-900') {{ order.courier_name || 'Standard Courier' }}
            div
              span(class='text-slate-400') AWB Tracking No:
              p(class='font-mono font-bold text-slate-900') {{ order.tracking_number }}
            div(v-if='order.tracking_url')
              a(class='text-teal-700 hover:text-teal-800 font-bold text-xs inline-flex items-center gap-1', :href='order.tracking_url', target='_blank', rel='noopener noreferrer')
                span Open Carrier Tracking ↗

        div(class='space-y-4')
          h3(class='text-xs font-bold text-slate-900 uppercase tracking-wider') Items in this Order
          div(class='divide-y divide-slate-100')
            div(
              v-for='item in (order.items || [])',
              :key='item.id',
              class='py-4 flex items-center justify-between gap-4'
            )
              div(class='flex items-center gap-4')
                div(class='w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 overflow-hidden shrink-0')
                  img(
                    class='max-h-full max-w-full object-contain',
                    :src='item.primary_image_url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=150&q=80"',
                    :alt='item.product_name'
                  )
                div
                  h4(class='text-xs font-semibold text-slate-900') {{ item.product_name }}
                  p(v-if='item.variant_name', class='text-2xs text-slate-500') Variant: {{ item.variant_name }}
                  p(class='text-2xs text-slate-400') Qty: {{ item.quantity }} × {{ formatPrice(item.unit_price_paisa) }}
              
              span(class='text-xs font-bold text-slate-900')
                | {{ formatPrice(item.unit_price_paisa * item.quantity) }}

        div(class='grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-slate-100 pt-6 text-xs')
          div(class='space-y-1.5')
            h3(class='text-2xs font-semibold text-slate-400 uppercase tracking-wider mb-2') Delivery Address
            p(class='font-bold text-slate-900') {{ order.customer_name }}
            p(class='text-slate-600') {{ order.shipping_address?.addressLine1 }}
            p(v-if='order.shipping_address?.addressLine2', class='text-slate-600') {{ order.shipping_address?.addressLine2 }}
            p(class='text-slate-600') {{ order.shipping_address?.city }}, {{ order.shipping_address?.state }} – {{ order.shipping_address?.pincode }}
            p(class='text-slate-400 pt-1') Phone: {{ order.customer_phone }}

          div(class='space-y-2')
            h3(class='text-2xs font-semibold text-slate-400 uppercase tracking-wider mb-2') Payment Summary
            div(class='space-y-1.5 text-slate-600')
              div(class='flex justify-between')
                span Method
                span(class='font-medium text-slate-900') {{ order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment' }}
              div(class='flex justify-between')
                span Status
                span(class='font-medium capitalize text-teal-700') {{ order.payment_status }}
              div(class='flex justify-between')
                span Subtotal
                span(class='font-medium') {{ formatPrice(order.subtotal_amount_paisa) }}
              div(v-if='order.discount_amount_paisa > 0', class='flex justify-between text-teal-700')
                span Discount Savings
                span(class='font-semibold') -{{ formatPrice(order.discount_amount_paisa) }}
              div(class='flex justify-between')
                span Delivery Fee
                span(class='font-medium') {{ order.shipping_fee_paisa === 0 ? 'FREE' : formatPrice(order.shipping_fee_paisa) }}
              div(class='flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100')
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
