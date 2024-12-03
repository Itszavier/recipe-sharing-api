/** @format */

import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { AvailablePermissions } from "./permissions";

dotenv.config();

export async function encryptPassword(
  password: string,
  salt: number = 9
): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function comparePassword(
  password: string,
  encrypted: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, encrypted);
  return isMatch;
}

export function generateToken(
  userId: string,
  permissions: string[],
  expiresIn: string = "5h"
): string {
  // Define the payload with the user ID
  const payload = {
    userId: userId,
    permissions,
  };

  // Sign the token with the payload and secret key, setting an expiration time (optional)
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn,
  }); // Expires in 1 hour

  return token;
}

export function verifyToken(
  token: string
): { userId: string; permissions: string[] } | null {
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      userId: string;
      permissions: string[];
    };
    return decoded; // Return the decoded token data (userId and permissions)
  } catch (err) {
    return null; // Return null if verification fails
  }
}
