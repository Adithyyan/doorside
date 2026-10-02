-- Migration: 001_initial_schema.sql
-- Creates the complete initial database schema for the dropshipping platform

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ============================================================
-- ADMIN USERS & ROLES
-- ============================================================

create table if not exists admin_roles (
    id uuid primary key default uuid_generate_v4(),
    name text unique,
    description text,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create table if not exists admin_permissions (
    id uuid primary key default uuid_generate_v4(),
    name text unique,
    description text,
    created_at timestamp default now()
);

create table if not exists admin_role_permissions (
    role_id uuid references admin_roles(id) on delete cascade,
    permission_id uuid references admin_permissions(id) on delete cascade,
    primary key (role_id, permission_id)
);

create table if not exists admin_users (
    id uuid primary key default uuid_generate_v4(),
    name text,
    email text unique,
    password_hash text,
    role_id uuid references admin_roles(id),
    is_active boolean default true,
    last_login_at timestamp,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_admin_users_email on admin_users(email);

-- ============================================================
-- USERS
-- ============================================================

create table if not exists users (
    id uuid primary key default uuid_generate_v4(),
    name text,
    email text unique,
    phone text,
    is_guest boolean default false,
    is_active boolean default true,
    email_verified boolean default false,
    phone_verified boolean default false,
    password_hash text,
    refresh_token_hash text,
    reset_token_hash text,
    reset_token_expires_at timestamp,
    total_orders integer default 0,
    total_spent_paisa bigint default 0,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_users_email on users(email);
create index if not exists idx_users_phone on users(phone);

create table if not exists user_addresses (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    name text,
    phone text,
    house_street text,
    area text,
    landmark text,
    city text,
    state text,
    district text,
    country text default 'India',
    pincode text,
    is_default boolean default false,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_user_addresses_user_id on user_addresses(user_id);

-- ============================================================
-- MEDIA
-- ============================================================

create table if not exists media (
    id uuid primary key default uuid_generate_v4(),
    filename text,
    original_name text,
    url text,
    storage_key text,
    storage_provider text default 'local',
    mime_type text,
    size_bytes bigint,
    alt_text text,
    width integer,
    height integer,
    uploaded_by uuid,
    uploaded_by_type text default 'admin',
    created_at timestamp default now()
);

-- ============================================================
-- CATEGORIES
-- ============================================================

create table if not exists categories (
    id uuid primary key default uuid_generate_v4(),
    parent_id uuid references categories(id) on delete set null,
    name text,
    slug text unique,
    description text,
    image_id uuid references media(id) on delete set null,
    banner_image_id uuid references media(id) on delete set null,
    sort_order integer default 0,
    is_active boolean default true,
    is_featured boolean default false,
    seo_title text,
    seo_description text,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_categories_slug on categories(slug);
create index if not exists idx_categories_parent_id on categories(parent_id);
create index if not exists idx_categories_is_active on categories(is_active);
create index if not exists idx_categories_is_featured on categories(is_featured);

-- ============================================================
-- SUPPLIERS
-- ============================================================

create table if not exists suppliers (
    id uuid primary key default uuid_generate_v4(),
    name text,
    code text unique,
    supplier_type text default 'manual_marketplace',
    integration_type text default 'manual',
    api_base_url text,
    credentials_ref text,
    configuration jsonb default '{}',
    is_active boolean default true,
    notes text,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_suppliers_code on suppliers(code);
create index if not exists idx_suppliers_is_active on suppliers(is_active);

-- ============================================================
-- PRODUCTS
-- ============================================================

create table if not exists products (
    id uuid primary key default uuid_generate_v4(),
    category_id uuid references categories(id) on delete set null,
    name text,
    slug text unique,
    sku text unique,
    short_description text,
    description text,
    specifications jsonb default '{}',
    key_features jsonb default '[]',
    selling_price_paisa bigint default 0,
    compare_at_price_paisa bigint,
    cost_price_paisa bigint,
    tax_percentage numeric(5,2) default 0,
    stock_quantity integer default 0,
    low_stock_threshold integer default 5,
    weight_grams integer,
    length_mm integer,
    width_mm integer,
    height_mm integer,
    brand text,
    status text default 'draft',
    is_featured boolean default false,
    is_active boolean default true,
    is_digital boolean default false,
    seo_title text,
    seo_description text,
    seo_keywords text,
    tags jsonb default '[]',
    related_product_ids jsonb default '[]',
    cross_sell_product_ids jsonb default '[]',
    upsell_product_ids jsonb default '[]',
    frequently_bought_with_ids jsonb default '[]',
    search_vector tsvector,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_category_id on products(category_id);
create index if not exists idx_products_status on products(status);
create index if not exists idx_products_is_active on products(is_active);
create index if not exists idx_products_is_featured on products(is_featured);
create index if not exists idx_products_sku on products(sku);
create index if not exists idx_products_search_vector on products using gin(search_vector);
create index if not exists idx_products_name_trgm on products using gin(name gin_trgm_ops);

-- Product search vector trigger
create or replace function update_product_search_vector()
returns trigger as $$
begin
    new.search_vector := to_tsvector(
        'english',
        coalesce(new.name, '') || ' ' ||
        coalesce(new.short_description, '') || ' ' ||
        coalesce(new.description, '') || ' ' ||
        coalesce(new.brand, '') || ' ' ||
        coalesce(new.sku, '')
    );
    return new;
end;
$$ language plpgsql;

create trigger trg_products_search_vector
before insert or update on products
for each row execute function update_product_search_vector();

-- Product images
create table if not exists product_images (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references products(id) on delete cascade,
    media_id uuid references media(id) on delete cascade,
    sort_order integer default 0,
    is_primary boolean default false,
    created_at timestamp default now()
);

create index if not exists idx_product_images_product_id on product_images(product_id);

-- Product variants
create table if not exists product_variants (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references products(id) on delete cascade,
    name text,
    sku text unique,
    attributes jsonb default '{}',
    selling_price_paisa bigint,
    compare_at_price_paisa bigint,
    cost_price_paisa bigint,
    stock_quantity integer default 0,
    media_id uuid references media(id) on delete set null,
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_product_variants_product_id on product_variants(product_id);
create index if not exists idx_product_variants_sku on product_variants(sku);

-- Product attributes (for faceted filtering)
create table if not exists product_attribute_definitions (
    id uuid primary key default uuid_generate_v4(),
    name text unique,
    display_name text,
    type text default 'text',
    sort_order integer default 0
);

-- ============================================================
-- DYNAMIC FILTERS, VALUES & MAPPINGS
-- ============================================================

-- Dynamic filter groups (e.g. Brand, Material, Color, Rating, Availability)
create table if not exists filters (
    id uuid primary key default uuid_generate_v4(),
    name text,
    code text unique,
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_filters_code on filters(code);
create index if not exists idx_filters_sort_order on filters(sort_order);

-- Filter values / options (e.g. Nike, Red, Blue, Cotton)
create table if not exists filter_values (
    id uuid primary key default uuid_generate_v4(),
    filter_id uuid references filters(id) on delete cascade,
    name text,
    value text,
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_filter_values_filter_id on filter_values(filter_id);
create index if not exists idx_filter_values_value on filter_values(value);
create index if not exists idx_filter_values_sort_order on filter_values(sort_order);

-- Product filter mapping table matching products with filter values by IDs
create table if not exists product_filter_mappings (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references products(id) on delete cascade,
    filter_id uuid references filters(id) on delete cascade,
    filter_value_id uuid references filter_values(id) on delete cascade,
    created_at timestamp default now(),
    unique(product_id, filter_value_id)
);

create index if not exists idx_product_filter_mappings_product_id on product_filter_mappings(product_id);
create index if not exists idx_product_filter_mappings_filter_id on product_filter_mappings(filter_id);
create index if not exists idx_product_filter_mappings_filter_value_id on product_filter_mappings(filter_value_id);

-- Dynamic product sort options with ID mapping
create table if not exists product_sort_options (
    id uuid primary key default uuid_generate_v4(),
    name text,
    code text unique,
    field text,
    direction text default 'asc',
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_product_sort_options_code on product_sort_options(code);
create index if not exists idx_product_sort_options_sort_order on product_sort_options(sort_order);


-- ============================================================
-- SUPPLIER PRODUCTS & MAPPINGS
-- ============================================================

create table if not exists supplier_products (
    id uuid primary key default uuid_generate_v4(),
    supplier_id uuid references suppliers(id) on delete cascade,
    supplier_product_id text,
    supplier_sku text,
    name text,
    url text,
    cost_price_paisa bigint,
    data jsonb default '{}',
    last_synced_at timestamp,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_supplier_products_supplier_id on supplier_products(supplier_id);
create index if not exists idx_supplier_products_supplier_product_id on supplier_products(supplier_product_id);

create table if not exists supplier_product_mappings (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references products(id) on delete cascade,
    variant_id uuid references product_variants(id) on delete cascade,
    supplier_id uuid references suppliers(id),
    supplier_product_id uuid references supplier_products(id) on delete set null,
    supplier_external_product_id text,
    supplier_external_variant_id text,
    supplier_sku text,
    supplier_product_url text,
    cost_price_paisa bigint,
    notes text,
    is_primary boolean default true,
    created_at timestamp default now(),
    updated_at timestamp default now(),
    unique(product_id, supplier_id)
);

create index if not exists idx_supplier_product_mappings_product_id on supplier_product_mappings(product_id);
create index if not exists idx_supplier_product_mappings_supplier_id on supplier_product_mappings(supplier_id);

-- ============================================================
-- COUPONS
-- ============================================================

create table if not exists coupons (
    id uuid primary key default uuid_generate_v4(),
    code text unique,
    description text,
    coupon_type text default 'fixed',
    discount_amount_paisa bigint,
    discount_percentage numeric(5,2),
    max_discount_paisa bigint,
    minimum_order_paisa bigint default 0,
    usage_limit integer,
    per_user_usage_limit integer default 1,
    current_usage integer default 0,
    applicable_category_ids jsonb default '[]',
    applicable_product_ids jsonb default '[]',
    starts_at timestamp,
    expires_at timestamp,
    is_active boolean default true,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_coupons_code on coupons(code);
create index if not exists idx_coupons_is_active on coupons(is_active);

create table if not exists coupon_redemptions (
    id uuid primary key default uuid_generate_v4(),
    coupon_id uuid references coupons(id),
    user_id uuid references users(id) on delete set null,
    order_id uuid,
    discount_amount_paisa bigint default 0,
    created_at timestamp default now()
);

create index if not exists idx_coupon_redemptions_coupon_id on coupon_redemptions(coupon_id);
create index if not exists idx_coupon_redemptions_user_id on coupon_redemptions(user_id);

-- ============================================================
-- ORDERS
-- ============================================================

create table if not exists orders (
    id uuid primary key default uuid_generate_v4(),
    order_number text unique,
    user_id uuid references users(id) on delete set null,

    -- User snapshot
    user_name text,
    user_email text,
    user_phone text,

    -- Status fields
    order_status text default 'placed',
    payment_status text default 'pending',
    fulfillment_status text default 'pending',
    return_status text,

    -- Financial snapshot (in paisa)
    subtotal_paisa bigint default 0,
    discount_paisa bigint default 0,
    shipping_paisa bigint default 0,
    tax_paisa bigint default 0,
    total_paisa bigint default 0,

    -- Cost snapshot
    total_cost_paisa bigint,
    payment_fee_paisa bigint default 0,
    estimated_profit_paisa bigint,

    -- Coupon
    coupon_id uuid references coupons(id),
    coupon_code text,

    -- Payment
    payment_method text default 'pending',
    gateway_order_id text,
    payment_id text,
    payment_at timestamp,
    refund_status text,
    refunded_amount_paisa bigint default 0,

    -- Supplier
    supplier_id uuid references suppliers(id),
    supplier_order_id text,
    supplier_status text,
    supplier_placed_at timestamp,

    -- Shipment
    courier_name text,
    tracking_number text,
    tracking_url text,
    shipped_at timestamp,
    expected_delivery_at timestamp,
    delivered_at timestamp,

    -- Notes
    user_note text,
    internal_note text,
    admin_note text,

    -- Metadata
    ip_address text,
    user_agent text,
    source text default 'web',

    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_orders_order_number on orders(order_number);
create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_orders_order_status on orders(order_status);
create index if not exists idx_orders_payment_status on orders(payment_status);
create index if not exists idx_orders_fulfillment_status on orders(fulfillment_status);
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_orders_tracking_number on orders(tracking_number);
create index if not exists idx_orders_supplier_order_id on orders(supplier_order_id);
create index if not exists idx_orders_gateway_order_id on orders(gateway_order_id);
create index if not exists idx_orders_user_phone on orders(user_phone);

-- Order items
create table if not exists order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) on delete cascade,
    product_id uuid references products(id) on delete set null,
    variant_id uuid references product_variants(id) on delete set null,

    -- Snapshot fields
    product_name text,
    product_sku text,
    variant_name text,
    variant_attributes jsonb default '{}',

    quantity integer default 1,
    unit_price_paisa bigint default 0,
    compare_price_paisa bigint,
    unit_cost_paisa bigint,
    tax_percentage numeric(5,2) default 0,
    tax_amount_paisa bigint default 0,
    discount_paisa bigint default 0,
    subtotal_paisa bigint default 0,

    -- Supplier mapping snapshot
    supplier_id uuid references suppliers(id),
    supplier_product_url text,
    supplier_external_product_id text,

    -- Return info
    return_quantity integer default 0,
    is_returned boolean default false,

    created_at timestamp default now()
);

create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_order_items_product_id on order_items(product_id);

-- Order addresses
create table if not exists order_addresses (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) on delete cascade,
    address_type text default 'shipping',
    name text,
    phone text,
    email text,
    house_street text,
    area text,
    landmark text,
    city text,
    state text,
    district text,
    country text default 'India',
    pincode text,
    gstin text,
    created_at timestamp default now()
);

create index if not exists idx_order_addresses_order_id on order_addresses(order_id);

-- Order status history
create table if not exists order_status_history (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) on delete cascade,
    status_type text default 'order_status',
    old_status text,
    new_status text,
    changed_by uuid,
    changed_by_type text,
    source text default 'system',
    note text,
    created_at timestamp default now()
);

create index if not exists idx_order_status_history_order_id on order_status_history(order_id);
create index if not exists idx_order_status_history_created_at on order_status_history(created_at desc);

-- ============================================================
-- PAYMENTS & REFUNDS
-- ============================================================

create table if not exists payments (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) on delete cascade,
    payment_method text,
    gateway text,
    gateway_order_id text,
    gateway_payment_id text unique,
    gateway_signature text,
    amount_paisa bigint default 0,
    currency text default 'INR',
    status text default 'pending',
    is_verified boolean default false,
    verified_at timestamp,
    gateway_response jsonb default '{}',
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_payments_order_id on payments(order_id);
create index if not exists idx_payments_gateway_order_id on payments(gateway_order_id);
create index if not exists idx_payments_gateway_payment_id on payments(gateway_payment_id);

create table if not exists refunds (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) on delete cascade,
    payment_id uuid references payments(id),
    amount_paisa bigint default 0,
    reason text,
    status text default 'pending',
    gateway_refund_id text,
    initiated_by uuid,
    initiated_by_type text default 'admin',
    internal_note text,
    completed_at timestamp,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_refunds_order_id on refunds(order_id);

-- ============================================================
-- SUPPLIER ORDERS
-- ============================================================

create table if not exists supplier_orders (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) on delete cascade,
    supplier_id uuid references suppliers(id),
    supplier_order_id text,
    status text default 'pending',
    source_cost_paisa bigint,
    placed_at timestamp,
    tracking_number text,
    tracking_url text,
    courier_name text,
    notes text,
    raw_response jsonb default '{}',
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_supplier_orders_order_id on supplier_orders(order_id);
create index if not exists idx_supplier_orders_supplier_id on supplier_orders(supplier_id);

create table if not exists supplier_order_items (
    id uuid primary key default uuid_generate_v4(),
    supplier_order_id uuid references supplier_orders(id) on delete cascade,
    order_item_id uuid references order_items(id) on delete set null,
    supplier_product_id text,
    supplier_sku text,
    quantity integer default 1,
    unit_cost_paisa bigint,
    created_at timestamp default now()
);

create index if not exists idx_supplier_order_items_supplier_order_id on supplier_order_items(supplier_order_id);

-- Supplier webhook events
create table if not exists supplier_webhook_events (
    id uuid primary key default uuid_generate_v4(),
    supplier_id uuid references suppliers(id),
    provider text,
    event_type text,
    idempotency_key text unique,
    payload jsonb default '{}',
    signature text,
    status text default 'received',
    retry_count integer default 0,
    error_message text,
    received_at timestamp default now(),
    processed_at timestamp,
    created_at timestamp default now()
);

create index if not exists idx_supplier_webhook_events_provider on supplier_webhook_events(provider);
create index if not exists idx_supplier_webhook_events_status on supplier_webhook_events(status);
create index if not exists idx_supplier_webhook_events_idempotency on supplier_webhook_events(idempotency_key);

-- ============================================================
-- REVIEWS
-- ============================================================

create table if not exists reviews (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references products(id) on delete cascade,
    user_id uuid references users(id) on delete set null,
    order_item_id uuid references order_items(id) on delete set null,
    rating integer check (rating between 1 and 5),
    title text,
    message text,
    status text default 'pending',
    is_verified_purchase boolean default false,
    admin_reply text,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_reviews_product_id on reviews(product_id);
create index if not exists idx_reviews_status on reviews(status);
create index if not exists idx_reviews_user_id on reviews(user_id);

-- ============================================================
-- CONTENT / CMS
-- ============================================================

create table if not exists pages (
    id uuid primary key default uuid_generate_v4(),
    slug text unique,
    title text,
    content text,
    meta_title text,
    meta_description text,
    is_published boolean default false,
    sort_order integer default 0,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists idx_pages_slug on pages(slug);

create table if not exists homepage_sections (
    id uuid primary key default uuid_generate_v4(),
    section_type text,
    title text,
    subtitle text,
    content jsonb default '{}',
    is_enabled boolean default true,
    sort_order integer default 0,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create table if not exists navigation_items (
    id uuid primary key default uuid_generate_v4(),
    parent_id uuid references navigation_items(id) on delete cascade,
    location text default 'header',
    label text,
    url text,
    category_id uuid references categories(id) on delete set null,
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

-- ============================================================
-- STORE SETTINGS
-- ============================================================

create table if not exists store_settings (
    id uuid primary key default uuid_generate_v4(),
    category text,
    key text,
    value text,
    value_type text default 'string',
    label text,
    description text,
    is_public boolean default false,
    created_at timestamp default now(),
    updated_at timestamp default now(),
    unique(category, key)
);

create index if not exists idx_store_settings_category on store_settings(category);
create index if not exists idx_store_settings_key on store_settings(key);
create index if not exists idx_store_settings_is_public on store_settings(is_public);

-- ============================================================
-- WISHLIST
-- ============================================================

create table if not exists wishlists (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    product_id uuid references products(id) on delete cascade,
    created_at timestamp default now(),
    unique(user_id, product_id)
);

create index if not exists idx_wishlists_user_id on wishlists(user_id);

-- ============================================================
-- AUDIT LOGS
-- ============================================================

create table if not exists audit_logs (
    id uuid primary key default uuid_generate_v4(),
    admin_user_id uuid references admin_users(id) on delete set null,
    action text,
    entity text,
    entity_id uuid,
    old_values jsonb,
    new_values jsonb,
    ip_address text,
    user_agent text,
    created_at timestamp default now()
);

create index if not exists idx_audit_logs_admin_user_id on audit_logs(admin_user_id);
create index if not exists idx_audit_logs_entity on audit_logs(entity, entity_id);
create index if not exists idx_audit_logs_action on audit_logs(action);
create index if not exists idx_audit_logs_created_at on audit_logs(created_at desc);

-- ============================================================
-- REFRESH TOKENS (Admin)
-- ============================================================

create table if not exists admin_refresh_tokens (
    id uuid primary key default uuid_generate_v4(),
    admin_user_id uuid references admin_users(id) on delete cascade,
    token_hash text unique,
    expires_at timestamp,
    is_revoked boolean default false,
    created_at timestamp default now()
);

create index if not exists idx_admin_refresh_tokens_token_hash on admin_refresh_tokens(token_hash);
create index if not exists idx_admin_refresh_tokens_admin_user_id on admin_refresh_tokens(admin_user_id);

-- ============================================================
-- ORDER SEQUENCE
-- ============================================================

create sequence if not exists order_number_seq start with 100001;
