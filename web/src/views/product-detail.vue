<template lang="pug">
StoreLayout
  div(v-if='product', class='bg-[#f5f5f7] min-h-screen py-8 sm:py-12')
    div(class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10')
      // Breadcrumb Navigation
      nav(class='flex text-xs font-normal text-[#86868b] gap-2 items-center')
        router-link(class='hover:text-[#1d1d1f] hover:underline', to='/') Store
        span /
        router-link(class='hover:text-[#1d1d1f] hover:underline', to='/shop') All Products
        span /
        span(class='text-[#1d1d1f] font-medium truncate max-w-xs') {{ product.name }}

      // Main Product Hero Grid (Left: Showcase Gallery, Right: Details & Purchase)
      div(class='grid grid-cols-1 gap-10 lg:grid-cols-12 items-start')
        // Left: Apple Showcase Gallery
        div(class='space-y-4 lg:col-span-7')
          div(class='aspect-square w-full rounded-[28px] bg-white border border-[rgba(0,0,0,0.08)] shadow-sm flex items-center justify-center p-8 overflow-hidden')
            img(
              class='max-h-full max-w-full object-contain filter drop-shadow-md transition-all duration-300',
              :src='activeImage || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80"',
              :alt='product.name'
            )
          
          // Thumbnail Strip
          div(v-if='galleryImages.length > 1', class='flex gap-3 overflow-x-auto no-scrollbar py-1')
            button(
              v-for='(img, idx) in galleryImages',
              :key='idx',
              class='w-20 h-20 rounded-2xl bg-white border-2 shrink-0 p-2 flex items-center justify-center transition-all',
              :class='activeImage === img ? "border-[#0071e3] shadow-xs" : "border-[#e5e5ea] opacity-70 hover:opacity-100"',
              @click='activeImage = img'
            )
              img(class='max-h-full max-w-full object-contain', :src='img', :alt='`${product.name} view ${idx + 1}`')

        // Right: Apple Product Purchasing Column
        div(class='space-y-6 lg:col-span-5')
          div(class='space-y-2')
            span(class='apple-badge') New
            h1(class='text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] leading-tight')
              | {{ product.name }}

            div(class='flex items-center gap-3 pt-1 text-xs')
              div(class='flex text-amber-400 text-sm')
                span(v-for='s in 5', :key='s') ★
              span(class='text-[#6e6e73]') ({{ reviews.length }} reviews)
              span(class='text-[#1b7a3a] font-medium bg-[#edf7ee] px-2.5 py-0.5 rounded-full') In Stock

          // Price Container (Apple Style)
          div(class='apple-card p-6 bg-white space-y-1')
            div(class='text-xs text-[#6e6e73] font-normal') Total MRP
            div(class='flex items-baseline gap-2.5')
              span(class='text-3xl font-extrabold text-[#1d1d1f]') {{ formatPrice(currentPricePaisa) }}
              span(
                v-if='currentComparePricePaisa > currentPricePaisa',
                class='text-sm text-[#86868b] line-through'
              ) {{ formatPrice(currentComparePricePaisa) }}
              span(
                v-if='discountPercentage > 0',
                class='text-xs font-bold text-[#bf4800] bg-[#fff0e6] px-2 py-0.5 rounded-full'
              ) {{ discountPercentage }}% OFF
            p(class='text-xs text-[#86868b] pt-1')
              | Inclusive of all taxes. Free shipping on orders over {{ formatPrice(mainStore().freeShippingThreshold) }}.

          // Product Summary
          p(v-if='product.short_description', class='text-sm text-[#6e6e73] leading-relaxed')
            | {{ product.short_description }}

          // Variants Selector (Apple Pill Style)
          div(v-if='product.variants && product.variants.length > 0', class='space-y-2.5')
            label(class='block text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider')
              | Finish / Option: 
              span(class='text-[#0071e3] font-bold') {{ selectedVariant?.name || 'Standard' }}
            div(class='flex flex-wrap gap-2.5')
              button(
                v-for='variant in product.variants',
                :key='variant.id',
                class='px-4 py-2 text-xs font-medium rounded-full border transition-all',
                :class='selectedVariant?.id === variant.id ? "border-[#0071e3] bg-[#0071e3] text-white shadow-xs" : "border-[#d2d2d7] bg-white text-[#1d1d1f] hover:border-[#1d1d1f]"',
                @click='selectVariant(variant)'
              ) {{ variant.name }}

          // Quantity Selector
          div(class='space-y-2')
            label(class='block text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider') Quantity
            div(class='flex items-center gap-3')
              div(class='flex items-center border border-[#d2d2d7] rounded-full bg-white px-2 py-1')
                button(
                  class='w-7 h-7 flex items-center justify-center text-sm font-bold text-[#6e6e73] hover:text-[#1d1d1f]',
                  @click='quantity = Math.max(1, quantity - 1)'
                ) −
                span(class='w-10 text-center text-xs font-bold text-[#1d1d1f]') {{ quantity }}
                button(
                  class='w-7 h-7 flex items-center justify-center text-sm font-bold text-[#6e6e73] hover:text-[#1d1d1f]',
                  @click='quantity++'
                ) +
              span(class='text-xs text-[#86868b]') Max 10 per order

          // Apple Style Action Buttons
          div(class='space-y-3 pt-2')
            button(
              class='w-full apple-btn-primary py-3.5 text-sm font-semibold shadow-md',
              @click='addToCart'
            ) Add to Bag
            
            button(
              class='w-full apple-btn-secondary py-3.5 text-sm font-semibold',
              @click='buyNow'
            ) Instant Checkout ⚡

          // Apple Guarantee & Delivery Callouts
          div(class='apple-card p-5 bg-white space-y-3 text-xs text-[#6e6e73]')
            div(class='flex items-center gap-3')
              span(class='text-lg') 🚚
              span
                strong(class='text-[#1d1d1f]') Free Standard Delivery:
                |  Dispatches in 24 hours. Delivered within 3-5 business days across India.
            div(class='flex items-center gap-3')
              span(class='text-lg') 🔄
              span
                strong(class='text-[#1d1d1f]') 7-Day Returns:
                |  Hassle-free replacement if an item arrives damaged or defective.
            div(class='flex items-center gap-3')
              span(class='text-lg') 🔒
              span
                strong(class='text-[#1d1d1f]') Secure Transactions:
                |  All major cards, UPI, NetBanking, and Cash on Delivery accepted.

      // Extended Product Description & Technical Specs
      div(class='apple-card p-8 sm:p-12 bg-white space-y-6')
        h2(class='text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight')
          | Overview & Product Details
        div(class='prose text-sm text-[#424245] leading-relaxed max-w-none')
          p {{ product.description || product.short_description || 'Crafted with premium materials and tested rigorously for performance and longevity.' }}

      // Customer Reviews Section
      div(class='apple-card p-8 sm:p-12 bg-white space-y-6')
        div(class='flex flex-col sm:flex-row sm:items-center justify-between gap-4')
          div
            h2(class='text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight') Customer Reviews
            p(class='text-xs text-[#6e6e73] mt-1') Verified customer ratings and feedback
          
          button(
            class='apple-btn-secondary text-xs px-5 py-2.5',
            @click='showReviewForm = !showReviewForm'
          ) Write a Review

        // Review Submission Form
        div(v-if='showReviewForm', class='p-6 bg-[#f5f5f7] rounded-2xl space-y-4 border border-[#e5e5ea]')
          h3(class='text-sm font-bold text-[#1d1d1f]') Submit Your Rating
          div(class='flex items-center gap-2')
            span(class='text-xs text-[#6e6e73]') Rating:
            select(class='px-3 py-1.5 text-xs bg-white border border-[#d2d2d7] rounded-lg', v-model='reviewRating')
              option(:value='5') 5 Stars - Exceptional
              option(:value='4') 4 Stars - Very Good
              option(:value='3') 3 Stars - Average
              option(:value='2') 2 Stars - Below Average
              option(:value='1') 1 Star - Poor
          
          div(class='grid grid-cols-1 sm:grid-cols-2 gap-3')
            input(
              class='px-3 py-2 text-xs bg-white border border-[#d2d2d7] rounded-lg',
              type='text',
              placeholder='Your name',
              v-model='reviewerName'
            )
            input(
              class='px-3 py-2 text-xs bg-white border border-[#d2d2d7] rounded-lg',
              type='email',
              placeholder='Your email',
              v-model='reviewerEmail'
            )
          
          textarea(
            class='w-full px-3 py-2 text-xs bg-white border border-[#d2d2d7] rounded-lg',
            rows='3',
            placeholder='Share your thoughts about this product...',
            v-model='reviewComment'
          )
          
          div(class='flex justify-end gap-2')
            button(
              class='apple-btn-secondary text-xs px-4 py-1.5',
              @click='showReviewForm = false'
            ) Cancel
            button(
              class='apple-btn-primary text-xs px-5 py-1.5',
              @click='submitReview'
            ) Post Review

        // Reviews List
        div(v-if='reviews.length > 0', class='divide-y divide-[#f5f5f7] space-y-4 pt-2')
          div(v-for='rev in reviews', :key='rev.id', class='pt-4 space-y-1.5')
            div(class='flex items-center justify-between text-xs')
              span(class='font-bold text-[#1d1d1f]') {{ rev.reviewer_name || 'Verified Buyer' }}
              span(class='text-amber-400') {{ '★'.repeat(rev.rating) }}
            p(class='text-xs text-[#424245] leading-relaxed') {{ rev.comment }}
        
        div(v-else, class='text-center py-6 text-xs text-[#6e6e73]')
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
  if (!product.value) return [];
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
    const res = await api.post(`/products/${product.value.id}/reviews`, {
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
  } catch {
    // handled gracefully
  }

  // Load reviews
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
