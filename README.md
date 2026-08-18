# SeatFlow

SeatFlow is a learning project for building an event-driven seat reservation platform with
Node.js, TypeScript, NestJS, Java, and Spring Boot. This repository currently contains only the
monorepo structure, shared development configuration, and continuous integration workflow; the
application code will be implemented incrementally.

## Repository structure

```text
seatflow/
├── apps/
│   ├── reservation-api/       # NestJS
│   ├── payment-worker/        # Node.js + TypeScript
│   ├── notification-worker/   # Node.js + TypeScript
│   └── analytics-projection/  # Java + Spring Boot
├── packages/
│   ├── domain/
│   ├── contracts/
│   ├── observability/
│   └── test-support/
├── infra/
│   ├── docker/
│   └── terraform/
├── load-tests/
├── docs/
└── .github/workflows/
```

The npm workspace includes the three Node.js applications and all shared packages. The Java
analytics projection is intentionally kept outside npm workspaces.

## Requirements

- Node.js 24
- npm 11 or newer
- Java version to be selected when `analytics-projection` is created

## Quality commands

```bash
npm run format
npm run lint
npm run typecheck
npm test
npm run build
```

The root scripts define the CI contract for formatting, linting, type checking, tests, and builds.
As applications are created, their TypeScript configurations can extend `tsconfig.base.json` and be
registered as project references in `tsconfig.json`.

## Start working

```bash
git clone https://github.com/ivan280809/seatflow.git
cd seatflow
nvm use
npm ci
git switch -c feature/first-slice
idea .
```

If Node.js 24 is not installed through NVM, run `nvm install 24` before `nvm use`.

On Windows, if `idea` is not recognized, add IntelliJ IDEA's `bin` directory to `PATH` and use `idea64.exe .`.
