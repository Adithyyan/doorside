export const config = {
  general: {
    brand_name: 'Store',
    support_email: 'support@example.com',
    support_phone: '+91 98765 43210',
    whatsapp_number: '+91 98765 43210',
    address: 'Bangalore, India',
  },
  branding: {
    tagline: 'Premium Curated Collection',
    primary_color: '#0f172a',
    accent_color: '#f59e0b',
    secondary_color: '#64748b',
    background_color: '#ffffff',
  },
  storefront: {
    announcement_bar_enabled: 'true',
    announcement_bar_text: 'Free Express Shipping on Prepaid Orders Above ₹499!',
    hero_heading: 'Elevate Your Everyday Style',
    hero_description: 'Discover trending lifestyle essentials crafted for modern living.',
    hero_cta_text: 'Shop New Arrivals',
  },
  checkout: {
    cod_enabled: 'true',
    prepaid_enabled: 'true',
    cod_fee_paisa: 0,
    free_shipping_threshold_paisa: 49900,
    default_shipping_fee_paisa: 4900,
  },
};

export default config;
