-- Seed: 001_default_settings.sql
-- Inserts default store settings for all categories

-- GENERAL SETTINGS
insert into store_settings (category, key, value, value_type, label, description, is_public) values
('general', 'brand_name', 'Demo Brand', 'string', 'Brand Name', 'The public name of your store', true),
('general', 'legal_business_name', 'Demo Brand Pvt Ltd', 'string', 'Legal Business Name', 'Your registered business name', false),
('general', 'store_url', 'https://yourdomain.com', 'string', 'Store URL', 'The public URL of your store', true),
('general', 'support_email', 'support@yourdomain.com', 'string', 'Support Email', 'Customer support email', true),
('general', 'support_phone', '+91 XXXXXXXXXX', 'string', 'Support Phone', 'Customer support phone', true),
('general', 'whatsapp_number', '+91 XXXXXXXXXX', 'string', 'WhatsApp Number', 'WhatsApp support number', true),
('general', 'address', 'Your Store Address, City, State - XXXXXX, India', 'string', 'Address', 'Physical/registered address', false),
('general', 'country', 'India', 'string', 'Country', 'Store country', true),
('general', 'currency', 'INR', 'string', 'Currency', 'Store currency code', true),
('general', 'currency_symbol', '₹', 'string', 'Currency Symbol', 'Currency display symbol', true),
('general', 'timezone', 'Asia/Kolkata', 'string', 'Timezone', 'Store timezone', false)
on conflict (category, key) do nothing;

-- BRANDING SETTINGS
insert into store_settings (category, key, value, value_type, label, description, is_public) values
('branding', 'logo_url', '', 'string', 'Logo URL', 'Store logo URL', true),
('branding', 'dark_logo_url', '', 'string', 'Dark Logo URL', 'Dark mode logo URL', true),
('branding', 'favicon_url', '', 'string', 'Favicon URL', 'Store favicon URL', true),
('branding', 'primary_color', '#111827', 'color', 'Primary Color', 'Brand primary color', true),
('branding', 'secondary_color', '#374151', 'color', 'Secondary Color', 'Brand secondary color', true),
('branding', 'accent_color', '#F59E0B', 'color', 'Accent Color', 'Brand accent color', true),
('branding', 'background_color', '#FFFFFF', 'color', 'Background Color', 'Store background color', true),
('branding', 'text_color', '#111827', 'color', 'Text Color', 'Store text color', true),
('branding', 'button_style', 'rounded', 'string', 'Button Style', 'rounded | pill | square', true),
('branding', 'border_radius', '8', 'integer', 'Border Radius (px)', 'Default border radius', true),
('branding', 'tagline', 'Quality products delivered to your door', 'string', 'Tagline', 'Store tagline', true)
on conflict (category, key) do nothing;

-- STOREFRONT SETTINGS
insert into store_settings (category, key, value, value_type, label, description, is_public) values
('storefront', 'homepage_title', 'Welcome to Our Store', 'string', 'Homepage Title', 'Main heading on homepage', true),
('storefront', 'meta_title', 'Demo Brand - Quality Products Online', 'string', 'Meta Title', 'SEO meta title', true),
('storefront', 'meta_description', 'Shop quality products at great prices. Fast delivery across India.', 'string', 'Meta Description', 'SEO meta description', true),
('storefront', 'announcement_bar_enabled', 'false', 'boolean', 'Announcement Bar Enabled', 'Show/hide announcement bar', true),
('storefront', 'announcement_bar_text', 'Free shipping on orders above ₹499!', 'string', 'Announcement Bar Text', 'Announcement bar message', true),
('storefront', 'announcement_bar_color', '#111827', 'color', 'Announcement Bar Color', 'Announcement bar background', true),
('storefront', 'hero_heading', 'Products That Make Your Life Better', 'string', 'Hero Heading', 'Main hero section heading', true),
('storefront', 'hero_description', 'Discover our curated collection of quality everyday products. Fast delivery across India.', 'string', 'Hero Description', 'Hero section description', true),
('storefront', 'hero_cta_text', 'Shop Now', 'string', 'Hero CTA Text', 'Hero button text', true),
('storefront', 'hero_cta_url', '/shop', 'string', 'Hero CTA URL', 'Hero button link', true),
('storefront', 'hero_image_url', '', 'string', 'Hero Image URL', 'Hero background image', true),
('storefront', 'trust_badge_1', 'Free Shipping', 'string', 'Trust Badge 1', 'First trust badge text', true),
('storefront', 'trust_badge_2', 'Easy Returns', 'string', 'Trust Badge 2', 'Second trust badge text', true),
('storefront', 'trust_badge_3', 'Secure Payment', 'string', 'Trust Badge 3', 'Third trust badge text', true),
('storefront', 'trust_badge_4', 'Quality Products', 'string', 'Trust Badge 4', 'Fourth trust badge text', true),
('storefront', 'footer_about_text', 'We bring you the best quality products at affordable prices, delivered right to your door.', 'string', 'Footer About Text', 'Footer about section text', true),
('storefront', 'social_instagram', '', 'string', 'Instagram URL', 'Instagram profile URL', true),
('storefront', 'social_facebook', '', 'string', 'Facebook URL', 'Facebook page URL', true),
('storefront', 'social_youtube', '', 'string', 'YouTube URL', 'YouTube channel URL', true),
('storefront', 'social_twitter', '', 'string', 'Twitter/X URL', 'Twitter/X profile URL', true),
('storefront', 'copyright_text', '© {year} Demo Brand. All rights reserved.', 'string', 'Copyright Text', 'Footer copyright text', true)
on conflict (category, key) do nothing;

