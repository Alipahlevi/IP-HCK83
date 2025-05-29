require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/meal-plans", mealPlanRoutes);

// Error handling middleware
app.use(errorHandler);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "MealPrepMate Server is running!" });
});

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    try {
      await sequelize.authenticate();
      console.log("✅ Database connected successfully");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
    }
  });
}

module.exports = app;
