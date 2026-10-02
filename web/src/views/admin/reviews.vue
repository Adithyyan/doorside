<template lang="pug">
AdminLayout
  div(class='space-y-6')
    div(class='flex flex-col justify-between gap-4 sm:flex-row sm:items-center')
      div
        h1(class='text-2xl font-black text-slate-900 tracking-tight') Customer Reviews Moderation
        p(class='text-xs text-slate-500 mt-1') Moderate product reviews and testimonials before they appear live on the storefront.
      
      button(
        class='px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold',
        @click='getReviews'
      ) 🔄 Refresh Queue

    div(class='flex gap-2 border-b border-slate-200 pb-1 text-xs font-bold')
      button(
        v-for='tab in filterTabs',
        :key='tab.id',
        class='px-3 py-2 rounded-lg transition-colors',
        :class='activeFilter === tab.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"',
        @click='selectFilter(tab.id)'
      ) {{ tab.label }}

    div(v-if='reviews.length > 0', class='space-y-4')
      div(
        v-for='rev in reviews',
        :key='rev.id',
        class='bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs'
      )
        div(class='flex flex-col justify-between gap-2 border-b border-slate-50 pb-3 mb-3 sm:flex-row sm:items-center')
          div
            div(class='flex items-center gap-2')
              span(class='text-amber-400 font-black text-sm') {{ '★'.repeat(rev.rating) }}{{ '☆'.repeat(5 - rev.rating) }}
              span(class='text-xs font-bold text-slate-900') {{ rev.title || 'Product Review' }}
            p(class='text-2xs text-slate-400')
              | By 
              strong(class='text-slate-700') {{ rev.customer_name || 'Anonymous Shopper' }}
              |  on 
              router-link(
                v-if='rev.product_slug',
                class='text-blue-600 hover:underline',
                :to='`/product/${rev.product_slug}`',
                target='_blank'
              ) {{ rev.product_name || 'Product' }}
              span(v-else) {{ rev.product_name || 'Product' }}
              |  • {{ formatDate(rev.created_at, true) }}

          div(class='flex items-center gap-2')
            span(
              class='text-2xs px-2 py-0.5 rounded-full font-bold',
              :class='getStatusBadge(rev.status)'
            ) {{ rev.status }}

        p(class='text-xs text-slate-700 leading-relaxed mb-4')
          | "{{ rev.comment || rev.message || rev.body }}"

        div(class='flex items-center justify-end gap-2')
          button(
            v-if='rev.status !== "approved"',
            class='px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold transition-colors hover:bg-emerald-700',
            @click='updateReviewStatus(rev.id, "approved")'
          ) Approve ✅
          button(
            v-if='rev.status !== "rejected"',
            class='px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold transition-colors hover:bg-rose-700',
            @click='updateReviewStatus(rev.id, "rejected")'
          ) Reject ✕

    div(v-else-if='!isLoading', class='text-center py-16 bg-white rounded-2xl border border-slate-200')
      div(class='text-3xl mb-2') ⭐
      p(class='text-xs font-semibold text-slate-500') No reviews found for this status.

    div(v-else, class='py-16 text-center text-xs text-slate-400')
      | Loading reviews...
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/components/AdminLayout.vue';
import { mainStore } from '@/store';
import { api, formatDate } from '@/helpers';


const reviews = ref([]);
const isLoading = ref(true);
const activeFilter = ref('pending');

const filterTabs = [
  { id: 'pending', label: 'Pending Moderation ⚠️' },
  { id: 'approved', label: 'Approved & Live ✅' },
  { id: 'rejected', label: 'Rejected ✕' },
  { id: 'all', label: 'All Reviews' },
];

function selectFilter(filterId) {
  activeFilter.value = filterId;
  getReviews();
}

function getStatusBadge(status) {
  if (status === 'approved') {
    return 'bg-emerald-100 text-emerald-800';
  }
  if (status === 'rejected') {
    return 'bg-rose-100 text-rose-800';
  }
  return 'bg-amber-100 text-amber-800';
}

async function updateReviewStatus(id, newStatus) {
  try {
    const res = await api.patch(`/admin/reviews/${id}/status`, { status: newStatus });
    if (res.success) {
      mainStore().toast(`Review marked as ${newStatus}`, 'success');
      await getReviews();
    }
  } catch (err) {
    mainStore().toast(err.message || 'Failed to update review', 'error');
  }
}

async function getReviews() {
  isLoading.value = true;
  try {
    let url = '/admin/reviews?pageSize=50';
    if (activeFilter.value !== 'all') {
      url += `&status=${activeFilter.value}`;
    }
    const res = await api.get(url);
    if (res.success && res.data) {
      reviews.value = res.data.items || [];
    }
  } catch {
    reviews.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getReviews();
});
</script>
