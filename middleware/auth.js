const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");

// Protect routes
exports.authenticate = (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const parserTokens = req.headers.authorization.split("Bearer ");
      token = parserTokens[1];
    }
    // Make sure token exists
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Not authorized",
    });
  }
};
