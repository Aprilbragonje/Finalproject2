//opdracht 7 en 10 REST API route en CRUD endpoint geimplemnteerd volgens vereiste
import express from "express";
import * as bookingService from "../services/bookingService.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { userId } = req.query;

    let bookings = await bookingService.getAllBookings();

    if (userId) {
      bookings = bookings.filter((b) => b.userId === userId);
    }
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        error: "No bookings found",
      });
    }
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticateToken, async (req, res, next) => {
  try {
    if (
      !req.body.propertyId ||
      !req.body.userId ||
      !req.body.checkinDate ||
      !req.body.checkoutDate ||
      !req.body.numberOfGuests
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: propertyId, userId, checkinDate, checkoutDate, numberOfGuests",
      });
    }

    const { propertyId, userId, checkinDate, checkoutDate, numberOfGuests } =
      req.body;

    const nights =
      (new Date(checkoutDate) - new Date(checkinDate)) / (1000 * 60 * 60 * 24);

    const pricePerNight = 100;

    const totalPrice = nights * pricePerNight;

    const bookingData = {
      propertyId,
      userId,
      checkinDate: new Date(checkinDate),
      checkoutDate: new Date(checkoutDate),
      numberOfGuests,
      totalPrice,
      bookingStatus: "confirmed",
    };

    const booking = await bookingService.createBooking(bookingData);

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authenticateToken, async (req, res, next) => {
  try {
    const existingBooking = await bookingService.getBookingById(req.params.id);

    if (!existingBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = await bookingService.updateBooking(req.params.id, req.body);

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    const existingBooking = await bookingService.getBookingById(req.params.id);

    if (!existingBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await bookingService.deleteBooking(req.params.id);

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

export default router;
