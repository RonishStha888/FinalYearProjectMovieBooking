# Email Verification System Migration Plan

## Current System (OTP-based)
- User enters email/password
- System sends 6-digit OTP code
- User enters OTP to verify
- Account created after verification

## New System (Link-based with Brevo)
- User enters email/password
- System sends verification link via Brevo
- User clicks link in email
- Account automatically verified and created

---

## Implementation Steps

### 1. Backend Changes

#### A. Install Brevo SDK
```bash
cd backend
npm install @sendinblue/client
```

#### B. Update Environment Variables
Add to `backend/.env`:
```
BREVO_API_KEY=your_brevo_api_key_here
FRONTEND_URL=https://your-netlify-site.netlify.app
```

#### C. Create Brevo Email Service
File: `backend/services/brevoService.js`
- Replace nodemailer with Brevo
- Send verification link instead of OTP

#### D. Update Auth Routes
File: `backend/routes/auth.js`
- Remove `/send-verification` endpoint
- Remove `/verify-signup` endpoint  
- Add `/signup` endpoint (sends verification email)
- Add `/verify-email/:token` endpoint (verifies and creates account)

#### E. Update User Model
File: `backend/models/User.js`
- Add `emailVerified` field (default: false)
- Add `verificationToken` field
- Add `verificationTokenExpires` field

#### F. Update/Remove EmailVerification Model
- Can be removed or repurposed for token storage

### 2. Frontend Changes

#### A. Update SignupPage
File: `frontend/src/pages/SignupPage.jsx`
- Remove OTP input step
- Show "Check your email" message after signup
- Add verification success page

#### B. Create Email Verification Page
File: `frontend/src/pages/EmailVerificationPage.jsx`
- New page to handle `/verify-email/:token` route
- Shows loading → success/error message

#### C. Update App.jsx Routes
- Add route for email verification page
- Remove OTP verification flow

### 3. Google OAuth Changes
- Keep Google OAuth as-is (already verified by Google)
- No email verification needed for Google signups

---

## Migration Benefits
✅ More professional user experience
✅ Works with hosted services (Render/Netlify)
✅ No Gmail blocking issues
✅ Industry-standard verification flow
✅ Better deliverability with Brevo

## Brevo Setup Required
1. Create free Brevo account: https://www.brevo.com/
2. Get API key from Settings → SMTP & API
3. Verify sender email address
4. Free tier: 300 emails/day

---

## Testing Checklist
- [ ] Regular email signup
- [ ] Email verification link works
- [ ] Token expiration (24 hours)
- [ ] Invalid token handling
- [ ] Expired token handling
- [ ] Google OAuth still works
- [ ] Password reset still works

---

## Rollback Plan
If issues occur:
1. Keep old code in git history
2. Can revert to OTP system
3. Database changes are additive (safe)
