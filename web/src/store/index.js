import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import dayjs from 'dayjs';
import { api } from '@/helpers';
import config from '@/config';

export const main = defineStore('main', () => {
  let toastMsg = ref({ msg: '', type: '' });
  let timeOutId = ref(undefined);

  let user = ref(useLocalStorage('customer', null));
  let token = ref(useLocalStorage('access_token', ''));
  let adminUser = ref(useLocalStorage('admin_user', null));
  let adminToken = ref(useLocalStorage('admin_access_token', ''));

  let cart = ref(useLocalStorage('cart', []));
  let cartMap = ref(useLocalStorage('cartMap', {}));
  let isCartDrawerOpen = ref(false);

  let isSideMenuOpen = ref(false);
  let isLoginModal = ref(false);

  let settings = ref(useLocalStorage('settings', config));
  let isLoaded = ref(false);

  // Computed Accessors
  const isCustomerLoggedIn = computed(() => !!(user.value && token.value));
  const isAdminLoggedIn = computed(() => !!(adminUser.value && adminToken.value));
  const customer = computed(() => user.value);
  const items = computed(() => cart.value);

  const brandName = computed(() => settings.value?.general?.brand_name || 'Store');
  const tagline = computed(() => settings.value?.branding?.tagline || '');
  const supportEmail = computed(() => settings.value?.general?.support_email || '');
  const supportPhone = computed(() => settings.value?.general?.support_phone || '');
  const whatsappNumber = computed(() => settings.value?.general?.whatsapp_number || '');
  const announcement = computed(() => settings.value?.storefront?.announcement_bar_text || '');
  const heroHeading = computed(() => settings.value?.storefront?.hero_heading || '');
  const heroDescription = computed(() => settings.value?.storefront?.hero_description || '');
  const heroCta = computed(() => settings.value?.storefront?.hero_cta_text || 'Shop Now');
  const heroImage = computed(() => settings.value?.storefront?.hero_image_url || '');

  const freeShippingThreshold = computed(() => settings.value?.checkout?.free_shipping_threshold_paisa ?? 49900);
  const shippingFee = computed(() => settings.value?.checkout?.default_shipping_fee_paisa ?? 4900);
  const codEnabled = computed(() => settings.value?.checkout?.cod_enabled !== 'false');
  const prepaidEnabled = computed(() => settings.value?.checkout?.prepaid_enabled !== 'false');

  const totalItems = computed(() => {
    return cart.value.reduce((sum, item) => sum + (item.quantity || 1), 0);
  });

  const subtotalPaisa = computed(() => {
    return cart.value.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  });

  // Toast functions
  function toast(msg, type = 'info') {
    toastMsg.value.msg = msg;
    toastMsg.value.type = type;
    let delayInSeconds = type === 'success' ? 5000 : 10000;
    if (timeOutId.value) {
      clearTimeout(timeOutId.value);
    }
    timeOutId.value = setTimeout(() => {
      toastMsg.value.msg = '';
      toastMsg.value.type = '';
      clearTimeout(timeOutId.value);
    }, delayInSeconds);
  }

  function showToast(msg, type = 'info') {
    toast(msg, type);
  }

  function removeToastMsg() {
    toastMsg.value.msg = '';
    toastMsg.value.type = '';
    if (timeOutId.value) {
      clearTimeout(timeOutId.value);
    }
  }

  function success(msg) {
    toast(msg, 'success');
  }

  function error(msg) {
    toast(msg, 'error');
  }

  function info(msg) {
    toast(msg, 'info');
  }

  // User / Auth actions
  function setUser(usr) {
    user.value = usr;
    if (usr) {
      localStorage.setItem('customer', JSON.stringify(usr));
    } else {
      localStorage.removeItem('customer');
    }
  }

  function setToken(val) {
    token.value = val;
    if (val) {
      localStorage.setItem('access_token', val);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  function setAdminUser(adm) {
    adminUser.value = adm;
    if (adm) {
      localStorage.setItem('admin_user', JSON.stringify(adm));
    } else {
      localStorage.removeItem('admin_user');
    }
  }

  function setAdminToken(val) {
    adminToken.value = val;
    if (val) {
      localStorage.setItem('admin_access_token', val);
    } else {
      localStorage.removeItem('admin_access_token');
    }
  }

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.data) {
      setUser(response.data.customer);
      setToken(response.data.accessToken);
      return response.data;
    }
    throw new Error(response.error?.message || 'Login failed');
  }

  async function register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.success && response.data) {
      setUser(response.data.customer);
      setToken(response.data.accessToken);
      return response.data;
    }
    throw new Error(response.error?.message || 'Registration failed');
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore
    } finally {
      setUser(null);
      setToken('');
    }
  }

  async function getProfile() {
    try {
      const response = await api.get('/auth/me');
      if (response.success && response.data) {
        setUser(response.data.customer);
      }
    } catch {
      // Ignore
    }
  }

  async function adminLogin(email, password) {
    const response = await api.post('/admin/auth/login', { email, password });
    if (response.success && response.data) {
      const adminData = response.data.adminUser || response.data.admin;
      setAdminUser(adminData);
      setAdminToken(response.data.accessToken);
      return response.data;
    }
    throw new Error(response.error?.message || 'Admin login failed');
  }

  async function adminLogout() {
    try {
      await api.post('/admin/auth/logout');
    } catch {
      // Ignore
    } finally {
      setAdminUser(null);
      setAdminToken('');
    }
  }

  // Cart operations
  function setCart(items) {
    cart.value = items || [];
  }

  function addItem(product, variant = null, quantity = 1) {
    const variantId = variant ? variant.id : null;
    const existingIndex = cart.value.findIndex(
      (item) => item.product.id === product.id && item.variantId === variantId,
    );

    const price = variant?.sellingPricePaisa || product.selling_price_paisa;
    const comparePrice = variant?.compareAtPricePaisa || product.compare_at_price_paisa;
    const image = variant?.imageUrl || product.primary_image_url;

    if (existingIndex > -1) {
      cart.value[existingIndex].quantity += quantity;
    } else {
      cart.value.push({
        id: `${product.id}-${variantId || 'default'}`,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          primary_image_url: image,
          selling_price_paisa: price,
          compare_at_price_paisa: comparePrice,
          supplier_id: product.supplier_id,
        },
        variantId,
        variantName: variant ? `${variant.option1_value || ''} ${variant.option2_value || ''}`.trim() : null,
        sku: variant?.sku || product.sku,
        price,
        comparePrice,
        quantity,
      });
    }
    isCartDrawerOpen.value = true;
    toast(`Added "${product.name}" to cart`, 'success');
  }

  function deleteCartItem(id) {
    const index = cart.value.findIndex((item) => item.id === id);
    if (index > -1) {
      cart.value.splice(index, 1);
    }
  }

  function removeItem(id) {
    deleteCartItem(id);
  }

  function updateCartQty({ id, qty }) {
    const index = cart.value.findIndex((item) => item.id === id);
    if (index > -1) {
      cart.value[index].quantity = Math.max(1, qty);
    }
  }

  function updateQuantity(id, qty) {
    updateCartQty({ id, qty });
  }

  function clearCart() {
    if (cart.value.length <= 0) {
      toast('Cart is already empty!', 'error');
    } else {
      toast('Cart cleared!', 'success');
    }
    cart.value = [];
    cartMap.value = {};
  }

  function openCart() {
    isCartDrawerOpen.value = true;
  }

  function closeCart() {
    isCartDrawerOpen.value = false;
  }

  async function calculateServerTotals() {
    // Optional server calculation hook
  }

  // Settings
  function setSettings(data) {
    settings.value = {
      ...settings.value,
      ...data,
    };
    applyThemeVariables(data.branding);
  }

  function applyThemeVariables(branding) {
    if (!branding) {
      return;
    }
    const root = document.documentElement;
    if (branding.primary_color) {
      root.style.setProperty('--color-primary', branding.primary_color);
    }
    if (branding.accent_color) {
      root.style.setProperty('--color-accent', branding.accent_color);
    }
    if (branding.secondary_color) {
      root.style.setProperty('--color-secondary', branding.secondary_color);
    }
    if (branding.background_color) {
      root.style.setProperty('--color-background', branding.background_color);
    }
  }

  async function getSettings() {
    try {
      const response = await api.get('/settings/public');
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch {
      applyThemeVariables(settings.value?.branding);
    } finally {
      isLoaded.value = true;
    }
  }

  function getDateWithTime(dateTimeStringTZ) {
    if (dateTimeStringTZ) {
      return dayjs(dateTimeStringTZ).format('MMM DD YYYY HH:mm');
    }
    return 'No Date';
  }

  return {
    toastMsg,
    user,
    token,
    customer,
    adminUser,
    adminToken,
    isCustomerLoggedIn,
    isAdminLoggedIn,

    cart,
    cartMap,
    items,
    totalItems,
    subtotalPaisa,
    isCartDrawerOpen,

    settings,
    isLoaded,
    brandName,
    tagline,
    supportEmail,
    supportPhone,
    whatsappNumber,
    announcement,
    heroHeading,
    heroDescription,
    heroCta,
    heroImage,
    freeShippingThreshold,
    shippingFee,
    codEnabled,
    prepaidEnabled,

    isSideMenuOpen,
    isLoginModal,

    toast,
    showToast,
    removeToastMsg,
    success,
    error,
    info,

    setUser,
    setToken,
    setAdminUser,
    setAdminToken,
    login,
    register,
    logout,
    getProfile,
    adminLogin,
    adminLogout,

    setCart,
    addItem,
    deleteCartItem,
    removeItem,
    updateCartQty,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    calculateServerTotals,

    setSettings,
    getSettings,
    applyThemeVariables,
    getDateWithTime,
  };
});

export const mainStore = main;

export default main;
