require('../env');

const path = require('path');
const fs = require('fs');
const pgp = require('pg-promise')();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not configured.');
  console.error('Please configure DATABASE_URL in server/.env.local (e.g. your Neon PostgreSQL connection string).');
  process.exit(1);
}

const isRemote = DATABASE_URL.includes('neon.tech')
  || DATABASE_URL.includes('sslmode=require')
  || DATABASE_URL.includes('supabase.co')
  || DATABASE_URL.includes('ondigitalocean.com');

const dbConfig = {
  connectionString: DATABASE_URL,
  max: 5,
  connectionTimeoutMillis: 20000,
  idleTimeoutMillis: 30000,
};

if (isRemote) {
  dbConfig.ssl = { rejectUnauthorized: false };
}

const db = pgp(dbConfig);

const SCHEMA_FILE = path.join(__dirname, 'schema.sql');
const SEED_FILE = path.join(__dirname, 'seed.sql');

async function main() {
  const args = process.argv.slice(2);
  const schemaOnly = args.includes('--schema-only');
  const seedOnly = args.includes('--seed-only');

  console.log('====================================================');
  console.log('🚀 PostgreSQL Database Setup & Data Migration');
  console.log('====================================================\n');

  try {
    // 1. Test Connection
    console.log('1️⃣  Connecting to PostgreSQL database...');
    const conn = await db.one('select version(), current_database() as db_name, current_user as user_name');
    const isNeon = DATABASE_URL.includes('neon.tech');
    console.log(`   Connected to ${isNeon ? 'Neon Serverless ' : ''}database "${conn.db_name}" as user "${conn.user_name}".`);
    console.log(`   Server: ${conn.version.split(' on ')[0]}\n`);

    // 2. Apply Schema
    if (!seedOnly) {
      console.log('2️⃣  Applying database schema (schema.sql)...');
      if (!fs.existsSync(SCHEMA_FILE)) {
        throw new Error(`Schema file not found at ${SCHEMA_FILE}`);
      }
      const schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf-8');
      await db.none(schemaSql);
      console.log('   ✓ Database schema applied successfully.\n');
    }

    // 3. Apply Seeds & Data Migration
    if (!schemaOnly) {
      console.log('3️⃣  Migrating platform data and initial seeds (seed.sql)...');
      if (!fs.existsSync(SEED_FILE)) {
        throw new Error(`Seed file not found at ${SEED_FILE}`);
      }
      const seedSql = fs.readFileSync(SEED_FILE, 'utf-8');
      await db.none(seedSql);
      console.log('   ✓ Platform data migrated and seeded successfully.\n');
    }

    // 4. Verify Database State
    console.log('4️⃣  Verifying database state:');
    const [pCount, cCount, sCount, aCount, uCount, supCount, pgCount, secCount] = await Promise.all([
      db.one('select count(*) as count from products'),
      db.one('select count(*) as count from categories'),
      db.one('select count(*) as count from settings'),
      db.one('select count(*) as count from admin_users'),
      db.one('select count(*) as count from users'),
      db.one('select count(*) as count from suppliers'),
      db.one('select count(*) as count from pages'),
      db.one('select count(*) as count from homepage_sections'),
    ]);

    console.log(`   📦 Products:          ${pCount.count}`);
    console.log(`   🏷️  Categories:        ${cCount.count}`);
    console.log(`   ⚙️  Settings:          ${sCount.count}`);
    console.log(`   👤 Admin Users:        ${aCount.count}`);
    console.log(`   👥 Customer Users:     ${uCount.count}`);
    console.log(`   🏭 Suppliers:          ${supCount.count}`);
    console.log(`   📄 Pages:              ${pgCount.count}`);
    console.log(`   🖼️  Homepage Sections:  ${secCount.count}`);

    console.log('\n====================================================');
    console.log('✅ Database setup and data migration complete!');
    console.log('====================================================');
  } catch (error) {
    console.error('\n❌ Database error:', error.message);
    if (error.detail) {
      console.error('   Detail:', error.detail);
    }
    process.exit(1);
  } finally {
    pgp.end();
  }
}

main();
