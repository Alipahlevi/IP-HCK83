# MealPrepMate API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow this general structure:
```json
{
  "message": "string",
  "data": "object|array",
  "error": "string (in case of errors)"
}
```

---

## User Management Endpoints

### 1. User Registration
**POST** `/api/users/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "string (required)",
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string"
  },
  "token": "string"
}
```

**Error Responses:**
- `400`: Missing required fields
- `500`: Email already exists or server error

---

### 2. User Login
**POST** `/api/users/login`

Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "bio": "string",
    "profilePicture": "string"
  },
  "token": "string"
}
```

**Error Responses:**
- `400`: Missing email or password
- `401`: Invalid credentials

---

### 3. Google OAuth Login
**POST** `/api/users/google-login`

Authenticate user using Google OAuth ID token.

**Request Body:**
```json
{
  "id_token": "string (required)"
}
```

**Response (200/201):**
- `200`: Login successful via Google (existing user)
- `201`: User registered successfully via Google (new user)

```json
{
  "message": "Login successful via Google",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "profilePicture": "string"
  },
  "token": "string"
}
```

**Error Responses:**
- `500`: Invalid Google token or server error

---

### 4. Discord OAuth Login
**POST** `/api/users/discord-login`

Authenticate user using Discord OAuth access token.

**Request Body:**
```json
{
  "access_token": "string (required)"
}
```

**Response (200/201):**
- `200`: Login successful via Discord (existing user)
- `201`: User registered successfully via Discord (new user)

```json
{
  "message": "Login successful via Discord",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "profilePicture": "string"
  },
  "token": "string"
}
```

**Error Responses:**
- `400`: Missing access token
- `500`: Discord API error or server error

---

### 5. Get User Profile
**GET** `/api/users/profile`

Get authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "bio": "string",
    "profilePicture": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Error Responses:**
- `401`: Invalid or missing token
- `404`: User not found

---

### 6. Update User Profile
**PUT** `/api/users/profile`

Update authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "username": "string (optional)",
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "bio": "string (optional)",
  "profilePicture": "string (optional)"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "bio": "string",
    "profilePicture": "string",
    "updatedAt": "string"
  }
}
```

**Error Responses:**
- `401`: Invalid or missing token
- `404`: User not found

---

### 7. Update Password
**PUT** `/api/users/password`

Update authenticated user's password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required)"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

**Error Responses:**
- `400`: Missing passwords or incorrect current password
- `401`: Invalid or missing token
- `404`: User not found

---

### 8. Delete User Account
**DELETE** `/api/users/profile`

