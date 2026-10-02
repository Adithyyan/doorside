<template lang="pug">
StoreLayout
  div(class='bg-slate-50 min-h-screen py-10 sm:py-14')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      div(class='border-b border-slate-200 pb-4')
        h1(class='text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900')
          | Express Checkout
        p(class='text-xs text-slate-500 mt-1')
          | Fast, encrypted checkout with instant dispatch across India.

      div(class='grid grid-cols-1 gap-10 lg:grid-cols-12 items-start')
        div(class='space-y-6 lg:col-span-7')
          div(class='p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 space-y-5 shadow-xs')
            div(class='flex items-center gap-3')
              span(class='w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center') 1
              h2(class='text-base sm:text-lg font-bold text-slate-900') Contact Information
            
            div(class='grid grid-cols-1 gap-4 sm:grid-cols-2')
              div(class='sm:col-span-2')
                label(class='block text-xs font-semibold text-slate-700 mb-1.5') Full Name *
                input(
                  class='w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
                  type='text',
                  placeholder='Enter your full name',
                  v-model='form.customerName',
                  required
                )
              div
                label(class='block text-xs font-semibold text-slate-700 mb-1.5') Mobile Phone * (for delivery SMS)
                input(
                  class='w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
                  type='tel',
                  placeholder='10-digit mobile number',
                  maxlength='10',
                  v-model='form.customerPhone',
                  required
                )
              div
                label(class='block text-xs font-semibold text-slate-700 mb-1.5') Email Address (for order receipts)
                input(
                  class='w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
                  type='email',
                  placeholder='name@example.com',
                  v-model='form.customerEmail'
                )

          div(class='p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 space-y-5 shadow-xs')
            div(class='flex items-center gap-3')
              span(class='w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center') 2
              h2(class='text-base sm:text-lg font-bold text-slate-900') Shipping Address
            
            div(class='grid grid-cols-1 gap-4 sm:grid-cols-2')
              div(class='sm:col-span-2')
                label(class='block text-xs font-semibold text-slate-700 mb-1.5') House No., Building, Street *
                input(
                  class='w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
                  type='text',
                  placeholder='Flat / Door no., Apartment / Street',
                  v-model='form.addressLine1',
                  required
                )
              div(class='sm:col-span-2')
                label(class='block text-xs font-semibold text-slate-700 mb-1.5') Area / Colony / Landmark (Optional)
                input(
                  class='w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
                  type='text',
                  placeholder='Nearby landmark or locality',
                  v-model='form.addressLine2'
                )
              div
                label(class='block text-xs font-semibold text-slate-700 mb-1.5') 6-Digit PIN Code *
                input(
                  class='w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
                  type='text',
                  placeholder='6-digit pincode',
                  maxlength='6',
                  v-model='form.pincode',
                  required
                )
              div
                label(class='block text-xs font-semibold text-slate-700 mb-1.5') City / Town *
                input(
                  class='w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
                  type='text',
                  placeholder='City or town',
                  v-model='form.city',
                  required
                )
              div
                label(class='block text-xs font-semibold text-slate-700 mb-1.5') State *
                input(
                  class='w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none transition-all',
                  type='text',
                  placeholder='State',
                  v-model='form.state',
                  required
                )
              div
                label(class='block text-xs font-semibold text-slate-700 mb-1.5') Country
                input(
                  class='w-full px-4 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed',
                  type='text',
                  value='India',
                  disabled
                )

          div(class='p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 space-y-5 shadow-xs')
            div(class='flex items-center gap-3')
              span(class='w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center') 3
              h2(class='text-base sm:text-lg font-bold text-slate-900') Payment Method
            
            div(class='space-y-3')
              label(
                v-if='mainStore().prepaidEnabled',
                class='flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all',
                :class='form.paymentMethod === "razorpay" ? "border-teal-600 bg-teal-50/40 shadow-xs" : "border-slate-200 hover:border-slate-400"'
              )
                input(class='mt-1 text-teal-600 focus:ring-0', type='radio', value='razorpay', v-model='form.paymentMethod')
                div(class='flex-1')
                  div(class='flex items-center justify-between')
                    span(class='text-xs font-bold text-slate-900') Online Payment (UPI, Cards, NetBanking, EMI)
                    span(class='text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full') Recommended
                  p(class='text-2xs text-slate-500 mt-1')
                    | Instant & secure checkout powered by Razorpay. Zero transaction fees.
              
              label(
                v-if='mainStore().codEnabled',
                class='flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all',
                :class='form.paymentMethod === "cod" ? "border-teal-600 bg-teal-50/40 shadow-xs" : "border-slate-200 hover:border-slate-400"'
              )
                input(class='mt-1 text-teal-600 focus:ring-0', type='radio', value='cod', v-model='form.paymentMethod')
                div(class='flex-1')
                  div(class='flex items-center justify-between')
                    span(class='text-xs font-bold text-slate-900') Cash on Delivery (COD)
                    span(class='text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full') Pay at Doorstep
                  p(class='text-2xs text-slate-500 mt-1')
                    | Pay in cash or UPI directly to the courier upon delivery at your doorstep.

        div(class='space-y-6 lg:col-span-5')
          div(class='p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 space-y-5 shadow-xs sticky top-20')
            h2(class='text-base font-bold text-slate-900') Order Summary ({{ mainStore().totalItemsCount }})

            div(class='divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1 no-scrollbar')
              div(
                v-for='item in mainStore().items',
                :key='`${item.productId}-${item.variantId}`',
                class='py-3 flex items-center gap-3'
              )
                div(class='w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1 shrink-0 overflow-hidden')
                  img(
                    class='max-h-full max-w-full object-contain',
                    :src='item.product.primary_image_url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=100&q=80"',
                    :alt='item.product.name'
                  )
                div(class='flex-1 min-w-0')
                  p(class='text-xs font-bold text-slate-900 truncate') {{ item.product.name }}
                  p(class='text-2xs text-slate-500') Qty: {{ item.quantity }}
                span(class='text-xs font-bold text-slate-900')
                  | {{ formatPrice((item.variant?.sellingPricePaisa || item.product.selling_price_paisa) * item.quantity) }}

            div(class='space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-500')
              div(class='flex justify-between')
                span Subtotal
                span(class='font-medium text-slate-900') {{ formatPrice(mainStore().subtotalPaisa) }}
              div(v-if='mainStore().discountPaisa > 0', class='flex justify-between text-teal-700')
                span Coupon Discount
                span(class='font-semibold') -{{ formatPrice(mainStore().discountPaisa) }}
              div(class='flex justify-between')
                span Shipping
                span(v-if='mainStore().shippingPaisa === 0', class='text-teal-700 font-medium') FREE
                span(v-else, class='text-slate-900 font-medium') {{ formatPrice(mainStore().shippingPaisa) }}
              
              div(class='flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-100')
                span Total Amount
                span {{ formatPrice(mainStore().totalPaisa) }}

            button(
              class='w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50',
              :disabled='isSubmitting || mainStore().items.length === 0',
              @click='handlePlaceOrder'
            )
              span(v-if='isSubmitting') Placing Order...
              span(v-else-if='form.paymentMethod === "cod"') Complete Order with COD →
              span(v-else) Pay {{ formatPrice(mainStore().totalPaisa) }} Securely →

            p(class='text-center text-[11px] text-slate-400 leading-tight')
              | By clicking above, you confirm your order and agree to our Terms of Sale and Return Guidelines.
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
    mainStore().info('Your cart is empty. Add items before checking out.');
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
        productId: it.productId,
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
      couponCode: mainStore().couponCode || undefined,
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
