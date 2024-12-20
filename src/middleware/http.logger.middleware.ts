import { Logger } from '../utils/logger';
import { NextFunction, Request, Response } from 'express';

export default function (req: Request, res: Response, next: NextFunction) {
  const httpLogger = new Logger('HTTP');
  const start = Date.now();
  res.on('finish', () => {
    const now = Date.now();
    const time = now - start;

    httpLogger.info({
      message: `${req.method} ${req.path} took ${time}ms`,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: time + 'ms',
      //   userId: req.user?._id ?? null,
    });
  });
  next();
}
