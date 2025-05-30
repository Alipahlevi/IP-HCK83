const request = require("supertest");
const app = require("../app");
const { hashPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User, Recipe } = require("../models");
const RecipeController = require("../controllers/recipeController"); // Tambahkan import ini

// Mock Google Generative AI
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () =>
            JSON.stringify({
              title: "Test Recipe",
              ingredients: "ingredient 1, ingredient 2",
              instructions: "step 1, step 2",
              source: "AI Generated"
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
    await User.destroy({ where: {}, truncate: true, cascade: true });
    await Recipe.destroy({ where: {}, truncate: true, cascade: true });

    testUser = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: hashPassword("password123"),
    });
    token = signToken({ id: testUser.id, email: testUser.email });

    // Seed some test recipes
    await Recipe.bulkCreate([
      {
        title: "Chicken Salad",
        ingredients: "chicken, lettuce, tomato",
        instructions: "Mix ingredients",
        source: "Manual",
      },
      {
        title: "Pasta",
        ingredients: "pasta, sauce, cheese",
        instructions: "Cook pasta, add sauce",
        source: "Manual",
      },
    ]);
  });

  describe("GET /api/recipes/search", () => {
    test("should search recipes with authentication", async () => {
      const response = await request(app)
        .get("/api/recipes/search?ingredients=chicken")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.recipes).toBeDefined();
      expect(Array.isArray(response.body.recipes)).toBe(true);
    });

    test("should require authentication", async () => {
      const response = await request(app).get(
        "/api/recipes/search?ingredients=chicken"
      );

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/recipes", () => {
    test("should create recipe with authentication", async () => {
      const newRecipe = {
        title: "New Test Recipe",
        ingredients: "test ingredient 1, test ingredient 2",
        instructions: "test step 1, test step 2",
        source: "Manual"
      };

      const response = await request(app)
        .post("/api/recipes")
        .set("Authorization", `Bearer ${token}`)
        .send(newRecipe);

      expect(response.status).toBe(201);
      expect(response.body.recipe).toBeDefined();
      expect(response.body.recipe.title).toBe("New Test Recipe");
    });

    test("should require authentication", async () => {
      const newRecipe = {
        title: "New Test Recipe",
        ingredients: "test ingredient 1, test ingredient 2",
        instructions: "test step 1, test step 2",
        source: "Manual"
      };

      const response = await request(app)
        .post("/api/recipes")
        .send(newRecipe);

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
      expect(response.body.recipe.title).toBe(recipe.title);
    });

    test("should return 404 for non-existent recipe", async () => {
      const response = await request(app)
        .get("/api/recipes/999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Recipe not found");
    });
  });
  // Tambahkan test untuk missing ingredients parameter
  describe("GET /api/recipes/search - Validation", () => {
    let testUser;
    let token;
  
    beforeEach(async () => {
      await User.destroy({ where: {}, truncate: true, cascade: true });
      
      testUser = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: hashPassword("password123"),
      });
      token = signToken({ id: testUser.id, email: testUser.email });
    });
  
    test("should return 400 when ingredients parameter is missing", async () => {
      const response = await request(app)
        .get("/api/recipes/search")
        .set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Ingredients parameter is required");
    });
  });
  
  // Test untuk create recipe
  describe("POST /api/recipes", () => {
    let testUser;
    let token;
  
    beforeEach(async () => {
      await User.destroy({ where: {}, truncate: true, cascade: true });
      
      testUser = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: hashPassword("password123"),
      });
      token = signToken({ id: testUser.id, email: testUser.email });
    });
  
    test("should create recipe successfully", async () => {
      const recipeData = {
        title: "Test Recipe",
        ingredients: "ingredient1, ingredient2",
        instructions: "Step 1. Do something",
        source: "manual"
      };
  
      const response = await request(app)
        .post("/api/recipes")
        .set("Authorization", `Bearer ${token}`)
        .send(recipeData);
  
      expect(response.status).toBe(201);
      expect(response.body.recipe.title).toBe(recipeData.title); // Changed from response.body.title
    });
  });
  
  // Test untuk update recipe
  describe("PUT /api/recipes/:id", () => {
    let testUser;
    let token;
  
    beforeEach(async () => {
      await User.destroy({ where: {}, truncate: true, cascade: true });
      await Recipe.destroy({ where: {}, truncate: true, cascade: true });
      
      testUser = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: hashPassword("password123"),
      });
      token = signToken({ id: testUser.id, email: testUser.email });
    });
  
    test("should update recipe successfully", async () => {
      const recipe = await Recipe.create({
        title: "Original Recipe",
        ingredients: "original ingredients",
        instructions: "original instructions",
        source: "manual"
      });
  
      const updateData = {
        title: "Updated Recipe",
        ingredients: "updated ingredients",
        instructions: "updated instructions"
      };
  
      const response = await request(app)
        .put(`/api/recipes/${recipe.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);
  
      expect(response.status).toBe(200);
      expect(response.body.recipe.title).toBe(updateData.title); // Changed from response.body.title
    });
  
    test("should return 404 for non-existent recipe", async () => {
      const response = await request(app)
        .put("/api/recipes/999")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated" });
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Recipe not found");
    });
  });
  
  // Test untuk error handling di searchRecipes - Simplified Version
  describe('Error Handling Tests', () => {
    let testUser;
    let token;
  
    beforeEach(async () => {
      await User.destroy({ where: {}, truncate: true, cascade: true });
      await Recipe.destroy({ where: {}, truncate: true, cascade: true });
      
      testUser = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: hashPassword("password123"),
      });
      token = signToken({ id: testUser.id, email: testUser.email });
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });
  
    test('should handle missing ingredients parameter', async () => {
      const response = await request(app)
        .get('/api/recipes/search') // No ingredients parameter
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Ingredients parameter is required');
    });
    
    test('should return recipes when database has data', async () => {
      // Create test recipe in database
      await Recipe.create({
        title: "Test Chicken Recipe",
        ingredients: "chicken, salt, pepper",
        instructions: "Cook chicken with salt and pepper",
        source: "test"
      });
      
      const response = await request(app)
        .get('/api/recipes/search?ingredients=chicken')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.recipes).toBeDefined();
      expect(response.body.recipes.length).toBeGreaterThan(0);
    });
    
    test('should fallback to AI when no database results', async () => {
      // Ensure database is empty (already done in beforeEach)
      const response = await request(app)
        .get('/api/recipes/search?ingredients=uniqueingredient123')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.recipes).toBeDefined();
      // Should be either ai_full or dynamic_sample depending on AI availability
      expect(['ai_full', 'dynamic_sample']).toContain(response.body.source);
    });
    
    test('should handle invalid token', async () => {
      const response = await request(app)
        .get('/api/recipes/search?ingredients=chicken')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(401);
    });
    
    test('should handle missing authorization header', async () => {
      const response = await request(app)
        .get('/api/recipes/search?ingredients=chicken');
      
      expect(response.status).toBe(401);
    });
    
    test('should handle empty ingredients parameter', async () => {
      const response = await request(app)
        .get('/api/recipes/search?ingredients=')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Ingredients parameter is required');
    });
    
    test('should handle multiple ingredients', async () => {
      const response = await request(app)
        .get('/api/recipes/search?ingredients=chicken,rice,vegetables')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.recipes).toBeDefined();
    });
    
    test('should return consistent response structure', async () => {
      const response = await request(app)
        .get('/api/recipes/search?ingredients=chicken')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('recipes');
      expect(response.body).toHaveProperty('source');
      expect(Array.isArray(response.body.recipes)).toBe(true);
      
      if (response.body.recipes.length > 0) {
        const recipe = response.body.recipes[0];
        expect(recipe).toHaveProperty('title');
        expect(recipe).toHaveProperty('ingredients');
        expect(recipe).toHaveProperty('instructions');
      }
    });
    describe('POST /api/recipes - createRecipe', () => {
      it('should create a new recipe successfully', async () => {
        const recipeData = {
          title: 'Test Recipe',
          ingredients: 'Test ingredients, more ingredients',
          instructions: 'Step 1: Do this, Step 2: Do that'
        };
        
        const response = await request(app)
          .post('/api/recipes')
          .set('Authorization', `Bearer ${token}`)
          .send(recipeData)
          .expect(201);
          
        expect(response.body.message).toBe('Recipe created successfully');
        expect(response.body.recipe.title).toBe('Test Recipe');
        expect(response.body.recipe.source).toBe('User-Created');
      });
      
      it('should return 400 if title is missing', async () => {
        const response = await request(app)
          .post('/api/recipes')
          .set('Authorization', `Bearer ${token}`)
          .send({ ingredients: 'Test', instructions: 'Test' })
          .expect(400);
          
        expect(response.body.message).toBe('Title, ingredients, and instructions are required');
      });
      
      it('should return 400 if ingredients are missing', async () => {
        const response = await request(app)
          .post('/api/recipes')
          .set('Authorization', `Bearer ${token}`)
          .send({ title: 'Test', instructions: 'Test' })
          .expect(400);
          
        expect(response.body.message).toBe('Title, ingredients, and instructions are required');
      });
      
      it('should return 400 if instructions are missing', async () => {
        const response = await request(app)
          .post('/api/recipes')
          .set('Authorization', `Bearer ${token}`)
          .send({ title: 'Test', ingredients: 'Test' })
          .expect(400);
          
        expect(response.body.message).toBe('Title, ingredients, and instructions are required');
      });
    });
    
    describe('listAvailableModels', () => {
      it('should return available models', async () => {
        const models = await RecipeController.listAvailableModels();
        expect(Array.isArray(models)).toBe(true);
      });
    });
    
    describe('GET /api/recipes/:id - getRecipeById', () => {
      it('should return 404 for non-existent recipe', async () => {
        const response = await request(app)
          .get('/api/recipes/99999')
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
          
        expect(response.body.message).toBe('Recipe not found');
      });
    });
  
    // Pindahkan blok tes ini KE DALAM blok describe utama
    describe('PUT /api/recipes/:id - updateRecipe', () => {
      let testRecipe;
  
      beforeEach(async () => {
        testRecipe = await Recipe.create({
          title: 'Original Recipe',
          ingredients: 'original ingredients',
          instructions: 'original instructions',
          source: 'Manual'
        });
      });
  
      it('should update recipe successfully', async () => {
        const updateData = {
          title: 'Updated Recipe',
          ingredients: 'updated ingredients',
          instructions: 'updated instructions'
        };
  
        const response = await request(app)
          .put(`/api/recipes/${testRecipe.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData)
          .expect(200);
  
        expect(response.body.message).toBe('Recipe updated successfully');
        expect(response.body.recipe.title).toBe(updateData.title);
        expect(response.body.recipe.ingredients).toBe(updateData.ingredients);
        expect(response.body.recipe.instructions).toBe(updateData.instructions);
      });
  
      it('should update recipe with partial data', async () => {
        const updateData = {
          title: 'Partially Updated Recipe'
        };
  
        const response = await request(app)
          .put(`/api/recipes/${testRecipe.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData)
          .expect(200);
  
        expect(response.body.message).toBe('Recipe updated successfully');
        expect(response.body.recipe.title).toBe(updateData.title);
        expect(response.body.recipe.ingredients).toBe('original ingredients');
      });
  
      it('should return 404 for non-existent recipe', async () => {
        const response = await request(app)
          .put('/api/recipes/99999')
          .set('Authorization', `Bearer ${token}`)
          .send({ title: 'Updated' })
          .expect(404);
  
        expect(response.body.message).toBe('Recipe not found');
      });
    });
  
    // Pindahkan blok tes ini juga KE DALAM blok describe utama
    // Ganti tes generate dengan tes search yang memicu AI generation
    describe('Error handling for generateRecipeWithAI', () => {
      let originalGenerateRecipeWithAI;
      
      beforeEach(async () => {
        // Store original function
        originalGenerateRecipeWithAI = RecipeController.generateRecipeWithAI;
        
        // Add a test recipe to database so we trigger the database + AI path
        await Recipe.create({
          title: 'Test Chicken Recipe',
          ingredients: 'chicken, salt, pepper',
          instructions: 'Cook the chicken',
          UserId: testUser.id
        });
      });
      
      afterEach(async () => {
        // Restore original function
        RecipeController.generateRecipeWithAI = originalGenerateRecipeWithAI;
        
        // Clean up test recipe
        await Recipe.destroy({ where: { title: 'Test Chicken Recipe' } });
      });
  
      it('should handle invalid JSON response from AI', async () => {
        // Mock the generateRecipeWithAI function to throw an error
        RecipeController.generateRecipeWithAI = jest.fn().mockRejectedValue(
          new Error('No valid JSON found in AI response')
        );
  
        const response = await request(app)
          .get('/api/recipes/search?ingredients=chicken')
          .set('Authorization', `Bearer ${token}`);
  
        // When AI fails but DB has results, it returns database_only
        expect(response.status).toBe(200);
        expect(response.body.source).toBe('database_only');
        expect(response.body.debug.aiError).toBeDefined();
      });
  
      it('should handle AI response missing required fields', async () => {
        // Mock the generateRecipeWithAI function to throw an error
        RecipeController.generateRecipeWithAI = jest.fn().mockRejectedValue(
          new Error('AI response missing required fields')
        );
  
        const response = await request(app)
          .get('/api/recipes/search?ingredients=chicken')
          .set('Authorization', `Bearer ${token}`);
  
        // When AI fails but DB has results, it returns database_only
        expect(response.status).toBe(200);
        expect(response.body.source).toBe('database_only');
        expect(response.body.debug.aiError).toBeDefined();
      });
  
      it('should handle AI failure when no database results (dynamic_sample)', async () => {
        // Mock the generateRecipeWithAI function to throw an error
        RecipeController.generateRecipeWithAI = jest.fn().mockRejectedValue(
          new Error('AI generation failed')
        );
  
        // Use an ingredient that won't be found in database
        const response = await request(app)
          .get('/api/recipes/search?ingredients=nonexistentingredient')
          .set('Authorization', `Bearer ${token}`);
  
        // When no DB results and AI fails, it returns dynamic_sample
        expect(response.status).toBe(200);
        expect(response.body.source).toBe('dynamic_sample');
        expect(response.body.debug.aiError).toBeDefined();
      });
    });
});

}); // Kurung tutup ini harus berada di paling akhir

