const { sequelize } = require("../models");

// Setup environment variables untuk testing
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.GEMINI_API_KEY = "test-gemini-api-key";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id";

// Setup database untuk testing
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  // Bersihkan semua tabel sebelum setiap test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});

afterAll(async () => {
  await sequelize.close();
});
