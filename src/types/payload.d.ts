import { IPayload } from '../auth/json-web-token';

declare global {
  namespace Express {
    interface Request {
      user?: IPayload;
    }
  }
}

export {};