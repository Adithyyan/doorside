const path = require('path');
const dotenv = require('dotenv');

// Load base .env.main
dotenv.config({
  path: path.resolve(__dirname, '.env.main'),
});

// Load environment-specific if provided (e.g. .env.production, etc.)
if (process.env.NODE_ENV) {
  dotenv.config({
    path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
    override: true,
  });
}

// Override with .env.local for local overrides
dotenv.config({
  path: path.resolve(__dirname, '.env.local'),
  override: true,
});

const config = {
  dbConnString: process.env.DATABASE_URL,
  port: parseInt(process.env.PORT, 10) || 3001,
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV,
  apiUrl: process.env.API_URL || 'http://localhost:3001',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  tokenSecret: process.env.TOKEN_SECRET || process.env.JWT_ACCESS_SECRET || 'dropshipping-jwt-access-secret-32-chars-min!',
  
  database: {
    url: process.env.DATABASE_URL,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || process.env.TOKEN_SECRET || 'dropshipping-jwt-access-secret-32-chars-min!',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dropshipping-jwt-refresh-secret-32-chars-min!',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  client: {
    url: process.env.CLIENT_URL || 'http://localhost:5173',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },

  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local',
    localPath: process.env.STORAGE_LOCAL_PATH || path.resolve(__dirname, 'uploads'),
    bucket: process.env.STORAGE_BUCKET || '',
    region: process.env.STORAGE_REGION || '',
    accessKey: process.env.STORAGE_ACCESS_KEY || '',
    secretKey: process.env.STORAGE_SECRET_KEY || '',
    cdnUrl: process.env.STORAGE_CDN_URL || '',
  },

  email: {
    provider: process.env.EMAIL_PROVIDER || 'none',
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    fromName: process.env.EMAIL_FROM_NAME || 'Store',
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    sendgridApiKey: process.env.SENDGRID_API_KEY,
  },

  supplier: {
    apiUrl: process.env.SUPPLIER_API_URL,
    apiKey: process.env.SUPPLIER_API_KEY,
  },

  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    domain: process.env.COOKIE_DOMAIN || undefined,
  },
};

module.exports = config;
