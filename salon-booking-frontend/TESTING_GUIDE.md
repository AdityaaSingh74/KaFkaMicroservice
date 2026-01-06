# SalonHub Frontend - Testing Guide

**Verify all fixes are working correctly**

---

## ✅ Pre-Testing Checklist

- [ ] Node.js and npm installed
- [ ] Repository cloned/pulled
- [ ] All files updated from FSD branch
- [ ] No other services blocking ports 5173

---

## 🚀 Step 1: Setup & Start

### 1.1 Install Dependencies
```bash
cd salon-booking-frontend
npm install
```

**Expected Output:**
```
added XXX packages, and audited XXX packages in XXXs
found 0 vulnerabilities
```

### 1.2 Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
  VITE v4.X.X  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 1.3 Open in Browser
Navigate to: `http://localhost:5173`

**Expected:** Home page loads without errors

---

## 🔐 Step 2: Test Login - Customer Account

### 2.1 Navigate to Login
Click **"Login"** button or go to `http://localhost:5173/login`

**Expected:**
- Login form displays
- "Test Accounts (Development)" section visible at bottom
- Shows 3 test accounts with quick-select buttons
- Pre-filled with customer@gmail.com / password123

### 2.2 Method A - Quick Select (Recommended)
1. Scroll down to "Test Accounts" section
2. Click the **first button** labeled "Aditya Singh (CUSTOMER)"
3. Form auto-fills with: `customer@gmail.com` / `password123`
4. Click **"Login"** button

### 2.2 Method B - Manual Entry
1. Clear email field
2. Type: `customer@gmail.com`
3. Clear password field  
4. Type: `password123`
5. Click **"Login"** button

**Expected:**
- ✅ No error messages
- ✅ No 401 Unauthorized errors in console
- ✅ Redirects to `/customer/dashboard`
- ✅ Page shows "Welcome, Aditya Singh"

### 2.3 Verify Token Storage
Open Browser DevTools (F12 → Application → Local Storage)

**Expected Keys:**
```
autToken: eyJ...token...
token: eyJ...token...
user: {"id":"user-001","name":"Aditya Singh",...}
```

---

## 🏠 Step 3: Navigate to Salons

### 3.1 Click Navigation Menu
1. Look for **"Salons"** link in navigation menu
2. Or go directly to: `http://localhost:5173/salons`

### 3.2 Verify Salons Load

**Expected:**
- ✅ Page shows "Explore Salons" title
- ✅ Shows "Find and book from 6 verified salons"
- ✅ **NO CORS errors in console**
- ✅ **NO 401 errors in console**
- ✅ Grid displays 6 salon cards

### 3.3 Verify Each Salon Card

Each card should show:
- [ ] Salon image
- [ ] Salon name (e.g., "Glam Studio Baddi")
- [ ] Rating (e.g., "4.8 ⭐")
- [ ] Location
- [ ] Brief description
- [ ] Services list
- [ ] "View Details" button

**Salons that should appear:**
1. Glam Studio Baddi (4.8⭐)
2. Beauty Bliss (4.6⭐)
3. Style Express (4.4⭐)
4. Luxe Spa & Salon (4.9⭐)
5. Chic Cuts Unisex (4.5⭐)
6. Divine Beauty Studio (4.7⭐)

---

## 🔍 Step 4: Test Search Functionality

### 4.1 Search by Salon Name
1. Type **"Glam"** in search box
2. Press Enter or wait for auto-filter

**Expected:**
- ✅ Shows only "Glam Studio Baddi"
- ✅ Display text: "Found 1 result"
- ✅ Other salons hidden

### 4.2 Search by City
1. Clear search box
2. Type **"Baddi"**

**Expected:**
- ✅ Shows all 6 salons (all are in Baddi)
- ✅ Display text: "Found 6 results"

### 4.3 Search by Service
1. Clear search box
2. Type **"Spa"**

**Expected:**
- ✅ Shows "Luxe Spa & Salon" (has spa services)
- ✅ Display text: "Found 1 result"

### 4.4 Search with No Results
1. Clear search box
2. Type **"NonExistent"**

**Expected:**
- ✅ Empty state message appears
- ✅ Message: "No salons found matching your search"
- ✅ "Try a different search term" suggestion

### 4.5 Clear Search
1. Clear the search box completely
2. All 6 salons reappear

---

## 👤 Step 5: Test Other User Roles

### 5.1 Logout
1. Click **"Logout"** or go to `/login`
2. Verify redirected to login page
3. Verify localStorage cleared

### 5.2 Test Salon Owner Login
1. In "Test Accounts" section
2. Click **"Priya Kapoor (SALON_OWNER)"** button
3. Form fills with: `salonowner@gmail.com` / `password123`
4. Click **"Login"**

**Expected:**
- ✅ Redirects to `/salon/dashboard`
- ✅ Page shows salon owner dashboard

### 5.3 Test Admin Login
1. Logout
2. In "Test Accounts" section
3. Click **"Admin User (ADMIN)"** button
4. Form fills with: `admin@gmail.com` / `password123`
5. Click **"Login"**

**Expected:**
- ✅ Redirects to `/admin/dashboard`
- ✅ Page shows admin dashboard

---

## 🧪 Step 6: Console Error Check

### 6.1 Open Browser Console
Press **F12** → **Console** tab

### 6.2 Check for ERRORS (Should be NONE)

