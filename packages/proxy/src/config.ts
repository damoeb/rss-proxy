const build = require('./build.json');

export const config = {
  build,
  port: process.env.PORT || 3000,
  hostname: 'localhost',
  logLevel: process.env.LOG_LEVEL || 'info'
};
