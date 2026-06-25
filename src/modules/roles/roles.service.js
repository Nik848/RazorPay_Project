import { eq } from "drizzle-orm";

import { db } from "../../config/db.js";
import { users } from "../../schema/users.schema.js";
import { AppError } from "../../utils/AppError.js";

export const assignRoleService = async (userId,role)=>{
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new AppError("User not found",404);
  }

  await db
    .update(users)
    .set({
      role,
    })
    .where(eq(users.id, userId));

  return {
    message: "Role assigned successfully",
  };
};