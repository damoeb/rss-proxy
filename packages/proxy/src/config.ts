const build = require('./build.json');

const env = process.env.RP_ENV || 'dev';

export const config = {
  build,
  port: process.env.PORT || 3000,
  env,
  hostname: 'localhost',
  cache: {
    enabled: process.env.RP_CACHE === 'true' || false,
    lifetimeSec: 60 * 10
  },
  enableJavaScript: process.env.RP_SUPPORT_JAVASCRIPT === 'true' || env === 'dev',
  preferNativeFeed: true,
  logLevel: process.env.LOG_LEVEL || 'info',
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/79.0.3945.79 Chrome/79.0.3945.79 Safari/537.36'
};
