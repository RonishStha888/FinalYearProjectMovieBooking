# Implementation Plan

- [ ] 1. Set up backend infrastructure and MongoDB connection
  - Create Express server with basic configuration
  - Set up MongoDB connection using Mongoose
  - Create User model with schema validation
  - Configure environment variables for database connection
  - _Requirements: 7.1, 7.2, 7.5_

- [ ]* 1.1 Write property test for password hashing
  - **Property 15: Email signup stores hashed password**
  - **Validates: Requirements 7.1, 7.5**

- [ ] 2. Implement backend authentication API endpoints
  - Create POST /api/auth/signup endpoint for email/password registration
  - Create POST /api/auth/login endpoint for email/password authentication
  - Implement password hashing with bcrypt
  - Add input validation middleware
  - Implement error handling middleware
  - _Requirements: 7.1, 7.4, 7.5_

- [ ]* 2.1 Write property test for duplicate email rejection
  - **Property 17: Duplicate email rejection**
  - **Validates: Requirements 7.3**

- [ ]* 2.2 Write property test for credential verification
  - **Property 18: Login credential verification**
  - **Validates: Requirements 7.4**

- [ ] 3. Implement email verification backend system
  - Create EmailVerification model with proper schema and expiration
  - Implement verification code generation (6-digit numeric)
  - Create POST /api/auth/verify-email endpoint for code verification
  - Create POST /api/auth/resend-verification endpoint for resending codes
  - Update signup endpoint to send verification email instead of creating user immediately
  - _Requirements: 8.1, 8.2, 8.4, 8.7_

- [ ]* 3.1 Write property test for verification code generation
  - **Property 19: Verification code generation and storage**
  - **Validates: Requirements 8.1, 8.2**

- [ ]* 3.2 Write property test for correct verification
  - **Property 21: Correct verification code creates account**
  - **Validates: Requirements 8.4**

- [ ]* 3.3 Write property test for verification resend
  - **Property 24: Verification code resend functionality**
  - **Validates: Requirements 8.7**

- [ ] 4. Implement email service for verification
  - Set up SendGrid or SMTP email service configuration
  - Create email template for verification code
  - Implement sendVerificationEmail function
  - Add proper error handling for email sending failures
  - _Requirements: 8.1, 8.3_

- [ ]* 4.1 Write property test for verification email content
  - **Property 20: Verification email content**
  - **Validates: Requirements 8.3**

- [ ] 5. Implement Google OAuth backend integration
  - Create POST /api/auth/google endpoint for OAuth callback
  - Integrate Google OAuth library for token verification
  - Implement user creation/update logic for OAuth users
  - _Requirements: 7.2_

- [ ]* 5.1 Write property test for Google signup data storage
  - **Property 16: Google signup stores OAuth data**
  - **Validates: Requirements 7.2**

- [ ] 6. Create reusable validation utilities
  - Implement validateEmail function with regex pattern
  - Implement validatePassword function with length and complexity checks
  - Implement validatePasswordMatch function
  - Implement validateVerificationCode function (6-digit numeric)
  - Export validation utilities for frontend use
  - _Requirements: 1.3, 1.4, 1.5, 2.3, 8.5_

- [ ]* 6.1 Write property test for email validation
  - **Property 2: Email validation rejects invalid formats**
  - **Validates: Requirements 1.3, 2.3**

- [ ]* 6.2 Write property test for password length validation
  - **Property 3: Password length validation**
  - **Validates: Requirements 1.4**

- [ ]* 6.3 Write property test for password mismatch detection
  - **Property 4: Password mismatch detection**
  - **Validates: Requirements 1.5**

- [ ] 7. Create reusable Input component with validation
  - Build InputField component with props for type, value, onChange, error
  - Add password visibility toggle functionality
  - Implement focus state visual feedback
  - Add error message display below input
  - Add support for verification code input (numeric, 6-digit max)
  - _Requirements: 4.1, 4.2, 5.1, 5.2, 5.3, 5.4_

- [ ]* 7.1 Write property test for input focus feedback
  - **Property 8: Input focus provides visual feedback**
  - **Validates: Requirements 4.1**

- [ ]* 7.2 Write property test for password visibility toggle
  - **Property 11: Password visibility toggle**
  - **Validates: Requirements 5.2, 5.3, 5.4**

