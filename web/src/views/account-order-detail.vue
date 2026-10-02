<template lang="pug">
StoreLayout
  div(v-if='order', class='bg-[#f5f5f7] min-h-screen py-10 sm:py-14')
    div(class='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6')
      // Back Link
      div
        router-link(class='apple-link text-xs', to='/account/orders')
          span ‹ Back to Order History

      // Main Order Card
      div(class='apple-card p-6 sm:p-10 bg-white space-y-8')
        // Order Header
        div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-6')
          div
            span(class='text-2xs font-semibold text-[#86868b] uppercase tracking-wider') Order Reference
            h1(class='text-2xl font-bold text-[#1d1d1f] font-mono') {{ order.order_number }}
            p(class='text-xs text-[#6e6e73] mt-0.5') Placed on {{ formatDate(order.created_at, true) }}
          
          div(class='flex items-center gap-3')
            span(
              class='text-xs px-3.5 py-1 rounded-full font-semibold border',
              :class='getOrderStatusBadge(order.order_status).bg'
            ) {{ getOrderStatusBadge(order.order_status).label }}
            
            router-link(
              class='apple-btn-secondary text-xs px-3.5 py-1.5',
              :to='{ name: "track-order", query: { orderNumber: order.order_number, contact: order.customer_email || order.customer_phone } }'
            ) Track Shipment 📦

        // Courier details (if available)
        div(v-if='order.tracking_number || order.courier_name', class='apple-card p-5 bg-[#f5f5f7] border border-[#e5e5ea]')
          h3(class='text-xs font-bold text-[#1d1d1f] uppercase tracking-wider mb-2.5') Carrier & Delivery Tracking
          div(class='grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs')
            div
              span(class='text-[#86868b]') Carrier:
              p(class='font-bold text-[#1d1d1f]') {{ order.courier_name || 'Standard Courier' }}
            div
              span(class='text-[#86868b]') AWB Tracking No:
              p(class='font-mono font-bold text-[#1d1d1f]') {{ order.tracking_number }}
            div(v-if='order.tracking_url')
              a(class='apple-link font-bold text-xs', :href='order.tracking_url', target='_blank', rel='noopener noreferrer')
                span Open Carrier Tracking ↗

        // Items List
        div(class='space-y-4')
          h3(class='text-xs font-bold text-[#1d1d1f] uppercase tracking-wider') Items in this Order
          div(class='divide-y divide-[#f5f5f7]')
            div(
              v-for='item in (order.items || [])',
              :key='item.id',
              class='py-4 flex items-center justify-between gap-4'
            )
              div(class='flex items-center gap-4')
                div(class='w-16 h-16 rounded-2xl bg-[#f5f5f7] flex items-center justify-center p-1.5 overflow-hidden shrink-0')
                  img(
                    class='max-h-full max-w-full object-contain',
                    :src='item.primary_image_url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=150&q=80"',
                    :alt='item.product_name'
                  )
                div
                  h4(class='text-xs font-semibold text-[#1d1d1f]') {{ item.product_name }}
                  p(v-if='item.variant_name', class='text-2xs text-[#6e6e73]') Variant: {{ item.variant_name }}
                  p(class='text-2xs text-[#86868b]') Qty: {{ item.quantity }} × {{ formatPrice(item.unit_price_paisa) }}
              
              span(class='text-xs font-bold text-[#1d1d1f]')
                | {{ formatPrice(item.unit_price_paisa * item.quantity) }}

        // Summary Breakdown & Address
        div(class='grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-[#e5e5ea] pt-6 text-xs')
          div(class='space-y-1.5')
            h3(class='text-2xs font-semibold text-[#86868b] uppercase tracking-wider mb-2') Delivery Address
            p(class='font-bold text-[#1d1d1f]') {{ order.customer_name }}
            p(class='text-[#6e6e73]') {{ order.shipping_address?.addressLine1 }}
            p(v-if='order.shipping_address?.addressLine2', class='text-[#6e6e73]') {{ order.shipping_address?.addressLine2 }}
            p(class='text-[#6e6e73]') {{ order.shipping_address?.city }}, {{ order.shipping_address?.state }} – {{ order.shipping_address?.pincode }}
            p(class='text-[#86868b] pt-1') Phone: {{ order.customer_phone }}

          div(class='space-y-2')
            h3(class='text-2xs font-semibold text-[#86868b] uppercase tracking-wider mb-2') Payment Summary
            div(class='space-y-1.5 text-[#6e6e73]')
              div(class='flex justify-between')
                span Method
                span(class='font-medium text-[#1d1d1f]') {{ order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment' }}
              div(class='flex justify-between')
                span Status
                span(class='font-medium capitalize text-[#1b7a3a]') {{ order.payment_status }}
              div(class='flex justify-between')
                span Subtotal
                span(class='font-medium') {{ formatPrice(order.subtotal_amount_paisa) }}
              div(v-if='order.discount_amount_paisa > 0', class='flex justify-between text-[#1b7a3a]')
                span Discount Savings
                span(class='font-semibold') -{{ formatPrice(order.discount_amount_paisa) }}
              div(class='flex justify-between')
                span Delivery Fee
                span(class='font-medium') {{ order.shipping_fee_paisa === 0 ? 'FREE' : formatPrice(order.shipping_fee_paisa) }}
              div(class='flex justify-between text-base font-bold text-[#1d1d1f] pt-2 border-t border-[#e5e5ea]')
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
