const request = require("supertest");
const app = require("../app");

describe("Routes Integration", () => {
  test("should respond to health check", async () => {
    const response = await request(app).get("/health"); // Ubah dari /api/health ke /health

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("OK");
    expect(response.body.message).toBe("MealPrepMate Server is running!");
  });

  test("should handle 404 for unknown routes", async () => {
    const response = await request(app).get("/api/unknown-route");

    expect(response.status).toBe(404);
  });
});
