# Implementation Plan

- [x] 1. Set up database model and schema



  - Create ParkingCoupon model in backend/models/ParkingCoupon.js
  - Define schema with all required fields: bookingId, userId, code, discountPercent, isUsed, createdAt, expiresAt
  - Add unique indexes on bookingId and code fields
  - Add compound indexes for efficient queries
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ]* 1.1 Write property test for database schema
  - **Property 5: Complete coupon record creation**
  - **Validates: Requirements 3.5, 10.2, 10.4, 10.5**

- [ ]* 1.2 Write property test for database uniqueness
  - **Property 18: Database uniqueness enforcement**
  - **Validates: Requirements 7.2, 10.3**

- [ ]* 1.3 Write property test for booking-coupon uniqueness
  - **Property 21: Booking-coupon uniqueness**


  - **Validates: Requirements 9.1, 9.3**

- [ ] 2. Implement coupon code generation logic
  - Create utility function generateCouponCode() in backend/utils/couponGenerator.js
  - Implement random 4-character alphanumeric generation
  - Format date as DDMM and combine into PARK-XXXX-DDMM format
  - Add uniqueness verification against database
  - Implement retry logic for collision handling
  - _Requirements: 3.4, 7.1, 7.3, 7.4_

- [ ]* 2.1 Write property test for code format validation
  - **Property 4: Coupon code format validation**
  - **Validates: Requirements 3.4, 4.2**

- [ ]* 2.2 Write property test for code uniqueness
  - **Property 17: Code uniqueness**
  - **Validates: Requirements 7.1**

- [ ]* 2.3 Write property test for pre-generation uniqueness check
  - **Property 19: Pre-generation uniqueness check**
  - **Validates: Requirements 7.3**


- [ ]* 2.4 Write property test for collision retry mechanism
  - **Property 20: Collision retry mechanism**
  - **Validates: Requirements 7.4**

- [ ] 3. Implement expiration calculation logic
  - Create utility function calculateExpiration() in backend/utils/couponGenerator.js
  - Calculate expiration as 11:59:59 PM on the movie day
  - Handle timezone considerations
  - _Requirements: 3.5, 10.5_



- [ ]* 3.1 Write unit test for expiration calculation
  - Test that expiration is set to end of day (23:59:59)
  - Test with various booking dates and times
  - _Requirements: 3.5, 10.5_

- [ ] 4. Create POST /api/parking/claim-coupon endpoint
  - Create route handler in backend/routes/parking.js
  - Validate request parameters (bookingId, userId)
  - Check for existing coupon by bookingId
  - If exists, return existing coupon
  - If not, generate new code and save to database
  - Return coupon data with code, discountPercent, expiresAt
  - Implement error handling for all scenarios
  - _Requirements: 3.1, 3.2, 3.3, 3.6, 9.2_

- [ ]* 4.1 Write property test for API parameter inclusion
  - **Property 2: API call includes required parameters**
  - **Validates: Requirements 3.1**

- [x]* 4.2 Write property test for idempotent coupon claiming

  - **Property 3: Idempotent coupon claiming**
  - **Validates: Requirements 3.3, 9.2**

- [ ]* 4.3 Write property test for API response completeness
  - **Property 6: API response completeness**
  - **Validates: Requirements 3.6**

- [ ] 5. Create GET /api/parking/verify-coupon endpoint
  - Create route handler in backend/routes/parking.js
  - Validate coupon code format
  - Query database for coupon by code
  - Check if coupon exists, is not expired, and is not used
  - If valid and unused, mark as used in database
  - Return validation result with appropriate data
  - Implement error handling for invalid/expired/used coupons
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 5.1 Write property test for verification database lookup
  - **Property 12: Verification database lookup**
  - **Validates: Requirements 6.1**

- [ ]* 5.2 Write property test for valid coupon response
  - **Property 13: Valid coupon response completeness**
  - **Validates: Requirements 6.2**

- [ ]* 5.3 Write property test for invalid coupon rejection
  - **Property 14: Invalid coupon rejection**
  - **Validates: Requirements 6.3**


- [ ]* 5.4 Write property test for coupon usage state mutation
  - **Property 15: Coupon usage state mutation**
  - **Validates: Requirements 6.4**



- [ ]* 5.5 Write property test for expiration validation
  - **Property 16: Expiration validation**
  - **Validates: Requirements 6.5**

- [ ] 6. Checkpoint - Ensure backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Create ParkingDiscountOffer component
  - Create frontend/src/components/ParkingDiscountOffer.jsx
  - Implement component with heading, subtext, and two buttons
  - Add state management for loading and error states
  - Implement "Yes, Get My Discount" button handler to call API
  - Implement "No Thanks" button handler to dismiss card
  - Match existing RTX Cinema UI/UX patterns and color scheme
  - Use Inter font family and existing component patterns
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 2.1, 3.1, 8.1, 8.2, 8.3_



