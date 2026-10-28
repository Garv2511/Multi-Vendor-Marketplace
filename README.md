# Multi-Vendor Marketplace

This repository contains the college project for a multi-vendor marketplace.
The applications are kept independently runnable so that authentication can
continue working while catalogue, orders, payments, and payouts are added
incrementally.

## Repository layout

```text
Multi-Vendor-Marketplace/
├── frontend/
│   └── marketplace-ui/      # React + TypeScript + Vite frontend
├── services/
│   ├── vendor-service/      # Vendor identity, profiles, KYC, and admin approval
│   └── otp-service/         # OTP generation, Redis storage, and email delivery
├── infrastructure/          # Container and reverse-proxy notes/configuration
├── docs/                    # Architecture and local-development documentation
└── .github/                 # Reserved for future GitHub workflows
```

The existing authentication flow is implemented by `vendor-service` and
`otp-service`. Product, cart, checkout, order, payment, and payout behavior is
currently prototype behavior in the frontend and is not yet backed by
independent backend services.

## Local development

Start the services from their own directories:

```powershell
cd services\otp-service
npm run dev
```

```powershell
cd services\vendor-service
npm run dev
```

Then start the frontend:

```powershell
cd frontend\marketplace-ui
npm run dev
```

The default local ports are:

| Application | Port |
|---|---:|
| OTP service | 3000 |
| Vendor service | 3001 |
| Vite frontend | 5173 |

MongoDB and Redis must be available locally. Environment files remain inside
their owning service directories and must not be committed.

See [current architecture](docs/architecture/current-state.md) and
[local setup](docs/development/local-setup.md) for more context.
