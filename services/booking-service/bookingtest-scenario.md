# Booking Service API Testing Scenarios

## Base URL
```
http://localhost:8080/api/bookings
```

## Authentication
Most endpoints require JWT authentication. Include the following header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Table of Contents
1. [Renter Endpoints](#renter-endpoints)
2. [Review Endpoints](#review-endpoints)
3. [Owner Endpoints](#owner-endpoints)
4. [Admin Endpoints](#admin-endpoints)
5. [Payment Gateway Endpoints](#payment-gateway-endpoints)
6. [Test Data Examples](#test-data-examples)
7. [Error Scenarios](#error-scenarios)

---

## 🏠 Renter Endpoints

### 1. Create New Booking
**POST** `/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <jwt_token>"
}
```

**Request Body:**
```json
{
  "garage_id": 1,
  "start_time": "2024-01-15T10:00:00Z",
  "end_time": "2024-01-15T18:00:00Z",
  "total_price": "50000.00",
  "notes": "Need parking for the whole day"
}
```

**Expected Response (201):**
```json
{
  "message": "Booking created successfully",
  "data": {
    "booking_id": 1,
    "user_id": 123,
    "garage_id": 1,
    "start_time": "2024-01-15T10:00:00.000Z",
    "end_time": "2024-01-15T18:00:00.000Z",
    "total_price": "50000.00",
    "status": "pending",
    "payment_status": "unpaid",
    "notes": "Need parking for the whole day",
    "created_at": "2024-01-15T08:00:00.000Z",
    "updated_at": "2024-01-15T08:00:00.000Z"
  }
}
```

### 2. Get My Bookings
**GET** `/renter/my-bookings`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Expected Response (200):**
```json
{
  "message": "Fetched user bookings successfully",
  "data": [
    {
      "booking_id": 1,
      "user_id": 123,
      "garage_id": 1,
      "start_time": "2024-01-15T10:00:00.000Z",
      "end_time": "2024-01-15T18:00:00.000Z",
      "total_price": "50000.00",
      "status": "pending",
      "payment_status": "unpaid",
      "notes": "Need parking for the whole day",
      "created_at": "2024-01-15T08:00:00.000Z",
      "updated_at": "2024-01-15T08:00:00.000Z"
    }
  ]
}
```

### 3. Get Specific Booking Details
**GET** `/renter/my-bookings/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Example URL:** `http://localhost:8080/api/bookings/renter/my-bookings/1`

**Expected Response (200):**
```json
{
  "booking_id": 1,
  "user_id": 123,
  "garage_id": 1,
  "start_time": "2024-01-15T10:00:00.000Z",
  "end_time": "2024-01-15T18:00:00.000Z",
  "total_price": "50000.00",
  "status": "confirmed",
  "payment_status": "paid",
  "notes": "Need parking for the whole day",
  "created_at": "2024-01-15T08:00:00.000Z",
  "updated_at": "2024-01-15T08:30:00.000Z"
}
```

### 4. Start Payment Process
**POST** `/:bookingId/payment`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <jwt_token>"
}
```

**Example URL:** `http://localhost:8080/api/bookings/1/payment`

**Request Body:**
```json
{}
```

**Expected Response (200):**
```json
{
  "message": "Payment process started (simplified version)",
  "data": {
    "booking_id": 1,
    "user_id": 123,
    "garage_id": 1,
    "start_time": "2024-01-15T10:00:00.000Z",
    "end_time": "2024-01-15T18:00:00.000Z",
    "total_price": "50000.00",
    "status": "pending",
    "payment_status": "processing",
    "notes": "Need parking for the whole day",
    "created_at": "2024-01-15T08:00:00.000Z",
    "updated_at": "2024-01-15T08:15:00.000Z"
  },
  "note": "This is a simplified implementation. Payment gateway integration skipped."
}
```

### 5. Add Review
**POST** `/:bookingId/review`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <jwt_token>"
}
```

**Example URL:** `http://localhost:8080/api/bookings/1/review`

**Request Body:**
```json
{
  "rating": 5,
  "review_text": "Excellent parking spot, very secure and convenient location!"
}
```

**Expected Response (201):**
```json
{
  "message": "Review added successfully",
  "data": {
    "review_id": 1,
    "booking_id": 1,
    "user_id": 123,
    "garage_id": 1,
    "rating": 5,
    "review_text": "Excellent parking spot, very secure and convenient location!",
    "created_at": "2024-01-15T20:00:00.000Z",
    "updated_at": "2024-01-15T20:00:00.000Z"
  }
}
```

### 6. Cancel Booking
**POST** `/:bookingId/cancel`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <jwt_token>"
}
```

**Example URL:** `http://localhost:8080/api/bookings/1/cancel`

**Request Body:**
```json
{}
```

**Expected Response (200):**
```json
{
  "message": "Booking cancelled successfully",
  "data": {
    "booking_id": 1,
    "user_id": 123,
    "garage_id": 1,
    "start_time": "2024-01-15T10:00:00.000Z",
    "end_time": "2024-01-15T18:00:00.000Z",
    "total_price": "50000.00",
    "status": "cancelled",
    "payment_status": "unpaid",
    "notes": "Need parking for the whole day",
    "created_at": "2024-01-15T08:00:00.000Z",
    "updated_at": "2024-01-15T09:00:00.000Z"
  }
}
```

---

## 📝 Review Endpoints

### 1. Get Garage Reviews (Public)
**GET** `/reviews/garage/:garageId`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Example URL:** `http://localhost:8080/api/bookings/reviews/garage/1`

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of reviews per page (default: 10)

**Example URL with pagination:** `http://localhost:8080/api/bookings/reviews/garage/1?page=1&limit=5`

**Expected Response (200):**
```json
{
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "review_id": 1,
        "booking_id": 1,
        "user_id": 123,
        "rating": 5,
        "review_text": "Excellent parking spot, very secure and convenient location!",
        "created_at": "2024-01-15T20:00:00.000Z"
      },
      {
        "review_id": 2,
        "booking_id": 3,
        "user_id": 456,
        "rating": 4,
        "review_text": "Good location, easy access.",
        "created_at": "2024-01-16T15:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 2,
      "totalPages": 1
    },
    "summary": {
      "averageRating": 4.5,
      "totalReviews": 2
    }
  }
}
```

### 2. Get User Reviews
**GET** `/reviews/user/my-reviews`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Expected Response (200):**
```json
{
  "message": "User reviews retrieved successfully",
  "data": [
    {
      "review_id": 1,
      "booking_id": 1,
      "garage_id": 1,
      "rating": 5,
      "review_text": "Excellent parking spot, very secure and convenient location!",
      "created_at": "2024-01-15T20:00:00.000Z"
    },
    {
      "review_id": 3,
      "booking_id": 5,
      "garage_id": 2,
      "rating": 4,
      "review_text": "Good service, will use again.",
      "created_at": "2024-01-17T10:15:00.000Z"
    }
  ]
}
```

### 3. Get Specific Review (Public)
**GET** `/reviews/:reviewId`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Example URL:** `http://localhost:8080/api/bookings/reviews/1`

**Expected Response (200):**
```json
{
  "message": "Review retrieved successfully",
  "data": {
    "review_id": 1,
    "booking_id": 1,
    "user_id": 123,
    "garage_id": 1,
    "rating": 5,
    "review_text": "Excellent parking spot, very secure and convenient location!",
    "created_at": "2024-01-15T20:00:00.000Z",
    "updated_at": "2024-01-15T20:00:00.000Z"
  }
}
```

---

## 🏢 Owner Endpoints

### 1. Get Booking Requests
**GET** `/owner/requests`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Expected Response (200):**
```json
{
  "message": "Fetched owner booking requests successfully",
  "data": [
    {
      "booking_id": 1,
      "user_id": 123,
      "garage_id": 1,
      "start_time": "2024-01-15T10:00:00.000Z",
      "end_time": "2024-01-15T18:00:00.000Z",
      "total_price": "50000.00",
      "status": "pending",
      "payment_status": "unpaid",
      "notes": "Need parking for the whole day",
      "created_at": "2024-01-15T08:00:00.000Z",
      "updated_at": "2024-01-15T08:00:00.000Z"
    }
  ]
}
```

### 2. Confirm Booking
**POST** `/:bookingId/confirm`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <jwt_token>"
}
```

**Example URL:** `http://localhost:8080/api/bookings/1/confirm`

**Request Body:**
```json
{}
```

**Expected Response (200):**
```json
{
  "message": "Booking confirmed successfully",
  "data": {
    "booking_id": 1,
    "user_id": 123,
    "garage_id": 1,
    "start_time": "2024-01-15T10:00:00.000Z",
    "end_time": "2024-01-15T18:00:00.000Z",
    "total_price": "50000.00",
    "status": "confirmed",
    "payment_status": "unpaid",
    "notes": "Need parking for the whole day",
    "created_at": "2024-01-15T08:00:00.000Z",
    "updated_at": "2024-01-15T08:30:00.000Z"
  }
}
```

### 3. Reject Booking
**POST** `/:bookingId/reject`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <jwt_token>"
}
```

**Example URL:** `http://localhost:8080/api/bookings/1/reject`

**Request Body:**
```json
{}
```

**Expected Response (200):**
```json
{
  "message": "Booking rejected successfully",
  "data": {
    "booking_id": 1,
    "user_id": 123,
    "garage_id": 1,
    "start_time": "2024-01-15T10:00:00.000Z",
    "end_time": "2024-01-15T18:00:00.000Z",
    "total_price": "50000.00",
    "status": "rejected",
    "payment_status": "unpaid",
    "notes": "Need parking for the whole day",
    "created_at": "2024-01-15T08:00:00.000Z",
    "updated_at": "2024-01-15T08:45:00.000Z"
  }
}
```

### 4. Get Owner Income Summary
**GET** `/owner/reports/income`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Expected Response (200):**
```json
{
  "message": "Owner income fetched successfully (simplified version)",
  "data": {
    "total_income": 150000,
    "total_bookings": 3,
    "period": "all_time"
  },
  "note": "This is a simplified implementation. Garage ownership filtering not implemented yet."
}
```

### 5. Get Owner Transaction History
**GET** `/owner/reports/transactions`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Expected Response (200):**
```json
{
  "message": "Owner transactions fetched successfully (simplified version)",
  "data": [
    {
      "booking_id": 1,
      "user_id": 123,
      "garage_id": 1,
      "start_time": "2024-01-15T10:00:00.000Z",
      "end_time": "2024-01-15T18:00:00.000Z",
      "total_price": "50000.00",
      "status": "confirmed",
      "payment_status": "paid",
      "notes": "Need parking for the whole day",
      "created_at": "2024-01-15T08:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "note": "This is a simplified implementation. Garage ownership filtering not implemented yet."
}
```

---

## 👨‍💼 Admin Endpoints

### 1. Get All Bookings
**GET** `/admin/bookings`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Expected Response (200):**
```json
{
  "message": "All bookings fetched successfully",
  "data": [
    {
      "booking_id": 1,
      "user_id": 123,
      "garage_id": 1,
      "start_time": "2024-01-15T10:00:00.000Z",
      "end_time": "2024-01-15T18:00:00.000Z",
      "total_price": "50000.00",
      "status": "confirmed",
      "payment_status": "paid",
      "notes": "Need parking for the whole day",
      "created_at": "2024-01-15T08:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    },
    {
      "booking_id": 2,
      "user_id": 456,
      "garage_id": 2,
      "start_time": "2024-01-16T09:00:00.000Z",
      "end_time": "2024-01-16T17:00:00.000Z",
      "total_price": "40000.00",
      "status": "pending",
      "payment_status": "unpaid",
      "notes": null,
      "created_at": "2024-01-16T07:00:00.000Z",
      "updated_at": "2024-01-16T07:00:00.000Z"
    }
  ]
}
```

### 2. Get Analytics Summary
**GET** `/admin/analytics`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

**Expected Response (200):**
```json
{
  "message": "Analytics summary fetched successfully",
  "summary": {
    "totalBookings": 5,
    "totalRevenue": 250000
  }
}
```

---

## 💳 Payment Gateway Endpoints

### 1. Payment Webhook
**POST** `/payments/webhook`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body (Success Payment):**
```json
{
  "booking_id": 1,
  "transaction_status": "settlement"
}
```

**Request Body (Failed Payment):**
```json
{
  "booking_id": 1,
  "transaction_status": "failed"
}
```

**Request Body (Pending Payment):**
```json
{
  "booking_id": 1,
  "transaction_status": "pending"
}
```

**Expected Response (200):**
```json
{
  "message": "Payment webhook processed successfully",
  "data": {
    "booking_id": 1,
    "user_id": 123,
    "garage_id": 1,
    "start_time": "2024-01-15T10:00:00.000Z",
    "end_time": "2024-01-15T18:00:00.000Z",
    "total_price": "50000.00",
    "status": "confirmed",
    "payment_status": "paid",
    "notes": "Need parking for the whole day",
    "created_at": "2024-01-15T08:00:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 📊 Test Data Examples

### Sample Booking Creation Flow
1. **Create Booking** → Get `booking_id`
2. **Update Status** → Mark as "completed"
3. **Add Review** → Use the `booking_id`
4. **Get Reviews** → Verify review appears

### Sample Test Data
```json
{
  "garage_id": 1,
  "start_time": "2024-01-15T08:00:00Z",
  "end_time": "2024-01-15T18:00:00Z",
  "vehicle_type": "car",
  "license_plate": "B1234XYZ"
}
```

### Review System Test Scenarios

#### Test Scenario 1: Complete Review Flow
```bash
# 1. Create a booking
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "garage_id": 1,
    "start_time": "2024-01-15T08:00:00Z",
    "end_time": "2024-01-15T18:00:00Z",
    "vehicle_type": "car",
    "license_plate": "B1234XYZ"
  }'

# 2. Update booking status to completed (simulate completion)
curl -X PUT http://localhost:8080/api/bookings/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{"status": "completed"}'

# 3. Add a review
curl -X POST http://localhost:8080/api/bookings/1/review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "rating": 5,
    "review_text": "Excellent parking spot, very secure and convenient location!"
  }'

