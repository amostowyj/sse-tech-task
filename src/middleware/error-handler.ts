import { Request, Response, NextFunction } from "express";

export default function errorHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // @TODO: do this!

  next();
}
