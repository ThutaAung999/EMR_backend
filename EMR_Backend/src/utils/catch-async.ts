/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

type Callback<
  Body = any,
  Query extends ParsedQs = any,
  Params extends ParamsDictionary = any,
  ResBody = any,
  Locals extends Record<string, any> = Record<string, any>,
> = (
  req: Request<Params, ResBody, Body, Query, Locals>,
  res: Response,
  next: NextFunction,
) => void | Promise<void>;

export default function <
  Body = any,
  Query extends Record<string, any> | ParsedQs = any,
  Params extends ParamsDictionary = any,
  ResBody = any,
  Locals extends Record<string, any> = Record<string, any>,
>(callback: Callback<Body, Query, Params, ResBody, Locals>) {
  return async (
    req: Request<Params, ResBody, Body, Query, Locals>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
