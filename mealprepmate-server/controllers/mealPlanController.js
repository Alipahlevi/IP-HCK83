const { MealPlan, Recipe, User } = require('../models');

class MealPlanController {
  static async createMealPlan(req, res, next) {
    try {
      const { day, recipeId } = req.body;
      const userId = req.user.id;
      
      if (!day || !recipeId) {
        return res.status(400).json({ message: 'Day and recipe ID are required' });
      }
      
      // Check if recipe exists
      const recipe = await Recipe.findByPk(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      
      // Check if meal plan already exists for this day
      const existingPlan = await MealPlan.findOne({
        where: { UserId: userId, day }
      });
      
      if (existingPlan) {
        // Update existing plan
        existingPlan.RecipeId = recipeId;
        await existingPlan.save();
        
        const updatedPlan = await MealPlan.findByPk(existingPlan.id, {
          include: [Recipe]
        });
        
        return res.json({ 
          message: 'Meal plan updated successfully',
          mealPlan: updatedPlan 
        });
      }
      
      // Create new meal plan
      const mealPlan = await MealPlan.create({
        day,
        UserId: userId,
        RecipeId: recipeId
      });
      
      const createdPlan = await MealPlan.findByPk(mealPlan.id, {
        include: [Recipe]
      });
      
      res.status(201).json({
        message: 'Meal plan created successfully',
        mealPlan: createdPlan
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async getUserMealPlans(req, res, next) {
    try {
      const userId = req.user.id;
      
      const mealPlans = await MealPlan.findAll({
        where: { UserId: userId },
        include: [Recipe],
        order: [['day', 'ASC']]
      });
      
      res.json({ mealPlans });
    } catch (error) {
      next(error);
    }
  }
  
  static async deleteMealPlan(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const mealPlan = await MealPlan.findOne({
        where: { id, UserId: userId }
      });
      
      if (!mealPlan) {
        return res.status(404).json({ message: 'Meal plan not found' });
      }
      
      await mealPlan.destroy();
      
      res.json({ message: 'Meal plan deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MealPlanController;