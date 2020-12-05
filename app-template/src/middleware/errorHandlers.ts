import { NextFunction, Request, Response } from 'express';

export const IdErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err.message == 'Invalid ID') {
    res.status(400).send({ error: err.message });
  } else {
    next(err);
  }
};

export const NameErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err.message === 'Invalid Name') {
    res.status(409).send({ error: err.message });
  } else {
    next(err);
  }
};

export const NotFoundErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err.message === 'Not found') {
    res.status(404).send({ error: err.message });
  } else {
    next(err);
  }
};
