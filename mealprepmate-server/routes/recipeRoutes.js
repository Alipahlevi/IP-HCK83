const express = require('express');
const RecipeController = require('../controllers/recipeController');
const { authenticate } = require('../middlewares/authentication');
const router = express.Router();

// GET routes
router.get('/search', authenticate, RecipeController.searchRecipes);
router.get('/:id', authenticate, RecipeController.getRecipeById);
router.get('/', authenticate, RecipeController.getAllRecipes);

// POST route - Create new recipe
router.post('/', authenticate, RecipeController.createRecipe);

// PUT route - Update existing recipe
router.put('/:id', authenticate, RecipeController.updateRecipe);

// DELETE route dihapus sesuai permintaan
// router.delete('/:id', authenticate, RecipeController.deleteRecipe);

module.exports = router;