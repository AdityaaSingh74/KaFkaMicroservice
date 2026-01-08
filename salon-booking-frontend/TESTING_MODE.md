# Testing Mode Documentation

## Overview
The salon frontend is currently running in **TESTING MODE** with authentication completely bypassed. A mock user is injected into the application, allowing you to test all features without a working backend.

## What Changed

### 1. **Authentication Store (`src/store/authStore.ts`)**
   - Mock user is **automatically initialized** on app start
   - Mock user credentials:
     - **ID**: `customer-001`
     - **Email**: `test@example.com`
     - **Name**: `Test Customer`
     - **Phone**: `+91-9876543210`
     - **Role**: `CUSTOMER`
   - User is **always logged in** - no actual login required
   - Logout button still works but reinitializes mock user

### 2. **Protected Routes (`src/components/common/ProtectedRoute.tsx`)**
   - All authentication checks are **bypassed**
   - No role validation (all users can access all protected routes)
   - Direct rendering of children components
   - No redirects to login page

### 3. **Salon Details Page (`src/pages/SalonDetailsPage.tsx`)**
   - "Book Service" button **no longer redirects to login**
   - Proceeds directly to booking flow
   - Mock user data is always available for bookings

### 4. **App Routes (`src/App.tsx`)**
   - Login route (`/login`) → **Redirects to Home** (`/`)
   - Register route (`/register`) → **Redirects to Home** (`/`)
   - Protected routes now accessible **without authentication**:
     - `/customer/dashboard` ✅
     - `/customer/bookings` ✅
     - `/salon/dashboard` ✅
     - `/admin/dashboard` ✅

## How to Test

### Navigate to Protected Routes
1. Click on any salon "View Details"
2. Click "Book Service" - no login required ✅
3. Directly visit protected routes:
   ```
   /customer/dashboard
   /customer/bookings
   /salon/dashboard
   /admin/dashboard
   ```

### What You Can Test
- ✅ Browse salons
- ✅ View salon details
- ✅ Book services (with mock user)
- ✅ Access customer dashboard
- ✅ Access customer bookings
- ✅ Access admin & salon owner dashboards
- ✅ Full booking flow without authentication

## Mock Data

### Current Mock User
```javascript
const MOCK_USER = {
  id: 'customer-001',
  email: 'test@example.com',
  name: 'Test Customer',
  phone: '+91-9876543210',
  role: 'CUSTOMER',
  createdAt: new Date().toISOString(),
}
```

### Modifying Mock User
To change the mock user for testing different roles, edit `src/store/authStore.ts`:

```typescript
const MOCK_USER: User = {
  id: 'user-123',
  email: 'admin@example.com',
  name: 'Admin User',
  phone: '+91-1234567890',
  role: 'ADMIN', // Change role as needed: 'CUSTOMER' | 'SALON' | 'ADMIN'
  createdAt: new Date().toISOString(),
}
```

## Reverting to Production Mode

When backend is ready, follow these steps to restore authentication:

1. **Restore authStore.ts**
   ```typescript
   // Remove MOCK_USER initialization
   // Restore localStorage check logic
   user: savedUser ? JSON.parse(savedUser) : null,
   ```

2. **Restore ProtectedRoute.tsx**
   ```typescript
   if (!user) {
     return <Navigate to="/login" replace />
   }
   
   if (requiredRole && user.role !== requiredRole) {
     return <Navigate to="/" replace />
   }
   ```

3. **Restore SalonDetailsPage.tsx**
   ```typescript
   const handleBookService = (service: Service) => {
     if (!user) {
       navigate('/login')
       return
     }
     navigate(`/book/${salon?.id}/${service.id}`)
   }
   ```

4. **Restore App.tsx**
   ```typescript
   <Route path="/login" element={<LoginPage />} />
   <Route path="/register" element={<RegisterPage />} />
   ```

## Files Modified

| File | Change | Reason |
|------|--------|--------|
| `src/store/authStore.ts` | Added mock user initialization | Bypass authentication |
| `src/components/common/ProtectedRoute.tsx` | Removed auth checks | Allow access to protected routes |
| `src/pages/SalonDetailsPage.tsx` | Removed login redirect | Allow booking without auth |
| `src/App.tsx` | Redirected login/register to home | Bypass login flow |

## API Calls

⚠️ **Note**: API calls are still being made. If backend is unavailable:
- Salon loading may fail
- Services may not display
- Booking creation may fail

The authentication is bypassed, but **API endpoints are still required** for:
- Fetching salon list
- Fetching salon details
- Fetching services
- Creating bookings

## Troubleshooting

### Mock User Not Appearing
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check browser console for errors

### Still Redirecting to Login
- Ensure all files are saved
- Restart dev server (`npm run dev`)
- Check that ProtectedRoute changes are in place

### API Errors Despite Auth Bypass
- Mock user enables frontend only
- Backend API calls still need valid endpoints
- Check `.env` file for correct API URLs

## Summary

**TESTING MODE is ACTIVE** ✅
- No authentication required
- Mock user always available
- All routes accessible
- Ready for frontend feature testing

When backend is ready, follow the "Reverting to Production Mode" section to restore authentication.
