import winston from 'winston';
import { createLoggerConfig } from './logger-settings';

export const createLogger = (name: string) => {
  const options = createLoggerConfig();

  const logger = winston.createLogger({
    transports: options.transports,
    format: options.format,
    defaultMeta: {
      name,
    },
  });

  return logger;
};
