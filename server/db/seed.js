require('../env');

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const pgp = require('pg-promise')();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const db = pgp(DATABASE_URL);

const SEEDS_DIR = path.join(__dirname, 'seeds');

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe@123!';
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || 'Admin User';

async function runSeeds() {
  console.log('Running database seeds...\n');

  // Run SQL seed files
  const files = fs
    .readdirSync(SEEDS_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const filePath = path.join(SEEDS_DIR, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    try {
      await db.none(sql);
      console.log(`  OK    ${file}`);
    } catch (error) {
      console.error(`  FAIL  ${file}`);
      console.error(`        Error: ${error.message}`);
      process.exit(1);
    }
  }

  // Seed admin user
  await seedAdminUser();

  // Seed demo products
  await seedDemoProducts();

  console.log('\nSeed completed successfully.');
  pgp.end();
}

async function seedAdminUser() {
  console.log('\n  Seeding admin user...');

  const existingAdmin = await db.oneOrNone(
    'select id from admin_users where email = $1',
    [ADMIN_EMAIL],
  );

  if (existingAdmin) {
    console.log(`  SKIP  Admin user already exists: ${ADMIN_EMAIL}`);
    return;
  }

  const superAdminRole = await db.oneOrNone(
    "select id from admin_roles where name = 'super_admin'",
  );

  if (!superAdminRole) {
    console.error('  FAIL  super_admin role not found. Run migrations first.');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await db.none(
    `insert into admin_users (name, email, password_hash, role_id)
     values ($1, $2, $3, $4)`,
    [ADMIN_NAME, ADMIN_EMAIL, passwordHash, superAdminRole.id],
  );

  console.log(`  OK    Admin user created: ${ADMIN_EMAIL}`);
  console.log(`        Password: ${ADMIN_PASSWORD}`);
  console.log('        IMPORTANT: Change this password after first login!');
}

async function seedDemoProducts() {
  console.log('\n  Seeding demo products...');

  const existingProducts = await db.one('select count(*) as count from products');

  if (parseInt(existingProducts.count, 10) > 0) {
    console.log('  SKIP  Products already exist');
    return;
  }

  const homeCategory = await db.oneOrNone(
    "select id from categories where slug = 'home-kitchen'",
  );
  const carCategory = await db.oneOrNone(
    "select id from categories where slug = 'car-accessories'",
  );

  if (!homeCategory) {
    console.log('  SKIP  Categories not found, skipping demo products');
    return;
  }

  const demoProducts = [
    {
      category_id: homeCategory.id,
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
    },
    {
      category_id: homeCategory.id,
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
    },
    {
      category_id: carCategory ? carCategory.id : homeCategory.id,
      name: 'Car Seat Back Organizer',
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
    },
    {
      category_id: carCategory ? carCategory.id : homeCategory.id,
      name: 'Universal Car Phone Mount',
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
    },
    {
      category_id: homeCategory.id,
      name: 'Bamboo Cutting Board Set',
      slug: 'bamboo-cutting-board-set',
      sku: 'KIT-CUTB-001',
      short_description: 'Eco-friendly bamboo cutting boards in 3 sizes.',
      description: '<p>Set of 3 premium bamboo cutting boards. Antibacterial, durable and easy to clean. Safe for all types of knives.</p>',
      selling_price_paisa: 69900,
      compare_at_price_paisa: 119900,
      cost_price_paisa: 28000,
      stock_quantity: 40,
      status: 'active',
      is_featured: false,
      is_active: true,
    },
  ];

  for (const product of demoProducts) {
    await db.none(
      `insert into products
       (category_id, name, slug, sku, short_description, description,
        selling_price_paisa, compare_at_price_paisa, cost_price_paisa,
        stock_quantity, status, is_featured, is_active)
       values
       ($/category_id/, $/name/, $/slug/, $/sku/, $/short_description/, $/description/,
        $/selling_price_paisa/, $/compare_at_price_paisa/, $/cost_price_paisa/,
        $/stock_quantity/, $/status/, $/is_featured/, $/is_active/)`,
      product,
    );
  }

  console.log(`  OK    Created ${demoProducts.length} demo products`);
}

runSeeds().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
