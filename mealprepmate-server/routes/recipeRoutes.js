const express = require('express');
const RecipeController = require('../controllers/recipeController');
const { authenticate } = require('../middlewares/authentication');
const router = express.Router();

router.get('/search', authenticate, RecipeController.searchRecipes);
router.get('/:id', authenticate, RecipeController.getRecipeById);
router.get('/', authenticate, RecipeController.getAllRecipes);

module.exports = router;