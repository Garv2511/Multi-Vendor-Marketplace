# Order Service

Dedicated order processing, multi-vendor cart checkout, inventory deduction, order lifecycle tracking, and vendor fulfillment microservice.

## Capabilities

- **Multi-Vendor Checkout**: Atomic inventory deduction, multi-store sub-order grouping, and cart clearing.
- **Customer Order Tracking**: Order status tracking, order list pagination, and cancellation with stock restoration.
- **Vendor Fulfillment API**: Dedicated endpoints for vendors to inspect their sub-orders and update fulfillment statuses (`pending` -> `processing` -> `completed`).

## Default Local Configuration

- **Port**: `3003` (configurable via `PORT` in `.env`)
- **Database**: MongoDB (`MONGO_URI=mongodb://localhost:27017/`)
- **Shared Entities**: Reads approved `vendors`, `products`, `carts`, and writes `orders`.

## Endpoints

### Customer Endpoints
- `POST /orders`: Place multi-vendor order from cart
- `GET /orders?page=1&pageSize=20`: List customer orders
- `GET /orders/:orderId`: Get order details
- `POST /orders/:orderId/cancel`: Cancel pending order and restore stock

### Vendor Endpoints
- `GET /vendor/orders` (or `/orders/vendor`): List sub-orders containing products sold by the authenticated vendor
- `PATCH /vendor/orders/:orderId/status`: Update fulfillment status (`processing`, `completed`, `cancelled`)

## Local Development

```powershell
cd services/order-service
npm run dev
```

## Running Tests

```powershell
npm test
```

