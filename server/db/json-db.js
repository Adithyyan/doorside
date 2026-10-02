const { newDb } = require('pg-mem');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const logger = require('../logger');

const JSON_DB_FILE = path.join(__dirname, 'mock-db.json');
const SCHEMA_FILE = path.join(__dirname, 'migrations', '001_initial_schema.sql');
const SEED_FILE = path.join(__dirname, 'seeds', '001_default_settings.sql');

let saveTimeout = null;

function createJsonDatabase() {
  const mem = newDb();

  // Register essential PostgreSQL functions
  mem.public.registerFunction({
    name: 'uuid_generate_v4',
    impure: true,
    implementation: () => crypto.randomUUID(),
  });
  mem.public.registerFunction({
    name: 'now',
    implementation: () => new Date(),
  });
  mem.public.registerFunction({
    name: 'version',
    implementation: () => 'PostgreSQL 16.0 (pg-mem JSON Engine)',
  });
  mem.public.registerFunction({
    name: 'lower',
    implementation: (str) => (str ? String(str).toLowerCase() : str),
  });
  mem.public.registerFunction({
    name: 'upper',
    implementation: (str) => (str ? String(str).toUpperCase() : str),
  });
  mem.public.registerFunction({
    name: 'concat',
    implementation: (...args) => args.join(''),
  });

  // 1. Initialize schema
  if (fs.existsSync(SCHEMA_FILE)) {
    let schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf-8');
    schemaSql = schemaSql.replace(/create extension[^;]+;/gi, '');
    schemaSql = schemaSql.replace(/create or replace function[\s\S]+?\$\$ language plpgsql;/gi, '');
    schemaSql = schemaSql.replace(/create trigger[^;]+;/gi, '');
    schemaSql = schemaSql.replace(/create index[^;]+gin[^;]+;/gi, '');
    schemaSql = schemaSql.replace(/search_vector\s+tsvector/gi, 'search_vector text');
    mem.public.none(schemaSql);

    // Also ensure a 'settings' table exists matching 'store_settings'
    try {
      mem.public.none(`
        create table if not exists settings (
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
        create table if not exists roles (
            id uuid primary key default uuid_generate_v4(),
            name text unique,
            description text,
            created_at timestamp default now(),
            updated_at timestamp default now()
        );
      `);
    } catch {
      // ignore
    }
  }

  const rawDb = mem.adapters.createPgPromise();

  // Debounced auto-save to mock-db.json
  function scheduleSave() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      try {
        const tableRows = mem.public.many(
          "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE'",
        );
        const dump = {};
        for (const { table_name } of tableRows) {
          dump[table_name] = mem.public.many(`select * from "${table_name}"`);
        }
        fs.writeFileSync(JSON_DB_FILE, JSON.stringify(dump, null, 2), 'utf-8');
      } catch (err) {
        logger?.error?.('Failed to save to mock-db.json:', err.message);
      }
    }, 200);
  }

  // 2. Load data from mock-db.json if it exists, otherwise run seeds
  if (fs.existsSync(JSON_DB_FILE)) {
    try {
      const rawData = JSON.parse(fs.readFileSync(JSON_DB_FILE, 'utf-8'));
      const preferredOrder = [
        'admin_roles', 'admin_permissions', 'admin_role_permissions', 'admin_users',
        'media', 'categories', 'suppliers', 'products', 'product_images', 'product_variants',
        'filters', 'filter_values', 'product_filter_mappings', 'product_sort_options',
        'store_settings', 'pages', 'homepage_sections', 'users', 'user_addresses',
        'coupons', 'orders', 'order_items', 'order_addresses', 'order_status_history',
        'payments', 'reviews', 'wishlists', 'audit_logs',
      ];

      const tableNames = Object.keys(rawData).sort((a, b) => {
        const idxA = preferredOrder.indexOf(a);
        const idxB = preferredOrder.indexOf(b);
        return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
      });

      for (const tableName of tableNames) {
        const rows = rawData[tableName];
        if (!Array.isArray(rows) || rows.length === 0) continue;

        for (const row of rows) {
          const columns = Object.keys(row);
          if (columns.length === 0) continue;

          const colNames = columns.map((c) => `"${c}"`).join(', ');
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
          const values = columns.map((c) => (row[c] && typeof row[c] === 'object' ? JSON.stringify(row[c]) : row[c]));

          try {
            rawDb.none(
              `insert into "${tableName}" (${colNames}) values (${placeholders}) on conflict do nothing`,
              values,
            );
            if (tableName === 'store_settings') {
              try {
                rawDb.none(
                  `insert into "settings" (${colNames}) values (${placeholders}) on conflict do nothing`,
                  values,
                );
              } catch {}
            }
            if (tableName === 'admin_roles') {
              try {
                rawDb.none(
                  `insert into "roles" (${colNames}) values (${placeholders}) on conflict do nothing`,
                  values,
                );
              } catch {}
            }
          } catch (e) {
            // Ignore conflict or missing dependency
          }
        }
      }
    } catch (e) {
      logger?.warn?.('Could not parse mock-db.json, loading seeds instead:', e.message);
      if (fs.existsSync(SEED_FILE)) {
        const seedSql = fs.readFileSync(SEED_FILE, 'utf-8');
        mem.public.none(seedSql);
      }
    }
  } else if (fs.existsSync(SEED_FILE)) {
    const seedSql = fs.readFileSync(SEED_FILE, 'utf-8');
    mem.public.none(seedSql);
    scheduleSave();
  }

  // Adapter wrapping all pg-promise methods
  function wrapDbMethod(target, method) {
    return async function (...args) {
      let queryStr = '';
      let values = null;

      if (args.length === 0) {
        return target[method]();
      }

      if (typeof args[0] === 'string') {
        queryStr = args[0];
        values = args[1];
      } else {
        queryStr = args[1];
        values = args[2];
      }

      // Check for write operations to auto-save to disk
      const isWrite = /^\s*(insert|update|delete)\b/i.test(queryStr);

      const result = await target[method](queryStr, values);

      if (isWrite) {
        scheduleSave();
      }

      return result;
    };
  }

  const methods = ['one', 'oneOrNone', 'many', 'manyOrNone', 'any', 'none'];
  const adaptedDb = { ...rawDb };

  for (const method of methods) {
    adaptedDb[method] = wrapDbMethod(rawDb, method);
  }

  adaptedDb.tx = async function (param1, param2) {
    const callback = typeof param1 === 'function' ? param1 : param2;
    // In memory DB, transactions are executed against the database instance
    const res = await callback(adaptedDb);
    scheduleSave();
    return res;
  };

  adaptedDb.testConnection = async function () {
    return true;
  };

  adaptedDb.isMock = true;
  adaptedDb.pgp = rawDb;

  return adaptedDb;
}

module.exports = {
  createJsonDatabase,
  JSON_DB_FILE,
};