-- CHECKOUT SETTINGS
insert into store_settings (category, key, value, value_type, label, description, is_public) values
('checkout', 'cod_enabled', 'true', 'boolean', 'COD Enabled', 'Enable Cash on Delivery', true),
('checkout', 'cod_minimum_order_paisa', '0', 'integer', 'COD Minimum Order (paisa)', 'Minimum order amount for COD (0 = no minimum)', false),
('checkout', 'cod_maximum_order_paisa', '500000', 'integer', 'COD Maximum Order (paisa)', 'Maximum order amount for COD (0 = no limit)', false),
('checkout', 'cod_fee_paisa', '0', 'integer', 'COD Fee (paisa)', 'Extra fee for COD orders', true),
('checkout', 'prepaid_enabled', 'true', 'boolean', 'Prepaid Enabled', 'Enable online payment', true),
('checkout', 'minimum_order_paisa', '0', 'integer', 'Minimum Order Amount (paisa)', 'Minimum order value (0 = no minimum)', true),
('checkout', 'free_shipping_threshold_paisa', '49900', 'integer', 'Free Shipping Threshold (paisa)', 'Order amount for free shipping', true),
('checkout', 'default_shipping_fee_paisa', '4900', 'integer', 'Default Shipping Fee (paisa)', 'Standard shipping fee', true),
('checkout', 'tax_inclusive', 'true', 'boolean', 'Tax Inclusive Pricing', 'Are prices inclusive of tax?', true),
('checkout', 'default_tax_percentage', '0', 'string', 'Default Tax Percentage', 'Default tax rate', false),
('checkout', 'guest_checkout_enabled', 'true', 'boolean', 'Guest Checkout Enabled', 'Allow checkout without account', true),
('checkout', 'coupons_enabled', 'true', 'boolean', 'Coupons Enabled', 'Enable coupon codes', true)
on conflict (category, key) do nothing;

-- ORDER SETTINGS
insert into store_settings (category, key, value, value_type, label, description, is_public) values
('orders', 'order_prefix', 'ORD', 'string', 'Order Number Prefix', 'Prefix for order numbers (e.g. ORD-100001)', false),
('orders', 'auto_cancel_hours', '24', 'integer', 'Auto-Cancel Unpaid Orders (hours)', 'Hours before unpaid orders are cancelled', false),
('orders', 'low_stock_threshold', '5', 'integer', 'Low Stock Threshold', 'Default low stock warning level', false),
('orders', 'tracking_url_format', '', 'string', 'Tracking URL Format', 'URL format with {tracking_number} placeholder', true)
on conflict (category, key) do nothing;

