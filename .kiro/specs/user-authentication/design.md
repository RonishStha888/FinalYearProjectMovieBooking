# User Authentication Design Document

## Overview

The user authentication system provides a modern, full-stack solution for signup and login functionality with support for both traditional email/password authentication and Google OAuth. The frontend provides a user-friendly interface with form validation and clear error messaging through React components. The backend API, built with Node.js and Express, handles authentication logic, password hashing, and MongoDB database operations. The system validates user input, securely stores credentials, handles OAuth flows, and provides appropriate feedback for all authentication methods.

## Architecture

The authentication system follows a full-stack architecture with clear separation between frontend and backend:

### Frontend (React)
- **Page Components**: LoginPage and SignupPage serve as container components
- **Form Components**: Reusable form elements with built-in validation
- **OAuth Components**: GoogleAuthButton component for OAuth integration
- **Validation Logic**: Pure functions that validate email, password, and form data
- **API Client**: Functions to communicate with backend authentication endpoints
- **State Management**: React hooks (useState) for local component state
- **Routing**: Simple state-based navigation between login and signup views

### Backend (Node.js + Express)
- **API Routes**: RESTful endpoints for signup, login, OAuth callback, and email verification
- **Controllers**: Business logic for authentication and email verification operations
- **Models**: Mongoose schemas for User and EmailVerification data
- **Middleware**: Authentication, validation, and error handling middleware
- **Database Layer**: MongoDB connection and query operations
- **Email Service**: SendGrid integration for sending verification emails
- **Security**: Password hashing with bcrypt, input sanitization, verification code generation

### Data Flow
1. **Signup Flow (Email/Password with Verification)**:
   - Frontend validates input → POST to `/api/auth/signup`
   - Backend validates → generates verification code → stores temporarily in EmailVerification collection
   - Sends verification email → Returns verification required response
   - User enters code → POST to `/api/auth/verify-email`
   - Backend validates code → creates user account → Returns success/error

2. **Email Verification Flow**:
   - Generate 6-digit numeric code → Store with 15-minute expiration
   - Send formatted email with code → User receives and enters code
   - Validate code and expiration → Create user account or show error
   - Handle resend requests → Generate new code and invalidate old one

3. **Login Flow (Email/Password)**:
   - Frontend validates input → POST to `/api/auth/login`
   - Backend queries MongoDB → verifies password hash
   - Returns JWT token/session → Frontend stores auth state

4. **OAuth Flow (Google)**:
   - User clicks "Sign in with Google" button
   - Frontend initiates OAuth → redirects to Google
   - User authorizes → Google redirects to backend callback
   - Backend receives user info → stores/updates in MongoDB
   - Returns JWT token → Frontend receives auth state

The architecture separates concerns:
- UI rendering (React components)
- Client-side validation (pure functions)
- API communication (fetch/axios)
- Server-side validation and business logic (Express controllers)
- Data persistence (MongoDB with Mongoose)
- Security (bcrypt, JWT, input sanitization)

## Components and Interfaces

### LoginPage Component
```typescript
interface LoginPageProps {
  onLoginSuccess?: (email: string, method: 'email' | 'google') => void;
  onNavigateToSignup?: () => void;
}

interface LoginFormState {
  email: string;
  password: string;
  errors: {
    email?: string;
    password?: string;
    general?: string;
  };
  isSubmitting: boolean;
}
```

### SignupPage Component
```typescript
interface SignupPageProps {
  onSignupSuccess?: (email: string, method: 'email' | 'google') => void;
  onNavigateToLogin?: () => void;
}

interface SignupFormState {
  email: string;
  password: string;
  confirmPassword: string;
  errors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  };
  isSubmitting: boolean;
}
```

### GoogleAuthButton Component
```typescript
interface GoogleAuthButtonProps {
  mode: 'signup' | 'login';
  onSuccess: (userInfo: GoogleUserInfo) => void;
  onError: (error: string) => void;
}

interface GoogleUserInfo {
  email: string;
  name: string;
  picture?: string;
  sub: string; // Google user ID
}
```

