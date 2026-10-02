<template lang="pug">
AdminLayout
  div(class='space-y-6')
    div(class='flex flex-col justify-between gap-4 sm:flex-row sm:items-center')
      div
        h1(class='text-2xl font-black text-slate-900 tracking-tight') System Audit Trail
        p(class='text-xs text-slate-500 mt-1') Immutable security and change history log for store operations and fulfillment.

      button(
        class='px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold'
        @click='getAuditLogs'
      ) 🔄 Refresh Logs

    div(class='bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden')
      div(class='overflow-x-auto')
        table(class='w-full text-left border-collapse')
          thead(class='bg-slate-50 border-b border-slate-200 text-2xs font-bold text-slate-500 uppercase tracking-wider')
            tr
              th(class='px-6 py-3.5') Timestamp
              th(class='px-6 py-3.5') Action
              th(class='px-6 py-3.5') Entity
              th(class='px-6 py-3.5') Admin / Operator
              th(class='px-6 py-3.5') Details
          tbody(class='divide-y divide-slate-100 text-xs')
            tr(
              v-for='log in logs'
              :key='log.id'
              class='transition-colors hover:bg-slate-50'
            )
              td(class='py-4 px-6 whitespace-nowrap text-slate-500')
                | {{ formatDate(log.created_at, true) }}

              td(class='py-4 px-6')
                span(class='font-mono text-2xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold')
                  | {{ log.action }}

              td(class='py-4 px-6')
                span(class='font-bold text-slate-700 uppercase text-2xs') {{ log.entity }}
                span(v-if='log.entity_id', class='text-2xs text-slate-400 block') ID: {{ log.entity_id.slice(0, 8) }}...

              td(class='py-4 px-6')
                div(class='font-semibold text-slate-800') {{ log.admin_name || 'Admin User' }}
                div(class='text-2xs text-slate-400') IP: {{ log.ip_address || 'Internal' }}

              td(class='py-4 px-6')
                div(
                  class='text-2xs font-mono max-w-xs truncate text-slate-600'
                  :title='JSON.stringify(log.new_values || log.old_values)'
                )
                  span(v-if='log.new_values') {{ JSON.stringify(log.new_values) }}
                  span(v-else-if='log.old_values') {{ JSON.stringify(log.old_values) }}
                  span(v-else, class='text-slate-400') No payload recorded

            tr(v-if='logs.length === 0 && !isLoading')
              td(colspan='5', class='py-12 text-center text-slate-400')
                p(class='text-xs font-semibold') No audit logs recorded yet.

            tr(v-if='isLoading')
              td(colspan='5', class='py-12 text-center text-slate-400')
                | Loading audit trail...

      div(v-if='totalPages > 1', class='p-4 border-t border-slate-100 flex items-center justify-between')
        span(class='text-xs text-slate-500') Page {{ currentPage }} of {{ totalPages }} ({{ totalLogs }} records)
        div(class='flex items-center gap-2')
          button(
            class='px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40'
            :disabled='currentPage <= 1'
            @click='changePage(currentPage - 1)'
          ) Previous
          button(
            class='px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold disabled:opacity-40'
            :disabled='currentPage >= totalPages'
            @click='changePage(currentPage + 1)'
          ) Next
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/components/AdminLayout.vue';
import { api, formatDate } from '@/helpers';

const logs = ref([]);
const totalLogs = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const pageSize = 20;
const isLoading = ref(true);

function changePage(page) {
  currentPage.value = page;
  getAuditLogs();
}

async function getAuditLogs() {
  isLoading.value = true;
  try {
    const res = await api.get(`/admin/audit?page=${currentPage.value}&pageSize=${pageSize}`);
    if (res.success && res.data) {
      logs.value = res.data.items || [];
      totalLogs.value = res.data.total || 0;
      totalPages.value = res.data.totalPages || 1;
    }
  } catch {
    logs.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getAuditLogs();
});
</script>
