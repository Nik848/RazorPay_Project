# Reimbursement Management Tool (RBAC-Based Backend System)

## Project Overview

The Reimbursement Management Tool is a backend application designed to simulate a real-world organizational reimbursement approval workflow using Role-Based Access Control (RBAC).

The system allows employees to create reimbursement requests and routes those requests through a structured approval hierarchy consisting of Reporting Managers (RM), Accounts Payable Executives (APE), and the Chief Financial Officer (CFO).

The primary goal of this project is to demonstrate:

* Authentication
* Authorization
* Role-Based Access Control (RBAC)
* Hierarchical employee management
* Multi-stage approval workflows
* Secure backend architecture
* Database normalization
* Production-ready API design

The application follows a layered architecture where responsibilities are clearly separated between routes, validation, controllers, services, middleware, and database layers.

---

# Table of Contents

1. Project Overview
2. Business Requirements
3. System Roles
4. System Architecture
5. Database Design
6. Authentication System
7. Authorization System
8. Employee Management Module
9. Reimbursement Management Module
10. API Documentation
11. Security Implementation
12. Validation Strategy
13. Testing Strategy
14. Current Project Status
15. Future Improvements

---

# Business Requirements

The assignment defines an organization where employees submit reimbursement requests that must pass through multiple approval stages before reaching a final decision.

The system must enforce organizational hierarchy and role-based access restrictions.

## Core Business Rules

1. Every new user registers as an Employee (EMP).
2. Only the CFO can assign organizational roles.
3. Every employee reports to exactly one Reporting Manager.
4. A Reporting Manager can manage multiple employees.
5. Only Employees can create reimbursement requests.
6. Reporting Managers review employee reimbursements first.
7. Accounts Payable Executives review reimbursements after RM approval.
8. CFO performs the final review.
9. Users should only see data permitted by their role.
10. Organizational hierarchy must be respected when accessing employee and reimbursement information.

---

# System Roles

## Employee (EMP)

Responsibilities:

* Register account
* Login
* Create reimbursement requests
* View own reimbursement history

Restrictions:

* Cannot approve reimbursements
* Cannot assign users
* Cannot manage employees

---

## Reporting Manager (RM)

Responsibilities:

* Review employee reimbursements
* Approve or reject reimbursement requests
* View direct subordinate information
* View reimbursement history of assigned employees

Restrictions:

* Cannot assign roles
* Cannot assign employees
* Cannot view employees outside reporting hierarchy

---

## Accounts Payable Executive (APE)

Responsibilities:

* Review reimbursements approved by Reporting Managers
* Approve or reject reimbursement requests
* View organizational employee records

Restrictions:

* Cannot assign roles
* Cannot assign employees

---

## Chief Financial Officer (CFO)

Responsibilities:

* Assign roles
* Assign employees to managers
* Perform final reimbursement review
* View all users
* Manage organizational hierarchy

Restrictions:

* CFO account is seeded into the system
* CFO cannot self-register

---

# System Architecture

The project follows a layered backend architecture.

Request Flow:

Client Request
↓
Route Layer
↓
Validation Layer
↓
Authentication Middleware
↓
Authorization Middleware
↓
Controller Layer
↓
Service Layer
↓
Database Layer
↓
Response

---

## Why This Architecture Was Chosen

The purpose of separating responsibilities is to make the system easier to maintain, debug, test, and scale.

### Route Layer

Responsible for:

* Endpoint registration
* Middleware attachment
* Request routing

### Validation Layer

Responsible for:

* Request validation
* Input sanitization
* Preventing invalid data

### Controller Layer

Responsible for:

* Receiving requests
* Calling services
* Returning standardized responses

Controllers contain no business logic.

### Service Layer

Responsible for:

* Business rules
* Workflow implementation
* Database operations

All major application logic exists in the service layer.

### Middleware Layer

Responsible for:

* Authentication
* Authorization
* Request protection

### Database Layer

Responsible for:

* Data persistence
* Constraints
* Relationships
* Transaction safety

---

# Project Structure

```
src/
│
├── app/
│
├── auth/
│ ├── auth.routes.js
│ ├── auth.controller.js
│ ├── auth.service.js
│ └── auth.validation.js
│
├── roles/
│ ├── roles.routes.js
│ ├── roles.controller.js
│ ├── roles.service.js
│ └── roles.validation.js
│
├── employees/
│ ├── employees.routes.js
│ ├── employees.controller.js
│ ├── employees.service.js
│ └── employees.validation.js
│
├── reimbursements/
│ ├── reimbursements.routes.js
│ ├── reimbursements.controller.js
│ ├── reimbursements.service.js
│ └── reimbursements.validation.js
│
├── middleware/
│ ├── auth.middleware.js
│ └── role.middleware.js
│
├── utils/
│ ├── ApiResponse.js
│ ├── AppError.js
│ ├── generateToken.js
│ └── reimbursementStatus.js
│
├── config/
│ └── db.js
│
├── schema/
│
├── scripts/
│ └── seed.js
│
├── app.js
└── server.js

```

# Database Design

The database was designed before API implementation to ensure all business rules could be enforced consistently.

## Database Design Goals

* Maintain normalization
* Prevent duplicate data
* Enforce organizational hierarchy
* Support reimbursement workflows
* Support RBAC

---

## Users Table

Purpose:

Stores all users in the organization.

Columns:

* id
* name
* email
* password_hash
* role_id
* created_at
* updated_at

Constraints:

* Unique email
* Required role

---

## Roles Table

Purpose:

Stores system roles.

Example Records:

* EMP
* RM
* APE
* CFO

