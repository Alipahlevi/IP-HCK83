const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const { signToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");

describe("User Controller", () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  describe("POST /api/users/register", () => {
    test("should register new user successfully", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/users/register")
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.password).toBeUndefined();
    });

    test("should not register user with duplicate email", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      // Create first user
      await User.create({
        ...userData,
        password: hashPassword(userData.password),
      });

      // Try to create duplicate
      const response = await request(app)
        .post("/api/users/register")
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email already exists");
    });
  });

  describe("POST /api/users/login", () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: hashPassword("password123"),
      });
    });

    test("should login with correct credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/users/login")
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.access_token).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
    });

    test("should not login with incorrect password", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/api/users/login")
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
    });
  });

  describe("GET /api/users/profile", () => {
    let testUser;
    let token;

    beforeEach(async () => {
      testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: hashPassword("password123"),
      });
      token = signToken({ id: testUser.id, email: testUser.email });
    });

    test("should get user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.user.password).toBeUndefined();
    });
  });

  describe("PUT /api/users/profile", () => {
    let testUser;
    let token;

    beforeEach(async () => {
      testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: hashPassword("password123"),
        age: 25,
        weight: 70,
        height: 175,
        activityLevel: "moderate",
        goal: "maintain",
      });
      token = signToken({ id: testUser.id, email: testUser.email });
    });

    test("should update user profile successfully", async () => {
      const updateData = {
        name: "Updated Name",
        age: 26,
        weight: 72,
        height: 176,
        activityLevel: "active",
        goal: "lose",
      };

      const response = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Profile updated successfully");
      expect(response.body.user.name).toBe(updateData.name);
      expect(response.body.user.age).toBe(updateData.age);
    });
  });

  describe("PUT /api/users/change-password", () => {
    let testUser;
    let token;

    beforeEach(async () => {
      testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: hashPassword("password123"),
      });
      token = signToken({ id: testUser.id, email: testUser.email });
    });

    test("should change password successfully", async () => {
      const passwordData = {
        currentPassword: "password123",
        newPassword: "newpassword123",
      };

      const response = await request(app)
        .put("/api/users/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send(passwordData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password changed successfully");
    });

    test("should not change password with incorrect current password", async () => {
      const passwordData = {
        currentPassword: "wrongpassword",
        newPassword: "newpassword123",
      };

      const response = await request(app)
        .put("/api/users/change-password")
        .set("Authorization", `Bearer ${token}`)
        .send(passwordData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Current password is incorrect");
    });
  });
});
