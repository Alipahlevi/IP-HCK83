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
    // Clean up database
    await MealPlan.destroy({ where: {}, truncate: true, cascade: true });
    await Recipe.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });

    // Create test user
    testUser = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: hashPassword("password123"),
    });

    // Create test recipe
    testRecipe = await Recipe.create({
      title: "Test Recipe",
      ingredients: "ingredient 1, ingredient 2",
      instructions: "step 1, step 2",
    });

    // Generate token
    token = signToken({ id: testUser.id, email: testUser.email });
  });

  describe("POST /api/meal-plans", () => {
    test("should create meal plan successfully", async () => {
      const mealPlanData = {
        day: "Monday",
        recipeId: testRecipe.id,
      };

      const response = await request(app)
        .post("/api/meal-plans")
        .set("Authorization", `Bearer ${token}`)
        .send(mealPlanData);

      expect(response.status).toBe(201);
      expect(typeof response.body.message).toBe("string");
      expect(response.body.message).toBe("Meal plan created successfully");
      expect(typeof response.body.mealPlan).toBe("object");
      expect(response.body.mealPlan.day).toBe("Monday");
      expect(response.body.mealPlan.UserId).toBe(testUser.id);
    });

    test("should update existing meal plan successfully", async () => {
      // Create existing meal plan first
      const existingPlan = await MealPlan.create({
        UserId: testUser.id,
        RecipeId: testRecipe.id,
        day: "Monday",
      });

      // Create another recipe for update
      const newRecipe = await Recipe.create({
        title: "New Recipe",
        ingredients: "New ingredients",
        instructions: "New instructions",
        source: "Test",
      });

      const response = await request(app)
        .post("/api/meal-plans")
        .set("Authorization", `Bearer ${token}`)
        .send({
          recipeId: newRecipe.id,
          day: "Monday",
        })
        .expect(200);

      expect(response.body.message).toBe("Meal plan updated successfully");
      expect(response.body.mealPlan.RecipeId).toBe(newRecipe.id);
    });
  });

  describe("GET /api/meal-plans", () => {
    beforeEach(async () => {
      await MealPlan.create({
        day: "Monday",
        UserId: testUser.id,
        RecipeId: testRecipe.id,
      });
    });

    test("should get user meal plans", async () => {
      const response = await request(app)
        .get("/api/meal-plans")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(typeof response.body.mealPlans).toBe("object");
      expect(Array.isArray(response.body.mealPlans)).toBe(true);
      expect(response.body.mealPlans.length).toBe(1);
      expect(response.body.mealPlans[0].day).toBe("Monday");
    });
  });

  describe("DELETE /api/meal-plans/:id", () => {
    let testMealPlan;

    beforeEach(async () => {
      testMealPlan = await MealPlan.create({
        day: "Monday",
        UserId: testUser.id,
        RecipeId: testRecipe.id,
      });
    });

    test("should delete meal plan successfully", async () => {
      const response = await request(app)
        .delete(`/api/meal-plans/${testMealPlan.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(typeof response.body.message).toBe("string");
      expect(response.body.message).toBe("Meal plan deleted successfully");
    });

    test("should return 404 for non-existent meal plan", async () => {
      const response = await request(app)
        .delete("/api/meal-plans/999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(typeof response.body.message).toBe("string");
      expect(response.body.message).toBe("Meal plan not found");
    });
  });

  // Test untuk error scenarios di mealPlanController
  describe("MealPlan Error Handling", () => {
    test("should handle invalid meal plan data", async () => {
      const response = await request(app)
        .post("/api/meal-plans")
        .set("Authorization", `Bearer ${token}`)
        .send({}); // Empty data

      expect(response.status).toBe(400);
    });

    test("should handle database error in getMealPlans", async () => {
      jest
        .spyOn(MealPlan, "findAll")
        .mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .get("/api/meal-plans")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
    });
  });

  describe("DELETE /api/meal-plans/:id", () => {
    it("should handle database errors during deletion", async () => {
      const mealPlan = await MealPlan.create({
        UserId: testUser.id,
        RecipeId: testRecipe.id,
        day: "Tuesday",
      });

      // Mock database error
      const originalDestroy = MealPlan.prototype.destroy;
      MealPlan.prototype.destroy = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .delete(`/api/meal-plans/${mealPlan.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(500);

      expect(response.body.message).toBe("Internal server error"); // Changed to lowercase

      // Restore original method
      MealPlan.prototype.destroy = originalDestroy;
    });
  });
});
