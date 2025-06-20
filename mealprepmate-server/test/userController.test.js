const request = require('supertest');

// Mock Discord OAuth2 dengan cara yang benar
const mockDiscordInstance = {
  getUser: jest.fn()
};

jest.mock('discord-oauth2', () => {
  return jest.fn().mockImplementation(() => mockDiscordInstance);
});

// Mock Google OAuth2Client
jest.mock('google-auth-library');

// Sekarang require app dan dependencies lainnya
const app = require('../app');
const { User } = require('../models');
const { hashPassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { OAuth2Client } = require('google-auth-library');
const DiscordOauth2 = require('discord-oauth2');

describe('User Controller', () => {
  beforeEach(async () => {
    await User.destroy({ where: {}, force: true });
  });

  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.token).toBeDefined();
    });

    it('should handle duplicate email registration', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      await User.create({
        ...userData,
        password: hashPassword(userData.password)
      });

      const response = await request(app)
        .post('/api/users/register')
        .send(userData);

      // Should return 400 for database constraint violation (not 500)
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Data already exists');
    });

    it('should handle missing fields in register', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required');
    });

    it('should handle missing username', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required');
    });

    it('should handle missing email', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required');
    });

    it('should handle missing password', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({ username: 'testuser', email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required');
    });
  });

  describe('POST /api/users/login', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashPassword('password123')
      });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
    });

    it('should handle incorrect password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should handle non-existent email', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should handle missing email', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({ password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password are required');
    });

    it('should handle missing password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password are required');
    });

    it('should handle missing both email and password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password are required');
    });
  });

  describe('GET /api/users/profile', () => {
    let testUser;
    let token;

    beforeEach(async () => {
      testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashPassword('password123'),
        firstName: 'Test',
        lastName: 'User',
        bio: 'Test bio'
      });
      token = signToken({ id: testUser.id, email: testUser.email });
    });

    it('should get user profile successfully', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile retrieved successfully');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.password).toBeUndefined();
    });

    it('should handle missing authorization header', async () => {
      const response = await request(app)
        .get('/api/users/profile');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Access token required'); // Fixed: removed 'is'
    });

    it('should handle invalid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token');
    });

    it('should handle malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'InvalidFormat');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Access token required'); // Fixed: removed 'is'
    });
  });

  describe('PUT /api/users/profile', () => {
    let testUser;
    let token;

    beforeEach(async () => {
      testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashPassword('password123')
      });
      token = signToken({ id: testUser.id, email: testUser.email });
    });

    it('should update profile successfully', async () => {
      const updateData = {
        username: 'updateduser',
        firstName: 'Updated',
        lastName: 'User',
        bio: 'Updated bio'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile updated successfully');
      expect(response.body.user.username).toBe(updateData.username);
      expect(response.body.user.firstName).toBe(updateData.firstName);
    });

    it('should update only provided fields', async () => {
      const updateData = { firstName: 'OnlyFirst' };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.user.firstName).toBe('OnlyFirst');
      expect(response.body.user.username).toBe('testuser');
    });

    it('should handle empty update data', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile updated successfully');
    });

    it('should update profilePicture', async () => {
      const updateData = { profilePicture: 'https://example.com/avatar.jpg' };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.user.profilePicture).toBe(updateData.profilePicture);
    });

    it('should handle null values for optional fields', async () => {
      const updateData = {
        firstName: null,
        lastName: null,
        bio: null,
        profilePicture: null
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.user.firstName).toBeNull();
      expect(response.body.user.lastName).toBeNull();
    });
  });

  describe('PUT /api/users/password', () => {
    let testUser;
    let token;

    beforeEach(async () => {
      testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashPassword('password123')
      });
      token = signToken({ id: testUser.id, email: testUser.email });
    });

    it('should update password successfully', async () => {
      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password updated successfully');
    });

    it('should handle incorrect current password', async () => {
      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Current password is incorrect');
    });

    it('should handle missing current password', async () => {
      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ newPassword: 'newpassword123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Current password and new password are required');
    });

    it('should handle missing new password', async () => {
      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Current password and new password are required');
    });

    it('should handle missing both passwords', async () => {
      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Current password and new password are required');
    });
  });

  describe('POST /api/users/google-login', () => {
    let mockVerifyIdToken;
    let mockGetPayload;
    let originalEnv;
  
    beforeEach(() => {
      // Save original environment
      originalEnv = process.env.GOOGLE_CLIENT_ID;
      process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
      
      mockGetPayload = jest.fn();
      mockVerifyIdToken = jest.fn();
      
      // Mock the verifyIdToken method directly on the OAuth2Client prototype
      jest.spyOn(require('google-auth-library').OAuth2Client.prototype, 'verifyIdToken')
        .mockImplementation(mockVerifyIdToken);
    });
  
    afterEach(() => {
      // Restore original environment
      process.env.GOOGLE_CLIENT_ID = originalEnv;
      jest.restoreAllMocks();
    });
  
    it('should register new user via Google successfully', async () => {
      const mockGoogleUser = {
        email: 'google@example.com',
        name: 'Google User',
        given_name: 'Google',
        family_name: 'User',
        picture: 'https://example.com/picture.jpg'
      };
  
      mockGetPayload.mockReturnValue(mockGoogleUser);
      mockVerifyIdToken.mockResolvedValue({ getPayload: mockGetPayload });
  
      const response = await request(app)
        .post('/api/users/google-login')
        .send({ id_token: 'valid_google_token' });
  
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully via Google');
      expect(response.body.user.email).toBe(mockGoogleUser.email);
      expect(response.body.token).toBeDefined();
    });
  
    it('should login existing user via Google successfully', async () => {
      const existingUser = await User.create({
        username: 'existinguser',
        email: 'existing@example.com',
        password: hashPassword('password123')
      });
  
      const mockGoogleUser = {
        email: 'existing@example.com',
        name: 'Existing User',
        given_name: 'Existing',
        family_name: 'User'
      };
  
      mockGetPayload.mockReturnValue(mockGoogleUser);
      mockVerifyIdToken.mockResolvedValue({ getPayload: mockGetPayload });
  
      const response = await request(app)
        .post('/api/users/google-login')
        .send({ id_token: 'valid_google_token' });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful via Google');
      expect(response.body.user.email).toBe(existingUser.email);
    });
  
    it('should handle Google user without name', async () => {
      const mockGoogleUser = {
        email: 'noname@example.com'
        // No name field provided
      };
  
      mockGetPayload.mockReturnValue(mockGoogleUser);
      mockVerifyIdToken.mockResolvedValue({ getPayload: mockGetPayload });
  
      const response = await request(app)
        .post('/api/users/google-login')
        .send({ id_token: 'valid_google_token' });
  
      expect(response.status).toBe(201);
      expect(response.body.user.username).toBe('noname'); // Should use email prefix
      expect(response.body.user.firstName).toBe('');
      expect(response.body.user.lastName).toBe('');
    });
  
    it('should handle Google user with minimal data', async () => {
      const mockGoogleUser = {
        email: 'minimal@example.com',
        name: 'Minimal User'
        // No given_name, family_name, or picture
      };
  
      mockGetPayload.mockReturnValue(mockGoogleUser);
      mockVerifyIdToken.mockResolvedValue({ getPayload: mockGetPayload });
  
      const response = await request(app)
        .post('/api/users/google-login')
        .send({ id_token: 'valid_google_token' });
  
      expect(response.status).toBe(201);
      expect(response.body.user.firstName).toBe(''); // Should be empty string when given_name is missing
      expect(response.body.user.lastName).toBe(''); // Should be empty string when family_name is missing
      expect(response.body.user.profilePicture).toBeNull(); // Should be null when picture is missing
    });
  });

  describe('DELETE /api/users/profile', () => {
    let testUser;
    let token;

    beforeEach(async () => {
      testUser = await User.create({
        username: 'testuser_delete',
        email: 'delete@example.com',
        password: hashPassword('password123')
      });
      token = signToken({ id: testUser.id, email: testUser.email });
    });

    it('should delete account successfully', async () => {
      const response = await request(app)
        .delete('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Account deleted successfully');

      const deletedUser = await User.findByPk(testUser.id);
      expect(deletedUser).toBeNull();
    });

    it('should handle missing password', async () => {
      const response = await request(app)
        .delete('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Password is required to delete account');
    });

    it('should handle incorrect password', async () => {
      const response = await request(app)
        .delete('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ password: 'wrongpassword' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Incorrect password');
    });

    it('should handle unauthorized deletion attempt', async () => {
      const response = await request(app)
        .delete('/api/users/profile')
        .send({ password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Access token required'); // Fixed: removed 'is'
    });

    it('should handle invalid token for deletion', async () => {
      const response = await request(app)
        .delete('/api/users/profile')
        .set('Authorization', 'Bearer invalid_token')
        .send({ password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle database connection errors during registration', async () => {
      const originalCreate = User.create;
      User.create = jest.fn().mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(500);

      User.create = originalCreate;
    });

    it('should handle database errors during login', async () => {
      const originalFindOne = User.findOne;
      User.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(500);

      User.findOne = originalFindOne;
    });

    it('should handle very long input strings', async () => {
      const longString = 'a'.repeat(1000);
      
      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: longString,
          email: 'test@example.com',
          password: 'password123'
        });

      expect([201, 400, 500]).toContain(response.status);
    });

    it('should handle special characters in input', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: 'test<script>alert("xss")</script>',
          email: 'test+special@example.com',
          password: 'password!@#$%^&*()'
        });

      expect([201, 400, 500]).toContain(response.status);
    });

    it('should handle concurrent registration attempts', async () => {
      const userData = {
        username: 'concurrent',
        email: 'concurrent@example.com',
        password: 'password123'
      };

      const promises = Array(3).fill().map(() => 
        request(app)
          .post('/api/users/register')
          .send(userData)
      );

      const responses = await Promise.all(promises);
      
      const successCount = responses.filter(r => r.status === 201).length;
      expect(successCount).toBe(1);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});

// Tambahkan di bagian atas file
describe('POST /api/users/discord-login', () => {
  beforeEach(async () => {
    await User.destroy({ where: {}, force: true });
    jest.clearAllMocks();
  });

  it('should register new user via Discord successfully', async () => {
    const mockDiscordUser = {
      id: '123456789',
      username: 'discorduser',
      email: 'discord@example.com',
      global_name: 'Discord User',
      avatar: 'avatar123'
    };

    mockDiscordInstance.getUser.mockResolvedValue(mockDiscordUser);

    const response = await request(app)
      .post('/api/users/discord-login')
      .send({ access_token: 'valid_discord_token' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully via Discord');
    expect(response.body.user.email).toBe(mockDiscordUser.email);
    expect(response.body.token).toBeDefined();
    expect(mockDiscordInstance.getUser).toHaveBeenCalledWith('valid_discord_token');
  });
  
  it('should login existing user via Discord successfully', async () => {
    const existingUser = await User.create({
      username: 'existinguser',
      email: 'existing@example.com',
      password: hashPassword('password123')
    });

    const mockDiscordUser = {
      id: '123456789',
      username: 'existinguser',
      email: 'existing@example.com',
      global_name: 'Existing User'
    };

    mockDiscordInstance.getUser.mockResolvedValue(mockDiscordUser);

    const response = await request(app)
      .post('/api/users/discord-login')
      .send({ access_token: 'valid_discord_token' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful via Discord');
    expect(response.body.user.email).toBe(existingUser.email);
    expect(mockDiscordInstance.getUser).toHaveBeenCalledWith('valid_discord_token');
  });

  it('should handle missing access token', async () => {
    const response = await request(app)
      .post('/api/users/discord-login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Discord access token is required');
  });

  it('should handle Discord API errors', async () => {
    mockDiscordInstance.getUser.mockRejectedValue(new Error('Discord API error'));

    const response = await request(app)
      .post('/api/users/discord-login')
      .send({ access_token: 'invalid_token' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error during Discord Login');
    expect(mockDiscordInstance.getUser).toHaveBeenCalledWith('invalid_token');
  });
});
