/** @format */

import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

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

export function generateToken(userId: string): string {
  // Define the payload with the user ID
  const payload = {
    userId: userId, // Add any other claims you need here
  };

  // Sign the token with the payload and secret key, setting an expiration time (optional)
  const token = jwt.sign(payload, process.env.JWT_SECRECT as string, {
    expiresIn: "1h",
  }); // Expires in 1 hour

  return token;
}
