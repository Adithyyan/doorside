<template lang="pug">
StoreLayout
  div(class='bg-page min-h-screen py-10 sm:py-16')
    div(class='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      div(class='text-center space-y-1.5')
        h1(class='heading-lg text-ink') {{ pageTitle }}
        p(class='text-fine text-muted uppercase tracking-editorial') Last updated: {{ lastUpdatedDate }}

      div(class='panel-editorial p-6 sm:p-12 space-y-6')
        div(v-if='slug === "contact"', class='space-y-8')
          div(class='grid grid-cols-1 gap-4 sm:grid-cols-3')
            div(class='p-5 bg-page-alt border border-soft text-center space-y-1.5')
              span(class='text-2xl') 📧
              h3(class='label-ink') Email Support
              p(class='text-cap text-soft') {{ mainStore().supportEmail }}
            div(class='p-5 bg-page-alt border border-soft text-center space-y-1.5')
              span(class='text-2xl') 📞
              h3(class='label-ink') Phone Assistance
              p(class='text-cap text-soft') {{ mainStore().supportPhone || '+91 98765 43210' }}
            div(class='p-5 bg-page-alt border border-soft text-center space-y-1.5')
              span(class='text-2xl') 💬
              h3(class='label-ink') WhatsApp Support
              p(class='text-cap text-soft') {{ mainStore().whatsappNumber || '+91 98765 43210' }}
          
          div(class='space-y-4 pt-2 border-t border-soft')
            h2(class='heading-sm text-ink') Send a Direct Message
            div(class='grid grid-cols-1 sm:grid-cols-2 gap-4')
              div(class='space-y-1')
                label(class='label-ink block') Full Name
                input(class='input-base', type='text', v-model='contactForm.name')
              div(class='space-y-1')
                label(class='label-ink block') Email Address
                input(class='input-base', type='email', v-model='contactForm.email')
            div(class='space-y-1')
              label(class='label-ink block') Subject / Order Number
              input(class='input-base', type='text', v-model='contactForm.subject')
            div(class='space-y-1')
              label(class='label-ink block') Message
              textarea(class='input-base', rows='4', v-model='contactForm.message')
            button(class='btn-primary py-3 px-8', @click='sendContactMessage')
              | Send Message 📨

        div(v-else-if='slug === "faq"', class='space-y-3')
          div(v-for='(faq, idx) in faqs', :key='idx', class='border border-soft overflow-hidden')
            button(class='w-full p-4 text-left label-ink flex justify-between items-center bg-page-alt hover:bg-surface transition-colors cursor-pointer', @click='toggleFaq(idx)')
              span {{ faq.q }}
              span(class='text-base text-muted') {{ activeFaq === idx ? '−' : '+' }}
            div(v-if='activeFaq === idx', class='p-5 text-cap text-soft leading-relaxed border-t border-soft bg-white')
              | {{ faq.a }}

        div(v-else, class='text-cap leading-relaxed text-soft space-y-4')
          div(v-html='renderedPolicyContent')
</template>

<script setup>
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import StoreLayout from '@/components/StoreLayout.vue';
import { useRoute } from 'vue-router';
import { mainStore } from '@/store';

const route = useRoute();
const slug = computed(() => route.params.slug || route.name || 'privacy-policy');
const activeFaq = ref(0);

const lastUpdatedDate = computed(() => dayjs().format('MMMM D, YYYY'));

const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

function toggleFaq(idx) {
  activeFaq.value = activeFaq.value === idx ? -1 : idx;
}

function sendContactMessage() {
  if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message) {
    mainStore().error('Please fill in your name, email, and message.');
    return;
  }
  mainStore().success('Thank you! Your message has been sent to our customer care team.');
  contactForm.value = { name: '', email: '', subject: '', message: '' };
}

const pageTitle = computed(() => {
  switch (slug.value) {
    case 'about':
      return 'About Our Store';
    case 'contact':
      return 'Specialist Customer Support';
    case 'faq':
      return 'Frequently Asked Questions';
    case 'privacy-policy':
      return 'Privacy Policy';
    case 'terms-and-conditions':
      return 'Terms of Sale & Use';
    case 'shipping-policy':
      return 'Shipping & Delivery Guidelines';
    case 'refund-policy':
      return 'Returns & Refund Policy';
    case 'cancellation-policy':
      return 'Cancellation Policy';
    default:
      return 'Store Information';
  }
});

const faqs = [
  { q: 'How long does delivery take across India?', a: 'All verified orders are dispatched within 24 hours. Standard transit time is 3 to 5 business days depending on your delivery PIN code. Tracking details are sent automatically via SMS and WhatsApp.' },
  { q: 'What is the return and replacement policy?', a: 'We offer a 7-day hassle-free return and replacement policy for any damaged, defective, or incorrect items. Simply contact our support team to arrange a reverse pickup.' },
  { q: 'Are all products authentic and genuine?', a: 'Yes, 100%. We partner directly with verified manufacturers and inspect each product batch for durability and performance standards before dispatch.' },
  { q: 'What payment methods do you support?', a: 'We support all major payment methods powered by Razorpay: UPI (GPay, PhonePe, Paytm), Credit & Debit cards, NetBanking, and Cash on Delivery (COD) on eligible orders.' },
];

const renderedPolicyContent = computed(() => {
  const brand = mainStore().brandName;
  return `
    <p>Welcome to <strong>${brand}</strong>. We are dedicated to providing the highest quality products and customer service across India.</p>
    <h3 class="heading-xs text-ink mt-6 mb-2">Our Commitment to Quality</h3>
    <p>Every product in our catalog undergoes rigorous functional inspection. We prioritize clean aesthetics, durable construction, and dependable long-term reliability.</p>
    <h3 class="heading-xs text-ink mt-6 mb-2">Dispatches & Shipping</h3>
    <p>Orders are dispatched through premier Indian logistics networks (including BlueDart, Delhivery, and Xpressbees) to ensure timely and intact delivery.</p>
    <h3 class="heading-xs text-ink mt-6 mb-2">Customer Security & Privacy</h3>
    <p>Your personal data and payment credentials are encrypted using 256-bit SSL protocols. We never share customer personal information with unauthorized third parties.</p>
  `;
});
</script>
