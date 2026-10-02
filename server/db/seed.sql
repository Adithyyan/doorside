-- Seed: seed.sql
-- Complete initial seed data for dropshipping platform
-- Generated from verified platform datasets

BEGIN;

-- ============================================================
-- ADMIN ROLES
-- ============================================================
insert into admin_roles (id, name, description, created_at, updated_at) values
  ('7d5bfacb-bb71-4d0f-90b2-a9e2a22abc11', 'super_admin', 'Full system access', '2026-09-30T17:56:34.781Z'::timestamp, '2026-09-30T17:56:34.781Z'::timestamp),
  ('95776fc1-4543-4caa-a4b6-eb0b2779fb2b', 'admin', 'Full store management access', '2026-09-30T17:56:34.781Z'::timestamp, '2026-09-30T17:56:34.781Z'::timestamp),
  ('27a3d1d8-82fc-4e63-bcb5-437ec1e4a3a5', 'order_manager', 'Manage orders and fulfillment', '2026-09-30T17:56:34.781Z'::timestamp, '2026-09-30T17:56:34.781Z'::timestamp),
  ('7c72ec74-210c-44db-b854-3732045e1049', 'product_manager', 'Manage products and categories', '2026-09-30T17:56:34.781Z'::timestamp, '2026-09-30T17:56:34.781Z'::timestamp),
  ('8f794c54-da29-4b1e-ad34-6f32b8080b1e', 'content_manager', 'Manage content and reviews', '2026-09-30T17:56:34.781Z'::timestamp, '2026-09-30T17:56:34.781Z'::timestamp),
  ('659ca281-1fb6-4df4-97b6-c04ada0fe49e', 'support_agent', 'Handle customer inquiries', '2026-09-30T17:56:34.781Z'::timestamp, '2026-09-30T17:56:34.781Z'::timestamp)
on conflict (id) do nothing;

-- ============================================================
-- ADMIN PERMISSIONS
-- ============================================================
insert into admin_permissions (id, name, description, created_at) values
  ('5c6190db-50e5-4aac-8e4f-c87f1f9b5ecf', 'manage_products', 'Create, edit, and delete products', '2026-09-30T17:56:34.781Z'::timestamp),
  ('5c0f8bd5-c488-4639-8670-b782c4466f46', 'manage_categories', 'Create, edit, and delete categories', '2026-09-30T17:56:34.781Z'::timestamp),
  ('86bf490f-9281-4f7f-a57b-091514aa6226', 'manage_orders', 'View and manage orders', '2026-09-30T17:56:34.781Z'::timestamp),
  ('fed55bb5-8238-461e-85f4-cd65e863d300', 'manage_users', 'View and manage users', '2026-09-30T17:56:34.781Z'::timestamp),
  ('c8a5bb59-71be-4a9b-a8e7-15c06830de43', 'manage_suppliers', 'Manage suppliers and supplier orders', '2026-09-30T17:56:34.781Z'::timestamp),
  ('deacb898-34a5-4abf-93ac-1e529e959222', 'manage_settings', 'Modify store settings', '2026-09-30T17:56:34.781Z'::timestamp),
  ('8dfe07a1-64eb-4be2-b057-cb0231f2cc05', 'manage_refunds', 'Process refunds', '2026-09-30T17:56:34.781Z'::timestamp),
  ('450dc60d-d42e-4bc0-b836-521046b25849', 'manage_admin_users', 'Create and manage admin accounts', '2026-09-30T17:56:34.782Z'::timestamp),
  ('e780fff9-eaaa-4995-b9e7-6dcab43d2df1', 'manage_content', 'Edit pages and homepage content', '2026-09-30T17:56:34.781Z'::timestamp),
  ('e4fc6186-6e9a-46e6-ae0e-d592d9603d98', 'manage_reviews', 'Approve, reject, and delete reviews', '2026-09-30T17:56:34.781Z'::timestamp),
  ('5fa9e77a-d35e-4617-870c-9e71b91fe462', 'manage_coupons', 'Create and manage coupons', '2026-09-30T17:56:34.781Z'::timestamp),
  ('ce478f3d-15a5-499a-9017-ff817ed215ce', 'view_reports', 'View store reports and analytics', '2026-09-30T17:56:34.781Z'::timestamp)
on conflict (id) do nothing;

-- ============================================================
-- ADMIN ROLE PERMISSIONS (super_admin all permissions)
-- ============================================================
insert into admin_role_permissions (role_id, permission_id)
select r.id, p.id
from admin_roles r
cross join admin_permissions p
where r.name = 'super_admin'
on conflict do nothing;

-- ============================================================
-- ADMIN USERS
-- ============================================================
insert into admin_users (id, name, email, password_hash, role_id, is_active, last_login_at, created_at, updated_at) values
  ('40ec4c34-8139-427c-ad5d-15324187ebd2', 'Super Administrator', 'admin@example.com', '$2b$10$5ik18l7gawcaJqmxyjDYSOH4AF6ue1jA0QjHEjpzcEiqSv70DFmDy', '7d5bfacb-bb71-4d0f-90b2-a9e2a22abc11', TRUE, '2026-09-30T19:07:57.952Z'::timestamp, '2026-09-30T17:56:35.026Z'::timestamp, '2026-09-30T17:56:35.026Z'::timestamp),
  ('30ec4c34-8139-427c-ad5d-15324187ebd1', 'Super Administrator', 'admin@dropship.test', '$2b$10$5ik18l7gawcaJqmxyjDYSOH4AF6ue1jA0QjHEjpzcEiqSv70DFmDy', '7d5bfacb-bb71-4d0f-90b2-a9e2a22abc11', TRUE, '2026-09-30T19:08:44.623Z'::timestamp, '2026-09-30T17:56:35.026Z'::timestamp, '2026-09-30T17:56:35.026Z'::timestamp),
  ('20ec4c34-8139-427c-ad5d-15324187ebd0', 'Super Administrator', 'admin@doorside.test', '$2b$10$5ik18l7gawcaJqmxyjDYSOH4AF6ue1jA0QjHEjpzcEiqSv70DFmDy', '7d5bfacb-bb71-4d0f-90b2-a9e2a22abc11', TRUE, '2026-09-30T19:08:44.623Z'::timestamp, '2026-09-30T17:56:35.026Z'::timestamp, '2026-09-30T17:56:35.026Z'::timestamp)
on conflict (email) do update set
  password_hash = excluded.password_hash,
  is_active = true,
  updated_at = now();

-- ============================================================
-- USERS / CUSTOMERS
-- ============================================================
insert into users (id, name, email, phone, password_hash, is_guest, is_active, email_verified, phone_verified, total_orders, total_spent_paisa, created_at, updated_at) values
  ('86774fc0-afbe-4052-833c-a7109728ec6a', 'Jane Doe', 'jane@example.com', NULL, '$2b$12$ARoUEi7oqzdgG4wJFp6gbOBqaQwpvaqwh1HRLVl7FBWESXgn1SwRW', FALSE, TRUE, FALSE, FALSE, 0, 0, '2026-09-30T18:13:03.225Z'::timestamp, '2026-09-30T18:13:03.511Z'::timestamp),
  ('5898f015-f719-4a64-813b-efb71c80b1c7', 'Test Customer', 'customer@example.com', NULL, '$2b$12$kH0l3CvchdQeL5KsJ.KB3ujMwgYWuvnybAJFx8iES6udNBxmpejOK', FALSE, TRUE, FALSE, FALSE, 0, 0, '2026-09-30T18:11:56.305Z'::timestamp, '2026-09-30T18:11:56.569Z'::timestamp),
  ('11111111-2222-3333-4444-555555555555', 'Super Administrator', 'admin@dropship.test', '+919876543210', '$2b$10$FK96Ag8Q1QR0xwsgPlNtVOqGDXXVZ97gp2DGQRysfHLFZEaQfhX.a', FALSE, TRUE, TRUE, TRUE, 0, 0, '2026-09-30T17:56:35.026Z'::timestamp, '2026-10-02T08:34:42.548Z'::timestamp)
on conflict (id) do nothing;

