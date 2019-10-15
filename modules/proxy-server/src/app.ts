import * as express from 'express';
import * as bodyParser from 'body-parser';

import logger from './logger'
import proxyEndpoint from './endpoints/proxyEndpoint';
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

proxyEndpoint.register(app);

// startup

// via http://www.patorjk.com/software/taag/#p=display&f=Doom&t=kontor
const logo = `
 __                 __              
|  |--.-----.-----.|  |_.-----.----.
|    <|  _  |     ||   _|  _  |   _|
|__|__|_____|__|__||____|_____|__|  
                                    
version ${config.version}

`;

if (config.appEnv === 'prod') {
  console.log(logo);
}

app.listen(config.port, () => logger.info(`Listening on port ${config.port}`));
