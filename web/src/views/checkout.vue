<template lang="pug">
StoreLayout
  div(class='bg-page min-h-screen py-10 sm:py-14')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      div(class='border-b border-soft pb-4')
        h1(class='heading-lg text-ink') Express Checkout
        p(class='text-fine text-muted uppercase tracking-editorial mt-1')
          | Fast, encrypted checkout with instant nationwide dispatch.

      div(class='grid grid-cols-1 gap-10 lg:grid-cols-12 items-start')
        div(class='space-y-6 lg:col-span-7')
          div(class='panel-editorial p-6 sm:p-8 space-y-5')
            div(class='flex items-center gap-3')
              span(class='step-badge') 1
              h2(class='heading-sm text-ink') Contact Information
            
            div(class='grid grid-cols-1 gap-4 sm:grid-cols-2')
              div(class='sm:col-span-2 space-y-1')
                label(class='label-ink block') Full Name *
                input(class='input-base', type='text', placeholder='Enter your full name', v-model='form.customerName', required)
              div(class='space-y-1')
                label(class='label-ink block') Mobile Phone * (for delivery SMS)
                input(class='input-base', type='tel', placeholder='10-digit mobile number', maxlength='10', v-model='form.customerPhone', required)
              div(class='space-y-1')
                label(class='label-ink block') Email Address (for order receipts)
                input(class='input-base', type='email', placeholder='name@example.com', v-model='form.customerEmail')

          div(class='panel-editorial p-6 sm:p-8 space-y-5')
            div(class='flex items-center gap-3')
              span(class='step-badge') 2
              h2(class='heading-sm text-ink') Shipping Address
            
            div(class='grid grid-cols-1 gap-4 sm:grid-cols-2')
              div(class='sm:col-span-2 space-y-1')
                label(class='label-ink block') House No., Building, Street *
                input(class='input-base', type='text', placeholder='Flat / Door no., Apartment / Street', v-model='form.addressLine1', required)
              div(class='sm:col-span-2 space-y-1')
                label(class='label-ink block') Area / Colony / Landmark (Optional)
                input(class='input-base', type='text', placeholder='Nearby landmark or locality', v-model='form.addressLine2')
              div(class='space-y-1')
                label(class='label-ink block') 6-Digit PIN Code *
                input(class='input-base', type='text', placeholder='6-digit pincode', maxlength='6', v-model='form.pincode', required)
              div(class='space-y-1')
                label(class='label-ink block') City / Town *
                input(class='input-base', type='text', placeholder='City or town', v-model='form.city', required)
              div(class='space-y-1')
                label(class='label-ink block') State *
                input(class='input-base', type='text', placeholder='State', v-model='form.state', required)
              div(class='space-y-1')
                label(class='label-ink block') Country
                input(class='input-base bg-surface text-muted cursor-not-allowed', type='text', v-model='form.country', disabled)

          div(class='panel-editorial p-6 sm:p-8 space-y-5')
            div(class='flex items-center gap-3')
              span(class='step-badge') 3
              h2(class='heading-sm text-ink') Payment Method
            
            div(class='grid grid-cols-1 sm:grid-cols-2 gap-3')
              div(class='p-4 border cursor-pointer transition-all', :class='form.paymentMethod === "razorpay" ? "border-ink bg-surface" : "border-soft bg-white hover:border-ink"', @click='form.paymentMethod = "razorpay"')
                div(class='flex items-center justify-between mb-2')
                  span(class='heading-xs text-ink') Online Payment
                  span(v-if='form.paymentMethod === "razorpay"', class='text-ink font-bold text-xs') ●
                  span(v-else, class='text-muted text-xs') ○
                p(class='text-fine text-muted uppercase tracking-editorial') UPI, Cards, NetBanking, EMI
                span(class='badge-status-pending mt-2') Recommended

              div(v-if='mainStore().codEnabled', class='p-4 border cursor-pointer transition-all', :class='form.paymentMethod === "cod" ? "border-ink bg-surface" : "border-soft bg-white hover:border-ink"', @click='form.paymentMethod = "cod"')
                div(class='flex items-center justify-between mb-2')
                  span(class='heading-xs text-ink') Cash on Delivery
                  span(v-if='form.paymentMethod === "cod"', class='text-ink font-bold text-xs') ●
                  span(v-else, class='text-muted text-xs') ○
                p(class='text-fine text-muted uppercase tracking-editorial') Pay cash or UPI upon delivery
                span(class='badge-status-pending mt-2') Verified Indian Addresses

        div(class='space-y-5 lg:col-span-5')
          div(class='panel-editorial p-6 space-y-5')
            h2(class='heading-sm text-ink') Order Summary ({{ mainStore().totalItemsCount }})

            div(class='divide-y divide-soft max-h-80 overflow-y-auto pr-1')
              div(v-for='item in mainStore().items', :key='item.id', class='py-3 flex items-center justify-between gap-3')
                div(class='flex items-center gap-3 min-w-0')
                  div(class='w-14 h-16 bg-surface border border-soft flex items-center justify-center p-1 shrink-0 overflow-hidden')
                    img(class='h-full w-full object-cover', :src='item.product?.primary_image_url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=150&q=80"', :alt='item.product?.name')
                  div(class='min-w-0')
                    h4(class='text-cap font-semibold text-ink line-clamp-1') {{ item.product?.name }}
                    p(class='text-fine text-muted uppercase tracking-editorial') Qty: {{ item.quantity }}
                
                span(class='text-cap font-bold text-ink shrink-0')
                  | {{ formatPrice(item.price * item.quantity) }}

            div(class='space-y-2 pt-3 border-t border-soft text-cap text-muted uppercase tracking-editorial')
              div(class='flex justify-between')
                span Subtotal
                span(class='text-ink font-semibold') {{ formatPrice(mainStore().subtotalPaisa) }}
              div(v-if='mainStore().discountPaisa > 0', class='flex justify-between text-ink font-semibold')
                span Coupon Savings
                span −{{ formatPrice(mainStore().discountPaisa) }}
              div(class='flex justify-between')
                span Shipping
                span(v-if='mainStore().shippingPaisa === 0', class='text-ink font-bold') FREE
                span(v-else, class='text-ink font-semibold') {{ formatPrice(mainStore().shippingPaisa) }}
              div(class='flex justify-between text-body-sm font-bold text-ink pt-3 border-t border-soft')
                span Total Amount
                span {{ formatPrice(mainStore().totalPaisa) }}

            button(class='btn-primary w-full py-4 text-center justify-center disabled:opacity-50', :disabled='isSubmitting', @click='handlePlaceOrder')
              span(v-if='isSubmitting') Processing Order...
              span(v-else-if='form.paymentMethod === "cod"') Confirm Cash on Delivery Order →
              span(v-else) Pay {{ formatPrice(mainStore().totalPaisa) }} Securely →

            div(class='p-3 bg-surface border border-soft text-center text-fine text-muted uppercase tracking-editorial')
              | 🔒 256-Bit SSL Encrypted Checkout · Instant Tracking SMS
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import StoreLayout from '@/components/StoreLayout.vue';
import { mainStore } from '@/store';
import { formatPrice, api } from '@/helpers';

