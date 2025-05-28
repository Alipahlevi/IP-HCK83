"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Recipe.hasMany(models.MealPlan, { foreignKey: "RecipeId" });
    }
  }
  Recipe.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Title is required" },
          notEmpty: { msg: "Title cannot be empty" },
        },
      },
      ingredients: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "Ingredients are required" },
          notEmpty: { msg: "Ingredients cannot be empty" },
        },
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "Instructions are required" },
          notEmpty: { msg: "Instructions cannot be empty" },
        },
      },
      source: {
        type: DataTypes.STRING,
        defaultValue: "Manual",
        validate: {
          notEmpty: { msg: "Source cannot be empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "Recipe",
    }
  );
  return Recipe;
};
