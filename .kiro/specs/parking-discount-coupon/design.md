# Design Document

## Overview

The parking discount coupon feature is a value-added service integrated into the RTX Cinema booking system that rewards customers who drive to the cinema with a parking discount. After successfully booking movie tickets, users are presented with an optional parking discount offer on the Booking Confirmation Page (TicketPage). If accepted, the system generates a unique, time-limited coupon that can be redeemed at the cinema's parking facility.

The feature is designed to:
- Enhance customer experience by providing additional value
- Encourage repeat visits through tangible benefits
- Integrate seamlessly with the existing booking flow
- Maintain the established UI/UX patterns and visual identity
- Prevent fraud through unique code generation and verification

## Architecture

### System Components

The parking discount coupon feature consists of three main layers:

1. **Frontend Layer** (React)
   - ParkingDiscountOffer component (initial offer card)
   - ParkingCoupon component (coupon display with QR code)
   - Integration with TicketPage component

2. **Backend Layer** (Node.js/Express)
   - POST /api/parking/claim-coupon endpoint
   - GET /api/parking/verify-coupon endpoint
   - Coupon generation logic
   - Validation and verification logic

3. **Data Layer** (MongoDB)
   - ParkingCoupon model/schema
   - Database operations for coupon management

### Data Flow

```
User completes booking
    ↓
TicketPage loads with booking data
    ↓
ParkingDiscountOffer component renders
    ↓
User clicks "Yes, Get My Discount"
    ↓
Frontend sends POST request to /api/parking/claim-coupon
    ↓
Backend checks for existing coupon
    ↓
If exists: return existing coupon
If not: generate new unique code → save to database → return coupon
    ↓
Frontend receives coupon data
    ↓
ParkingCoupon component renders with code and QR code
    ↓
User presents coupon at parking facility
    ↓
Parking staff verifies via GET /api/parking/verify-coupon
    ↓
Backend validates and marks as used
```

## Components and Interfaces

### Frontend Components

#### 1. ParkingDiscountOffer Component

**Purpose**: Display the initial parking discount offer to users

**Props**:
```typescript
interface ParkingDiscountOfferProps {
  bookingId: string;
  userId: string;
  onClaim: (couponData: CouponData) => void;
  onDismiss: () => void;
}
```

**State**:
```typescript
interface ParkingDiscountOfferState {
  isLoading: boolean;
  error: string | null;
}
```

**UI Elements**:
- Heading: "🚗 Did you drive here?"
- Subtext: "Get up to 50% off at our parking facility"
- "Yes, Get My Discount" button (primary action)
- "No Thanks" button (dismiss action)

