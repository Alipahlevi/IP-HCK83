import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import {
  getUserProfile,
  updateUserProfile,
  deleteUser,
} from "../store/slices/userSlice";
import { logout } from "../store/slices/authSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    bio: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, isLoading, error } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  // Inline styles (keep existing styles)
  const containerStyle = {
    maxWidth: "48rem",
    margin: "0 auto",
    padding: "2rem 1rem",
  };

  const cardStyle = {
    background: "white",
    borderRadius: "1.5rem",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    padding: "2.5rem",
    border: "1px solid #f3f4f6",
    transition: "all 0.3s ease",
  };

  const headerStyle = {
    background: "linear-gradient(135deg, #10b981, #059669)",
    borderRadius: "1rem",
    padding: "2rem",
    marginBottom: "2rem",
    color: "white",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "700",
    margin: "0 0 0.5rem 0",
    background: "linear-gradient(135deg, #ffffff, #f0fdf4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const subtitleStyle = {
    fontSize: "1.1rem",
    opacity: "0.9",
    margin: "0",
  };

  const buttonPrimaryStyle = {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.75rem",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.3)",
    fontSize: "1rem",
  };

  const buttonSecondaryStyle = {
    background: "linear-gradient(135deg, #6b7280, #4b5563)",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.75rem",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px -1px rgba(107, 114, 128, 0.3)",
    fontSize: "1rem",
  };

  const buttonDangerStyle = {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.75rem",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.3)",
    fontSize: "1rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.875rem 1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    backgroundColor: "#ffffff",
  };

  const inputDisabledStyle = {
    ...inputStyle,
    backgroundColor: "#f9fafb",
    color: "#6b7280",
    cursor: "not-allowed",
  };

  const inputFocusStyle = {
    outline: "none",
    borderColor: "#10b981",
    boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.5rem",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "1.5rem",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "120px",
    resize: "vertical",
    fontFamily: "inherit",
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
    flexWrap: "wrap",
  };

  const loadingContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "16rem",
    background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
    borderRadius: "1rem",
  };

  const profileInfoStyle = {
    background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
    borderRadius: "1rem",
    padding: "1.5rem",
    marginBottom: "2rem",
    border: "2px solid #d1fae5",
  };

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  // Show success message with SweetAlert2
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error,
        confirmButtonColor: "#10b981",
      });
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(formData)).unwrap();

      // Success alert with SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Profile updated successfully!",
        confirmButtonColor: "#10b981",
        timer: 3000,
        timerProgressBar: true,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        bio: profile.bio || "",
      });
    }
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    const { value: password } = await Swal.fire({
      title: "⚠️ Delete Account",
      html: `
        <p style="margin-bottom: 20px; color: #374151;">This action cannot be undone. Please enter your password to confirm.</p>
        <input type="password" id="password" class="swal2-input" placeholder="Enter your password" style="margin-top: 10px;">
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete Account",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      focusConfirm: false,
      preConfirm: () => {
        const password = document.getElementById("password").value;
        if (!password) {
          Swal.showValidationMessage("Password is required");
          return false;
        }
        return password;
      },
    });

    if (password) {
      try {
        // Show loading
        Swal.fire({
          title: "Deleting Account...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await dispatch(deleteUser({ password })).unwrap();

        // Success message
        await Swal.fire({
          icon: "success",
          title: "Account Deleted",
          text: "Your account has been successfully deleted.",
          confirmButtonColor: "#10b981",
        });

        dispatch(logout());
        navigate("/login");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: error || "Failed to delete account. Please try again.",
          confirmButtonColor: "#10b981",
        });
      }
    }
  };

  if (isLoading && !profile) {
    return (
      <div style={containerStyle}>
        <div style={loadingContainerStyle}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Header Section */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>👤 My Profile</h1>
          <p style={subtitleStyle}>
            Manage your personal information and preferences
          </p>
        </div>

        {/* Profile Info Display */}
        {!isEditing && profile && (
          <div style={profileInfoStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "4rem",
                  height: "4rem",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                {(
                  profile.firstName?.[0] ||
                  profile.username?.[0] ||
                  "U"
                ).toUpperCase()}
              </div>
              <div>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#065f46",
                  }}
                >
                  {profile.firstName && profile.lastName
                    ? `${profile.firstName} ${profile.lastName}`
                    : profile.username}
                </h2>
                <p style={{ margin: "0", color: "#059669", fontWeight: "500" }}>
                  {profile.email}
                </p>
              </div>
            </div>
            {profile.bio && (
              <p
                style={{
                  margin: "0",
                  color: "#374151",
                  fontStyle: "italic",
                  padding: "1rem",
                  background: "white",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1fae5",
                }}
              >
                "{profile.bio}"
              </p>
            )}
          </div>
        )}

        {/* Edit Button */}
        {!isEditing && (
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setIsEditing(true)}
                style={buttonPrimaryStyle}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 15px -3px rgba(16, 185, 129, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 6px -1px rgba(16, 185, 129, 0.3)";
                }}
              >
                ✏️ Edit Profile
              </button>
              <button
                onClick={handleDeleteAccount}
                style={buttonDangerStyle}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 15px -3px rgba(239, 68, 68, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 6px -1px rgba(239, 68, 68, 0.3)";
                }}
              >
                🗑️ Delete Account
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={gridStyle}>
            <div>
              <label htmlFor="username" style={labelStyle}>
                👤 Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                style={isEditing ? inputStyle : inputDisabledStyle}
                onFocus={(e) => {
                  if (isEditing) {
                    Object.assign(e.target.style, inputFocusStyle);
                  }
                }}
                onBlur={(e) => {
                  if (isEditing) {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }
                }}
              />
            </div>

            <div>
              <label htmlFor="email" style={labelStyle}>
                📧 Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                style={isEditing ? inputStyle : inputDisabledStyle}
                onFocus={(e) => {
                  if (isEditing) {
                    Object.assign(e.target.style, inputFocusStyle);
                  }
                }}
                onBlur={(e) => {
                  if (isEditing) {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }
                }}
              />
            </div>

            <div>
              <label htmlFor="firstName" style={labelStyle}>
                👨 First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                style={isEditing ? inputStyle : inputDisabledStyle}
                onFocus={(e) => {
                  if (isEditing) {
                    Object.assign(e.target.style, inputFocusStyle);
                  }
                }}
                onBlur={(e) => {
                  if (isEditing) {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }
                }}
              />
            </div>

            <div>
              <label htmlFor="lastName" style={labelStyle}>
                👤 Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                style={isEditing ? inputStyle : inputDisabledStyle}
                onFocus={(e) => {
                  if (isEditing) {
                    Object.assign(e.target.style, inputFocusStyle);
                  }
                }}
                onBlur={(e) => {
                  if (isEditing) {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }
                }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" style={labelStyle}>
              📝 Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              style={
                isEditing
                  ? textareaStyle
                  : { ...textareaStyle, ...inputDisabledStyle }
              }
              onFocus={(e) => {
                if (isEditing) {
                  Object.assign(e.target.style, inputFocusStyle);
                }
              }}
              onBlur={(e) => {
                if (isEditing) {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }
              }}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div style={buttonGroupStyle}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...buttonPrimaryStyle,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  flex: "1",
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 8px 15px -3px rgba(16, 185, 129, 0.4)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 4px 6px -1px rgba(16, 185, 129, 0.3)";
                  }
                }}
              >
                {isLoading ? "💾 Saving..." : "💾 Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{ ...buttonSecondaryStyle, flex: "1" }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 15px -3px rgba(107, 114, 128, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 6px -1px rgba(107, 114, 128, 0.3)";
                }}
              >
                ❌ Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
