# SprintFlow Frontend

## Architecture

Angular 22 single-page application with standalone components, zoneless change detection, and signal-based state management.

## Key Setup

- **Zoneless**: `provideZonelessChangeDetection()` in app.config.ts
- **Router**: Lazy-loaded routes via `loadComponent`
- **HTTP**: `provideHttpClient(withFetch(), withInterceptors([authInterceptor]))`
- **Forms**: `FormsModule` imported per component
- **Styling**: Pure CSS with custom properties (no Tailwind)

## Design System: Forge Amber

A warm industrial palette built around amber accents against cool steel-grey foundations.

### CSS Custom Properties

All design tokens are defined as CSS custom properties in `styles.css` under `:root` (light mode) and `[data-theme="dark"]` (dark mode).

Key tokens:
- `--color-accent: #F59E0B` (amber - primary actions, indicators)
- `--color-surface: #F1F5F9` (card backgrounds)
- `--color-background: #FFFFFF` (page background)
- `--radius-md: 8px` (card/button border radius)

### Dark Mode

Toggled via `data-theme` attribute on `<html>`. Theme service persists preference in localStorage.

## Signal-Based State

```typescript
// Service pattern
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly tasks = signal<Task[]>([]);
  readonly items = this.tasks.asReadonly();
  readonly loading = signal(false);
  readonly error = signal('');

  loadAll(sprintId: string, filters?: TaskFilters): void { ... }
  create(sprintId: string, data: CreateTaskDto): Observable<Task> { ... }
}
```

## Page Component Triad

Every data-fetching page uses three independent signals:
```typescript
protected readonly items = signal<T[]>([]);
protected readonly loading = signal(true);
protected readonly error = signal('');
```

Template priority order: `loading → error → empty → normal`

## Component Structure

### Shared Components
- **Header**: Global nav, user menu, theme toggle
- **Sidebar**: Collapsible project navigation
- **KpiCard**: Metric display card
- **TaskCard**: Draggable kanban task card
- **StatusBadge**: Colored status pill
- **UserAvatar**: Initials/photo avatar
- **EmptyState**: Placeholder with CTA
- **LoadingSkeleton**: Shimmer animation
- **ConfirmDialog**: Modal confirmation
- **ProgressBar**: Auto-colored progress
- **ToastContainer**: Notification display
- **BurndownChart**: SVG line chart
- **VelocityChart**: SVG bar chart
- **TaskDistribution**: Status breakdown

### Feature Pages
- **LoginPage**: Email/password authentication
- **RegisterPage**: User registration
- **ProjectListPage**: Project grid dashboard
- **ProjectDetailPage**: Sprint list per project
- **ProjectFormPage**: Create/edit project (modal)
- **SprintBoardPage**: Kanban board (5 columns)
- **SprintCreatePage**: New sprint form
- **SprintEditPage**: Edit sprint form
- **SprintDashboardPage**: Analytics & charts
- **SettingsPage**: User preferences

## SVG Chart Implementation

Charts are rendered as pure SVG elements with Angular bindings:
- **Burndown**: `<path>` with computed `d` attribute for ideal vs actual lines
- **Velocity**: `<rect>` bars per sprint with computed height
- **Grid lines**: `<line>` elements from computed Y-axis labels

Key pattern:
```html
<svg [attr.viewBox]="'0 0 ' + width + ' ' + height" preserveAspectRatio="xMidYMid meet">
  <path [attr.d]="linePath()" fill="none" stroke="var(--color-accent)" stroke-width="2" />
</svg>
```

## Routes

| Path | Component | Auth |
|------|-----------|------|
| `/login` | LoginPage | No |
| `/register` | RegisterPage | No |
| `/projects` | ProjectListPage | Yes |
| `/projects/:id` | ProjectDetailPage | Yes |
| `/projects/:id/sprints/:sid` | SprintBoardPage | Yes |
| `/projects/:id/sprints/:sid/dashboard` | SprintDashboardPage | Yes |
| `/settings` | SettingsPage | Yes |
