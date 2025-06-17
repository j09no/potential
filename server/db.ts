import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is missing!");
  console.error("Please add your Neon database URL to the Secrets tool.");
  console.error("Expected format: postgresql://username:password@host/database?sslmode=require");
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Validate the DATABASE_URL format
try {
  new URL(process.env.DATABASE_URL);
  console.log("✅ DATABASE_URL found and valid");
} catch (error) {
  console.error("❌ DATABASE_URL is invalid:", process.env.DATABASE_URL);
  console.error("Expected format: postgresql://username:password@host/database?sslmode=require");
  throw new Error("DATABASE_URL is not a valid URL format");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });