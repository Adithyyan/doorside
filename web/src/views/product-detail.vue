<template lang="pug">
StoreLayout
  div(v-if='product', class='bg-page min-h-screen py-8 sm:py-12')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10')
      nav(class='flex text-fine font-medium text-muted gap-2 items-center uppercase tracking-editorial')
        router-link(class='hover:text-ink transition-colors', to='/') Home
        span /
        router-link(class='hover:text-ink transition-colors', to='/shop') All Products
        span /
        span(class='text-ink truncate max-w-xs') {{ product.name }}

      div(class='grid grid-cols-1 gap-10 lg:grid-cols-12 items-start')
        div(class='space-y-4 lg:col-span-7')
          div(class='aspect-portrait w-full bg-white border border-soft flex items-center justify-center p-6 sm:p-10 overflow-hidden relative')
            img(class='max-h-full max-w-full object-contain transition-all duration-300', :src='activeImage || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80"', :alt='product.name')
            span(v-if='discountPercentage > 0', class='absolute top-4 left-4 badge-sale') -{{ discountPercentage }}%
          
          div(v-if='galleryImages.length > 1', class='flex gap-3 overflow-x-auto no-scrollbar py-1')
            button(v-for='(img, idx) in galleryImages', :key='idx', class='w-20 h-24 bg-white border shrink-0 p-2 flex items-center justify-center transition-all cursor-pointer', :class='activeImage === img ? "border-ink shadow-xs" : "border-soft opacity-70 hover:opacity-100"', @click='activeImage = img')
              img(class='max-h-full max-w-full object-cover', :src='img', :alt='`${product.name} view ${idx + 1}`')

        div(class='space-y-6 lg:col-span-5')
          div(class='space-y-2')
            span(class='label-muted') {{ product.category?.name || 'Curated Collection' }}
            h1(class='heading-md text-ink leading-tight') {{ product.name }}

            div(class='flex items-center gap-3 pt-1 text-fine')
              div(class='flex text-ink text-sm')
                span(v-for='s in 5', :key='s') ★
              span(class='text-muted') ({{ reviews.length }} reviews)
              span(class='badge-status-pending') Verified In Stock

          div(class='panel-editorial p-5 space-y-2')
            div(class='label-muted') Special Price
            div(class='flex items-baseline gap-3')
              span(class='text-3xl font-black text-ink font-editorial') {{ formatPrice(currentPricePaisa) }}
              span(v-if='currentComparePricePaisa > currentPricePaisa', class='text-sm text-muted line-through') {{ formatPrice(currentComparePricePaisa) }}
              span(v-if='discountPercentage > 0', class='badge-sale') {{ discountPercentage }}% OFF
            p(class='text-fine text-muted pt-1') Inclusive of all taxes. Free shipping across India on eligible orders.

          p(v-if='product.short_description', class='text-cap text-soft leading-relaxed') {{ product.short_description }}

          div(v-if='product.variants && product.variants.length > 0', class='space-y-2.5')
            label(class='label-ink block')
              | Option / Style: 
              span(class='text-muted ml-1') {{ selectedVariant?.name || 'Standard' }}
            div(class='flex flex-wrap gap-2')
              button(v-for='variant in product.variants', :key='variant.id', class='px-4 py-2 text-fine font-bold uppercase tracking-editorial border transition-all cursor-pointer', :class='selectedVariant?.id === variant.id ? "border-ink bg-ink text-white" : "border-soft bg-white text-ink hover:border-ink"', @click='selectVariant(variant)') {{ variant.name }}

          div(class='space-y-2')
            label(class='label-ink block') Quantity
            div(class='flex items-center gap-3')
              div(class='flex items-center border border-soft bg-white')
                button(class='w-8 h-8 flex items-center justify-center text-sm font-bold text-muted hover:text-ink', @click='quantity = Math.max(1, quantity - 1)') −
                span(class='w-10 text-center text-cap font-semibold text-ink') {{ quantity }}
                button(class='w-8 h-8 flex items-center justify-center text-sm font-bold text-muted hover:text-ink', @click='quantity++') +
              span(class='text-fine text-muted uppercase tracking-editorial') Max 10 per order

          div(class='space-y-3 pt-2')
            button(class='btn-primary w-full py-4 text-center justify-center', @click='addToCart') Add to Bag
            button(class='btn-outline w-full py-4 text-center justify-center', @click='buyNow') Buy Now (Instant Checkout) →

          div(class='grid grid-cols-3 gap-2 border-t border-soft pt-5 text-center text-fine text-muted uppercase tracking-editorial')
            div(class='p-2 bg-page-alt border border-soft')
              div(class='text-base mb-1') ⚡
              p Fast Dispatch
            div(class='p-2 bg-page-alt border border-soft')
              div(class='text-base mb-1') 🛡️
              p 100% Genuine
            div(class='p-2 bg-page-alt border border-soft')
              div(class='text-base mb-1') 🔄
              p 7-Day Returns

      div(class='panel-editorial p-6 sm:p-10 space-y-6')
        div(class='flex gap-8 border-b border-soft')
          button(class='tab-editorial', :class='activeTab === "description" ? "tab-editorial-active" : ""', @click='activeTab = "description"') Description
          button(class='tab-editorial', :class='activeTab === "specs" ? "tab-editorial-active" : ""', @click='activeTab = "specs"') Specifications
          button(class='tab-editorial', :class='activeTab === "reviews" ? "tab-editorial-active" : ""', @click='activeTab = "reviews"') Reviews ({{ reviews.length }})

        div(v-if='activeTab === "description"', class='text-cap text-soft leading-relaxed space-y-4')
          div(v-html='product.description || product.short_description || "Premium product crafted for high durability and performance."')

        div(v-else-if='activeTab === "specs"', class='space-y-3')
          div(class='grid grid-cols-1 sm:grid-cols-2 gap-4 text-cap')
            div(class='p-3 bg-surface border border-soft flex justify-between')
              span(class='label-muted') SKU
              span(class='text-ink font-mono') {{ product.sku || "PROD-GEN" }}
            div(class='p-3 bg-surface border border-soft flex justify-between')
              span(class='label-muted') Category
              span(class='text-ink') {{ product.category?.name || "General" }}
            div(class='p-3 bg-surface border border-soft flex justify-between')
              span(class='label-muted') Shipping
              span(class='text-ink') Nationwide Dispatch
            div(class='p-3 bg-surface border border-soft flex justify-between')
              span(class='label-muted') Guarantee
              span(class='text-ink') 100% Quality Checked

        div(v-else-if='activeTab === "reviews"', class='space-y-6')
          div(class='flex justify-between items-center')
            h3(class='heading-xs text-ink') Customer Feedback
            button(class='btn-outline py-2 px-4 text-fine', @click='showReviewForm = !showReviewForm') {{ showReviewForm ? 'Close Form' : 'Write a Review' }}

          div(v-if='showReviewForm', class='p-5 bg-page-alt border border-soft space-y-4')
            h4(class='label-ink') Share your experience
            div(class='grid grid-cols-1 sm:grid-cols-2 gap-4')
              input(class='input-base', type='text', placeholder='Your Name *', v-model='reviewerName')
              input(class='input-base', type='email', placeholder='Your Email (Optional)', v-model='reviewerEmail')
            div(class='flex items-center gap-2')
              span(class='label-muted') Rating:
              select(class='select-base', v-model='reviewRating')
                option(value='5') 5 Stars - Excellent
                option(value='4') 4 Stars - Very Good
                option(value='3') 3 Stars - Average
                option(value='2') 2 Stars - Poor
                option(value='1') 1 Star - Terrible
            textarea(class='input-base', rows='3', placeholder='Write your review comment...', v-model='reviewComment')
            button(class='btn-primary', @click='submitReview') Submit Review

          div(v-if='reviews.length > 0', class='divide-y divide-soft')
            div(v-for='rev in reviews', :key='rev.id', class='py-4 space-y-1')
              div(class='flex items-center justify-between text-cap')
                span(class='font-bold text-ink') {{ rev.reviewer_name || 'Verified Buyer' }}
                span(class='text-ink text-sm') {{ '★'.repeat(rev.rating) }}
              p(class='text-cap text-soft leading-relaxed') {{ rev.comment }}
          
          div(v-else, class='text-center py-6 text-cap text-muted')
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
const activeTab = ref('description');

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
  mainStore().success(`Added ${product.value.name} to your bag!`);
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