- [ ]* 7.1 Write unit test for component rendering
  - Test that heading "🚗 Did you drive here?" is displayed
  - Test that subtext "Get up to 50% off at our parking facility" is displayed
  - Test that both buttons are rendered with correct labels
  - _Requirements: 1.3, 1.4, 1.5_

- [x]* 7.2 Write property test for dismiss functionality


  - **Property 1: Dismiss preserves page state**
  - **Validates: Requirements 2.2, 2.3**



- [ ] 8. Create ParkingDiscountOffer.css
  - Create frontend/src/components/ParkingDiscountOffer.css
  - Style card with rgba backgrounds and backdrop blur
  - Use #D84040 for primary buttons, #4CAF50 for accents
  - Implement responsive design for mobile devices
  - Add hover and active states for buttons
  - Match existing ticket page card styling
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 9. Install QR code generation library
  - Install qrcode.react package for client-side QR code generation
  - Verify library is lightweight and suitable for production
  - _Requirements: 4.3, 8.5_

- [ ] 10. Create ParkingCoupon component
  - Create frontend/src/components/ParkingCoupon.jsx
  - Display coupon code prominently in PARK-XXXX-DDMM format
  - Generate and display QR code encoding the coupon code
  - Display validity text "Valid today only — show this at the parking counter"
  - Implement "Copy Code" button with clipboard functionality
  - Add visual feedback for successful copy (state change)
  - Display download/screenshot hint text
  - Match ticket-like design from existing TicketPage
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2_



- [ ]* 10.1 Write property test for QR code encoding
  - **Property 8: QR code encoding correctness**
  - **Validates: Requirements 4.3**

- [ ]* 10.2 Write property test for clipboard copy
  - **Property 9: Clipboard copy functionality**
  - **Validates: Requirements 5.1**



- [ ]* 10.3 Write property test for copy feedback
  - **Property 10: Copy feedback display**
  - **Validates: Requirements 5.2**

- [ ]* 10.4 Write property test for copy error handling
  - **Property 11: Copy error handling**
  - **Validates: Requirements 5.3**

- [ ] 11. Create ParkingCoupon.css
  - Create frontend/src/components/ParkingCoupon.css
  - Style as professional coupon/ticket card
  - Use gradient backgrounds and shadows matching TicketPage
  - Style QR code section with proper spacing
  - Style "Copy Code" button with hover effects
  - Implement responsive design for mobile
  - Add animations for success states
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 12. Integrate parking discount feature into TicketPage
  - Modify frontend/src/pages/TicketPage.jsx

  - Add state to track parking coupon status (none, offered, claimed)
  - Add state to store claimed coupon data
  - Conditionally render ParkingDiscountOffer or ParkingCoupon below ticket details
  - Position above action buttons (Download, Email, Share)
  - Pass bookingData.bookingId and userId as props
  - Handle coupon claim callback to update state
  - Handle dismiss callback to hide offer
  - Maintain existing layout and spacing
  - _Requirements: 1.1, 1.2, 4.1, 8.3_

- [ ]* 12.1 Write property test for UI state transition
  - **Property 7: UI state transition on claim**
  - **Validates: Requirements 4.1**

- [ ]* 12.2 Write integration test for end-to-end flow
  - Test complete flow from offer display to coupon claim
  - Verify API calls are made correctly
  - Verify UI updates appropriately
  - _Requirements: 1.1, 1.2, 3.1, 4.1_


- [ ] 13. Implement error handling in frontend
  - Add error state management in ParkingDiscountOffer

  - Display user-friendly error messages for network failures
  - Implement retry functionality for failed API calls
  - Add fallback for clipboard API unavailability
  - Handle QR code generation failures gracefully
  - Log errors to console for debugging
  - _Requirements: 5.3_




- [ ]* 13.1 Write unit tests for error scenarios
  - Test network failure handling
  - Test invalid response handling
  - Test clipboard API unavailability
  - Test QR code generation failure

  - _Requirements: 5.3_

- [ ] 14. Add API routes to backend server
  - Register parking routes in backend/server.js or backend/app.js
  - Mount routes at /api/parking
  - Ensure proper middleware (authentication, validation) is applied
  - _Requirements: 3.1, 6.1_



- [ ] 15. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Test responsive design on mobile devices
  - Test parking discount offer card on various screen sizes
  - Test parking coupon card on mobile devices
  - Verify QR code is scannable on real devices
  - Test clipboard functionality across different browsers
  - Ensure buttons are easily tappable on mobile
  - _Requirements: 8.4_

- [ ] 17. Verify UI consistency with existing design
  - Compare color scheme with existing pages
  - Verify font usage matches Inter font family
  - Check component patterns match existing cards
  - Ensure spacing and padding are consistent
  - Verify animations and transitions match existing patterns
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 18. Final integration testing
  - Test complete user flow from booking to coupon claim
  - Test coupon verification by parking staff
  - Verify database persistence and retrieval
  - Test error scenarios and edge cases
  - Verify performance under normal load
  - _Requirements: All_

- [ ] 19. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
