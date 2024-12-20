import { NextFunction, Request, Response } from 'express';
import { HttpException } from './http-exception';
import { Logger } from './logger';

const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const errorHandlerLogger = new Logger('Error Handler');
  if (error instanceof HttpException) {
    errorHandlerLogger.debug({ message: error.message, error });
    res.status(error.statusCode).json({
      message: error.message,
      error: error.error,
    });
  } else {
    errorHandlerLogger.error('Unknown Error', (error as Error).stack);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default errorHandler;
