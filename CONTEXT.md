# Frontend Context - Personal Trainer App

## 1. Technology Stack
- **Framework**: Ionic 7 (Angular 17+)
- **Build Tool**: Angular CLI
- **Runtime**: Capacitor (for iOS/Android deployment)
- **Language**: TypeScript
- **Styling**: SCSS (Scoped to components + Global `variables.scss`)

## 2. Project Architecture (`src/app`)
The application follows a module-based architecture with separate modules for pages to support lazy loading.

### Core Modules
- `AppModule` (`app.module.ts`): Main entry point. Contains global providers like `HttpClient` and `RouteReuseStrategy`.
- `AppRoutingModule`: Main routing logic.

### Directory Structure
- **`pages/`**: Contains full-screen views.
    - `login/`: Auth entry point.
    - `register/`: User registration (Coach/Athlete selection).
    - `coach-home/`: Dashboard for Coaches (Exercise CRUD, Plan Creation).
    - `athlete-home/`: Dashboard for Athletes (View Plans).
    - `session-view/`: Active workout session logger.
- **`services/`**: Singleton services for data and logic.
    - `api.service.ts`: Wrapper around `HttpClient` for REST API calls. Handles JWT injection.
    - `auth.service.ts`: Manages user session (Login, Register, Logout, Token Storage).
- **`tabs/`**: Ionic Tabs starter (currently unused/legacy, candidates for removal if fully migrating to `pages/`).

## 3. Key Concepts & Conventions

### Authentication
- JWT-based authentication.
- Token is stored in `localStorage`.
- `ApiService` automatically injects the `Authorization: Bearer <token>` header.

### Component Structure
- **NOT Standalone**: Components are declared in `NgModules` (e.g., `LoginPageModule`).
- **IMPORTANT**: Page components must explicitly set `standalone: false` in their `@Component` decorator to avoid conflicts with the `NgModule` declaration.

### Routing
- Valid routes are defined in `app-routing.module.ts`.
- Navigation uses standard Angular `Router`.

## 4. State Management
- Simple state management using `BehaviorSubject` in services (e.g., `AuthService.user$`).
- No external state libraries (NgRx/Akita) used for MVP.

## 5. Styling
- Use Ionic components (`ion-content`, `ion-item`, `ion-button`) first.
- Override variables in `theme/variables.scss`.
- Custom styles in component `.scss` files.

## 6. Access Code System
- **Coach**: Generates access codes via `POST /auth/generate-code`.
- **Athlete**: Validates registration using these codes.

## 7. Development Guidelines
- Always use `ionic serve` for local development.
- When creating a new page: `ionic g page pages/NewPage`.
- Ensure new pages are lazy-loaded in `app-routing.module.ts`.
