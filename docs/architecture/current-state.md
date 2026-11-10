# Current architecture

## Applications

### Frontend

`frontend/marketplace-ui` is a React, TypeScript, and Vite application running on port 5173.
- It calls **Order Service** (`http://localhost:3003`) for all order creation, cancellation, status queries, and vendor order fulfillment.
- It calls **Vendor Service** (`http://localhost:3001`) for vendor onboarding, KYC, vendor product management, and admin reviews.
- It calls **Customer Service** (`http://localhost:3002`) for customer OTP authentication, profiles, saved addresses, catalog discovery, and cart management.

### Order service

`services/order-service` is an Express and MongoDB application on port 3003.
It owns:

- multi-vendor cart checkout processing
- atomic inventory deduction & restoration
- customer order creation and cancellation (`/orders`)
- vendor sub-order queries and status updates (`/vendor/orders`, `/vendor-data/orders`)
- order lifecycle management (`pending`, `processing`, `completed`, `cancelled`)

### Customer service

`services/customer-service` is an Express and MongoDB application on port 3002.
It owns:

- customer OTP authentication and customer profile registration
- customer profile updates (`/customers/me`)
- customer saved delivery address book (`/customers/me/addresses`)
- public product catalog discovery filtered strictly by vendor approval status (`/catalog/products`)
- customer cart persistence and validation (`/cart`)

It calls the OTP service over HTTP (`:3000`) for customer OTP generation and verification.

### Vendor service

`services/vendor-service` is an Express and MongoDB application on port 3001.
It owns:

- vendor and admin user identities & credentials
- vendor registration (`/register`)
- vendor profile and KYC upload metadata (`/vendor-data`)
- vendor approval and rejection (`/admin`)
- vendor product CRUD and image uploads (`/products`)
- vendor & admin JWT authentication

It calls the OTP service over HTTP (`:3000`) for vendor OTP verification.

### OTP service

`services/otp-service` is an Express application on port 3000. It owns:

- OTP generation and hashing
- Redis-backed expiration
- verification attempt limits
- resend limits and cooldowns
- SMTP delivery

## Service Integration

```text
                               frontend (:5173)
                   ┌──────────────────┼──────────────────┐
                   │ HTTP             │ HTTP             │ HTTP
                   ▼                  ▼                  ▼
         vendor-service (:3001) customer-service (:3002) order-service (:3003)
            │             │          │             │          │
            │ MongoDB     │ HTTP     │ MongoDB     │ HTTP     │ MongoDB
            │             ▼          │             ▼          │
            │       otp-service (:3000)      otp-service (:3000)
            │             │                        │
            │             ├── Redis                ├── Redis
            │             └── SMTP                 └── SMTP
            ▼                                      ▼          ▼
         Shared MongoDB (Users, Vendors, Products, Carts, SavedAddresses, Orders)
```
