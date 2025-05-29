const request = require("supertest");
const app = require("../app");
const { MealPlan, Recipe, User } = require("../models");
const { signToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");

describe("Meal Plan Controller", () => {
  let testUser;
  let testRecipe;
  let token;

  beforeEach(async () => {
    await User.destroy({ where: {} });
    await Recipe.destroy({ where: {} });
    await MealPlan.destroy({ where: {} });

    testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: hashPassword("password123"),
    });

    testRecipe = await Recipe.create({
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
    });

    token = signToken({ id: testUser.id, email: testUser.email });
  });

  describe("POST /api/meal-plans", () => {
    test("should create meal plan successfully", async () => {
      const mealPlanData = {
        name: "Weekly Meal Plan",
        startDate: "2024-01-01",
        endDate: "2024-01-07",
        meals: [
          {
            day: "Monday",
            mealType: "breakfast",
            recipeId: testRecipe.id,
          },
          {
            day: "Monday",
            mealType: "lunch",
            recipeId: testRecipe.id,
          },
        ],
      };

      const response = await request(app)
        .post("/api/meal-plans")
        .set("Authorization", `Bearer ${token}`)
        .send(mealPlanData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Meal plan created successfully");
      expect(response.body.mealPlan.name).toBe(mealPlanData.name);
      expect(response.body.mealPlan.userId).toBe(testUser.id);
    });
  });

  describe("GET /api/meal-plans", () => {
    beforeEach(async () => {
      await MealPlan.create({
        name: "Test Meal Plan",
        startDate: "2024-01-01",
        endDate: "2024-01-07",
        userId: testUser.id,
        meals: [
          {
            day: "Monday",
            mealType: "breakfast",
            recipeId: testRecipe.id,
          },
        ],
      });
    });

    test("should get user meal plans", async () => {
      const response = await request(app)
        .get("/api/meal-plans")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.mealPlans).toBeDefined();
      expect(Array.isArray(response.body.mealPlans)).toBe(true);
      expect(response.body.mealPlans.length).toBe(1);
      expect(response.body.mealPlans[0].name).toBe("Test Meal Plan");
    });
  });

  describe("DELETE /api/meal-plans/:id", () => {
    let testMealPlan;

    beforeEach(async () => {
      testMealPlan = await MealPlan.create({
        name: "Test Meal Plan",
        startDate: "2024-01-01",
        endDate: "2024-01-07",
        userId: testUser.id,
        meals: [
          {
            day: "Monday",
            mealType: "breakfast",
            recipeId: testRecipe.id,
          },
        ],
      });
    });

    test("should delete meal plan successfully", async () => {
      const response = await request(app)
        .delete(`/api/meal-plans/${testMealPlan.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Meal plan deleted successfully");
    });

    test("should return 404 for non-existent meal plan", async () => {
      const response = await request(app)
        .delete("/api/meal-plans/999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Meal plan not found");
    });
  });
});
