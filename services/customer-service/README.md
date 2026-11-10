# Customer Service

Customer identity, profile management, saved addresses, public catalog reads, cart, and checkout microservice for the Multi-Vendor Marketplace.

## Features

- **Customer Identity & Authentication**: OTP-based authentication via OTP microservice, JWT generation with `customer` role.
- **Profile & Address Book**: Customer profile data and saved delivery addresses with default designation.
- **Public Catalog**: Filtered product discovery from approved vendors with pagination and search.
- **Persistent Cart**: Server-backed cart with product availability, vendor status, and stock checks.
- **Orders & Checkout**: Multi-vendor distributed order creation with inventory deduction and cancellation.

## Default Local Configuration

- **Port**: `3002` (configurable via `PORT` in `.env`)
- **Database**: MongoDB (`MONGO_URI=mongodb://localhost:27017/`)
- **OTP Service Dependency**: `http://localhost:3000` (`OTP_SERVICE_URL`)

## Local Development

```powershell
cd services/customer-service
npm run dev
```

## Running Tests

```powershell
npm test
```

