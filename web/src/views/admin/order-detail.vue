<template lang="pug">
AdminLayout
  div(v-if='order', class='space-y-8')
    div(class='flex flex-col justify-between gap-4 sm:flex-row sm:items-center')
      div(class='flex items-center gap-3')
        router-link(
          class='p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
          to='/admin/orders',
          title='Back to Orders'
        ) ←
        div
          div(class='flex items-center gap-2')
            h1(class='text-2xl font-black text-slate-900') {{ order.order_number }}
            span(
              class='text-xs font-bold rounded-full px-2.5 py-0.5',
              :class='getStatusBadgeClass(order.order_status)'
            ) {{ order.order_status }}
          p(class='text-2xs text-slate-400') Placed on {{ formatDate(order.created_at, true) }}

      div(class='flex items-center gap-2')
        button(
          class='px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50',
          @click='getOrder'
        ) 🔄 Refresh
        a(
          class='px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800',
          :href='`/track-order?orderNumber=${order.order_number}&contact=${order.customer_phone || order.customer_email}`',
          target='_blank'
        ) 🔍 View Tracking Page ↗

    div(class='bg-white rounded-3xl border-2 border-amber-300 p-6 shadow-sm')
      div(class='flex items-center justify-between border-b border-slate-100 pb-4 mb-6')
        div(class='flex items-center gap-2')
          span(class='text-2xl') ⚡
          div
            h2(class='text-base font-black text-slate-900') {{ $brandName }} Fulfillment Station
            p(class='text-xs text-slate-500') Low-click workflow to copy details, place with supplier, and record tracking.
        
        div(class='flex items-center gap-2')
          span(class='text-xs font-bold text-slate-500') Fulfillment:
          span(
            class='text-xs font-black py-1 px-2.5 rounded-full',
            :class='getFulfillmentBadgeClass(order.fulfillment_status)'
          ) {{ order.fulfillment_status }}

      div(class='grid grid-cols-1 gap-6 lg:grid-cols-3')
        div(class='bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between')
          div
            div(class='flex items-center justify-between mb-3')
              span(class='text-2xs font-black text-slate-400 uppercase') STEP 1: CUSTOMER DETAILS
              span(class='text-xs') 📋
            
            div(class='space-y-1 text-xs text-slate-800 font-medium')
              p
                strong(class='font-bold') Name: 
                | {{ order.customer_name }}
              p
                strong(class='font-bold') Phone: 
                | {{ order.customer_phone }}
              p
                strong(class='font-bold') Address: 
                | {{ order.shipping_house_street }}
              p(v-if='order.shipping_area')
                strong(class='font-bold') Area: 
                | {{ order.shipping_area }}
              p(v-if='order.shipping_landmark')
                strong(class='font-bold') Landmark: 
                | {{ order.shipping_landmark }}
              p
                strong(class='font-bold') City/State: 
                | {{ order.shipping_city }}, {{ order.shipping_state }}
              p
                strong(class='font-bold') PIN Code: 
                span(class='font-mono font-black text-slate-950') {{ order.shipping_pincode }}

          div(class='pt-4 mt-4 border-t border-slate-200')
            button(
              class='w-full rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors py-2.5 hover:bg-slate-800',
              @click='copyCustomerAddress'
            )
              span(v-if='!copiedAddress') 📋 Copy Details For Meesho / Supplier
              span(v-else, class='text-amber-400') ✅ Copied to Clipboard!

        div(class='bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between')
          div
            div(class='flex items-center justify-between mb-3')
              span(class='text-2xs font-black text-slate-400 uppercase') STEP 2: SUPPLIER PLACEMENT
              span(class='text-xs') 🛒
            
            p(class='text-xs text-slate-600 mb-3')
              | Open each supplier product link, order with copied customer address, then save the supplier reference.

            div(v-if='order.items && order.items.length > 0', class='space-y-2 mb-4')
              div(
                v-for='item in order.items',
                :key='item.id',
                class='p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between'
              )
                div(class='truncate pr-2')
                  p(class='text-2xs font-bold text-slate-900 truncate') {{ item.product_title }}
                  p(class='text-2xs text-slate-400') Qty: {{ item.quantity }} • SKU: {{ item.sku || 'N/A' }}
                a(
                  v-if='item.supplier_url',
                  class='px-2 py-1 rounded bg-amber-100 text-amber-900 text-2xs font-bold whitespace-nowrap hover:bg-amber-200',
                  :href='item.supplier_url',
                  target='_blank'
                ) Open Supplier ↗

            div
              label(class='block text-2xs font-bold text-slate-700 mb-1') Supplier Order ID (Meesho #)
              input(
                class='w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white font-mono',
                type='text',
                v-model='supplierOrderId',
                placeholder='e.g. MSH-984729482'
              )

          div(class='pt-4 mt-4 border-t border-slate-200')
            button(
              class='w-full rounded-xl bg-blue-600 text-white text-xs font-bold transition-colors py-2.5 hover:bg-blue-700',
              @click='recordSupplierOrder',
              :disabled='isSubmittingSupplier'
            )
              span(v-if='!isSubmittingSupplier') Record Supplier Order Placed 🛒
              span(v-else) Saving...

        div(class='bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between')
          div
            div(class='flex items-center justify-between mb-3')
              span(class='text-2xs font-black text-slate-400 uppercase') STEP 3: SHIPPING & TRACKING
              span(class='text-xs') 🚚
            
            div(class='space-y-2')
              div
                label(class='block text-2xs font-bold text-slate-700 mb-1') Courier / Logistics Partner
                select(
                  class='w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white',
                  v-model='courierName'
                )
                  option(value='') Select Courier
                  option(value='Delhivery') Delhivery
                  option(value='BlueDart') BlueDart
                  option(value='Ekart') Ekart Logistics
                  option(value='Shadowfax') Shadowfax
                  option(value='DTDC') DTDC
                  option(value='XpressBees') XpressBees
                  option(value='India Post Speed Post') India Post (Speed Post)
                  option(value='Other') Other Courier

              div
                label(class='block text-2xs font-bold text-slate-700 mb-1') Tracking / AWB Number
                input(
                  class='w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-mono',
                  type='text',
                  v-model='trackingNumber',
                  placeholder='e.g. DEL123456789'
                )

              div
                label(class='block text-2xs font-bold text-slate-700 mb-1') Tracking URL (Optional)
                input(
                  class='w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white',
                  type='url',
                  v-model='trackingUrl',
                  placeholder='https://...'
                )

          div(class='pt-4 mt-4 border-t border-slate-200')
            button(
              class='w-full rounded-xl bg-emerald-600 text-white text-xs font-bold transition-colors py-2.5 hover:bg-emerald-700',
              @click='saveTrackingInfo',
              :disabled='isSubmittingTracking'
            )
              span(v-if='!isSubmittingTracking') Mark Shipped & Notify Customer 🚀
              span(v-else) Updating...

    div(class='grid grid-cols-1 gap-8 lg:grid-cols-3')
      div(class='space-y-6 lg:col-span-2')
        div(class='bg-white rounded-2xl border border-slate-200 shadow-2xs p-6')
          h2(class='text-base font-extrabold text-slate-900 mb-4') Ordered Products ({{ order.items?.length || 0 }})
          div(class='divide-y divide-slate-100')
            div(
              v-for='item in order.items',
              :key='item.id',
              class='py-4 flex items-center justify-between gap-4'
            )
              div(class='flex items-center gap-4')
                img(
                  class='w-14 h-14 rounded-xl object-cover bg-slate-50 border border-slate-100',
                  :src='item.image_url || "/placeholder.png"',
                  :alt='item.product_title'
                )
                div
                  h3(class='text-xs font-extrabold text-slate-900') {{ item.product_title }}
                  p(v-if='item.variant_title', class='text-2xs text-slate-500') Variant: {{ item.variant_title }}
                  p(class='text-2xs text-slate-400') SKU: {{ item.sku || 'N/A' }}
                  p(class='text-2xs text-slate-500') Qty: {{ item.quantity }} × {{ formatPrice(item.unit_price_paisa) }}
              
              div(class='text-right')
                span(class='text-xs font-black text-slate-900') {{ formatPrice(item.total_price_paisa) }}
                div(v-if='item.supplier_url')
                  a(
                    class='text-2xs text-blue-600 font-semibold hover:underline',
                    :href='item.supplier_url',
                    target='_blank'
                  ) Supplier Link ↗

        div(class='bg-white rounded-2xl border border-slate-200 shadow-2xs p-6')
          h2(class='text-base font-extrabold text-slate-900 mb-3') Internal Admin Notes
          p(class='text-xs text-slate-500 mb-4') Notes recorded here are private to the store team.
          textarea(
            class='w-full rounded-xl border border-slate-200 text-xs bg-slate-50 px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900',
            rows='3',
            v-model='adminNote',
            placeholder='Add notes about customer communication, special instructions, or supplier updates...'
          )
          div(class='mt-3 flex justify-end')
            button(
              class='px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800',
              @click='saveAdminNote',
              :disabled='isSavingNote'
            )
              span(v-if='!isSavingNote') Save Note
              span(v-else) Saving...

      div(class='space-y-6')
        div(class='bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4')
          h2(class='text-base font-extrabold text-slate-900') Order Controls
          
          div
            label(class='block text-xs font-bold text-slate-700 mb-1') Order Status
            select(
              class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold',
              v-model='orderStatus',
              @change='updateStatus("order_status", orderStatus)'
            )
              option(value='pending') Pending
              option(value='confirmed') Confirmed
              option(value='processing') Processing
              option(value='shipped') Shipped
              option(value='delivered') Delivered
              option(value='cancelled') Cancelled
              option(value='refunded') Refunded

          div
            label(class='block text-xs font-bold text-slate-700 mb-1') Payment Status
            select(
              class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold',
              v-model='paymentStatus',
              @change='updateStatus("payment_status", paymentStatus)'
            )
              option(value='pending') Pending (e.g. COD)
              option(value='paid') Paid
              option(value='failed') Failed
              option(value='refunded') Refunded

        div(class='bg-white rounded-2xl border border-slate-200 shadow-2xs p-6')
          h2(class='text-base font-extrabold text-slate-900 mb-4') Payment Breakdown
          div(class='space-y-2 text-xs text-slate-600')
            div(class='flex justify-between')
              span Subtotal
              span(class='font-semibold') {{ formatPrice(order.subtotal_paisa) }}
            div(v-if='order.discount_paisa > 0', class='flex justify-between')
              span Coupon Discount
              span(class='text-emerald-600 font-semibold') -{{ formatPrice(order.discount_paisa) }}
            div(class='flex justify-between')
              span Shipping
              span(class='font-semibold') {{ order.shipping_fee_paisa > 0 ? formatPrice(order.shipping_fee_paisa) : 'FREE' }}
            div(v-if='order.cod_charge_paisa > 0', class='flex justify-between')
              span COD Handling
              span(class='font-semibold') {{ formatPrice(order.cod_charge_paisa) }}
            div(class='flex justify-between pt-3 border-t border-slate-200 text-sm font-black text-slate-900')
              span Total Charged
              span {{ formatPrice(order.total_amount_paisa) }}

          div(class='mt-4 pt-4 border-t border-slate-100 space-y-1 text-2xs text-slate-500')
            p Payment Method: 
              strong(class='text-slate-800 uppercase') {{ order.payment_method }}
            p(v-if='order.razorpay_payment_id') Razorpay ID: 
              span(class='font-mono text-slate-700') {{ order.razorpay_payment_id }}

        div(class='bg-white rounded-2xl border border-slate-200 shadow-2xs p-6')
          h2(class='text-base font-extrabold text-slate-900 mb-3') Customer Details
          div(class='space-y-1 text-xs text-slate-700')
            p(class='font-bold text-slate-900') {{ order.customer_name }}
            p {{ order.customer_phone }}
            p(v-if='order.customer_email') {{ order.customer_email }}
            p(class='text-2xs text-slate-400 pt-2') Customer IP: {{ order.ip_address || 'Not recorded' }}

  div(v-else-if='isLoading', class='py-20 text-center text-xs text-slate-400')
    | Loading order details...

  div(v-else, class='py-20 text-center text-slate-400')
    | Order not found.
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AdminLayout from '@/components/AdminLayout.vue';
import { mainStore } from '@/store';
import { api, formatPrice, formatDate } from '@/helpers';

const route = useRoute();

const order = ref(null);
const isLoading = ref(true);

const copiedAddress = ref(false);
const supplierOrderId = ref('');
const isSubmittingSupplier = ref(false);

const courierName = ref('');
const trackingNumber = ref('');
const trackingUrl = ref('');
const isSubmittingTracking = ref(false);

const orderStatus = ref('pending');
const paymentStatus = ref('pending');
const adminNote = ref('');
const isSavingNote = ref(false);

function getStatusBadgeClass(status) {
  if (status === 'delivered') {
    return 'bg-emerald-100 text-emerald-800';
  }
  if (status === 'shipped') {
    return 'bg-purple-100 text-purple-800';
  }
  if (status === 'processing' || status === 'confirmed') {
    return 'bg-blue-100 text-blue-800';
  }
  if (status === 'cancelled' || status === 'refunded') {
    return 'bg-rose-100 text-rose-800';
  }
  return 'bg-amber-100 text-amber-800';
}

function getFulfillmentBadgeClass(status) {
  if (status === 'delivered') {
    return 'bg-emerald-100 text-emerald-800';
  }
  if (status === 'shipped') {
    return 'bg-purple-100 text-purple-800';
  }
  if (status === 'supplier_ordered') {
    return 'bg-blue-100 text-blue-800';
  }
  return 'bg-amber-100 text-amber-900 border border-amber-300';
}

async function copyCustomerAddress() {
  if (!order.value) {
    return;
  }
  const text = [
    `Name: ${order.value.customer_name}`,
    `Phone: ${order.value.customer_phone}`,
    `Address: ${order.value.shipping_house_street}`,
    order.value.shipping_area ? `Area: ${order.value.shipping_area}` : '',
    order.value.shipping_landmark ? `Landmark: ${order.value.shipping_landmark}` : '',
    `City: ${order.value.shipping_city}`,
    `State: ${order.value.shipping_state}`,
    `PIN: ${order.value.shipping_pincode}`,
  ].filter(Boolean).join('\n');

  try {
    await navigator.clipboard.writeText(text);
    copiedAddress.value = true;
    mainStore().toast('Customer details copied to clipboard!', 'success');
    setTimeout(() => {
      copiedAddress.value = false;
    }, 3000);
  } catch {
    mainStore().toast('Please copy manually', 'info');
  }
}

async function recordSupplierOrder() {
  if (!supplierOrderId.value.trim()) {
    mainStore().toast('Please enter the supplier order ID', 'error');
    return;
  }
  isSubmittingSupplier.value = true;
  try {
    const res = await api.post(`/admin/orders/${order.value.id}/supplier-order`, {
      supplierOrderId: supplierOrderId.value.trim(),
    });
    if (res.success) {
      mainStore().toast('Supplier order recorded!', 'success');
      await getOrder();
    }
  } catch (err) {
    mainStore().toast(err.message || 'Failed to record supplier order', 'error');
  } finally {
    isSubmittingSupplier.value = false;
  }
}

async function saveTrackingInfo() {
  if (!trackingNumber.value.trim()) {
    mainStore().toast('Please enter tracking number', 'error');
    return;
  }
  isSubmittingTracking.value = true;
  try {
    const res = await api.patch(`/admin/orders/${order.value.id}/tracking`, {
      courierName: courierName.value,
      trackingNumber: trackingNumber.value.trim(),
      trackingUrl: trackingUrl.value.trim() || undefined,
    });
    if (res.success) {
      await api.patch(`/admin/orders/${order.value.id}/status`, {
        statusType: 'fulfillment_status',
        newStatus: 'shipped',
      });
      mainStore().toast('Tracking saved & marked as shipped!', 'success');
      await getOrder();
    }
  } catch (err) {
    mainStore().toast(err.message || 'Failed to update tracking', 'error');
  } finally {
    isSubmittingTracking.value = false;
  }
}

async function updateStatus(statusType, newStatus) {
  try {
    const res = await api.patch(`/admin/orders/${order.value.id}/status`, {
      statusType,
      newStatus,
    });
    if (res.success) {
      mainStore().toast(`Updated ${statusType} to ${newStatus}`, 'success');
      await getOrder();
    }
  } catch (err) {
    mainStore().toast(err.message || 'Failed to update status', 'error');
  }
}

async function saveAdminNote() {
  isSavingNote.value = true;
  try {
    const res = await api.patch(`/admin/orders/${order.value.id}/note`, {
      adminNote: adminNote.value,
    });
    if (res.success) {
      mainStore().toast('Note saved', 'success');
    }
  } catch (err) {
    mainStore().toast(err.message || 'Failed to save note', 'error');
  } finally {
    isSavingNote.value = false;
  }
}

async function getOrder() {
  isLoading.value = true;
  try {
    const res = await api.get(`/admin/orders/${route.params.id}`);
    if (res.success && res.data) {
      order.value = res.data.order;
      orderStatus.value = res.data.order.order_status;
      paymentStatus.value = res.data.order.payment_status;
      adminNote.value = res.data.order.admin_note || '';
      supplierOrderId.value = res.data.order.supplier_order_id || '';
      courierName.value = res.data.order.courier_name || '';
      trackingNumber.value = res.data.order.tracking_number || '';
      trackingUrl.value = res.data.order.tracking_url || '';
    }
  } catch {
    order.value = null;
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getOrder();
});
</script>
