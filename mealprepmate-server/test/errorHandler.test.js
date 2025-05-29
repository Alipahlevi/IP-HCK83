const request = require("supertest");
const express = require("express");
const errorHandler = require("../middlewares/errorHandler");

const app = express();
app.use(express.json());

// Test route that throws Sequelize validation error
app.get("/test-validation-error", (req, res, next) => {
  const error = new Error("Validation failed");
  error.name = "SequelizeValidationError";
  error.errors = [{ message: "Test validation error" }];
  next(error);
});

// Test route that throws Sequelize unique constraint error
app.get("/test-unique-error", (req, res, next) => {
  const error = new Error("Unique constraint failed");
  error.name = "SequelizeUniqueConstraintError";
  next(error);
});

// Test route that throws generic error
app.get("/test-generic-error", (req, res, next) => {
  const error = new Error("Generic error");
  next(error);
});

app.use(errorHandler);

describe("Error Handler Middleware", () => {
  test("should handle Sequelize validation error", async () => {
    const response = await request(app).get("/test-validation-error");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation error");
    expect(response.body.errors).toEqual(["Test validation error"]);
  });

  test("should handle Sequelize unique constraint error", async () => {
    const response = await request(app).get("/test-unique-error");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Data already exists");
  });

  test("should handle generic error with default 500", async () => {
    const response = await request(app).get("/test-generic-error");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });
});
