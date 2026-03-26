//opdracht 7 en 10 REST API route en CRUD endpoint geimplemnteerd volgens vereiste

import express from "express";
import * as reviewService from "../services/reviewService.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const reviews = await reviewService.getAllReviews();

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticateToken, async (req, res, next) => {
  try {
    const { propertyId, rating, comment, userId } = req.body;

    const reviewData = {
      propertyId,
      rating,
      comment,
      userId,
    };

    const review = await reviewService.createReview(reviewData);

    // Check op null
    if (!review) {
      return res.status(400).json({
        error: "Ongeldige review data",
      });
    }

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authenticateToken, async (req, res, next) => {
  try {
    const existingReview = await reviewService.getReviewById(req.params.id);

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    const review = await reviewService.updateReview(req.params.id, req.body);

    // Check
    if (!review) {
      return res.status(400).json({
        error: "Ongeldige update data",
      });
    }

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    const existingReview = await reviewService.getReviewById(req.params.id);

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    await reviewService.deleteReview(req.params.id);

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
