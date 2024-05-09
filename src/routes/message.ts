import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { db } from "../db";

const router = Router();

router.use(authMiddleware());

router.get("/user/:userId", async (req, res) => {
  const messages = db.query(
    `SELECT * FROM messages WHERE sender_id = ${req.params.userId} ORDER BY date DESC`,
  );

  res.json({ messages });
});

router.post("/", async (req, res) => {
  const messageToSave = {
    recipient_id: req.body.recipient_id,
    sender_id: req.body.sender_id,
    body: req.body.message_body,
    date: new Date().toISOString(),
    read: false,
  };

  await db.query(
    `INSERT INTO messages (recipient, sender, body, date) VALUES (${Object.keys(
      messageToSave,
    )
      .map((v) => JSON.stringify(v))
      .join(",")})`,
  );
});

export default router;