- [ ] 8. Implement EmailVerificationPage component
  - Create EmailVerificationPage with verification code input field
  - Add email display and instructions for user
  - Implement code submission handler that calls verification API
  - Add error handling for incorrect and expired codes
  - Add resend verification functionality with loading state
  - Add navigation back to signup page
  - _Requirements: 8.4, 8.5, 8.6, 8.7_

- [ ]* 8.1 Write property test for incorrect verification codes
  - **Property 22: Incorrect verification code shows error**
  - **Validates: Requirements 8.5**

- [ ]* 8.2 Write property test for expired code handling
  - **Property 23: Expired verification code handling**
  - **Validates: Requirements 8.6**

- [ ] 9. Implement SignupPage component
  - Create SignupPage with email, password, and confirm password fields
  - Integrate validation functions with form state
  - Update form submission to handle verification flow (redirect to verification page)
  - Add error state management and display
  - Add loading state during submission
  - Add navigation link to login page
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.2, 4.2, 4.3, 4.4, 4.5_

- [ ]* 9.1 Write unit test for SignupPage rendering
  - Verify all required fields are present
  - **Validates: Requirements 1.1**

- [ ]* 9.2 Write property test for valid signup submission
  - **Property 1: Valid signup submission provides success feedback**
  - **Validates: Requirements 1.2**

- [ ]* 9.3 Write property test for error state transitions
  - **Property 9: Error state transitions**
  - **Validates: Requirements 4.2, 4.3**

- [ ]* 9.4 Write property test for form submission state
  - **Property 10: Form submission state management**
  - **Validates: Requirements 4.4, 4.5**

- [ ] 10. Implement LoginPage component
  - Create LoginPage with email and password fields
  - Integrate validation functions with form state
  - Implement form submission handler that calls backend API
  - Add error state management and display
  - Add loading state during submission
  - Add navigation link to signup page
  - Handle empty field validation
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 10.1 Write unit test for LoginPage rendering
  - Verify email and password fields are present
  - **Validates: Requirements 2.1**

- [ ]* 10.2 Write unit test for empty field validation
  - Verify empty fields show error messages
  - **Validates: Requirements 2.4**

- [ ]* 10.3 Write property test for valid login submission
  - **Property 5: Valid login submission provides success feedback**
  - **Validates: Requirements 2.2**

- [ ]* 10.4 Write property test for incorrect credentials
  - **Property 6: Incorrect credentials display error**
  - **Validates: Requirements 2.5**

- [ ] 11. Implement navigation between authentication pages
  - Add state management for current page view (login, signup, verification)
  - Implement navigation handlers without page reload
  - Update App component to handle page routing including verification page
  - Pass email data between signup and verification pages
  - _Requirements: 3.1, 3.2, 3.3_

- [ ]* 11.1 Write unit tests for navigation links
  - Verify links are present on both pages
  - **Validates: Requirements 3.1, 3.2**

- [ ]* 11.2 Write property test for navigation transitions
  - **Property 7: Navigation transitions without reload**
  - **Validates: Requirements 3.3**

- [ ] 12. Implement GoogleAuthButton component
  - Create GoogleAuthButton component with mode prop
  - Integrate Google OAuth library
  - Implement OAuth flow initiation on button click
  - Handle OAuth success callback
  - Handle OAuth error/cancellation
  - Call backend API with OAuth token
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 12.1 Write unit tests for Google button rendering
  - Verify button is present on both pages
  - **Validates: Requirements 6.1, 6.2**

- [ ]* 12.2 Write property test for OAuth flow initiation
  - **Property 12: Google OAuth initiates flow**
  - **Validates: Requirements 6.3**

- [ ]* 12.3 Write property test for OAuth success
  - **Property 13: OAuth success provides feedback**
  - **Validates: Requirements 6.4**

- [ ]* 12.4 Write property test for OAuth failure
  - **Property 14: OAuth failure displays error**
  - **Validates: Requirements 6.5**

- [ ] 13. Integrate GoogleAuthButton into login and signup pages
  - Add GoogleAuthButton to SignupPage
  - Add GoogleAuthButton to LoginPage
  - Wire up success and error handlers
  - Add visual separator between email/password and OAuth options
  - _Requirements: 6.1, 6.2_

- [ ] 14. Add styling and polish to authentication pages
  - Style forms with consistent spacing and colors
  - Add responsive design for mobile devices
  - Implement smooth transitions and animations
  - Ensure accessibility (ARIA labels, keyboard navigation)
  - Add loading spinners and visual feedback
  - Style verification page with clear instructions and code input

- [ ] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