**Should NOT see:**
- ❌ `Access to XMLHttpRequest has been blocked by CORS policy`
- ❌ `401 (Unauthorized)`
- ❌ `Failed to fetch`
- ❌ `Network Error`

**OK to see (Just Warnings):**
- ⚠️ `React Router Future Flag Warning: v7_startTransition`
- ⚠️ `React Router Future Flag Warning: v7_relativeSplatPath`

### 6.3 Verify Network Requests
Go to **Network** tab

**When loading salons page, you should see:**
- ✅ All requests succeed (green checkmarks)
- ✅ No requests with red X's
- ✅ No 401 responses

---

## 📊 Step 7: Performance Test

### 7.1 Page Load Time
- Home page loads: < 2 seconds ✓
- Login page loads: < 1 second ✓
- Salons page loads: < 1.5 seconds ✓

### 7.2 Search Performance
- Typing search filters instantly ✓
- No lag when typing ✓

### 7.3 Authentication Performance
- Login completes in < 1 second ✓
- Redirects immediately after login ✓

---

## 🔄 Step 8: State Persistence Test

### 8.1 Refresh Page After Login
1. Login with customer account
2. Press **F5** or **Ctrl+R** to refresh
3. Check if still logged in

**Expected:**
- ✅ Still authenticated
- ✅ Stays on current page (or dashboard)
- ✅ Token still in localStorage

### 8.2 Open Multiple Tabs
1. Login in Tab 1
2. Open Tab 2 and navigate to `http://localhost:5173/salons`
3. Check if authenticated in Tab 2

**Expected:**
- ✅ Authenticated in both tabs
- ✅ Same user in both tabs

---

## 🎨 Step 9: Responsive Design Test

### 9.1 Desktop View
1. Set browser width to 1920px
2. Check salons page

**Expected:**
- ✅ Shows 3 columns of salons
- ✅ Search bar is wide
- ✅ Layout looks spacious

### 9.2 Tablet View
1. Set browser width to 768px (F12 → Toggle device toolbar)
2. Select iPad view

**Expected:**
- ✅ Shows 2 columns of salons
- ✅ Layout responsive
- ✅ Touch-friendly buttons

### 9.3 Mobile View
1. Set browser width to 375px (iPhone)
2. Select iPhone SE view

**Expected:**
- ✅ Shows 1 column of salons
- ✅ Search bar fits
- ✅ All text readable
- ✅ No horizontal scrolling

---

## ✅ Final Verification Checklist

### Authentication
- [ ] Customer login works
- [ ] Salon owner login works
- [ ] Admin login works
- [ ] Logout clears data
- [ ] Token stored in localStorage
- [ ] Page refresh maintains login

### Salon Data
- [ ] 6 salons display on page
- [ ] Each salon shows all information
- [ ] Images load correctly
- [ ] Ratings display correctly
- [ ] Services list shows

### Search
- [ ] Search by name works
- [ ] Search by city works
- [ ] Search by service works
- [ ] No results message shows
- [ ] Clear search shows all salons

### Errors
- [ ] NO CORS errors in console
- [ ] NO 401 errors in console
- [ ] NO network errors
- [ ] Router warnings OK (not errors)

### Performance
- [ ] Pages load quickly
- [ ] Search is instant
- [ ] No lag or freezing

### Responsive
- [ ] Desktop layout correct
- [ ] Tablet layout correct
- [ ] Mobile layout correct

---

## 🐛 Troubleshooting

### Still Seeing CORS Errors?

**Problem:** CORS error appears
```
Access to XMLHttpRequest at 'http://localhost:8862/api/salons' 
has been blocked by CORS policy
```

**Solution:**
1. Verify you're using `DummySalonService`
2. Check `SalonsPage.tsx` line with `await DummySalonService.getSalons()`
3. Check Network tab - no actual API calls should be made
4. Clear browser cache (Ctrl+Shift+Delete)
5. Restart dev server (Ctrl+C, then `npm run dev`)

### Still Seeing 401 Errors?

**Problem:** 401 error appears
```
GET http://localhost:8862/api/salons net::ERR_FAILED 401
```

**Solution:**
1. Verify using `DummyAuthService` for login
2. Check localStorage has `authToken` and `token`
3. Check credentials: `customer@gmail.com` / `password123`
4. Clear localStorage and try again
5. Check browser console for specific error

### Salons Page Shows Empty?

**Problem:** No salons display

**Solution:**
1. Check Network tab - should have no requests
2. Open browser console - no network errors?
3. Verify `DummySalonService.getSalons()` is being called
4. Check that page loaded (no JS errors)
5. Reload page (F5)

### Test Accounts Not Showing?

**Problem:** Can't see test accounts on login page

**Solution:**
1. Check you're on login page
2. Scroll down to bottom of form
3. Should see "Test Accounts (Development)" section
4. If missing, check `LoginPage.tsx` is updated
5. Clear browser cache and reload

---

## 📞 Next Steps

If all tests pass:
1. ✅ Commit changes to your branch
2. ✅ Document any custom changes
3. ✅ When ready for backend, update endpoints in `apiClient.ts`
4. ✅ Swap `DummySalonService` → `apiClient.getSalons()`
5. ✅ Swap `DummyAuthService` → `apiClient.login()`
6. ✅ Test with real backend

---

**All tests passing? Great! Your frontend is ready for development and backend integration.** 🎉
