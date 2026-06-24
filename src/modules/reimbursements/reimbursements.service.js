import { db } from "../../config/db.js";

import { reimbursements } from "../../schema/reimbursements.schema.js";

import { reimbursementStatus } from "../../schema/reimbursement-status.schema.js";

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