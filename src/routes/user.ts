import { Router } from "express";

const router = Router();

router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  const user = { id: userId, name: `User ${userId}` };

  res.json(user);
});

export default router;
