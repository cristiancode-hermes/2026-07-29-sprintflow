# SprintFlow API Reference

Base URL: `/api`

All protected endpoints require `Authorization: Bearer <jwt_token>` header.

## Auth Endpoints

### POST /api/auth/register
Register a new user.

```json
{
  "name": "Alex Martinez",
  "email": "alex@example.com",
  "password": "password123"
}
```
**Response (201):** `{ user: { id, name, email }, token: "jwt..." }`

### POST /api/auth/login
Authenticate and receive JWT.

```json
{
  "email": "alex@example.com",
  "password": "password123"
}
```
**Response (200):** `{ user: { id, name, email }, token: "jwt..." }`

### GET /api/auth/me
Get current user profile. (Protected)

**Response (200):** `{ user: { id, name, email, theme, defaultSprintDays, createdAt } }`

## Users Endpoints

### PATCH /api/users/me
Update profile. (Protected)

```json
{ "name": "New Name", "password": "newpass123" }
```

### GET /api/users/me/settings
Get user preferences. (Protected)

### PATCH /api/users/me/settings
Update preferences. (Protected)

```json
{ "theme": "dark", "defaultSprintDays": 14 }
```

## Projects Endpoints

### GET /api/projects
List user's projects. (Protected)

### POST /api/projects
Create project. (Protected)

```json
{ "name": "Mobile App", "description": "..." , "color": "#3B82F6" }
```

### GET /api/projects/:id
Get project with sprint summary. (Protected)

### PATCH /api/projects/:id
Update project. (Protected)

### DELETE /api/projects/:id
Delete project + all sprints/tasks. (Protected)

## Sprints Endpoints

### GET /api/projects/:pid/sprints
List sprints for project. (Protected)

### POST /api/projects/:pid/sprints
Create sprint. (Protected)

```json
{
  "name": "Sprint 3: Performance",
  "goal": "Optimize API response times",
  "startDate": "2026-07-21",
  "endDate": "2026-07-31"
}
```

### GET /api/sprints/:id
Get sprint with goals and task summary. (Protected)

### PATCH /api/sprints/:id
Update sprint. (Protected)

### DELETE /api/sprints/:id
Delete sprint. (Protected)

### PATCH /api/sprints/:id/status
Transition sprint status. (Protected)

```json
{ "status": "active" }
```

### POST /api/sprints/:id/complete
Complete sprint, record velocity. (Protected)

## Goals Endpoints

### GET /api/sprints/:sid/goals
### POST /api/sprints/:sid/goals
### PATCH /api/goals/:id
### DELETE /api/goals/:id

## Tasks Endpoints

### GET /api/sprints/:sid/tasks
List tasks with optional filters: `?status=todo&assignee=uuid&priority=high&search=keyword` (Protected)

### POST /api/sprints/:sid/tasks
Create task. (Protected)

```json
{
  "title": "Implement auth flow",
  "description": "...",
  "status": "todo",
  "points": 5,
  "priority": "high"
}
```

### GET /api/tasks/:id
### PATCH /api/tasks/:id
### DELETE /api/tasks/:id
### PATCH /api/tasks/:id/status
Move task to new status.

```json
{ "status": "in_progress" }
```

## Dashboard Endpoints

### GET /api/sprints/:id/dashboard
Full analytics: KPIs + burndown + velocity + distribution.

### GET /api/sprints/:id/dashboard/kpis
### GET /api/sprints/:id/dashboard/burndown
### GET /api/sprints/:id/dashboard/velocity
### GET /api/sprints/:id/dashboard/distribution

## Activity Endpoints

### GET /api/sprints/:sid/activity
Paginated activity log. `?limit=50&offset=0&type=task_moved`

## Error Response Format
```json
{
  "error": {
    "statusCode": 400,
    "message": "Validation failed",
    "details": [{ "field": "title", "message": "Title is required" }]
  }
}
```
