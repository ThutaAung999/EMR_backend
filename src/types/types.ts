import { Request, Response, NextFunction } from 'express';
import { IUser } from '../model/user.model';

export interface IRequest extends Request {
  user?: IUser;
}

export interface IResponse extends Response {}
