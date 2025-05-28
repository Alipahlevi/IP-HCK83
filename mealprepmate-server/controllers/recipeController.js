require('dotenv').config();
const { Recipe } = require('../models');
const { Op } = require('sequelize');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class RecipeController {
  static async searchRecipes(req, res, next) {
    try {
      const { ingredients } = req.query;

      if (!ingredients) {
        return res.status(400).json({ message: 'Ingredients parameter is required' });
      }

      const ingredientArray = ingredients.split(',').map(ing => ing.trim());

      // Search from database
      const recipes = await Recipe.findAll({
        where: {
          ingredients: {
            [Op.iLike]: `%${ingredientArray.join('%')}%`
          }
        },
        limit: 10
      });

      if (recipes.length > 0) {
        return res.json({ recipes, source: 'database' });
      }

      // Generate from AI if not found in database
      const aiRecipe = await RecipeController.generateRecipeWithAI(ingredientArray);

      if (aiRecipe) {
        const savedRecipe = await Recipe.create({
          title: aiRecipe.title,
          ingredients: aiRecipe.ingredients,
          instructions: aiRecipe.instructions,
          source: 'AI-Generated'
        });

        return res.json({ recipes: [savedRecipe], source: 'ai-generated' });
      }

      res.json({ recipes: [], message: 'No recipes found' });
    } catch (error) {
      next(error);
    }
  }

  static async generateRecipeWithAI(ingredients) {
    try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash-preview-05-20' });

    const prompt = `Create a detailed recipe using these ingredients: ${ingredients.join(', ')}. 
Please respond as JSON with keys:
- title: string
- ingredients: array of strings (plain text)
- instructions: array of strings (steps without numbers)
Do not include extra commentary.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: { text: prompt } }]
    });

    const response = await result.response;
    const text = await response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in AI response");

    const parsed = JSON.parse(jsonMatch[0]);

    const formattedIngredients = Array.isArray(parsed.ingredients)
      ? parsed.ingredients.join(', ')
      : String(parsed.ingredients);

    const formattedInstructions = Array.isArray(parsed.instructions)
      ? parsed.instructions.map((step, index) => `${index + 1}. ${step.trim()}`).join(' ')
      : String(parsed.instructions);

    const recipe = await Recipe.create({
      title: parsed.title,
      ingredients: formattedIngredients,
      instructions: formattedInstructions,
      source: 'AI-Generated',
    });

    return recipe;
  } catch (error) {
    console.error('generateRecipeWithAI error:', error);
    throw error;
  }
  }

  static async getRecipeById(req, res, next) {
    try {
      const { id } = req.params;

      const recipe = await Recipe.findByPk(id);

      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      res.json({ recipe });
    } catch (error) {
      next(error);
    }
  }

  static async getAllRecipes(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const recipes = await Recipe.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        recipes: recipes.rows,
        totalCount: recipes.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(recipes.count / limit)
      });
    } catch (error) {
      next(error);
    }
  }

  static async listAvailableModels() {
    try {
      const models = await genAI.listModels();
      console.log('Available models:', models);
      return models;
    } catch (error) {
      console.error('Error listing models:', error);
      return [];
    }
  }
}

module.exports = RecipeController;
