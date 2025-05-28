'use strict';
const axios = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      console.log('🌱 Starting recipe seeding from Spoonacular API...');
      
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/random?number=100&apiKey=${process.env.SPOONACULAR_API_KEY}`
      );
      
      const recipes = response.data.recipes.map(recipe => ({
        title: recipe.title,
        ingredients: recipe.extendedIngredients
          .map(ing => `${ing.amount} ${ing.unit} ${ing.name}`)
          .join(', '),
        instructions: recipe.instructions || recipe.summary,
        source: 'Spoonacular',
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      await queryInterface.bulkInsert('Recipes', recipes, {});
      console.log(`✅ Successfully seeded ${recipes.length} recipes`);
    } catch (error) {
      console.error('❌ Error seeding recipes:', error.message);
      
      // Fallback data if API fails
      const fallbackRecipes = [
        {
          title: 'Simple Pasta',
          ingredients: '200g pasta, 2 tbsp olive oil, 2 cloves garlic, salt, pepper',
          instructions: '1. Boil pasta according to package instructions. 2. Heat olive oil, add garlic. 3. Mix pasta with oil and garlic. 4. Season with salt and pepper.',
          source: 'Fallback',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Scrambled Eggs',
          ingredients: '3 eggs, 2 tbsp milk, 1 tbsp butter, salt, pepper',
          instructions: '1. Beat eggs with milk. 2. Heat butter in pan. 3. Add eggs and scramble. 4. Season with salt and pepper.',
          source: 'Fallback',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await queryInterface.bulkInsert('Recipes', fallbackRecipes, {});
      console.log('✅ Seeded fallback recipes');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Recipes', null, {});
  }
};