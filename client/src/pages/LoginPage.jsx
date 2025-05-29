import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { loginUser, googleLogin, clearError } from "../store/slices/authSlice";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const containerStyle = {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "3rem 1.5rem",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "1rem",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    padding: "2rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    outline: "none",
  };

  const buttonPrimaryStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.3)",
  };

  const buttonSecondaryStyle = {
    width: "100%",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0.75rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.75rem",
    background: "white",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#6b7280",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  // Google Sign In Handler
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);

      // Load Google Identity Services jika belum ada
      if (typeof window.google === "undefined") {
        // Load Google script dynamically
        await loadGoogleScript();
      }

      // Initialize Google Sign In
      window.google.accounts.id.initialize({
        client_id:
          import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id",
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Show Google Sign In prompt
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback: show one-tap dialog
          window.google.accounts.id.renderButton(
            document.getElementById("google-signin-button"),
            {
              theme: "outline",
              size: "large",
              width: "100%",
            }
          );
        }
      });
    } catch (error) {
      console.error("Google Sign In Error:", error);
      alert(
        "Gagal memuat Google Sign In. Silakan coba lagi atau gunakan email/password."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleCallback = async (response) => {
    try {
      setIsGoogleLoading(true);
      const result = await dispatch(googleLogin(response.credential)).unwrap();
      console.log("Google login success:", result);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Login Google gagal. Silakan coba lagi.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Load Google Identity Services script
  const loadGoogleScript = () => {
    return new Promise((resolve, reject) => {
      if (document.getElementById("google-script")) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.id = "google-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Load Google script on component mount
  useEffect(() => {
    loadGoogleScript().catch(console.error);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: "28rem", margin: "0 auto", width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #ffffff, #f0f9ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                margin: 0,
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <span>🍽️</span>
              MealPrepMate
            </h2>
          </Link>
          <h3
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "white",
              margin: 0,
              marginBottom: "0.5rem",
            }}
          >
            Welcome Back!
          </h3>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "1rem",
              margin: 0,
            }}
          >
            Sign in to continue your culinary journey
          </p>
        </div>

        {/* Login Form */}
        <div style={cardStyle}>
          {error && (
            <div
              style={{
                marginBottom: "1rem",
                background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                📧 Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#10b981";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(16, 185, 129, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                🔒 Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#10b981";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(16, 185, 129, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...buttonPrimaryStyle,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 25px -5px rgba(16, 185, 129, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 6px -1px rgba(16, 185, 129, 0.3)";
                }
              }}
            >
              {isLoading ? (
                <>
                  <div
                    style={{
                      width: "1rem",
                      height: "1rem",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  Signing in...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ margin: "1.5rem 0" }}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ width: "100%", borderTop: "1px solid #d1d5db" }}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                }}
              >
                <span
                  style={{
                    padding: "0 0.5rem",
                    background: "rgba(255, 255, 255, 0.95)",
                    color: "#6b7280",
                  }}
                >
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Google Sign In */}
          <div>
            {/* Hidden div for Google button rendering */}
            <div id="google-signin-button" style={{ display: "none" }}></div>

            {/* Custom Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              style={{
                ...buttonSecondaryStyle,
                opacity: isLoading || isGoogleLoading ? 0.7 : 1,
                cursor:
                  isLoading || isGoogleLoading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isLoading && !isGoogleLoading) {
                  e.target.style.background = "#f9fafb";
                  e.target.style.borderColor = "#10b981";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && !isGoogleLoading) {
                  e.target.style.background = "white";
                  e.target.style.borderColor = "#d1d5db";
                }
              }}
            >
              {isGoogleLoading ? (
                <>
                  <div
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      marginRight: "0.5rem",
                      border: "2px solid #f3f4f6",
                      borderTop: "2px solid #10b981",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  Connecting to Google...
                </>
              ) : (
                <>
                  <svg
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      marginRight: "0.5rem",
                    }}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
          </div>

          {/* Register Link */}
          <div
            style={{
              marginTop: "1.5rem",
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                fontWeight: "600",
                color: "#10b981",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#059669";
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#10b981";
                e.target.style.textDecoration = "none";
              }}
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add keyframes for loading spinner
const style = document.createElement("style");
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default LoginPage;
// Google Sign In Handler
const handleGoogleSignIn = async () => {
  try {
    setIsGoogleLoading(true);

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      alert(
        "Google Client ID tidak ditemukan. Silakan gunakan email dan password."
      );
      return;
    }

    // Load Google Identity Services jika belum ada
    if (typeof window.google === "undefined") {
      await loadGoogleScript();
    }

    // Initialize Google Sign In dengan konfigurasi yang lebih lengkap
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleCallback,
      auto_select: false,
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: false, // Disable FedCM untuk menghindari error
    });

    // Render button langsung tanpa prompt
    const buttonDiv = document.getElementById("google-signin-button");
    if (buttonDiv) {
      buttonDiv.style.display = "block";
      window.google.accounts.id.renderButton(buttonDiv, {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "signin_with",
        shape: "rectangular",
      });
    }
  } catch (error) {
    console.error("Google Sign In Error:", error);
    alert(
      "Gagal memuat Google Sign In. Silakan coba lagi atau gunakan email/password."
    );
  } finally {
    setIsGoogleLoading(false);
  }
};
