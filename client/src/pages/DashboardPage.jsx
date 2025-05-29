import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchRecipes, clearSearchResults } from '../store/slices/recipeSlice';
import RecipeCard from '../components/Recipe/RecipeCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const [ingredients, setIngredients] = useState('');
  const dispatch = useDispatch();
  const { searchResults, isLoading, error } = useSelector((state) => state.recipe);
  const { user } = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    if (ingredients.trim()) {
      dispatch(searchRecipes(ingredients.trim()));
    }
  };

  const handleClearResults = () => {
    dispatch(clearSearchResults());
    setIngredients('');
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '1rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    border: '1px solid #f3f4f6'
  };

  const gradientCardStyle = {
    ...cardStyle,
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white'
  };

  const buttonPrimaryStyle = {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.75rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)',
    fontSize: '1rem',
    width: '100%'
  };

  const buttonSecondaryStyle = {
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.75rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.3)',
    fontSize: '1rem'
  };

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Section */}
      <div style={{ ...gradientCardStyle, padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
              <span role="img" aria-label="wave" style={{ marginRight: '0.75rem' }}>👋</span>
              Welcome back, {user?.username || 'Chef'}!
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.125rem', margin: 0 }}>
              Ready to create something delicious? Let's turn your ingredients into amazing meals!
            </p>
          </div>
          <div style={{ fontSize: '4rem', opacity: 0.2 }}>👨‍🍳</div>
        </div>
      </div>

      {/* Search Section */}
      <div style={{ ...cardStyle, padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2rem', marginRight: '0.75rem' }}>🔍</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            Find Recipes by Ingredients
          </h2>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="ingredients" style={{
              display: 'block', fontSize: '0.875rem', fontWeight: '600',
              color: '#374151', marginBottom: '0.75rem'
            }}>
              What ingredients do you have? (separate with commas)
            </label>
            <div style={{ position: 'relative' }}>
              <textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g., chicken, rice, tomatoes, onions..."
                style={{
                  width: '100%', padding: '1rem', border: '2px solid #e5e7eb',
                  borderRadius: '0.75rem', fontSize: '1rem', resize: 'none',
                  fontFamily: 'inherit', outline: 'none'
                }}
                rows="3"
              />
              <div style={{
                position: 'absolute', bottom: '0.75rem', right: '0.75rem',
                fontSize: '0.75rem', color: '#9ca3af'
              }}>
                {ingredients.length}/200
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              type="submit"
              disabled={isLoading || !ingredients.trim()}
              style={{
                ...buttonPrimaryStyle,
                opacity: (isLoading || !ingredients.trim()) ? 0.5 : 1,
                cursor: (isLoading || !ingredients.trim()) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Searching...
                </>
              ) : (
                <>
                  <span>🔍</span>
                  Find Recipes
                </>
              )}
            </button>

            {searchResults.length > 0 && (
              <button
                type="button"
                onClick={handleClearResults}
                style={buttonSecondaryStyle}
              >
                <span>🗑️</span>
                Clear Results
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '0.75rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            <p style={{ fontWeight: '600', margin: 0 }}>Error loading recipes:</p>
            <p style={{ margin: 0, marginTop: '0.25rem' }}>{error}</p>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <LoadingSpinner />
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              margin: 0
            }}>
              <span>🍽️</span>
              Recipe Results
            </h2>
            <div style={{
              background: 'linear-gradient(135deg, #ddd6fe, #c4b5fd)',
              color: '#7c3aed',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              {searchResults.length} recipe{searchResults.length !== 1 ? 's' : ''} found
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {searchResults.map((recipe, index) => (
              <RecipeCard key={recipe.id || index} recipe={recipe} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && searchResults.length === 0 && ingredients && (
        <div style={{
          ...cardStyle,
          padding: '3rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            No recipes found
          </h3>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem'
          }}>
            Try different ingredients or check your spelling
          </p>
        </div>
      )}
    </div>
  );
};

// Add keyframes for loading spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default DashboardPage;
