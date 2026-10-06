<template lang="pug">
AdminLayout
  div(class='max-w-5xl mx-auto space-y-6')
    div(class='flex flex-col justify-between gap-4 sm:flex-row sm:items-center')
      div
        h1(class='text-2xl font-black text-slate-900 tracking-tight') Store Configuration & Content
        p(class='text-xs text-slate-500 mt-1') Customize branding, color scheme, checkout rules, and legal policy pages.

      button(class='btn-primary px-5 py-2 rounded-xl text-xs font-bold' @click='saveCurrentTabSettings' :disabled='isSaving')
        span(v-if='!isSaving') Save Changes 💾
        span(v-else) Saving...

    div(class='flex gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold')
      button(v-for='tab in tabs' :key='tab.id' class='px-3 py-2 rounded-lg transition-colors' :class="activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'" @click='activeTab = tab.id')
        span(class='mr-1.5') {{ tab.icon }}
        span {{ tab.label }}

    div(v-if="activeTab === 'branding'", class='bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6')
      h2(class='text-sm font-black text-slate-900 uppercase tracking-wider') Brand Identity & Theme Palette

      div(class='grid grid-cols-1 gap-4 sm:grid-cols-2')
        div
          label(class='block text-xs font-bold text-slate-700 mb-1') Store / Brand Name *
          input(type='text' v-model='generalSettings.brand_name' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')
        div
          label(class='block text-xs font-bold text-slate-700 mb-1') Tagline / Slogan
          input(type='text' v-model='brandingSettings.tagline' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')

      div(class='grid grid-cols-1 gap-4 sm:grid-cols-2')
        div
          label(class='block text-xs font-bold text-slate-700 mb-1') Logo Image URL
          input(type='url' v-model='brandingSettings.logo_url' placeholder='https://...' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')
        div
          label(class='block text-xs font-bold text-slate-700 mb-1') Favicon URL
          input(type='url' v-model='brandingSettings.favicon_url' placeholder='https://.../favicon.ico' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')

      div(class='pt-4 border-t border-slate-100')
        h3(class='text-xs font-bold text-slate-800 mb-3') Theme Colors (Applied via CSS Variables)
        div(class='grid grid-cols-2 gap-4 sm:grid-cols-4')
          div
            label(class='block text-2xs font-bold text-slate-700 mb-1') Primary Color
            div(class='flex items-center gap-2')
              input(type='color' v-model='brandingSettings.primary_color' class='h-9 w-12 rounded border border-slate-200 cursor-pointer p-0.5')
              input(type='text' v-model='brandingSettings.primary_color' class='flex-1 px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-mono')
          div
            label(class='block text-2xs font-bold text-slate-700 mb-1') Accent Color
            div(class='flex items-center gap-2')
              input(type='color' v-model='brandingSettings.accent_color' class='h-9 w-12 rounded border border-slate-200 cursor-pointer p-0.5')
              input(type='text' v-model='brandingSettings.accent_color' class='flex-1 px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-mono')
          div
            label(class='block text-2xs font-bold text-slate-700 mb-1') Secondary Color
            div(class='flex items-center gap-2')
              input(type='color' v-model='brandingSettings.secondary_color' class='h-9 w-12 rounded border border-slate-200 cursor-pointer p-0.5')
              input(type='text' v-model='brandingSettings.secondary_color' class='flex-1 px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-mono')
          div
            label(class='block text-2xs font-bold text-slate-700 mb-1') Background Color
            div(class='flex items-center gap-2')
              input(type='color' v-model='brandingSettings.background_color' class='h-9 w-12 rounded border border-slate-200 cursor-pointer p-0.5')
              input(type='text' v-model='brandingSettings.background_color' class='flex-1 px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-mono')

    div(v-if="activeTab === 'contact'", class='bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4')
      h2(class='text-sm font-black text-slate-900 uppercase tracking-wider') Customer Support & Business Info

      div(class='grid grid-cols-1 gap-4 sm:grid-cols-3')
        div
          label(class='block text-xs font-bold text-slate-700 mb-1') Support Email
          input(type='email' v-model='generalSettings.support_email' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')
        div
          label(class='block text-xs font-bold text-slate-700 mb-1') Support Phone
          input(type='tel' v-model='generalSettings.support_phone' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')
        div
          label(class='block text-xs font-bold text-slate-700 mb-1') WhatsApp Support Number
          input(type='tel' v-model='generalSettings.whatsapp_number' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')

      div
        label(class='block text-xs font-bold text-slate-700 mb-1') Physical / Registered Office Address
        input(type='text' v-model='generalSettings.address' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')

      div(class='pt-4 border-t border-slate-100')
        h3(class='text-xs font-bold text-slate-800 mb-3') Social Media Links
        div(class='grid grid-cols-1 gap-4 sm:grid-cols-2')
          div
            label(class='block text-2xs font-bold text-slate-700 mb-1') Instagram Profile URL
            input(type='url' v-model='storefrontSettings.social_instagram' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')
          div
            label(class='block text-2xs font-bold text-slate-700 mb-1') Facebook Page URL
            input(type='url' v-model='storefrontSettings.social_facebook' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')
          div
            label(class='block text-2xs font-bold text-slate-700 mb-1') YouTube Channel URL
            input(type='url' v-model='storefrontSettings.social_youtube' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')
          div
            label(class='block text-2xs font-bold text-slate-700 mb-1') Twitter / X URL
            input(type='url' v-model='storefrontSettings.social_twitter' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')

    div(v-if="activeTab === 'checkout'", class='bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6')
      h2(class='text-sm font-black text-slate-900 uppercase tracking-wider') Payment Methods & Shipping Rules

      div(class='grid grid-cols-1 gap-6 sm:grid-cols-2')
        div(class='p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3')
          div(class='flex items-center justify-between')
            h3(class='text-xs font-black text-slate-900') Cash on Delivery (COD)
            input#codToggle(type='checkbox' v-model='checkoutSettings.cod_enabled' :true-value="'true'" :false-value="'false'")
          div
            label(class='block text-2xs font-bold text-slate-700 mb-1') Extra COD Handling Charge (₹)
            input(type='number' min='0' v-model.number='codFeeRupees' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white')
            p(class='text-2xs text-slate-400 mt-1') Extra fee added to order when customer picks COD

        div(class='p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3')
          div(class='flex items-center justify-between')
            h3(class='text-xs font-black text-slate-900') Online Prepaid (Razorpay)
            input#prepaidToggle(type='checkbox' v-model='checkoutSettings.prepaid_enabled' :true-value="'true'" :false-value="'false'")
          p(class='text-xs text-slate-500') Supports UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Wallets.

      div(class='pt-4 border-t border-slate-100 space-y-4')
        h3(class='text-xs font-bold text-slate-800') Shipping Charges
        div(class='grid grid-cols-1 gap-4 sm:grid-cols-2')
          div
            label(class='block text-xs font-bold text-slate-700 mb-1') Free Shipping Threshold (₹)
            input(type='number' min='0' v-model.number='freeShippingRupees' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')
            p(class='text-2xs text-slate-400 mt-1') Orders above this subtotal get 100% free delivery

          div
            label(class='block text-xs font-bold text-slate-700 mb-1') Standard Shipping Fee (₹)
            input(type='number' min='0' v-model.number='shippingFeeRupees' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')
            p(class='text-2xs text-slate-400 mt-1') Applied when order subtotal is below the threshold

    div(v-if="activeTab === 'homepage'", class='bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4')
      h2(class='text-sm font-black text-slate-900 uppercase tracking-wider') Homepage Hero & Announcement Bar

      div(class='p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3')
        div(class='flex items-center justify-between')
          h3(class='text-xs font-black text-slate-900') Top Announcement Bar
          input#annBarToggle(type='checkbox' v-model='storefrontSettings.announcement_bar_enabled' :true-value="'true'" :false-value="'false'")
        div
          label(class='block text-2xs font-bold text-slate-700 mb-1') Announcement Text
          input(type='text' v-model='storefrontSettings.announcement_bar_text' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white')

      div(class='space-y-3 pt-2')
        div
          label(class='block text-xs font-bold text-slate-700 mb-1') Main Hero Heading
          input(type='text' v-model='storefrontSettings.hero_heading' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')
        div
          label(class='block text-xs font-bold text-slate-700 mb-1') Hero Sub-description
          textarea(rows='2' v-model='storefrontSettings.hero_description' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')
        div(class='grid grid-cols-2 gap-4')
          div
            label(class='block text-xs font-bold text-slate-700 mb-1') Button CTA Text
            input(type='text' v-model='storefrontSettings.hero_cta_text' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')
          div
            label(class='block text-xs font-bold text-slate-700 mb-1') Hero Image URL (Optional)
            input(type='url' v-model='storefrontSettings.hero_image_url' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')

    div(v-if="activeTab === 'policies'", class='bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4')
      div(class='flex items-center justify-between')
        h2(class='text-sm font-black text-slate-900 uppercase tracking-wider') Legal Policies & Informational Pages
        button(class='btn-primary px-4 py-1.5 rounded-lg text-xs font-bold' @click='saveCurrentPolicyPage' :disabled='isSavingPage')
          span(v-if='!isSavingPage') Save Page
          span(v-else) Saving...

      div(class='flex gap-2 overflow-x-auto pb-2')
        button(v-for='p in availablePages' :key='p.slug' class='px-3 py-1.5 rounded-lg text-2xs font-bold border transition-colors' :class="selectedPolicySlug === p.slug ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'" @click='selectPolicyPage(p.slug)') {{ p.title }}

      div(class='space-y-3 pt-2')
        div
          label(class='block text-xs font-bold text-slate-700 mb-1') Page Title
          input(type='text' v-model='activePolicyPage.title' class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs')
        div
          label(class='block text-xs font-bold text-slate-700 mb-1') Page Content (HTML / Markdown)
          textarea(rows='12' v-model='activePolicyPage.content' class='w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono')
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/components/AdminLayout.vue';
import { mainStore } from '@/store';
import { api } from '@/helpers';


const activeTab = ref('branding');
const isSaving = ref(false);
const isSavingPage = ref(false);

const tabs = [
  { id: 'branding', label: 'Brand & Design', icon: '🎨' },
  { id: 'contact', label: 'Contact & Social', icon: '📞' },
  { id: 'checkout', label: 'Payments & COD', icon: '💳' },
  { id: 'homepage', label: 'Hero & Home', icon: '🏠' },
  { id: 'policies', label: 'Policy Pages', icon: '📜' },
];

const generalSettings = ref({});
const brandingSettings = ref({});
const storefrontSettings = ref({});
const checkoutSettings = ref({});

const codFeeRupees = ref(0);
const freeShippingRupees = ref(499);
const shippingFeeRupees = ref(49);

const availablePages = ref([]);
const selectedPolicySlug = ref('privacy-policy');
const activePolicyPage = ref({ title: '', content: '' });

function selectPolicyPage(slug) {
  selectedPolicySlug.value = slug;
  const page = availablePages.value.find((p) => p.slug === slug);
  if (page) {
    activePolicyPage.value = { ...page };
  }
}

async function saveCurrentPolicyPage() {
  isSavingPage.value = true;
  try {
    const res = await api.put(`/admin/settings/pages/${selectedPolicySlug.value}`, activePolicyPage.value);
    if (res.success) {
      mainStore().toast('Page content saved!', 'success');
      await getPages();
    }
  } catch (err) {
    mainStore().toast(err.message || 'Failed to save page', 'error');
  } finally {
    isSavingPage.value = false;
  }
}

async function saveCurrentTabSettings() {
  if (activeTab.value === 'policies') {
    return saveCurrentPolicyPage();
  }

  isSaving.value = true;
  try {
    if (activeTab.value === 'branding') {
      await Promise.all([
        api.patch('/admin/settings/general', { brand_name: generalSettings.value.brand_name }),
        api.patch('/admin/settings/branding', brandingSettings.value),
      ]);
    } else if (activeTab.value === 'contact') {
      await Promise.all([
        api.patch('/admin/settings/general', generalSettings.value),
        api.patch('/admin/settings/storefront', {
          social_instagram: storefrontSettings.value.social_instagram,
          social_facebook: storefrontSettings.value.social_facebook,
          social_youtube: storefrontSettings.value.social_youtube,
          social_twitter: storefrontSettings.value.social_twitter,
        }),
      ]);
    } else if (activeTab.value === 'checkout') {
      const payload = {
        ...checkoutSettings.value,
        cod_fee_paisa: Math.round(codFeeRupees.value * 100),
        free_shipping_threshold_paisa: Math.round(freeShippingRupees.value * 100),
        default_shipping_fee_paisa: Math.round(shippingFeeRupees.value * 100),
      };
      await api.patch('/admin/settings/checkout', payload);
    } else if (activeTab.value === 'homepage') {
      await api.patch('/admin/settings/storefront', storefrontSettings.value);
    }

    mainStore().toast('Settings saved successfully!', 'success');
    await mainStore().getSettings();
  } catch (err) {
    mainStore().toast(err.message || 'Failed to update settings', 'error');
  } finally {
    isSaving.value = false;
  }
}

async function getAllSettings() {
  try {
    const res = await api.get('/admin/settings');
    if (res.success && res.data?.settings) {
      const s = res.data.settings;
      generalSettings.value = s.general || {};
      brandingSettings.value = s.branding || {};
      storefrontSettings.value = s.storefront || {};
      checkoutSettings.value = s.checkout || {};

      codFeeRupees.value = (checkoutSettings.value.cod_fee_paisa || 0) / 100;
      freeShippingRupees.value = (checkoutSettings.value.free_shipping_threshold_paisa || 49900) / 100;
      shippingFeeRupees.value = (checkoutSettings.value.default_shipping_fee_paisa || 4900) / 100;
    }
  } catch {
  }
}

async function getPages() {
  try {
    const res = await api.get('/admin/settings/pages/all');
    if (res.success && res.data?.pages) {
      availablePages.value = res.data.pages;
      selectPolicyPage(selectedPolicySlug.value);
    }
  } catch {
  }
}

onMounted(async () => {
  await Promise.all([
    getAllSettings(),
    getPages(),
  ]);
});
</script>