-- ============================================================
-- MEDIA
-- ============================================================
insert into media (id, filename, original_name, url, storage_key, storage_provider, mime_type, size_bytes, alt_text, width, height, uploaded_by, uploaded_by_type, created_at) values
  ('954af93b-ee7e-4272-9c95-f1777b50d3ed', 'premium-multi-purpose-kitchen-organizer.jpg', NULL, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80', NULL, 'local', 'image/jpeg', 102400, NULL, 600, 600, NULL, 'admin', '2026-09-30T17:56:35.038Z'::timestamp),
  ('698b0ff4-37cd-4a26-bd55-b730a9f87a8d', 'stainless-steel-spice-rack-set.jpg', NULL, 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80', NULL, 'local', 'image/jpeg', 102400, NULL, 600, 600, NULL, 'admin', '2026-09-30T17:56:35.059Z'::timestamp),
  ('f9130c31-bd47-4026-8845-23a309f62ca2', 'car-seat-back-organizer.jpg', NULL, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80', NULL, 'local', 'image/jpeg', 102400, NULL, 600, 600, NULL, 'admin', '2026-09-30T17:56:35.079Z'::timestamp),
  ('9c90036b-22da-4ab6-974c-a4191ef8a39c', 'universal-car-phone-mount.jpg', NULL, 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80', NULL, 'local', 'image/jpeg', 102400, NULL, 600, 600, NULL, 'admin', '2026-09-30T17:56:35.098Z'::timestamp),
  ('8d8e8694-3cd3-40ee-8ad6-82199a6517fa', 'bamboo-cutting-board-set.jpg', NULL, 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?w=600&auto=format&fit=crop&q=80', NULL, 'local', 'image/jpeg', 102400, NULL, 600, 600, NULL, 'admin', '2026-09-30T17:56:35.117Z'::timestamp),
  ('a5c1528a-892b-42e7-be0a-fde8667b11a0', 'pro-anc-wireless-earbuds.jpg', NULL, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80', NULL, 'local', 'image/jpeg', 102400, NULL, 600, 600, NULL, 'admin', '2026-09-30T17:56:35.136Z'::timestamp),
  ('1dbf80df-4557-425c-a44c-19c26d9438b8', 'aerotech-studio-max-headphones.jpg', NULL, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', NULL, 'local', 'image/jpeg', 102400, NULL, 600, 600, NULL, 'admin', '2026-09-30T17:56:35.154Z'::timestamp)
on conflict (id) do nothing;

-- ============================================================
-- CATEGORIES
-- ============================================================
insert into categories (id, parent_id, name, slug, description, image_id, banner_image_id, sort_order, is_active, is_featured, seo_title, seo_description, created_at, updated_at) values
  ('3f55a192-590f-4bb8-b462-e4d704bc4257', NULL, 'Home & Kitchen', 'home-kitchen', 'Essential products for your home and kitchen', NULL, NULL, 1, TRUE, TRUE, NULL, NULL, '2026-09-30T17:56:34.782Z'::timestamp, '2026-09-30T17:56:34.782Z'::timestamp),
  ('908c5db8-829c-4d6b-bc97-92e94d37580c', NULL, 'Car Accessories', 'car-accessories', 'Accessories and gadgets for your car', NULL, NULL, 2, TRUE, TRUE, NULL, NULL, '2026-09-30T17:56:34.782Z'::timestamp, '2026-09-30T17:56:34.782Z'::timestamp),
  ('ae081e52-3cb1-4fe1-b046-2a7679a63ba4', NULL, 'Travel & Outdoor', 'travel-outdoor', 'Products for travel, camping, and outdoor activities', NULL, NULL, 3, TRUE, TRUE, NULL, NULL, '2026-09-30T17:56:34.782Z'::timestamp, '2026-09-30T17:56:34.782Z'::timestamp),
  ('60eb0b46-b409-48fc-9c4b-a07f8badf547', NULL, 'Health & Wellness', 'health-wellness', 'Products for health, fitness and personal care', NULL, NULL, 4, TRUE, FALSE, NULL, NULL, '2026-09-30T17:56:34.782Z'::timestamp, '2026-09-30T17:56:34.782Z'::timestamp),
  ('eb2dcda4-847c-405e-a9c6-bbf7409b65d6', NULL, 'Electronics', 'electronics', 'Gadgets, cables, and everyday electronics', NULL, NULL, 5, TRUE, FALSE, NULL, NULL, '2026-09-30T17:56:34.782Z'::timestamp, '2026-09-30T17:56:34.782Z'::timestamp)
on conflict (id) do nothing;

-- ============================================================
-- SUPPLIERS
-- ============================================================
insert into suppliers (id, name, code, supplier_type, integration_type, contact_name, contact_email, contact_phone, api_base_url, credentials_ref, configuration, is_active, notes, created_at, updated_at) values
  ('b490e9b8-86e9-4a40-a7ab-06779f45d790', 'Meesho', 'meesho', 'manual_marketplace', 'manual', 'Vendor Support', 'support@supplier.test', '+91-9876543210', NULL, NULL, '{"website":"https://www.meesho.com","instructions":"Manual order placement via Meesho supplier platform"}'::jsonb, TRUE, 'Manual fulfillment via Meesho. Place orders on Meesho supplier portal and update tracking manually.', '2026-09-30T17:56:34.782Z'::timestamp, '2026-09-30T17:56:34.782Z'::timestamp)
on conflict (id) do nothing;

-- ============================================================
-- PRODUCTS
-- ============================================================
insert into products (
  id, category_id, supplier_id, name, slug, sku, short_description, description,
  specifications, key_features, selling_price_paisa, compare_at_price_paisa, cost_price_paisa,
  tax_percentage, stock_quantity, low_stock_threshold, weight_grams, length_mm, width_mm, height_mm,
  brand, status, is_featured, is_active, is_digital, seo_title, seo_description, seo_keywords,
  tags, related_product_ids, cross_sell_product_ids, upsell_product_ids, frequently_bought_with_ids,
  created_at, updated_at
) values
  (
    '43678371-4130-4a3e-b987-903a54d0f792', '3f55a192-590f-4bb8-b462-e4d704bc4257', 'b490e9b8-86e9-4a40-a7ab-06779f45d790', 'Premium Multi-Purpose Kitchen Organizer', 'premium-multi-purpose-kitchen-organizer', 'KIT-ORG-001', 'Keep your kitchen neat and tidy with this versatile organizer.', '<p>This premium kitchen organizer helps you maximize storage space in your kitchen. Made from high-quality materials, it is durable and easy to clean.</p>',
    '{}'::jsonb, '[]'::jsonb, 79900, 129900, 35000,
    0, 50, 5, NULL, NULL, NULL, NULL,
    NULL, 'active', TRUE, TRUE, FALSE, NULL, NULL, NULL,
    '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb,
    '2026-09-30T17:56:35.036Z'::timestamp, '2026-09-30T17:56:35.036Z'::timestamp
  ),
  (
    '92000bc8-4192-459a-a5d8-057c20fa09dc', '3f55a192-590f-4bb8-b462-e4d704bc4257', 'b490e9b8-86e9-4a40-a7ab-06779f45d790', 'Stainless Steel Spice Rack Set', 'stainless-steel-spice-rack-set', 'KIT-SPICE-001', 'Organize all your spices elegantly on your countertop or shelf.', '<p>A beautiful stainless steel spice rack that holds up to 12 spice jars. Perfect for modern Indian kitchens.</p>',
    '{}'::jsonb, '[]'::jsonb, 59900, 99900, 25000,
    0, 35, 5, NULL, NULL, NULL, NULL,
    NULL, 'active', FALSE, TRUE, FALSE, NULL, NULL, NULL,
    '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb,
    '2026-09-30T17:56:35.054Z'::timestamp, '2026-09-30T17:56:35.054Z'::timestamp
  ),
  (
    '91be8b07-002b-4c7e-b639-c21002cd976b', '908c5db8-829c-4d6b-bc97-92e94d37580c', 'b490e9b8-86e9-4a40-a7ab-06779f45d790', 'Car Seat Back Organizer with Tablet Holder', 'car-seat-back-organizer', 'CAR-ORG-001', 'Keep your car neat and organized with this multi-pocket seat organizer.', '<p>This premium car seat back organizer features multiple pockets for tablets, bottles, books, and more. Easy to install and clean.</p>',
    '{}'::jsonb, '[]'::jsonb, 89900, 149900, 40000,
    0, 25, 5, NULL, NULL, NULL, NULL,
    NULL, 'active', TRUE, TRUE, FALSE, NULL, NULL, NULL,
    '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb,
    '2026-09-30T17:56:35.077Z'::timestamp, '2026-09-30T17:56:35.077Z'::timestamp
  ),
  (
    '74b531ff-c2df-490a-a626-ed5e9fb81a83', '908c5db8-829c-4d6b-bc97-92e94d37580c', 'b490e9b8-86e9-4a40-a7ab-06779f45d790', 'Universal Car Phone Mount (360 Rotation)', 'universal-car-phone-mount', 'CAR-PHN-001', 'Securely mount your phone for navigation while driving.', '<p>360-degree rotation car phone mount compatible with all smartphones. Easy one-hand operation and strong suction cup base.</p>',
    '{}'::jsonb, '[]'::jsonb, 49900, 79900, 20000,
    0, 75, 5, NULL, NULL, NULL, NULL,
    NULL, 'active', FALSE, TRUE, FALSE, NULL, NULL, NULL,
    '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb,
    '2026-09-30T17:56:35.093Z'::timestamp, '2026-09-30T17:56:35.093Z'::timestamp
  ),
  (
    '9b293976-6b6f-45fa-abfb-3c4a1a1ce2f0', '3f55a192-590f-4bb8-b462-e4d704bc4257', 'b490e9b8-86e9-4a40-a7ab-06779f45d790', 'Eco-Friendly Bamboo Cutting Board Set', 'bamboo-cutting-board-set', 'KIT-CUTB-001', 'Eco-friendly bamboo cutting boards in 3 versatile sizes.', '<p>Set of 3 premium bamboo cutting boards. Antibacterial, durable and easy to clean. Safe for all types of knives.</p>',
    '{}'::jsonb, '[]'::jsonb, 69900, 119900, 28000,
    0, 40, 5, NULL, NULL, NULL, NULL,
    NULL, 'active', FALSE, TRUE, FALSE, NULL, NULL, NULL,
    '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb,
    '2026-09-30T17:56:35.115Z'::timestamp, '2026-09-30T17:56:35.115Z'::timestamp
  ),
  (
    '499b1941-fbbe-4a82-964d-ec422fc46be8', 'ae081e52-3cb1-4fe1-b046-2a7679a63ba4', 'b490e9b8-86e9-4a40-a7ab-06779f45d790', 'SonicWave Pro Wireless Noise Cancelling Earbuds', 'pro-anc-wireless-earbuds', 'EAR-ANC-001', 'Active noise cancellation wireless earbuds with 32h playtime.', '<p>Studio-quality sound, deep bass, active noise cancellation, and seamless Bluetooth 5.3 connectivity.</p>',
    '{}'::jsonb, '[]'::jsonb, 149900, 299900, 60000,
    0, 60, 5, NULL, NULL, NULL, NULL,
    NULL, 'active', TRUE, TRUE, FALSE, NULL, NULL, NULL,
    '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb,
    '2026-09-30T17:56:35.131Z'::timestamp, '2026-09-30T17:56:35.131Z'::timestamp
  ),
  (
    'a6cbfdf4-5ad7-4b00-89b2-7cd0f653f7bf', 'ae081e52-3cb1-4fe1-b046-2a7679a63ba4', 'b490e9b8-86e9-4a40-a7ab-06779f45d790', 'AeroTech Studio Max ANC Wireless Headphones', 'aerotech-studio-max-headphones', 'HEAD-ANC-002', 'Over-ear Hi-Res audio headphones with ultra-comfort earcups.', '<p>Premium wireless over-ear headphones with custom dynamic drivers and transparent ambient mode.</p>',
    '{}'::jsonb, '[]'::jsonb, 349900, 499900, 140000,
    0, 30, 5, NULL, NULL, NULL, NULL,
    NULL, 'active', TRUE, TRUE, FALSE, NULL, NULL, NULL,
    '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb,
    '2026-09-30T17:56:35.151Z'::timestamp, '2026-09-30T17:56:35.151Z'::timestamp
  )
on conflict (id) do nothing;

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
insert into product_images (id, product_id, media_id, is_primary, sort_order, created_at) values
  ('37c8d237-f911-4b4c-b117-d23c44b62c59', '43678371-4130-4a3e-b987-903a54d0f792', '954af93b-ee7e-4272-9c95-f1777b50d3ed', TRUE, 1, '2026-09-30T17:56:35.040Z'::timestamp),
  ('c82eb5b5-edb1-4ac6-b8df-ad5c2511e881', '92000bc8-4192-459a-a5d8-057c20fa09dc', '698b0ff4-37cd-4a26-bd55-b730a9f87a8d', TRUE, 1, '2026-09-30T17:56:35.061Z'::timestamp),
  ('4799d996-85dd-47de-9cd2-a27138dfea0a', '91be8b07-002b-4c7e-b639-c21002cd976b', 'f9130c31-bd47-4026-8845-23a309f62ca2', TRUE, 1, '2026-09-30T17:56:35.081Z'::timestamp),
  ('c7e9958e-e520-4638-97cf-8fbb9e97bf3e', '74b531ff-c2df-490a-a626-ed5e9fb81a83', '9c90036b-22da-4ab6-974c-a4191ef8a39c', TRUE, 1, '2026-09-30T17:56:35.101Z'::timestamp),
  ('65220f2c-dd10-4c85-af5c-356bd5b0daaa', '9b293976-6b6f-45fa-abfb-3c4a1a1ce2f0', '8d8e8694-3cd3-40ee-8ad6-82199a6517fa', TRUE, 1, '2026-09-30T17:56:35.119Z'::timestamp),
  ('87fef820-f02b-4919-a4bb-4c91ee82f4fa', '499b1941-fbbe-4a82-964d-ec422fc46be8', 'a5c1528a-892b-42e7-be0a-fde8667b11a0', TRUE, 1, '2026-09-30T17:56:35.138Z'::timestamp),
  ('07f63055-cd9b-4f86-b14a-6c75cf08c160', 'a6cbfdf4-5ad7-4b00-89b2-7cd0f653f7bf', '1dbf80df-4557-425c-a44c-19c26d9438b8', TRUE, 1, '2026-09-30T17:56:35.155Z'::timestamp)
on conflict (id) do nothing;

-- ============================================================
-- FILTERS
-- ============================================================
insert into filters (id, name, code, sort_order, is_active, created_at, updated_at) values
  ('e31305a7-e817-4e86-8d67-a3c13818e31b', 'Brand', 'brand', 1, TRUE, '2026-09-30T17:56:34.783Z'::timestamp, '2026-09-30T17:56:34.783Z'::timestamp),
  ('1657e4ac-32f2-4569-bcb0-1ff0008fee08', 'Material', 'material', 2, TRUE, '2026-09-30T17:56:34.783Z'::timestamp, '2026-09-30T17:56:34.783Z'::timestamp),
  ('f346a67f-73ae-4739-8a6e-65e9c5fee1f7', 'Color', 'color', 3, TRUE, '2026-09-30T17:56:34.784Z'::timestamp, '2026-09-30T17:56:34.784Z'::timestamp),
  ('e8796486-2534-4358-bfa7-9b100f9f2edc', 'Availability', 'availability', 4, TRUE, '2026-09-30T17:56:34.784Z'::timestamp, '2026-09-30T17:56:34.784Z'::timestamp)
on conflict (id) do nothing;

-- ============================================================
-- FILTER VALUES
-- ============================================================
insert into filter_values (id, filter_id, name, value, sort_order, is_active, created_at, updated_at) values
  ('092385b8-2a85-4d9c-9225-cc51c817f77d', '1657e4ac-32f2-4569-bcb0-1ff0008fee08', 'Organic Cotton', 'cotton', 2, TRUE, '2026-09-30T17:56:34.791Z'::timestamp, '2026-09-30T17:56:34.791Z'::timestamp),
  ('216679cc-85e0-4d7e-b695-8e700ae121d6', '1657e4ac-32f2-4569-bcb0-1ff0008fee08', 'Silicone', 'silicone', 3, TRUE, '2026-09-30T17:56:34.791Z'::timestamp, '2026-09-30T17:56:34.791Z'::timestamp),
  ('cc0068e0-7188-44c3-aae2-39465031640c', '1657e4ac-32f2-4569-bcb0-1ff0008fee08', 'Matte Polymer', 'matte-polymer', 4, TRUE, '2026-09-30T17:56:34.792Z'::timestamp, '2026-09-30T17:56:34.792Z'::timestamp),
  ('7c9c50e3-1561-4fb9-aa72-400e74495ab2', 'f346a67f-73ae-4739-8a6e-65e9c5fee1f7', 'Midnight Black', 'black', 1, TRUE, '2026-09-30T17:56:34.792Z'::timestamp, '2026-09-30T17:56:34.792Z'::timestamp),
  ('9a99bd8e-7eff-4490-a3ec-7a3e3f897298', 'f346a67f-73ae-4739-8a6e-65e9c5fee1f7', 'Pearl White', 'white', 2, TRUE, '2026-09-30T17:56:34.793Z'::timestamp, '2026-09-30T17:56:34.793Z'::timestamp),
  ('0c9a8815-f122-4c93-830c-2ccf3d805f8f', 'f346a67f-73ae-4739-8a6e-65e9c5fee1f7', 'Slate Gray', 'gray', 3, TRUE, '2026-09-30T17:56:34.793Z'::timestamp, '2026-09-30T17:56:34.793Z'::timestamp),
  ('688eddb5-f127-41c4-a58e-5a8805c71f59', 'f346a67f-73ae-4739-8a6e-65e9c5fee1f7', 'Navy Blue', 'blue', 4, TRUE, '2026-09-30T17:56:34.793Z'::timestamp, '2026-09-30T17:56:34.793Z'::timestamp),
  ('37082444-396c-4946-a55f-6fc0cbd98af5', 'e8796486-2534-4358-bfa7-9b100f9f2edc', 'In Stock', 'in_stock', 1, TRUE, '2026-09-30T17:56:34.794Z'::timestamp, '2026-09-30T17:56:34.794Z'::timestamp),
  ('4915a0f8-85d0-4eee-9bd4-1ff5fc6286f0', 'e31305a7-e817-4e86-8d67-a3c13818e31b', 'SonicWave', 'sonicwave', 1, TRUE, '2026-09-30T17:56:34.787Z'::timestamp, '2026-09-30T17:56:34.787Z'::timestamp),
  ('a12e744c-9526-4659-8728-5ab190e79973', 'e31305a7-e817-4e86-8d67-a3c13818e31b', 'AeroTech', 'aerotech', 2, TRUE, '2026-09-30T17:56:34.789Z'::timestamp, '2026-09-30T17:56:34.789Z'::timestamp),
  ('0591a0f6-c788-4156-9da8-428a5da572c4', 'e31305a7-e817-4e86-8d67-a3c13818e31b', 'ApexLuxe', 'apexluxe', 3, TRUE, '2026-09-30T17:56:34.790Z'::timestamp, '2026-09-30T17:56:34.790Z'::timestamp),
  ('fdd2ae1c-af46-4c8a-bd20-9e7a79160edf', 'e31305a7-e817-4e86-8d67-a3c13818e31b', 'UrbanStyle', 'urbanstyle', 4, TRUE, '2026-09-30T17:56:34.790Z'::timestamp, '2026-09-30T17:56:34.790Z'::timestamp),
  ('6c27f15e-11f1-41ea-a647-0dc794b772b2', '1657e4ac-32f2-4569-bcb0-1ff0008fee08', 'Stainless Steel', 'stainless-steel', 1, TRUE, '2026-09-30T17:56:34.790Z'::timestamp, '2026-09-30T17:56:34.790Z'::timestamp)
on conflict (id) do nothing;

-- ============================================================
-- PRODUCT FILTER MAPPINGS
-- ============================================================
insert into product_filter_mappings (id, product_id, filter_id, filter_value_id, created_at) values
  ('efd90a7a-6d4e-4407-8d37-8ff64160d425', '43678371-4130-4a3e-b987-903a54d0f792', 'e8796486-2534-4358-bfa7-9b100f9f2edc', '37082444-396c-4946-a55f-6fc0cbd98af5', '2026-09-30T17:56:35.042Z'::timestamp),
  ('20290adb-54b3-4866-ac91-f5afaaf015b6', '43678371-4130-4a3e-b987-903a54d0f792', 'e31305a7-e817-4e86-8d67-a3c13818e31b', '0591a0f6-c788-4156-9da8-428a5da572c4', '2026-09-30T17:56:35.044Z'::timestamp),
  ('3e879a35-895a-4a39-8944-5a54c49d15e4', '43678371-4130-4a3e-b987-903a54d0f792', '1657e4ac-32f2-4569-bcb0-1ff0008fee08', 'cc0068e0-7188-44c3-aae2-39465031640c', '2026-09-30T17:56:35.047Z'::timestamp),
  ('8f796df0-036e-4cf8-9e80-677b796d51e8', '43678371-4130-4a3e-b987-903a54d0f792', 'f346a67f-73ae-4739-8a6e-65e9c5fee1f7', '7c9c50e3-1561-4fb9-aa72-400e74495ab2', '2026-09-30T17:56:35.050Z'::timestamp),
  ('e0eefb23-7404-4288-a875-6ab928889808', '92000bc8-4192-459a-a5d8-057c20fa09dc', 'e8796486-2534-4358-bfa7-9b100f9f2edc', '37082444-396c-4946-a55f-6fc0cbd98af5', '2026-09-30T17:56:35.064Z'::timestamp),
  ('f073df9a-de9f-4b4d-84c2-3773db563351', 'a6cbfdf4-5ad7-4b00-89b2-7cd0f653f7bf', '1657e4ac-32f2-4569-bcb0-1ff0008fee08', 'cc0068e0-7188-44c3-aae2-39465031640c', '2026-09-30T17:56:35.161Z'::timestamp),
  ('965be840-d916-4d01-9608-4dfda3ac8b76', '92000bc8-4192-459a-a5d8-057c20fa09dc', 'e31305a7-e817-4e86-8d67-a3c13818e31b', '0591a0f6-c788-4156-9da8-428a5da572c4', '2026-09-30T17:56:35.068Z'::timestamp),
  ('5de50c5c-57fa-4ed9-ac32-cd00dec39b61', '92000bc8-4192-459a-a5d8-057c20fa09dc', 'f346a67f-73ae-4739-8a6e-65e9c5fee1f7', '7c9c50e3-1561-4fb9-aa72-400e74495ab2', '2026-09-30T17:56:35.073Z'::timestamp),
  ('e1f00dba-9d32-48db-b94d-bccdc6088ffc', '92000bc8-4192-459a-a5d8-057c20fa09dc', '1657e4ac-32f2-4569-bcb0-1ff0008fee08', '6c27f15e-11f1-41ea-a647-0dc794b772b2', '2026-09-30T17:56:35.070Z'::timestamp),
  ('84a0dd6b-7b3d-4dc7-90c7-d7c97779d2ce', '74b531ff-c2df-490a-a626-ed5e9fb81a83', '1657e4ac-32f2-4569-bcb0-1ff0008fee08', 'cc0068e0-7188-44c3-aae2-39465031640c', '2026-09-30T17:56:35.108Z'::timestamp),
  ('ef89cc67-4e32-4203-b26e-83d012160ed9', '91be8b07-002b-4c7e-b639-c21002cd976b', '1657e4ac-32f2-4569-bcb0-1ff0008fee08', 'cc0068e0-7188-44c3-aae2-39465031640c', '2026-09-30T17:56:35.087Z'::timestamp),
  ('fb9219b6-aeb2-483b-96ef-59aef344ec58', '91be8b07-002b-4c7e-b639-c21002cd976b', 'f346a67f-73ae-4739-8a6e-65e9c5fee1f7', '7c9c50e3-1561-4fb9-aa72-400e74495ab2', '2026-09-30T17:56:35.089Z'::timestamp),
  ('0f195783-5a2b-493f-851a-a156a95b0a8a', '91be8b07-002b-4c7e-b639-c21002cd976b', 'e8796486-2534-4358-bfa7-9b100f9f2edc', '37082444-396c-4946-a55f-6fc0cbd98af5', '2026-09-30T17:56:35.082Z'::timestamp),
  ('b4671c94-30ca-41ab-be26-d1f7ab8f37d4', '74b531ff-c2df-490a-a626-ed5e9fb81a83', 'e31305a7-e817-4e86-8d67-a3c13818e31b', '0591a0f6-c788-4156-9da8-428a5da572c4', '2026-09-30T17:56:35.105Z'::timestamp),
  ('3aa2fe77-e91e-4a7a-9de2-a7eef87a517d', 'a6cbfdf4-5ad7-4b00-89b2-7cd0f653f7bf', 'f346a67f-73ae-4739-8a6e-65e9c5fee1f7', '7c9c50e3-1561-4fb9-aa72-400e74495ab2', '2026-09-30T17:56:35.163Z'::timestamp),
  ('dcbc945b-0ea7-4a67-818f-72c74ef52890', '74b531ff-c2df-490a-a626-ed5e9fb81a83', 'f346a67f-73ae-4739-8a6e-65e9c5fee1f7', '7c9c50e3-1561-4fb9-aa72-400e74495ab2', '2026-09-30T17:56:35.111Z'::timestamp),
  ('e3450f20-ba46-44ad-82fa-82cf80a07b95', '9b293976-6b6f-45fa-abfb-3c4a1a1ce2f0', 'e8796486-2534-4358-bfa7-9b100f9f2edc', '37082444-396c-4946-a55f-6fc0cbd98af5', '2026-09-30T17:56:35.121Z'::timestamp),
  ('c089e831-0cb7-4744-8025-39a0200a559a', '9b293976-6b6f-45fa-abfb-3c4a1a1ce2f0', 'e31305a7-e817-4e86-8d67-a3c13818e31b', '0591a0f6-c788-4156-9da8-428a5da572c4', '2026-09-30T17:56:35.123Z'::timestamp),
  ('2255dc44-7d17-4d1a-b059-fc030999d6cb', '9b293976-6b6f-45fa-abfb-3c4a1a1ce2f0', '1657e4ac-32f2-4569-bcb0-1ff0008fee08', '092385b8-2a85-4d9c-9225-cc51c817f77d', '2026-09-30T17:56:35.125Z'::timestamp),
  ('9c5981a9-4f5e-4f78-a7d1-aff70e1bc784', '9b293976-6b6f-45fa-abfb-3c4a1a1ce2f0', 'f346a67f-73ae-4739-8a6e-65e9c5fee1f7', '7c9c50e3-1561-4fb9-aa72-400e74495ab2', '2026-09-30T17:56:35.127Z'::timestamp),
  ('394c3f5b-5fd5-4eed-82c7-c226cf7f751e', '499b1941-fbbe-4a82-964d-ec422fc46be8', 'e8796486-2534-4358-bfa7-9b100f9f2edc', '37082444-396c-4946-a55f-6fc0cbd98af5', '2026-09-30T17:56:35.139Z'::timestamp),
  ('99f41c37-021e-4c33-a2de-49a2c449100c', '499b1941-fbbe-4a82-964d-ec422fc46be8', 'e31305a7-e817-4e86-8d67-a3c13818e31b', '4915a0f8-85d0-4eee-9bd4-1ff5fc6286f0', '2026-09-30T17:56:35.141Z'::timestamp),
  ('54f5f1b7-ca56-41dc-8d29-003092325866', '499b1941-fbbe-4a82-964d-ec422fc46be8', '1657e4ac-32f2-4569-bcb0-1ff0008fee08', 'cc0068e0-7188-44c3-aae2-39465031640c', '2026-09-30T17:56:35.144Z'::timestamp),
  ('4e44a140-c1b5-475d-adc7-5e41d1ba6617', '74b531ff-c2df-490a-a626-ed5e9fb81a83', 'e8796486-2534-4358-bfa7-9b100f9f2edc', '37082444-396c-4946-a55f-6fc0cbd98af5', '2026-09-30T17:56:35.104Z'::timestamp),
  ('822caec9-90c1-4f35-b2c5-c5e513263ffe', '499b1941-fbbe-4a82-964d-ec422fc46be8', 'f346a67f-73ae-4739-8a6e-65e9c5fee1f7', '7c9c50e3-1561-4fb9-aa72-400e74495ab2', '2026-09-30T17:56:35.146Z'::timestamp),
  ('6d8044e7-315c-4c8b-8c06-77a81e9c99cb', 'a6cbfdf4-5ad7-4b00-89b2-7cd0f653f7bf', 'e31305a7-e817-4e86-8d67-a3c13818e31b', 'a12e744c-9526-4659-8728-5ab190e79973', '2026-09-30T17:56:35.159Z'::timestamp),
  ('2e97a3c4-6cab-4dfc-a5c7-e8adf890e426', 'a6cbfdf4-5ad7-4b00-89b2-7cd0f653f7bf', 'e8796486-2534-4358-bfa7-9b100f9f2edc', '37082444-396c-4946-a55f-6fc0cbd98af5', '2026-09-30T17:56:35.157Z'::timestamp),
  ('3856fa0b-e153-43f1-bd24-e32f1523c94b', '91be8b07-002b-4c7e-b639-c21002cd976b', 'e31305a7-e817-4e86-8d67-a3c13818e31b', '0591a0f6-c788-4156-9da8-428a5da572c4', '2026-09-30T17:56:35.085Z'::timestamp)
on conflict (id) do nothing;

-- ============================================================
-- PRODUCT SORT OPTIONS
-- ============================================================
insert into product_sort_options (id, name, code, field, direction, sort_order, is_active, created_at, updated_at) values
  ('ba0d9e4b-d72a-4101-85a2-9d8c16c5b344', 'Featured', 'featured', 'is_featured', 'desc', 1, TRUE, '2026-09-30T17:56:34.783Z'::timestamp, '2026-09-30T17:56:34.783Z'::timestamp),
  ('51efe568-b9df-43ac-a907-e01298bd44e3', 'Price: Low to High', 'price_asc', 'selling_price_paisa', 'asc', 2, TRUE, '2026-09-30T17:56:34.783Z'::timestamp, '2026-09-30T17:56:34.783Z'::timestamp),
  ('dbbf2f23-9b0f-43f0-aafb-a3e71563b200', 'Price: High to Low', 'price_desc', 'selling_price_paisa', 'desc', 3, TRUE, '2026-09-30T17:56:34.783Z'::timestamp, '2026-09-30T17:56:34.783Z'::timestamp),
  ('50f10e49-3fcd-4fe5-9465-eaed6b6645f1', 'Newest Arrivals', 'newest', 'created_at', 'desc', 4, TRUE, '2026-09-30T17:56:34.783Z'::timestamp, '2026-09-30T17:56:34.783Z'::timestamp),
  ('bd6a7348-8728-40c3-9db7-92621027cb7e', 'Customer Rating', 'rating', 'average_rating', 'desc', 5, TRUE, '2026-09-30T17:56:34.783Z'::timestamp, '2026-09-30T17:56:34.783Z'::timestamp),
  ('39e48c93-aa5e-4dbe-8a68-7bded87ef706', 'Name: A to Z', 'name_asc', 'name', 'asc', 6, TRUE, '2026-09-30T17:56:34.783Z'::timestamp, '2026-09-30T17:56:34.783Z'::timestamp)
on conflict (id) do nothing;

-- ============================================================
-- PAGES
-- ============================================================
insert into pages (id, slug, title, content, content_html, meta_title, meta_description, is_published, sort_order, created_at, updated_at) values
  ('6de1829a-27d2-47d9-a8fe-7b8c49ae403f', 'privacy-policy', 'Privacy Policy', '<h1>Privacy Policy</h1><p>This is a placeholder. Please update with your actual privacy policy.</p>', '<h1>Privacy Policy</h1><p>This is a placeholder. Please update with your actual privacy policy.</p>', 'Privacy Policy', 'Our privacy policy', TRUE, 1, '2026-09-30T17:56:34.779Z'::timestamp, '2026-09-30T17:56:34.779Z'::timestamp),
  ('acea2857-9141-488a-81e1-d817359afe70', 'terms-and-conditions', 'Terms and Conditions', '<h1>Terms and Conditions</h1><p>This is a placeholder. Please update with your actual terms and conditions.</p>', '<h1>Terms and Conditions</h1><p>This is a placeholder. Please update with your actual terms and conditions.</p>', 'Terms and Conditions', 'Our terms and conditions', TRUE, 2, '2026-09-30T17:56:34.779Z'::timestamp, '2026-09-30T17:56:34.779Z'::timestamp),
  ('599abe51-a4ee-4520-ae52-d929b8dbeb58', 'refund-policy', 'Refund Policy', '<h1>Refund Policy</h1><p>This is a placeholder. Please update with your actual refund policy.</p>', '<h1>Refund Policy</h1><p>This is a placeholder. Please update with your actual refund policy.</p>', 'Refund Policy', 'Our refund policy', TRUE, 3, '2026-09-30T17:56:34.779Z'::timestamp, '2026-09-30T17:56:34.779Z'::timestamp),
  ('e3262989-5190-4f5b-a44c-d02969874de3', 'shipping-policy', 'Shipping Policy', '<h1>Shipping Policy</h1><p>This is a placeholder. Please update with your actual shipping policy.</p>', '<h1>Shipping Policy</h1><p>This is a placeholder. Please update with your actual shipping policy.</p>', 'Shipping Policy', 'Our shipping policy', TRUE, 4, '2026-09-30T17:56:34.779Z'::timestamp, '2026-09-30T17:56:34.779Z'::timestamp),
  ('fadf396d-46f0-4f79-a615-74a0d1b1ead6', 'cancellation-policy', 'Cancellation Policy', '<h1>Cancellation Policy</h1><p>This is a placeholder. Please update with your actual cancellation policy.</p>', '<h1>Cancellation Policy</h1><p>This is a placeholder. Please update with your actual cancellation policy.</p>', 'Cancellation Policy', 'Our cancellation policy', TRUE, 5, '2026-09-30T17:56:34.779Z'::timestamp, '2026-09-30T17:56:34.779Z'::timestamp),
  ('62d75894-2abe-4d0e-a9b4-bbe22b53b8d5', 'about', 'About Us', '<h1>About Us</h1><p>This is a placeholder. Please update with your actual about us content.</p>', '<h1>About Us</h1><p>This is a placeholder. Please update with your actual about us content.</p>', 'About Us', 'Learn about us', TRUE, 6, '2026-09-30T17:56:34.779Z'::timestamp, '2026-09-30T17:56:34.779Z'::timestamp),
  ('0e40e6ce-ca90-42d9-9634-1b847cfe4b8f', 'contact', 'Contact Us', '<h1>Contact Us</h1><p>This is a placeholder. Please update with your actual contact information.</p>', '<h1>Contact Us</h1><p>This is a placeholder. Please update with your actual contact information.</p>', 'Contact Us', 'Contact us', TRUE, 7, '2026-09-30T17:56:34.779Z'::timestamp, '2026-09-30T17:56:34.779Z'::timestamp),
  ('f230cd3e-dda5-4287-952e-c18847461156', 'faq', 'Frequently Asked Questions', '<h1>FAQ</h1><p>This is a placeholder. Please update with your actual FAQ content.</p>', '<h1>FAQ</h1><p>This is a placeholder. Please update with your actual FAQ content.</p>', 'FAQ', 'Frequently asked questions', TRUE, 8, '2026-09-30T17:56:34.779Z'::timestamp, '2026-09-30T17:56:34.779Z'::timestamp)
on conflict (id) do nothing;

-- ============================================================
-- HOMEPAGE SECTIONS
-- ============================================================
insert into homepage_sections (id, section_type, title, subtitle, content, is_enabled, sort_order, created_at, updated_at) values
  ('3dfb4f18-da2f-4294-9d89-12ea1b581151', 'announcement_bar', 'Announcement Bar', '', '{"text":"Free shipping on orders above ₹499!","color":"#111827","text_color":"#FFFFFF"}'::jsonb, FALSE, 0, '2026-09-30T17:56:34.780Z'::timestamp, '2026-09-30T17:56:34.780Z'::timestamp),
  ('e5da05b3-f065-43b8-b16c-43bbcbb186b1', 'hero', 'Hero Section', '', '{"heading":"Products That Make Your Life Better","description":"Discover our curated collection of quality everyday products.","cta_text":"Shop Now","cta_url":"/shop"}'::jsonb, TRUE, 1, '2026-09-30T17:56:34.780Z'::timestamp, '2026-09-30T17:56:34.780Z'::timestamp),
  ('4d7062f2-b7de-401a-87bc-885088630431', 'featured_categories', 'Featured Categories', '', '{"title":"Shop by Category","category_ids":[]}'::jsonb, TRUE, 2, '2026-09-30T17:56:34.780Z'::timestamp, '2026-09-30T17:56:34.780Z'::timestamp),
  ('23168b2b-cab9-477d-aaf6-c16dee937008', 'featured_products', 'Featured Products', '', '{"title":"Featured Products","product_ids":[]}'::jsonb, TRUE, 3, '2026-09-30T17:56:34.780Z'::timestamp, '2026-09-30T17:56:34.780Z'::timestamp),
  ('7c16153d-b41c-4234-a9b6-53293cfa6dc8', 'why_us', 'Why Shop With Us', '', '{"title":"Why Choose Us","items":[{"icon":"truck","title":"Fast Delivery","description":"Delivered to your door across India"},{"icon":"shield","title":"Secure Payment","description":"100% secure payment processing"},{"icon":"refresh","title":"Easy Returns","description":"Hassle-free return policy"},{"icon":"star","title":"Quality Products","description":"Carefully curated quality products"}]}'::jsonb, TRUE, 4, '2026-09-30T17:56:34.780Z'::timestamp, '2026-09-30T17:56:34.780Z'::timestamp),
  ('9573c648-1205-4e10-8595-3f1cd282f49c', 'best_sellers', 'Best Sellers', '', '{"title":"Best Sellers","product_ids":[]}'::jsonb, TRUE, 5, '2026-09-30T17:56:34.780Z'::timestamp, '2026-09-30T17:56:34.780Z'::timestamp),
  ('07b14e05-28b6-429d-a7a4-48c41bdbb4a7', 'reviews', 'Customer Reviews', '', '{"title":"What Our Customers Say"}'::jsonb, TRUE, 6, '2026-09-30T17:56:34.780Z'::timestamp, '2026-09-30T17:56:34.780Z'::timestamp),
  ('6e9118d7-6d24-40b5-994b-a942e9c07574', 'faq', 'FAQ', '', '{"title":"Frequently Asked Questions","items":[{"question":"How long does delivery take?","answer":"We typically deliver within 5-7 business days."},{"question":"What is your return policy?","answer":"We offer a 7-day return policy on most items."},{"question":"Is COD available?","answer":"Yes, Cash on Delivery is available across India."}]}'::jsonb, TRUE, 7, '2026-09-30T17:56:34.780Z'::timestamp, '2026-09-30T17:56:34.780Z'::timestamp)
on conflict (id) do nothing;

-- ============================================================
-- STORE SETTINGS & SETTINGS
-- ============================================================
insert into store_settings (id, category, key, value, value_type, label, description, is_public, created_at, updated_at) values
  ('972062f1-3278-4029-9b68-1a2d3f1ed124', 'checkout', 'minimum_order_paisa', '0', 'integer', 'Minimum Order Amount (paisa)', 'Minimum order value (0 = no minimum)', TRUE, '2026-09-30T17:56:34.777Z'::timestamp, '2026-09-30T17:56:34.777Z'::timestamp),
  ('4f2ee67e-34be-4900-be44-a95ddfa4edf0', 'checkout', 'cod_minimum_order_paisa', '0', 'integer', 'COD Minimum Order (paisa)', 'Minimum order amount for COD (0 = no minimum)', FALSE, '2026-09-30T17:56:34.776Z'::timestamp, '2026-09-30T17:56:34.776Z'::timestamp),
  ('a9f3e0f5-38b2-45c7-96c5-d340c1963a32', 'seo', 'og_image_url', '', 'string', 'Open Graph Image URL', 'Default OG image for social sharing', TRUE, '2026-09-30T17:56:34.779Z'::timestamp, '2026-09-30T17:56:34.779Z'::timestamp),
  ('8c6de6ec-ad44-49c2-9472-3f865e8f6fc3', 'general', 'currency', 'INR', 'string', 'Currency', 'Store currency code', TRUE, '2026-09-30T17:56:34.771Z'::timestamp, '2026-09-30T17:56:34.771Z'::timestamp),
  ('f4766625-901b-4312-8dc3-efffa6812c4c', 'checkout', 'tax_inclusive', 'true', 'boolean', 'Tax Inclusive Pricing', 'Are prices inclusive of tax?', TRUE, '2026-09-30T17:56:34.777Z'::timestamp, '2026-09-30T17:56:34.777Z'::timestamp),
  ('594b1ce2-f295-4883-9998-a5514356ac3f', 'general', 'legal_business_name', 'Demo Brand Pvt Ltd', 'string', 'Legal Business Name', 'Your registered business name', FALSE, '2026-09-30T17:56:34.769Z'::timestamp, '2026-09-30T17:56:34.769Z'::timestamp),
  ('a55087d1-d69e-47c3-8c0e-2ae1eb697291', 'general', 'brand_name', 'Demo Brand', 'string', 'Brand Name', 'The public name of your store', TRUE, '2026-09-30T17:56:34.768Z'::timestamp, '2026-09-30T17:56:34.768Z'::timestamp),
  ('245e04cf-315f-4f37-8319-378a43dc6f0b', 'storefront', 'homepage_title', 'Welcome to Our Store', 'string', 'Homepage Title', 'Main heading on homepage', TRUE, '2026-09-30T17:56:34.774Z'::timestamp, '2026-09-30T17:56:34.774Z'::timestamp),
  ('6c018089-da70-47c2-a32b-66ff4afdeba2', 'checkout', 'free_shipping_threshold_paisa', '49900', 'integer', 'Free Shipping Threshold (paisa)', 'Order amount for free shipping', TRUE, '2026-09-30T17:56:34.777Z'::timestamp, '2026-09-30T17:56:34.777Z'::timestamp),
  ('bf6f5537-77e3-40d6-b25e-c3b6a2cdb566', 'orders', 'tracking_url_format', '', 'string', 'Tracking URL Format', 'URL format with {tracking_number} placeholder', TRUE, '2026-09-30T17:56:34.779Z'::timestamp, '2026-09-30T17:56:34.779Z'::timestamp),
  ('23a6bbf3-d8e1-49a8-85e2-c6f24f08c382', 'branding', 'accent_color', '#F59E0B', 'color', 'Accent Color', 'Brand accent color', TRUE, '2026-09-30T17:56:34.773Z'::timestamp, '2026-09-30T17:56:34.773Z'::timestamp),
  ('a23c2a97-a7ff-48da-a498-c45b88541d7d', 'seo', 'robots_txt', 'User-agent: *\nAllow: /', 'string', 'Robots.txt Content', 'robots.txt file content', FALSE, '2026-09-30T17:56:34.779Z'::timestamp, '2026-09-30T17:56:34.779Z'::timestamp),
  ('36a9c515-23b5-499c-9fde-f51b1fd22861', 'storefront', 'footer_about_text', 'We bring you the best quality products at affordable prices, delivered right to your door.', 'string', 'Footer About Text', 'Footer about section text', TRUE, '2026-09-30T17:56:34.775Z'::timestamp, '2026-09-30T17:56:34.775Z'::timestamp),
  ('402a613e-1877-4fba-bf4a-e2052695d6fd', 'general', 'timezone', 'Asia/Kolkata', 'string', 'Timezone', 'Store timezone', FALSE, '2026-09-30T17:56:34.772Z'::timestamp, '2026-09-30T17:56:34.772Z'::timestamp),
  ('00213391-448b-4e8c-85f3-aeaa009ac63d', 'storefront', 'meta_description', 'Shop quality products at great prices. Fast delivery across India.', 'string', 'Meta Description', 'SEO meta description', TRUE, '2026-09-30T17:56:34.774Z'::timestamp, '2026-09-30T17:56:34.774Z'::timestamp),
  ('88201372-a58a-4a62-bbbe-a473cee69291', 'storefront', 'announcement_bar_color', '#111827', 'color', 'Announcement Bar Color', 'Announcement bar background', TRUE, '2026-09-30T17:56:34.774Z'::timestamp, '2026-09-30T17:56:34.774Z'::timestamp),
  ('adf65058-1e95-4895-8340-8dfa9955b82b', 'general', 'store_url', 'https://yourdomain.com', 'string', 'Store URL', 'The public URL of your store', TRUE, '2026-09-30T17:56:34.770Z'::timestamp, '2026-09-30T17:56:34.770Z'::timestamp),
  ('3c10ef6b-6f58-4297-8de7-8e4fddb1a244', 'general', 'support_email', 'support@yourdomain.com', 'string', 'Support Email', 'Customer support email', TRUE, '2026-09-30T17:56:34.770Z'::timestamp, '2026-09-30T17:56:34.770Z'::timestamp),
  ('2d472e47-2ee8-420a-b383-dc16393c36de', 'seo', 'default_title', 'Demo Brand - Quality Products Online', 'string', 'Default Meta Title', 'Default page title', TRUE, '2026-09-30T17:56:34.779Z'::timestamp, '2026-09-30T17:56:34.779Z'::timestamp),
  ('df730eb8-ca19-4c42-87ed-65a2756c9917', 'storefront', 'hero_heading', 'Products That Make Your Life Better', 'string', 'Hero Heading', 'Main hero section heading', TRUE, '2026-09-30T17:56:34.774Z'::timestamp, '2026-09-30T17:56:34.774Z'::timestamp),
  ('654c3137-7bd6-4d67-9d8e-093ac7eed0d3', 'general', 'country', 'India', 'string', 'Country', 'Store country', TRUE, '2026-09-30T17:56:34.771Z'::timestamp, '2026-09-30T17:56:34.771Z'::timestamp),
  ('4501d714-27df-4b7e-a86e-7091949e9f43', 'storefront', 'hero_description', 'Discover our curated collection of quality everyday products. Fast delivery across India.', 'string', 'Hero Description', 'Hero section description', TRUE, '2026-09-30T17:56:34.775Z'::timestamp, '2026-09-30T17:56:34.775Z'::timestamp),
  ('2860b874-0665-498d-8520-9db93757460e', 'branding', 'primary_color', '#111827', 'color', 'Primary Color', 'Brand primary color', TRUE, '2026-09-30T17:56:34.773Z'::timestamp, '2026-09-30T17:56:34.773Z'::timestamp),
  ('92731f4d-b457-4acf-83e6-6f3787b2e36c', 'branding', 'background_color', '#FFFFFF', 'color', 'Background Color', 'Store background color', TRUE, '2026-09-30T17:56:34.773Z'::timestamp, '2026-09-30T17:56:34.773Z'::timestamp),
  ('11f3c042-9880-4596-9ed5-2fb5f3aa9b86', 'branding', 'border_radius', '8', 'integer', 'Border Radius (px)', 'Default border radius', TRUE, '2026-09-30T17:56:34.773Z'::timestamp, '2026-09-30T17:56:34.773Z'::timestamp),
  ('f2921112-e349-4880-8296-5627f10edd77', 'branding', 'favicon_url', '', 'string', 'Favicon URL', 'Store favicon URL', TRUE, '2026-09-30T17:56:34.773Z'::timestamp, '2026-09-30T17:56:34.773Z'::timestamp),
  ('89121ab7-25c5-4966-ae9a-1a231aadece4', 'orders', 'auto_cancel_hours', '24', 'integer', 'Auto-Cancel Unpaid Orders (hours)', 'Hours before unpaid orders are cancelled', FALSE, '2026-09-30T17:56:34.778Z'::timestamp, '2026-09-30T17:56:34.778Z'::timestamp),
  ('3475db7d-3c25-47b0-b459-cf840633ed8f', 'storefront', 'trust_badge_3', 'Secure Payment', 'string', 'Trust Badge 3', 'Third trust badge text', TRUE, '2026-09-30T17:56:34.775Z'::timestamp, '2026-09-30T17:56:34.775Z'::timestamp),
  ('81bf50c4-aa62-4f41-989f-7c0499814ab2', 'storefront', 'trust_badge_4', 'Quality Products', 'string', 'Trust Badge 4', 'Fourth trust badge text', TRUE, '2026-09-30T17:56:34.775Z'::timestamp, '2026-09-30T17:56:34.775Z'::timestamp),
  ('6b54c999-b6b5-4523-8e34-8025bbefded8', 'storefront', 'social_instagram', '', 'string', 'Instagram URL', 'Instagram profile URL', TRUE, '2026-09-30T17:56:34.775Z'::timestamp, '2026-09-30T17:56:34.775Z'::timestamp),
  ('b538bd5b-e277-4533-99e4-faecba9cf158', 'storefront', 'announcement_bar_text', 'Free shipping on orders above ₹499!', 'string', 'Announcement Bar Text', 'Announcement bar message', TRUE, '2026-09-30T17:56:34.774Z'::timestamp, '2026-09-30T17:56:34.774Z'::timestamp),
  ('0be62b52-2077-4293-814d-0de81b470a63', 'storefront', 'announcement_bar_enabled', 'false', 'boolean', 'Announcement Bar Enabled', 'Show/hide announcement bar', TRUE, '2026-09-30T17:56:34.774Z'::timestamp, '2026-09-30T17:56:34.774Z'::timestamp),
  ('6ae7e989-c4a9-4967-b1a1-36d81c333b44', 'storefront', 'hero_image_url', '', 'string', 'Hero Image URL', 'Hero background image', TRUE, '2026-09-30T17:56:34.775Z'::timestamp, '2026-09-30T17:56:34.775Z'::timestamp),
  ('a541a50e-7382-4b08-8625-30ec2ae6110a', 'checkout', 'coupons_enabled', 'true', 'boolean', 'Coupons Enabled', 'Enable coupon codes', TRUE, '2026-09-30T17:56:34.778Z'::timestamp, '2026-09-30T17:56:34.778Z'::timestamp),
  ('59b97c1b-a533-4588-a8b9-fdc365c6aae4', 'storefront', 'trust_badge_2', 'Easy Returns', 'string', 'Trust Badge 2', 'Second trust badge text', TRUE, '2026-09-30T17:56:34.775Z'::timestamp, '2026-09-30T17:56:34.775Z'::timestamp),
  ('ecb5074d-b253-4822-9ff4-895478ed54b5', 'checkout', 'cod_maximum_order_paisa', '500000', 'integer', 'COD Maximum Order (paisa)', 'Maximum order amount for COD (0 = no limit)', FALSE, '2026-09-30T17:56:34.777Z'::timestamp, '2026-09-30T17:56:34.777Z'::timestamp),
  ('29356407-2350-4230-aa11-74528b91fec7', 'branding', 'text_color', '#111827', 'color', 'Text Color', 'Store text color', TRUE, '2026-09-30T17:56:34.773Z'::timestamp, '2026-09-30T17:56:34.773Z'::timestamp),
  ('5c8af2be-e348-4500-988b-9416223e5df6', 'storefront', 'social_youtube', '', 'string', 'YouTube URL', 'YouTube channel URL', TRUE, '2026-09-30T17:56:34.776Z'::timestamp, '2026-09-30T17:56:34.776Z'::timestamp),
  ('a7f304b6-bb80-4b32-b311-1e0263a941d4', 'checkout', 'cod_fee_paisa', '0', 'integer', 'COD Fee (paisa)', 'Extra fee for COD orders', TRUE, '2026-09-30T17:56:34.777Z'::timestamp, '2026-09-30T17:56:34.777Z'::timestamp),
  ('0d1570d0-bcc4-4a9e-86a7-2dbbc2ec19bf', 'general', 'support_phone', '+91 XXXXXXXXXX', 'string', 'Support Phone', 'Customer support phone', TRUE, '2026-09-30T17:56:34.771Z'::timestamp, '2026-09-30T17:56:34.771Z'::timestamp),
  ('6c3878f9-6ac4-4d78-9772-b7ef07ff1b60', 'general', 'currency_symbol', '₹', 'string', 'Currency Symbol', 'Currency display symbol', TRUE, '2026-09-30T17:56:34.772Z'::timestamp, '2026-09-30T17:56:34.772Z'::timestamp),
  ('b4a2add3-6ea5-44e1-a52c-f4485ec83bc1', 'branding', 'logo_url', '', 'string', 'Logo URL', 'Store logo URL', TRUE, '2026-09-30T17:56:34.772Z'::timestamp, '2026-09-30T17:56:34.772Z'::timestamp),
  ('7842c21f-67a3-4ea7-8490-d7fc2fde80ad', 'checkout', 'guest_checkout_enabled', 'true', 'boolean', 'Guest Checkout Enabled', 'Allow checkout without account', TRUE, '2026-09-30T17:56:34.778Z'::timestamp, '2026-09-30T17:56:34.778Z'::timestamp),
  ('801e7f2c-6f6a-462e-9db7-5f14aa340e16', 'storefront', 'social_twitter', '', 'string', 'Twitter/X URL', 'Twitter/X profile URL', TRUE, '2026-09-30T17:56:34.776Z'::timestamp, '2026-09-30T17:56:34.776Z'::timestamp),
  ('9b343570-4b5d-45fd-a60c-0aac3daff85f', 'storefront', 'trust_badge_1', 'Free Shipping', 'string', 'Trust Badge 1', 'First trust badge text', TRUE, '2026-09-30T17:56:34.775Z'::timestamp, '2026-09-30T17:56:34.775Z'::timestamp),
  ('01f851a0-7485-49fc-beab-e049437b704f', 'general', 'address', 'Your Store Address, City, State - XXXXXX, India', 'string', 'Address', 'Physical/registered address', FALSE, '2026-09-30T17:56:34.771Z'::timestamp, '2026-09-30T17:56:34.771Z'::timestamp),
  ('f72a64b7-8e78-4d20-ad35-4063cf28c94c', 'checkout', 'prepaid_enabled', 'true', 'boolean', 'Prepaid Enabled', 'Enable online payment', TRUE, '2026-09-30T17:56:34.777Z'::timestamp, '2026-09-30T17:56:34.777Z'::timestamp),
  ('716b527c-42dc-4476-887a-0beea2f1af52', 'branding', 'tagline', 'Quality products delivered to your door', 'string', 'Tagline', 'Store tagline', TRUE, '2026-09-30T17:56:34.774Z'::timestamp, '2026-09-30T17:56:34.774Z'::timestamp),
  ('a5c56745-4755-418f-9fc6-e1242c111651', 'branding', 'secondary_color', '#374151', 'color', 'Secondary Color', 'Brand secondary color', TRUE, '2026-09-30T17:56:34.773Z'::timestamp, '2026-09-30T17:56:34.773Z'::timestamp),
  ('70d0d86e-83ed-41fa-875f-9c04db669bd1', 'storefront', 'meta_title', 'Demo Brand - Quality Products Online', 'string', 'Meta Title', 'SEO meta title', TRUE, '2026-09-30T17:56:34.774Z'::timestamp, '2026-09-30T17:56:34.774Z'::timestamp),
  ('443aa66a-8e75-4802-99c5-9c0865b350ff', 'checkout', 'default_shipping_fee_paisa', '4900', 'integer', 'Default Shipping Fee (paisa)', 'Standard shipping fee', TRUE, '2026-09-30T17:56:34.777Z'::timestamp, '2026-09-30T17:56:34.777Z'::timestamp),
  ('5a2a0797-e5cf-4f9a-90f6-62d6f647227b', 'storefront', 'copyright_text', '© {year} Demo Brand. All rights reserved.', 'string', 'Copyright Text', 'Footer copyright text', TRUE, '2026-09-30T17:56:34.776Z'::timestamp, '2026-09-30T17:56:34.776Z'::timestamp),
  ('9de1a7e2-3aa4-4081-84b9-1bf9356a69da', 'storefront', 'hero_cta_text', 'Shop Now', 'string', 'Hero CTA Text', 'Hero button text', TRUE, '2026-09-30T17:56:34.775Z'::timestamp, '2026-09-30T17:56:34.775Z'::timestamp),
  ('e0d2c517-e313-4561-b1e9-82aa2aa83660', 'storefront', 'social_facebook', '', 'string', 'Facebook URL', 'Facebook page URL', TRUE, '2026-09-30T17:56:34.776Z'::timestamp, '2026-09-30T17:56:34.776Z'::timestamp),
  ('4a073715-3d0c-4fc1-9470-294fb7bd1fed', 'general', 'whatsapp_number', '+91 XXXXXXXXXX', 'string', 'WhatsApp Number', 'WhatsApp support number', TRUE, '2026-09-30T17:56:34.771Z'::timestamp, '2026-09-30T17:56:34.771Z'::timestamp),
  ('a0dc7fe5-a7ef-49ca-a0c0-b34c5bfa2c1a', 'checkout', 'default_tax_percentage', '0', 'string', 'Default Tax Percentage', 'Default tax rate', FALSE, '2026-09-30T17:56:34.777Z'::timestamp, '2026-09-30T17:56:34.777Z'::timestamp),
  ('b1011a8a-c7a5-4b19-924d-edf67f524a61', 'orders', 'order_prefix', 'ORD', 'string', 'Order Number Prefix', 'Prefix for order numbers (e.g. ORD-100001)', FALSE, '2026-09-30T17:56:34.778Z'::timestamp, '2026-09-30T17:56:34.778Z'::timestamp),
  ('15d2e2bd-b3b1-4225-ad04-94413c6ab987', 'checkout', 'cod_enabled', 'true', 'boolean', 'COD Enabled', 'Enable Cash on Delivery', TRUE, '2026-09-30T17:56:34.776Z'::timestamp, '2026-09-30T17:56:34.776Z'::timestamp),
  ('0961ba00-d86f-4f7c-a55a-4c5e77ba53ee', 'branding', 'dark_logo_url', '', 'string', 'Dark Logo URL', 'Dark mode logo URL', TRUE, '2026-09-30T17:56:34.772Z'::timestamp, '2026-09-30T17:56:34.772Z'::timestamp),
  ('d51a2cd2-c620-43a8-a4a2-0a83cd8e1374', 'branding', 'button_style', 'rounded', 'string', 'Button Style', 'rounded | pill | square', TRUE, '2026-09-30T17:56:34.773Z'::timestamp, '2026-09-30T17:56:34.773Z'::timestamp),
  ('56dffeb3-3036-4975-8a86-285d3f0e0a09', 'seo', 'default_description', 'Shop quality products at great prices. Fast delivery across India.', 'string', 'Default Meta Description', 'Default meta description', TRUE, '2026-09-30T17:56:34.779Z'::timestamp, '2026-09-30T17:56:34.779Z'::timestamp),
  ('1a052c13-607f-45cd-b898-271d59b7248d', 'storefront', 'hero_cta_url', '/shop', 'string', 'Hero CTA URL', 'Hero button link', TRUE, '2026-09-30T17:56:34.775Z'::timestamp, '2026-09-30T17:56:34.775Z'::timestamp),
  ('10ac76a1-8738-442b-b866-ecce6cf56c3c', 'orders', 'low_stock_threshold', '5', 'integer', 'Low Stock Threshold', 'Default low stock warning level', FALSE, '2026-09-30T17:56:34.778Z'::timestamp, '2026-09-30T17:56:34.778Z'::timestamp)
on conflict (category, key) do update set
  value = excluded.value,
  label = excluded.label,
  description = excluded.description,
  is_public = excluded.is_public,
  updated_at = now();

insert into settings (id, category, key, value, value_type, label, description, is_public, created_at, updated_at)
select id, category, key, value, value_type, label, description, is_public, created_at, updated_at
from store_settings
on conflict (category, key) do update set
  value = excluded.value,
  label = excluded.label,
  description = excluded.description,
  is_public = excluded.is_public,
  updated_at = now();

COMMIT;
