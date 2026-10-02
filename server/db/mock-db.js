const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function generateUuid() {
  return crypto.randomUUID();
}

/**
 * Default JSON structure for the entire dropshipping platform.
 */
function createDefaultSchema() {
  return {
    admin_roles: [
      {
        id: '11111111-1111-4111-8111-111111111111',
        name: 'super_admin',
        description: 'Full administrative access',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '22222222-2222-4222-8222-222222222222',
        name: 'order_manager',
        description: 'Manage orders and fulfillment',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    admin_permissions: [
      { id: generateUuid(), name: 'manage_orders', description: 'Can view and update orders', created_at: new Date().toISOString() },
      { id: generateUuid(), name: 'manage_products', description: 'Can manage catalog products', created_at: new Date().toISOString() },
      { id: generateUuid(), name: 'manage_settings', description: 'Can update store settings', created_at: new Date().toISOString() },
      { id: generateUuid(), name: 'manage_admin_users', description: 'Can manage admin staff', created_at: new Date().toISOString() },
    ],
    admin_role_permissions: [],
    admin_users: [],
    admin_refresh_tokens: [],
    users: [],
    user_addresses: [],
    media: [],
    categories: [],
    suppliers: [],
    products: [],
    product_images: [],
    product_variants: [],
    product_attribute_definitions: [],
    filters: [],
    filter_values: [],
    product_filter_mappings: [],
    product_sort_options: [],
    supplier_products: [],
    supplier_product_mappings: [],
    coupons: [],
    coupon_redemptions: [],
    orders: [],
    order_items: [],
    order_addresses: [],
    order_status_history: [],
    payments: [],
    refunds: [],
    supplier_orders: [],
    supplier_order_items: [],
    supplier_webhook_events: [],
    reviews: [],
    pages: [],
    homepage_sections: [],
    navigation_items: [],
    store_settings: [
      { id: generateUuid(), category: 'general', key: 'brand_name', value: 'Store', value_type: 'string', is_public: true },
      { id: generateUuid(), category: 'general', key: 'support_email', value: 'support@example.com', value_type: 'string', is_public: true },
      { id: generateUuid(), category: 'general', key: 'support_phone', value: '+91 98765 43210', value_type: 'string', is_public: true },
      { id: generateUuid(), category: 'branding', key: 'primary_color', value: '#0f172a', value_type: 'color', is_public: true },
      { id: generateUuid(), category: 'checkout', key: 'free_shipping_threshold_paisa', value: '49900', value_type: 'integer', is_public: true },
      { id: generateUuid(), category: 'checkout', key: 'default_shipping_fee_paisa', value: '4900', value_type: 'integer', is_public: true },
      { id: generateUuid(), category: 'checkout', key: 'cod_enabled', value: 'true', value_type: 'boolean', is_public: true },
      { id: generateUuid(), category: 'checkout', key: 'prepaid_enabled', value: 'true', value_type: 'boolean', is_public: true },
    ],
    wishlists: [],
    audit_logs: [],
  };
}

class MockDatabase {
  constructor(filePath = path.join(__dirname, 'mock-db.json')) {
    this.filePath = filePath;
    this.data = null;
    this.isInitialized = false;
  }

  /**
   * Initializes the mock database file with the JSON structure.
   */
  init(initialData = null) {
    this.data = initialData || createDefaultSchema();
    this.save();
    this.isInitialized = true;
    return this.data;
  }

  /**
   * Writes the current JSON structure to disk.
   */
  save() {
    if (!this.data) {
      this.data = createDefaultSchema();
    }
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  /**
   * Loads the JSON structure from disk.
   */
  load() {
    if (fs.existsSync(this.filePath)) {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      this.data = JSON.parse(raw);
      this.isInitialized = true;
    } else {
      this.init();
    }
    return this.data;
  }

  /**
   * Deletes the mock database file after creating/testing.
   */
  destroy() {
    if (fs.existsSync(this.filePath)) {
      try {
        fs.unlinkSync(this.filePath);
      } catch (err) {
        // If file cannot be unlinked immediately, retry or ignore
      }
    }
    this.data = null;
    this.isInitialized = false;
  }

  /**
   * Checks if the mock database file exists.
   */
  exists() {
    return fs.existsSync(this.filePath);
  }

  // --- Collection Query Methods ---

  getTable(tableName) {
    if (!this.data) {
      this.load();
    }
    const resolvedName = tableName === 'customers'
      ? 'users'
      : (tableName === 'customer_addresses' ? 'user_addresses' : tableName);
    if (!this.data[resolvedName]) {
      this.data[resolvedName] = [];
    }
    return this.data[resolvedName];
  }

  insert(tableName, row) {
    const table = this.getTable(tableName);
    const newRecord = {
      id: row.id || generateUuid(),
      ...row,
      created_at: row.created_at || new Date().toISOString(),
      updated_at: row.updated_at || new Date().toISOString(),
    };
    table.push(newRecord);
    this.save();
    return { ...newRecord };
  }

  find(tableName, predicate = () => true) {
    const table = this.getTable(tableName);
    return table.filter(predicate).map((item) => ({ ...item }));
  }

  findOne(tableName, predicate = () => true) {
    const table = this.getTable(tableName);
    const item = table.find(predicate);
    return item ? { ...item } : null;
  }

  update(tableName, predicate, updates) {
    const table = this.getTable(tableName);
    const updated = [];
    table.forEach((item, index) => {
      if (predicate(item)) {
        table[index] = {
          ...item,
          ...updates,
          updated_at: new Date().toISOString(),
        };
        updated.push({ ...table[index] });
      }
    });
    if (updated.length > 0) {
      this.save();
    }
    return updated;
  }

  delete(tableName, predicate) {
    const table = this.getTable(tableName);
    const initialLength = table.length;
    this.data[tableName] = table.filter((item) => !predicate(item));
    const deletedCount = initialLength - this.data[tableName].length;
    if (deletedCount > 0) {
      this.save();
    }
    return deletedCount;
  }

  count(tableName, predicate = () => true) {
    return this.find(tableName, predicate).length;
  }

  /**
   * Transaction wrapper mock
   */
  async tx(callback) {
    // In mock JSON db, transaction runs in-memory and saves upon completion
    const snapshot = JSON.stringify(this.data);
    try {
      const result = await callback(this);
      this.save();
      return result;
    } catch (err) {
      this.data = JSON.parse(snapshot);
      this.save();
      throw err;
    }
  }
}

module.exports = {
  MockDatabase,
  createDefaultSchema,
  generateUuid,
};