# 4. Get garage reviews
curl -X GET http://localhost:8080/api/bookings/reviews/garage/1

# 5. Get user's reviews
curl -X GET http://localhost:8080/api/bookings/reviews/user/my-reviews \
  -H "Authorization: Bearer <jwt_token>"
```

#### Test Scenario 2: Review Validation Tests
```bash
# Test 1: Try to review non-completed booking (should fail)
curl -X POST http://localhost:8080/api/bookings/2/review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "rating": 4,
    "review_text": "Good service"
  }'

# Test 2: Try to review with invalid rating (should fail)
curl -X POST http://localhost:8080/api/bookings/1/review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "rating": 6,
    "review_text": "Invalid rating test"
  }'

# Test 3: Try to review same booking twice (should fail)
curl -X POST http://localhost:8080/api/bookings/1/review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "rating": 3,
    "review_text": "Duplicate review test"
  }'
```

#### Test Scenario 3: Pagination and Summary Tests
```bash
# Test pagination with different limits
curl -X GET "http://localhost:8080/api/bookings/reviews/garage/1?page=1&limit=2"
curl -X GET "http://localhost:8080/api/bookings/reviews/garage/1?page=2&limit=2"

# Test without pagination (default values)
curl -X GET http://localhost:8080/api/bookings/reviews/garage/1

