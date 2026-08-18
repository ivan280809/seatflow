# SeatFlow

SeatFlow is a learning project for building an event-driven seat reservation platform with
Node.js, TypeScript, NestJS, Java, and Spring Boot. The platform will coordinate seat availability,
reservations, payments, notifications, and analytics while the application code is implemented
incrementally.

## Business problem

SeatFlow models the flow of reserving seats for an event in a distributed system. A client should
be able to request seats, receive a consistent reservation result, and safely retry a request when
the network or a downstream service fails. The system will later separate the reservation API from
payment, notification, and analytics workers, so the domain rules must remain independent of those
technical components.

## Domain invariants

The domain must preserve these rules regardless of which application or worker invokes it:

- Available capacity can never be negative.
- A confirmed reservation does not expire.
- Repeating the same idempotent request does not create a second effect.

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

The pnpm workspace includes the three Node.js applications and all shared packages. The Java
analytics projection is intentionally kept outside pnpm workspaces.

## Requirements

- Node.js 24
- pnpm 11
- Java version to be selected when `analytics-projection` is created

## Quality commands

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The root scripts define the CI contract for formatting, linting, type checking, tests, and builds.
As applications are created, their TypeScript configurations can extend `tsconfig.base.json` and be
registered as project references in `tsconfig.json`.

## Start working

```bash
git clone https://github.com/ivan280809/seatflow.git
cd seatflow
nvm use
corepack enable
pnpm install --frozen-lockfile
git switch -c feature/first-slice
idea .
```

If Node.js 24 is not installed through NVM, run `nvm install 24` before `nvm use`.

On Windows, if `idea` is not recognized, add IntelliJ IDEA's `bin` directory to `PATH` and use `idea64.exe .`.
