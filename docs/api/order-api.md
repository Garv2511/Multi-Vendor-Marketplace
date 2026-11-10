# Order Service API Contract

This document specifies the contract for `services/order-service`.
The base URL is `http://localhost:3003` (configurable via `VITE_ORDER_SERVICE_URL`).

## Authentication

All order endpoints require a valid Bearer JWT:

```http
Authorization: Bearer <JWT>
```

- **Customer operations** require `role: "customer"`.
- **Vendor fulfillment operations** require `role: "vendor"` or `role: "admin"`.

---

## Customer Order Endpoints

### 1. Create Order (Checkout)
```http
POST /orders
Content-Type: application/json
Authorization: Bearer <Customer-JWT>

{
  "savedAddressId": "64b1f8e123456789abcdef01"
}
```
*Or with inline address:*
```http
POST /orders
Content-Type: application/json
Authorization: Bearer <Customer-JWT>

{
  "deliveryAddress": {
    "recipientName": "Jane Smith",
    "phone": "+1 555 1234",
    "addressLine1": "100 Market St",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94105",
    "country": "USA"
  }
}
```

### 2. List Customer Orders
```http
GET /orders?page=1&pageSize=20
Authorization: Bearer <Customer-JWT>
```

### 3. Get Order Details
```http
GET /orders/:orderId
Authorization: Bearer <Customer-JWT>
```

### 4. Cancel Order
```http
POST /orders/:orderId/cancel
Authorization: Bearer <Customer-JWT>
```

---

## Vendor Order Endpoints

### 1. List Vendor Orders
```http
GET /vendor/orders
Authorization: Bearer <Vendor-JWT>
```
*Alias: `GET /vendor-data/orders` or `GET /orders/vendor`*

Returns all sub-orders containing items sold by the authenticated vendor.

### 2. Update Vendor Order Status
```http
PATCH /vendor/orders/:orderId/status
Content-Type: application/json
Authorization: Bearer <Vendor-JWT>

{
  "status": "processing"
}
```
*Status values*: `processing`, `completed`, `cancelled`.

