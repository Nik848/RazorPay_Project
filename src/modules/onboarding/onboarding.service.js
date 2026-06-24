import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "../../config/db.js";
import { users } from "../../schema/users.schema.js";

export const registerUser = async ({ name, email, password }) => {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    passwordHash,
    role: "EMP",
  });

  return {
    message: "User registered successfully",
  };
};

export const loginUser = async ({ email, password }) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};