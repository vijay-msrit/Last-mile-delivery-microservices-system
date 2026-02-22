# 📬 Postman API Testing Guide - Delivery System Microservices

## 🎯 Overview
This guide provides complete API endpoint testing via **API Gateway (Port 8080)** and direct service access.

---

## 📋 Table of Contents
1. [Service Ports](#service-ports)
2. [User Service APIs](#1-user-service-apis)
3. [Driver Service APIs](#2-driver-service-apis)
4. [Order Service APIs](#3-order-service-apis)
5. [Tracking Service APIs](#4-tracking-service-apis)
6. [Testing Workflow](#5-complete-testing-workflow)
7. [Postman Collection Setup](#6-postman-collection-setup)

---

## 🔌 Service Ports

| Service | Port | API Gateway Route |
|---------|------|-------------------|
| **API Gateway** | 8080 | - |
| **Eureka Server** | 8761 | - |
| **User Service** | 8085 | `/user-service/**` |
| **Order Service** | 8081 | `/orders/**` |
| **Driver Service** | 8082 | `/driver-service/**` |
| **Tracking Service** | 8084 | `/tracking-service/**` |
| **Logistics Service** | 8083 | (Internal - Kafka Consumer) |
| **Notification Service** | 8086 | (Internal - Kafka Consumer) |

---

## 🧪 1. User Service APIs

### Base URL via Gateway
```
http://localhost:8080/user-service
```

### 1.1 Register User
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

**Via API Gateway:**
```
POST http://localhost:8080/user-service/api/auth/register
```

**Direct Access:**
```
POST http://localhost:8085/api/auth/register
```

**Expected Response:**
```json
"User Registered"
```

---

### 1.2 Login User
**Endpoint:** `POST /api/auth/login`

**Request Params:**
- `email`: john@example.com
- `password`: password123

**Via API Gateway:**
```
POST http://localhost:8080/user-service/api/auth/login?email=john@example.com&password=password123
```

**Direct Access:**
```
POST http://localhost:8085/api/auth/login?email=john@example.com&password=password123
```

**Expected Response:**
```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
(JWT Token - Save this for authentication in other services if needed)

---

## 🚗 2. Driver Service APIs

### Base URL via Gateway
```
http://localhost:8080/driver-service
```

### 2.1 Register Driver
**Endpoint:** `POST /api/drivers/register`

**Request Body:**
```json
{
  "name": "Mike Driver",
  "vehicleNumber": "MH-12-AB-1234",
  "phone": "9876543210",
  "lastLat": 19.0760,
  "lastLng": 72.8777
}
```

**Via API Gateway:**
```
POST http://localhost:8080/driver-service/api/drivers/register
```

**Direct Access:**
```
POST http://localhost:8082/api/drivers/register
```

**Expected Response:**
```json
{
  "id": 1,
  "name": "Mike Driver",
  "vehicleNumber": "MH-12-AB-1234",
  "lastLat": 19.0760,
  "lastLng": 72.8777,
  "available": false
}
```

---

### 2.2 Toggle Driver Status (Make Available/Unavailable)
**Endpoint:** `PATCH /api/drivers/{id}/status`

**Via API Gateway:**
```
PATCH http://localhost:8080/driver-service/api/drivers/1/status
```

**Direct Access:**
```
PATCH http://localhost:8082/api/drivers/1/status
```

**Expected Response:**
```json
{
  "id": 1,
  "name": "Mike Driver",
  "vehicleNumber": "MH-12-AB-1234",
  "lastLat": 19.0760,
  "lastLng": 72.8777,
  "available": true
}
```

---

### 2.3 Update Driver Location
**Endpoint:** `PATCH /api/drivers/{id}/location`

**Request Params:**
- `lat`: 19.0820
- `lng`: 72.8850

**Via API Gateway:**
```
PATCH http://localhost:8080/driver-service/api/drivers/1/location?lat=19.0820&lng=72.8850
```

**Direct Access:**
```
PATCH http://localhost:8082/api/drivers/1/location?lat=19.0820&lng=72.8850
```

**Expected Response:**
```json
{
  "id": 1,
  "name": "Mike Driver",
  "vehicleNumber": "MH-12-AB-1234",
  "lastLat": 19.0820,
  "lastLng": 72.8850,
  "available": true
}
```

---

### 2.4 Send GPS Event to Kafka
**Endpoint:** `POST /api/drivers/{id}/gps`

**Request Params:**
- `lat`: 19.0900
- `lng`: 72.8900

**Via API Gateway:**
```
POST http://localhost:8080/driver-service/api/drivers/1/gps?lat=19.0900&lng=72.8900
```

**Direct Access:**
```
POST http://localhost:8082/api/drivers/1/gps?lat=19.0900&lng=72.8900
```

**Expected Response:**
```json
"GPS sent to Kafka"
```

---

### 2.5 Get Available Drivers
**Endpoint:** `GET /api/drivers/available`

**Via API Gateway:**
```
GET http://localhost:8080/driver-service/api/drivers/available
```

**Direct Access:**
```
GET http://localhost:8082/api/drivers/available
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Mike Driver",
    "vehicleNumber": "MH-12-AB-1234",
    "lastLat": 19.0820,
    "lastLng": 72.8850,
    "available": true
  }
]
```

---

### 2.6 Mark Order as Picked Up
**Endpoint:** `POST /api/drivers/{driverId}/orders/{orderId}/pickup`

**Via API Gateway:**
```
POST http://localhost:8080/driver-service/api/drivers/1/orders/1/pickup
```

**Direct Access:**
```
POST http://localhost:8082/api/drivers/1/orders/1/pickup
```

**Expected Response:**
```json
"Order marked as picked up"
```

---

### 2.7 Mark Order as Delivered
**Endpoint:** `POST /api/drivers/{driverId}/orders/{orderId}/delivered`

**Via API Gateway:**
```
POST http://localhost:8080/driver-service/api/drivers/1/orders/1/delivered
```

**Direct Access:**
```
POST http://localhost:8082/api/drivers/1/orders/1/delivered
```

**Expected Response:**
```json
"Order marked as delivered"
```

---

## 📦 3. Order Service APIs

### Base URL via Gateway
```
http://localhost:8080/orders
```

### 3.1 Create Order
**Endpoint:** `POST /api/orders`

**Request Body:**
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

**Via API Gateway:**
```
POST http://localhost:8080/orders/api/orders
```

**Direct Access:**
```
POST http://localhost:8081/api/orders
```

**Expected Response:**
```json
{
  "id": 1,
  "customerName": "John Doe",
  "pickupAddress": "123 Main St, Mumbai",
  "deliveryAddress": "456 Park Ave, Mumbai",
  "pickupLat": 19.0760,
  "pickupLng": 72.8777,
  "deliveryLat": 19.1234,
  "deliveryLng": 72.9012,
  "status": "PENDING",
  "createdAt": "2026-02-22T10:00:00"
}
```

---

### 3.2 Assign Driver to Order
**Endpoint:** `PATCH /api/orders/{id}/assign`

**Request Params:**
- `driverId`: 1

**Via API Gateway:**
```
PATCH http://localhost:8080/orders/api/orders/1/assign?driverId=1
```

**Direct Access:**
```
PATCH http://localhost:8081/api/orders/1/assign?driverId=1
```

**Expected Response:**
```json
{
  "id": 1,
  "customerName": "John Doe",
  "pickupAddress": "123 Main St, Mumbai",
  "deliveryAddress": "456 Park Ave, Mumbai",
  "driverId": 1,
  "status": "ASSIGNED",
  "createdAt": "2026-02-22T10:00:00"
}
```

---

### 3.3 Update Order Status
**Endpoint:** `PATCH /api/orders/{id}/status`

**Request Params:**
- `status`: PICKED_UP (Options: PENDING, ASSIGNED, PICKED_UP, DELIVERED, CANCELLED)

**Via API Gateway:**
```
PATCH http://localhost:8080/orders/api/orders/1/status?status=PICKED_UP
```

**Direct Access:**
```
PATCH http://localhost:8081/api/orders/1/status?status=PICKED_UP
```

**Expected Response:**
```json
{
  "id": 1,
  "customerName": "John Doe",
  "pickupAddress": "123 Main St, Mumbai",
  "deliveryAddress": "456 Park Ave, Mumbai",
  "driverId": 1,
  "status": "PICKED_UP",
  "createdAt": "2026-02-22T10:00:00"
}
```

---

### 3.4 Get All Orders
**Endpoint:** `GET /api/orders`

**Via API Gateway:**
```
GET http://localhost:8080/orders/api/orders
```

**Direct Access:**
```
GET http://localhost:8081/api/orders
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "customerName": "John Doe",
    "pickupAddress": "123 Main St, Mumbai",
    "deliveryAddress": "456 Park Ave, Mumbai",
    "driverId": 1,
    "status": "PICKED_UP",
    "createdAt": "2026-02-22T10:00:00"
  }
]
```

---

## 📍 4. Tracking Service APIs

### Base URL via Gateway
```
http://localhost:8080/tracking-service
```

### 4.1 Get Driver Location
**Endpoint:** `GET /tracking/{driverId}`

**Via API Gateway:**
```
GET http://localhost:8080/tracking-service/tracking/1
```

**Direct Access:**
```
GET http://localhost:8084/tracking/1
```

**Expected Response:**
```json
"{\"driverId\":1,\"lat\":19.0900,\"lng\":72.8900}"
```

---

## 🔄 5. Complete Testing Workflow

Follow this sequence to test the entire system end-to-end:

### Step 1️⃣: Register Users
```
POST http://localhost:8080/user-service/api/auth/register
Body: { "name": "John Doe", "email": "john@example.com", "password": "pass123", "role": "CUSTOMER" }
```

### Step 2️⃣: Register Driver
```
POST http://localhost:8080/driver-service/api/drivers/register
Body: { "name": "Mike Driver", "vehicleNumber": "MH-12-AB-1234", "phone": "9876543210", "lastLat": 19.0760, "lastLng": 72.8777 }
```

### Step 3️⃣: Make Driver Available
```
PATCH http://localhost:8080/driver-service/api/drivers/1/status
```

### Step 4️⃣: Create Order
```
POST http://localhost:8080/orders/api/orders
Body: { "customerName": "John Doe", "pickupAddress": "123 Main St", "deliveryAddress": "456 Park Ave", "pickupLat": 19.0760, "pickupLng": 72.8777, "deliveryLat": 19.1234, "deliveryLng": 72.9012 }
```

### Step 5️⃣: Assign Driver (Automatic via Logistics Service)
The Logistics Service will automatically assign an available driver when an order is created.
Or manually assign:
```
PATCH http://localhost:8080/orders/api/orders/1/assign?driverId=1
```

### Step 6️⃣: Driver Updates Location
```
POST http://localhost:8080/driver-service/api/drivers/1/gps?lat=19.0820&lng=72.8850
```

### Step 7️⃣: Driver Picks Up Order
```
POST http://localhost:8080/driver-service/api/drivers/1/orders/1/pickup
```

### Step 8️⃣: Track Driver Location
```
GET http://localhost:8080/tracking-service/tracking/1
```

### Step 9️⃣: Driver Delivers Order
```
POST http://localhost:8080/driver-service/api/drivers/1/orders/1/delivered
```

### Step 🔟: Verify Order Status
```
GET http://localhost:8080/orders/api/orders
```

---

## 📋 6. Postman Collection Setup

### Method 1: Manual Setup in Postman

1. **Create New Collection** → Name it "Delivery System Microservices"

2. **Create Folders:**
   - User Service
   - Driver Service
   - Order Service
   - Tracking Service

3. **Add Requests** from the endpoints above

4. **Set Environment Variables:**
   - Create new environment "Local Development"
   - Add variables:
     - `gateway_url`: http://localhost:8080
     - `user_service_port`: 8085
     - `order_service_port`: 8081
     - `driver_service_port`: 8082
     - `tracking_service_port`: 8084

5. **Use Variables in URLs:**
   - Example: `{{gateway_url}}/user-service/api/auth/register`

---

### Method 2: Import JSON Collection

Save this as `Delivery-System.postman_collection.json`:

```json
{
  "info": {
    "name": "Delivery System Microservices",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "User Service",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"pass123\",\"role\":\"CUSTOMER\"}"
            },
            "url": {
              "raw": "http://localhost:8080/user-service/api/auth/register",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["user-service", "api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login User",
          "request": {
            "method": "POST",
            "url": {
              "raw": "http://localhost:8080/user-service/api/auth/login?email=john@example.com&password=pass123",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["user-service", "api", "auth", "login"],
              "query": [
                {"key": "email", "value": "john@example.com"},
                {"key": "password", "value": "pass123"}
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Driver Service",
      "item": [
        {
          "name": "Register Driver",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"Mike Driver\",\"vehicleNumber\":\"MH-12-AB-1234\",\"phone\":\"9876543210\",\"lastLat\":19.0760,\"lastLng\":72.8777}"
            },
            "url": {
              "raw": "http://localhost:8080/driver-service/api/drivers/register",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["driver-service", "api", "drivers", "register"]
            }
          }
        },
        {
          "name": "Toggle Driver Status",
          "request": {
            "method": "PATCH",
            "url": {
              "raw": "http://localhost:8080/driver-service/api/drivers/1/status",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["driver-service", "api", "drivers", "1", "status"]
            }
          }
        },
        {
          "name": "Get Available Drivers",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:8080/driver-service/api/drivers/available",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["driver-service", "api", "drivers", "available"]
            }
          }
        },
        {
          "name": "Send GPS Event",
          "request": {
            "method": "POST",
            "url": {
              "raw": "http://localhost:8080/driver-service/api/drivers/1/gps?lat=19.0900&lng=72.8900",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["driver-service", "api", "drivers", "1", "gps"],
              "query": [
                {"key": "lat", "value": "19.0900"},
                {"key": "lng", "value": "72.8900"}
              ]
            }
          }
        },
        {
          "name": "Mark Order Picked Up",
          "request": {
            "method": "POST",
            "url": {
              "raw": "http://localhost:8080/driver-service/api/drivers/1/orders/1/pickup",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["driver-service", "api", "drivers", "1", "orders", "1", "pickup"]
            }
          }
        },
        {
          "name": "Mark Order Delivered",
          "request": {
            "method": "POST",
            "url": {
              "raw": "http://localhost:8080/driver-service/api/drivers/1/orders/1/delivered",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["driver-service", "api", "drivers", "1", "orders", "1", "delivered"]
            }
          }
        }
      ]
    },
    {
      "name": "Order Service",
      "item": [
        {
          "name": "Create Order",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"customerName\":\"John Doe\",\"pickupAddress\":\"123 Main St\",\"deliveryAddress\":\"456 Park Ave\",\"pickupLat\":19.0760,\"pickupLng\":72.8777,\"deliveryLat\":19.1234,\"deliveryLng\":72.9012}"
            },
            "url": {
              "raw": "http://localhost:8080/orders/api/orders",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["orders", "api", "orders"]
            }
          }
        },
        {
          "name": "Assign Driver to Order",
          "request": {
            "method": "PATCH",
            "url": {
              "raw": "http://localhost:8080/orders/api/orders/1/assign?driverId=1",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["orders", "api", "orders", "1", "assign"],
              "query": [{"key": "driverId", "value": "1"}]
            }
          }
        },
        {
          "name": "Update Order Status",
          "request": {
            "method": "PATCH",
            "url": {
              "raw": "http://localhost:8080/orders/api/orders/1/status?status=PICKED_UP",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["orders", "api", "orders", "1", "status"],
              "query": [{"key": "status", "value": "PICKED_UP"}]
            }
          }
        },
        {
          "name": "Get All Orders",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:8080/orders/api/orders",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["orders", "api", "orders"]
            }
          }
        }
      ]
    },
    {
      "name": "Tracking Service",
      "item": [
        {
          "name": "Get Driver Location",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:8080/tracking-service/tracking/1",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["tracking-service", "tracking", "1"]
            }
          }
        }
      ]
    }
  ]
}
```

**To Import:**
1. Open Postman
2. Click **Import** button
3. Choose **File** → Select the JSON file
4. Click **Import**

---

## 🔍 Testing Tips

### 1. **Check Service Health**
- Eureka Dashboard: http://localhost:8761
- Verify all services are registered

### 2. **Test Direct vs Gateway**
- Test endpoints both directly and via API Gateway
- Gateway adds resilience and load balancing

### 3. **Monitor Kafka Events**
- Check console logs of Notification Service
- Check console logs of Logistics Service
- Verify Kafka events are being consumed

### 4. **Check Redis (Tracking)**
- After sending GPS events, check tracking endpoint
- Location should be updated in Redis

### 5. **Error Handling**
- Try invalid IDs to test error responses
- Try missing required fields
- Verify proper HTTP status codes

---

## ✅ Expected Flow

```
1. Register User → 200 OK
2. Register Driver → 200 OK (Driver ID: 1)
3. Toggle Driver Status → 200 OK (Available: true)
4. Create Order → 200 OK (Order ID: 1, Status: PENDING)
5. Auto Assignment → Logistics Service assigns driver
6. Send GPS → 200 OK (Kafka event published)
7. Track Location → 200 OK (Location from Redis)
8. Mark Picked Up → 200 OK (Kafka event → Notification)
9. Mark Delivered → 200 OK (Kafka event → Notification)
10. Get All Orders → 200 OK (Status: DELIVERED)
```

---

## 🐛 Troubleshooting

### Issue: Connection Refused
**Solution:** Make sure all services are running:
- Eureka Server (8761)
- API Gateway (8080)
- User Service (8085)
- Order Service (8081)
- Driver Service (8082)
- Tracking Service (8084)
- PostgreSQL (5432)
- Kafka (9092)
- Redis (6379)

### Issue: No Available Drivers
**Solution:** Toggle driver status to make them available before creating orders

### Issue: Tracking Returns Null
**Solution:** Send GPS event first using `/api/drivers/{id}/gps` endpoint

---

## 🎉 Success Criteria

✅ User can register and login  
✅ Driver can register and toggle availability  
✅ Order can be created  
✅ Driver is auto-assigned to order  
✅ Driver location is tracked  
✅ Order status updates work  
✅ Kafka events are consumed by Notification Service  
✅ All endpoints return proper responses  

---

**Happy Testing! 🚀**

