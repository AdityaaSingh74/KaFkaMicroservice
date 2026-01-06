# 🚀 Quick Reference: API Routing in SalonHub

**Print this or bookmark it!**

---

## 🎉 THE GOLDEN RULE

```
Every API call MUST have the service name:

❌ WRONG:   http://localhost:8862/api/salons
✅ CORRECT: http://localhost:8862/salons/api/salons
                                   ^^^^^^^ Always needed!
```

---

## 🗺️ Service Name Prefix Mapping

| Service | Prefix | Example |
|---------|--------|----------|
| Users | `/users/api` | `/users/api/users/login` |
| Salons | `/salons/api` | `/salons/api/salons` |
| Services | `/services/api` | `/services/api/services` |
| Categories | `/categories/api` | `/categories/api/categories` |
| Bookings | `/bookings/api` | `/bookings/api/bookings` |
| Payments | `/payments/api` | `/payments/api/payments` |
| Notifications | `/notifications/api` | `/notifications/api/notifications` |

---

## 📄 All API Methods Available

### User Service
```javascript
apiClient.registerUser(data)              // POST /users/api/users/register
apiClient.loginUser(email, password)      // POST /users/api/users/login
apiClient.login(data)                     // POST /users/api/users/login
apiClient.logoutUser()                    // Clear localStorage
apiClient.getUserProfile(userId)          // GET /users/api/users/{id}
apiClient.updateUserProfile(userId, data) // PUT /users/api/users/{id}
```

### Salon Service
```javascript
apiClient.getSalons(page, limit, search)  // GET /salons/api/salons
apiClient.getSalonById(id)                 // GET /salons/api/salons/{id}
apiClient.searchSalons(query, city)        // GET /salons/api/salons/search
apiClient.createSalon(data)                // POST /salons/api/salons
apiClient.updateSalon(id, data)            // PUT /salons/api/salons/{id}
apiClient.deleteSalon(id)                  // DELETE /salons/api/salons/{id}
```

### Service Offering
```javascript
apiClient.getServicesBySalonId(salonId, page, limit)
apiClient.getServiceById(id)
apiClient.getServicesByCategory(categoryId)
apiClient.createService(data)
apiClient.updateService(id, data)
apiClient.deleteService(id)
```

### Category Service
```javascript
apiClient.getCategories()           // GET /categories/api/categories
apiClient.getCategoryById(id)        // GET /categories/api/categories/{id}
apiClient.createCategory(data)       // POST /categories/api/categories
apiClient.updateCategory(id, data)   // PUT /categories/api/categories/{id}
apiClient.deleteCategory(id)         // DELETE /categories/api/categories/{id}
```

### Booking Service
```javascript
apiClient.createBooking(data)                          // POST /bookings/api/bookings
apiClient.getBookingById(id)                           // GET /bookings/api/bookings/{id}
apiClient.getUserBookings(userId, page, limit)         // GET /bookings/api/users/{id}/bookings
apiClient.getSalonBookings(salonId, page, limit)       // GET /bookings/api/salons/{id}/bookings
apiClient.updateBooking(id, data)                      // PUT /bookings/api/bookings/{id}
apiClient.cancelBooking(id)                            // POST /bookings/api/bookings/{id}/cancel
apiClient.getAvailability(salonId, date)               // GET /bookings/api/salons/{id}/availability
```

### Payment Service
```javascript
apiClient.createPayment(data)                          // POST /payments/api/payments
apiClient.getPaymentById(id)                           // GET /payments/api/payments/{id}
apiClient.processPayment(id, details)                  // POST /payments/api/payments/{id}/process
apiClient.confirmPayment(id)                           // POST /payments/api/payments/{id}/confirm
apiClient.getPaymentHistory(userId, page, limit)       // GET /payments/api/users/{id}/payments
apiClient.refundPayment(id, reason)                    // POST /payments/api/payments/{id}/refund
```

### Notification Service
```javascript
apiClient.getNotifications(userId, page, limit)        // GET /notifications/api/users/{id}/notifications
apiClient.markNotificationAsRead(id)                   // PUT /notifications/api/notifications/{id}/read
apiClient.sendEmailNotification(email, subject, msg)   // POST /notifications/api/notifications/email
```

---

## 🔗 How to Use

### Import
```typescript
import { apiClient } from '../../services/apiClient'
```

### Login Example
```typescript
try {
  const response = await apiClient.login({
    email: 'user@example.com',
    password: 'password123'
  })
  // response.user and response.token
} catch (error) {
  console.error('Login failed:', error)
}
```

### Get Salons Example
```typescript
try {
  const response = await apiClient.getSalons(1, 10, 'beauty')
  // response.salons contains the list
} catch (error) {
  console.error('Failed to fetch:', error)
}
```

### Create Booking Example
```typescript
try {
  const booking = await apiClient.createBooking({
    userId: user.id,
    salonId: salon.id,
    serviceId: service.id,
    bookingDate: '2026-01-15',
    bookingTime: '14:00'
  })
} catch (error) {
  console.error('Booking failed:', error)
}
```

---

## ✅ Status Codes You'll See

| Code | Meaning | What to do |
|------|---------|------------|
| 200 | Success | Great! Use the response |
| 201 | Created | Resource was created successfully |
| 400 | Bad Request | Check your data format |
| 401 | Unauthorized | Login required or token expired |
| 404 | Not Found | Check the URL is correct |
| 500 | Server Error | Backend service is down |

---

## 🐛 Common Errors & Fixes

### 404 Not Found
```
❌ /api/salons (missing service name)
✅ /salons/api/salons (with service name)
```

### 401 Unauthorized
```
🚧 Problem: No token or expired token
✅ Solution: Login again
```

### Service Not Found by Eureka
```
🚧 Problem: Service not registered
✅ Solution: Check Eureka http://localhost:8761
```

### CORS Error
```
🚧 Problem: Gateway not configured for CORS
✅ Solution: Backend team should verify CorsWebFilter
```

---

## 🚰 Startup Checklist

Ensure running in order:

1. [ ] **Eureka** - `localhost:8761` ✓
2. [ ] **User Service** - `localhost:8001` ✓
3. [ ] **Salon Service** - `localhost:8002` ✓
4. [ ] **Service Offering** - `localhost:8003` ✓
5. [ ] **Category Service** - `localhost:8004` ✓
6. [ ] **Booking Service** - `localhost:8005` ✓
7. [ ] **Payment Service** - `localhost:8006` ✓
8. [ ] **Notification Service** - `localhost:8007` ✓
9. [ ] **Gateway** - `localhost:8862` ✓
10. [ ] **Frontend** - `localhost:5173` ✓

---

## 🛠️ Debugging Steps

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Try an action** (login, fetch salons, etc.)
4. **Look for the request**
5. **Check the URL** - Does it have `/service-name/api/...`?
6. **Check status** - 200? 404? 401?
7. **Check response** - Any error messages?

---

## 📀 Files to Know

| File | Purpose |
|------|----------|
| `src/services/apiClient.ts` | All API methods |
| `EUREKA_ROUTING_GUIDE.md` | Detailed routing explanation |
| `API_FIX_SUMMARY.md` | Complete fix documentation |
| `FIXES_APPLIED.md` | Summary of all changes |

---

## 🚀 Remember

```
Everyday you use the API:

1. Import apiClient
2. Call the right method
3. Handle success response
4. Catch and handle errors
5. Check DevTools if confused
```

---

**Last Updated:** January 7, 2026  
**Version:** 1.0  
**Status:** ✅ Ready for use
