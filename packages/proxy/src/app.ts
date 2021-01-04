import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import logger from './logger';
import {feedEndpoint} from './endpoints/feedEndpoint';
import {config} from './config';
import {proxyEndpoint} from './endpoints/proxyEndpoint';
import {cacheService} from './services/cacheService';
import {settingsEndpoint} from './endpoints/settingsEndpoint';

// see http://patorjk.com/software/taag/#p=display&f=Chunky&t=rss%20proxy
console.log(`
.----.-----.-----.    .-----.----.-----.--.--.--.--.
|   _|__ --|__ --|    |  _  |   _|  _  |_   _|  |  |
|__| |_____|_____|    |   __|__| |_____|__.__|___  |
                      |__|                   |_____|\n\n`);
logger.info(`Starting rss-proxy v. ${config.build.version}@${config.build.revision}`);
logger.info(`https://github.com/damoeb/rss-proxy\n`);
logger.info(`env: ${config.env}`);

// -- express
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

// -- endpoints

if (config.env !== 'prod') {
  logger.info('+ Enabling cors');
  app.use(cors());
}
app.use('/', express.static('static'));

if (config.enableJavaScript) {
  logger.info('+ Enabling JavaScript');
} else {
  logger.info('- Disabling JavaScript');
}
if (cacheService.active()) {
  logger.info('+ Enabling cache');
} else {
  logger.info('- Disabling cache');
}
feedEndpoint.register(app);
proxyEndpoint.register(app);
settingsEndpoint.register(app);

logger.debug('Available REST methods');
app._router.stack.forEach((route: any) => {
  if (route.route && route.route.path) {
    logger.debug(`${route.route.stack[0].method.toUpperCase()} ${route.route.path}`);
  }
});

// startup
app.listen(config.port, () => {
  logger.info(`Listening on port ${config.port}`);
});
