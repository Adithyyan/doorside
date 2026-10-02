<template lang="pug">
StoreLayout
  div(v-if='product', class='bg-slate-50 min-h-screen py-8 sm:py-12')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10')
      nav(class='flex text-xs font-normal text-slate-500 gap-2 items-center')
        router-link(class='hover:text-teal-700 hover:underline', to='/') Home
        span /
        router-link(class='hover:text-teal-700 hover:underline', to='/shop') All Products
        span /
        span(class='text-slate-800 font-medium truncate max-w-xs') {{ product.name }}

      div(class='grid grid-cols-1 gap-10 lg:grid-cols-12 items-start')
        div(class='space-y-4 lg:col-span-7')
          div(class='aspect-square w-full rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-8 overflow-hidden')
            img(
              class='max-h-full max-w-full object-contain filter drop-shadow-md transition-all duration-300',
              :src='activeImage || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80"',
              :alt='product.name'
            )
          
          div(v-if='galleryImages.length > 1', class='flex gap-3 overflow-x-auto no-scrollbar py-1')
            button(
              v-for='(img, idx) in galleryImages',
              :key='idx',
              class='w-20 h-20 rounded-xl bg-white border-2 shrink-0 p-2 flex items-center justify-center transition-all',
              :class='activeImage === img ? "border-teal-600 shadow-xs" : "border-slate-200 opacity-70 hover:opacity-100"',
              @click='activeImage = img'
            )
              img(class='max-h-full max-w-full object-contain', :src='img', :alt='`${product.name} view ${idx + 1}`')

        div(class='space-y-6 lg:col-span-5')
          div(class='space-y-2')
            span(class='inline-block text-[11px] font-bold tracking-wider text-teal-700 uppercase bg-teal-50 px-2.5 py-0.5 rounded-full') Trending Deal
            h1(class='text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-snug')
              | {{ product.name }}

            div(class='flex items-center gap-3 pt-1 text-xs')
              div(class='flex text-amber-400 text-sm')
                span(v-for='s in 5', :key='s') ★
              span(class='text-slate-500') ({{ reviews.length }} reviews)
              span(class='text-teal-700 font-medium bg-teal-50 px-2.5 py-0.5 rounded-full') In Stock • Ready to Ship

          div(class='p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-xs')
            div(class='text-xs text-slate-500 font-medium') Special Price
            div(class='flex items-baseline gap-3')
              span(class='text-3xl font-black text-slate-900') {{ formatPrice(currentPricePaisa) }}
              span(
                v-if='currentComparePricePaisa > currentPricePaisa',
                class='text-sm text-slate-400 line-through'
              ) {{ formatPrice(currentComparePricePaisa) }}
              span(
                v-if='discountPercentage > 0',
                class='text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md'
              ) {{ discountPercentage }}% OFF
            p(class='text-xs text-slate-500 pt-1')
              | Inclusive of all taxes. Free shipping on prepaid orders over {{ formatPrice(mainStore().freeShippingThreshold) }}.

          p(v-if='product.short_description', class='text-sm text-slate-600 leading-relaxed')
            | {{ product.short_description }}

          div(v-if='product.variants && product.variants.length > 0', class='space-y-2.5')
            label(class='block text-xs font-semibold text-slate-800 uppercase tracking-wider')
              | Option / Style: 
              span(class='text-teal-700 font-bold') {{ selectedVariant?.name || 'Standard' }}
            div(class='flex flex-wrap gap-2.5')
              button(
                v-for='variant in product.variants',
                :key='variant.id',
                class='px-4 py-2 text-xs font-medium rounded-xl border transition-all',
                :class='selectedVariant?.id === variant.id ? "border-teal-600 bg-teal-600 text-white shadow-xs" : "border-slate-200 bg-white text-slate-800 hover:border-slate-400"'
                @click='selectVariant(variant)'
              ) {{ variant.name }}

          div(class='space-y-2')
            label(class='block text-xs font-semibold text-slate-800 uppercase tracking-wider') Quantity
            div(class='flex items-center gap-3')
              div(class='flex items-center border border-slate-200 rounded-xl bg-white px-2 py-1')
                button(
                  class='w-7 h-7 flex items-center justify-center text-sm font-bold text-slate-500 hover:text-slate-900',
                  @click='quantity = Math.max(1, quantity - 1)'
                ) −
                span(class='w-10 text-center text-xs font-bold text-slate-900') {{ quantity }}
                button(
                  class='w-7 h-7 flex items-center justify-center text-sm font-bold text-slate-500 hover:text-slate-900',
                  @click='quantity++'
                ) +
              span(class='text-xs text-slate-400') Max 10 per order

          div(class='space-y-3 pt-2')
            button(
              class='w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2',
              @click='addToCart'
            )
              span 🛒 Add to Cart
            
            button(
              class='w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2',
              @click='buyNow'
            )
              span ⚡ Buy Now (Instant Checkout)

          div(class='p-5 bg-white rounded-2xl border border-slate-200 space-y-3 text-xs text-slate-600')
            div(class='flex items-center gap-3')
              span(class='text-lg') 🚚
              span
                strong(class='text-slate-900') Express Delivery:
                |  Dispatches in 24 hours. Delivered in 3-5 business days across India.
            div(class='flex items-center gap-3')
              span(class='text-lg') 🔄
              span
                strong(class='text-slate-900') 7-Day Easy Replacement:
                |  Hassle-free support if item arrives damaged or defective.
            div(class='flex items-center gap-3')
              span(class='text-lg') 💵
              span
                strong(class='text-slate-900') Cash on Delivery:
                |  Pay cash or UPI at your doorstep. Verified COD available.

      div(class='p-8 sm:p-10 bg-white rounded-2xl border border-slate-200 space-y-6')
        h2(class='text-xl sm:text-2xl font-bold text-slate-900 tracking-tight')
          | Overview & Product Details
        div(class='prose text-sm text-slate-600 leading-relaxed max-w-none')
          p {{ product.description || product.short_description || 'Crafted with premium materials and tested rigorously for performance and longevity.' }}

      div(class='p-8 sm:p-10 bg-white rounded-2xl border border-slate-200 space-y-6')
        div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-4')
          div
            h2(class='text-xl sm:text-2xl font-bold text-slate-900 tracking-tight') Customer Reviews
            p(class='text-xs text-slate-500 mt-1') Verified customer ratings and feedback
          
          button(
            class='px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors',
            @click='showReviewForm = !showReviewForm'
          ) Write a Review

        div(v-if='showReviewForm', class='p-6 bg-slate-50 rounded-2xl space-y-4 border border-slate-200')
          h3(class='text-sm font-bold text-slate-900') Submit Your Rating
          div(class='flex items-center gap-2')
            span(class='text-xs text-slate-600') Rating:
            select(class='px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-600', v-model='reviewRating')
              option(:value='5') 5 Stars - Exceptional
              option(:value='4') 4 Stars - Very Good
              option(:value='3') 3 Stars - Average
              option(:value='2') 2 Stars - Below Average
              option(:value='1') 1 Star - Poor
          
          div(class='grid grid-cols-1 sm:grid-cols-2 gap-3')
            input(
              class='px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600',
              type='text',
              placeholder='Your name',
              v-model='reviewerName'
            )
            input(
              class='px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600',
              type='email',
              placeholder='Your email',
              v-model='reviewerEmail'
            )
          
          textarea(
            class='w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600',
            rows='3',
            placeholder='Share your thoughts about this product...',
            v-model='reviewComment'
          )
          
          div(class='flex justify-end gap-2')
            button(
              class='px-4 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-200 transition-colors',
              @click='showReviewForm = false'
            ) Cancel
            button(
              class='px-5 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors',
              @click='submitReview'
            ) Post Review

        div(v-if='reviews.length > 0', class='divide-y divide-slate-100 space-y-4 pt-2')
          div(v-for='rev in reviews', :key='rev.id', class='pt-4 space-y-1.5')
            div(class='flex items-center justify-between text-xs')
              span(class='font-bold text-slate-900') {{ rev.reviewer_name || 'Verified Buyer' }}
              span(class='text-amber-400') {{ '★'.repeat(rev.rating) }}
            p(class='text-xs text-slate-600 leading-relaxed') {{ rev.comment }}
        
        div(v-else, class='text-center py-6 text-xs text-slate-500')
          p No reviews yet. Be the first to share your experience with this item!
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StoreLayout from '@/components/StoreLayout.vue';
import { api, formatPrice } from '@/helpers';
import { mainStore } from '@/store';

