import { RequestHandler } from 'express';

export type AsyncRouteHandler = (...args: Parameters<RequestHandler>) => Promise<any>;

export function wrapAsyncAndSend(fn: AsyncRouteHandler): RequestHandler {
  const handler: RequestHandler = (req, res, next) => {
    fn(req, res, next)
      .then((result) => res.send(result))
      .catch(next);
  };

  return handler;
}
