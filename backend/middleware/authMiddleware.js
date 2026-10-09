
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied. Token required");
  }

  try {
    console.log("Middleware JWT secret loaded:", Boolean(process.env.JWT_SECRET));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send("Invalid or expired token");
  }
};

module.exports = authMiddleware;