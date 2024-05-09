import { QueryTypes } from "sequelize";
import { db } from "../db";
import { Request, Response, NextFunction } from "express";

export const authMiddleware =
  () => async (req: Request, _res: Response, next: NextFunction) => {
    const [_, encodedCredentials] = req.headers.authorization?.split(" ") || [];

    if (!encodedCredentials) {
      return next(new Error("no credentials provided"));
    }

    const [username, password] = Buffer.from(encodedCredentials, "base64url")
      .toString()
      .split(":");

    const results = await db.query<{ username: string; password: string }>(
      `SELECT password from users WHERE username = :un LIMIT 1`,
      { type: QueryTypes.SELECT, replacements: { un: username } },
    );

    const storedPassword = results[0].password;

    if (password === storedPassword) {
      return next();
    }

    throw new Error("Not authorised!");
  };
