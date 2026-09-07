import argon2 from "argon2";
import jwt from "jsonwebtoken";

import {
  findUserByEmail,
  findUserById,
  createUser,
} from "./auth.repository.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export const registerUser = async ({
  name,
  email,
  password,
  role = "SALES",
}) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await argon2.hash(password);

  const user = await createUser({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatches = await argon2.verify(user.password, password);

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
