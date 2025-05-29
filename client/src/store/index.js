import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import recipeSlice from './slices/recipeSlice';
import userSlice from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    recipe: recipeSlice,
    user: userSlice,
  },
});

export default store;