import React from 'react';

const LuxuryButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyle = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    borderRadius: '1rem',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    textDecoration: 'none',
    fontFamily: 'Inter, sans-serif',
    letterSpacing: '-0.025em'
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.4)'
    },
    gold: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      boxShadow: '0 10px 25px -5px rgba(240, 147, 251, 0.4)'
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'white',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    }
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
    xl: { padding: '1.25rem 2.5rem', fontSize: '1.25rem' }
  };

  const buttonStyle = {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size],
    opacity: disabled ? 0.6 : 1
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      className={`luxury-button ${className}`}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = variants[variant].boxShadow?.replace('0.4)', '0.6)') || '0 15px 35px -5px rgba(0, 0, 0, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = variants[variant].boxShadow || '0 10px 25px -5px rgba(0, 0, 0, 0.2)';
        }
      }}
      {...props}
    >
      <span style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </span>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transition: 'left 0.5s ease'
        }}
        className="shimmer-effect"
      />
    </button>
  );
};

export default LuxuryButton;