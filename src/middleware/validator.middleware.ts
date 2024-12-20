import { IRequest, IResponse } from '../types/types';
import { NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validateZodSchema = (zodSchema: ZodSchema) => {
  return (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      zodSchema.parse(req.body);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        console.log('zod  error message :', e.message);
        return res
          .status(400)
          .json({ errors: e.errors.map((err) => err.message) });
      }
      next(e); // Pass the error to the default error handler
    }
  };
};
