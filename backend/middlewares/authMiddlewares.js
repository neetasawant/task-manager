const jwt = require('jsonwebtoken');

module.exports = function (requiredRole) {
  return function (req, res, next) {
    // Extract the token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token after "Bearer"
    console.log(token, "token");

    if (!token) {
      console.log('Authorization header missing or incorrect'); // Logging for debugging
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded); // Debugging line to check the decoded token
      req.user = decoded; // Attach the decoded user info to the request object

      // Check if the user has the required role
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ msg: 'Access denied, insufficient role' });
      }

      next(); // Continue to the next middleware or route
    } catch (err) {
      console.error('Error verifying token:', err.message); // Log the error message
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
};
