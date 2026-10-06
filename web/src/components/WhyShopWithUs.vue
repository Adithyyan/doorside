<template lang="pug">
section(class='py-14 bg-page-alt border-t border-soft')
  div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8')
    div(class='grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-soft')
      div(class='py-6 sm:py-0 sm:px-8 text-center first:pl-0 last:pr-0')
        div(class='text-2xl mb-3') 🚀
        h3(class='heading-xs text-ink mb-1') Express Delivery
        p(class='text-fine text-muted uppercase tracking-editorial leading-relaxed') Fast nationwide shipping. Free above {{ formatPrice(mainStore().freeShippingThreshold) }}.

      div(class='py-6 sm:py-0 sm:px-8 text-center')
        div(class='text-2xl mb-3') 🔒
        h3(class='heading-xs text-ink mb-1') 100% Secure
        p(class='text-fine text-muted uppercase tracking-editorial leading-relaxed') UPI, Cards, COD — bank-grade encryption.

      div(class='py-6 sm:py-0 sm:px-8 text-center')
        div(class='text-2xl mb-3') 🔄
        h3(class='heading-xs text-ink mb-1') Easy Returns
        p(class='text-fine text-muted uppercase tracking-editorial leading-relaxed') 7-day hassle-free returns &amp; replacements.

      div(class='py-6 sm:py-0 sm:px-8 text-center last:pr-0')
        div(class='text-2xl mb-3') 💬
        h3(class='heading-xs text-ink mb-1') Live Support
        p(class='text-fine text-muted uppercase tracking-editorial leading-relaxed') Real humans via WhatsApp &amp; email.
</template>

<script setup>
import { mainStore } from '@/store';
import { formatPrice } from '@/helpers';
</script>
