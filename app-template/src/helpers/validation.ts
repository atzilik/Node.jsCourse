import { NextFunction, Request, Response } from 'express';

export const isValidUuid = (uuid: string): boolean => {
  return uuid.length === 36;
};

export const isValidName = (name: string): boolean => {
  return name.length > 3;
};

export const validateNameHandler = (req: Request, res: Response, next: NextFunction): void => {
  if (!isValidName(req.body.name)) {
    next('Invalid Name');
    return;
  }
  next();
};
