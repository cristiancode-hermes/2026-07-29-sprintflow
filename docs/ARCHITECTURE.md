# SprintFlow Architecture

## Overview

SprintFlow is a full-stack Agile sprint management dashboard built with Angular 22 (frontend) and NestJS 11 (backend) in a monorepo.

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Angular 22 (standalone, zoneless, signals) | SPA with lazy-loaded routes |
| Styling | Pure CSS with CSS custom properties | Forge Amber design system |
| Backend | NestJS 11 + TypeORM 1.1.0 | REST API with modular architecture |
| Database | better-sqlite3 (dev) / Neon PostgreSQL (prod) | Data persistence |
| Auth | Passport.js JWT + bcryptjs | Stateless token authentication |
| Charts | Native SVG | Burndown, velocity, distribution |

## Project Structure

```
sprintflow/
├── apps/
│   ├── web/                          # Angular 22 frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/             # Guards, interceptors, services, models, utils
│   │   │   │   ├── shared/           # Reusable UI components
│   │   │   │   ├── pages/            # Feature page components
│   │   │   │   │   ├── auth/         # Login, Register pages
│   │   │   │   │   ├── projects/     # Project list, detail pages
│   │   │   │   │   ├── sprints/      # Sprint board, create/edit pages
│   │   │   │   │   ├── tasks/        # Task detail (drawer)
│   │   │   │   │   ├── dashboard/    # Sprint dashboard (charts, KPIs)
│   │   │   │   │   └── settings/     # User settings
│   │   │   │   ├── layouts/          # Auth and dashboard layouts
│   │   │   │   ├── app.routes.ts     # Route definitions
│   │   │   │   └── app.config.ts     # App providers
│   │   │   ├── assets/
│   │   │   └── styles.css            # Global design system tokens
│   │   └── angular.json
│   │
│   └── api/                          # NestJS 11 backend
│       └── src/
│           ├── modules/
│           │   ├── auth/             # Auth controller, service, JWT strategy
│           │   ├── users/            # User entity and management
│           │   ├── projects/         # Project CRUD
│           │   ├── sprints/          # Sprint lifecycle management
│           │   ├── goals/            # Sprint goal management
│           │   ├── tasks/            # Task CRUD and status transitions
│           │   ├── dashboard/        # Burndown, velocity, KPI aggregation
│           │   ├── activity/         # Activity log
│           │   └── seed/             # Database seeding
│           ├── app.module.ts
│           ├── main.ts
│           └── tsconfig.json
│
├── docs/                             # Project documentation
├── package.json                      # Root workspace config
└── .gitignore
```

## Data Flow

### Authentication Flow
1. User registers/logs in → receives JWT token
2. Token stored in localStorage
3. Auth interceptor attaches Bearer token to all API requests
4. JwtAuthGuard validates token on protected endpoints
5. Token expiry → redirect to login

### Sprint Lifecycle
```
Planning → Active → Completed
                ↘ Cancelled
```

### Task Status Flow
```
Backlog → To Do → In Progress → Review → Done
             ↑           ↓
             └───────────┘ (de-prioritized)
```

## Key Design Decisions

1. **Signals over RxJS Subjects**: Angular 22 signals provide simpler state management with computed values and effects
2. **Pure CSS over Tailwind**: Design-system-driven CSS custom properties for consistent theming
3. **Native SVG charts**: No external chart libraries — SVG paths computed from data signals
4. **Optimistic updates**: Task moves on kanban board update immediately, revert on error
5. **Forward-only status transitions**: Task and sprint status machines enforce forward progression
