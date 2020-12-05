import { RequestHandler, ErrorRequestHandler } from 'express';
import expressWinston from 'express-winston';
import { createLoggerConfig } from '../utils/logger-settings';

export function traceLogger(): RequestHandler {
  return expressWinston.logger(createLoggerConfig());
}

export function errorLogger(): ErrorRequestHandler {
  return expressWinston.errorLogger(createLoggerConfig());
}
