import dayjs from 'dayjs';

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const token = endpoint.startsWith('/admin')
    ? (localStorage.getItem('admin_access_token') || localStorage.getItem('access_token'))
    : (localStorage.getItem('access_token') || localStorage.getItem('admin_access_token'));
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    throw new Error('Network error. Please check your internet connection.');
  }

  if (response.status === 401 && !options._retry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        config.headers.Authorization = `Bearer ${newToken}`;
        return request(endpoint, { ...options, _retry: true });
      });
    }

    options._retry = true;
    isRefreshing = true;

    try {
      const refreshUrl = endpoint.startsWith('/admin')
        ? `${API_BASE}/admin/auth/refresh`
        : `${API_BASE}/auth/refresh`;
      const refreshResponse = await fetch(refreshUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const refreshData = await refreshResponse.json();

      if (refreshResponse.ok && refreshData.success && refreshData.data?.accessToken) {
        const newToken = refreshData.data.accessToken;
        if (endpoint.startsWith('/admin')) {
          localStorage.setItem('admin_access_token', newToken);
        } else {
          localStorage.setItem('access_token', newToken);
        }

        processQueue(null, newToken);
        config.headers.Authorization = `Bearer ${newToken}`;
        return request(endpoint, options);
      }
      processQueue(new Error('Session expired'), null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('admin_access_token');
      throw new Error('Session expired. Please log in again.');
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      throw refreshErr;
    } finally {
      isRefreshing = false;
    }
  }

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message = data?.error?.message || data?.message || `HTTP ${response.status} Error`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    error.code = data?.error?.code;
    throw error;
  }

  return data;
}

const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body, ...options }),
  patch: (endpoint, body, options) => request(endpoint, { method: 'PATCH', body, ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
};

const http = api;

function formatPrice(paisa, currency = 'INR') {
  if (paisa === null || paisa === undefined || Number.isNaN(paisa)) {
    return '₹0';
  }

  const rupees = paisa / 100;

  if (currency === 'INR') {
    const hasDecimals = rupees % 1 !== 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(rupees);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(rupees);
}

function paisaToRupees(paisa) {
  if (!paisa) {
    return 0;
  }
  return (paisa / 100).toFixed(2);
}

function rupeesToPaisa(rupees) {
  if (!rupees) {
    return 0;
  }
  return Math.round(parseFloat(rupees) * 100);
}

function formatDate(dateString, includeTime = false) {
  if (!dateString) {
    return '—';
  }

  const date = dayjs(dateString);
  if (!date.isValid()) {
    return '—';
  }

  return includeTime ? date.format('DD MMM YYYY, hh:mm A') : date.format('DD MMM YYYY');
}

function getOrderStatusBadge(status) {
  const map = {
    placed: { label: 'Placed', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    confirmed: { label: 'Confirmed', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    processing: { label: 'Processing', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    shipped: { label: 'Shipped', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    delivered: { label: 'Delivered', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelled: { label: 'Cancelled', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
    returned: { label: 'Returned', bg: 'bg-gray-50 text-gray-700 border-gray-200' },
    refunded: { label: 'Refunded', bg: 'bg-slate-50 text-slate-700 border-slate-200' },
  };

  return map[status] || { label: status, bg: 'bg-gray-50 text-gray-700 border-gray-200' };
}

function getPaymentStatusBadge(status) {
  const map = {
    pending: { label: 'Payment Pending', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    paid: { label: 'Paid', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    failed: { label: 'Failed', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
    refunded: { label: 'Refunded', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  };

  return map[status] || { label: status, bg: 'bg-gray-50 text-gray-700 border-gray-200' };
}

function getFulfillmentStatusBadge(status) {
  const map = {
    pending: { label: 'Pending Action', bg: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
    manual_action_required: { label: 'Order at Supplier', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
    supplier_ordered: { label: 'Supplier Ordered', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    processing: { label: 'Supplier Processing', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    shipped: { label: 'Shipped by Supplier', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    delivered: { label: 'Delivered', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    failed: { label: 'Fulfillment Failed', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  };

  return map[status] || { label: status, bg: 'bg-gray-50 text-gray-700 border-gray-200' };
}

export {
  api,
  http,
  formatPrice,
  paisaToRupees,
  rupeesToPaisa,
  formatDate,
  getOrderStatusBadge,
  getPaymentStatusBadge,
  getFulfillmentStatusBadge,
};

export default {
  api,
  http,
  formatPrice,
  paisaToRupees,
  rupeesToPaisa,
  formatDate,
  getOrderStatusBadge,
  getPaymentStatusBadge,
  getFulfillmentStatusBadge,
};
