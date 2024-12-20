import { Request, Response, NextFunction } from 'express';

export interface IRequest extends Request {
  // user?: User;
}

export interface IResponse extends Response {}
