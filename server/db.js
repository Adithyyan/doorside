const pgp = require('pg-promise')({
  capSQL: false,
});
const config = require('./env');
const logger = require('./logger');
const { createJsonDatabase } = require('./db/json-db');

let adaptedDb;

if (config.useMockDb) {
  logger.info('📦 Running with JSON Test Database engine (server/db/mock-db.json)');
  adaptedDb = createJsonDatabase();
} else {
  const dbUrl = config.dbConnString || config.database?.url || process.env.DATABASE_URL;

  if (!dbUrl) {
    logger.warn('DATABASE_URL is not set. Falling back to JSON Test Database.');
    adaptedDb = createJsonDatabase();
  } else {
    try {
      const rawDb = pgp(dbUrl);

      // Adapter to allow calls like db.one(query, values) or db.one(req, query, values)
      function wrapDbMethod(target, method) {
        return function (...args) {
          if (args.length === 0) return target[method]();
          if (typeof args[0] === 'string') {
            return target[method](args[0], args[1]);
          }
          // First arg is req/context object, second is query string, third is values
          return target[method](args[1], args[2]);
        };
      }

      const methods = ['one', 'oneOrNone', 'many', 'manyOrNone', 'any', 'none'];
      adaptedDb = { ...rawDb };

      for (const method of methods) {
        adaptedDb[method] = wrapDbMethod(rawDb, method);
      }

      adaptedDb.tx = function (param1, param2) {
        if (typeof param1 === 'function') {
          return rawDb.tx(param1);
        }
        return rawDb.tx(param1, param2);
      };

      adaptedDb.testConnection = async function () {
        try {
          await rawDb.one('select 1 as value');
          logger.info('Database connection established');
          return true;
        } catch (error) {
          logger.error({ error: error.message }, 'Database connection failed');
          throw error;
        }
      };

      adaptedDb.pgp = pgp;
    } catch (err) {
      logger.warn({ error: err.message }, 'Failed to initialize Postgres client. Using JSON Test Database.');
      adaptedDb = createJsonDatabase();
    }
  }
}

module.exports = adaptedDb;

