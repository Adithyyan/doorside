<template lang="pug">
AdminLayout
  div(class='max-w-4xl mx-auto space-y-8')
    div(class='flex items-center justify-between gap-4')
      div(class='flex items-center gap-3')
        router-link(
          class='p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
          to='/admin/products',
          title='Back to Products'
        ) ←
        div
          h1(class='text-2xl font-black text-slate-900') {{ isEditMode ? 'Edit Product' : 'Create New Product' }}
          p(class='text-xs text-slate-500') {{ isEditMode ? 'Update product pricing, stock, and supplier mapping' : `Add a new product to your ${$brandName.toLowerCase()} catalog` }}

      div(class='flex items-center gap-3')
        router-link(
          class='px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50',
          to='/admin/products'
        ) Cancel
        button(
          class='btn-primary px-5 py-2 rounded-xl text-xs font-bold',
          @click='saveProduct',
          :disabled='isSaving'
        )
          span(v-if='!isSaving') {{ isEditMode ? 'Save Changes' : 'Create Product' }}
          span(v-else) Saving...

    form(class='space-y-6', @submit.prevent='saveProduct')
      div(class='bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4')
        h2(class='text-sm font-black text-slate-900 uppercase tracking-wider') Basic Product Information
        
        div
          label(class='block text-xs font-bold text-slate-700 mb-1') Product Name / Title *
          input(
            class='w-full py-2 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900',
            type='text',
            v-model='form.name',
            placeholder='e.g. Stainless Steel Thermal Travel Mug 500ml',
            required,
            @input='handleNameInput'
          )

        div(class='grid grid-cols-1 gap-4 sm:grid-cols-2')
          div
            label(class='block text-xs font-bold text-slate-700 mb-1') URL Slug *
            input(
              class='w-full py-2 px-3.5 rounded-xl border border-slate-200 text-xs font-mono',
              type='text',
              v-model='form.slug',
              placeholder='e.g. thermal-travel-mug',
              required
            )
          
          div
            label(class='block text-xs font-bold text-slate-700 mb-1') Category
            select(
              class='w-full py-2 px-3.5 rounded-xl border border-slate-200 text-xs bg-white',
              v-model='form.categoryId'
            )
              option(value='') Select Category
              option(v-for='cat in categories', :key='cat.id', :value='cat.id') {{ cat.name }}

        div
          label(class='block text-xs font-bold text-slate-700 mb-1') Short Catchy Summary
          input(
            class='w-full py-2 px-3.5 rounded-xl border border-slate-200 text-xs',
            type='text',
            v-model='form.shortDescription',
            placeholder='e.g. Keeps beverages hot for 12 hours. Leak-proof and BPA free.'
          )

        div
          label(class='block text-xs font-bold text-slate-700 mb-1') Complete Description
          textarea(
            class='w-full rounded-xl border border-slate-200 text-xs px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900',
            rows='5',
            v-model='form.description',
            placeholder='Detailed features, specifications, package contents, and usage guidelines...'
          )

      div(class='bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4')
        div(class='flex items-center justify-between')
          h2(class='text-sm font-black text-slate-900 uppercase tracking-wider') Pricing & Profit Margins
          span(
            class='text-xs font-black py-1 px-2.5 rounded-full',
            :class='profitMargin > 0 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"'
          )
            | Estimated Margin: {{ profitMargin }}%

        div(class='grid grid-cols-1 gap-4 sm:grid-cols-3')
          div
            label(class='block text-xs font-bold text-slate-700 mb-1') Retail Selling Price (₹) *
            input(
              class='w-full py-2 px-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900',
              type='number',
              step='1',
              min='0',
              v-model.number='sellingPriceRupees',
              placeholder='e.g. 799',
              required
            )
            p(class='text-2xs text-slate-400 mt-1') Price customer pays on your store

          div
            label(class='block text-xs font-bold text-slate-700 mb-1') Compare-at Price / MRP (₹)
            input(
              class='w-full py-2 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-600',
              type='number',
              step='1',
              min='0',
              v-model.number='compareAtPriceRupees',
              placeholder='e.g. 1499'
            )
            p(class='text-2xs text-slate-400 mt-1') Crossed-out anchor price

          div
            label(class='block text-xs font-bold text-slate-700 mb-1') Supplier Cost Price (₹)
            input(
              class='w-full py-2 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-600',
              type='number',
              step='1',
              min='0',
              v-model.number='costPriceRupees',
              placeholder='e.g. 299'
            )
            p(class='text-2xs text-slate-400 mt-1') Your purchase cost at Meesho / supplier

      div(class='bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4')
        h2(class='text-sm font-black text-slate-900 uppercase tracking-wider') {{ $brandName }} Supplier Connection
        p(class='text-xs text-slate-500') Link this product to Meesho, IndiaMART, or wholesale suppliers for fast 1-click fulfillment.

        div(class='grid grid-cols-1 gap-4 sm:grid-cols-2')
          div
            label(class='block text-xs font-bold text-slate-700 mb-1') Preferred Supplier
            select(
              class='w-full py-2 px-3.5 rounded-xl border border-slate-200 text-xs bg-white',
              v-model='form.supplierId'
            )
              option(value='') Select Supplier
              option(v-for='sup in suppliers', :key='sup.id', :value='sup.id') {{ sup.name }} ({{ sup.code }})

          div
            label(class='block text-xs font-bold text-slate-700 mb-1') Supplier Product SKU / Code
            input(
              class='w-full py-2 px-3.5 rounded-xl border border-slate-200 text-xs font-mono',
              type='text',
              v-model='form.supplierSku',
              placeholder='e.g. MSH-PROD-98124'
            )

        div
          label(class='block text-xs font-bold text-slate-700 mb-1') Direct Supplier URL (Meesho / IndiaMART link)
          input(
            class='w-full py-2 px-3.5 rounded-xl border border-slate-200 text-xs',
            type='url',
            v-model='form.supplierProductUrl',
            placeholder='https://www.meesho.com/s/p/...'
          )
          p(class='text-2xs text-slate-400 mt-1') When an order is placed, admin clicks this link to buy immediately.

        div
          label(class='block text-xs font-bold text-slate-700 mb-1') Fulfillment Instructions / Notes
          input(
            class='w-full py-2 px-3.5 rounded-xl border border-slate-200 text-xs',
            type='text',
            v-model='form.supplierNotes',
            placeholder='e.g. Always choose Blue color option; supplier ships in 24h'
          )

      div(class='bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4')
        h2(class='text-sm font-black text-slate-900 uppercase tracking-wider') Inventory & Status
        
        div(class='grid grid-cols-1 gap-4 sm:grid-cols-3')
          div
            label(class='block text-xs font-bold text-slate-700 mb-1') Store SKU
            input(
              class='w-full py-2 px-3.5 rounded-xl border border-slate-200 text-xs font-mono',
              type='text',
              v-model='form.sku',
              placeholder='e.g. MUG-BLK-500'
            )

          div
            label(class='block text-xs font-bold text-slate-700 mb-1') Stock Quantity
            input(
              class='w-full py-2 px-3.5 rounded-xl border border-slate-200 text-xs',
              type='number',
              min='0',
              v-model.number='form.stockQuantity'
            )

          div
            label(class='block text-xs font-bold text-slate-700 mb-1') Low Stock Alert Threshold
            input(
              class='w-full py-2 px-3.5 rounded-xl border border-slate-200 text-xs',
              type='number',
              min='1',
              v-model.number='form.lowStockThreshold'
            )

        div(class='flex flex-wrap items-center gap-6 pt-2')
          div(class='flex items-center gap-2')
            input(id='isActive', type='checkbox', v-model='form.isActive')
            label(class='text-xs font-bold text-slate-700', for='isActive') Active (Visible in Storefront)

          div(class='flex items-center gap-2')
            input(id='isFeatured', type='checkbox', v-model='form.isFeatured')
            label(class='text-xs font-bold text-slate-700', for='isFeatured') Featured Product (Showcase on Homepage)

      div(v-if='isEditMode', class='bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4')
        h2(class='text-sm font-black text-slate-900 uppercase tracking-wider') Product Media
        
        div(class='flex items-center gap-3')
          input(
            class='text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800',
            type='file',
            accept='image/*',
            @change='handleImageUpload',
            :disabled='isUploadingImage'
          )
          span(v-if='isUploadingImage', class='text-2xs text-slate-400') Uploading image...

        div(v-if='productImages.length > 0', class='grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4')
          div(
            v-for='img in productImages',
            :key='img.id',
            class='relative group rounded-xl overflow-hidden border border-slate-200'
          )
            img(
              class='w-full aspect-square object-cover',
              :src='img.url',
              :alt='img.altText || form.name'
            )
            div(
              v-if='img.isPrimary',
              class='absolute top-2 left-2 bg-slate-900 text-white text-2xs font-bold rounded px-1.5 py-0.5'
            ) Primary
            button(
              class='absolute top-2 right-2 bg-rose-600 text-white rounded-full p-1 text-2xs opacity-0 transition-opacity group-hover:opacity-100',
              type='button',
              @click='removeImage(img.id)'
            ) ✕
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdminLayout from '@/components/AdminLayout.vue';
import { mainStore } from '@/store';
import { api } from '@/helpers';

