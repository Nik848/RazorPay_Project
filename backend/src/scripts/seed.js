import bcrypt from "bcrypt";
import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { users } from "../schema/users.schema.js";

const seedDatabase = async () => {
  console.log("Starting database seed...");
  
  // Create a separate database connection specifically for the script
  const queryClient = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(queryClient);

  try {
    // Hash the default password for the CFO
    const passwordHash = await bcrypt.hash("CFO#ORG@April2026", 10);

    console.log("Deleting any existing CFO user...");
    await db.delete(users).where(eq(users.email, "cfo@org.com"));

    console.log("Creating default CFO user...");
    await db.insert(users).values({
      name: "Chief Financial Officer",
      email: "cfo@org.com",
      passwordHash: passwordHash,
      role: "CFO",
    });
    
    console.log("Seed successful! You can now log in as the CFO.");
  } catch (error) {
    // If we run this twice, PostgreSQL will throw a unique constraint error (23505) because of the email
    if (error.code === '23505') {
      console.log("CFO user already exists in the database. Seed skipped.");
    } else {
      console.error("Error seeding database:", error);
    }
  } finally {
    // Close the connection so the script exits automatically
    await queryClient.end();
  }
};

seedDatabase();
