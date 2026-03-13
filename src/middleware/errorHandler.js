export function errorHandler(err, req, res, next) {
  console.error(err);

  // Prisma validatie errors → 400
  if (
    err.name === "PrismaClientValidationError" ||
    err.name === "PrismaClientKnownRequestError"
  ) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  res.status(500).json({ error: "Internal Server Error" });
}
