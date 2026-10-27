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

The OTP service uses `services\otp-service\.env`. Use the existing local
environment file or create one from the variables documented in the service
README. Do not commit the file.

## Start the vendor service

```powershell
cd services\vendor-service
npm install
npm run dev
```

The vendor service uses `services\vendor-service\.env`. Its
`OTP_SERVICE_URL` should point to the running OTP service, which defaults to
`http://localhost:3000`.

## Start the frontend

```powershell
cd frontend\marketplace-ui
npm install
npm run dev
```

The frontend defaults to `http://localhost:3001` for the vendor service. This
can be overridden with the existing Vite environment variable
`VITE_VENDOR_SERVICE_URL`.

## Basic checks

```powershell
Invoke-WebRequest http://localhost:3000/
Invoke-WebRequest http://localhost:3001/health
```

After both services respond, verify OTP login, vendor registration, profile
loading, and KYC upload through the frontend.