const route = useRoute();
const router = useRouter();

const product = ref(null);
const activeImage = ref('');
const selectedVariant = ref(null);
const quantity = ref(1);
const reviews = ref([]);

const showReviewForm = ref(false);
const reviewRating = ref(5);
const reviewerName = ref('');
const reviewerEmail = ref('');
const reviewComment = ref('');

const galleryImages = computed(() => {
  if (!product.value) {
    return [];
  }
  const list = [];
  if (product.value.primary_image_url) {
    list.push(product.value.primary_image_url);
  }
  if (product.value.images && Array.isArray(product.value.images)) {
    product.value.images.forEach((img) => {
      const url = img.url || img;
      if (url && !list.includes(url)) {
        list.push(url);
      }
    });
  }
  return list;
});

const currentPricePaisa = computed(() => {
  if (selectedVariant.value && selectedVariant.value.sellingPricePaisa) {
    return selectedVariant.value.sellingPricePaisa;
  }
  return product.value?.selling_price_paisa || 0;
});

const currentComparePricePaisa = computed(() => {
  if (selectedVariant.value && selectedVariant.value.compareAtPricePaisa) {
    return selectedVariant.value.compareAtPricePaisa;
  }
  return product.value?.compare_at_price_paisa || 0;
});

const discountPercentage = computed(() => {
  if (!currentComparePricePaisa.value || currentComparePricePaisa.value <= currentPricePaisa.value) {
    return 0;
  }
  const diff = currentComparePricePaisa.value - currentPricePaisa.value;
  return Math.round((diff / currentComparePricePaisa.value) * 100);
});