-- SEO SETTINGS
insert into store_settings (category, key, value, value_type, label, description, is_public) values
('seo', 'default_title', 'Demo Brand - Quality Products Online', 'string', 'Default Meta Title', 'Default page title', true),
('seo', 'default_description', 'Shop quality products at great prices. Fast delivery across India.', 'string', 'Default Meta Description', 'Default meta description', true),
('seo', 'og_image_url', '', 'string', 'Open Graph Image URL', 'Default OG image for social sharing', true),
('seo', 'robots_txt', 'User-agent: *\nAllow: /', 'string', 'Robots.txt Content', 'robots.txt file content', false)
on conflict (category, key) do nothing;

-- POLICY PAGES
insert into pages (slug, title, content, meta_title, meta_description, is_published, sort_order) values
('privacy-policy', 'Privacy Policy', '<h1>Privacy Policy</h1><p>This is a placeholder. Please update with your actual privacy policy.</p>', 'Privacy Policy', 'Our privacy policy', true, 1),
('terms-and-conditions', 'Terms and Conditions', '<h1>Terms and Conditions</h1><p>This is a placeholder. Please update with your actual terms and conditions.</p>', 'Terms and Conditions', 'Our terms and conditions', true, 2),
('refund-policy', 'Refund Policy', '<h1>Refund Policy</h1><p>This is a placeholder. Please update with your actual refund policy.</p>', 'Refund Policy', 'Our refund policy', true, 3),
('shipping-policy', 'Shipping Policy', '<h1>Shipping Policy</h1><p>This is a placeholder. Please update with your actual shipping policy.</p>', 'Shipping Policy', 'Our shipping policy', true, 4),
('cancellation-policy', 'Cancellation Policy', '<h1>Cancellation Policy</h1><p>This is a placeholder. Please update with your actual cancellation policy.</p>', 'Cancellation Policy', 'Our cancellation policy', true, 5),
('about', 'About Us', '<h1>About Us</h1><p>This is a placeholder. Please update with your actual about us content.</p>', 'About Us', 'Learn about us', true, 6),
('contact', 'Contact Us', '<h1>Contact Us</h1><p>This is a placeholder. Please update with your actual contact information.</p>', 'Contact Us', 'Contact us', true, 7),
('faq', 'Frequently Asked Questions', '<h1>FAQ</h1><p>This is a placeholder. Please update with your actual FAQ content.</p>', 'FAQ', 'Frequently asked questions', true, 8)
on conflict (slug) do nothing;

-- DEFAULT HOMEPAGE SECTIONS
insert into homepage_sections (section_type, title, content, is_enabled, sort_order) values
('announcement_bar', 'Announcement Bar', '{"text": "Free shipping on orders above ₹499!", "color": "#111827", "text_color": "#FFFFFF"}', false, 0),
('hero', 'Hero Section', '{"heading": "Products That Make Your Life Better", "description": "Discover our curated collection of quality everyday products.", "cta_text": "Shop Now", "cta_url": "/shop"}', true, 1),
('featured_categories', 'Featured Categories', '{"title": "Shop by Category", "category_ids": []}', true, 2),
('featured_products', 'Featured Products', '{"title": "Featured Products", "product_ids": []}', true, 3),
('why_us', 'Why Shop With Us', '{"title": "Why Choose Us", "items": [{"icon": "truck", "title": "Fast Delivery", "description": "Delivered to your door across India"}, {"icon": "shield", "title": "Secure Payment", "description": "100% secure payment processing"}, {"icon": "refresh", "title": "Easy Returns", "description": "Hassle-free return policy"}, {"icon": "star", "title": "Quality Products", "description": "Carefully curated quality products"}]}', true, 4),
('best_sellers', 'Best Sellers', '{"title": "Best Sellers", "product_ids": []}', true, 5),
('reviews', 'Customer Reviews', '{"title": "What Our Customers Say"}', true, 6),
('faq', 'FAQ', '{"title": "Frequently Asked Questions", "items": [{"question": "How long does delivery take?", "answer": "We typically deliver within 5-7 business days."}, {"question": "What is your return policy?", "answer": "We offer a 7-day return policy on most items."}, {"question": "Is COD available?", "answer": "Yes, Cash on Delivery is available across India."}]}', true, 7)
on conflict do nothing;

