import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  // Some clients (PowerShell Invoke-RestMethod) may supply headers in different shapes.
  const authHeader = req.headers.authorization;
  const token = typeof authHeader === "string" ? authHeader.split(" ")[1] : undefined;

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token found." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
