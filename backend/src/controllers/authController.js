import jwt from "jsonwebtoken";
import User from "../models/User.js";

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  });
}

function sendAuthResponse(response, statusCode, user) {
  const token = createToken(user._id.toString());
  response.status(statusCode).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}

export async function register(request, response, next) {
  try {
    const { name, email, password } = request.body;
    const existingUser = await User.findOne({ email: email?.toLowerCase() });

    if (existingUser) {
      return response.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({ name, email, password });
    return sendAuthResponse(response, 201, user);
  } catch (error) {
    return next(error);
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.isPasswordCorrect(password))) {
      return response.status(401).json({ message: "Email or password is incorrect." });
    }

    return sendAuthResponse(response, 200, user);
  } catch (error) {
    return next(error);
  }
}

export function getCurrentUser(request, response) {
  response.json({
    user: {
      id: request.user._id,
      name: request.user.name,
      email: request.user.email,
    },
  });
}
