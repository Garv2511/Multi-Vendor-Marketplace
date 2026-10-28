# Current architecture

## Applications

### Frontend

`frontend/marketplace-ui` is a React, TypeScript, and Vite application. Its
authentication and vendor profile screens call the vendor service. Catalogue,
cart, checkout, order, and payout screens currently use seeded data and
browser `localStorage`.

### Vendor service

`services/vendor-service` is an Express and MongoDB application on port 3001.
It owns:

- users and roles
- vendor registration
- vendor profiles
- KYC upload metadata
- vendor approval and rejection
- JWT authentication

It calls the OTP service over HTTP for OTP request, resend, and verification.

### OTP service

`services/otp-service` is an Express application on port 3000. It owns:

- OTP generation and hashing
- Redis-backed expiration
- verification attempt limits
- resend limits and cooldowns
- SMTP delivery

It does not issue marketplace JWTs or create vendor records.

## Current integration

```text
frontend
   │
   └── HTTP ──> vendor-service (:3001)
                    │
                    ├── MongoDB
                    └── HTTP ──> otp-service (:3000)
                                      │
                                      ├── Redis
                                      └── SMTP
```

The directory reorganization does not change these ports, route paths, or
service responsibilities.

## Not implemented as backend services yet

- catalogue/product API
- persistent customer cart
- order and vendor sub-order API
- payment provider integration
- refund processing
- payout settlement
- message broker
- API gateway
