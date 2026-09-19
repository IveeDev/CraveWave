# 🍔 CraveWave

**CraveWave** is a full-stack food delivery platform built as a modern monorepo. The application connects customers with restaurants, allowing customers to discover restaurants, browse menus, place orders, and manage their accounts, while restaurant owners can manage their restaurants, menus, and orders.

The project is being developed as a mobile-first application with a dedicated backend API and shared TypeScript packages.

---

## 📌 Project Status

> 🚧 **CraveWave is currently under active development.**

Core functionality is being built incrementally. Features, APIs, database schemas, and application architecture may change as development progresses.

---

# 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Monorepo Structure](#-monorepo-structure)
- [Technology Stack](#-technology-stack)
- [Application Components](#-application-components)
- [User Roles](#-user-roles)
- [Authentication](#-authentication)
- [Database](#-database)
- [API](#-api)
- [Mobile Application](#-mobile-application)
- [Shared Packages](#-shared-packages)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Development](#-database-development)
- [Running the Project](#-running-the-project)
- [Git Workflow](#-git-workflow)
- [Production Architecture](#-production-architecture)
- [Deployment](#-deployment)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

# 🌊 Overview

CraveWave is designed to provide a complete food-delivery experience from restaurant discovery to order fulfillment.

The platform consists of three primary layers:

```text
┌──────────────────────────────────────────────┐
│                  CRAVEWAVE                   │
├──────────────────────────────────────────────┤
│                                              │
│              Mobile Application              │
│            Expo / React Native               │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│                  Backend API                 │
│                   NestJS                     │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│                 PostgreSQL                   │
│                    Neon                      │
│                                              │
└──────────────────────────────────────────────┘
```

The mobile application communicates with the backend through HTTP APIs.

The backend is responsible for authentication, authorization, business logic, restaurant management, ordering, and database access.

The PostgreSQL database stores persistent application data.

---

# ✨ Features

CraveWave is being developed with the following capabilities.

## 👤 Customer Features

- Customer registration
- Customer login
- JWT-based authentication
- Restaurant discovery
- Restaurant browsing
- Menu browsing
- Food item discovery
- Cart management
- Order creation
- Order tracking
- Order history
- Customer profile management

---

## 🏪 Restaurant Owner Features

Restaurant owners can manage their restaurants through dedicated owner functionality.

Planned/implemented capabilities include:

- Restaurant owner authentication
- Restaurant creation
- Restaurant profile management
- Restaurant information updates
- Restaurant image management
- Menu management
- Food item creation
- Food item updates
- Food item deletion
- Order management
- Restaurant-specific order visibility

---

## 🔐 Authentication & Authorization

CraveWave uses JWT-based authentication.

The backend verifies authentication tokens before allowing access to protected resources.

Authorization is role-based.

Current application roles include:

```text
CUSTOMER
OWNER
```

Additional roles may be introduced as the application grows.

The general authorization flow is:

```text
User
 │
 │ Login
 ▼
NestJS API
 │
 │ Validate credentials
 ▼
JWT
 │
 │ Stored by client
 ▼
Authenticated requests
 │
 ▼
JWT Auth Guard
 │
 ▼
Role / permission checks
 │
 ▼
Protected resource
```

---

# 🏗 Architecture

CraveWave uses a monorepo architecture.

The repository contains the backend, mobile application, and shared packages in one Git repository.

```text
                         ┌──────────────────┐
                         │     GitHub       │
                         │    Monorepo      │
                         └────────┬─────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
                ▼                 ▼                 ▼
          ┌───────────┐     ┌───────────┐     ┌───────────┐
          │    API    │     │   Mobile  │     │  Shared   │
          │  NestJS   │     │   Expo    │     │ Packages  │
          └─────┬─────┘     └─────┬─────┘     └───────────┘
                │                 │
                │                 │
                ▼                 │
          ┌───────────┐           │
          │ PostgreSQL│◄──────────┘
          │   Neon    │
          └───────────┘
```

---

# 📁 Monorepo Structure

The repository is organized approximately as follows:

```text
crave-wave/
│
├── apps/
│   │
│   ├── api/
│   │   ├── src/
│   │   ├── test/
│   │   ├── package.json
│   │   └── ...
│   │
│   └── mobile/
│       ├── app/
│       ├── components/
│       ├── store/
│       ├── assets/
│       ├── package.json
│       └── ...
│
├── packages/
│   │
│   └── types/
│       ├── src/
│       ├── package.json
│       └── ...
│
├── package.json
├── pnpm-workspace.yaml
├── README.md
└── .gitignore
```

> The exact directory structure may evolve as development continues.

---

# 🧰 Technology Stack

## Frontend / Mobile

- **React Native**
- **Expo**
- **Expo Router**
- **TypeScript**
- **Zustand** for client-side state management

---

## Backend

- **NestJS**
- **Node.js**
- **TypeScript**
- **Express**
- **JWT authentication**

---

## Database

- **PostgreSQL**
- **Neon**
- **Drizzle ORM**

---

## Development & Infrastructure

- **Git**
- **GitHub**
- **pnpm**
- **Monorepo architecture**
- **Render** — planned backend hosting
- **Expo EAS** — planned mobile application builds

---

# 📱 Mobile Application

The mobile client is built using Expo and React Native.

The application uses Expo Router for file-based navigation.

The mobile application communicates with the backend API rather than accessing the database directly.

```text
Mobile Application
       │
       │ HTTP / HTTPS
       ▼
    NestJS API
       │
       │
       ▼
 PostgreSQL
```

The mobile application should never contain database credentials.

---

# 🧩 Backend API

The backend is built with NestJS.

Its responsibilities include:

- Authentication
- Authorization
- User management
- Restaurant management
- Menu management
- Order management
- File/image upload handling
- Database access
- Validation
- API error handling
- Business rules

A typical request follows this flow:

```text
HTTP Request
     │
     ▼
Controller
     │
     ▼
Guard / Authentication
     │
     ▼
Validation
     │
     ▼
Service
     │
     ▼
Drizzle ORM
     │
     ▼
PostgreSQL
```

---

# 🗄 Database

CraveWave uses PostgreSQL hosted by Neon.

The application backend connects to Neon through a database connection string.

Conceptually:

```text
NestJS
   │
   │ DATABASE_URL
   ▼
Neon PostgreSQL
```

The database connection string must never be committed to the repository.

Database credentials should be supplied through environment variables.

---

# 🔗 Shared Packages

The monorepo allows functionality to be shared between applications.

For example, shared TypeScript types can be stored in:

```text
packages/types
```

The purpose of shared packages is to prevent duplicate definitions between the backend and mobile application.

For example:

```text
packages/types
       │
       ├──────────────► NestJS API
       │
       └──────────────► Expo Mobile
```

This allows both applications to use consistent definitions for concepts such as:

- User roles
- Restaurant data
- Menu items
- Orders
- API response types
- Other shared domain models

---

# ⚙️ Prerequisites

Before running CraveWave locally, install:

- Node.js
- pnpm
- Git
- Expo tooling
- A PostgreSQL/Neon database
- An Android or iOS development environment, or a physical mobile device for Expo development

Check your installations:

```bash
node --version
pnpm --version
git --version
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/crave-wave.git
```

Move into the project:

```bash
cd crave-wave
```

---

## 2. Install dependencies

From the monorepo root:

```bash
pnpm install
```

This installs dependencies for the workspace.

---

## 3. Configure environment variables

The backend requires environment variables for local development.

Create the appropriate environment file inside the API application.

For example:

```text
apps/api/.env
```

Example:

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret
```

Do not commit real credentials.

---

# 🔐 Environment Variables

Environment variables should be used for secrets and environment-specific configuration.

Typical backend variables may include:

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
PORT=
CORS_ORIGIN=
```

The exact variables may change as the application develops.

For the mobile application, public configuration values may use Expo's public environment variable convention.

For example:

```env
EXPO_PUBLIC_API_URL=
```

### Important

Never store secrets such as:

- Database passwords
- JWT secrets
- API secret keys
- Private credentials
- Production tokens

inside source code or committed `.env` files.

---

# 🗃 Database Development

CraveWave uses Drizzle ORM for database interaction and schema management.

When database schemas change, migrations should be generated and applied appropriately.

A typical development workflow is:

```text
Modify schema
     │
     ▼
Generate migration
     │
     ▼
Review migration
     │
     ▼
Apply migration
```

Production migrations should be handled carefully.

Never experiment directly against the production database without first understanding the migration being executed.

---

# ▶️ Running the Project

The exact scripts depend on the current workspace configuration.

The intended development workflow is:

### Start the API

From the monorepo:

```bash
pnpm <api-development-command>
```

### Start the mobile application

```bash
pnpm <mobile-development-command>
```

Or run the appropriate Expo command from the mobile application workspace.

> These commands will be documented precisely once the workspace scripts are finalized.

---

# 🧪 Testing

Testing will cover the different layers of the application.

Potential testing areas include:

- Unit tests
- Service tests
- Controller tests
- Authentication tests
- Authorization tests
- API integration tests
- Mobile UI tests
- End-to-end testing

Backend tests should verify important business rules independently from the mobile application.

---

# 🌿 Git Workflow

CraveWave uses a single Git repository for the entire monorepo.

```text
crave-wave/
│
├── apps/api
├── apps/mobile
└── packages/
```

The repository root is the Git repository.

You do not need separate Git repositories for each application.

---

## Checking changes

From the monorepo root:

```bash
git status
```

---

## Adding changes

To add everything:

```bash
git add .
```

Or selectively add a specific application:

```bash
git add apps/api
```

---

## Creating a commit

```bash
git commit -m "Describe the change"
```

Examples:

```bash
git commit -m "Add restaurant creation endpoint"
```

```bash
git commit -m "Update restaurant owner dashboard"
```

```bash
git commit -m "Add shared order types"
```

---

## Push changes

```bash
git push
```

Because the repository is a monorepo, changes to the API, mobile application, or shared packages are all pushed to the same GitHub repository.

---

# 🚀 Production Architecture

The planned production architecture is:

```text
                         ┌──────────────────────┐
                         │       GitHub         │
                         │      Monorepo        │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
             ┌──────────────┐                ┌──────────────┐
             │    Render    │                │   Expo / EAS │
             │              │                │              │
             │  NestJS API  │                │ React Native │
             └───────┬──────┘                └──────────────┘
                     │
                     │ DATABASE_URL
                     ▼
             ┌──────────────┐
             │     Neon     │
             │ PostgreSQL   │
             └──────────────┘
```

The mobile application communicates with the public API over HTTPS.

The API communicates with Neon using a secure database connection.

---

# ☁️ Deployment

## Backend

The NestJS API is planned to be hosted using Render.

Render will deploy the backend from the monorepo while targeting the API application.

Conceptually:

```text
GitHub
   │
   ▼
Render
   │
   ▼
apps/api
   │
   ▼
NestJS
```

Production environment variables will be configured directly in the hosting provider rather than committed to Git.

---

## Database

The PostgreSQL database is hosted by Neon.

The production backend will connect to Neon using the production database connection string.

No database credentials should be stored in GitHub.

---

## Mobile Application

The mobile application is built using Expo and will use EAS for production builds.

The planned flow is:

```text
Expo Project
     │
     ▼
EAS Build
     │
     ▼
Android Build
```

The application can initially be distributed through development/testing methods before being published through an official app store.

---

# 🌍 Production Request Flow

A production customer request will conceptually follow this path:

```text
┌────────────────────┐
│  Customer's Phone  │
│                    │
│  Expo Application  │
└─────────┬──────────┘
          │
          │ HTTPS
          ▼
┌────────────────────┐
│      Render        │
│                    │
│    NestJS API      │
└─────────┬──────────┘
          │
          │ PostgreSQL
          ▼
┌────────────────────┐
│       Neon         │
│                    │
│    PostgreSQL      │
└────────────────────┘
```

---

# 🔒 Security

Security is an important part of the application architecture.

The following principles are followed:

### Secrets

Secrets must be stored in environment variables.

Never commit:

```text
.env
database credentials
JWT secrets
private API keys
```

---

### Authentication

Protected API routes use JWT-based authentication.

---

### Authorization

Authenticated users are authorized according to their application role.

For example, restaurant-owner functionality should not be accessible to ordinary customers.

---

### Validation

Incoming API data should be validated before being processed.

---

### CORS

The backend should only allow requests from appropriate client origins/environments.

CORS configuration will be finalized as the production deployment is configured.

---

# 🛣 Roadmap

The project roadmap may evolve as development continues.

## Phase 1 — Foundation

- [x] Monorepo setup
- [x] Backend application
- [x] Mobile application
- [x] Shared TypeScript types
- [x] PostgreSQL database
- [x] Neon database hosting
- [x] JWT authentication foundation
- [x] User roles

---

## Phase 2 — Restaurant Management

- [x] Restaurant creation
- [x] Restaurant retrieval
- [ ] Restaurant editing
- [ ] Restaurant deletion
- [ ] Restaurant image management
- [ ] Restaurant owner dashboard

---

## Phase 3 — Menu Management

- [ ] Menu categories
- [ ] Menu items
- [ ] Food images
- [ ] Item availability
- [ ] Pricing management

---

## Phase 4 — Customer Experience

- [ ] Restaurant discovery
- [ ] Restaurant details
- [ ] Menu browsing
- [ ] Cart
- [ ] Checkout
- [ ] Order creation
- [ ] Order history

---

## Phase 5 — Order Management

- [ ] Restaurant order dashboard
- [ ] Order status management
- [ ] Customer order tracking
- [ ] Order notifications

---

## Phase 6 — Production Deployment

- [ ] Production API deployment
- [ ] Production environment variables
- [ ] Production database migration workflow
- [ ] CORS configuration
- [ ] Production image storage
- [ ] Production API testing
- [ ] EAS production build
- [ ] Android distribution
- [ ] Monitoring and logging

---

# 🤝 Contributing

CraveWave is currently primarily a personal development project.

If contribution is opened in the future, contributors should:

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes.
4. Run tests and checks.
5. Commit changes using clear commit messages.
6. Open a pull request.

Example:

```bash
git checkout -b feature/restaurant-search
```

Make changes, then:

```bash
git add .
git commit -m "Add restaurant search"
git push origin feature/restaurant-search
```

---

# 📄 License

License information will be added when the project license is finalized.

---

# 👨‍💻 Development Philosophy

CraveWave is being developed with an emphasis on:

- Clear separation of concerns
- Type safety
- Reusable shared types
- Secure authentication
- Role-based authorization
- Maintainable backend architecture
- Scalable database design
- Reusable mobile components
- Consistent API contracts
- Production-ready deployment practices

The project will evolve incrementally, with development and deployment concerns being introduced as the corresponding application features become stable.

---

# 🌊 CraveWave

**A full-stack food delivery platform built with TypeScript, NestJS, Expo, React Native, Drizzle, and PostgreSQL.**
