# 🚀 Quick API Testing Reference Card

## 📌 Service Ports
- **API Gateway:** 8080
- **User Service:** 8085
- **Order Service:** 8081
- **Driver Service:** 8082
- **Tracking Service:** 8084
- **Eureka:** 8761

---

## ⚡ Quick Test Sequence

### 1️⃣ Register Driver
```bash
POST http://localhost:8080/driver-service/api/drivers/register
Body: {
  "name": "Mike Driver",
  "vehicleNumber": "MH-12-AB-1234",
  "phone": "9876543210",
  "lastLat": 19.0760,
  "lastLng": 72.8777
}
```

### 2️⃣ Make Driver Available
```bash
PATCH http://localhost:8080/driver-service/api/drivers/1/status
```

### 3️⃣ Create Order
```bash
POST http://localhost:8080/orders/api/orders
Body: {
  "customerName": "John Doe",
  "pickupAddress": "123 Main St",
  "deliveryAddress": "456 Park Ave",
  "pickupLat": 19.0760,
  "pickupLng": 72.8777,
  "deliveryLat": 19.1234,
  "deliveryLng": 72.9012
}
```

### 4️⃣ Send GPS
```bash
POST http://localhost:8080/driver-service/api/drivers/1/gps?lat=19.09&lng=72.89
```

### 5️⃣ Track Driver
```bash
GET http://localhost:8080/tracking-service/tracking/1
```

### 6️⃣ Mark Picked Up
```bash
POST http://localhost:8080/driver-service/api/drivers/1/orders/1/pickup
```

### 7️⃣ Mark Delivered
```bash
POST http://localhost:8080/driver-service/api/drivers/1/orders/1/delivered
```

### 8️⃣ Check Orders
```bash
GET http://localhost:8080/orders/api/orders
```

---

## 📋 All Endpoints Summary

### User Service (`/user-service`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login?email=...&password=...` | Login user |

### Driver Service (`/driver-service`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/drivers/register` | Register driver |
| PATCH | `/api/drivers/{id}/status` | Toggle availability |
| PATCH | `/api/drivers/{id}/location?lat=...&lng=...` | Update location |
| POST | `/api/drivers/{id}/gps?lat=...&lng=...` | Send GPS to Kafka |
| GET | `/api/drivers/available` | Get available drivers |
| POST | `/api/drivers/{driverId}/orders/{orderId}/pickup` | Mark picked up |
| POST | `/api/drivers/{driverId}/orders/{orderId}/delivered` | Mark delivered |

### Order Service (`/orders`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| PATCH | `/api/orders/{id}/assign?driverId=...` | Assign driver |
| PATCH | `/api/orders/{id}/status?status=...` | Update status |
| GET | `/api/orders` | Get all orders |

### Tracking Service (`/tracking-service`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tracking/{driverId}` | Get driver location |

---

## 🎯 Sample Data

### User Registration
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "pass123",
  "role": "CUSTOMER"
}
```

### Driver Registration
```json
{
  "name": "Mike Driver",
  "vehicleNumber": "MH-12-AB-1234",
  "phone": "9876543210",
  "lastLat": 19.0760,
  "lastLng": 72.8777
}
```

### Order Creation
```json
{
  "customerName": "John Doe",
  "pickupAddress": "123 Main St, Mumbai",
  "deliveryAddress": "456 Park Ave, Mumbai",
  "pickupLat": 19.0760,
  "pickupLng": 72.8777,
  "deliveryLat": 19.1234,
  "deliveryLng": 72.9012
}
```

---

## 🔧 Order Status Options
- `PENDING` - Order created
- `ASSIGNED` - Driver assigned
- `PICKED_UP` - Order picked up by driver
- `DELIVERED` - Order delivered
- `CANCELLED` - Order cancelled

---

## 📱 Import to Postman

1. Open Postman
2. Click **Import**
3. Select `Delivery-System.postman_collection.json`
4. Done! All endpoints ready to test

---

## ✅ Testing Checklist

- [ ] All services running (check Eureka at http://localhost:8761)
- [ ] PostgreSQL running (port 5432)
- [ ] Kafka running (port 9092)
- [ ] Redis running (port 6379)
- [ ] Register at least one driver
- [ ] Make driver available
- [ ] Create an order
- [ ] Send GPS events
- [ ] Track driver location
- [ ] Mark order picked up
- [ ] Mark order delivered
- [ ] Check Kafka consumers (logs in notification-service)

---

**🎉 Happy Testing!**

