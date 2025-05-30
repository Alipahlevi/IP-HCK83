import React from "react";
import { useNavigate } from "react-router";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (recipe.id) {
      navigate(`/recipe/${recipe.id}`);
    }
  };

  // Tambahkan di bagian cardStyle
  const premiumCardStyle = {
    background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: "1.5rem",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
  };

  // Tambahkan glow effect
  const glowOverlay = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
    pointerEvents: "none",
  };
  const cardStyle = {
    background: "white",
    borderRadius: "1rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    border: "1px solid #f3f4f6",
    overflow: "hidden",
    cursor: "pointer",
  };

  const getSourceBadge = () => {
    if (recipe.source === "AI Generated" || recipe.isAIGenerated) {
      return (
        <span
          style={{
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            color: "white",
            fontSize: "0.75rem",
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
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
          fontSize: "0.75rem",
          padding: "0.25rem 0.75rem",
          borderRadius: "9999px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
        }}
      >
        <span>📚</span>
        <span>Database</span>
      </span>
    );
  };

  return (
    <div
      style={cardStyle}
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
      }}
    >
      {recipe.image && (
        <div style={{ position: "relative", overflow: "hidden" }}>
          <img
            src={recipe.image}
            alt={recipe.title}
            style={{
              width: "100%",
              height: "12rem",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
            }}
          >
            {getSourceBadge()}
          </div>
        </div>
      )}

      <div style={{ padding: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            color: "#111827",
            marginBottom: "0.75rem",
            transition: "color 0.3s ease",
          }}
        >
          {recipe.title}
        </h3>

        {recipe.description && (
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.875rem",
              marginBottom: "1rem",
              lineHeight: "1.5",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {recipe.description}
          </p>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          {recipe.cookingTime && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.875rem",
                color: "#6b7280",
                background: "#f3f4f6",
                padding: "0.25rem 0.75rem",
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
                fontSize: "0.875rem",
                color: "#6b7280",
                background: "#f3f4f6",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
              }}
            >
              <span style={{ marginRight: "0.5rem" }}>📊</span>
              {recipe.difficulty}
            </div>
          )}
        </div>

        {recipe.ingredients && (
          <div style={{ marginBottom: "1rem" }}>
            <h4
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>🥘</span>
              Ingredients:
            </h4>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                lineHeight: "1.5",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {recipe.ingredients}
            </p>
          </div>
        )}

        {recipe.instructions && (
          <div style={{ marginBottom: "1rem" }}>
            <h4
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>📝</span>
              Instructions:
            </h4>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                lineHeight: "1.5",
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {recipe.instructions}
            </p>
          </div>
        )}

        {recipe.createdAt && (
          <div
            style={{
              fontSize: "0.75rem",
              color: "#9ca3af",
              borderTop: "1px solid #f3f4f6",
              paddingTop: "0.75rem",
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
  );
};

export default RecipeCard;
