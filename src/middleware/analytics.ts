import { NextFunction, Request, Response } from "express";
import axios from "axios";

export async function handleAnalytics(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(`Submitting call to analytics intake [${req.url}]`);
  await axios.post(
    "http://analytics-mock:8080/page-analytics",
    JSON.stringify({ url: req.url, method: req.method }),
  );
  next();
}
