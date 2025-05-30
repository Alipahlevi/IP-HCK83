import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRecipes } from "../store/slices/recipeSlice";
import RecipeCard from "../components/Recipe/RecipeCard";
import LoadingSpinner from "../components/common/LoadingSpinner";

const RecipesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const dispatch = useDispatch();
  const { recipes, isLoading, error } = useSelector((state) => state.recipe);

  const cardStyle = {
    background: "white",
    borderRadius: "1rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    border: "1px solid #f3f4f6",
  };

  const gradientCardStyle = {
    ...cardStyle,
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white",
  };

  useEffect(() => {
    dispatch(getAllRecipes());
  }, [dispatch]);

  useEffect(() => {
    if (recipes) {
      const filtered = recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  }, [recipes, searchTerm]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "16rem",
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
          border: "1px solid #fecaca",
          color: "#dc2626",
          padding: "1rem",
          borderRadius: "0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>⚠️</span>
        <div>
          <p style={{ fontWeight: "600", margin: 0 }}>Error loading recipes:</p>
          <p style={{ margin: 0, marginTop: "0.25rem" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          ...gradientCardStyle,
          padding: "2rem",
          marginBottom: "1.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            margin: 0,
          }}
        >
          <span>🍽️</span>
          All Recipes
        </h1>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "1.125rem",
            margin: 0,
          }}
        >
          Discover amazing recipes from our collection and AI-generated
          suggestions
        </p>
      </div>

      {/* Search */}
      <div style={{ ...cardStyle, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <span style={{ fontSize: "1.5rem", marginRight: "0.75rem" }}>🔍</span>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "#1f2937",
              margin: 0,
            }}
          >
            Search Recipes
          </h2>
        </div>

        <input
          type="text"
          placeholder="Search by recipe name or ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            border: "2px solid #e5e7eb",
            borderRadius: "0.75rem",
            fontSize: "1rem",
            transition: "all 0.3s ease",
            outline: "none",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#3b82f6";
            e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e5e7eb";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Results */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.875rem",
            fontWeight: "bold",
            color: "#1f2937",
            margin: 0,
          }}
        >
          {searchTerm ? "Search Results" : "All Recipes"}
        </h2>

        <div
          style={{
            background: "linear-gradient(135deg, #ddd6fe, #c4b5fd)",
            color: "#7c3aed",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            fontSize: "0.875rem",
            fontWeight: "600",
          }}
        >
          {filteredRecipes.length} recipe
          {filteredRecipes.length !== 1 ? "s" : ""}
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div
          style={{
            ...cardStyle,
            padding: "3rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📚</div>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#374151",
              marginBottom: "0.5rem",
            }}
          >
            {searchTerm ? "No recipes found" : "No recipes available"}
          </h3>
          <p
            style={{
              color: "#6b7280",
              fontSize: "1rem",
            }}
          >
            {searchTerm
              ? "Try different search terms"
              : "Check back later for new recipes!"}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
