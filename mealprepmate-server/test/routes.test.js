const request = require("supertest");
const app = require("../app");

describe("Routes Integration", () => {
  test("should respond to health check", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
  });

  test("should handle 404 for unknown routes", async () => {
    const response = await request(app).get("/api/unknown-route");

    expect(response.status).toBe(404);
  });
});