function selectVariant(variant) {
  selectedVariant.value = variant;
  if (variant.imageUrl) {
    activeImage.value = variant.imageUrl;
  }
}

function addToCart() {
  mainStore().addItem(product.value, selectedVariant.value, quantity.value);
  mainStore().success(`Added ${product.value.name} to your cart!`);
  mainStore().openDrawer();
}

function buyNow() {
  mainStore().addItem(product.value, selectedVariant.value, quantity.value);
  router.push('/checkout');
}

async function submitReview() {
  if (!reviewerName.value || !reviewComment.value) {
    mainStore().error('Please provide your name and a short review comment.');
    return;
  }
  try {
    await api.post(`/products/${product.value.id}/reviews`, {
      rating: reviewRating.value,
      name: reviewerName.value,
      email: reviewerEmail.value,
      comment: reviewComment.value,
    });
    mainStore().success('Review submitted successfully!');
    reviews.value.unshift({
      id: Date.now(),
      reviewer_name: reviewerName.value,
      rating: reviewRating.value,
      comment: reviewComment.value,
    });
    showReviewForm.value = false;
    reviewComment.value = '';
  } catch (err) {
    mainStore().error(err.message || 'Unable to submit review.');
  }
}

onMounted(async () => {
  const slug = route.params.slug;
  try {
    const res = await api.get(`/products/${slug}`);
    if (res.success && res.data?.product) {
      product.value = res.data.product;
      activeImage.value = product.value.primary_image_url || (galleryImages.value[0] || '');
      if (product.value.variants && product.value.variants.length > 0) {
        selectedVariant.value = product.value.variants[0];
      }
    }
  } catch {}

  if (product.value?.id) {
    try {
      const revRes = await api.get(`/products/${product.value.id}/reviews`);
      if (revRes.success && revRes.data) {
        reviews.value = revRes.data.reviews || [];
      }
    } catch {}
  }
});
</script>
