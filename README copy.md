# Razorpay Reimbursement Assignment

**Current Phase:** Database Design & Schema Creation

This repository represents the initial database design phase of the Razorpay reimbursement assignment. It contains the raw Supabase SQL migrations, seed data, and schema documentation required to bootstrap the database layer.

There is currently **no backend logic** implemented.

## Directory Structure
```text
project/
├── supabase/
│   ├── migrations/
│   │   └── 00001_initial_schema.sql  # Table creations, foreign keys, constraints
│   └── seed.sql                      # Base roles, statuses, and admin user
├── docs/
│   ├── database-design.md            # Detailed schema explanations
│   └── er-diagram.md                 # Mermaid entity-relationship diagram
├── README.md
└── package.json                      # Empty config (no backend dependencies)
```

## Phase Status

### ✅ Completed
- Database schema design
- Table creation (`roles`, `status`, `users`, `tasks`, `reimbursements`, `audit_logs`)
- Foreign key relationships & constraints (`CASCADE`, `RESTRICT`, `SET NULL`)
- Role lookup structure
- Status management structure
- Supabase SQL migration scripting
- ERD Documentation

### ⏳ Pending
- Authentication
- Authorization (RBAC)
- API Development
- Business Logic
- Reimbursement Approval Workflow
- Frontend Integration

## How to Apply the Schema
To apply this schema to your Supabase project, execute the SQL files in the Supabase SQL editor in the following order:
1. `supabase/migrations/00001_initial_schema.sql`
2. `supabase/seed.sql`
