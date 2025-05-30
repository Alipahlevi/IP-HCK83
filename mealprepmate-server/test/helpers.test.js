const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { signToken, verifyToken } = require("../helpers/jwt");

describe("Bcrypt Helper", () => {
  describe("hashPassword", () => {
    test("should hash password correctly", () => {
      const password = "testpassword";
      const hashed = hashPassword(password);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(typeof hashed).toBe("string");
    });
  });

  describe("comparePassword", () => {
    test("should return true for correct password", () => {
      const password = "testpassword";
      const hashed = hashPassword(password);

      const result = comparePassword(password, hashed);
      expect(result).toBe(true);
    });

    test("should return false for incorrect password", () => {
      const password = "testpassword";
      const wrongPassword = "wrongpassword";
      const hashed = hashPassword(password);

      const result = comparePassword(wrongPassword, hashed);
      expect(result).toBe(false);
    });
  });
});

describe("JWT Helper", () => {
  describe("signToken", () => {
    test("should create valid JWT token", () => {
      const payload = { id: 1, email: "test@example.com" };
      const token = signToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });
  });

  describe("verifyToken", () => {
    test("should verify valid token correctly", () => {
      const payload = { id: 1, email: "test@example.com" };
      const token = signToken(payload);

      const decoded = verifyToken(token);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
    });

    test("should throw error for invalid token", () => {
      const invalidToken = "invalid.token.here";

      expect(() => {
        verifyToken(invalidToken);
      }).toThrow();
    });
  });
});
