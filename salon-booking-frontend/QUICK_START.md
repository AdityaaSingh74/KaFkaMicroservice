# 🚀 Quick Start - SalonHub Frontend

**Get your frontend working in 2 minutes!**

---

## 1️⃣ Install & Start

```bash
cd salon-booking-frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

---

## 2️⃣ Test Login

### Go to: `http://localhost:5173/login`

### Use Test Account:
```
Email:    customer@gmail.com
Password: password123
```

**OR** Click the pre-filled test account button at the bottom

---

## 3️⃣ Browse Salons

After login, navigate to **Salons** page

**See:**
- ✅ 6 sample salons
- ✅ Ratings and reviews
- ✅ Search functionality
- ✅ NO CORS errors
- ✅ NO 401 errors

---

## 📋 Other Test Users

### Salon Owner
```
Email:    salonowner@gmail.com
Password: password123
```

### Admin
```
Email:    admin@gmail.com
Password: password123
```

---

## 🎯 What's Included

✅ **Dummy Authentication**
- 3 test users pre-configured
- Quick-select buttons on login page
- Role-based navigation

✅ **Sample Data**
- 6 realistic salons
- Full service details
- Ratings and reviews
- Professional images

✅ **Zero Backend Dependencies**
- No CORS issues
- No API errors
- Works immediately

✅ **Full Documentation**
- `DEVELOPMENT_GUIDE.md` - Setup details
- `TESTING_GUIDE.md` - Verification steps
- `FIXES-SUMMARY.md` - What was fixed

---

## 🔄 Ready for Real Backend?

When your backend is ready:

1. **Replace dummy auth:**
   ```tsx
   // In LoginPage.tsx
   const { user, token } = await apiClient.login({ email, password })
   ```

2. **Replace dummy salons:**
   ```tsx
   // In SalonsPage.tsx
   const data = await apiClient.getSalons(1, 10)
   ```

3. **Update environment:**
   ```
   VITE_GATEWAY_URL=http://localhost:8862/api
   VITE_USE_DUMMY_AUTH=false
   VITE_USE_DUMMY_SALONS=false
   ```

---

## ✨ Features

### ✅ Authentication
- Login with test users
- Token management
- localStorage persistence
- Role-based access

### ✅ Salons
- Browse all salons
- Search by name/city/service
- View details
- Responsive design

### ✅ UI/UX
- Beautiful design
- Error handling
- Loading states
- Mobile responsive

---

## 🐛 Troubleshooting

### Errors in Console?
**Expected** (These are warnings, not errors):
```
⚠️ React Router Future Flag Warning: v7_startTransition
⚠️ React Router Future Flag Warning: v7_relativeSplatPath
```

**NOT Expected** (Should NOT see):
- ❌ CORS errors
- ❌ 401 Unauthorized
- ❌ Network errors

### Still Having Issues?

1. Clear browser cache (Ctrl+Shift+Delete)
2. Close and restart dev server
3. Check Node version (v16+)
4. See `TESTING_GUIDE.md` for detailed troubleshooting

---

## 📚 Learn More

- **Setup Details:** See `DEVELOPMENT_GUIDE.md`
- **Testing Steps:** See `TESTING_GUIDE.md`
- **What Was Fixed:** See `FIXES-SUMMARY.md`
- **Full Documentation:** See repo README

---

## ✅ Quick Checklist

- [ ] Installed dependencies (`npm install`)
- [ ] Started dev server (`npm run dev`)
- [ ] Opened browser at `http://localhost:5173`
- [ ] Logged in with test account
- [ ] Viewed salons page
- [ ] Searched for a salon
- [ ] No errors in console (except warnings)

✨ **All checked? You're ready to develop!**

---

**Questions?** Check the documentation files or review the code comments.

Happy coding! 🚀
