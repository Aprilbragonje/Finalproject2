//opdracht 7 en 10 REST API route en CRUD endpoint geimplemnteerd volgens vereiste

import express from "express";
import * as hostService from "../services/hostService.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { name } = req.query;

    let hosts = await hostService.getAllHosts();

    if (name) {
      hosts = hosts.filter((h) =>
        h.name.toLowerCase().includes(name.toLowerCase()),
      );
    }

    res.status(200).json(hosts);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const host = await hostService.getHostById(req.params.id);

    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    res.status(200).json(host);
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticateToken, async (req, res, next) => {
  try {
    const host = await hostService.createHost(req.body);

    res.status(201).json(host);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authenticateToken, async (req, res, next) => {
  try {
    const existingHost = await hostService.getHostById(req.params.id);

    if (!existingHost) {
      return res.status(404).json({ error: "Host not found" });
    }

    const host = await hostService.updateHost(req.params.id, req.body);

    res.status(200).json(host);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    const existingHost = await hostService.getHostById(req.params.id);

    if (!existingHost) {
      return res.status(404).json({ error: "Host not found" });
    }

    await hostService.deleteHost(req.params.id);

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

export default router;
