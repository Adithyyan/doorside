<template lang="pug">
StoreLayout
  div(class='bg-[#f5f5f7] min-h-screen py-10 sm:py-14')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      // Page Heading
      div(class='border-b border-[#e5e5ea] pb-4')
        h1(class='text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]')
          | Checkout
        p(class='text-xs text-[#6e6e73] mt-1')
          | Fast, encrypted checkout with instant dispatch across India.

      div(class='grid grid-cols-1 gap-10 lg:grid-cols-12 items-start')
        // Left Column: Step Cards
        div(class='space-y-6 lg:col-span-7')
          // Step 1: Contact Information
          div(class='apple-card p-6 sm:p-8 bg-white space-y-5')
            div(class='flex items-center gap-3')
              span(class='w-7 h-7 rounded-full bg-[#1d1d1f] text-white text-xs font-bold flex items-center justify-center') 1
              h2(class='text-base sm:text-lg font-bold text-[#1d1d1f]') Contact Information
            
            div(class='grid grid-cols-1 gap-4 sm:grid-cols-2')
              div(class='sm:col-span-2')
                label(class='block text-xs font-semibold text-[#1d1d1f] mb-1.5') Full Name *
                input(
                  class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
                  type='text',
                  placeholder='Enter your full name',
                  v-model='form.customerName',
                  required
                )
              div
                label(class='block text-xs font-semibold text-[#1d1d1f] mb-1.5') Mobile Phone * (for delivery SMS)
                input(
                  class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
                  type='tel',
                  placeholder='10-digit mobile number',
                  maxlength='10',
                  v-model='form.customerPhone',
                  required
                )
              div
                label(class='block text-xs font-semibold text-[#1d1d1f] mb-1.5') Email Address (for order receipts)
                input(
                  class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
                  type='email',
                  placeholder='name@example.com',
                  v-model='form.customerEmail'
                )

          // Step 2: Delivery Address
          div(class='apple-card p-6 sm:p-8 bg-white space-y-5')
            div(class='flex items-center gap-3')
              span(class='w-7 h-7 rounded-full bg-[#1d1d1f] text-white text-xs font-bold flex items-center justify-center') 2
              h2(class='text-base sm:text-lg font-bold text-[#1d1d1f]') Shipping Address
            
            div(class='grid grid-cols-1 gap-4 sm:grid-cols-2')
              div(class='sm:col-span-2')
                label(class='block text-xs font-semibold text-[#1d1d1f] mb-1.5') House No., Building, Street *
                input(
                  class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
                  type='text',
                  placeholder='Flat / Door no., Apartment / Street',
                  v-model='form.addressLine1',
                  required
                )
              div(class='sm:col-span-2')
                label(class='block text-xs font-semibold text-[#1d1d1f] mb-1.5') Area / Colony / Landmark (Optional)
                input(
                  class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
                  type='text',
                  placeholder='Nearby landmark or locality',
                  v-model='form.addressLine2'
                )
              div
                label(class='block text-xs font-semibold text-[#1d1d1f] mb-1.5') 6-Digit PIN Code *
                input(
                  class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
                  type='text',
                  placeholder='6-digit pincode',
                  maxlength='6',
                  v-model='form.pincode',
                  required
                )
              div
                label(class='block text-xs font-semibold text-[#1d1d1f] mb-1.5') City / Town *
                input(
                  class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
                  type='text',
                  placeholder='City or town',
                  v-model='form.city',
                  required
                )
              div
                label(class='block text-xs font-semibold text-[#1d1d1f] mb-1.5') State *
                input(
                  class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden transition-all',
                  type='text',
                  placeholder='State',
                  v-model='form.state',
                  required
                )
              div
                label(class='block text-xs font-semibold text-[#1d1d1f] mb-1.5') Country
                input(
                  class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#86868b]',
                  type='text',
                  value='India',
                  disabled
                )

          // Step 3: Payment Method
          div(class='apple-card p-6 sm:p-8 bg-white space-y-5')
            div(class='flex items-center gap-3')
              span(class='w-7 h-7 rounded-full bg-[#1d1d1f] text-white text-xs font-bold flex items-center justify-center') 3
              h2(class='text-base sm:text-lg font-bold text-[#1d1d1f]') Payment
            
            div(class='space-y-3')
              label(
                v-if='mainStore().prepaidEnabled',
                class='flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all',
                :class='form.paymentMethod === "razorpay" ? "border-[#0071e3] bg-[#f5f5f7] shadow-xs" : "border-[#d2d2d7] hover:border-[#1d1d1f]"'
              )
                input(class='mt-1 text-[#0071e3] focus:ring-0', type='radio', value='razorpay', v-model='form.paymentMethod')
                div(class='flex-1')
                  div(class='flex items-center justify-between')
                    span(class='text-xs font-bold text-[#1d1d1f]') Online Payment (UPI, Cards, NetBanking, EMI)
                    span(class='apple-badge-pill text-[10px]') Recommended
                  p(class='text-2xs text-[#6e6e73] mt-1')
                    | Instant & secure checkout powered by Razorpay. Zero transaction fees.
              
              label(
                v-if='mainStore().codEnabled',
                class='flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all',
                :class='form.paymentMethod === "cod" ? "border-[#0071e3] bg-[#f5f5f7] shadow-xs" : "border-[#d2d2d7] hover:border-[#1d1d1f]"'
              )
                input(class='mt-1 text-[#0071e3] focus:ring-0', type='radio', value='cod', v-model='form.paymentMethod')
                div(class='flex-1')
                  span(class='text-xs font-bold text-[#1d1d1f]') Cash on Delivery (COD)
                  p(class='text-2xs text-[#6e6e73] mt-1')
                    | Pay in cash directly to the courier upon delivery at your doorstep.

        // Right Column: Order Summary Card
        div(class='space-y-6 lg:col-span-5')
          div(class='apple-card p-6 sm:p-8 bg-white space-y-5 sticky top-20')
            h2(class='text-base font-bold text-[#1d1d1f]') Order Summary ({{ mainStore().totalItemsCount }})

            // Items Preview List
            div(class='divide-y divide-[#f5f5f7] max-h-64 overflow-y-auto pr-1 no-scrollbar')
              div(
                v-for='item in mainStore().items',
                :key='`${item.productId}-${item.variantId}`',
                class='py-3 flex items-center gap-3'
              )
                div(class='w-12 h-12 rounded-xl bg-[#f5f5f7] flex items-center justify-center p-1 shrink-0 overflow-hidden')
                  img(
                    class='max-h-full max-w-full object-contain',
                    :src='item.product.primary_image_url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=100&q=80"',
                    :alt='item.product.name'
                  )
                div(class='flex-1 min-w-0')
                  p(class='text-xs font-bold text-[#1d1d1f] truncate') {{ item.product.name }}
                  p(class='text-2xs text-[#6e6e73]') Qty: {{ item.quantity }}
                span(class='text-xs font-bold text-[#1d1d1f]')
                  | {{ formatPrice((item.variant?.sellingPricePaisa || item.product.selling_price_paisa) * item.quantity) }}

            // Totals Breakdown
            div(class='space-y-2 pt-3 border-t border-[#e5e5ea] text-xs text-[#6e6e73]')
              div(class='flex justify-between')
                span Subtotal
                span(class='font-medium text-[#1d1d1f]') {{ formatPrice(mainStore().subtotalPaisa) }}
              div(v-if='mainStore().discountPaisa > 0', class='flex justify-between text-[#1b7a3a]')
                span Coupon Discount
                span(class='font-semibold') -{{ formatPrice(mainStore().discountPaisa) }}
              div(class='flex justify-between')
                span Shipping
                span(v-if='mainStore().shippingPaisa === 0', class='text-[#1b7a3a] font-medium') FREE
                span(v-else, class='text-[#1d1d1f] font-medium') {{ formatPrice(mainStore().shippingPaisa) }}
              
              div(class='flex justify-between text-base font-bold text-[#1d1d1f] pt-3 border-t border-[#e5e5ea]')
                span Total Amount
                span {{ formatPrice(mainStore().totalPaisa) }}

            button(
              class='w-full apple-btn-primary py-3.5 text-sm font-semibold shadow-md disabled:opacity-50',
              :disabled='isSubmitting || mainStore().items.length === 0',
              @click='handlePlaceOrder'
            )
              span(v-if='isSubmitting') Placing Order...
              span(v-else-if='form.paymentMethod === "cod"') Complete Order with COD →
              span(v-else) Pay {{ formatPrice(mainStore().totalPaisa) }} Securely →

            p(class='text-center text-[11px] text-[#86868b] leading-tight')
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

      // Handle COD
      if (form.value.paymentMethod === 'cod') {
        mainStore().clearCart();
        mainStore().success('Order placed successfully!');
        router.push({ name: 'order-success', query: { orderId: order.id, orderNumber: order.order_number } });
        return;
      }

      // Handle Razorpay (Prepaid)
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