Delete authenticated user's account.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "message": "Account deleted successfully"
}
```

**Error Responses:**
- `400`: Missing password or incorrect password
- `401`: Invalid or missing token
- `404`: User not found

---

## Recipe Management Endpoints

### 9. Search Recipes
**GET** `/api/recipes/search?ingredients=<ingredients>`

Search for recipes based on ingredients using AI generation and database lookup.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `ingredients`: Comma-separated list of ingredients (required)

**Example:**
```
GET /api/recipes/search?ingredients=chicken,rice,vegetables
```

**Response (200):**
```json
{
  "recipes": [
    {
      "id": "string",
      "title": "string",
      "ingredients": "string",
      "instructions": "string",
      "source": "string",
      "cuisine": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "source": "string (database|ai_full|dynamic_sample)",
  "debug": {
    "mode": "string",
    "timestamp": "string"
  }
}
```

**Error Responses:**
- `400`: Missing ingredients parameter
- `401`: Invalid or missing token
- `500`: Server error

---

### 10. Get Recipe by ID
**GET** `/api/recipes/:id`

Get detailed information about a specific recipe.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "recipe": {
    "id": "number",
    "title": "string",
    "ingredients": "string",
    "instructions": "string",
    "source": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Error Responses:**
- `401`: Invalid or missing token
- `404`: Recipe not found

---

### 11. Get All Recipes (Paginated)
**GET** `/api/recipes?page=<page>&limit=<limit>`

Get all recipes with pagination.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response (200):**
```json
{
  "recipes": [
    {
      "id": "number",
      "title": "string",
      "ingredients": "string",
      "instructions": "string",
      "source": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "totalCount": "number",
  "currentPage": "number",
  "totalPages": "number"
}
```

**Error Responses:**
- `401`: Invalid or missing token

---

### 12. Create Recipe
**POST** `/api/recipes`

Create a new recipe.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string (required)",
  "ingredients": "string (required)",
  "instructions": "string (required)"
}
```

**Response (201):**
```json
{
  "message": "Recipe created successfully",
  "recipe": {
    "id": "number",
    "title": "string",
    "ingredients": "string",
    "instructions": "string",
    "source": "User-Created",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Error Responses:**
- `400`: Missing required fields
- `401`: Invalid or missing token

---

### 13. Update Recipe
**PUT** `/api/recipes/:id`

Update an existing recipe.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string (optional)",
  "ingredients": "string (optional)",
  "instructions": "string (optional)"
}
```

**Response (200):**
```json
{
  "message": "Recipe updated successfully",
  "recipe": {
    "id": "number",
    "title": "string",
    "ingredients": "string",
    "instructions": "string",
    "source": "string",
    "updatedAt": "string"
  }
}
```

**Error Responses:**
- `401`: Invalid or missing token
- `404`: Recipe not found

---

## Meal Plan Management Endpoints

### 14. Create/Update Meal Plan
**POST** `/api/meal-plans`

Create a new meal plan or update existing meal plan for a specific day.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "day": "string (required)", // e.g., "monday", "tuesday", etc.
  "recipeId": "number (required)"
}
```

**Response (200/201):**
- `200`: Meal plan updated successfully (if already exists)
- `201`: Meal plan created successfully (if new)

```json
{
  "message": "Meal plan created successfully",
  "mealPlan": {
    "id": "number",
    "day": "string",
    "UserId": "number",
    "RecipeId": "number",
    "Recipe": {
      "id": "number",
      "title": "string",
      "ingredients": "string",
      "instructions": "string"
    }
  }
}
```

**Error Responses:**
- `400`: Missing day or recipeId
- `401`: Invalid or missing token
- `404`: Recipe not found

---

### 15. Get User Meal Plans
**GET** `/api/meal-plans`

Get all meal plans for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "mealPlans": [
    {
      "id": "number",
      "day": "string",
      "UserId": "number",
      "RecipeId": "number",
      "Recipe": {
        "id": "number",
        "title": "string",
        "ingredients": "string",
        "instructions": "string"
      }
    }
  ]
}
```

**Error Responses:**
- `401`: Invalid or missing token

---

### 16. Delete Meal Plan
**DELETE** `/api/meal-plans/:id`

Delete a specific meal plan.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Meal plan deleted successfully"
}
```

**Error Responses:**
- `401`: Invalid or missing token
- `404`: Meal plan not found

---

## Health Check Endpoint

### 17. Health Check
**GET** `/health`

Check if the server is running.

**Response (200):**
```json
{
  "status": "OK",
  "message": "MealPrepMate Server is running!"
}
```

---

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "message": "Error description"
}
```

**401 Unauthorized:**
```json
{
  "message": "Access token required" // or "Invalid token"
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Internal server error",
  "error": "Error details (in development mode)"
}
```

---

## Data Models

### User Model
```json
{
  "id": "number (auto-generated)",
  "username": "string",
  "email": "string",
  "password": "string (hashed)",
  "firstName": "string (optional)",
  "lastName": "string (optional)", 
  "bio": "string (optional)",
  "profilePicture": "string (optional)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Recipe Model
```json
{
  "id": "number (auto-generated)",
  "title": "string",
  "ingredients": "string",
  "instructions": "string",
  "source": "string (database|AI Generated|User-Created)",
  "cuisine": "string (optional)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### MealPlan Model
```json
{
  "id": "number (auto-generated)",
  "day": "string",
  "UserId": "number (foreign key)",
  "RecipeId": "number (foreign key)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## Environment Variables Required

```env
# Database
DATABASE_URL=your_database_url

# JWT Secret
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Discord OAuth
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# AI Integration
GEMINI_API_KEY=your_gemini_api_key

# Server
PORT=3000
```

---

## Rate Limiting & Performance Notes

- Recipe search with AI generation may take 2-3 seconds due to AI processing
- AI recipe generation has built-in delays to prevent API rate limiting
- Database queries are optimized with proper indexing
- Pagination is implemented for large data sets

---

## Authentication Flow

1. **Register/Login**: User gets JWT token
2. **Include Token**: Send token in Authorization header for protected routes
3. **Token Validation**: Server validates token on each request
4. **Auto-expiry**: Tokens expire based on JWT_SECRET configuration

## OAuth Integration

### Google OAuth Flow:
1. Frontend gets ID token from Google
2. Send ID token to `/api/users/google-login`
3. Server verifies token with Google
4. Creates/logs in user and returns JWT

### Discord OAuth Flow:
1. Frontend gets access token from Discord
2. Send access token to `/api/users/discord-login`
3. Server fetches user data from Discord API
4. Creates/logs in user and returns JWT