**Styling**:
- Matches existing RTX Cinema color scheme (#D84040 primary red, #4CAF50 green accents)
- Uses Inter font family
- Card-based design with rgba backgrounds and backdrop blur
- Responsive grid layout

#### 2. ParkingCoupon Component

**Purpose**: Display the claimed coupon with code and QR code

**Props**:
```typescript
interface ParkingCouponProps {
  code: string;
  discountPercent: number;
  expiresAt: Date;
}
```

**State**:
```typescript
interface ParkingCouponState {
  isCopied: boolean;
}
```

**UI Elements**:
- Coupon code display (large, prominent)
- QR code (generated client-side)
- Validity text: "Valid today only — show this at the parking counter"
- "Copy Code" button with feedback
- Download/Screenshot hint text

**Styling**:
- Ticket-like design matching the existing TicketPage aesthetic
- Gradient backgrounds and shadows
- Professional barcode/QR code presentation
- Animated success states

#### 3. TicketPage Integration

**Modifications**:
- Add state to track parking coupon status
- Conditionally render ParkingDiscountOffer or ParkingCoupon
- Position below ticket details, above action buttons
- Maintain existing layout and spacing

### Backend API Endpoints

#### 1. POST /api/parking/claim-coupon

**Purpose**: Generate or retrieve a parking coupon for a booking

**Request Body**:
```typescript
interface ClaimCouponRequest {
  bookingId: string;
  userId: string;
}
```

**Response**:
```typescript
interface ClaimCouponResponse {
  success: boolean;
  coupon?: {
    code: string;
    discountPercent: number;
    expiresAt: string; // ISO 8601 format
  };
  error?: string;
}
```

**Logic**:
1. Validate request parameters
2. Check if coupon already exists for bookingId
3. If exists, return existing coupon
4. If not, generate unique code
5. Calculate expiration (end of movie day)
6. Save to database
7. Return coupon data

**Error Handling**:
- 400: Invalid request parameters
- 404: Booking not found
- 500: Server error during generation

#### 2. GET /api/parking/verify-coupon

**Purpose**: Verify and redeem a parking coupon

**Query Parameters**:
```typescript
interface VerifyCouponQuery {
  code: string;
}
```

**Response**:
```typescript
interface VerifyCouponResponse {
  valid: boolean;
  discountPercent?: number;
  bookingId?: string;
  isUsed?: boolean;
  message?: string;
}
```

**Logic**:
1. Validate code format
2. Query database for coupon
3. Check if coupon exists
4. Check if coupon is expired
5. Check if coupon is already used
6. If valid and unused, mark as used
7. Return validation result

**Validation Rules**:
- Code must match format PARK-XXXX-DDMM
- Coupon must exist in database
- Coupon must not be expired
- Coupon must not be already used

## Data Models

### ParkingCoupon Schema

```javascript
const parkingCouponSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
    match: /^PARK-[A-Z0-9]{4}-\d{4}$/
  },
  discountPercent: {
    type: Number,
    required: true,
    default: 50,
    min: 0,
    max: 100
  },
  isUsed: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
parkingCouponSchema.index({ bookingId: 1 });
parkingCouponSchema.index({ code: 1 });
parkingCouponSchema.index({ userId: 1, createdAt: -1 });
parkingCouponSchema.index({ expiresAt: 1, isUsed: 1 });
```

### Coupon Code Generation Algorithm

```javascript
function generateCouponCode(date) {
  // Generate 4 random alphanumeric characters (uppercase)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Format date as DDMM
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const datePart = `${day}${month}`;
  
  // Combine: PARK-XXXX-DDMM
  return `PARK-${randomPart}-${datePart}`;
}
```

### Expiration Calculation

```javascript
function calculateExpiration(bookingDate) {
  // Set expiration to 11:59:59 PM on the movie day
  const expiration = new Date(bookingDate);
  expiration.setHours(23, 59, 59, 999);
  return expiration;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Dismiss preserves page state
*For any* booking confirmation page state, dismissing the parking discount offer card should not reload the page and should maintain all other page content unchanged.
**Validates: Requirements 2.2, 2.3**

### Property 2: API call includes required parameters
*For any* booking ID and user ID, clicking "Yes, Get My Discount" should send an API request containing both the booking ID and user ID.
**Validates: Requirements 3.1**

### Property 3: Idempotent coupon claiming
*For any* booking ID, claiming a coupon multiple times should always return the same coupon code without creating duplicates.
**Validates: Requirements 3.3, 9.2**

### Property 4: Coupon code format validation
*For any* generated coupon code, it should match the format PARK-XXXX-DDMM where XXXX is 4 alphanumeric characters and DDMM is day-month.
**Validates: Requirements 3.4, 4.2**

### Property 5: Complete coupon record creation
*For any* newly created coupon, the database record should contain all required fields: bookingId, userId, code, discountPercent (50), isUsed (false), createdAt, and expiresAt (end of movie day).
**Validates: Requirements 3.5, 10.2, 10.4, 10.5**

### Property 6: API response completeness
*For any* successful coupon claim or retrieval, the API response should include the coupon code, discount percent, and expiration timestamp.
**Validates: Requirements 3.6**

### Property 7: UI state transition on claim
*For any* successful coupon claim, the parking discount offer card should be replaced by the coupon card displaying the claimed coupon.
**Validates: Requirements 4.1**

### Property 8: QR code encoding correctness
*For any* displayed coupon, the QR code should encode the exact coupon code, and decoding the QR code should return the original coupon code.
**Validates: Requirements 4.3**

### Property 9: Clipboard copy functionality
*For any* coupon code, clicking the "Copy Code" button should copy the exact coupon code to the system clipboard.
**Validates: Requirements 5.1**

### Property 10: Copy feedback display
*For any* successful copy action, the UI should provide visual feedback confirming the copy operation.
**Validates: Requirements 5.2**

### Property 11: Copy error handling
*For any* failed copy action, the UI should display an error message to the user.
**Validates: Requirements 5.3**

### Property 12: Verification database lookup
*For any* coupon code submitted to the verification endpoint, the backend should perform a database lookup to check if the code exists.
**Validates: Requirements 6.1**

### Property 13: Valid coupon response completeness
*For any* valid coupon code verification, the API response should include validation status true, discount percent, booking ID, and usage status.
**Validates: Requirements 6.2**

### Property 14: Invalid coupon rejection
*For any* invalid or non-existent coupon code, the verification endpoint should return validation status false.
**Validates: Requirements 6.3**

### Property 15: Coupon usage state mutation
*For any* valid and unused coupon verification, the coupon's isUsed flag should be set to true in the database after verification.
**Validates: Requirements 6.4**

### Property 16: Expiration validation
*For any* coupon with an expiration timestamp in the past, the verification endpoint should return validation status false regardless of other factors.
**Validates: Requirements 6.5**

### Property 17: Code uniqueness
*For any* set of generated coupon codes, no two codes should be identical.
**Validates: Requirements 7.1**

### Property 18: Database uniqueness enforcement
*For any* attempt to insert a coupon with a duplicate code, the database should reject the insertion.
**Validates: Requirements 7.2, 10.3**

### Property 19: Pre-generation uniqueness check
*For any* coupon code generation, the backend should verify the generated code doesn't already exist in the database before saving.
**Validates: Requirements 7.3**

### Property 20: Collision retry mechanism
*For any* generated code that already exists in the database, the backend should generate a new code and retry until a unique code is found.
**Validates: Requirements 7.4**

### Property 21: Booking-coupon uniqueness
*For any* booking ID, only one coupon record should exist in the database.
**Validates: Requirements 9.1, 9.3**

## Error Handling

### Frontend Error Scenarios

1. **Network Failure**
   - Scenario: API request fails due to network issues
   - Handling: Display user-friendly error message, allow retry
   - UI: Show error state in ParkingDiscountOffer component

2. **Invalid Response**
   - Scenario: API returns malformed data
   - Handling: Log error, display generic error message
   - UI: Graceful degradation, hide parking offer

3. **Clipboard API Unavailable**
   - Scenario: Browser doesn't support clipboard API
   - Handling: Fallback to manual copy instruction
   - UI: Show "Please copy manually" message

4. **QR Code Generation Failure**
   - Scenario: QR library fails to generate code
   - Handling: Display code without QR, log error
   - UI: Show text code prominently

### Backend Error Scenarios

1. **Database Connection Failure**
   - Scenario: Cannot connect to MongoDB
   - Handling: Return 500 error, log details
   - Response: `{ success: false, error: "Service temporarily unavailable" }`

2. **Invalid Request Parameters**
   - Scenario: Missing or invalid bookingId/userId
   - Handling: Return 400 error with validation details
   - Response: `{ success: false, error: "Invalid request parameters" }`

3. **Booking Not Found**
   - Scenario: bookingId doesn't exist in system
   - Handling: Return 404 error
   - Response: `{ success: false, error: "Booking not found" }`

4. **Code Generation Collision Loop**
   - Scenario: Unable to generate unique code after multiple attempts
   - Handling: Return 500 error, alert monitoring
   - Response: `{ success: false, error: "Unable to generate coupon" }`

5. **Expired Coupon Verification**
   - Scenario: Coupon is past expiration date
   - Handling: Return valid=false with expiration message
   - Response: `{ valid: false, message: "Coupon has expired" }`

6. **Already Used Coupon**
   - Scenario: Coupon has already been redeemed
   - Handling: Return valid=false with usage message
   - Response: `{ valid: false, message: "Coupon has already been used" }`

### Error Recovery Strategies

1. **Retry Logic**: Implement exponential backoff for transient failures
2. **Graceful Degradation**: Feature failure doesn't break booking flow
3. **User Communication**: Clear, actionable error messages
4. **Logging**: Comprehensive error logging for debugging
5. **Monitoring**: Alert on high error rates or critical failures

## Testing Strategy

### Unit Testing

**Frontend Unit Tests**:
- ParkingDiscountOffer component rendering
- ParkingCoupon component rendering
- Button click handlers
- State management
- Error state rendering
- Clipboard copy functionality
- QR code generation

**Backend Unit Tests**:
- Coupon code generation function
- Expiration calculation function
- Code format validation
- Request parameter validation
- Database query functions
- Error response formatting

**Test Examples**:
```javascript
// Example: Test coupon code format
test('generated code matches PARK-XXXX-DDMM format', () => {
  const code = generateCouponCode(new Date('2024-05-18'));
  expect(code).toMatch(/^PARK-[A-Z0-9]{4}-\d{4}$/);
  expect(code).toContain('-1805'); // May 18
});

// Example: Test expiration calculation
test('expiration is set to end of day', () => {
  const bookingDate = new Date('2024-05-18T14:30:00');
  const expiration = calculateExpiration(bookingDate);
  expect(expiration.getHours()).toBe(23);
  expect(expiration.getMinutes()).toBe(59);
  expect(expiration.getSeconds()).toBe(59);
});
```

### Property-Based Testing

**Property-Based Test Configuration**:
- Library: fast-check (JavaScript/TypeScript)
- Minimum iterations: 100 per property
- Each test tagged with property reference from design document

**Property Test Examples**:

```javascript
// Property 3: Idempotent coupon claiming
// Feature: parking-discount-coupon, Property 3: Idempotent coupon claiming
test('claiming coupon multiple times returns same code', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.string(), // bookingId
      fc.string(), // userId
      async (bookingId, userId) => {
        const claim1 = await claimCoupon(bookingId, userId);
        const claim2 = await claimCoupon(bookingId, userId);
        const claim3 = await claimCoupon(bookingId, userId);
        
        expect(claim1.code).toBe(claim2.code);
        expect(claim2.code).toBe(claim3.code);
      }
    ),
    { numRuns: 100 }
  );
});

