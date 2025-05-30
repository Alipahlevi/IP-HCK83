const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => error.message);
    return res.status(400).json({ message: 'Validation error', errors });
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ message: 'Data already exists' });
  }
  
  res.status(500).json({ message: 'Internal server error' });
};

module.exports = errorHandler;