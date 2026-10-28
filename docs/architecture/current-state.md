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
- customer profiles linked to user identities
- vendor registration
- vendor profiles
- KYC upload metadata
- vendor approval and rejection
- JWT authentication
- public product catalogue reads filtered by vendor approval

It calls the OTP service over HTTP for OTP request, resend, and verification.

Customer authentication uses the same vendor-service identity collection,
JWT secret, and OTP service. A dedicated customer OTP route assigns the
`customer` role only on the server and creates a separate customer profile
linked by `userId`; existing vendor and admin accounts cannot be converted.
The vendor service also exposes public `GET /catalog/products` and
`GET /catalog/products/:productId` reads. These endpoints join products to
vendors by `vendorId` and return only products whose vendor status is
`approved`.

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

- persistent customer cart
- order and vendor sub-order API
- payment provider integration
- refund processing
- payout settlement
- message broker
- API gateway