-- DEFAULT ROLES
insert into admin_roles (name, description) values
('super_admin', 'Full system access'),
('admin', 'Full store management access'),
('order_manager', 'Manage orders and fulfillment'),
('product_manager', 'Manage products and categories'),
('content_manager', 'Manage content and reviews'),
('support_agent', 'Handle customer inquiries')
on conflict (name) do nothing;

-- DEFAULT PERMISSIONS
insert into admin_permissions (name, description) values
('manage_products', 'Create, edit, and delete products'),
('manage_categories', 'Create, edit, and delete categories'),
('manage_orders', 'View and manage orders'),
('manage_users', 'View and manage users'),
('manage_suppliers', 'Manage suppliers and supplier orders'),
('manage_settings', 'Modify store settings'),
('manage_content', 'Edit pages and homepage content'),
('manage_coupons', 'Create and manage coupons'),
('manage_reviews', 'Approve, reject, and delete reviews'),
('manage_refunds', 'Process refunds'),
('view_reports', 'View store reports and analytics'),
('manage_admin_users', 'Create and manage admin accounts')
on conflict (name) do nothing;

-- DEFAULT SUPPLIER (Meesho manual)
insert into suppliers (name, code, supplier_type, integration_type, configuration, is_active, notes) values
('Meesho', 'meesho', 'manual_marketplace', 'manual', '{"website": "https://www.meesho.com", "instructions": "Manual order placement via Meesho supplier platform"}', true, 'Manual fulfillment via Meesho. Place orders on Meesho supplier portal and update tracking manually.')
on conflict (code) do nothing;

-- DEMO CATEGORIES
insert into categories (name, slug, description, sort_order, is_active, is_featured) values
('Home & Kitchen', 'home-kitchen', 'Essential products for your home and kitchen', 1, true, true),
('Car Accessories', 'car-accessories', 'Accessories and gadgets for your car', 2, true, true),
('Travel & Outdoor', 'travel-outdoor', 'Products for travel, camping, and outdoor activities', 3, true, true),
('Health & Wellness', 'health-wellness', 'Products for health, fitness and personal care', 4, true, false),
('Electronics', 'electronics', 'Gadgets, cables, and everyday electronics', 5, true, false)
on conflict (slug) do nothing;

-- DYNAMIC PRODUCT SORT OPTIONS
insert into product_sort_options (name, code, field, direction, sort_order, is_active) values
('Featured', 'featured', 'is_featured', 'desc', 1, true),
('Price: Low to High', 'price_asc', 'selling_price_paisa', 'asc', 2, true),
('Price: High to Low', 'price_desc', 'selling_price_paisa', 'desc', 3, true),
('Newest Arrivals', 'newest', 'created_at', 'desc', 4, true),
('Customer Rating', 'rating', 'average_rating', 'desc', 5, true),
('Name: A to Z', 'name_asc', 'name', 'asc', 6, true)
on conflict (code) do nothing;

-- DYNAMIC PRODUCT FILTERS
insert into filters (name, code, sort_order, is_active) values
('Brand', 'brand', 1, true),
('Material', 'material', 2, true),
('Color', 'color', 3, true),
('Availability', 'availability', 4, true)
on conflict (code) do nothing;

-- DYNAMIC FILTER VALUES
insert into filter_values (filter_id, name, value, sort_order, is_active)
select f.id, v.name, v.value, v.sort_order, true
from (values
  ('brand', 'SonicWave', 'sonicwave', 1),
  ('brand', 'AeroTech', 'aerotech', 2),
  ('brand', 'ApexLuxe', 'apexluxe', 3),
  ('brand', 'UrbanStyle', 'urbanstyle', 4),
  ('material', 'Stainless Steel', 'stainless-steel', 1),
  ('material', 'Organic Cotton', 'cotton', 2),
  ('material', 'Silicone', 'silicone', 3),
  ('material', 'Matte Polymer', 'matte-polymer', 4),
  ('color', 'Midnight Black', 'black', 1),
  ('color', 'Pearl White', 'white', 2),
  ('color', 'Slate Gray', 'gray', 3),
  ('color', 'Navy Blue', 'blue', 4),
  ('availability', 'In Stock', 'in_stock', 1)
) as v(filter_code, name, value, sort_order)
join filters f on f.code = v.filter_code
on conflict do nothing;

