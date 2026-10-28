# Customer API Contract

This document reflects the current implementation in `services/vendor-service`.
The base URL is the vendor service URL, normally `http://localhost:3001`.
The OTP service is an internal dependency and is not called directly by the
customer frontend.

In development, CORS defaults to open access for local testing. Production
deployments must set `CORS_ORIGIN` to the frontend origin; the service does not
serve uploaded KYC files as public static content.

## Authentication

Customer-protected endpoints require:

```http
Authorization: Bearer <JWT>
```

The JWT must have `role: "customer"`. Missing or invalid tokens return `401`;
valid tokens with another role return `403`.

Successful responses generally use `{ "message": "...", "data": ... }`.
Validation errors return `{ "message": "..." }`. Checkout availability errors
may also include a safe `details` array.

## Customer authentication

Request an OTP:

```http
POST /auth/customer/request-otp
Content-Type: application/json

{ "email": "buyer@example.com" }
```

Verify/register:

```http
POST /auth/customer/verify-otp
Content-Type: application/json

{ "email": "buyer@example.com", "otp": "123456", "displayName": "Buyer" }
```

The response contains a customer JWT and user object. Customer verification
rejects existing vendor/admin accounts with `409`. OTP delivery failures return
`503` through the vendor service. Real credentials and OTP values are never
part of this contract.

## Catalogue

These endpoints are public:

- `GET /catalog/products?page=1&pageSize=20&search=headphones`
- `GET /catalog/products/:productId`

Only products whose vendor currently has `status: "approved"` are returned.
`page` is a positive integer; `pageSize` is an integer from 1 to 50.
Invalid IDs or pagination return `400`; unavailable products return `404`.
List responses contain `items`, `page`, `pageSize`, `totalItems`, and
`totalPages`. Product prices and stock are authoritative current values.

## Profile and saved addresses

- `GET /customers/me`
- `PATCH /customers/me` with `{ "displayName": "Updated name" }`
- `GET /customers/me/addresses`
- `POST /customers/me/addresses`
- `GET /customers/me/addresses/:addressId`
- `PATCH /customers/me/addresses/:addressId`
- `DELETE /customers/me/addresses/:addressId`
- `PATCH /customers/me/addresses/:addressId/default`

Only `displayName` is editable on the profile. Address creation requires
`recipientName`, `phone`, `addressLine1`, `city`, `state`, `postalCode`, and
`country`; `addressLine2`, `label`, and `isDefault` are optional. Strings are
trimmed and length-limited. Address operations are scoped to the JWT customer.
The first address becomes default; deleting a default promotes the newest
remaining address. Protected or unknown fields return `400`.

## Cart

- `GET /cart`
- `POST /cart/items` with `{ "productId": "<ObjectId>", "quantity": 1 }`
- `PATCH /cart/items/:productId` with `{ "quantity": 1 }`
- `DELETE /cart/items/:productId`
- `DELETE /cart`

Quantities are positive integers. Product approval, current price, and current
stock are checked server-side. Cart totals are calculated from current product
data in `USD`; clients cannot set prices or totals. Quantity conflicts return
`409`. Cart mutation uses optimistic version checks and returns `409` after
repeated concurrent conflicts.

## Orders

- `POST /orders`
- `GET /orders?page=1&pageSize=20`
- `GET /orders/:orderId`
- `POST /orders/:orderId/cancel`

Checkout accepts either a validated `deliveryAddress` object or an owned
`savedAddressId`, never both. The server reloads the cart, products, and
approved vendors, calculates integer-cent totals, atomically decrements stock,
creates one multi-vendor order, and clears the cart.

Orders start with:

```json
{ "status": "pending", "paymentStatus": "pending", "currency": "USD" }
```

Supported order statuses are `pending`, `processing`, `completed`, and
`cancelled`. Supported payment statuses are `pending`, `paid`, `failed`, and
`refunded`; this milestone does not implement a payment gateway or mark
payments as successful. Cancellation is only allowed for a pending unpaid
order and restores inventory once.

Checkout and cancellation require MongoDB transaction support. If the
deployment does not support transactions, the service returns `503` without
claiming that an order was created.

## Vendor-facing integration surface

Public browsing uses only the catalogue endpoints above. Vendor product
management is separate: approved vendors use `/products`, `/products/my`, and
the product update/delete routes. Customer clients must not call vendor
management endpoints.

## Current limitations

There are no wishlist, review, commission, payout, or real payment endpoints.
MongoDB integration/concurrency behavior requires a dedicated test database
configured as a replica set; the repository's focused tests do not provide that
infrastructure.
