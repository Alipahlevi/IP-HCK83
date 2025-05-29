require('dotenv').config();
const { Recipe } = require('../models');
const { Op } = require('sequelize');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class RecipeController {
  static async searchRecipes(req, res, next) {
    try {
      const { ingredients } = req.query;

      console.log('🔍 Search request for:', ingredients);

      if (!ingredients) {
        return res.status(400).json({ message: 'Ingredients parameter is required' });
      }

      const ingredientsArray = ingredients.split(',').map(ing => ing.trim());
      console.log('📝 Parsed ingredients:', ingredientsArray);

      // Cek total recipes di database
      const totalRecipes = await Recipe.count();
      console.log('📊 Total recipes in database:', totalRecipes);

      // Coba cari di database dengan filter dan randomization
      try {
        const recipes = await Recipe.findAll({
          where: {
            [Op.or]: ingredientsArray.map(ingredient => ({
              ingredients: {
                [Op.iLike]: `%${ingredient}%`
              }
            }))
          },
          order: [
            // Random order untuk PostgreSQL
            Recipe.sequelize.fn('RANDOM')
          ],
          limit: 3
        });
        
        console.log('🎯 Found matching recipes:', recipes.length);
        console.log('📋 Recipe titles:', recipes.map(r => r.title));
        
        // Jika ada resep di database, generate AI untuk variasi
        if (recipes.length > 0) {
          try {
            console.log('🤖 Generating AI recipes...');
            
            const aiRecipes = [];
            const cuisineStyles = [
              'Indonesian style',
              'Western style', 
              'Asian fusion',
              'Mediterranean',
              'Healthy version'
            ];
            
            // Generate 2 AI recipes dengan style berbeda
            for (let i = 0; i < 2; i++) {
              const style = cuisineStyles[Math.floor(Math.random() * cuisineStyles.length)];
              const styledIngredients = [...ingredientsArray, style];
              
              console.log(`🎨 Generating ${style} recipe...`);
              
              const aiRecipe = await RecipeController.generateRecipeWithAI(styledIngredients);
              
              aiRecipes.push({
                id: `ai-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
                ...aiRecipe,
                source: 'AI Generated',
                style: style,
                createdAt: new Date(),
                updatedAt: new Date()
              });
              
              // Delay untuk variasi
              await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            const allRecipes = [
              ...recipes.map(recipe => ({ 
                ...recipe.toJSON(), 
                source: 'database',
                id: `db-${recipe.id}`
              })),
              ...aiRecipes
            ];
            
            // Shuffle hasil
            const shuffledRecipes = allRecipes.sort(() => Math.random() - 0.5);
            
            console.log('✅ Final recipes:', shuffledRecipes.map(r => r.title));
            
            return res.json({ 
              recipes: shuffledRecipes, 
              source: 'database + ai',
              debug: {
                totalInDb: totalRecipes,
                foundInDb: recipes.length,
                aiGenerated: aiRecipes.length,
                timestamp: new Date().toISOString()
              }
            });
            
          } catch (aiError) {
            console.error('❌ AI generation error:', aiError.message);
            
            // Return database results dengan shuffle
            const shuffledDbRecipes = recipes
              .map(recipe => ({ ...recipe.toJSON(), source: 'database' }))
              .sort(() => Math.random() - 0.5);
              
            return res.json({ 
              recipes: shuffledDbRecipes, 
              source: 'database_only',
              debug: { aiError: aiError.message }
            });
          }
        }
      } catch (dbError) {
        console.error('❌ Database query error:', dbError.message);
      }

      // Jika tidak ada di database atau error, full AI mode
      try {
        console.log('🚀 Full AI mode - no database results');
        
        const aiRecipes = [];
        const cuisineTypes = [
          'Indonesian traditional',
          'Modern Indonesian', 
          'Healthy Indonesian',
          'Quick Indonesian',
          'Fusion Indonesian'
        ];
        
        for (let i = 0; i < 4; i++) {
          const cuisine = cuisineTypes[i % cuisineTypes.length];
          const enhancedIngredients = [...ingredientsArray, cuisine, 'delicious'];
          
          console.log(`🍳 Creating ${cuisine} recipe with:`, enhancedIngredients);
          
          const aiRecipe = await RecipeController.generateRecipeWithAI(enhancedIngredients);
          
          aiRecipes.push({
            id: `ai-full-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
            ...aiRecipe,
            source: 'AI Generated',
            cuisine: cuisine,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          await new Promise(resolve => setTimeout(resolve, 700));
        }
        
        console.log('✅ AI recipes generated:', aiRecipes.map(r => r.title));
        
        return res.json({ 
          recipes: aiRecipes, 
          source: 'ai_full',
          debug: {
            mode: 'full_ai',
            timestamp: new Date().toISOString()
          }
        });
        
      } catch (aiError) {
        console.error('❌ Full AI error:', aiError.message);
        
        // Ultimate fallback - dynamic samples
        const dynamicSamples = [];
        const cookingStyles = [
          'tumis', 'goreng', 'rebus', 'panggang', 'kukus', 'bakar'
        ];
        const seasonings = [
          'bumbu kuning', 'bumbu merah', 'bumbu putih', 'bumbu hijau'
        ];
        
        for (let i = 0; i < 3; i++) {
          const style = cookingStyles[Math.floor(Math.random() * cookingStyles.length)];
          const seasoning = seasonings[Math.floor(Math.random() * seasonings.length)];
          const mainIngredient = ingredientsArray[0] || 'sayuran';
          
          dynamicSamples.push({
            id: `sample-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
            title: `${style.charAt(0).toUpperCase() + style.slice(1)} ${mainIngredient} ${seasoning}`,
            ingredients: `${ingredients}, ${seasoning}, minyak goreng, garam, merica`,
            instructions: `1. Siapkan ${mainIngredient} dan cuci bersih. 2. Panaskan minyak, tumis ${seasoning}. 3. Masukkan ${mainIngredient}, ${style} hingga matang. 4. Bumbui dengan garam dan merica. 5. Sajikan hangat.`,
            source: 'Dynamic Sample',
            style: style,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        
        console.log('✅ Fallback samples:', dynamicSamples.map(r => r.title));
        
        return res.json({ 
          recipes: dynamicSamples, 
          source: 'dynamic_sample',
          debug: {
            aiError: aiError.message,
            fallback: true
          }
        });
      }
      
    } catch (error) {
      console.error('💥 Search recipes error:', error);
      res.status(500).json({ 
        message: 'Internal server error', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  static async generateRecipeWithAI(ingredients) {
    try {
    // Use the correct model name
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create more varied prompts
    const cookingMethods = ['stir-fry', 'grilled', 'steamed', 'soup', 'curry', 'salad'];
    const cuisineStyles = ['Indonesian', 'Western', 'Asian', 'Mediterranean', 'Healthy'];
    
    const randomMethod = cookingMethods[Math.floor(Math.random() * cookingMethods.length)];
    const randomCuisine = cuisineStyles[Math.floor(Math.random() * cuisineStyles.length)];
    const randomSeed = Math.random().toString(36).substring(7);
    const timeSeed = new Date().toISOString();
    const prompt = `
You are a creative chef. Make 1 unique ${randomCuisine} recipe with a ${randomMethod} method using these ingredients: ${ingredients.join(', ')}.

Instructions:
- The recipe must be different each time, even with the same ingredients.
- Add optional extra ingredients or spices to make it more creative.
- Add a fun or surprising twist.
- Don't repeat any previously used format or title.
- Include a random ID so that every response is unique.


Prompt Time: ${timeSeed}

Respond ONLY with valid JSON like this:
{
  "title": "Creative Recipe Name",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"]
}`;

    console.log('🤖 AI Prompt:', prompt.substring(0, 100) + '...');

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const response = await result.response;
    const text = await response.text();
    
    console.log('🤖 AI Response:', text.substring(0, 200) + '...');

    // Better JSON extraction
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Try to find JSON between code blocks
      jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonMatch[0] = jsonMatch[1];
      }
    }
    
    if (!jsonMatch) {
      throw new Error(`No valid JSON found in AI response: ${text}`);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    if (!parsed.title || !parsed.ingredients || !parsed.instructions) {
      throw new Error('AI response missing required fields');
    }

    const formattedIngredients = Array.isArray(parsed.ingredients)
      ? parsed.ingredients.join(', ')
      : String(parsed.ingredients);

    const formattedInstructions = Array.isArray(parsed.instructions)
      ? parsed.instructions.map((step, index) => `${index + 1}. ${step.trim()}`).join(' ')
      : String(parsed.instructions);

    return {
      title: parsed.title,
      ingredients: formattedIngredients,
      instructions: formattedInstructions
    };

  } catch (error) {
    console.error('❌ generateRecipeWithAI error:', error.message);
    console.error('❌ Full error:', error);
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

  static async createRecipe(req, res, next) {
    try {
      const { title, ingredients, instructions } = req.body;

      if (!title || !ingredients || !instructions) {
        return res.status(400).json({ 
          message: 'Title, ingredients, and instructions are required' 
        });
      }

      const recipe = await Recipe.create({
        title,
        ingredients,
        instructions,
        source: 'User-Created'
      });

      res.status(201).json({ 
        message: 'Recipe created successfully', 
        recipe 
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateRecipe(req, res, next) {
    try {
      const { id } = req.params;
      const { title, ingredients, instructions } = req.body;

      const recipe = await Recipe.findByPk(id);

      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      const updatedRecipe = await recipe.update({
        ...(title && { title }),
        ...(ingredients && { ingredients }),
        ...(instructions && { instructions })
      });

      res.json({ 
        message: 'Recipe updated successfully', 
        recipe: updatedRecipe 
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RecipeController;