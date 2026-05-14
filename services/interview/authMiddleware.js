const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // The frontend sends the token directly or prefixed. 
  // Based on monolith, it was expected as the first part of the header.
  const token = authHeader && authHeader.split(' ')[0];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const secret = process.env.JWT_SECRET || "default_scholar_secret_123";
    const decoded = jwt.verify(token, secret);
    req.email = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = protect;
