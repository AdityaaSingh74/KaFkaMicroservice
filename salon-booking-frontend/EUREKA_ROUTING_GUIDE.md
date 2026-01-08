# 🚀 Eureka Service Routing Guide

**Date:** January 7, 2026  
**Version:** 2.0  
**Status:** ✅ Fully Configured

---

## 🎯 Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React - Port 5173)                  │
│                   http://localhost:5173                           │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                    API Requests
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│              SPRING CLOUD GATEWAY (Port 8862)                    │
│                http://localhost:8862                             │
└──────────────────────────┬───────────────────────────────────────┘
                           │
         Queries Eureka for service location
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    EUREKA SERVER (Port 8761)                     │
│                 http://localhost:8761                            │
│                                                                  │
│  Registered Services:                                           │
│  ✅ USER-SERVICE (8001)                                        │
│  ✅ SALON-SERVICE (8002)                                       │
│  ✅ SERVICE-OFFERING (8003)                                    │
│  ✅ CATEGORY-SERVICE (8004)                                    │
│  ✅ BOOKING-SERVICE (8005)                                     │
│  ✅ PAYMENT-SERVICE (8006)                                     │
│  ✅ NOTIFICATION-SERVICE (8007)                                │
└──────────────────────────┬───────────────────────────────────────┘
                           │
      Routes to appropriate microservice
                           │
                ┌──────────┼──────────┐
                ▼          ▼          ▼
          SERVICE-1  SERVICE-2  SERVICE-N
```

---

## 📋 Routing Pattern

### CRITICAL RULE:
```
Gateway URL Format: http://localhost:8862/{EUREKA-SERVICE-NAME}/api/{endpoint}
                                           ^^^^^^^^^^^^^^^^^^^^^^^^
                                           Must include service name!
```

### ❌ WRONG (Will Return 404):
```
http://localhost:8862/api/salons
http://localhost:8862/api/users/login
http://localhost:8862/api/bookings
```

### ✅ CORRECT (Will Work):
```
http://localhost:8862/salons/api/salons
http://localhost:8862/users/api/users/login
http://localhost:8862/bookings/api/bookings
```

---

## 🗺️ Service Routing Map

| Service | Eureka Name | Port | Frontend Prefix | Example Endpoint |
|---------|-------------|------|-----------------|------------------|
| **User Service** | USER-SERVICE | 8001 | `/users/api` | `http://localhost:8862/users/api/users/login` |
| **Salon Service** | SALON-SERVICE | 8002 | `/salons/api` | `http://localhost:8862/salons/api/salons` |
| **Service Offering** | SERVICE-OFFERING | 8003 | `/services/api` | `http://localhost:8862/services/api/services` |
| **Category Service** | CATEGORY-SERVICE | 8004 | `/categories/api` | `http://localhost:8862/categories/api/categories` |
| **Booking Service** | BOOKING-SERVICE | 8005 | `/bookings/api` | `http://localhost:8862/bookings/api/bookings` |
| **Payment Service** | PAYMENT-SERVICE | 8006 | `/payments/api` | `http://localhost:8862/payments/api/payments` |
| **Notification Service** | NOTIFICATION-SERVICE | 8007 | `/notifications/api` | `http://localhost:8862/notifications/api/notifications` |

---

## 📞 Complete API Endpoint Reference

### USER SERVICE
```
POST   /users/api/users/register        → Register new user
POST   /users/api/users/login           → Login user
GET    /users/api/users/{userId}        → Get user profile
PUT    /users/api/users/{userId}        → Update user profile
POST   /users/api/users/logout          → Logout user
```

### SALON SERVICE
```
GET    /salons/api/salons               → List all salons (paginated)
GET    /salons/api/salons/{id}          → Get salon details
GET    /salons/api/salons/search        → Search salons
POST   /salons/api/salons               → Create salon (requires auth)
PUT    /salons/api/salons/{id}          → Update salon (requires auth)
DELETE /salons/api/salons/{id}          → Delete salon (requires auth)
```

### SERVICE OFFERING SERVICE
```
GET    /services/api/services           → List all services
GET    /services/api/services/{id}      → Get service details
GET    /services/api/salons/{salonId}/services  → Get services by salon
GET    /services/api/services/category/{categoryId} → Get services by category
POST   /services/api/services           → Create service (requires auth)
PUT    /services/api/services/{id}      → Update service (requires auth)
DELETE /services/api/services/{id}      → Delete service (requires auth)
```