### EmailVerificationPage Component
```typescript
interface EmailVerificationPageProps {
  email: string;
  onVerificationSuccess?: (email: string) => void;
  onBackToSignup?: () => void;
}

interface VerificationFormState {
  code: string;
  errors: {
    code?: string;
    general?: string;
  };
  isSubmitting: boolean;
  isResending: boolean;
}
```

### Backend API Endpoints

#### POST /api/auth/signup
```typescript
Request Body: {
  email: string;
  password: string;
}
Response: {
  success: boolean;
  message: string;
  requiresVerification: boolean;
  email?: string;
}
```

#### POST /api/auth/verify-email
```typescript
Request Body: {
  email: string;
  code: string;
}
Response: AuthResponse
```

#### POST /api/auth/resend-verification
```typescript
Request Body: {
  email: string;
}
Response: {
  success: boolean;
  message: string;
}
```

#### POST /api/auth/login
```typescript
Request Body: {
  email: string;
  password: string;
}
Response: AuthResponse
```

#### POST /api/auth/google
```typescript
Request Body: {
  token: string; // Google OAuth token
}
Response: AuthResponse
```

### Backend Controllers
```typescript
interface AuthController {
  signup(req: Request, res: Response): Promise<void>;
  verifyEmail(req: Request, res: Response): Promise<void>;
  resendVerification(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  googleAuth(req: Request, res: Response): Promise<void>;
}
```

### Email Service
```typescript
interface EmailService {
  sendVerificationEmail(email: string, code: string): Promise<EmailResult>;
  generateVerificationCode(): string;
}

interface EmailResult {
  success: boolean;
  error?: string;
}
```

### Database Repository
```typescript
interface UserRepository {
  createUser(userData: Partial<IUser>): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
  updateUser(id: string, updates: Partial<IUser>): Promise<IUser>;
}

interface EmailVerificationRepository {
  createVerification(data: Partial<IEmailVerification>): Promise<IEmailVerification>;
  findByEmail(email: string): Promise<IEmailVerification | null>;
  findByEmailAndCode(email: string, code: string): Promise<IEmailVerification | null>;
  deleteByEmail(email: string): Promise<void>;
}
```

### Validation Functions
```typescript
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

function validateEmail(email: string): ValidationResult;
function validatePassword(password: string): ValidationResult;
function validatePasswordMatch(password: string, confirmPassword: string): ValidationResult;
```

### Input Component (Reusable)
```typescript
interface InputFieldProps {
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
}
```

## Data Models

### Frontend Form Data
```typescript
interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface VerificationFormData {
  email: string;
  code: string;
}
```

### Backend User Model (MongoDB/Mongoose)
```typescript
interface IUser {
  _id: ObjectId;
  email: string;
  password?: string; // Optional for Google OAuth users
  name?: string;
  googleId?: string; // For Google OAuth users
  authMethod: 'email' | 'google';
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() { return this.authMethod === 'email'; }
  },
  name: String,
  googleId: String,
  authMethod: {
    type: String,
    enum: ['email', 'google'],
    required: true
  }
}, { timestamps: true });
```

### EmailVerification Model (MongoDB/Mongoose)
```typescript
interface IEmailVerification {
  _id: ObjectId;
  email: string;
  code: string;
  userData: {
    email: string;
    password: string;
    name?: string;
  };
  verificationType: 'signup' | 'google-signup';
  createdAt: Date;
  expiresAt: Date;
}

// Mongoose Schema
const EmailVerificationSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    length: 6
  },
  userData: {
    type: Object,
    required: true
  },
  verificationType: {
    type: String,
    enum: ['signup', 'google-signup'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    expires: 0
  }
});
```

