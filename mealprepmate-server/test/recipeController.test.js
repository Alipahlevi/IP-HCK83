const request = require("supertest");
const app = require("../app");
const { Recipe, User } = require("../models");
const { signToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");

// Mock Google Generative AI
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () =>
            JSON.stringify({
              name: "Test Recipe",
              ingredients: ["ingredient 1", "ingredient 2"],
              instructions: ["step 1", "step 2"],
              prepTime: 30,
              cookTime: 45,
              servings: 4,
              calories: 350,
              protein: 25,
              carbs: 40,
              fat: 12,
            }),
        },
      }),
    }),
  })),
}));

describe("Recipe Controller", () => {
  let testUser;
  let token;

  beforeEach(async () => {
    await User.destroy({ where: {} });
    await Recipe.destroy({ where: {} });

    testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: hashPassword("password123"),
    });
    token = signToken({ id: testUser.id, email: testUser.email });

    // Seed some test recipes
    await Recipe.bulkCreate([
      {
        name: "Chicken Salad",
        ingredients: ["chicken", "lettuce", "tomato"],
        instructions: ["Mix ingredients"],
        prepTime: 15,
        cookTime: 0,
        servings: 2,
        calories: 250,
        protein: 30,
        carbs: 10,
        fat: 8,
      },
      {
        name: "Beef Stir Fry",
        ingredients: ["beef", "vegetables", "soy sauce"],
        instructions: ["Stir fry ingredients"],
        prepTime: 10,
        cookTime: 15,
        servings: 3,
        calories: 400,
        protein: 35,
        carbs: 20,
        fat: 15,
      },
    ]);
  });

  describe("POST /api/recipes/generate", () => {
    test("should generate recipe with authentication", async () => {
      const recipeRequest = {
        preferences: "healthy chicken recipe",
        dietaryRestrictions: "none",
        cookingTime: 30,
      };

      const response = await request(app)
        .post("/api/recipes/generate")
        .set("Authorization", `Bearer ${token}`)
        .send(recipeRequest);

      expect(response.status).toBe(200);
      expect(response.body.recipe).toBeDefined();
      expect(response.body.recipe.name).toBe("Test Recipe");
    });

    test("should require authentication", async () => {
      const recipeRequest = {
        preferences: "healthy chicken recipe",
        dietaryRestrictions: "none",
        cookingTime: 30,
      };

      const response = await request(app)
        .post("/api/recipes/generate")
        .send(recipeRequest);

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/recipes/search", () => {
    test("should require authentication", async () => {
      const response = await request(app).get(
        "/api/recipes/search?query=chicken"
      );

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/recipes", () => {
    test("should get all recipes with authentication", async () => {
      const response = await request(app)
        .get("/api/recipes")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.recipes).toBeDefined();
      expect(Array.isArray(response.body.recipes)).toBe(true);
      expect(response.body.recipes.length).toBe(2);
    });
  });

  describe("GET /api/recipes/:id", () => {
    test("should get specific recipe", async () => {
      const recipe = await Recipe.findOne();

      const response = await request(app)
        .get(`/api/recipes/${recipe.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.recipe.id).toBe(recipe.id);
      expect(response.body.recipe.name).toBe(recipe.name);
    });

    test("should return 404 for non-existent recipe", async () => {
      const response = await request(app)
        .get("/api/recipes/999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Recipe not found");
    });
  });
});
