'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       User.hasMany(models.MealPlan, { foreignKey: 'UserId' });
    }
  }
  User.init({
    username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Username is required' },
      notEmpty: { msg: 'Username cannot be empty' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'Email is required' },
      notEmpty: { msg: 'Email cannot be empty' },
      isEmail: { msg: 'Email format is invalid' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Password is required' },
      notEmpty: { msg: 'Password cannot be empty' },
      len: {
        args: [5, 100],
        msg: 'Password must be at least 5 characters'
      }
    }
  }
}, {
  sequelize,
  modelName: 'User',
  });
  return User;
};