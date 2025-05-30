const { User } = require("../models");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
const DiscordOauth2 = require("discord-oauth2");

const client = new OAuth2Client();
const discord = new DiscordOauth2();

class UserController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const hashedPassword = hashPassword(password);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      const token = signToken({ id: user.id, email: user.email });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await User.findOne({ where: { email } });

      if (!user || !comparePassword(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = signToken({ id: user.id, email: user.email });

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          profilePicture: user.profilePicture,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET - Ambil profile user
  static async getProfile(req, res, next) {
    try {
      const userId = req.user.id; // Dari middleware authentication

      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] }, // Jangan return password
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile retrieved successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          profilePicture: user.profilePicture,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT - Update profile user
  static async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const { username, firstName, lastName, bio, profilePicture } = req.body;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update data yang diberikan
      const updateData = {};
      if (username) updateData.username = username;
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (bio !== undefined) updateData.bio = bio;
      if (profilePicture !== undefined)
        updateData.profilePicture = profilePicture;

      await user.update(updateData);

      res.json({
        message: "Profile updated successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          profilePicture: user.profilePicture,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT - Update password
  static async updatePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Current password and new password are required",
        });
      }

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      if (!comparePassword(currentPassword, user.password)) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedNewPassword = hashPassword(newPassword);

      await user.update({ password: hashedNewPassword });

      res.json({
        message: "Password updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { id_token } = req.body;
      console.log("📥 Received id_token:", id_token?.slice(0, 30)); // log sebagian token
      console.log("🔑 Loaded GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

      // Verify the Google ID token
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID, // Gunakan environment variable
      });

      const payload = ticket.getPayload();
      console.log("✅ Google payload:", payload);

      // Check if user already exists
      let user = await User.findOne({ where: { email: payload.email } });

      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          username: payload.name || payload.email.split("@")[0],
          email: payload.email,
          password: hashPassword(Math.random().toString(36).slice(-8)), // Random password
          firstName: payload.given_name || "",
          lastName: payload.family_name || "",
          profilePicture: payload.picture || null,
        });

        const token = signToken({ id: user.id, email: user.email });

        return res.status(201).json({
          message: "User registered successfully via Google",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture,
          },
          token,
        });
      }

      // User exists, just login
      const token = signToken({ id: user.id, email: user.email });

      res.status(200).json({
        message: "Login successful via Google",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          profilePicture: user.profilePicture,
        },
        token,
      });
    } catch (error) {
      console.error("Google login error:", error);
      res.status(500).json({
        message: "Internal Server Error during Google Login",
        detail: error.message,
      });
      next(error);
    }
  }

  // DELETE - Delete user account
  static async deleteUser(req, res, next) {
    try {
      const userId = req.user.id;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          message: "Password is required to delete account",
        });
      }

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify password before deletion
      if (!comparePassword(password, user.password)) {
        return res.status(400).json({
          message: "Incorrect password",
        });
      }

      // Delete user account
      await user.destroy();

      res.json({
        message: "Account deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Discord Login
  static async discordLogin(req, res, next) {
    try {
      const { access_token } = req.body;

      if (!access_token) {
        return res.status(400).json({
          message: "Discord access token is required",
        });
      }

      // Get user info from Discord
      const discordUser = await discord.getUser(access_token);
      console.log("✅ Discord user:", discordUser);

      // Check if user already exists
      let user = await User.findOne({ where: { email: discordUser.email } });

      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          username:
            discordUser.username ||
            discordUser.global_name ||
            `discord_${discordUser.id}`,
          email: discordUser.email,
          password: hashPassword(Math.random().toString(36).slice(-8)), // Random password
          firstName: discordUser.global_name
            ? discordUser.global_name.split(" ")[0]
            : "",
          lastName: discordUser.global_name
            ? discordUser.global_name.split(" ").slice(1).join(" ")
            : "",
          profilePicture: discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : null,
        });

        const token = signToken({ id: user.id, email: user.email });

        return res.status(201).json({
          message: "User registered successfully via Discord",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture,
          },
          token,
        });
      }

      // User exists, just login
      const token = signToken({ id: user.id, email: user.email });

      res.status(200).json({
        message: "Login successful via Discord",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          profilePicture: user.profilePicture,
        },
        token,
      });
    } catch (error) {
      console.error("Discord login error:", error);
      res.status(500).json({
        message: "Internal Server Error during Discord Login",
        detail: error.message,
      });
      next(error);
    }
  }
}

module.exports = UserController;
