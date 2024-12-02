/** @format */

import { PrismaClient} from "@prisma/client";

// Extend the global namespace to include __prisma with the correct type.
declare global {
  var __prisma: PrismaClient;
}

// Check if the global variable __prisma already exists
if (!global.__prisma) {
  // Initialize PrismaClient only if it's not already initialized
  global.__prisma = new PrismaClient();
}

// Connect to the database
global.__prisma.$connect();

// Export the global prisma instance
export const prisma: PrismaClient = global.__prisma as PrismaClient;