### CATEGORY SERVICE
```
GET    /categories/api/categories       → List all categories
GET    /categories/api/categories/{id}  → Get category details
POST   /categories/api/categories       → Create category (requires auth)
PUT    /categories/api/categories/{id}  → Update category (requires auth)
DELETE /categories/api/categories/{id}  → Delete category (requires auth)
```

### BOOKING SERVICE
```
POST   /bookings/api/bookings           → Create booking
GET    /bookings/api/bookings/{id}      → Get booking details
GET    /bookings/api/users/{userId}/bookings      → Get user bookings
GET    /bookings/api/salons/{salonId}/bookings    → Get salon bookings
PUT    /bookings/api/bookings/{id}      → Update booking
POST   /bookings/api/bookings/{id}/cancel         → Cancel booking
GET    /bookings/api/salons/{salonId}/availability → Get availability
```

### PAYMENT SERVICE
```
POST   /payments/api/payments           → Create payment
GET    /payments/api/payments/{id}      → Get payment details
POST   /payments/api/payments/{id}/process        → Process payment
POST   /payments/api/payments/{id}/confirm        → Confirm payment
GET    /payments/api/users/{userId}/payments      → Get payment history
POST   /payments/api/payments/{id}/refund         → Refund payment
```

### NOTIFICATION SERVICE
```
GET    /notifications/api/users/{userId}/notifications  → Get notifications
PUT    /notifications/api/notifications/{id}/read       → Mark as read
POST   /notifications/api/notifications/email           → Send email notification
```

---

## 🔧 Frontend Implementation (apiClient.ts)

All API methods in `src/services/apiClient.ts` have been updated with correct routing:

```typescript
// ✅ CORRECT FORMAT USED IN apiClient.ts:

// User Service
async login(data: { email: string; password: string }) {
  const response = await this.client.post('/users/api/users/login', data)
  //                                        ^^^^^^^^^^^^^^^^^^^^ 
  //                                   Service name + API path
  return response.data
}

// Salon Service
async getSalons(page = 1, limit = 10, search?: string) {
  const params = new URLSearchParams({ page, limit, ...search ? { search } : {} })
  return (await this.client.get(`/salons/api/salons?${params}`)).data
  //                            ^^^^^^^^^^^^^^^^^^
  //                       Service name + API path
}

// Booking Service
async createBooking(data: {...}) {
  return (await this.client.post('/bookings/api/bookings', data)).data
  //                             ^^^^^^^^^^^^^^^^^^^^^
  //                        Service name + API path
}
```

---

## 🚀 Startup Sequence (IMPORTANT ORDER)

### Step 1: Start Eureka Server
```bash
cd "EUREKA SERVICE"
mvn spring-boot:run
# Wait for message: "Started EurekaApplication"
# Eureka Dashboard: http://localhost:8761
```

### Step 2: Start All Microservices (8001-8007)
Open 7 separate terminals:

```bash
# Terminal 1 - User Service (8001)
cd "USER SERVICE"
mvn spring-boot:run

# Terminal 2 - Salon Service (8002)
cd "SALON SERVICE"
mvn spring-boot:run

# Terminal 3 - Service Offering (8003)
cd "SERVICE OFFERING"
mvn spring-boot:run

# Terminal 4 - Category Service (8004)
cd "CATEGORY SERVICE"
mvn spring-boot:run

# Terminal 5 - Booking Service (8005)
cd "BOOKING SERVICE"
mvn spring-boot:run

# Terminal 6 - Payment Service (8006)
cd "PAYMENT SERVICE"
mvn spring-boot:run

# Terminal 7 - Notification Service (8007)
cd "NOTIFICATION SERVICE"
mvn spring-boot:run
```

### Step 3: Start Gateway Service
```bash
cd "GATEWAY SERVICE"
mvn spring-boot:run
# Wait for: "Started GatewayApplication"
# Gateway is ready at http://localhost:8862
```

### Step 4: Start Frontend
```bash
cd salon-booking-frontend
npm run dev
# Frontend at http://localhost:5173
```

---

## ✅ Verification Checklist

### Eureka Dashboard
```
Open: http://localhost:8761
You should see:

✅ USER-SERVICE (instances: 1)
✅ SALON-SERVICE (instances: 1)
✅ SERVICE-OFFERING (instances: 1)
✅ CATEGORY-SERVICE (instances: 1)
✅ BOOKING-SERVICE (instances: 1)
✅ PAYMENT-SERVICE (instances: 1)
✅ NOTIFICATION-SERVICE (instances: 1)
✅ GATEWAY-SERVICE (instances: 1)

Status: UP (Green) for all services
```

