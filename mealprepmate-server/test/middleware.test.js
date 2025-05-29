const request = require("supertest");
const express = require("express");
const { authenticate } = require("../middlewares/authentication");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

// Setup express app untuk testing
const app = express();
app.use(express.json());
app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "Access granted", user: req.user.email });
});

describe("Authentication Middleware", () => {
  let testUser;
  let validToken;

  beforeEach(async () => {
    testUser = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword",
      name: "Test User",
    });
    validToken = signToken({ id: testUser.id, email: testUser.email });
  });

  afterEach(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  test("should allow access with valid token", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Access granted");
    expect(response.body.user).toBe(testUser.email);
  });

  test("should deny access without token", async () => {
    const response = await request(app).get("/protected");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Access token required");
  });

  test("should deny access with malformed token", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", "InvalidToken");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Access token required");
  });

  test("should deny access with invalid token", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalid.token.here");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });

  test("should deny access when user not found", async () => {
    const fakeToken = signToken({ id: 999, email: "fake@example.com" });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });
});
