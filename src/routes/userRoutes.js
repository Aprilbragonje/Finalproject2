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

    //feedback punt 5
    if (users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    const safeUsers = users.map(({ password, ...rest }) => rest);

    res.status(200).json(safeUsers);
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

    const { password, ...safeUser } = user;

    res.status(200).json(safeUser);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { username, password, email, name, phoneNumber } = req.body;
    if (!username || !password || !email || !name || !phoneNumber) {
      return res.status(400).json({
        error:
          "Missing required fields: username, password, email, name, phoneNumber",
      });
    }

    // Feedb punt 4
    const existingUsers = await userService.getAllUsers();

    const userExists = existingUsers.find(
      (u) => u.username === req.body.username,
    );

    // Feedb punt nr 4
    if (userExists) {
      return res.status(409).json({ error: "User already exists" });
    }

    const user = await userService.createUser(req.body);

    const { password: _, ...safeUser } = user;

    res.status(201).json(safeUser);
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

    const { password, ...safeUser } = user;

    res.status(200).json(safeUser);
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

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
