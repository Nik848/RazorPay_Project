# Razorpay Reimbursements Management Tool

## Project Overview

This project is a backend implementation of a Role-Based Access Control (RBAC) driven Reimbursements Management Tool. The system allows employees to raise reimbursement requests and routes those requests through a hierarchical approval workflow involving Reporting Managers (RM), Accounts Payable Executives (APE), and the Chief Financial Officer (CFO).

The primary focus of the assignment is access control, authorization, and clean backend architecture.

Current Progress:

* Database Design Completed
* Database Migrations Completed
* Seed Script Completed
* Backend Architecture Setup Completed
* Authentication Module Completed
* Authorization Infrastructure Completed
* Role Assignment Module Completed

The project is being developed incrementally to maintain a clean commit history and demonstrate the thought process behind each implementation decision.

---

# Development Timeline

## Phase 1: Requirement Analysis

### Objective

Before writing any code, the assignment requirements were analyzed to identify:

* System actors
* User roles
* Access control rules
* Entity relationships
* Approval workflows
* Required APIs

### Identified Roles

| Role | Description                |
| ---- | -------------------------- |
| EMP  | Employee                   |
| RM   | Reporting Manager          |
| APE  | Accounts Payable Executive |
| CFO  | Chief Financial Officer    |

### Key Observations

Every new user is registered as an EMP by default.

The CFO acts as the root user of the system.

Only the CFO can assign roles.

Every employee reports to exactly one reporting manager.

Reimbursement approvals require approval from:

1. Reporting Manager
2. Accounts Payable Executive

before reaching a fully approved state.

---

# Phase 2: Database Design

## Objective

Design a database structure capable of supporting:

* User management
* Role assignment
* Employee-manager relationships
* Reimbursement workflows
* Approval tracking

### Why Database Design Was Done First

A correct database design provides the foundation for:

* Business logic
* Access control
* API implementation
* Data integrity

Changing the database later often causes cascading changes throughout the project.

Therefore the schema was finalized before backend implementation started.

---

## Database Tables

### users

Stores all system users.

#### Purpose

Central identity table for:

* Employees
* Reporting Managers
* APEs
* CFO

#### Columns

| Column        | Type      | Purpose              |
| ------------- | --------- | -------------------- |
| id            | bigint    | Primary Key          |
| name          | varchar   | User name            |
| email         | varchar   | Unique login email   |
| password_hash | text      | Encrypted password   |
| role          | varchar   | EMP / RM / APE / CFO |
| created_at    | timestamp | Record creation time |
| updated_at    | timestamp | Last update time     |

#### Constraints

Email uniqueness constraint:

```sql
UNIQUE(email)
```

Role validation constraint:

```sql
CHECK(role IN ('EMP','RM','APE','CFO'))
```

#### Reasoning

Using a single users table simplifies:

* Authentication
* Authorization
* User management

while role differentiation is handled through the role column.

---

### employee_manager_mapping

Stores reporting relationships.

#### Purpose

Defines which employee reports to which manager.

#### Business Rule

Each employee must have exactly one reporting manager.

#### Columns

| Column      | Purpose           |
| ----------- | ----------------- |
| id          | Primary Key       |
| employee_id | Employee          |
| manager_id  | Reporting Manager |
| created_at  | Timestamp         |

#### Reasoning

Separating reporting relationships into their own table:

* Prevents user table pollution
* Allows relationship changes without user modifications
* Supports future hierarchy expansion

---

### reimbursements

Stores reimbursement requests raised by employees.

#### Columns

| Column      | Purpose             |
| ----------- | ------------------- |
| id          | Primary Key         |
| employee_id | Request creator     |
| title       | Reimbursement title |
| description | Request description |
| amount      | Requested amount    |
| created_at  | Timestamp           |
| updated_at  | Timestamp           |

#### Reasoning

This table stores only reimbursement details.

Approval workflow information is separated to maintain normalization.

---

### reimbursement_status

Stores approval decisions.

#### Purpose

Tracks approval state at multiple organizational levels.

#### Columns

| Column           | Purpose              |
| ---------------- | -------------------- |
| reimbursement_id | Linked reimbursement |
| rm_status        | RM approval status   |
| ape_status       | APE approval status  |
| cfo_status       | CFO approval status  |

#### Status Values

```text
PENDING
APPROVED
REJECTED
```

#### Reasoning

The assignment requires different actors to participate in the approval process.

Tracking approvals separately allows the system to determine:

* Who approved
* Who rejected
* Which stage is pending

---

# Phase 3: ORM Integration

## Objective

Connect application code to PostgreSQL using Drizzle ORM.

