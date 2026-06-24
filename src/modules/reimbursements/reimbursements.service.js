import { db } from "../../config/db.js";

import { reimbursements } from "../../schema/reimbursements.schema.js";

import { reimbursementStatus } from "../../schema/reimbursement-status.schema.js";

import {
  and,
  eq,
} from "drizzle-orm";

import { employeeManagerMapping }
  from "../../schema/employee-manager.schema.js";

import { getFinalStatus }
  from "../../utils/reimbursementStatus.js";

import { AppError }
  from "../../utils/AppError.js";

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
      if (
        statusRecord.rmStatus !==
        "PENDING"
      ) {
        throw new AppError(
          "RM already acted on this reimbursement",
          400
        );
      }

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

export const getReimbursementsService =
  async (currentUser) => {

    /*
      EMP
      Own reimbursements only
    */
    if (currentUser.role === "EMP") {

      const rows = await db
        .select()
        .from(reimbursements);

      const ownRows = rows.filter(
        r => r.employeeId === currentUser.id
      );

      const result = [];

      for (const reimbursement of ownRows) {

        const [status] = await db
          .select()
          .from(reimbursementStatus)
          .where(
            eq(
              reimbursementStatus.id,
              reimbursement.statusId
            )
          )
          .limit(1);

        result.push({
          title: reimbursement.title,
          description:
            reimbursement.description,
          amount: reimbursement.amount,
          status:
            getFinalStatus(status),
        });
      }

      return result;
    }

    /*
      RM
      Pending requests from direct reports
    */
    if (currentUser.role === "RM") {

      const mappings = await db
        .select()
        .from(employeeManagerMapping)
        .where(
          eq(
            employeeManagerMapping.managerId,
            currentUser.id
          )
        );

      const employeeIds =
        mappings.map(
          m => m.employeeId
        );

      const allReimbursements =
        await db
          .select()
          .from(reimbursements);

      const result = [];

      for (const reimbursement of allReimbursements) {

        if (
          !employeeIds.includes(
            reimbursement.employeeId
          )
        ) {
          continue;
        }

        const [status] = await db
          .select()
          .from(reimbursementStatus)
          .where(
            eq(
              reimbursementStatus.id,
              reimbursement.statusId
            )
          )
          .limit(1);

        if (
          status.rmStatus ===
          "PENDING"
        ) {
          result.push({
            reimbursementId:
              reimbursement.id,
            title:
              reimbursement.title,
            description:
              reimbursement.description,
            amount:
              reimbursement.amount,
            status: "PENDING",
          });
        }
      }

      return result;
    }

    /*
      APE
      RM approved
      APE pending
    */
    if (currentUser.role === "APE") {

      const allReimbursements =
        await db
          .select()
          .from(reimbursements);

      const result = [];

      for (const reimbursement of allReimbursements) {

        const [status] = await db
          .select()
          .from(reimbursementStatus)
          .where(
            eq(
              reimbursementStatus.id,
              reimbursement.statusId
            )
          )
          .limit(1);

        if (
          status.rmStatus ===
            "APPROVED" &&
          status.apeStatus ===
            "PENDING"
        ) {
          result.push({
            reimbursementId:
              reimbursement.id,
            title:
              reimbursement.title,
            description:
              reimbursement.description,
            amount:
              reimbursement.amount,
          });
        }
      }

      return result;
    }

    /*
      CFO
      APE approved
      CFO pending
    */
    if (currentUser.role === "CFO") {

      const allReimbursements =
        await db
          .select()
          .from(reimbursements);

      const result = [];

      for (const reimbursement of allReimbursements) {

        const [status] = await db
          .select()
          .from(reimbursementStatus)
          .where(
            eq(
              reimbursementStatus.id,
              reimbursement.statusId
            )
          )
          .limit(1);

        if (
          status.apeStatus ===
            "APPROVED" &&
          status.cfoStatus ===
            "PENDING"
        ) {
          result.push({
            reimbursementId:
              reimbursement.id,
            title:
              reimbursement.title,
            description:
              reimbursement.description,
            amount:
              reimbursement.amount,
          });
        }
      }

      return result;
    }

    throw new AppError(
      "Unauthorized",
      403
    );
  };

export const getReimbursementsByUserService =
  async (
    employeeId,
    currentUser
  ) => {

    if (
      currentUser.role !== "RM"
    ) {
      throw new AppError(
        "Only RM can access this endpoint",
        403
      );
    }

    const [mapping] = await db
      .select()
      .from(
        employeeManagerMapping
      )
      .where(
        and(
          eq(
            employeeManagerMapping.employeeId,
            employeeId
          ),
          eq(
            employeeManagerMapping.managerId,
            currentUser.id
          )
        )
      )
      .limit(1);

    if (!mapping) {
      throw new AppError(
        "Employee is not your subordinate",
        403
      );
    }

    const rows = await db
      .select()
      .from(reimbursements);

    return rows.filter(
      r => r.employeeId === employeeId
    );
  };