// Property 4: Coupon code format validation
// Feature: parking-discount-coupon, Property 4: Coupon code format validation
test('all generated codes match format', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.date(), // generation date
      async (date) => {
        const code = generateCouponCode(date);
        expect(code).toMatch(/^PARK-[A-Z0-9]{4}-\d{4}$/);
        
        // Verify date part matches input date
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        expect(code).toContain(`-${day}${month}`);
      }
    ),
    { numRuns: 100 }
  );
});

// Property 8: QR code encoding correctness
// Feature: parking-discount-coupon, Property 8: QR code encoding correctness
test('QR code round-trip preserves coupon code', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.string({ minLength: 15, maxLength: 15 }), // coupon code
      async (code) => {
        const qrCode = generateQRCode(code);
        const decoded = decodeQRCode(qrCode);
        expect(decoded).toBe(code);
      }
    ),
    { numRuns: 100 }
  );
});

// Property 17: Code uniqueness
// Feature: parking-discount-coupon, Property 17: Code uniqueness
test('generated codes are unique', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.integer({ min: 10, max: 1000 }), // number of codes to generate
      async (count) => {
        const codes = new Set();
        for (let i = 0; i < count; i++) {
          const code = generateCouponCode(new Date());
          codes.add(code);
        }
        // All codes should be unique
        expect(codes.size).toBe(count);
      }
    ),
    { numRuns: 100 }
  );
});

