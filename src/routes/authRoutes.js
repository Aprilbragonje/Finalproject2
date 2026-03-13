import express from "express";
import prisma from "../services/prisma.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

export default router;
