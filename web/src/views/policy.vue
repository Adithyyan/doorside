<template lang="pug">
StoreLayout
  div(class='bg-[#f5f5f7] min-h-screen py-10 sm:py-16')
    div(class='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8')
      // Page Heading
      div(class='text-center space-y-1.5')
        h1(class='text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]') {{ pageTitle }}
        p(class='text-xs text-[#86868b]') Last updated: {{ lastUpdatedDate }}

      // Policy / Contact Card
      div(class='apple-card p-6 sm:p-12 bg-white shadow-sm space-y-6')
        // Contact Page View
        div(v-if='slug === "contact"', class='space-y-8')
          div(class='grid grid-cols-1 gap-4 sm:grid-cols-3')
            div(class='p-5 bg-[#f5f5f7] rounded-2xl border border-[#e5e5ea] text-center space-y-1.5')
              span(class='text-2xl') 📧
              h3(class='text-xs font-bold text-[#1d1d1f]') Email Support
              p(class='text-xs text-[#6e6e73]') {{ mainStore().supportEmail }}
            div(class='p-5 bg-[#f5f5f7] rounded-2xl border border-[#e5e5ea] text-center space-y-1.5')
              span(class='text-2xl') 📞
              h3(class='text-xs font-bold text-[#1d1d1f]') Phone Assistance
              p(class='text-xs text-[#6e6e73]') {{ mainStore().supportPhone || '+91 98765 43210' }}
            div(class='p-5 bg-[#f5f5f7] rounded-2xl border border-[#e5e5ea] text-center space-y-1.5')
              span(class='text-2xl') 💬
              h3(class='text-xs font-bold text-[#1d1d1f]') WhatsApp Specialist
              p(class='text-xs text-[#6e6e73]') {{ mainStore().whatsappNumber || '+91 98765 43210' }}
          
          div(class='space-y-4 pt-2 border-t border-[#f5f5f7]')
            h2(class='text-lg font-bold text-[#1d1d1f]') Send a Direct Message
            div(class='grid grid-cols-1 sm:grid-cols-2 gap-4')
              div(class='space-y-1')
                label(class='block text-xs font-semibold text-[#1d1d1f]') Full Name
                input(class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden', type='text', v-model='contactForm.name')
              div(class='space-y-1')
                label(class='block text-xs font-semibold text-[#1d1d1f]') Email Address
                input(class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden', type='email', v-model='contactForm.email')
            div(class='space-y-1')
              label(class='block text-xs font-semibold text-[#1d1d1f]') Subject / Order Number
              input(class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden', type='text', v-model='contactForm.subject')
            div(class='space-y-1')
              label(class='block text-xs font-semibold text-[#1d1d1f]') Message
              textarea(class='w-full px-4 py-2.5 text-xs bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-hidden', rows='4', v-model='contactForm.message')
            button(class='apple-btn-primary px-8 py-3 text-xs font-semibold shadow-xs', @click='sendContactMessage')
              | Send Message 📨

        // FAQ Accordion View
        div(v-else-if='slug === "faq"', class='space-y-3')
          div(v-for='(faq, idx) in faqs', :key='idx', class='border border-[#e5e5ea] rounded-2xl overflow-hidden')
            button(
              class='w-full p-4.5 text-left font-semibold text-xs text-[#1d1d1f] flex justify-between items-center bg-[#f5f5f7] hover:bg-[#e8e8ed] transition-colors',
              @click='toggleFaq(idx)'
            )
              span {{ faq.q }}
              span(class='text-base text-[#86868b]') {{ activeFaq === idx ? '−' : '+' }}
            div(v-if='activeFaq === idx', class='p-5 text-xs text-[#424245] leading-relaxed border-t border-[#e5e5ea] bg-white')
              | {{ faq.a }}

        // Standard Policy Text View
        div(v-else, class='prose max-w-none text-xs leading-relaxed text-[#424245] sm:text-sm space-y-4')
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
    <h3 style="font-weight:700; font-size: 1.1rem; margin-top: 1.5rem; margin-bottom: 0.5rem; color:#1d1d1f;">Our Commitment to Quality</h3>
    <p>Every product in our catalog undergoes rigorous functional inspection. We prioritize clean aesthetics, durable construction, and dependable long-term reliability.</p>
    <h3 style="font-weight:700; font-size: 1.1rem; margin-top: 1.5rem; margin-bottom: 0.5rem; color:#1d1d1f;">Dispatches & Shipping</h3>
    <p>Orders are dispatched through premier Indian logistics networks (including BlueDart, Delhivery, and Xpressbees) to ensure timely and intact delivery.</p>
    <h3 style="font-weight:700; font-size: 1.1rem; margin-top: 1.5rem; margin-bottom: 0.5rem; color:#1d1d1f;">Customer Security & Privacy</h3>
    <p>Your personal data and payment credentials are encrypted using 256-bit SSL protocols. We never share customer personal information with unauthorized third parties.</p>
  `;
});
</script>
