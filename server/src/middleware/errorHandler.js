export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Server error.";

  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found.";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((value) => value.message)
      .join(" ");
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
};

