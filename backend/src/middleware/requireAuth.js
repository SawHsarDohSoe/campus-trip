import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(request, response, next) {
  try {
    const authorization = request.headers.authorization;
    const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;

    if (!token) {
      return response.status(401).json({ message: "Authentication is required." });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId);

    if (!user) {
      return response.status(401).json({ message: "This user no longer exists." });
    }

    request.user = user;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return response.status(401).json({ message: "Your session is invalid or has expired." });
    }

    return next(error);
  }
}
