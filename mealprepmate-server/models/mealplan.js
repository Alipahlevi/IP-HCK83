"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MealPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MealPlan.belongsTo(models.User, { foreignKey: "UserId" });
      MealPlan.belongsTo(models.Recipe, { foreignKey: "RecipeId" });
    }
  }
  MealPlan.init(
    {
       day: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Day is required' },
      notEmpty: { msg: 'Day cannot be empty' }
    }
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'UserId is required' },
      isInt: { msg: 'UserId must be an integer' }
    }
  },
  RecipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'RecipeId is required' },
      isInt: { msg: 'RecipeId must be an integer' }
    }
  }
}, {
  sequelize,
  modelName: 'MealPlan',
    }
  );
  return MealPlan;
};
