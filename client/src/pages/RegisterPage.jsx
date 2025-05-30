import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { registerUser, clearError } from "../store/slices/authSlice";
import Swal from "sweetalert2";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const containerStyle = {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #10b981 100%)",
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
    background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px -1px rgba(139, 92, 246, 0.3)",
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

    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi required fields
    const requiredFields = {
      username: "Username",
      email: "Email",
      password: "Password",
      confirmPassword: "Konfirmasi Password",
    };

    const emptyFields = [];
    Object.keys(requiredFields).forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        emptyFields.push(requiredFields[field]);
      }
    });

    if (emptyFields.length > 0) {
      await Swal.fire({
        icon: "warning",
        title: "Form Tidak Lengkap",
        html: `
          <div style="text-align: left; margin-top: 10px;">
            <p>Field berikut harus diisi:</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              ${emptyFields.map((field) => `<li>${field}</li>`).join("")}
            </ul>
          </div>
        `,
        confirmButtonText: "OK",
        confirmButtonColor: "#8b5cf6",
        customClass: {
          popup: "swal-custom-popup",
          title: "swal-custom-title",
        },
      });
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      await Swal.fire({
        icon: "error",
        title: "Format Email Salah",
        text: "Silakan masukkan email dengan format yang benar (contoh: user@example.com).",
        confirmButtonText: "OK",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    // Validasi username (minimal 3 karakter, hanya huruf, angka, underscore)
    if (formData.username.length < 3) {
      await Swal.fire({
        icon: "error",
        title: "Username Terlalu Pendek",
        text: "Username harus minimal 3 karakter.",
        confirmButtonText: "OK",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      await Swal.fire({
        icon: "error",
        title: "Format Username Salah",
        text: "Username hanya boleh mengandung huruf, angka, dan underscore (_).",
        confirmButtonText: "OK",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    // Validasi password
    if (formData.password.length < 6) {
      await Swal.fire({
        icon: "error",
        title: "Password Terlalu Pendek",
        text: "Password harus minimal 6 karakter.",
        confirmButtonText: "OK",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    // Validasi konfirmasi password
    if (formData.password !== formData.confirmPassword) {
      await Swal.fire({
        icon: "error",
        title: "Password Tidak Cocok",
        text: "Password dan konfirmasi password harus sama.",
        confirmButtonText: "OK",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await dispatch(registerUser(registerData));

    if (registerUser.fulfilled.match(result)) {
      await Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        text: "Akun Anda telah berhasil dibuat. Selamat datang di MealPrepMate!",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
        confirmButtonText: "Lanjutkan",
        confirmButtonColor: "#8b5cf6",
      });
    }
  };

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
            Join Our Community!
          </h3>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "1rem",
              margin: 0,
            }}
          >
            Create your account and start cooking amazing meals
          </p>
        </div>

        {/* Register Form */}
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

          {passwordError && (
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
              {passwordError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div>
              <label
                htmlFor="username"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                👤 Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#8b5cf6";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(139, 92, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

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
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#8b5cf6";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(139, 92, 246, 0.1)";
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
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min. 6 characters)"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#8b5cf6";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(139, 92, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                🔐 Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#8b5cf6";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(139, 92, 246, 0.1)";
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
                    "0 8px 25px -5px rgba(139, 92, 246, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 6px -1px rgba(139, 92, 246, 0.3)";
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
                  Creating account...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div
            style={{
              marginTop: "1.5rem",
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                fontWeight: "600",
                color: "#8b5cf6",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#7c3aed";
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#8b5cf6";
                e.target.style.textDecoration = "none";
              }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