### API Request/Response Types
```typescript
// Signup Request
interface SignupRequest {
  email: string;
  password: string;
}

// Email Verification Request
interface VerifyEmailRequest {
  email: string;
  code: string;
}

// Resend Verification Request
interface ResendVerificationRequest {
  email: string;
}

// Login Request
interface LoginRequest {
  email: string;
  password: string;
}

// Auth Response
interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  token?: string; // JWT token for session management
  requiresVerification?: boolean; // For signup responses
}

// Verification Response
interface VerificationResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  token?: string;
}

// Error Response
interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}
```

### Validation Rules
- **Email**: Must match standard email regex pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Password**: Minimum 8 characters, must contain at least one letter and one number
- **Confirm Password**: Must exactly match the password field
- **Verification Code**: Must be exactly 6 digits, numeric only
- **Code Expiration**: 15 minutes from generation time
- **Password Hashing**: Use bcrypt with salt rounds of 10


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, several properties can be consolidated:
- Properties 1.3 and 2.3 both test email validation and can be combined into a single comprehensive property
- Properties 4.2 and 4.3 test error display and clearing, which can be combined into a state transition property
- Properties 5.3 and 5.4 test icon display based on visibility state, which can be combined into a single property

### Properties

**Property 1: Valid signup submission provides success feedback**
*For any* valid email and password (8+ characters), submitting the signup form should display success feedback and not display any error messages.
**Validates: Requirements 1.2**

**Property 2: Email validation rejects invalid formats**
*For any* string that does not match the email regex pattern, the validation function should return an error indicating the email is invalid.
**Validates: Requirements 1.3, 2.3**

**Property 3: Password length validation**
*For any* password string with length less than 8 characters, the validation function should return an error indicating the password is too short.
**Validates: Requirements 1.4**

**Property 4: Password mismatch detection**
*For any* two password strings where password ≠ confirmPassword, the validation function should return an error indicating passwords do not match.
**Validates: Requirements 1.5**

**Property 5: Valid login submission provides success feedback**
*For any* valid email and password combination, submitting the login form should display success feedback and not display any error messages.
**Validates: Requirements 2.2**

**Property 6: Incorrect credentials display error**
*For any* login attempt with credentials that don't match a user in the database, the system should display an authentication failed error message.
**Validates: Requirements 2.5**

**Property 7: Navigation transitions without reload**
*For any* navigation action between login and signup pages, the page should transition and the URL or view state should change without triggering a full page reload.
**Validates: Requirements 3.3**

**Property 8: Input focus provides visual feedback**
*For any* input field in the authentication forms, focusing the field should apply active styling or visual indicators.
**Validates: Requirements 4.1**

**Property 9: Error state transitions**
*For any* form field, if invalid data causes an error to display, then entering valid data should clear that error message.
**Validates: Requirements 4.2, 4.3**

**Property 10: Form submission state management**
*For any* form submission, the submit button should be disabled during submission and re-enabled after completion.
**Validates: Requirements 4.4, 4.5**

**Property 11: Password visibility toggle**
*For any* password field, clicking the visibility toggle should switch the input type between "password" and "text", and the icon should reflect the current state.
**Validates: Requirements 5.2, 5.3, 5.4**

**Property 12: Google OAuth initiates flow**
*For any* click on the Google authentication button, the system should initiate the OAuth flow by redirecting to Google or calling the OAuth library.
**Validates: Requirements 6.3**

**Property 13: OAuth success provides feedback**
*For any* successful Google OAuth completion, the system should authenticate the user and display success feedback.
**Validates: Requirements 6.4**

**Property 14: OAuth failure displays error**
*For any* failed or cancelled Google OAuth flow, the system should display an appropriate error message and return to the authentication page.
**Validates: Requirements 6.5**

**Property 15: Email signup stores hashed password**
*For any* valid email and password signup, the backend should store the user's email and a hashed version of the password in MongoDB, where the hashed password does not equal the plain text password.
**Validates: Requirements 7.1, 7.5**

