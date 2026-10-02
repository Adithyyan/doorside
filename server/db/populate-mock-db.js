const { newDb } = require('pg-mem');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

async function initializeAndPopulateMockDb(jsonFilePath = path.join(__dirname, 'mock-db.json')) {
  const mem = newDb();

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
    implementation: () => 'PostgreSQL 16.0 (pg-mem JSON)',
  });

  // Load and sanitize schema DDL
  let schemaSql = fs.readFileSync(path.join(__dirname, 'migrations', '001_initial_schema.sql'), 'utf-8');
  schemaSql = schemaSql.replace(/create extension[^;]+;/gi, '');
  schemaSql = schemaSql.replace(/create or replace function[\s\S]+?\$\$ language plpgsql;/gi, '');
  schemaSql = schemaSql.replace(/create trigger[^;]+;/gi, '');
  schemaSql = schemaSql.replace(/create index[^;]+gin[^;]+;/gi, '');
  schemaSql = schemaSql.replace(/search_vector\s+tsvector/gi, 'search_vector text');
  mem.public.none(schemaSql);

  // Load SQL seeds (settings, categories, permissions, roles, filters, filter_values, sort_options)
  let seedSql = fs.readFileSync(path.join(__dirname, 'seeds', '001_default_settings.sql'), 'utf-8');
  mem.public.none(seedSql);

  const pgp = mem.adapters.createPgPromise();

  // Seed Admin User
  const superAdminRole = await pgp.one("select id from admin_roles where name = 'super_admin'");
  const adminPasswordHash = await bcrypt.hash('AdminPass@123!', 10);
  await pgp.none(
    `insert into admin_users (name, email, password_hash, role_id)
     values ('Super Administrator', 'admin@dropship.test', $1, $2)`,
    [adminPasswordHash, superAdminRole.id],
  );

  // Seed Demo Products
  const categories = await pgp.any('select id, slug from categories');
  const catMap = {};
  categories.forEach((c) => { catMap[c.slug] = c.id; });

  const homeCatId = catMap['home-kitchen'] || categories[0]?.id;
  const carCatId = catMap['car-accessories'] || categories[1]?.id;
  const travelCatId = catMap['travel-outdoor'] || categories[2]?.id;

  const demoProducts = [
    {
      category_id: homeCatId,
      name: 'Premium Multi-Purpose Kitchen Organizer',
      slug: 'premium-multi-purpose-kitchen-organizer',
      sku: 'KIT-ORG-001',
      short_description: 'Keep your kitchen neat and tidy with this versatile organizer.',
      description: '<p>This premium kitchen organizer helps you maximize storage space in your kitchen. Made from high-quality materials, it is durable and easy to clean.</p>',
      selling_price_paisa: 79900,
      compare_at_price_paisa: 129900,
      cost_price_paisa: 35000,
      stock_quantity: 50,
      status: 'active',
      is_featured: true,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    },
    {
      category_id: homeCatId,
      name: 'Stainless Steel Spice Rack Set',
      slug: 'stainless-steel-spice-rack-set',
      sku: 'KIT-SPICE-001',
      short_description: 'Organize all your spices elegantly on your countertop or shelf.',
      description: '<p>A beautiful stainless steel spice rack that holds up to 12 spice jars. Perfect for modern Indian kitchens.</p>',
      selling_price_paisa: 59900,
      compare_at_price_paisa: 99900,
      cost_price_paisa: 25000,
      stock_quantity: 35,
      status: 'active',
      is_featured: false,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80',
    },
    {
      category_id: carCatId,
      name: 'Car Seat Back Organizer with Tablet Holder',
      slug: 'car-seat-back-organizer',
      sku: 'CAR-ORG-001',
      short_description: 'Keep your car neat and organized with this multi-pocket seat organizer.',
      description: '<p>This premium car seat back organizer features multiple pockets for tablets, bottles, books, and more. Easy to install and clean.</p>',
      selling_price_paisa: 89900,
      compare_at_price_paisa: 149900,
      cost_price_paisa: 40000,
      stock_quantity: 25,
      status: 'active',
      is_featured: true,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
    },
    {
      category_id: carCatId,
      name: 'Universal Car Phone Mount (360 Rotation)',
      slug: 'universal-car-phone-mount',
      sku: 'CAR-PHN-001',
      short_description: 'Securely mount your phone for navigation while driving.',
      description: '<p>360-degree rotation car phone mount compatible with all smartphones. Easy one-hand operation and strong suction cup base.</p>',
      selling_price_paisa: 49900,
      compare_at_price_paisa: 79900,
      cost_price_paisa: 20000,
      stock_quantity: 75,
      status: 'active',
      is_featured: false,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
    },
    {
      category_id: homeCatId,
      name: 'Eco-Friendly Bamboo Cutting Board Set',
      slug: 'bamboo-cutting-board-set',
      sku: 'KIT-CUTB-001',
      short_description: 'Eco-friendly bamboo cutting boards in 3 versatile sizes.',
      description: '<p>Set of 3 premium bamboo cutting boards. Antibacterial, durable and easy to clean. Safe for all types of knives.</p>',
      selling_price_paisa: 69900,
      compare_at_price_paisa: 119900,
      cost_price_paisa: 28000,
      stock_quantity: 40,
      status: 'active',
      is_featured: false,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?w=600&auto=format&fit=crop&q=80',
    },
    {
      category_id: travelCatId,
      name: 'SonicWave Pro Wireless Noise Cancelling Earbuds',
      slug: 'pro-anc-wireless-earbuds',
      sku: 'EAR-ANC-001',
      short_description: 'Active noise cancellation wireless earbuds with 32h playtime.',
      description: '<p>Studio-quality sound, deep bass, active noise cancellation, and seamless Bluetooth 5.3 connectivity.</p>',
      selling_price_paisa: 149900,
      compare_at_price_paisa: 299900,
      cost_price_paisa: 60000,
      stock_quantity: 60,
      status: 'active',
      is_featured: true,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    },
    {
      category_id: travelCatId,
      name: 'AeroTech Studio Max ANC Wireless Headphones',
      slug: 'aerotech-studio-max-headphones',
      sku: 'HEAD-ANC-002',
      short_description: 'Over-ear Hi-Res audio headphones with ultra-comfort earcups.',
      description: '<p>Premium wireless over-ear headphones with custom dynamic drivers and transparent ambient mode.</p>',
      selling_price_paisa: 349900,
      compare_at_price_paisa: 499900,
      cost_price_paisa: 140000,
      stock_quantity: 30,
      status: 'active',
      is_featured: true,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    },
  ];

  // Fetch filter values for mapping
  const filterValues = await pgp.any(`
    select fv.id, fv.name, fv.value, f.code as filter_code, f.id as filter_id
    from filter_values fv
    join filters f on f.id = fv.filter_id
  `);
  const valMap = {};
  filterValues.forEach((fv) => {
    valMap[`${fv.filter_code}:${fv.value}`] = fv;
  });

  for (const item of demoProducts) {
    const { image_url, ...prodData } = item;
    const inserted = await pgp.one(
      `insert into products
       (category_id, name, slug, sku, short_description, description,
        selling_price_paisa, compare_at_price_paisa, cost_price_paisa,
        stock_quantity, status, is_featured, is_active)
       values
       ($/category_id/, $/name/, $/slug/, $/sku/, $/short_description/, $/description/,
        $/selling_price_paisa/, $/compare_at_price_paisa/, $/cost_price_paisa/,
        $/stock_quantity/, $/status/, $/is_featured/, $/is_active/)
       returning id`,
      prodData,
    );

    // Primary image
    const media = await pgp.one(
      `insert into media (filename, url, mime_type, size_bytes)
       values ($1, $2, 'image/jpeg', 102400)
       returning id`,
      [`${item.slug}.jpg`, image_url],
    );

    await pgp.none(
      `insert into product_images (product_id, media_id, is_primary, sort_order)
       values ($1, $2, true, 1)`,
      [inserted.id, media.id],
    );

    // Map filters
    const mappingsToInsert = [];
    if (valMap['availability:in_stock']) {
      mappingsToInsert.push(valMap['availability:in_stock']);
    }
    if (item.name.includes('SonicWave') && valMap['brand:sonicwave']) {
      mappingsToInsert.push(valMap['brand:sonicwave']);
    } else if (item.name.includes('AeroTech') && valMap['brand:aerotech']) {
      mappingsToInsert.push(valMap['brand:aerotech']);
    } else if (valMap['brand:apexluxe']) {
      mappingsToInsert.push(valMap['brand:apexluxe']);
    }

    if (item.name.includes('Steel') && valMap['material:stainless-steel']) {
      mappingsToInsert.push(valMap['material:stainless-steel']);
    } else if (item.name.includes('Bamboo') && valMap['material:cotton']) {
      mappingsToInsert.push(valMap['material:cotton']);
    } else if (valMap['material:matte-polymer']) {
      mappingsToInsert.push(valMap['material:matte-polymer']);
    }

    if (valMap['color:black']) {
      mappingsToInsert.push(valMap['color:black']);
    }

    for (const fv of mappingsToInsert) {
      await pgp.none(
        `insert into product_filter_mappings (product_id, filter_id, filter_value_id)
         values ($1, $2, $3)
         on conflict do nothing`,
        [inserted.id, fv.filter_id, fv.id],
      );
    }
  }

  // Dump complete database to mock-db.json
  const tableRows = mem.public.many(
    "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE'",
  );
  const dump = {};
  for (const { table_name } of tableRows) {
    dump[table_name] = mem.public.many(`select * from "${table_name}"`);
  }
  fs.writeFileSync(jsonFilePath, JSON.stringify(dump, null, 2), 'utf-8');
  console.log(`Pre-populated mock-db.json successfully with ${demoProducts.length} products, categories, filters, settings, and admin!`);
  return { mem, pgp };
}

initializeAndPopulateMockDb()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Initialization failed:', err);
    process.exit(1);
  });