Benefits:

* Centralized role management
* Improved normalization
* Easier role expansion

---

## Employee Manager Mapping Table

Purpose:

Stores reporting relationships.

Columns:

* id
* employee_id
* manager_id
* created_at

Business Rule:

One employee can only have one reporting manager.

Constraint:

employee_id UNIQUE

---

## Status Table

Purpose:

Stores reimbursement approval states.

Possible Values:

* PENDING
* APPROVED
* REJECTED

Benefits:

* Centralized status management
* Consistent workflow transitions

---

## Reimbursements Table

Purpose:

Stores reimbursement requests.

Columns:

* id
* employee_id
* status_id
* title
* description
* amount
* created_at
* updated_at

Relationships:

employee_id → users.id

status_id → reimbursement_status.id

---

# Authentication System

The authentication system allows users to register, login, and logout securely.

## Registration Workflow

1. Validate request body
2. Verify email domain
3. Check duplicate user
4. Hash password
5. Create user
6. Assign EMP role
7. Return response

Security:

Passwords are never stored in plaintext.

bcrypt is used for hashing.

## Login Workflow

1. Validate request
2. Verify user
3. Compare password hash
4. Generate JWT
5. Store JWT in HTTP-only cookie
6. Return response

Benefits:

* Stateless authentication
* Secure session handling
* Reduced token exposure

## Logout Workflow

1. Clear authentication cookie
2. Return success response

---

# Authorization System

Authorization is implemented using dedicated middleware.

## Authentication Middleware

Responsibilities:

* Read JWT cookie
* Verify token
* Load user
* Attach user to request

Example:

req.user = {
id,
email,
role
}

---

## Role Authorization Middleware

Responsibilities:

* Verify user role
* Restrict endpoint access

Example:

authorize("CFO")

Only CFO users can access protected endpoints.

---

# Employee Management Module

## Role Assignment

Endpoint:

POST /rest/roles/assign

Only CFO users can assign organizational roles.

Workflow:

1. Authenticate user
2. Verify CFO role
3. Validate request
4. Verify target user
5. Update role
6. Return response

---

## Employee Assignment

Endpoint:

POST /rest/employees/assign

Purpose:

Assign employees to reporting managers.

Validation:

* Employee exists
* Manager exists
* Employee role = EMP
* Manager role = RM
* Employee not already assigned

---

## Employee Visibility

Endpoint:

GET /rest/employees

Visibility Rules:

CFO → All users

APE → EMP + RM

RM → Direct subordinates only

EMP → No access

---

# Reimbursement Management Module

## Reimbursement Lifecycle

EMP
↓
RM Review
↓
APE Review
↓
CFO Review

---

## Reimbursement Creation

Endpoint:

POST /rest/reimbursements

Access:

EMP only

Workflow:

1. Validate request
2. Create approval status
3. Create reimbursement record
4. Link status
5. Return response

Initial Status:

RM = PENDING

APE = PENDING

CFO = PENDING

---

## Reimbursement Approval

Endpoint:

PATCH /rest/reimbursements

Access:

RM

APE

CFO

Workflow Order:

RM → APE → CFO

Rules:

APE cannot approve before RM.

CFO cannot approve before APE.

Any rejection immediately terminates workflow.

---

## Reimbursement Visibility

Endpoint:

GET /rest/reimbursements

Employee:

Only own reimbursements.

RM:

Only direct subordinate reimbursements pending RM review.

APE:

Only RM-approved reimbursements pending APE review.

CFO:

Only APE-approved reimbursements pending CFO review.

---

# API Documentation

Authentication

POST /rest/onboardings/register

POST /rest/onboardings/login

POST /rest/onboardings/logout

Role Management

POST /rest/roles/assign

Employee Management

POST /rest/employees/assign

DELETE /rest/employees/assign

GET /rest/employees

Reimbursements

POST /rest/reimbursements

PATCH /rest/reimbursements

GET /rest/reimbursements

GET /rest/reimbursements/:userId

---

# Security Implementation

## Password Security

* bcrypt hashing
* No plaintext storage

## Authentication Security

* JWT tokens
* HTTP-only cookies

## Authorization Security

* Role verification
* Hierarchy verification

## Database Security

* Foreign keys
* Unique constraints
* Check constraints

---

# Testing Strategy

Authentication Tests

* Register user
* Login user
* Logout user

Authorization Tests

* Protected endpoints
* Role restrictions

Employee Module Tests

* Assign employee
* Remove assignment
* Employee visibility

Reimbursement Tests

* Create reimbursement
* Approve reimbursement
* Reject reimbursement
* Visibility rules

Security Tests

* Unauthorized access
* Invalid tokens
* Duplicate assignments

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
| Employee Visibility      | Complete |
| Reimbursement Creation   | Complete |
| Reimbursement Approval   | Complete |
| Reimbursement Visibility | Complete |
| Testing Suite            | Pending  |
| Postman Collection       | Pending  |
| Deployment               | Pending  |

---

# Future Improvements

1. Audit Logs

2. Email Notifications

3. Approval Comments

4. File Upload Support

5. Docker Deployment

6. CI/CD Pipeline

7. Automated Testing

8. Activity Tracking

9. Advanced Reporting

10. Multi-Level Manager Hierarchy

---

# Conclusion

This project demonstrates a complete RBAC-driven reimbursement management workflow implemented using modern backend development practices.

The system successfully combines:

* Authentication
* Authorization
* Organizational hierarchy management
* Multi-stage approval workflows
* Role-based visibility controls
* Secure API architecture

while maintaining clean separation of concerns and scalability for future enhancements.