const router = useRouter();
const isSubmitting = ref(false);

const form = ref({
  customerName: mainStore().customer?.name || '',
  customerEmail: mainStore().customer?.email || '',
  customerPhone: mainStore().customer?.phone || '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  paymentMethod: 'razorpay',
});

onMounted(() => {
  if (mainStore().items.length === 0) {
    mainStore().info('Your bag is empty. Add items before checking out.');
    router.push('/shop');
  }
});

async function handlePlaceOrder() {
  if (!form.value.customerName.trim() || !form.value.customerPhone.trim()) {
    mainStore().error('Please enter your full name and mobile phone number.');
    return;
  }

  if (form.value.customerPhone.replace(/[^0-9]/g, '').length !== 10) {
    mainStore().error('Please enter a valid 10-digit Indian mobile number.');
    return;
  }

  if (!form.value.addressLine1.trim() || !form.value.city.trim() || !form.value.state.trim() || !form.value.pincode.trim()) {
    mainStore().error('Please complete all required shipping address fields.');
    return;
  }

  if (form.value.pincode.replace(/[^0-9]/g, '').length !== 6) {
    mainStore().error('Please enter a valid 6-digit Indian PIN code.');
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      items: mainStore().items.map((it) => ({
        productId: it.productId || it.product?.id,
        variantId: it.variantId,
        quantity: it.quantity,
      })),
      customerName: form.value.customerName.trim(),
      customerEmail: form.value.customerEmail.trim() || undefined,
      customerPhone: form.value.customerPhone.trim(),
      shippingAddress: {
        addressLine1: form.value.addressLine1.trim(),
        addressLine2: form.value.addressLine2.trim() || undefined,
        city: form.value.city.trim(),
        state: form.value.state.trim(),
        pincode: form.value.pincode.trim(),
        country: 'India',
      },
      paymentMethod: form.value.paymentMethod,
      couponCode: mainStore().appliedCoupon?.code || undefined,
    };

    const res = await api.post('/checkout', payload);

    if (res.success && res.data) {
      const order = res.data.order;

      if (form.value.paymentMethod === 'cod') {
        mainStore().clearCart();
        mainStore().success('Order placed successfully!');
        router.push({ name: 'order-success', query: { orderId: order.id, orderNumber: order.order_number } });
        return;
      }

      await loadRazorpayScript();

      if (!window.Razorpay) {
        mainStore().success('Order created! Confirming payment...');
        await api.post('/payments/verify', {
          gatewayOrderId: res.data.gatewayOrderId,
          gatewayPaymentId: `pay_test_${dayjs().valueOf()}`,
          signature: 'dev_mock_signature',
        }).catch(() => {});
        mainStore().clearCart();
        router.push({ name: 'order-success', query: { orderId: order.id, orderNumber: order.order_number } });
        return;
      }

      const options = {
        key: res.data.keyId || 'rzp_test_placeholder',
        amount: order.total_amount_paisa,
        currency: 'INR',
        name: mainStore().brandName,
        description: `Order ${order.order_number}`,
        order_id: res.data.gatewayOrderId,
        prefill: {
          name: form.value.customerName,
          email: form.value.customerEmail,
          contact: form.value.customerPhone,
        },
        handler: async (paymentResponse) => {
          try {
            await api.post('/payments/verify', {
              gatewayOrderId: paymentResponse.razorpay_order_id,
              gatewayPaymentId: paymentResponse.razorpay_payment_id,
              signature: paymentResponse.razorpay_signature,
            });
            mainStore().clearCart();
            mainStore().success('Payment verified! Order confirmed.');
            router.push({ name: 'order-success', query: { orderId: order.id, orderNumber: order.order_number } });
          } catch (verifyError) {
            mainStore().error(verifyError.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            mainStore().info('Payment window was closed.');
            isSubmitting.value = false;
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    }
  } catch (error) {
    mainStore().error(error.message || 'Failed to place order');
  } finally {
    isSubmitting.value = false;
  }
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
</script>
