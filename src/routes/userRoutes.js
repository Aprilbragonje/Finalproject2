//opdracht 7 en 10 REST API route en CRUD endpoint geimplemnteerd volgens vereiste
import express from "express";
import * as userService from "../services/userService.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { username, email } = req.query;

    let users = await userService.getAllUsers();

    if (username) {
      users = users.filter(
        (user) => user.username.toLowerCase() === username.toLowerCase(),
      );
    }

    if (email) {
      users = users.filter(
        (user) => user.email.toLowerCase() === email.toLowerCase(),
      );
    }

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authenticateToken, async (req, res, next) => {
  try {
    const existingUser = await userService.getUserById(req.params.id);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await userService.updateUser(req.params.id, req.body);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    const existingUser = await userService.getUserById(req.params.id);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await userService.deleteUser(req.params.id);

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

export default router;
