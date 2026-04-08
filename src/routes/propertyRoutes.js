//opdracht 7 en 10 REST API route en CRUD endpoint geimplemnteerd volgens vereiste
import express from "express";
import * as propertyService from "../services/propertyService.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { location, pricePerNight } = req.query;

    let properties = await propertyService.getAllProperties();

    if (location) {
      properties = properties.filter((p) => p.location === location);
    }

    if (pricePerNight) {
      properties = properties.filter(
        (p) => p.pricePerNight === parseFloat(pricePerNight),
      );
    }
    if (!properties || properties.length === 0) {
      return res.status(404).json({
        error: "No properties found",
      });
    }
    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const property = await propertyService.getPropertyById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticateToken, async (req, res, next) => {
  try {
    const property = await propertyService.createProperty(req.body);

    res.status(201).json(property);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authenticateToken, async (req, res, next) => {
  try {
    const existingProperty = await propertyService.getPropertyById(
      req.params.id,
    );

    if (!existingProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    const property = await propertyService.updateProperty(
      req.params.id,
      req.body,
    );

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    const existingProperty = await propertyService.getPropertyById(
      req.params.id,
    );

    if (!existingProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    await propertyService.deleteProperty(req.params.id);

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

export default router;