### Technology Selection

| Technology  | Purpose               |
| ----------- | --------------------- |
| PostgreSQL  | Relational Database   |
| Drizzle ORM | Query Builder and ORM |
| Drizzle Kit | Migrations            |

### Why Drizzle

Drizzle provides:

* Type-safe schema definitions
* SQL-like queries
* Migration support
* Minimal abstraction over SQL

This allows database operations to remain predictable and easy to debug.

---

## Database Connection

Location:

```text
src/config/db.js
```

Responsibilities:

* Read DATABASE_URL
* Establish PostgreSQL connection
* Initialize Drizzle instance
* Export reusable database object

---

# Phase 4: Database Migration System

## Objective

Create reproducible database infrastructure.

### Why Migrations

The assignment requires testers to recreate the database independently.

Instead of manually creating tables:

1. Schema definitions generate migrations
2. Migrations create database tables automatically

### Commands

Generate migration:

```bash
npm run db:generate
```

Apply migration:

```bash
npm run db:migrate
```

### Outcome

The entire database structure can now be recreated on any machine.

---

# Phase 5: CFO Seed System

## Objective

Create the mandatory root account required by the assignment.

### Seeded User

```text
Email:
cfo@org.com

Role:
CFO
```

### Why Seeding

The CFO cannot self-register.

The assignment explicitly requires a root account to exist before testing begins.

### Command

```bash
npm run db:seed-data
```

### Responsibilities

The seed script:

1. Checks whether CFO already exists.
2. Creates CFO if missing.
3. Prevents duplicate CFO records.

---

# Phase 6: Backend Architecture

## Objective

Create a scalable folder structure.

### Structure

```text
src/
│
├── modules/
├── middleware/
├── utils/
├── schema/
├── config/
├── scripts/
│
├── app.js
└── server.js
```

### Architectural Goal

Separate:

* Routes
* Controllers
* Services
* Validation
* Utilities

to maintain clean separation of concerns.

---

# Phase 7: Express Server Setup

## Objective

Initialize backend server infrastructure.

### app.js

Responsibilities:

* Express initialization
* JSON parsing
* Cookie parsing
* Route registration
* Global error handling

### server.js

Responsibilities:

* Load application
* Start server
* Listen on configured port

### Result

Application can now receive HTTP requests.

---

# Phase 8: Utility Layer

## Objective

Create reusable components used throughout the application.

### ApiResponse

Standardizes API responses.

### AppError

Standardizes application errors.

### generateToken

Centralizes JWT generation.

### Benefits

Reduces duplicate code and keeps response formats consistent.

---

# Phase 9: Authentication Module

## Objective

Allow users to:

* Register
* Login
* Logout

### Endpoints

```http
POST /rest/onboardings/register
POST /rest/onboardings/login
POST /rest/onboardings/logout
```

---

## Registration Flow

### Steps

1. Validate request body.
2. Verify org.com email domain.
3. Check existing user.
4. Hash password.
5. Create user.
6. Assign default EMP role.
7. Return success response.

### Security Measures

Passwords are never stored in plaintext.

bcrypt is used for password hashing.

---

## Login Flow

### Steps

1. Validate request.
2. Find user.
3. Compare password hash.
4. Generate JWT.
5. Store JWT in HTTP-only cookie.
6. Return success response.

### Security Measures

HTTP-only cookies prevent JavaScript access to authentication tokens.

---

## Logout Flow

### Steps

1. Clear authentication cookie.
2. Return success response.

---

# Phase 10: Authorization Infrastructure

## Objective

Protect sensitive APIs.

### auth.middleware.js

Responsibilities:

* Read JWT cookie
* Verify JWT
* Load user
* Attach user to request

### role.middleware.js

Responsibilities:

* Verify role permissions
* Restrict endpoint access

### Example

```text
CFO -> Allowed
EMP -> Blocked
```

for role assignment APIs.

---

# Phase 11: Role Assignment Module

## Objective

Allow the CFO to assign system roles.

### Endpoint

```http
POST /rest/roles/assign
```

### Workflow

1. Authenticate user.
2. Verify CFO role.
3. Validate payload.
4. Verify target user exists.
5. Update role.
6. Return success response.

### Why This Module Comes First

Every remaining workflow depends on role assignment.

Without RM and APE roles:

* Employee assignment cannot work.
* Approval workflows cannot work.
* Reimbursement routing cannot work.

---

# Upcoming Phases

The following modules are planned but not yet implemented:

## Employee Assignment Module

Endpoints:

```http
POST /rest/employees/assign
DELETE /rest/employees/assign
```

