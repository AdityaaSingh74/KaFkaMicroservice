# Salon Booking System - Implementation Guide

Complete implementation of the full-stack salon booking application with microservices architecture as shown in the video tutorial.

## Project Structure Overview

```
salon-booking-frontend/
├── src/
│   ├── pages/
│   │   ├── Home.tsx                 # Browse and search salons
│   │   ├── SalonDetails.tsx         # View salon details and book
│   │   ├── PaymentPage.tsx          # Payment processing
│   │   ├── customer/
│   │   │   └── Dashboard.tsx        # Customer booking dashboard
│   │   └── salon/
│   │       └── Dashboard.tsx        # Salon owner dashboard
│   ├── components/
│   │   ├── common/
│   │   │   └── LoadingSpinner.tsx   # Loading state component
│   │   └── Notifications.tsx        # Notification bell with dropdown
│   ├── services/
│   │   └── apiClient.ts             # API client with all endpoints
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   └── App.tsx                      # Main app component
```

## Key Features Implemented

### 1. Home/Browse Salons (`Home.tsx`)
- ✅ Display all salons from backend
- ✅ Search functionality by salon name/location
- ✅ Filter by city
- ✅ Pagination with 12 items per page
- ✅ Rating and review count display
- ✅ Responsive grid layout

### 2. Salon Details & Booking (`SalonDetails.tsx`)
- ✅ Full salon information display
- ✅ Services list with category filtering
- ✅ Shopping cart for multiple services
- ✅ Date & time slot selection
- ✅ Booked slots display (red/unavailable)
- ✅ Real-time slot availability check
- ✅ Total price calculation
- ✅ Redirect to payment after booking creation

### 3. Payment Processing (`PaymentPage.tsx`)
- ✅ Multiple payment methods (Card, UPI, Wallet)
- ✅ Card number formatting (XXXX XXXX XXXX XXXX)
- ✅ Expiry date validation (MM/YY)
- ✅ CVV validation
- ✅ UPI ID validation
- ✅ Amount display
- ✅ Success confirmation
- ✅ Redirect to bookings on success

### 4. Customer Dashboard (`customer/Dashboard.tsx`)
- ✅ Display customer bookings from API
- ✅ Statistics cards (total, confirmed, upcoming, completed, spent)
- ✅ Booking table with status indicators
- ✅ Actions (reschedule, cancel, rebook)
- ✅ Filter by status
- ✅ Responsive design
- ✅ Real-time data updates

### 5. Salon Owner Dashboard (`salon/Dashboard.tsx`)
- ✅ Salon bookings display
- ✅ Revenue statistics
- ✅ Booking status management
- ✅ Multi-tab interface (Overview, Bookings, Services, Payments)
- ✅ Customer information
- ✅ Recent bookings widget
- ✅ Today's summary
- ✅ Payment tracking

### 6. Notifications Component (`Notifications.tsx`)
- ✅ Bell icon with unread count
- ✅ Dropdown with notification list
- ✅ Mark as read functionality
- ✅ Auto-refresh every 30 seconds
- ✅ Different notification types (Booking, Payment, Promotion, System)
- ✅ Color-coded by type
- ✅ Timestamp display

### 7. API Client (`apiClient.ts`)
- ✅ All microservice endpoints integrated
- ✅ JWT token management
- ✅ Automatic token refresh on 401
- ✅ Error handling
- ✅ Request/response interceptors
- ✅ Gateway routing via Eureka services

## API Endpoints Used

### User Service (`/users/api`)
```
POST   /users/register          # User registration
POST   /users/login             # User login
GET    /users/{userId}          # Get user profile
PUT    /users/{userId}          # Update user profile
```

### Salon Service (`/salons/api`)
```
GET    /salons                  # List all salons
GET    /salons/{id}             # Get salon details
GET    /salons/search           # Search salons
POST   /salons                  # Create salon
PUT    /salons/{id}             # Update salon
DELETE /salons/{id}             # Delete salon
```

### Service Offering (`/services/api`)
```
GET    /salons/{salonId}/services    # Get services by salon
GET    /services/{id}                 # Get service details
POST   /services                      # Create service
PUT    /services/{id}                 # Update service
DELETE /services/{id}                 # Delete service
```

### Booking Service (`/bookings/api`)
```
GET    /users/{userId}/bookings          # Get user bookings
GET    /salons/{salonId}/bookings        # Get salon bookings
GET    /bookings/{id}                    # Get booking details
POST   /bookings                         # Create booking
PUT    /bookings/{id}                    # Update booking
POST   /bookings/{id}/cancel             # Cancel booking
POST   /bookings/{id}/confirm            # Confirm booking
GET    /salons/{salonId}/booked-slots   # Get booked time slots
```

### Payment Service (`/payments/api`)
```
POST   /payments                        # Create payment
GET    /payments/{id}                   # Get payment details
POST   /payments/{id}/process           # Process payment
POST   /payments/{id}/confirm           # Confirm payment
GET    /users/{userId}/payments         # Get user payment history
POST   /payments/{id}/refund            # Refund payment
```

### Notification Service (`/notifications/api`)
```
GET    /users/{userId}/notifications              # Get notifications
PUT    /notifications/{id}/read                   # Mark as read
PUT    /users/{userId}/notifications/read-all    # Mark all as read
POST   /notifications/email                       # Send email notification
```

### Review Service (`/reviews/api`)
```
POST   /reviews                              # Create review
GET    /salons/{salonId}/reviews             # Get reviews by salon
GET    /salons/{salonId}/summary             # Get rating summary
PUT    /reviews/{id}                         # Update review
DELETE /reviews/{id}                         # Delete review
```

## Data Models

