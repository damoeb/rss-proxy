import * as express from 'express';
import * as bodyParser from 'body-parser';

import logger from './logger'
import { proxyEndpoint } from './endpoints/proxyEndpoint';
import { feedEndpoint } from './endpoints/feedEndpoint';
import {config} from './config';

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

// todo serve static playground
app.use('/playground', express.static('playground'));

// proxyEndpoint.register(app);
feedEndpoint.register(app);

// startup
app.listen(config.port, () => logger.info(`Listening on port ${config.port}`));
