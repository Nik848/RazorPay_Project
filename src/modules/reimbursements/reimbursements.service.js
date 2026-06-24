import { db } from "../../config/db.js";

import { reimbursements } from "../../schema/reimbursements.schema.js";

import { reimbursementStatus } from "../../schema/reimbursement-status.schema.js";

import { eq } from "drizzle-orm";
import { AppError } from "../../utils/AppError.js";

export const createReimbursementService =
  async (
    employeeId,
    payload
  ) => {
    const {
      title,
      description,
      amount,
    } = payload;

    /*
      Step 1:
      Create status row
    */

    const [status] = await db
      .insert(
        reimbursementStatus
      )
      .values({
        rmStatus: "PENDING",
        apeStatus: "PENDING",
        cfoStatus: "PENDING",
      })
      .returning();

    /*
      Step 2:
      Create reimbursement
    */

    const [reimbursement] =
      await db
        .insert(
          reimbursements
        )
        .values({
          employeeId,
          title,
          description,
          amount:
            amount.toString(),
          statusId: status.id,
        })
        .returning();

    return reimbursement;
  };

export const updateReimbursementService =
  async (
    reimbursementId,
    status,
    currentUser
  ) => {
    const [reimbursement] =
      await db
        .select()
        .from(reimbursements)
        .where(
          eq(
            reimbursements.id,
            reimbursementId
          )
        )
        .limit(1);

    if (!reimbursement) {
      throw new AppError(
        "Reimbursement not found",
        404
      );
    }

    const [statusRecord] =
      await db
        .select()
        .from(
          reimbursementStatus
        )
        .where(
          eq(
            reimbursementStatus.id,
            reimbursement.statusId
          )
        )
        .limit(1);

    if (!statusRecord) {
      throw new AppError(
        "Status record not found",
        404
      );
    }

    /*
      RM Approval
    */
    if (currentUser.role === "RM") {
      await db
        .update(
          reimbursementStatus
        )
        .set({
          rmStatus: status,
        })
        .where(
          eq(
            reimbursementStatus.id,
            statusRecord.id
          )
        );

      return {
        message:
          "RM decision recorded",
      };
    }

    /*
      APE Approval
    */
    if (currentUser.role === "APE") {
      if (
        statusRecord.rmStatus !==
        "APPROVED"
      ) {
        throw new AppError(
          "RM approval required first",
          400
        );
      }

      await db
        .update(
          reimbursementStatus
        )
        .set({
          apeStatus: status,
        })
        .where(
          eq(
            reimbursementStatus.id,
            statusRecord.id
          )
        );

      return {
        message:
          "APE decision recorded",
      };
    }

    /*
      CFO Approval
    */
    if (currentUser.role === "CFO") {
      if (
        statusRecord.apeStatus !==
        "APPROVED"
      ) {
        throw new AppError(
          "APE approval required first",
          400
        );
      }

      await db
        .update(
          reimbursementStatus
        )
        .set({
          cfoStatus: status,
        })
        .where(
          eq(
            reimbursementStatus.id,
            statusRecord.id
          )
        );

      return {
        message:
          "CFO decision recorded",
      };
    }

    throw new AppError(
      "Unauthorized",
      403
    );
  };