**Property 16: Google signup stores OAuth data**
*For any* successful Google OAuth signup, the backend should store the user's email, name, and Google ID in MongoDB.
**Validates: Requirements 7.2**

**Property 17: Duplicate email rejection**
*For any* email that already exists in the database, attempting to sign up with that email should return an error indicating the account already exists.
**Validates: Requirements 7.3**

**Property 18: Login credential verification**
*For any* user in the database, submitting their correct email and password should successfully authenticate, while submitting incorrect credentials should fail.
**Validates: Requirements 7.4**

**Property 19: Verification code generation and storage**
*For any* valid signup submission, the system should generate a 6-digit numeric verification code and store it with the signup data and a 15-minute expiration time.
**Validates: Requirements 8.1, 8.2**

**Property 20: Verification email content**
*For any* verification email sent, the email content should contain the verification code and clear instructions for completing verification.
**Validates: Requirements 8.3**

**Property 21: Correct verification code creates account**
*For any* valid verification code entered within the time limit, the system should create the user account and provide success feedback.
**Validates: Requirements 8.4**

**Property 22: Incorrect verification code shows error**
*For any* incorrect verification code entered, the system should display an error message and allow retry without resending the email.
**Validates: Requirements 8.5**

**Property 23: Expired verification code handling**
*For any* verification code that has exceeded the 15-minute expiration time, the system should display an expiration message and provide an option to resend.
**Validates: Requirements 8.6**

**Property 24: Verification code resend functionality**
*For any* resend verification request, the system should generate a new 6-digit code, invalidate the old code, and send a new email.
**Validates: Requirements 8.7**

## Error Handling

The authentication system handles errors at multiple levels:

### Frontend Validation Errors
- **Email Format**: Display "Please enter a valid email address" below the email field
- **Password Length**: Display "Password must be at least 8 characters" below the password field
- **Password Mismatch**: Display "Passwords do not match" below the confirm password field
- **Empty Fields**: Display "This field is required" below any empty required field
- **Invalid Verification Code**: Display "Please enter a valid 6-digit code" below the code field
- **Verification Code Format**: Display "Verification code must be 6 digits" below the code field

### Backend API Errors
- **Duplicate Email** (409 Conflict): Return `{ success: false, message: "An account with this email already exists" }`
- **Invalid Credentials** (401 Unauthorized): Return `{ success: false, message: "Invalid email or password" }`
- **Invalid Verification Code** (400 Bad Request): Return `{ success: false, message: "Invalid verification code" }`
- **Expired Verification Code** (400 Bad Request): Return `{ success: false, message: "Verification code has expired", canResend: true }`
- **Verification Not Found** (404 Not Found): Return `{ success: false, message: "No verification request found for this email" }`
- **Email Send Error** (500 Internal Server Error): Return `{ success: false, message: "Failed to send verification email. Please try again." }`
- **Validation Error** (400 Bad Request): Return `{ success: false, message: "Validation failed", errors: {...} }`
- **Database Error** (500 Internal Server Error): Return `{ success: false, message: "An error occurred. Please try again." }`
- **OAuth Error** (401 Unauthorized): Return `{ success: false, message: "Google authentication failed" }`

### Network Errors
- **Connection Failed**: Display "Unable to connect. Please try again." as a general error message
- **Timeout**: Display "Request timed out. Please try again." as a general error message

### Error Display Strategy (Frontend)
- Errors appear inline below the relevant field
- General errors appear at the top of the form
- Errors are cleared when the user modifies the field
- Error messages use clear, actionable language
- Error styling uses red color and appropriate icons

### Error Logging (Backend)
- Log all errors with timestamps and request context
- Sanitize sensitive information (passwords) from logs
- Use appropriate log levels (error, warn, info)

## Testing Strategy

### Frontend Unit Testing
The frontend will use **Vitest** as the testing framework with **React Testing Library** for component testing.