# Get specific review
curl -X GET http://localhost:8080/api/bookings/reviews/1
```

### Sample Review Data for Testing
```json
{
  "test_reviews": [
    {
      "booking_id": 1,
      "rating": 5,
      "review_text": "Excellent parking spot, very secure and convenient location!"
    },
    {
      "booking_id": 2,
      "rating": 4,
      "review_text": "Good location, easy access."
    },
    {
      "booking_id": 3,
      "rating": 3,
      "review_text": "Average experience, could be better."
    },
    {
      "booking_id": 4,
      "rating": 5,
      "review_text": "Perfect spot for my needs!"
    },
    {
      "booking_id": 5,
      "rating": 4,
      "review_text": "Good service, will use again."
    }
  ]
}
```

### Sample User IDs
- Renter: `123`
- Owner: `456`
- Admin: `789`

### Sample Garage IDs
- Garage 1: `1`
- Garage 2: `2`
- Garage 3: `3`

### Sample JWT Tokens (for testing)
```
Renter Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywicm9sZSI6InJlbnRlciJ9.example
Owner Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ1Niwicm9sZSI6Im93bmVyIn0.example
Admin Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjc4OSwicm9sZSI6ImFkbWluIn0.example
```

---

## ❌ Error Scenarios

### 1. Missing Required Fields (400)
**Request:**
```json
{
  "garage_id": 1
  // Missing start_time, end_time, total_price
}
```

**Response:**
```json
{
  "message": "Missing required fields"
}
```

### 2. Invalid Garage ID (400)
**Request with non-existent garage_id:**
```json
{
  "garage_id": 999,
  "start_time": "2024-01-15T10:00:00Z",
  "end_time": "2024-01-15T18:00:00Z",
  "total_price": "50000.00",
  "notes": "Test booking"
}
```

**Response:**
```json
{
  "message": "Invalid garage_id",
  "error": "Garage not found"
}
```

### 3. Invalid Time Range (400)
**Request where start_time is after end_time:**
```json
{
  "garage_id": 1,
  "start_time": "2024-01-15T18:00:00Z",
  "end_time": "2024-01-15T10:00:00Z",
  "total_price": "50000.00",
  "notes": "Invalid time range"
}
```

**Response:**
```json
{
  "message": "Invalid time range: start_time must be before end_time"
}
```

### 4. Past Booking Time (400)
**Request with start_time in the past:**
```json
{
  "garage_id": 1,
  "start_time": "2023-01-15T10:00:00Z",
  "end_time": "2023-01-15T18:00:00Z",
  "total_price": "50000.00",
  "notes": "Past booking"
}
```

**Response:**
```json
{
  "message": "Invalid booking time: cannot book in the past"
}
```

### 5. Garage Service Unavailable (400)
**When garage service is down:**

**Response:**
```json
{
  "message": "Invalid garage_id",
  "error": "Garage service unavailable"
}
```

### 6. Unauthorized Access (401)
**Request without Authorization header**

**Response:**
```json
{
  "message": "Unauthorized"
}
```

### 7. Forbidden Access (403)
**Request to access another user's booking**

**Response:**
```json
{
  "message": "Access denied"
}
```

### 8. Booking Not Found (404)
**Request to non-existent booking ID**

**Response:**
```json
{
  "message": "Booking not found"
}
```

### 9. Invalid Rating (400)
**Request with invalid rating:**
```json
{
  "rating": 6,
  "review_text": "Great!"
}
```

**Response:**
```json
{
  "message": "Rating must be between 1 and 5"
}
```

### 10. Invalid Webhook Payload (400)
**Request with missing webhook data:**
```json
{
  "booking_id": 1
  // Missing transaction_status
}
```

**Response:**
```json
{
  "message": "Invalid webhook payload"
}
```

---

## 🧪 Testing Checklist

### Renter Flow
- [ ] Create booking with valid data
- [ ] Create booking with missing fields (should fail)
- [ ] Get my bookings list
- [ ] Get specific booking details
- [ ] Start payment process
- [ ] Add review after booking completion
- [ ] Cancel booking

### Owner Flow
- [ ] Get booking requests for owned garages
- [ ] Confirm pending booking
- [ ] Reject pending booking
- [ ] Get income summary
- [ ] Get transaction history

### Admin Flow
- [ ] Get all bookings in system
- [ ] Get analytics summary

### Payment Flow
- [ ] Process successful payment webhook
- [ ] Process failed payment webhook
- [ ] Process pending payment webhook

### Error Handling
- [ ] Test all endpoints without authentication
- [ ] Test access to other users' data
- [ ] Test with invalid booking IDs
- [ ] Test with malformed request bodies
- [ ] Test booking creation with non-existent garage_id
- [ ] Test booking creation with invalid time range (start_time after end_time)
- [ ] Test booking creation with past booking time
- [ ] Test booking creation when garage service is unavailable
- [ ] Test invalid rating values (< 1 or > 5)
- [ ] Test webhook with missing transaction_status

---

## 📝 Notes

1. **Authentication**: All endpoints except the payment webhook require JWT authentication
2. **Role-based Access**: Some endpoints require specific roles (renter, owner, admin)
3. **Simplified Implementation**: Some features like reviews and garage ownership filtering are simplified
4. **Payment Integration**: Payment gateway integration is mocked for testing purposes
5. **Database Schema**: Bookings table includes fields for booking_id, user_id, garage_id, timestamps, pricing, and status tracking

---

## 🏗️ Implementation Requirements

### Database Tables Required

#### 1. **bookings** (Primary Table - Already Implemented)
```sql
CREATE TABLE bookings (
  booking_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  garage_id INTEGER NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, rejected, cancelled, completed
  payment_status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, processing, paid, failed, refunded
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **reviews** (Implemented)
```sql
CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(booking_id),
  user_id INTEGER NOT NULL,
  garage_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. **garages** (External Service - Mock Required)
```sql
-- This table exists in garage-service, but we need mock data for validation
CREATE TABLE garages (
  garage_id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  capacity INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, maintenance
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. **users** (External Service - Mock Required)
```sql
-- This table exists in auth-service, but we need mock data for validation
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL, -- renter, owner, admin
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Simplified Implementations Needed

#### 1. **Review System** (Fully Implemented)
**Current Status:** Fully functional with database integration

**Implemented Features:**
- ✅ Created `reviews` table with proper schema
- ✅ Implemented actual review storage in `addReview()` function
- ✅ Added validation for:
  - Only completed bookings can be reviewed
  - One review per booking
  - Rating must be 1-5
- ✅ Added review retrieval endpoints with pagination
- ✅ Added review summary with average rating

**Files Modified:**
- `src/controllers/bookingController.js` - Updated `addReview()` function
- `src/db/schema.ts` - Added reviews table schema
- `src/routes/bookingRoutes.js` - Added review retrieval routes

#### 2. **Garage Ownership Validation** (Currently Simplified)
**Current Status:** Owner endpoints don't filter by garage ownership

**What to Implement:**
- Add garage ownership validation in owner endpoints
- Filter booking requests by owned garages only
- Validate owner permissions before confirming/rejecting bookings

**Files to Modify:**
- `src/controllers/bookingController.js` - Update owner functions
- Add garage service integration for ownership validation

#### 3. **Payment Integration** (Currently Dummy)
**Current Status:** Mock payment responses, no actual payment processing

**What to Keep Simple:**
- Keep webhook endpoint for testing
- Simulate payment status changes
- No actual payment gateway integration (Midtrans, Stripe, etc.)
- Use dummy transaction IDs

**Mock Payment Flow:**
```javascript
// Simplified payment simulation
const simulatePayment = (bookingId) => {
  // Randomly succeed or fail for testing
  const success = Math.random() > 0.2; // 80% success rate
  return {
    transaction_id: `TXN_${Date.now()}_${bookingId}`,
    status: success ? 'settlement' : 'failed',
    amount: booking.total_price
  };
};
```

#### 4. **Analytics and Reporting** (Currently Basic)
**Current Status:** Simple count and sum queries

**What to Enhance:**
- Add date range filtering
- Add booking status breakdown
- Add revenue trends
- Add garage performance metrics

**Example Enhanced Analytics:**
```javascript
const getAnalytics = async (startDate, endDate) => {
  return {
    totalBookings: count,
    totalRevenue: sum,
    bookingsByStatus: {
      pending: pendingCount,
      confirmed: confirmedCount,
      completed: completedCount,
      cancelled: cancelledCount
    },
    revenueByMonth: monthlyRevenue,
    topGarages: topPerformingGarages
  };
};
```

#### 5. **Notification System** (Not Implemented)
**Current Status:** No notifications

**What to Add (Optional):**
- Email notifications for booking status changes
- SMS notifications for payment confirmations
- Push notifications for mobile app

### External Service Dependencies

#### 1. **Garage Service Integration**
**Current Implementation:** HTTP calls to garage service via API Gateway

**Required Endpoints:**
- `GET /api/garages/:id` - Validate garage existence
- `GET /api/garages/owner/:ownerId` - Get garages by owner

**Mock Data for Testing:**
```javascript
const mockGarages = [
  { garage_id: 1, owner_id: 456, name: "Downtown Parking", status: "active" },
  { garage_id: 2, owner_id: 456, name: "Mall Parking", status: "active" },
  { garage_id: 3, owner_id: 789, name: "Airport Parking", status: "active" }
];
```

#### 2. **Auth Service Integration**
**Current Implementation:** JWT token validation

**Required Features:**
- User role validation (renter, owner, admin)
- User ID extraction from JWT
- Permission checking

### Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/booking_db

# External Services
GARAGE_SERVICE_URL=http://localhost:8080/api/garages
AUTH_SERVICE_URL=http://localhost:8080/api/auth

# Development Flags
SKIP_GARAGE_VALIDATION=false
SKIP_AUTH_VALIDATION=false

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=3003
```

### API Gateway Routes Configuration

```javascript
// Required routes in API Gateway
const bookingRoutes = {
  "/api/bookings/*": "http://booking-service:3003",
  "/api/garages/*": "http://garage-service:3001", 
  "/api/auth/*": "http://auth-service:3002"
};
```

### Testing Data Setup

#### Sample Users
```sql
INSERT INTO users (user_id, email, name, role) VALUES
(123, 'renter@test.com', 'John Renter', 'renter'),
(456, 'owner@test.com', 'Jane Owner', 'owner'),
(789, 'admin@test.com', 'Admin User', 'admin');
```

#### Sample Garages
```sql
INSERT INTO garages (garage_id, owner_id, name, address, price_per_hour, capacity) VALUES
(1, 456, 'Downtown Parking', '123 Main St', 5000.00, 50),
(2, 456, 'Mall Parking', '456 Mall Ave', 3000.00, 100),
(3, 789, 'Airport Parking', '789 Airport Rd', 8000.00, 200);
```

### Development Priority

1. **High Priority:**
   - ✅ Fix garage validation (already implemented)
   - ✅ Implement reviews table and functionality
   - Add proper owner garage filtering

2. **Medium Priority:**
   - Enhanced analytics with date filtering
   - Better error handling and validation
   - Add booking conflict checking

3. **Low Priority:**
   - Notification system
   - Advanced reporting features
   - Payment gateway integration (keep simple for now)

---

## 🚀 Quick Test Commands (using curl)

### Create Booking
```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "garage_id": 1,
    "start_time": "2024-01-15T10:00:00Z",
    "end_time": "2024-01-15T18:00:00Z",
    "total_price": "50000.00",
    "notes": "Test booking"
  }'
```

### Get My Bookings
```bash
curl -X GET http://localhost:8080/api/bookings/renter/my-bookings \
  -H "Authorization: Bearer <your_token>"
```

### Confirm Booking (Owner)
```bash
curl -X POST http://localhost:8080/api/bookings/1/confirm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <owner_token>"
```

### Payment Webhook
```bash
curl -X POST http://localhost:8080/api/bookings/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": 1,
    "transaction_status": "settlement"
  }'
```