### Gateway Health Check
```bash
curl http://localhost:8862/actuator/health

# Should return:
{
  "status": "UP"
}
```

### Test API Call
```bash
# Login endpoint test
curl -X POST http://localhost:8862/users/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}

# Get salons test
curl http://localhost:8862/salons/api/salons?page=1&limit=10
```

### Frontend Testing
1. Open http://localhost:5173
2. Navigate to login page
3. Enter credentials: `customer@gmail.com` / `password123`
4. Should successfully login (no CORS/401 errors)
5. Should see salons list after login
6. Check browser console - no errors

---

## 🔐 Gateway Configuration (Optional Review)

If you want to verify Gateway settings:

**File:** `GATEWAY SERVICE/src/main/resources/application.yml`

```yaml
spring:
  application:
    name: GATEWAY-SERVICE
  cloud:
    gateway:
      routes:
        # User Service Route
        - id: user-service
          uri: lb://USER-SERVICE
          predicates:
            - Path=/users/**
          filters:
            - name: RewritePath
              args:
                regexp: '^/users/(.*)'
                replacement: '/$1'
        
        # Salon Service Route
        - id: salon-service
          uri: lb://SALON-SERVICE
          predicates:
            - Path=/salons/**
          filters:
            - name: RewritePath
              args:
                regexp: '^/salons/(.*)'
                replacement: '/$1'
        
        # Similar for other services...
        
  eureka:
    client:
      serviceUrl:
        defaultZone: http://localhost:8761/eureka/
    instance:
      hostname: localhost
      leaseRenewalIntervalInSeconds: 10

server:
  port: 8862
```

---

## 🐛 Troubleshooting

### Issue: 404 Not Found
**Symptoms:**
```
GET http://localhost:8862/api/salons → 404
GET http://localhost:8862/salons → 404
```

**Solution:**
```
❌ WRONG:  /api/salons or /salons
✅ CORRECT: /salons/api/salons
            ^^^^^^^
            Service name REQUIRED!
```

### Issue: Service Not Found by Eureka
**Symptoms:**
```
get error: java.net.UnknownHostException: SALON-SERVICE
```

**Solution:**
1. Verify Eureka is running: http://localhost:8761
2. Check if service registered (should be in Eureka dashboard)
3. Verify service name matches (case-sensitive)
4. Check microservice `application.yml`: `spring.application.name: SALON-SERVICE`

### Issue: CORS Errors
**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
Gateway should handle CORS. Check gateway CORS config is present.

### Issue: 401 Unauthorized
**Symptoms:**
```
GET /users/api/users/123 → 401
```

**Solution:**
- Token not being sent
- Check localStorage has `authToken` after login
- Verify Authorization header is set: `Bearer {token}`
- Check token is valid (not expired)

---

## 📊 Request Flow Diagram

```
Frontend Request:
http://localhost:5173/login (Submit credentials)
                    ↓
API Call:
POST /users/api/users/login (via apiClient.ts)
                    ↓
Gateway receives:
http://localhost:8862/users/api/users/login
                    ↓
Gateway queries Eureka:
"Where is USER-SERVICE?"
                    ↓
Eureka responds:
"USER-SERVICE is at http://localhost:8001"
                    ↓
Gateway routes:
http://localhost:8001/api/users/login
(Removes /users prefix for service)
                    ↓
User Service processes:
Receives POST /api/users/login
Validates credentials
Returns token
                    ↓
Gateway returns response:
Token and user data
                    ↓
Frontend receives:
Stores token in localStorage
Redirects to dashboard
```

---

## 🎯 Key Takeaways

1. **Always include service name** in API paths
2. **Gateway URL format:** `/{SERVICE-NAME}/api/{endpoint}`
3. **Service names are case-sensitive**
4. **Eureka must be running** before services start
5. **Gateway must be running** before frontend makes API calls
6. **All 7 services must be registered** in Eureka for full functionality

---

## 📚 Documentation Links

- [Spring Cloud Gateway Documentation](https://cloud.spring.io/spring-cloud-gateway/reference/html/)
- [Spring Cloud Netflix Eureka](https://cloud.spring.io/spring-cloud-netflix/reference/html/)
- [API Client Implementation](./src/services/apiClient.ts)

---

**Status:** ✅ All API routes are correctly configured  
**Last Updated:** January 7, 2026, 2:40 AM IST  
**Frontend Version:** With Eureka service prefixes
