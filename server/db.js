const pgp = require('pg-promise')({
  capSQL: false,
});
const config = require('./env');
const logger = require('./logger');

function getPgConnectionOptions(dbUrl) {
  if (typeof dbUrl !== 'string') {
    return dbUrl;
  }

  const isRemote = dbUrl.includes('neon.tech')
    || dbUrl.includes('sslmode=require')
    || dbUrl.includes('supabase.co')
    || dbUrl.includes('ondigitalocean.com')
    || dbUrl.includes('aws.neon.tech');

  const connectionOptions = {
    connectionString: dbUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
  };

  if (isRemote) {
    connectionOptions.ssl = { rejectUnauthorized: false };
  }

  return connectionOptions;
}

const dbUrl = config.database?.url || config.dbConnString || process.env.DATABASE_URL;

if (!dbUrl) {
  logger.error('CRITICAL: DATABASE_URL environment variable is missing.');
  throw new Error('DATABASE_URL environment variable is required to connect to PostgreSQL.');
}

const connConfig = getPgConnectionOptions(dbUrl);
const rawDb = pgp(connConfig);

function wrapDbMethod(target, method) {
  return function (...args) {
    if (args.length === 0) {
      return target[method]();
    }
    if (typeof args[0] === 'string') {
      return target[method](args[0], args[1]);
    }
    return target[method](args[1], args[2]);
  };
}

const methods = ['one', 'oneOrNone', 'many', 'manyOrNone', 'any', 'none'];
const db = { ...rawDb };

for (const method of methods) {
  db[method] = wrapDbMethod(rawDb, method);
}

db.tx = function (param1, param2) {
  if (typeof param1 === 'function') {
    return rawDb.tx(param1);
  }
  return rawDb.tx(param1, param2);
};

db.testConnection = async function () {
  try {
    const res = await rawDb.one('select version(), current_database() as db_name');
    const isNeon = dbUrl.includes('neon.tech');
    logger.info(`PostgreSQL database connected (${isNeon ? 'Neon Serverless ' : ''}DB: ${res.db_name})`);
    return true;
  } catch (error) {
    logger.error({ error: error.message }, 'Database connection failed');
    throw error;
  }
};

db.pgp = pgp;

module.exports = db;
