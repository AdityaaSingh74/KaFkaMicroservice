# SalonHub Frontend - Development Guide

## 🚀 Quick Start

This guide explains the current setup and how to use the dummy authentication and salon data for development.

---

## 📋 Current Status

### ✅ What's Working (Development)

1. **Dummy Authentication** - Pre-configured test users
2. **Dummy Salon Data** - 6 sample salons with full information
3. **Frontend Routes** - All pages and navigation working
4. **UI Components** - Complete design system implemented

### ⚠️ What Needs Backend Integration

1. Real User Service (Port 8001)
2. Real Salon Service (Port 8002)
3. Real Service Offering (Port 8003)
4. Other microservices (Booking, Payment, etc.)

---

## 🔐 Dummy Users for Testing

### Customer Account
```
Email:    customer@gmail.com
Password: password123
Role:     CUSTOMER
```

### Salon Owner Account
```
Email:    salonowner@gmail.com
Password: password123
Role:     SALON_OWNER
```

### Admin Account
```
Email:    admin@gmail.com
Password: password123
Role:     ADMIN
```

💡 **All accounts use the same password: `password123`**

---

## 🏪 Sample Salons

The following 6 salons are available in the dummy data:

1. **Glam Studio Baddi** - Premium salon with full services (Rating: 4.8★)
2. **Beauty Bliss** - Complete beauty solutions (Rating: 4.6★)
3. **Style Express** - Quick makeover salon (Rating: 4.4★)
4. **Luxe Spa & Salon** - Luxury spa treatments (Rating: 4.9★)
5. **Chic Cuts Unisex** - Modern unisex styling (Rating: 4.5★)
6. **Divine Beauty Studio** - Bridal & party makeup specialist (Rating: 4.7★)

---

## 🛠️ Installation & Setup

### Step 1: Install Dependencies

```bash
cd salon-booking-frontend
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

### Step 3: Fix React Router Warnings (Optional)

Add to `src/main.tsx` if you see React Router warnings:

```tsx
// In your router configuration
<BrowserRouter
  future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}
>
  {/* Your routes */}
</BrowserRouter>
```

---

## 📁 File Structure

### New/Modified Files

```
src/
├── services/
│   ├── apiClient.ts          ✅ Updated with CORS headers
│   ├── dummyAuthService.ts   ✨ NEW - Dummy user auth
│   └── dummySalonService.ts  ✨ NEW - Dummy salon data
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx     ✅ Updated with dummy auth UI
│   └── SalonsPage.tsx        ✅ Updated with dummy salon data
└── store/
    └── authStore.ts          ✅ Compatible with dummy auth
```

---

## 🔄 Login Flow

1. **Open** `http://localhost:5173/login`
2. **See** Test accounts displayed at bottom
3. **Click** on any test account button (auto-fills email & password)
4. **Or** Type manually and click Login
5. **Redirected** to dashboard based on role:
   - CUSTOMER → `/customer/dashboard`
   - SALON_OWNER → `/salon/dashboard`
   - ADMIN → `/admin/dashboard`

---

## 🏬 Salons Page

### Features

- ✅ Displays all 6 sample salons
- ✅ Search by salon name, city, or address
- ✅ Responsive grid layout
- ✅ Rating and review count display
- ✅ Click salon card to view details

### Testing Search

Try searching for:
- `"Glam"` - Find Glam Studio
- `"Baddi"` - Find all salons in Baddi
- `"Spa"` - Find Luxe Spa & Salon
- `"Hair"` - Find salons with hair services

---

## 🔌 Switching to Real Backend

### When Ready to Use Real API:

#### 1. Update SalonsPage.tsx

**Current (Dummy):**
```tsx
const data = await DummySalonService.getSalons(1, 10)
```

**Replace with (Real API):**
```tsx
const data = await apiClient.getSalons(1, 10)
```

#### 2. Update LoginPage.tsx

**Current (Dummy):**
```tsx
const { user, token } = await DummyAuthService.login(formData.email, formData.password)
```

**Replace with (Real API):**
```tsx
const { user, token } = await apiClient.login(formData.email, formData.password)
```

#### 3. Ensure Backend Has CORS Enabled

The backend (Spring Cloud Gateway) must allow CORS:

```java
// In Gateway configuration
@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        // ... rest of configuration
    }
}
```

---

## ⚙️ API Endpoints (Ready When Backend Starts)

### User Service (Port 8001)
```
GET    /api/users/{id}                 - Get user profile
POST   /api/users/login                - Login
POST   /api/users/register             - Register
PUT    /api/users/{id}                 - Update profile
```

### Salon Service (Port 8002)
```
GET    /api/salons                     - List all salons
GET    /api/salons/{id}                - Get salon details
GET    /api/salons/search              - Search salons
POST   /api/salons                     - Create salon
PUT    /api/salons/{id}                - Update salon
DELETE /api/salons/{id}                - Delete salon
```

---

## 🐛 Troubleshooting

### Issue: Login not working

**Solution:** Make sure you're using the correct credentials:
- Email: `customer@gmail.com` (or other test emails)
- Password: `password123`

### Issue: Salons not displaying

**Solution:** 
1. Check browser console (F12) for errors
2. Make sure you're on `/salons` page
3. Network should show successful responses (no errors)

### Issue: React Router warnings

**Solution:** These are future warnings from React Router v7, not errors. Safe to ignore during development.

---

## 📝 Important Notes

⚠️ **Dummy Data is In-Memory Only**
- Data resets when page refreshes
- No persistence between sessions
- Created only for development/testing

✅ **Ready for Production**
- Remove dummy services
- Ensure real API endpoints are configured
- Update environment variables with real URLs
- Test CORS configuration on backend

---

## 🔗 Related Documentation

- [Spring Cloud Gateway Setup](../../GATEWAY%20SERVICE/README.md)
- [Salon Service API](../../SALON%20SERVICE/README.md)
- [User Service API](../../USER%20SERVICE/README.md)

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API client configuration
3. Check that all services are running (if using real backend)

---

**Last Updated:** January 2026
**Frontend Framework:** React + TypeScript + Vite
**State Management:** Zustand
**HTTP Client:** Axios
