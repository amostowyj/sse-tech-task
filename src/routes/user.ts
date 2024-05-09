import { Router } from "express";
import { QueryTypes } from "sequelize";
import { db } from "../db";

const router = Router();

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  const user = await db.query(
    `SELECT * FROM "users" WHERE id = ${userId} LIMIT 1;`,
    {
      type: QueryTypes.SELECT,
    },
  );

  if (!user.length) {
    res.status(404).json({ error: "user not found" });
  } else {
    res.json(user[0]);
  }
});

router.post("/", async (req, res) => {
  const user = req.body;

  const result = await db.query(
    `INSERT INTO "users" (${Object.keys(user).join(
      ",",
    )}) VALUES (${Object.values(user)
      .map((value) => `'${value}'`)
      .join(",")});`,
    { type: QueryTypes.INSERT },
  );

  res.json({ result });
});

router.get("/search", async (req, res) => {
  const { query } = req;

  const where = Object.entries(query)
    .reduce(
      (acc, [key, value]) => acc.concat([`${key} LIKE '%${value}%'`]),
      [] as string[],
    )
    .join(" AND ");

  const results = db.query(`SELECT * FROM users WHERE ${where}`);

  res.json({ query, results });
});

export default router;
