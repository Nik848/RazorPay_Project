# Database Design: Day13 RBAC Schema

This document outlines the database schema design for the Day13 RBAC backend, built using Drizzle ORM and PostgreSQL (Supabase).

## Tables Overview

### 1. `users`
Stores employee information and their assigned role.
- `id` (BIGSERIAL, PK): Unique user identifier.
- `name` (VARCHAR): Full name of the user.
- `email` (VARCHAR, UNIQUE): The user's organizational email address.
- `password_hash` (TEXT): Securely hashed password.
- `role` (VARCHAR): The user's access level. Enforced via a `CHECK` constraint: `IN ('EMP', 'RM', 'APE', 'CFO')`.
- `created_at`, `updated_at`: Timestamps.

### 2. `employee_manager_mapping`
Manages the hierarchical relationship where an Employee (`EMP`) reports to a Reporting Manager (`RM`).
- `id` (BIGSERIAL, PK): Unique identifier.
- `employee_id` (BIGINT, FK): References `users.id` (`ON DELETE CASCADE`). Unique constraint ensures 1 EMP has exactly 1 RM.
- `manager_id` (BIGINT, FK): References `users.id` (`ON DELETE CASCADE`).
- `created_at`: Timestamp.

### 3. `reimbursement_status`
Manages the multi-level approval flow states for a given reimbursement.
- `id` (BIGSERIAL, PK): Unique status group identifier.
- `rm_status` (VARCHAR): Reporting Manager approval state. `CHECK IN ('PENDING', 'APPROVED', 'REJECTED')`. Default: `'PENDING'`.
- `ape_status` (VARCHAR): Approving Entity approval state. `CHECK IN ('PENDING', 'APPROVED', 'REJECTED')`. Default: `'PENDING'`.
- `cfo_status` (VARCHAR): CFO approval state. `CHECK IN ('PENDING', 'APPROVED', 'REJECTED')`. Default: `'PENDING'`.
- `created_at`, `updated_at`: Timestamps.

### 4. `reimbursements`
Stores the actual expense claim records submitted by employees.
- `id` (BIGSERIAL, PK): Unique reimbursement identifier.
- `employee_id` (BIGINT, FK): References `users.id` (`ON DELETE CASCADE`). The employee requesting the reimbursement.
- `title` (VARCHAR): Brief description of the expense.
- `description` (TEXT): Detailed justification.
- `amount` (DECIMAL(12,2)): The financial amount claimed.
- `status_id` (BIGINT, FK): References `reimbursement_status.id` (`ON DELETE CASCADE`). Links to the multi-level approval state.
- `created_at`, `updated_at`: Timestamps.

## Relationships & Constraints
1. **Employee to Manager:** A dedicated mapping table ensures we can strictly enforce 1-to-1 relationships for subordinates without cluttering the `users` table.
2. **Reimbursement to Status:** Each `reimbursement` maps 1-to-1 to a `reimbursement_status` row, cleanly separating the approval flow tracking from the financial payload.
3. **Data Integrity:** `ON DELETE CASCADE` is heavily utilized to ensure that if a user is deleted, their mapping, reimbursements, and corresponding status flows are completely cleaned up.
