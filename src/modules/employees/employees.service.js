import { and, eq } from "drizzle-orm";

import { db } from "../../config/db.js";

import { users } from "../../schema/users.schema.js";

import { employeeManagerMapping } from "../../schema/employee-manager.schema.js";

import { AppError } from "../../utils/AppError.js";

import { inArray } from "drizzle-orm";

export const assignEmployeeService = async (
  employeeId,
  managerId
) => {
  const [employee] = await db
    .select()
    .from(users)
    .where(eq(users.id, employeeId))
    .limit(1);

  if (!employee) {
    throw new AppError(
      "Employee not found",
      404
    );
  }

  const [manager] = await db
    .select()
    .from(users)
    .where(eq(users.id, managerId))
    .limit(1);

  if (!manager) {
    throw new AppError(
      "Manager not found",
      404
    );
  }

  if (employee.role !== "EMP") {
    throw new AppError(
      "User must have EMP role",
      400
    );
  }

  if (manager.role !== "RM") {
    throw new AppError(
      "Manager must have RM role",
      400
    );
  }

  const [existingMapping] = await db
    .select()
    .from(employeeManagerMapping)
    .where(
      eq(
        employeeManagerMapping.employeeId,
        employeeId
      )
    )
    .limit(1);

  if (existingMapping) {
    throw new AppError(
      "Employee already assigned to a manager",
      400
    );
  }

  await db
    .insert(employeeManagerMapping)
    .values({
      employeeId,
      managerId,
    });

  return {
    message:
      "Employee assigned successfully",
  };
};

export const unassignEmployeeService =
  async (employeeId, managerId) => {
    const [mapping] = await db
      .select()
      .from(employeeManagerMapping)
      .where(
        and(
          eq(
            employeeManagerMapping.employeeId,
            employeeId
          ),
          eq(
            employeeManagerMapping.managerId,
            managerId
          )
        )
      )
      .limit(1);

    if (!mapping) {
      throw new AppError(
        "Assignment not found",
        404
      );
    }

    await db
      .delete(employeeManagerMapping)
      .where(
        and(
          eq(
            employeeManagerMapping.employeeId,
            employeeId
          ),
          eq(
            employeeManagerMapping.managerId,
            managerId
          )
        )
      );

    return {
      message:
        "Employee unassigned successfully",
    };
  };

export const getEmployeesService = async (
  currentUser
) => {
  /*
    CFO:
    Can see everybody.
  */
  if (currentUser.role === "CFO") {
    const allUsers = await db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users);

    return allUsers;
  }

  /*
    APE:
    Can see EMP and RM only.
  */
  if (currentUser.role === "APE") {
    const visibleUsers = await db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(
        inArray(
          users.role,
          ["EMP", "RM"]
        )
      );

    return visibleUsers;
  }

  /*
    RM:
    Can see only direct subordinates.
  */
  if (currentUser.role === "RM") {
    const subordinates = await db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(employeeManagerMapping)
      .innerJoin(
        users,
        eq(
          users.id,
          employeeManagerMapping.employeeId
        )
      )
      .where(
        eq(
          employeeManagerMapping.managerId,
          currentUser.id
        )
      );

    return subordinates;
  }

  throw new AppError(
    "Access denied",
    403
  );
};