Purpose:

Assign employees to reporting managers.

---

## Employee Visibility Module

Endpoint:

```http
GET /rest/employees
```

Purpose:

Role-based visibility of users.

---

## Reimbursement Creation Module

Endpoint:

```http
POST /rest/reimbursements
```

Purpose:

Allow employees to create reimbursement requests.

---

## Reimbursement Approval Workflow

Endpoint:

```http
PATCH /rest/reimbursements
```

Purpose:

Allow RM, APE, and CFO approvals.

---

## Reimbursement Visibility Module

Endpoints:

```http
GET /rest/reimbursements
GET /rest/reimbursements/:userId
```

Purpose:

Role-based reimbursement access control.

---

# Current Status

| Module                   | Status   |
| ------------------------ | -------- |
| Database Design          | Complete |
| Migrations               | Complete |
| Seed System              | Complete |
| Authentication           | Complete |
| Authorization            | Complete |
| Role Assignment          | Complete |
| Employee Assignment      | Pending  |
| Employee Listing         | Pending  |
| Reimbursement Creation   | Pending  |
| Reimbursement Approval   | Pending  |
| Reimbursement Visibility | Pending  |
| Testing                  | Pending  |
| Deployment               | Pending  |


# Phase 12: Employee-Manager Relationship Module

## Objective

Implement organizational hierarchy management by allowing the Chief Financial Officer (CFO) to assign employees to reporting managers.

This phase establishes the reporting structure required for the reimbursement approval workflow.

Without this relationship mapping, the system cannot determine:

* Which Reporting Manager should review an employee's reimbursement.
* Which employees belong to a specific Reporting Manager.
* Which reimbursements should be visible to a Reporting Manager.
* Whether reimbursement visibility rules are being respected.

This module serves as the bridge between user management and reimbursement workflows.

---

## Business Requirement Analysis

The assignment defines the following organizational rules:

* Every employee reports to exactly one Reporting Manager.
* A Reporting Manager can manage multiple employees.
* Only the CFO can create or remove reporting relationships.
* Employees cannot be assigned directly to APEs.
* Employees cannot be assigned directly to the CFO.

From these requirements, the employee-manager mapping system was designed.

---

## Database Design Review

### employee_manager_mapping

The relationship table was already created during the database design phase.

#### Structure

| Column      | Purpose                 |
| ----------- | ----------------------- |
| id          | Primary Key             |
| employee_id | Employee being assigned |
| manager_id  | Reporting Manager       |
| created_at  | Assignment timestamp    |

#### Important Constraint

```sql
employee_id UNIQUE
```

This constraint enforces the assignment rule:

> One employee can only report to one manager at a time.

This rule is enforced at the database level rather than relying solely on application logic.

This prevents accidental duplicate assignments even if application validation fails.

---

## Module Structure

The employee module follows the same layered architecture used throughout the project.

```text
employees/
├── employees.routes.js
├── employees.controller.js
├── employees.service.js
└── employees.validation.js
```

### Responsibilities

#### Validation Layer

Responsible for:

* Request body validation
* Required field validation
* Self-assignment prevention

#### Controller Layer

Responsible for:

* Receiving HTTP requests
* Invoking service functions
* Returning API responses

#### Service Layer

Responsible for:

* Database operations
* Business rule enforcement
* Relationship management

#### Route Layer

Responsible for:

* Endpoint registration
* Authentication middleware
* Authorization middleware

---

# Endpoint 1: Assign Employee

## Route

```http
POST /rest/employees/assign
```

## Authorization

Only CFO users are allowed to access this endpoint.

Request flow:

```text
Request
   ↓
Authentication Middleware
   ↓
Role Authorization Middleware
   ↓
Controller
   ↓
Service Layer
   ↓
Database
```

---

## Request Body

```json
{
  "employeeId": 5,
  "managerId": 2
}
```

---

## Validation Rules

Before creating a relationship, several checks are performed.

### Rule 1

Both employeeId and managerId must exist.

Example:

```json
{
  "employeeId": 5,
  "managerId": 2
}
```

Valid.

---

### Rule 2

Employee cannot report to themselves.

Invalid:

```json
{
  "employeeId": 5,
  "managerId": 5
}
```

Reason:

A reporting hierarchy cannot contain self-references.

---

### Rule 3

Employee must exist.

System verifies:

```sql
SELECT * FROM users
WHERE id = employeeId
```

---

### Rule 4

Manager must exist.

System verifies:

```sql
SELECT * FROM users
WHERE id = managerId
```

---

### Rule 5

Assigned employee must have role EMP.

Valid:

```text
EMP
```

Invalid:

```text
RM
APE
CFO
```

Reason:

Only employees can be assigned to reporting managers.

---

### Rule 6

Target manager must have role RM.

Valid:

```text
RM
```

Invalid:

```text
EMP
APE
CFO
```

Reason:

Only Reporting Managers are allowed to manage employees.

---

### Rule 7

Employee must not already have a manager.

System checks:

```sql
SELECT *
FROM employee_manager_mapping
WHERE employee_id = ?
```

If a record exists:

Assignment is rejected.

---

## Assignment Workflow

### Step 1

Validate request payload.

### Step 2

Verify employee exists.

### Step 3

Verify manager exists.

### Step 4

Verify employee role is EMP.

### Step 5

Verify manager role is RM.

### Step 6

Verify employee is not already assigned.

### Step 7

Insert relationship.

```sql
INSERT INTO employee_manager_mapping
(
 employee_id,
 manager_id
)
VALUES
(
 employeeId,
 managerId
)
```

### Step 8

Return success response.

---

## Success Response

```json
{
  "status": "success",
  "message": "Employee assigned successfully"
}
```

---

# Endpoint 2: Remove Employee Assignment

## Route

```http
DELETE /rest/employees/assign
```

---

## Authorization

Only CFO users are allowed to access this endpoint.

---

## Request Body

```json
{
  "employeeId": 5,
  "managerId": 2
}
```

---

## Validation

System verifies:

1. employeeId exists.
2. managerId exists.
3. Mapping exists.

---

## Removal Workflow

### Step 1

Locate mapping.

```sql
SELECT *
FROM employee_manager_mapping
WHERE employee_id = ?
AND manager_id = ?
```

### Step 2

Delete mapping.

```sql
DELETE
FROM employee_manager_mapping
WHERE employee_id = ?
AND manager_id = ?
```

### Step 3

Return success response.

---

## Success Response

```json
{
  "status": "success",
  "message": "Employee unassigned successfully"
}
```

---

# Security Implementation

The employee assignment module is protected by two middleware layers.

## Authentication Middleware

Responsibilities:

* Read JWT from cookie.
* Verify JWT signature.
* Extract user identity.
* Load user from database.
* Attach user to request object.

Result:

```js
req.user = {
  id,
  email,
  role
}
```

---

## Authorization Middleware

Responsibilities:

Verify user role before endpoint execution.

Example:

```js
authorize("CFO")
```

If role is not CFO:

```http
403 Forbidden
```

is returned.

This ensures only CFO users can manage organizational hierarchy.

---

# Testing Strategy

The module was tested using the following scenarios.

## Positive Tests

### Scenario 1

Assign EMP to RM.

Expected:

Assignment succeeds.

---

### Scenario 2

Remove existing assignment.

Expected:

Assignment removed successfully.

---

## Negative Tests

### Scenario 1

Employee assigned twice.

Expected:

Assignment rejected.

---

### Scenario 2

Employee reports to themselves.

Expected:

Assignment rejected.

---

### Scenario 3

Manager role is not RM.

Expected:

Assignment rejected.

---

### Scenario 4

Employee role is not EMP.

Expected:

Assignment rejected.

---

### Scenario 5

Non-CFO user accesses endpoint.

Expected:

403 Forbidden.

---

# Architectural Significance

This module is the first implementation of organizational hierarchy.

It introduces:

* Relationship management
* Multi-level authorization
* Hierarchical ownership

The reporting structure created here becomes the foundation for:

1. Employee visibility APIs.
2. Reimbursement visibility APIs.
3. Reimbursement approval routing.
4. Manager-specific dashboards.

Without this module, the reimbursement workflow cannot determine ownership or approval responsibility.

---

# Current Project Status

| Module                   | Status   |
| ------------------------ | -------- |
| Database Design          | Complete |
| Migrations               | Complete |
| Seed System              | Complete |
| Authentication           | Complete |
| Authorization            | Complete |
| Role Assignment          | Complete |
| Employee Assignment      | Complete |
| Employee Visibility      | Pending  |
| Reimbursement Creation   | Pending  |
| Reimbursement Approval   | Pending  |
| Reimbursement Visibility | Pending  |
| Testing Suite            | Pending  |
| Deployment               | Pending  |

---

# Next Phase

Phase 13 will implement:

```http
GET /rest/employees
```

This endpoint introduces role-based visibility rules where:

* EMP cannot access employee listings.
* RM can only view direct subordinates.
* APE can view all EMP and RM users.
* CFO can view all users.

This will be the first endpoint that fully demonstrates RBAC-driven data visibility.
