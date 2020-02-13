import {Express, Request, Response} from 'express';
import * as cors from 'cors';

export const operatorEndpoint = new class OperatorEndpoint {
  register(app: Express) {

    app.get('/api/union', cors(), (request: Request, response: Response) => {
    });
    app.get('/api/filter', cors(), (request: Request, response: Response) => {
    });
  }

};