// Property 21: Booking-coupon uniqueness
// Feature: parking-discount-coupon, Property 21: Booking-coupon uniqueness
test('only one coupon per booking', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.string(), // bookingId
      fc.string(), // userId
      async (bookingId, userId) => {
        // Claim coupon multiple times
        await claimCoupon(bookingId, userId);
        await claimCoupon(bookingId, userId);
        await claimCoupon(bookingId, userId);
        
        // Query database for coupons with this bookingId
        const coupons = await ParkingCoupon.find({ bookingId });
        expect(coupons.length).toBe(1);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Testing

**Integration Test Scenarios**:
1. End-to-end coupon claim flow
2. Coupon verification by parking staff
3. Database persistence and retrieval
4. API endpoint integration
5. Frontend-backend communication

**Test Coverage Goals**:
- Unit tests: 90%+ code coverage
- Property tests: All 21 correctness properties
- Integration tests: All critical user flows
- Edge cases: Expiration, duplicates, errors

### Manual Testing Checklist

- [ ] Visual consistency with existing UI
- [ ] Responsive design on mobile devices
- [ ] QR code scannability with real devices
- [ ] Clipboard functionality across browsers
- [ ] Error message clarity and helpfulness
- [ ] Performance under load
- [ ] Accessibility compliance

## Security Considerations

### Code Generation Security

1. **Randomness**: Use cryptographically secure random number generator
2. **Collision Resistance**: Implement retry logic with maximum attempts
3. **Format Validation**: Strict regex validation on input

### API Security

1. **Authentication**: Verify user owns the booking before claiming
2. **Rate Limiting**: Prevent abuse of claim endpoint
3. **Input Validation**: Sanitize all user inputs
4. **SQL Injection Prevention**: Use parameterized queries

### Data Protection

1. **PII Handling**: Minimal storage of user data
2. **Audit Trail**: Log all coupon claims and verifications
3. **Expiration Enforcement**: Automatic cleanup of expired coupons

## Performance Considerations

### Frontend Performance

1. **Lazy Loading**: Load QR code library only when needed
2. **Memoization**: Cache QR code generation results
3. **Optimistic UI**: Show coupon immediately, sync in background

### Backend Performance

1. **Database Indexing**: Index on bookingId, code, userId, expiresAt
2. **Query Optimization**: Use projection to limit returned fields
3. **Caching**: Cache frequently accessed coupons (Redis)

### Scalability

1. **Horizontal Scaling**: Stateless API design
2. **Database Sharding**: Partition by date or booking ID
3. **CDN**: Serve QR code generation library from CDN

## Deployment Considerations

### Database Migration

```javascript
// Migration script to create parking_coupons collection
db.createCollection('parking_coupons');
db.parking_coupons.createIndex({ bookingId: 1 }, { unique: true });
db.parking_coupons.createIndex({ code: 1 }, { unique: true });
db.parking_coupons.createIndex({ userId: 1, createdAt: -1 });
db.parking_coupons.createIndex({ expiresAt: 1, isUsed: 1 });
```

### Environment Variables

```
PARKING_COUPON_DISCOUNT_PERCENT=50
PARKING_COUPON_EXPIRATION_HOUR=23
PARKING_COUPON_EXPIRATION_MINUTE=59
```

### Feature Flags

- `ENABLE_PARKING_DISCOUNT`: Toggle feature on/off
- `PARKING_DISCOUNT_LOCATIONS`: Limit to specific cinema locations

### Monitoring

1. **Metrics to Track**:
   - Coupon claim rate
   - Coupon redemption rate
   - API response times
   - Error rates
   - Code generation collisions

2. **Alerts**:
   - High error rate (>5%)
   - Slow API responses (>2s)
   - Code generation failures
   - Database connection issues

### Rollback Plan

1. Hide UI components via feature flag
2. Disable API endpoints
3. Maintain database for historical data
4. No data loss on rollback

## Future Enhancements

1. **Multi-tier Discounts**: Different discount percentages based on booking value
2. **Extended Validity**: Multi-day parking for multi-day bookings
3. **Push Notifications**: Remind users about unused coupons
4. **Analytics Dashboard**: Track coupon usage patterns
5. **Partner Integration**: Integrate with third-party parking systems
6. **Mobile App**: Native QR code scanning in mobile app
7. **Email Delivery**: Send coupon via email automatically
8. **SMS Delivery**: Send coupon code via SMS
