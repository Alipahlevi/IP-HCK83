import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import recipeService from '../../services/recipeService';

// Async thunks
export const searchRecipes = createAsyncThunk(
  'recipe/search',
  async (ingredients, { rejectWithValue }) => {
    try {
      const response = await recipeService.searchRecipes(ingredients);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const getAllRecipes = createAsyncThunk(
  'recipe/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await recipeService.getAllRecipes();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recipes');
    }
  }
);

const recipeSlice = createSlice({
  name: 'recipe',
  initialState: {
    recipes: [],
    searchResults: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search recipes
      .addCase(searchRecipes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.recipes || [action.payload.recipe];
      })
      .addCase(searchRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get all recipes
      .addCase(getAllRecipes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipes = action.payload.recipes;
      })
      .addCase(getAllRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults, clearError } = recipeSlice.actions;
export default recipeSlice.reducer;