const route = useRoute();
const router = useRouter();

const isEditMode = computed(() => !!route.params.id);
const isSaving = ref(false);
const isUploadingImage = ref(false);

const categories = ref([]);
const suppliers = ref([]);
const productImages = ref([]);

const sellingPriceRupees = ref(999);
const compareAtPriceRupees = ref(1999);
const costPriceRupees = ref(399);

const form = ref({
  name: '',
  slug: '',
  categoryId: '',
  shortDescription: '',
  description: '',
  sku: '',
  stockQuantity: 100,
  lowStockThreshold: 5,
  isActive: true,
  isFeatured: false,
  status: 'active',
  supplierId: '',
  supplierSku: '',
  supplierProductUrl: '',
  supplierNotes: '',
});

const profitMargin = computed(() => {
  if (!sellingPriceRupees.value || !costPriceRupees.value || sellingPriceRupees.value <= 0) {
    return 0;
  }
  return Math.round(((sellingPriceRupees.value - costPriceRupees.value) / sellingPriceRupees.value) * 100);
});

function handleNameInput() {
  if (!isEditMode.value && !form.value.slug) {
    form.value.slug = form.value.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

async function handleImageUpload(e) {
  const file = e.target.files?.[0];
  if (!file || !route.params.id) {
    return;
  }

  isUploadingImage.value = true;
  const formData = new FormData();
  formData.append('image', file);
  formData.append('isPrimary', productImages.value.length === 0 ? 'true' : 'false');

  try {
    const res = await api.post(`/admin/products/${route.params.id}/images`, formData);
    if (res.success) {
      mainStore().toast('Image uploaded successfully', 'success');
      await getProductDetails();
    }
  } catch (err) {
    mainStore().toast(err.message || 'Image upload failed', 'error');
  } finally {
    isUploadingImage.value = false;
  }
}

async function removeImage(imageId) {
  if (!confirm('Remove this image?')) {
    return;
  }
  try {
    await api.delete(`/admin/products/${route.params.id}/images/${imageId}`);
    mainStore().toast('Image removed', 'info');
    await getProductDetails();
  } catch (err) {
    mainStore().toast(err.message || 'Failed to remove image', 'error');
  }
}

async function saveProduct() {
  if (!form.value.name.trim()) {
    mainStore().toast('Product name is required', 'error');
    return;
  }

  isSaving.value = true;

  const payload = {
    ...form.value,
    sellingPricePaisa: Math.round((sellingPriceRupees.value || 0) * 100),
    compareAtPricePaisa: compareAtPriceRupees.value ? Math.round(compareAtPriceRupees.value * 100) : null,
    costPricePaisa: costPriceRupees.value ? Math.round(costPriceRupees.value * 100) : null,
    supplierCostPricePaisa: costPriceRupees.value ? Math.round(costPriceRupees.value * 100) : null,
    status: form.value.isActive ? 'active' : 'draft',
    categoryId: form.value.categoryId || null,
    supplierId: form.value.supplierId || null,
  };

  try {
    if (isEditMode.value) {
      const res = await api.patch(`/admin/products/${route.params.id}`, payload);
      if (res.success) {
        mainStore().toast('Product updated successfully', 'success');
        router.push('/admin/products');
      }
    } else {
      const res = await api.post('/admin/products', payload);
      if (res.success) {
        mainStore().toast('Product created successfully', 'success');
        router.push('/admin/products');
      }
    }
  } catch (err) {
    mainStore().toast(err.message || 'Failed to save product', 'error');
  } finally {
    isSaving.value = false;
  }
}

async function getProductDetails() {
  if (!route.params.id) {
    return;
  }
  try {
    const res = await api.get(`/admin/products/${route.params.id}`);
    if (res.success && res.data?.product) {
      const p = res.data.product;
      form.value = {
        name: p.name || '',
        slug: p.slug || '',
        categoryId: p.category_id || '',
        shortDescription: p.short_description || '',
        description: p.description || '',
        sku: p.sku || '',
        stockQuantity: p.stock_quantity ?? 100,
        lowStockThreshold: p.low_stock_threshold ?? 5,
        isActive: p.is_active ?? true,
        isFeatured: p.is_featured ?? false,
        status: p.status || 'active',
        supplierId: p.supplier_id || '',
        supplierSku: p.supplier_sku_mapping || '',
        supplierProductUrl: p.supplier_product_url || '',
        supplierNotes: p.supplier_notes || '',
      };
      sellingPriceRupees.value = (p.selling_price_paisa || 0) / 100;
      compareAtPriceRupees.value = p.compare_at_price_paisa ? p.compare_at_price_paisa / 100 : null;
      costPriceRupees.value = p.cost_price_paisa ? p.cost_price_paisa / 100 : (p.supplier_cost_price_paisa ? p.supplier_cost_price_paisa / 100 : null);
      productImages.value = p.images || [];
    }
  } catch (err) {
    mainStore().toast('Could not load product', 'error');
  }
}

onMounted(async () => {
  try {
    const [catRes, supRes] = await Promise.all([
      api.get('/categories'),
      api.get('/admin/suppliers'),
    ]);
    if (catRes.success) {
      categories.value = catRes.data?.categories || [];
    }
    if (supRes.success) {
      suppliers.value = supRes.data?.suppliers || [];
    }
  } catch {
    // Non-blocking
  }

  if (isEditMode.value) {
    await getProductDetails();
  }
});
</script>
