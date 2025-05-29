import React from 'react';
import { Link, Navigate } from 'react-router';
import { useSelector } from 'react-redux';

const LandingPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const gradientStyle = {
    background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
    minHeight: '100vh'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };

  const buttonPrimaryStyle = {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '0.75rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
    transform: 'translateY(0)',
    fontSize: '1.125rem'
  };

  const buttonSecondaryStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '0.75rem',
    fontWeight: '600',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '1.125rem'
  };

  return (
    <div style={gradientStyle}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', height: '4rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '2rem' }}>🍽️</span>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>MealPrepMate</h1>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link
                to="/login"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  background: 'white',
                  color: '#10b981',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 15px -3px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', marginBottom: '1rem', display: 'block' }}>👨‍🍳</span>
            <h1 style={{
              fontSize: '3.75rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1.5rem',
              lineHeight: '1.1',
              margin: 0
            }}>
              Cook Smart with
              <span style={{
                display: 'block',
                background: 'linear-gradient(to right, #fbbf24, #f97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                AI-Powered Recipes
              </span>
            </h1>
          </div>
          
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '3rem',
            maxWidth: '48rem',
            margin: '0 auto 3rem auto',
            lineHeight: '1.7'
          }}>
            Transform your available ingredients into delicious meals! Our AI chef creates personalized recipes 
            based on what's in your kitchen. No more food waste, just amazing flavors.
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '4rem'
          }}>
            <Link
              to="/register"
              style={{
                ...buttonPrimaryStyle,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 20px 25px -5px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(16, 185, 129, 0.3)';
              }}
            >
              <span>🚀</span>
              <span>Start Cooking Now</span>
            </Link>
            <Link
              to="/login"
              style={{
                ...buttonSecondaryStyle,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <span>👋</span>
              <span>Welcome Back</span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginTop: '5rem'
        }}>
          <div style={{ ...cardStyle, padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>AI-Powered Recipes</h3>
            <p style={{ color: '#6b7280' }}>Our smart AI analyzes your ingredients and creates unique, delicious recipes tailored just for you.</p>
          </div>
          
          <div style={{ ...cardStyle, padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥗</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>Reduce Food Waste</h3>
            <p style={{ color: '#6b7280' }}>Use up ingredients before they expire. Turn leftovers into gourmet meals with creative combinations.</p>
          </div>
          
          <div style={{ ...cardStyle, padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>Quick & Easy</h3>
            <p style={{ color: '#6b7280' }}>Get instant recipe suggestions in seconds. From quick snacks to elaborate dinners, we've got you covered.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '4rem 0'
      }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', textAlign: 'center', padding: '0 1rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>Ready to Transform Your Cooking?</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '2rem', fontSize: '1.125rem' }}>Join thousands of home cooks who are already creating amazing meals with AI assistance.</p>
          <Link
            to="/register"
            style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.125rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 20px 25px -5px rgba(249, 115, 22, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 15px -3px rgba(249, 115, 22, 0.3)';
            }}
          >
            <span>✨</span>
            <span>Join MealPrepMate Today</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;