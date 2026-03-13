import "dotenv/config";
import express from "express";

import { requestLogger } from "./middleware/loggerMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

app.use(express.json());

// Logging midlew
app.use(requestLogger);

// Routes
app.use("/login", authRoutes);
app.use("/users", userRoutes);
app.use("/hosts", hostRoutes);
app.use("/properties", propertyRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reviews", reviewRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hello world!");
});

// Global err
app.use(errorHandler);

// Start server en op render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
