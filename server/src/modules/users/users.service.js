import argon2 from "argon2";

import {
  findUserByEmail,
  createUser,
  findAllUsers,
} from "./users.repository.js";

export const createSalesUser = async ({ name, email, password }) => {
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
    role: "SALES",
  });

  return user;
};

export const getAllUsers = async ({ page, limit }) => {
  return await findAllUsers({ page, limit });
};
