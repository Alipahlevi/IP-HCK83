import React from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { searchResults, recipes } = useSelector((state) => state.recipe);

  // Cari recipe berdasarkan ID dari searchResults atau recipes
  const recipe = [...searchResults, ...recipes].find(
    (r) => r.id?.toString() === id
  );

  if (!recipe) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#374151",
            marginBottom: "0.5rem",
          }}
        >
          Recipe Not Found
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
          The recipe you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.75rem",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const cardStyle = {
    background: "white",
    borderRadius: "1rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #f3f4f6",
    overflow: "hidden",
  };

  const getSourceBadge = () => {
    if (recipe.source === "AI Generated" || recipe.isAIGenerated) {
      return (
        <span
          style={{
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            color: "white",
            fontSize: "0.875rem",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            fontWeight: "600",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>🤖</span>
          <span>AI Generated</span>
        </span>
      );
    }
    return (
      <span
        style={{
          background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
          color: "white",
          fontSize: "0.875rem",
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          fontWeight: "600",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span>📚</span>
        <span>Database</span>
      </span>
    );
  };

  return (
    <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "transparent",
          border: "none",
          color: "#6b7280",
          fontSize: "0.875rem",
          cursor: "pointer",
          marginBottom: "2rem",
          padding: "0.5rem",
          borderRadius: "0.5rem",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#f3f4f6";
          e.target.style.color = "#374151";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "transparent";
          e.target.style.color = "#6b7280";
        }}
      >
        <span>←</span>
        <span>Back</span>
      </button>

      {/* Recipe Header */}
      <div style={{ ...cardStyle, marginBottom: "2rem" }}>
        {recipe.image && (
          <div style={{ position: "relative" }}>
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{
                width: "100%",
                height: "20rem",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
              }}
            >
              {getSourceBadge()}
            </div>
          </div>
        )}

        <div style={{ padding: "2rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "1rem",
              lineHeight: "1.2",
            }}
          >
            {recipe.title}
          </h1>

          {recipe.description && (
            <p
              style={{
                color: "#6b7280",
                fontSize: "1.125rem",
                lineHeight: "1.6",
                marginBottom: "1.5rem",
              }}
            >
              {recipe.description}
            </p>
          )}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            {recipe.cookingTime && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1rem",
                  color: "#6b7280",
                  background: "#f3f4f6",
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                }}
              >
                <span style={{ marginRight: "0.5rem" }}>⏱️</span>
                {recipe.cookingTime}
              </div>
            )}

            {recipe.difficulty && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1rem",
                  color: "#6b7280",
                  background: "#f3f4f6",
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                }}
              >
                <span style={{ marginRight: "0.5rem" }}>📊</span>
                {recipe.difficulty}
              </div>
            )}
          </div>

          {recipe.createdAt && (
            <div
              style={{
                fontSize: "0.875rem",
                color: "#9ca3af",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>📅</span>
              Created: {new Date(recipe.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Recipe Content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* Ingredients */}
        {recipe.ingredients && (
          <div style={cardStyle}>
            <div style={{ padding: "2rem" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#111827",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span>🥘</span>
                Ingredients
              </h2>
              <div
                style={{
                  fontSize: "1rem",
                  color: "#374151",
                  lineHeight: "1.6",
                  whiteSpace: "pre-line",
                }}
              >
                {recipe.ingredients}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {recipe.instructions && (
          <div style={cardStyle}>
            <div style={{ padding: "2rem" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#111827",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span>📝</span>
                Instructions
              </h2>
              <div
                style={{
                  fontSize: "1rem",
                  color: "#374151",
                  lineHeight: "1.6",
                  whiteSpace: "pre-line",
                }}
              >
                {recipe.instructions}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailPage;
