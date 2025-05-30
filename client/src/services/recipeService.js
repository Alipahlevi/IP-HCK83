import api from './api';

const recipeService = {
  searchRecipes: async (ingredients) => {
    const response = await api.get(`/recipes/search?ingredients=${encodeURIComponent(ingredients)}`);
    return response.data;
  },

  getAllRecipes: async () => {
    const response = await api.get('/recipes');
    return response.data;
  },
};

export default recipeService;