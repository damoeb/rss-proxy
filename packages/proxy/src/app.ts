import * as express from 'express';
import * as bodyParser from 'body-parser';

import logger from './logger'
import { feedEndpoint } from './endpoints/feedEndpoint';
import {config} from './config';
import {readerEndpoint} from './endpoints/readerEndpoint';
import {operatorEndpoint} from './endpoints/operatorEndpoint';

// see http://patorjk.com/software/taag/#p=display&f=Chunky&t=rss%20proxy
console.log(`                                                    
.----.-----.-----.    .-----.----.-----.--.--.--.--.
|   _|__ --|__ --|    |  _  |   _|  _  |_   _|  |  |
|__| |_____|_____|    |   __|__| |_____|__.__|___  |
                      |__|                   |_____|\n\n`);
logger.info(`Starting rss-proxy v. ${config.build.version}@${config.build.revision}`);
logger.info(`https://gitlab.com/damoeb/rss-proxy\n`);

// -- express
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

export interface ErrorMsg {
  message: string,
  code: number
}

export interface ErrorsResponse {
  errors: ErrorMsg[]
}

// -- endpoints

app.use('/', express.static('static'));

readerEndpoint.register(app);
feedEndpoint.register(app);
operatorEndpoint.register(app);

// startup
app.listen(config.port, () => logger.info(`Listening on port ${config.port}`));
