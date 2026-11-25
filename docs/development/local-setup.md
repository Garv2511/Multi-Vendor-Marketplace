# Local development setup

## Prerequisites

- Node.js 20 or a compatible current Node.js release
- npm
- MongoDB
- Redis
- SMTP credentials for sending OTP email

## Start the OTP service

```powershell
cd services\otp-service
npm install
npm run dev
```

The OTP service uses `services\otp-service\.env` (default port `3000`).

## Start the vendor service

```powershell
cd services\vendor-service
npm install
npm run dev
```

The vendor service uses `services\vendor-service\.env` (default port `3001`). Its
`OTP_SERVICE_URL` should point to `http://localhost:3000`.

## Start the customer service

```powershell
cd services\customer-service
npm install
npm run dev
```

The customer service uses `services\customer-service\.env` (default port `3002`).

## Start the order service

```powershell
cd services\order-service
npm install
npm run dev
```

The order service uses `services\order-service\.env` (default port `3003`).

## Start the frontend

```powershell
cd frontend\marketplace-ui
npm install
npm run dev
```

The frontend uses `frontend\marketplace-ui\.env.local`:
- `VITE_VENDOR_SERVICE_URL=http://localhost:3001`
- `VITE_CUSTOMER_SERVICE_URL=http://localhost:3002`
- `VITE_ORDER_SERVICE_URL=http://localhost:3003`

## Basic checks

```powershell
Invoke-WebRequest http://localhost:3000/
Invoke-WebRequest http://localhost:3001/health
Invoke-WebRequest http://localhost:3002/health
Invoke-WebRequest http://localhost:3003/health
```
