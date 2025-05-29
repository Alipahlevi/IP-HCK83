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
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/users/register")
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.password).toBeUndefined();
    });

    test("should not register user with duplicate email", async () => {
      const userData = {
        username: "testuser",
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
      expect(response.body.message).toBe("Data already exists"); // Changed from "Email already exists"
    });
  });

  describe("POST /api/users/login", () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        username: "testuser",
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
      expect(response.body.token).toBeDefined(); // Changed from access_token to token
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
      expect(response.body.message).toBe("Invalid credentials"); // Changed from "Invalid email or password"
    });
  });

  describe("GET /api/users/profile", () => {
    let testUser;
    let token;

    beforeEach(async () => {
      testUser = await User.create({
        username: "testuser",
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
      expect(response.body.user.username).toBe(testUser.username); // Changed from name to username
      expect(response.body.user.password).toBeUndefined();
    });
  });

  describe("PUT /api/users/profile", () => {
    let testUser;
    let token;

    beforeEach(async () => {
      testUser = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: hashPassword("password123"),
        firstName: "Test",
        lastName: "User",
      });
      token = signToken({ id: testUser.id, email: testUser.email });
    });

    test("should update user profile successfully", async () => {
      const updateData = {
        username: "updateduser",
        firstName: "Updated",
        lastName: "Name",
      };

      const response = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Profile updated successfully");
      expect(response.body.user.username).toBe(updateData.username); // Changed from name to username
      expect(response.body.user.firstName).toBe(updateData.firstName);
    });
  });

  describe("PUT /api/users/password", () => { // Changed from change-password to password
    let testUser;
    let token;

    beforeEach(async () => {
      testUser = await User.create({
        username: "testuser",
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
        .put("/api/users/password") // Changed from change-password to password
        .set("Authorization", `Bearer ${token}`)
        .send(passwordData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password updated successfully"); // Changed from "Password changed successfully"
    });

    test("should not change password with incorrect current password", async () => {
      const passwordData = {
        currentPassword: "wrongpassword",
        newPassword: "newpassword123",
      };

      const response = await request(app)
        .put("/api/users/password") // Changed from change-password to password
        .set("Authorization", `Bearer ${token}`)
        .send(passwordData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Current password is incorrect");
    });
    describe("POST /api/users/google-login", () => {
      test("should handle Google login with invalid token", async () => {
        const response = await request(app)
          .post("/api/users/google-login")
          .send({ id_token: "invalid_token" });
  
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Internal Server Error during Google Login");
      });
    });
  
    describe("DELETE /api/users/profile", () => {
      let testUser;
      let token;
  
      beforeEach(async () => {
        testUser = await User.create({
          username: "deleteuser",
          email: "delete@example.com",
          password: hashPassword("password123"),
        });
        token = signToken({ id: testUser.id, email: testUser.email });
      });
  
      test("should delete user account successfully", async () => {
        const response = await request(app)
          .delete("/api/users/profile")
          .set("Authorization", `Bearer ${token}`)
          .send({ password: "password123" });
  
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Account deleted successfully");
      });
  
      test("should not delete account without password", async () => {
        const response = await request(app)
          .delete("/api/users/profile")
          .set("Authorization", `Bearer ${token}`)
          .send({});
  
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Password is required to delete account");
      });
  
      test("should not delete account with incorrect password", async () => {
        const response = await request(app)
          .delete("/api/users/profile")
          .set("Authorization", `Bearer ${token}`)
          .send({ password: "wrongpassword" });
  
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Incorrect password");
      });
    });
  
    describe("POST /api/users/discord-login", () => {
      test("should handle Discord login without access token", async () => {
        const response = await request(app)
          .post("/api/users/discord-login")
          .send({});
  
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Discord access token is required");
      });
  
      test("should handle Discord login with invalid token", async () => {
        const response = await request(app)
          .post("/api/users/discord-login")
          .send({ access_token: "invalid_token" });
  
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Internal Server Error during Discord Login");
      });
    });
  });

});
