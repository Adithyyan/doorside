<template lang="pug">
AdminLayout
  div(class='space-y-6')
    div(class='flex flex-col justify-between gap-4 sm:flex-row sm:items-center')
      div
        h1(class='text-2xl font-black text-slate-900 tracking-tight') Categories Management
        p(class='text-xs text-slate-500 mt-1') Organize product catalog hierarchy and navigation menus.
      
      button(
        class='btn-primary px-4 py-2 rounded-xl text-xs font-bold',
        @click='openCreateModal'
      ) + Add Category

    div(
      v-if='showModal',
      class='fixed inset-0 bg-slate-900 bg-opacity-50 z-50 flex items-center justify-center p-4'
    )
      div(class='bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4')
        div(class='flex items-center justify-between')
          h2(class='text-sm font-black text-slate-900') {{ editingId ? 'Edit Category' : 'Create New Category' }}
          button(class='text-slate-400 hover:text-slate-600', @click='showModal = false') ✕
        
        form(class='space-y-3', @submit.prevent='saveCategory')
          div
            label(class='block text-2xs font-bold text-slate-700 mb-1') Category Name *
            input(
              class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs',
              type='text',
              v-model='form.name',
              required,
              @input='handleNameInput'
            )

          div
            label(class='block text-2xs font-bold text-slate-700 mb-1') Slug *
            input(
              class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono',
              type='text',
              v-model='form.slug',
              required
            )

          div
            label(class='block text-2xs font-bold text-slate-700 mb-1') Description
            textarea(
              class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs',
              rows='2',
              v-model='form.description'
            )

          div(class='grid grid-cols-2 gap-3')
            div
              label(class='block text-2xs font-bold text-slate-700 mb-1') Sort Order
              input(
                class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs',
                type='number',
                min='0',
                v-model.number='form.sortOrder'
              )
            div
              label(class='block text-2xs font-bold text-slate-700 mb-1') Status
              select(
                class='w-full px-3 py-2 rounded-xl border border-slate-200 text-xs',
                v-model='form.isActive'
              )
                option(:value='true') Active
                option(:value='false') Inactive

          div(class='flex items-center gap-2 pt-2')
            input(id='isFeaturedCat', type='checkbox', v-model='form.isFeatured')
            label(class='text-xs font-bold text-slate-700', for='isFeaturedCat') Featured on Homepage

          div(class='flex justify-end gap-2 pt-3')
            button(
              class='px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50',
              type='button',
              @click='showModal = false'
            ) Cancel
            button(
              class='btn-primary px-5 py-2 rounded-xl text-xs font-bold',
              type='submit',
              :disabled='isSaving'
            )
              span(v-if='!isSaving') Save
              span(v-else) Saving...

    div(class='bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden')
      div(class='overflow-x-auto')
        table(class='w-full text-left border-collapse')
          thead(class='bg-slate-50 border-b border-slate-200 text-2xs font-bold text-slate-500 uppercase tracking-wider')
            tr
              th(class='px-6 py-3.5') Category Name
              th(class='px-6 py-3.5') Slug
              th(class='px-6 py-3.5') Sort Order
              th(class='px-6 py-3.5') Featured
              th(class='px-6 py-3.5') Status
              th(class='px-6 py-3.5') Actions
          tbody(class='divide-y divide-slate-100 text-xs')
            tr(
              v-for='cat in categories',
              :key='cat.id',
              class='transition-colors hover:bg-slate-50'
            )
              td(class='py-4 px-6')
                div(class='font-extrabold text-slate-900') {{ cat.name }}
                div(class='text-2xs text-slate-400') {{ cat.description || 'No description' }}
              td(class='py-4 px-6 font-mono text-slate-500') {{ cat.slug }}
              td(class='py-4 px-6 font-bold text-slate-700') {{ cat.sort_order }}
              td(class='py-4 px-6')
                span(
                  class='text-2xs px-2 py-0.5 rounded-full font-bold',
                  :class='cat.is_featured ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-500"'
                ) {{ cat.is_featured ? 'Yes' : 'No' }}
              td(class='py-4 px-6')
                span(
                  class='text-2xs px-2 py-0.5 rounded-full font-bold',
                  :class='cat.is_active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"'
                ) {{ cat.is_active ? 'Active' : 'Inactive' }}
              td(class='py-4 px-6')
                div(class='flex items-center gap-2')
                  button(
                    class='rounded-lg border border-slate-200 text-slate-700 font-semibold p-1.5 hover:bg-slate-100',
                    @click='openEditModal(cat)'
                  ) ✏️ Edit
                  button(
                    class='rounded-lg border border-rose-200 text-rose-600 p-1.5 hover:bg-rose-50',
                    @click='deleteCategory(cat.id)'
                  ) 🗑️

            tr(v-if='categories.length === 0 && !isLoading')
              td(class='py-12 text-center text-slate-400', colspan='6')
                p(class='text-xs font-semibold') No categories found. Click "+ Add Category" to create one.

            tr(v-if='isLoading')
              td(class='py-12 text-center text-slate-400', colspan='6')
                | Loading categories...
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/components/AdminLayout.vue';
import { mainStore } from '@/store';
import { api } from '@/helpers';


const categories = ref([]);
const isLoading = ref(true);
const showModal = ref(false);
const editingId = ref(null);
const isSaving = ref(false);

const form = ref({
  name: '',
  slug: '',
  description: '',
  sortOrder: 0,
  isActive: true,
  isFeatured: false,
});

function handleNameInput() {
  if (!editingId.value && !form.value.slug) {
    form.value.slug = form.value.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

function openCreateModal() {
  editingId.value = null;
  form.value = {
    name: '',
    slug: '',
    description: '',
    sortOrder: categories.value.length,
    isActive: true,
    isFeatured: false,
  };
  showModal.value = true;
}

function openEditModal(cat) {
  editingId.value = cat.id;
  form.value = {
    name: cat.name,
    slug: cat.slug,
    description: cat.description || '',
    sortOrder: cat.sort_order || 0,
    isActive: cat.is_active ?? true,
    isFeatured: cat.is_featured ?? false,
  };
  showModal.value = true;
}

async function saveCategory() {
  isSaving.value = true;
  try {
    if (editingId.value) {
      await api.patch(`/admin/categories/${editingId.value}`, form.value);
      mainStore().toast('Category updated', 'success');
    } else {
      await api.post('/admin/categories', form.value);
      mainStore().toast('Category created', 'success');
    }
    showModal.value = false;
    await getCategories();
  } catch (err) {
    mainStore().toast(err.message || 'Failed to save category', 'error');
  } finally {
    isSaving.value = false;
  }
}

async function deleteCategory(id) {
  if (!confirm('Are you sure you want to delete this category?')) {
    return;
  }
  try {
    await api.delete(`/admin/categories/${id}`);
    mainStore().toast('Category deleted', 'info');
    await getCategories();
  } catch (err) {
    mainStore().toast(err.message || 'Failed to delete category', 'error');
  }
}

async function getCategories() {
  isLoading.value = true;
  try {
    const res = await api.get('/admin/categories?pageSize=100');
    if (res.success && res.data) {
      categories.value = res.data.items || [];
    }
  } catch {
    categories.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getCategories();
});
</script>
