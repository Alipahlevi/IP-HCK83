const request = require("supertest");
const express = require("express");
const errorHandler = require("../middlewares/errorHandler");

const app = express();
app.use(express.json());

// Test route that throws error
app.get("/test-error", (req, res, next) => {
  const error = new Error("Test error");
  error.status = 400;
  next(error);
});

// Test route that throws error without status
app.get("/test-error-no-status", (req, res, next) => {
  const error = new Error("Test error without status");
  next(error);
});

app.use(errorHandler);

describe("Error Handler Middleware", () => {
  test("should handle error with status", async () => {
    const response = await request(app).get("/test-error");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Test error");
  });

  test("should handle error without status (default 500)", async () => {
    const response = await request(app).get("/test-error-no-status");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Test error without status");
  });
});
