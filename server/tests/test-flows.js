const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MockDatabase } = require('../db/mock-db');
const { generateOrderNumber } = require('../helpers');
const config = require('../env');
const { ADMIN_ROLES, ROLE_PERMISSIONS, PERMISSIONS } = require('../constants');

async function runAllFlowTests() {
  console.log('\n======================================================');
  console.log('  STARTING MOCK DB & END-TO-END FLOW VERIFICATION');
  console.log('======================================================\n');

  const mockDbPath = path.join(__dirname, '../db/test-mock-db.json');
  const db = new MockDatabase(mockDbPath);

  try {
    // -------------------------------------------------------------
    // FLOW 1: Mock DB Initialization & JSON File Creation
    // -------------------------------------------------------------
    console.log('1. [Database] Initializing Mock DB with JSON structure...');
    db.init();
    if (!fs.existsSync(mockDbPath)) {
      throw new Error('Mock DB JSON file was not created on disk!');
    }
    const rawContent = JSON.parse(fs.readFileSync(mockDbPath, 'utf-8'));
    if (!rawContent.admin_roles || !rawContent.store_settings) {
      throw new Error('Mock DB JSON structure is missing core tables!');
    }
    console.log('   ✓ Mock DB JSON file created at:', mockDbPath);
    console.log('   ✓ Verified JSON structure contains all core collections.\n');

    // -------------------------------------------------------------
    // FLOW 2: Admin Auth, Password Hashing & RBAC Flow
    // -------------------------------------------------------------
    console.log('2. [Admin Flow] Testing Admin User, Hashing & RBAC...');
    const superAdminRole = db.findOne('admin_roles', (r) => r.name === 'super_admin');
    const adminPassword = 'AdminSecret@2026';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const adminUser = db.insert('admin_users', {
      name: 'Super Administrator',
      email: 'admin@dropship.test',
      password_hash: passwordHash,
      role_id: superAdminRole.id,
      is_active: true,
    });

    const isPasswordValid = await bcrypt.compare(adminPassword, adminUser.password_hash);
    if (!isPasswordValid) throw new Error('Admin password hash verification failed');

    const adminToken = jwt.sign(
      { id: adminUser.id, email: adminUser.email, role: 'super_admin', isAdmin: true },
      config.jwt.accessSecret,
      { expiresIn: '15m' },
    );
    const decodedAdmin = jwt.verify(adminToken, config.jwt.accessSecret);
    if (decodedAdmin.email !== 'admin@dropship.test') throw new Error('Admin JWT decode mismatch');

    const permissions = ROLE_PERMISSIONS[ADMIN_ROLES.SUPER_ADMIN];
    if (!permissions.includes(PERMISSIONS.MANAGE_ORDERS)) {
      throw new Error('Super Admin missing MANAGE_ORDERS permission');
    }
    console.log('   ✓ Admin user registered, bcrypt hashed, and JWT generated.');
    console.log('   ✓ RBAC verified:', permissions.length, 'permissions active.\n');

    // -------------------------------------------------------------
    // FLOW 3: Category & Catalog Hierarchy Flow
    // -------------------------------------------------------------
    console.log('3. [Catalog Flow] Testing Categories & Hierarchy...');
    const parentCategory = db.insert('categories', {
      name: 'Electronics & Audio',
      slug: 'electronics-audio',
      description: 'Audio accessories and smart electronics',
      is_active: true,
      is_featured: true,
      sort_order: 1,
    });

    const childCategory = db.insert('categories', {
      name: 'Wireless Earbuds',
      slug: 'wireless-earbuds',
      parent_id: parentCategory.id,
      description: 'Noise cancelling Bluetooth earbuds',
      is_active: true,
      is_featured: false,
      sort_order: 2,
    });

    const categoriesTree = db.find('categories', (c) => c.is_active);
    if (categoriesTree.length < 2) throw new Error('Categories not saved in mock DB');
    console.log('   ✓ Created parent category:', parentCategory.name);
    console.log('   ✓ Created child category linked via parent_id:', childCategory.name, '\n');

    // -------------------------------------------------------------
    // FLOW 4: Product Catalog & Variants Flow
    // -------------------------------------------------------------
    console.log('4. [Product Flow] Testing Products, Pricing & Variants...');
    const product = db.insert('products', {
      category_id: childCategory.id,
      name: 'Pro ANC Wireless Earbuds',
      slug: 'pro-anc-wireless-earbuds',
      sku: 'EAR-ANC-001',
      short_description: 'Active noise cancellation earbuds',
      selling_price_paisa: 149900, // ₹1,499.00
      compare_at_price_paisa: 299900, // ₹2,999.00
      cost_price_paisa: 60000, // ₹600.00
      stock_quantity: 50,
      status: 'active',
      is_active: true,
    });

    const variantBlack = db.insert('product_variants', {
      product_id: product.id,
      name: 'Matte Black',
      sku: 'EAR-ANC-BLK',
      attributes: { color: 'Black' },
      selling_price_paisa: 149900,
      stock_quantity: 30,
      is_active: true,
    });

    const variantWhite = db.insert('product_variants', {
      product_id: product.id,
      name: 'Glossy White',
      sku: 'EAR-ANC-WHT',
      attributes: { color: 'White' },
      selling_price_paisa: 149900,
      stock_quantity: 20,
      is_active: true,
    });

    if (product.stock_quantity !== 50) throw new Error('Product stock quantity mismatch');
    console.log('   ✓ Product created with price ₹', product.selling_price_paisa / 100);
    console.log('   ✓ 2 product variants linked (Matte Black, Glossy White).\n');

    // -------------------------------------------------------------
    // FLOW 4B: Dynamic Product Filters with Mapping Table & Sort Flow
    // -------------------------------------------------------------
    console.log('4B. [Dynamic Filters & Sort Flow] Testing Filter Tables, Mapping by IDs & Dynamic Sort...');
    const brandFilter = db.insert('filters', {
      name: 'Brand',
      code: 'brand',
      sort_order: 1,
      is_active: true,
    });
    const colorFilter = db.insert('filters', {
      name: 'Color',
      code: 'color',
      sort_order: 2,
      is_active: true,
    });

    const valSonicWave = db.insert('filter_values', {
      filter_id: brandFilter.id,
      name: 'SonicWave',
      value: 'sonicwave',
      sort_order: 1,
      is_active: true,
    });
    const valBlack = db.insert('filter_values', {
      filter_id: colorFilter.id,
      name: 'Midnight Black',
      value: 'black',
      sort_order: 1,
      is_active: true,
    });
    const valWhite = db.insert('filter_values', {
      filter_id: colorFilter.id,
      name: 'Pearl White',
      value: 'white',
      sort_order: 2,
      is_active: true,
    });

    // Create a 2nd product with a different price to verify sorting
    const product2 = db.insert('products', {
      category_id: childCategory.id,
      name: 'Aero ANC Headphone Max',
      slug: 'aero-anc-headphone-max',
      sku: 'HEAD-ANC-002',
      selling_price_paisa: 349900, // ₹3,499.00 (more expensive than product 1)
      compare_at_price_paisa: 499900,
      stock_quantity: 30,
      status: 'active',
      is_active: true,
      is_featured: true,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    });

    // Map Product 1 to SonicWave + Black via product_filter_mappings
    db.insert('product_filter_mappings', {
      product_id: product.id,
      filter_id: brandFilter.id,
      filter_value_id: valSonicWave.id,
    });
    db.insert('product_filter_mappings', {
      product_id: product.id,
      filter_id: colorFilter.id,
      filter_value_id: valBlack.id,
    });

    // Map Product 2 to SonicWave + White via product_filter_mappings
    db.insert('product_filter_mappings', {
      product_id: product2.id,
      filter_id: brandFilter.id,
      filter_value_id: valSonicWave.id,
    });
    db.insert('product_filter_mappings', {
      product_id: product2.id,
      filter_id: colorFilter.id,
      filter_value_id: valWhite.id,
    });

    // Test filtering by Filter Value ID using the mapping table
    const mappedBlackProducts = db.find('product_filter_mappings', (m) => m.filter_value_id === valBlack.id);
    if (mappedBlackProducts.length !== 1 || mappedBlackProducts[0].product_id !== product.id) {
      throw new Error('Mapping table lookup for Midnight Black failed');
    }

    const mappedSonicProducts = db.find('product_filter_mappings', (m) => m.filter_value_id === valSonicWave.id);
    if (mappedSonicProducts.length !== 2) {
      throw new Error('Mapping table lookup for Brand SonicWave failed');
    }

    // Dynamic Sort Options with ID mapping
    const sortPriceAsc = db.insert('product_sort_options', {
      name: 'Price: Low to High',
      code: 'price_asc',
      field: 'selling_price_paisa',
      direction: 'asc',
      sort_order: 1,
      is_active: true,
    });
    const sortPriceDesc = db.insert('product_sort_options', {
      name: 'Price: High to Low',
      code: 'price_desc',
      field: 'selling_price_paisa',
      direction: 'desc',
      sort_order: 2,
      is_active: true,
    });

    // Resolve products by dynamic sort option
    const allCatalogProducts = [product, product2];
    const sortedAsc = [...allCatalogProducts].sort((a, b) =>
      sortPriceAsc.direction === 'asc'
        ? a[sortPriceAsc.field] - b[sortPriceAsc.field]
        : b[sortPriceAsc.field] - a[sortPriceAsc.field]
    );
    if (sortedAsc[0].id !== product.id) {
      throw new Error('Dynamic sort price_asc failed');
    }

    const sortedDesc = [...allCatalogProducts].sort((a, b) =>
      sortPriceDesc.direction === 'asc'
        ? a[sortPriceDesc.field] - b[sortPriceDesc.field]
        : b[sortPriceDesc.field] - a[sortPriceDesc.field]
    );
    if (sortedDesc[0].id !== product2.id) {
      throw new Error('Dynamic sort price_desc failed');
    }

    console.log('   ✓ Filter tables created (filters, filter_values).');
    console.log('   ✓ Mapping table created (product_filter_mappings) matching products with IDs.');
    console.log('   ✓ Verified filter matching by ID (Single & Multi-value).');
    console.log('   ✓ Verified dynamic sort options with ID mapping (price_asc & price_desc).\n');

    // -------------------------------------------------------------
    // FLOW 5: User Registration & Address Flow
    // -------------------------------------------------------------
    console.log('5. [User Flow] Testing User Registration & Address...');
    const userPassword = 'UserPass123!';
    const userHash = await bcrypt.hash(userPassword, 10);

    const user = db.insert('users', {
      name: 'Adhio Test User',
      email: 'user@dropship.test',
      phone: '9876543210',
      password_hash: userHash,
      is_active: true,
    });

    const userAddress = db.insert('user_addresses', {
      user_id: user.id,
      name: 'Adhio',
      phone: '9876543210',
      house_street: '42 Tech Park Avenue',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pincode: '560001',
      is_default: true,
    });

    const userToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name, isAdmin: false },
      config.jwt.accessSecret,
      { expiresIn: '7d' },
    );
    const decodedUser = jwt.verify(userToken, config.jwt.accessSecret);
    if (decodedUser.id !== user.id) throw new Error('User JWT verify mismatch');
    console.log('   ✓ User registered and authenticated successfully.');
    console.log('   ✓ Saved user address:', userAddress.city, userAddress.pincode, '\n');

    // -------------------------------------------------------------
    // FLOW 6: Cart & Pricing Calculations
    // -------------------------------------------------------------
    console.log('6. [Cart & Pricing Flow] Testing Order Totals & Free Shipping...');
    const itemQuantity = 2;
    const itemPricePaisa = variantBlack.selling_price_paisa;
    const subtotalPaisa = itemPricePaisa * itemQuantity; // ₹2,998.00

    const freeShippingSetting = db.findOne('store_settings', (s) => s.key === 'free_shipping_threshold_paisa');
    const freeShippingThreshold = parseInt(freeShippingSetting.value, 10); // 49900 (₹499)
    const shippingFeePaisa = subtotalPaisa >= freeShippingThreshold ? 0 : 4900;

    if (shippingFeePaisa !== 0) throw new Error('Free shipping threshold not applied properly');
    console.log('   ✓ Subtotal calculated: ₹', subtotalPaisa / 100);
    console.log('   ✓ Free shipping applied (Threshold ₹', freeShippingThreshold / 100, 'met)\n');

    // -------------------------------------------------------------
    // FLOW 7: Coupon Validation & Discount Flow
    // -------------------------------------------------------------
    console.log('7. [Coupon Flow] Testing Coupon Creation & Application...');
    const coupon = db.insert('coupons', {
      code: 'WELCOME10',
      description: '10% discount on orders above ₹500',
      coupon_type: 'percentage',
      discount_percentage: 10,
      max_discount_paisa: 50000, // max ₹500
      minimum_order_paisa: 50000, // min ₹500
      usage_limit: 100,
      current_usage: 0,
      is_active: true,
    });

    if (subtotalPaisa < coupon.minimum_order_paisa) {
      throw new Error('Order does not meet coupon minimum order value');
    }

    const rawDiscount = Math.round((subtotalPaisa * coupon.discount_percentage) / 100);
    const discountPaisa = Math.min(rawDiscount, coupon.max_discount_paisa);
    const totalPaisa = subtotalPaisa - discountPaisa + shippingFeePaisa;

    db.update('coupons', (c) => c.id === coupon.id, { current_usage: coupon.current_usage + 1 });
    console.log('   ✓ Applied coupon:', coupon.code);
    console.log('   ✓ Discount calculated: ₹', discountPaisa / 100);
    console.log('   ✓ Final total: ₹', totalPaisa / 100, '\n');

    // -------------------------------------------------------------
    // FLOW 8: Order Placement & Inventory Deduction Flow
    // -------------------------------------------------------------
    console.log('8. [Order Flow] Placing Order & Deducting Stock...');
    const orderNumber = generateOrderNumber('DS', 101);

    const order = db.insert('orders', {
      order_number: orderNumber,
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      user_phone: user.phone,
      order_status: 'placed',
      payment_status: 'pending',
      fulfillment_status: 'pending',
      subtotal_paisa: subtotalPaisa,
      discount_paisa: discountPaisa,
      shipping_paisa: shippingFeePaisa,
      total_paisa: totalPaisa,
      coupon_id: coupon.id,
      coupon_code: coupon.code,
      payment_method: 'cod',
    });

    const orderItem = db.insert('order_items', {
      order_id: order.id,
      product_id: product.id,
      variant_id: variantBlack.id,
      product_name: product.name,
      variant_name: variantBlack.name,
      quantity: itemQuantity,
      unit_price_paisa: itemPricePaisa,
      subtotal_paisa: subtotalPaisa,
    });

    db.insert('order_addresses', {
      order_id: order.id,
      address_type: 'shipping',
      name: userAddress.name,
      phone: userAddress.phone,
      house_street: userAddress.house_street,
      city: userAddress.city,
      state: userAddress.state,
      country: userAddress.country,
      pincode: userAddress.pincode,
    });

    // Deduct variant stock
    db.update('product_variants', (v) => v.id === variantBlack.id, {
      stock_quantity: variantBlack.stock_quantity - itemQuantity,
    });

    const updatedVariant = db.findOne('product_variants', (v) => v.id === variantBlack.id);
    if (updatedVariant.stock_quantity !== 28) {
      throw new Error('Stock deduction mismatch. Expected 28, got ' + updatedVariant.stock_quantity);
    }

    console.log('   ✓ Order created with Order Number:', order.order_number);
    console.log('   ✓ Order items and address recorded.');
    console.log('   ✓ Stock successfully decremented from 30 to', updatedVariant.stock_quantity, '\n');

    // -------------------------------------------------------------
    // FLOW 9: Order Status Progression & Audit Trail Flow
    // -------------------------------------------------------------
    console.log('9. [Fulfillment Flow] Status Progression & Audit History...');
    const statusSequence = ['confirmed', 'processing', 'shipped', 'delivered'];

    for (const nextStatus of statusSequence) {
      const currentOrder = db.findOne('orders', (o) => o.id === order.id);
      db.update('orders', (o) => o.id === order.id, { order_status: nextStatus });
      db.insert('order_status_history', {
        order_id: order.id,
        status_type: 'order_status',
        old_status: currentOrder.order_status,
        new_status: nextStatus,
        changed_by_type: 'admin',
        note: `Order advanced to ${nextStatus}`,
      });
    }

    const history = db.find('order_status_history', (h) => h.order_id === order.id);
    if (history.length !== 4) throw new Error('Order status history count mismatch');
    console.log('   ✓ Advanced order through: placed -> confirmed -> processing -> shipped -> delivered.');
    console.log('   ✓ 4 status transition audit entries recorded.\n');

    // -------------------------------------------------------------
    // FLOW 10: Payment Record & Verification Flow
    // -------------------------------------------------------------
    console.log('10. [Payment Flow] Recording and Verifying Payment...');
    const payment = db.insert('payments', {
      order_id: order.id,
      payment_method: 'cod',
      gateway: 'cod',
      amount_paisa: totalPaisa,
      status: 'paid',
      is_verified: true,
      verified_at: new Date().toISOString(),
    });

    db.update('orders', (o) => o.id === order.id, { payment_status: 'paid' });
    const finalizedOrder = db.findOne('orders', (o) => o.id === order.id);
    if (finalizedOrder.payment_status !== 'paid') throw new Error('Payment status update failed');
    console.log('   ✓ Payment record created (Amount ₹', payment.amount_paisa / 100, ')');
    console.log('   ✓ Order payment_status updated to paid.\n');

    // -------------------------------------------------------------
    // FLOW 11: Store Settings & Branding Flow
    // -------------------------------------------------------------
    console.log('11. [Settings Flow] Retrieving & Updating Store Settings...');
    db.update('store_settings', (s) => s.key === 'brand_name', { value: 'DropShip Luxe' });
    const brandSetting = db.findOne('store_settings', (s) => s.key === 'brand_name');
    if (brandSetting.value !== 'DropShip Luxe') throw new Error('Store setting update failed');
    console.log('   ✓ Brand name updated to:', brandSetting.value, '\n');

    console.log('======================================================');
    console.log('  ALL 11 APPLICATION FLOWS PASSED SUCCESSFULLY!');
    console.log('======================================================\n');
  } finally {
    // -------------------------------------------------------------
    // TEARDOWN: Automatic Deletion of Mock DB
    // -------------------------------------------------------------
    console.log('12. [Teardown] Cleaning up: Deleting Mock DB JSON file as requested...');
    db.destroy();
    if (fs.existsSync(mockDbPath)) {
      throw new Error('Failed to delete mock DB file after testing!');
    }
    console.log('   ✓ Mock DB file deleted cleanly from disk. No temporary files left behind.\n');
  }
}

if (require.main === module) {
  runAllFlowTests()
    .then(() => {
      console.log('Test execution completed with 0 errors.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('\nFlow test failed:', err);
      process.exit(1);
    });
}

module.exports = { runAllFlowTests };
