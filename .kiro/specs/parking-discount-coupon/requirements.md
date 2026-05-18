# Requirements Document

## Introduction

This document specifies the requirements for a parking discount coupon feature integrated into the RTX Cinema movie booking system. The feature allows users who have successfully booked movie tickets to claim a parking discount coupon that can be redeemed at the cinema's parking facility. The system generates unique, time-limited coupons on demand and provides verification capabilities for parking staff.

## Glossary

- **Booking System**: The RTX Cinema movie ticket booking application
- **Booking Confirmation Page**: The page displayed after successful ticket purchase showing booking details
- **Parking Coupon**: A unique discount code that can be redeemed at the parking facility
- **Coupon Code**: A unique identifier in format PARK-XXXX-DDMM where XXXX is 4 random alphanumeric characters and DDMM is day-month
- **QR Code**: A machine-readable code encoding the coupon code for easy scanning
- **Backend API**: The server-side application handling coupon generation and verification
- **Database**: The persistent storage system for coupon records
- **Parking Staff**: Personnel at the parking facility who verify and redeem coupons

## Requirements

### Requirement 1

**User Story:** As a movie ticket buyer, I want to see a parking discount offer after booking my ticket, so that I can save money on parking if I drove to the cinema.

#### Acceptance Criteria

1. WHEN a user completes a ticket booking THEN the Booking System SHALL display the Booking Confirmation Page with ticket details
2. WHEN the Booking Confirmation Page loads THEN the Booking System SHALL display a parking discount offer card below the ticket confirmation
3. THE parking discount offer card SHALL display the heading "Did you drive here?"
4. THE parking discount offer card SHALL display the subtext "Get up to 50% off at our parking facility"
5. THE parking discount offer card SHALL display two action buttons labeled "Yes, Get My Discount" and "No Thanks"

### Requirement 2

**User Story:** As a movie ticket buyer, I want to dismiss the parking offer if I don't need it, so that I can focus on my booking confirmation without distraction.

#### Acceptance Criteria

1. WHEN a user clicks the "No Thanks" button THEN the Booking System SHALL remove the parking discount offer card from view
2. WHEN the parking discount offer card is dismissed THEN the Booking System SHALL NOT reload the page
3. WHEN the parking discount offer card is dismissed THEN the Booking System SHALL maintain all other page content unchanged

### Requirement 3

**User Story:** As a movie ticket buyer, I want to claim a parking discount coupon, so that I can receive a discount at the parking facility.

#### Acceptance Criteria

1. WHEN a user clicks the "Yes, Get My Discount" button THEN the Booking System SHALL send a request to the Backend API with the booking ID and user ID
2. WHEN the Backend API receives a coupon claim request THEN the Backend API SHALL check if a coupon already exists for the booking ID
3. IF a coupon already exists for the booking ID THEN the Backend API SHALL return the existing coupon
4. IF no coupon exists for the booking ID THEN the Backend API SHALL generate a unique Coupon Code in format PARK-XXXX-DDMM
5. WHEN generating a new coupon THEN the Backend API SHALL save the coupon record to the Database with booking ID, user ID, code, discount percent of 50, isUsed status of false, creation timestamp, and expiration timestamp set to end of the movie day
6. WHEN a coupon is successfully claimed or retrieved THEN the Backend API SHALL return the coupon code, discount percent, and expiration timestamp

### Requirement 4

**User Story:** As a movie ticket buyer, I want to view my parking coupon with a code and QR code, so that I can easily present it at the parking counter.

#### Acceptance Criteria

1. WHEN a coupon is successfully claimed THEN the Booking System SHALL display a coupon card replacing the parking discount offer card
2. THE coupon card SHALL display the Coupon Code in format PARK-XXXX-DDMM
3. THE coupon card SHALL display a QR Code encoding the Coupon Code
4. THE coupon card SHALL display validity text "Valid today only — show this at the parking counter"
5. THE coupon card SHALL display a "Copy Code" button
6. THE coupon card SHALL display a hint text for downloading or taking a screenshot

### Requirement 5

**User Story:** As a movie ticket buyer, I want to copy my coupon code to clipboard, so that I can easily share or save it.

#### Acceptance Criteria

1. WHEN a user clicks the "Copy Code" button THEN the Booking System SHALL copy the Coupon Code to the system clipboard
2. WHEN the Coupon Code is copied THEN the Booking System SHALL provide visual feedback confirming the copy action
3. WHEN the copy action fails THEN the Booking System SHALL display an error message to the user

### Requirement 6

**User Story:** As parking staff, I want to verify parking coupons, so that I can validate their authenticity and apply the correct discount.

#### Acceptance Criteria

1. WHEN parking staff submits a Coupon Code to the verification endpoint THEN the Backend API SHALL check if the code exists in the Database
2. WHEN a valid Coupon Code is verified THEN the Backend API SHALL return validation status true, discount percent, booking ID, and usage status
3. WHEN an invalid Coupon Code is verified THEN the Backend API SHALL return validation status false
4. WHEN a valid and unused coupon is verified THEN the Backend API SHALL mark the coupon as used in the Database
5. WHEN a coupon expiration timestamp is past the current time THEN the Backend API SHALL return validation status false

### Requirement 7

**User Story:** As a system administrator, I want coupon codes to be unique and secure, so that fraudulent coupons cannot be created.

#### Acceptance Criteria

1. THE Backend API SHALL generate Coupon Codes with 4 random alphanumeric characters ensuring uniqueness
2. THE Database SHALL enforce uniqueness constraint on the Coupon Code field
3. WHEN generating a Coupon Code THEN the Backend API SHALL verify the code does not already exist in the Database
4. IF a generated code already exists THEN the Backend API SHALL generate a new code until a unique one is found

### Requirement 8

**User Story:** As a developer, I want the parking discount feature to match the existing UI/UX patterns, so that it feels like a natural part of the booking system.

#### Acceptance Criteria

1. THE parking discount offer card and coupon card SHALL use the same color scheme as the existing Booking System
2. THE parking discount offer card and coupon card SHALL use the same typography and fonts as the existing Booking System
3. THE parking discount offer card and coupon card SHALL use the same component patterns as the existing Booking System
4. WHEN displayed on mobile devices THEN the parking discount feature SHALL be fully responsive and usable
5. THE parking discount feature SHALL NOT introduce new libraries or frameworks unless necessary for QR Code generation

### Requirement 9

**User Story:** As a system administrator, I want to prevent duplicate coupons per booking, so that users cannot claim multiple discounts for the same ticket purchase.

#### Acceptance Criteria

1. THE Database SHALL store a unique association between booking ID and Coupon Code
2. WHEN a user attempts to claim a coupon for a booking ID that already has a coupon THEN the Backend API SHALL return the existing coupon instead of creating a new one
3. THE Backend API SHALL NOT create multiple coupon records for the same booking ID

### Requirement 10

**User Story:** As a system administrator, I want coupon data to be properly stored and managed, so that the system can track usage and prevent fraud.

#### Acceptance Criteria

1. THE Database SHALL contain a parking_coupons table with fields: id, bookingId, userId, code, discountPercent, isUsed, createdAt, expiresAt
2. THE parking_coupons table SHALL set isUsed to false by default for new coupons
3. THE parking_coupons table SHALL enforce a unique constraint on the code field
4. WHEN a coupon is created THEN the Database SHALL store the creation timestamp
5. WHEN a coupon is created THEN the Database SHALL store the expiration timestamp set to end of the movie day
