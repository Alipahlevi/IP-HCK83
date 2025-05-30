import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router";
import { logout } from "../../store/slices/authSlice";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/recipes", label: "Recipes", icon: "📚" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
  };

  const navStyle = {
    background: "white",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    borderBottom: "4px solid #10b981",
  };

  const activeNavStyle = {
    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
    color: "#15803d",
    boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)",
    transform: "translateY(-1px)",
  };

  const inactiveNavStyle = {
    color: "#374151",
    background: "transparent",
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    fontWeight: "600",
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    transition: "all 0.3s ease",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.3)",
  };

  return (
    <div style={containerStyle}>
      {/* Navigation */}
      <nav style={navStyle}>
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: "4rem",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Link
                to="/dashboard"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
              >
                <span
                  style={{
                    fontSize: "1.5rem",
                    transition: "transform 0.3s ease",
                  }}
                >
                  🍽️
                </span>
                <span
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  MealPrepMate
                </span>
              </Link>
            </div>

            <div
              style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                    ...(isActive(item.path)
                      ? activeNavStyle
                      : inactiveNavStyle),
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.background = "#f3f4f6";
                      e.target.style.color = "#10b981";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.background = "transparent";
                      e.target.style.color = "#374151";
                    }
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginLeft: "1.5rem",
                  paddingLeft: "1.5rem",
                  borderLeft: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "2rem",
                      height: "2rem",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                    }}
                  >
                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    {user?.username || "User"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 8px 15px -3px rgba(239, 68, 68, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 4px 6px -1px rgba(239, 68, 68, 0.3)";
                  }}
                >
                  <span style={{ marginRight: "0.25rem" }}>🚪</span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}
      >
        <div
          style={{
            animation: "fadeIn 0.5s ease-out",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
