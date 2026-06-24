import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { users } from "../schema/users.schema.js";

const seedData = async () => {
  try {
    console.log("🌱 Starting seed...");

    // Seed CFO Admin User
    const cfoUser = {
      name: "CFO Admin",
      email: "cfo@org.com",
      passwordHash: "$2a$10$1r2L3M6aN5cQ4y/2A1V8UON.fE4y8w9g4Q4w4Q4w4Q4w4Q4w4Q4w", // 'cfo123456'
      role: "CFO",
    };

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, cfoUser.email))
      .limit(1);

    if (!existing) {
      await db.insert(users).values(cfoUser);
      console.log("✅ CFO Admin seeded");
    } else {
      console.log("✅ CFO Admin already exists");
    }

    console.log("🎉 Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