### User
```typescript
interface User {
  id: string
  email: string
  name: string
  phone: string
  role: 'CUSTOMER' | 'SALON_OWNER' | 'ADMIN'
  createdAt: string
}
```

### Salon
```typescript
interface Salon {
  id: string
  ownerId: string
  name: string
  address: string
  city: string
  phone: string
  email: string
  rating: number
  totalReviews: number
  description: string
  openingTime: string
  closingTime: string
}
```

### Service
```typescript
interface Service {
  id: string
  salonId: string
  name: string
  category: string
  price: number
  duration: number // in minutes
  description: string
}
```

### Booking
```typescript
interface Booking {
  id: string
  customerId: string
  salonId: string
  serviceId: string
  date: string
  time: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  totalPrice: number
  notes: string
}
```

### Payment
```typescript
interface Payment {
  id: string
  bookingId: string
  amount: number
  paymentMethod: 'CARD' | 'UPI' | 'WALLET'
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
}
```

## User Flows

### Customer Flow
1. **Browse** → Home page displays all salons
2. **Search** → Filter by city or search query
3. **View Details** → Click salon to view details
4. **Add Services** → Click "Add to Cart" for multiple services
5. **Select Slot** → Choose date and available time
6. **Checkout** → Review total price
7. **Payment** → Choose payment method and complete
8. **Confirmation** → Booking confirmed, redirect to dashboard
9. **Track** → View booking in "My Bookings" dashboard
10. **Manage** → Reschedule or cancel bookings

### Salon Owner Flow
1. **Login** → Access salon owner dashboard
2. **View Bookings** → See all customer bookings
3. **Track Revenue** → Monitor total earnings
4. **Manage Services** → Add, update, or remove services
5. **View Payments** → Check transaction history
6. **Receive Notifications** → Real-time booking updates
7. **Confirm Bookings** → Accept or decline bookings
8. **Handle Refunds** → Process cancellations and refunds

## Setup Instructions

### Frontend Setup
```bash
cd salon-booking-frontend
npm install

# Create .env file
echo "VITE_GATEWAY_URL=http://localhost:8862" > .env

npm run dev
```

### Backend Gateway Setup
The application routes through Spring Cloud Gateway at `http://localhost:8862`

**Environment Variables Needed:**
```
spring.cloud.eureka.client.serviceUrl.defaultZone=http://localhost:8761/eureka/
```

### Service Discovery
Eureka Server should be running at `http://localhost:8761`

Registered Services:
- `USER-SERVICE` → Port 8001
- `SALON-SERVICE` → Port 8002
- `SERVICE-OFFERING` → Port 8003
- `CATEGORY-SERVICE` → Port 8004
- `BOOKING-SERVICE` → Port 8005
- `PAYMENT-SERVICE` → Port 8006
- `NOTIFICATION-SERVICE` → Port 8007
- `REVIEW-SERVICE` → Port 8008

## Key Implementation Details

### Authentication
- JWT token stored in localStorage
- Token attached to all API requests via interceptor
- Auto-logout on 401 unauthorized

### State Management
- React hooks (useState, useEffect)
- Local component state
- API calls handled via apiClient
- No external state management library needed (simplified)

### Styling
- Tailwind CSS for all components
- Responsive design (mobile, tablet, desktop)
- Gradient backgrounds and modern UI
- Accessible color schemes

### Real-time Features
- Notifications auto-refresh every 30 seconds
- Booking status updates reflected immediately
- Slot availability checked on date change

### Error Handling
- Try-catch blocks on all API calls
- User-friendly error messages
- Fallback states for loading/error

## Code Style

Following the existing codebase patterns:
- Functional components with React hooks
- TypeScript for type safety
- Consistent naming conventions
- Comprehensive error handling
- Comments for complex logic

## Testing Checklist

- [ ] Browse salons works
- [ ] Search and filter work
- [ ] Salon details load correctly
- [ ] Add multiple services to cart
- [ ] Time slot selection works
- [ ] Slot availability updates correctly
- [ ] Payment form validation works
- [ ] Multiple payment methods supported
- [ ] Booking created successfully
- [ ] Customer dashboard displays bookings
- [ ] Salon owner dashboard shows data
- [ ] Notifications appear in real-time
- [ ] Mark notification as read works
- [ ] Responsive design on all screen sizes

## Common Issues & Solutions

### Gateway Not Responding
- Ensure Spring Cloud Gateway is running on port 8862
- Check if all microservices are registered in Eureka

### No Salons/Bookings Showing
- Verify salon and booking service databases have data
- Check browser console for API errors
- Ensure correct URLs in apiClient.ts

### Payment Not Processing
- Verify payment service is running
- Check payment method validation
- Ensure booking exists before creating payment

### Notifications Not Appearing
- Check notification service is running
- Verify user ID is correctly stored
- Check auto-refresh interval

## Performance Optimizations

1. **Lazy Loading** - Components load on demand
2. **Pagination** - Only load 12 salons per page
3. **API Caching** - Consider Redis on backend
4. **Image Optimization** - Use thumbnails for salons
5. **Code Splitting** - Route-based code splitting

## Future Enhancements

1. Real-time WebSocket notifications
2. Video call consultation with salon owner
3. Loyalty points system
4. Rating and review system with photos
5. Subscription packages
6. Admin panel for system management
7. Analytics dashboard
8. Mobile app (React Native)
9. Email confirmation
10. SMS reminders

## Support

For issues or questions, refer to the video tutorial:
https://www.youtube.com/watch?v=UkxwV613b0g

Project Documentation:
https://hospitable-morning-b24.notion.site/Salon-Appointment-Booking-Full-Stack-Project-With-Microservices-Architecture-a088c39974d34059b1183a89de4491a0