Frontend unit tests will cover:
- Individual validation functions (validateEmail, validatePassword, validatePasswordMatch)
- Component rendering with different props and states
- User interaction flows (form submission, navigation, toggle actions)
- Error message display for specific edge cases
- Empty field validation (edge case from 2.4)
- API client functions with mocked responses

Example frontend unit tests:
- Signup page renders with all required fields (validates 1.1)
- Login page renders with email and password fields (validates 2.1)
- Navigation links are present on both pages (validates 3.1, 3.2)
- Password toggle icon is displayed (validates 5.1)
- Google auth buttons are displayed (validates 6.1, 6.2)
- Empty form submission shows required field errors (validates 2.4)

### Backend Unit Testing
The backend will use **Jest** or **Vitest** with **Supertest** for API endpoint testing.

Backend unit tests will cover:
- Controller functions with mocked database
- Validation middleware
- Password hashing functions
- Database query functions
- Error handling middleware
- JWT token generation and verification

Example backend unit tests:
- Password hashing produces different output than input
- Duplicate email returns 409 error
- Invalid credentials return 401 error
- Successful signup returns user data and token

### Integration Testing
Integration tests will verify the full stack working together:
- Use a test MongoDB database (MongoDB Memory Server)
- Test complete signup flow from frontend to database
- Test complete login flow with real password verification
- Test OAuth callback handling
- Verify data persistence and retrieval

### Property-Based Testing
The system will use **fast-check** for property-based testing in JavaScript.

Property-based tests will be configured to run a minimum of 100 iterations per property.

Each property-based test will:
- Be tagged with a comment referencing the design document property: `// Feature: user-authentication, Property X: [property text]`
- Generate random valid and invalid inputs appropriate to the property
- Verify the property holds across all generated inputs

Frontend property-based tests:
- **Property 1**: Generate random valid credentials and verify success feedback
- **Property 2**: Generate random invalid email strings and verify error messages
- **Property 3**: Generate random passwords of length 0-7 and verify error messages
- **Property 4**: Generate random mismatched password pairs and verify error messages
- **Property 5**: Generate random valid login credentials and verify success feedback
- **Property 6**: Generate random incorrect credentials and verify error display
- **Property 7**: Test navigation state transitions
- **Property 8**: Test focus behavior across all input fields
- **Property 9**: Test error clearing behavior with random invalid-to-valid transitions
- **Property 10**: Test submission state across random form data
- **Property 11**: Test password visibility toggle state transitions
- **Property 20**: Generate random verification emails and verify code and instructions are present
- **Property 22**: Generate random incorrect verification codes and verify error display
- **Property 23**: Test expired code handling and resend option display

Backend property-based tests:
- **Property 12**: Test OAuth flow initiation
- **Property 13**: Test OAuth success handling with random user data
- **Property 14**: Test OAuth failure handling
- **Property 15**: Generate random valid signups and verify hashed passwords in database
- **Property 16**: Generate random OAuth signups and verify data storage
- **Property 17**: Test duplicate email rejection with random emails
- **Property 18**: Test credential verification with random valid/invalid combinations
- **Property 19**: Generate random signups and verify 6-digit codes with proper expiration
- **Property 21**: Generate random valid verification codes and verify account creation
- **Property 24**: Test verification code resend with random emails and verify new codes

### Test Organization
- Frontend unit tests: `frontend/src/**/*.test.jsx` co-located with components
- Frontend property tests: `frontend/src/__tests__/properties/*.property.test.js`
- Backend unit tests: `backend/src/**/*.test.js` co-located with modules
- Backend property tests: `backend/src/__tests__/properties/*.property.test.js`
- Integration tests: `backend/src/__tests__/integration/*.test.js`
- Test utilities: Shared generators and helpers in `test-utils/` directories

### Testing Approach
- Write implementation first, then tests
- Use React Testing Library for user-centric frontend testing
- Use Supertest for API endpoint testing
- Use MongoDB Memory Server for integration tests
- Mock minimal external dependencies
- Focus on behavior over implementation details
- Ensure all properties are validated through property-based tests
