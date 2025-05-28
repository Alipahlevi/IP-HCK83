const express = require('express');
const MealPlanController = require('../controllers/mealPlanController');
const { authenticate } = require('../middlewares/authentication');
const router = express.Router();

router.post('/', authenticate, MealPlanController.createMealPlan);
router.get('/', authenticate, MealPlanController.getUserMealPlans);
router.delete('/:id', authenticate, MealPlanController.deleteMealPlan);

module.exports = router;