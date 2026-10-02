require('../env');

const fs = require('fs');
const path = require('path');
const pgp = require('pg-promise')();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const db = pgp(DATABASE_URL);

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function runMigrations() {
  console.log('Running database migrations...\n');

  // Create migrations tracking table if it doesn't exist
  await db.none(`
    create table if not exists schema_migrations (
      filename text primary key,
      executed_at timestamp default now()
    )
  `);

  // Get already-run migrations
  const executed = await db.any('select filename from schema_migrations');
  const executedSet = new Set(executed.map((row) => row.filename));

  // Get all migration files in order
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  let runCount = 0;

  for (const file of files) {
    if (executedSet.has(file)) {
      console.log(`  SKIP  ${file} (already executed)`);
      continue;
    }

    const filePath = path.join(MIGRATIONS_DIR, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    try {
      await db.tx(async (transaction) => {
        await transaction.none(sql);
        await transaction.none(
          'insert into schema_migrations (filename) values ($1)',
          [file],
        );
      });

      console.log(`  OK    ${file}`);
      runCount++;
    } catch (error) {
      console.error(`  FAIL  ${file}`);
      console.error(`        Error: ${error.message}`);
      process.exit(1);
    }
  }

  if (runCount === 0) {
    console.log('\nNo new migrations to run.');
  } else {
    console.log(`\nSuccessfully ran ${runCount} migration(s).`);
  }

  pgp.end();
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exit(1);
});
