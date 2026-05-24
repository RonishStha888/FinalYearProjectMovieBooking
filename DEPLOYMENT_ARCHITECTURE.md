# 🏗️ RTX Cinema Deployment Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS / BROWSERS                         │
│                    (Desktop, Mobile, Tablet)                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTPS
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    NETLIFY CDN (Frontend)                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  React Application (Vite Build)                            │ │
│  │  • HomePage, BookingPage, PaymentPage                      │ │
│  │  • Seat Selection, Admin Dashboard                         │ │
│  │  • Static Assets (CSS, Images, JS)                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  URL: https://rtx-cinema.netlify.app                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ REST API Calls
                            │ (HTTPS)
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    RENDER (Backend API)                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Node.js + Express Server                                  │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  API Routes:                                          │ │ │
│  │  │  • /api/auth      - Authentication                    │ │ │
│  │  │  • /api/movies    - Movie management                  │ │ │
│  │  │  • /api/cinemas   - Cinema locations                  │ │ │
│  │  │  • /api/seat-hold - Seat booking                      │ │ │
│  │  │  • /api/payment   - Payment processing                │ │ │
│  │  │  • /api/loyalty   - Loyalty points                    │ │ │
│  │  │  • /api/fb        - Food & Beverages                  │ │ │
│  │  │  • /api/admin     - Admin operations                  │ │ │
│  │  │  • /api/chatbot   - Chatbot service                   │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  URL: https://rtx-cinema-backend.onrender.com                   │
└───────────────┬───────────────────────────┬─────────────────────┘
                │                           │
                │ MongoDB                   │ SMTP
                │ Connection                │ (Email)
                ↓                           ↓
┌───────────────────────────┐   ┌──────────────────────┐
│   MONGODB ATLAS           │   │   EMAIL SERVICE      │
│   (Database)              │   │   (Nodemailer)       │
│  ┌─────────────────────┐  │   │  • Gmail SMTP        │
│  │  Collections:       │  │   │  • Verification      │
│  │  • users            │  │   │  • Notifications     │
│  │  • movies           │  │   └──────────────────────┘
│  │  • cinemas          │  │
│  │  • bookings         │  │
│  │  • seatHolds        │  │   ┌──────────────────────┐
│  │  • loyaltyPoints    │  │   │  PAYMENT GATEWAY     │
│  │  • fbItems          │  │   │  (Khalti/eSewa)      │
│  │  • feedbacks        │  │   │  • Test Mode         │
│  └─────────────────────┘  │   │  • Sandbox           │
│                            │   └──────────────────────┘
│  Cluster: M0 (Free)        │
│  Region: Closest to users  │
└────────────────────────────┘
```

---

## Data Flow Diagram

### User Booking Flow

```
┌──────┐
│ USER │
└───┬──┘
    │
    │ 1. Browse Movies
    ↓
┌─────────────┐
│  FRONTEND   │ ──→ GET /api/movies ──→ ┌─────────┐
│  (Netlify)  │                          │ BACKEND │
└─────────────┘ ←── Movie List ────────  │ (Render)│
    │                                     └────┬────┘
    │ 2. Select Movie & Showtime               │
    ↓                                           │
┌─────────────┐                                 │
│  Seat       │ ──→ POST /api/seat-hold/hold ─→│
│  Selection  │                                 │
└─────────────┘ ←── Hold Confirmed ────────────│
    │                                           │
    │ 3. Select F&B (Optional)                  │
    ↓                                           │
┌─────────────┐                                 │
│  Payment    │ ──→ POST /api/payment ────────→│
│  Page       │                                 │
└─────────────┘                                 │
    │                                           │
    │ 4. Complete Payment                       │
    ↓                                           ↓
┌─────────────┐                          ┌──────────┐
│  Ticket     │ ←── Booking Confirmed ── │ DATABASE │
│  Page       │                          │ (MongoDB)│
└─────────────┘                          └──────────┘
    │
    │ 5. Receive Email
    ↓
┌─────────────┐
│   EMAIL     │
│ Confirmation│
└─────────────┘
```

---

## Environment Variables Flow

### Frontend (Netlify)

```
┌─────────────────────────────────────┐
│  Netlify Environment Variables      │
├─────────────────────────────────────┤
│  VITE_API_URL                       │
│    ↓                                │
│  Used in all API calls:             │
│  fetch(`${import.meta.env.VITE_API_URL}/api/...`) │
└─────────────────────────────────────┘
```

### Backend (Render)

```
┌─────────────────────────────────────┐
│  Render Environment Variables       │
├─────────────────────────────────────┤
│  PORT              → Server port    │
│  NODE_ENV          → Environment    │
│  MONGODB_URI       → Database       │
│  EMAIL_USER        → Email sender   │
│  EMAIL_PASS        → Email password │
│  KHALTI_SECRET_KEY → Payment        │
│  KHALTI_PUBLIC_KEY → Payment        │
│  FRONTEND_URL      → CORS           │
└─────────────────────────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. HTTPS/TLS Encryption                                │
│     • Netlify: Automatic SSL                            │
│     • Render: Automatic SSL                             │
│     • MongoDB Atlas: TLS 1.2+                           │
│                                                          │
│  2. CORS Protection                                     │
│     • Whitelist specific origins                        │
│     • Credentials support                               │
│     • Method restrictions                               │
│                                                          │
│  3. Database Security                                   │
│     • MongoDB authentication                            │
│     • Network IP whitelist                              │
│     • Encrypted connections                             │
│                                                          │
│  4. Environment Variables                               │
│     • Secrets not in code                               │
│     • Platform-managed                                  │
│     • Encrypted at rest                                 │
│                                                          │
│  5. Input Validation                                    │
│     • Mongoose schema validation                        │
│     • Express middleware                                │
│     • Frontend validation                               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Deployment Pipeline

```
┌──────────────┐
│  Developer   │
│  (You!)      │
└──────┬───────┘
       │
       │ git push
       ↓
┌──────────────────────────────────────────┐
│           GITHUB REPOSITORY              │
│  • Source code                           │
│  • Version control                       │
│  • Collaboration                         │
└──────┬───────────────────┬───────────────┘
       │                   │
       │ Webhook           │ Webhook
       │ (Auto-deploy)     │ (Auto-deploy)
       ↓                   ↓
┌──────────────┐    ┌──────────────┐
│   NETLIFY    │    │    RENDER    │
│   (Frontend) │    │   (Backend)  │
├──────────────┤    ├──────────────┤
│ 1. Pull code │    │ 1. Pull code │
│ 2. npm install│   │ 2. npm install│
│ 3. npm build │    │ 3. npm start │
│ 4. Deploy    │    │ 4. Deploy    │
└──────┬───────┘    └──────┬───────┘
       │                   │
       │ HTTPS             │ HTTPS
       ↓                   ↓
┌──────────────────────────────────┐
│         LIVE WEBSITE             │
│  Frontend + Backend + Database   │
└──────────────────────────────────┘
```

---

## Scaling Considerations

### Current Setup (Free Tier)
```
Frontend (Netlify):
  • CDN: Global
  • Bandwidth: 100GB/month
  • Build minutes: 300/month
  • Concurrent builds: 1

Backend (Render):
  • Instance: Shared CPU
  • RAM: 512MB
  • Sleeps: After 15 min inactivity
  • Bandwidth: Unlimited

Database (MongoDB Atlas):
  • Storage: 512MB
  • RAM: Shared
  • Connections: 500
  • Backup: Manual
```

### Future Scaling (Paid Tiers)
```
When you need more:
  • Netlify Pro: $19/month
    - More bandwidth
    - More build minutes
    - Analytics

  • Render Standard: $7/month
    - Always on (no sleep)
    - More RAM
    - Better performance

  • MongoDB M10: $0.08/hour
    - Dedicated cluster
    - Auto-scaling
    - Automated backups
```

---

## Monitoring & Logging

```
┌─────────────────────────────────────────────────────────┐
│                    MONITORING STACK                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Netlify Dashboard                                      │
│  • Deploy logs                                          │
│  • Build status                                         │
│  • Bandwidth usage                                      │
│  • Form submissions                                     │
│                                                          │
│  Render Dashboard                                       │
│  • Application logs                                     │
│  • Metrics (CPU, RAM)                                   │
│  • Deploy history                                       │
│  • Health checks                                        │
│                                                          │
│  MongoDB Atlas                                          │
│  • Database metrics                                     │
│  • Query performance                                    │
│  • Connection stats                                     │
│  • Alerts                                               │
│                                                          │
│  Browser DevTools                                       │
│  • Console logs                                         │
│  • Network requests                                     │
│  • Performance metrics                                  │
│  • Error tracking                                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Backup Strategy

```
┌─────────────────────────────────────────┐
│           BACKUP STRATEGY               │
├─────────────────────────────────────────┤
│                                         │
│  Code (GitHub)                          │
│  • Automatic version control            │
│  • Commit history                       │
│  • Branch protection                    │
│                                         │
│  Database (MongoDB Atlas)               │
│  • Manual exports (free tier)           │
│  • Automated backups (paid tier)        │
│  • Point-in-time recovery (paid)        │
│                                         │
│  Environment Variables                  │
│  • Document in .env.example             │
│  • Store securely offline               │
│  • Never commit to Git                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## Cost Optimization

```
┌─────────────────────────────────────────┐
│         COST OPTIMIZATION TIPS          │
├─────────────────────────────────────────┤
│                                         │
│  1. Use Free Tiers                      │
│     • Perfect for hobby projects        │
│     • No credit card required           │
│                                         │
│  2. Optimize Assets                     │
│     • Compress images                   │
│     • Minify code                       │
│     • Use CDN caching                   │
│                                         │
│  3. Database Optimization               │
│     • Index frequently queried fields   │
│     • Clean up old data                 │
│     • Monitor storage usage             │
│                                         │
│  4. Backend Optimization                │
│     • Cache responses                   │
│     • Optimize queries                  │
│     • Use connection pooling            │
│                                         │
│  5. Monitor Usage                       │
│     • Track bandwidth                   │
│     • Monitor build minutes             │
│     • Check database size               │
│                                         │
└─────────────────────────────────────────┘
```

---

## Disaster Recovery

```
┌─────────────────────────────────────────┐
│        DISASTER RECOVERY PLAN           │
├─────────────────────────────────────────┤
│                                         │
│  Scenario 1: Frontend Down              │
│  → Redeploy from GitHub                 │
│  → Check build logs                     │
│  → Rollback to previous deploy          │
│                                         │
│  Scenario 2: Backend Down               │
│  → Check Render logs                    │
│  → Verify environment variables         │
│  → Restart service                      │
│  → Redeploy if needed                   │
│                                         │
│  Scenario 3: Database Issues            │
│  → Check MongoDB Atlas status           │
│  → Verify connection string             │
│  → Check network access                 │
│  → Restore from backup                  │
│                                         │
│  Scenario 4: Data Loss                  │
│  → Restore from MongoDB backup          │
│  → Check Git history for code           │
│  → Verify environment variables         │
│                                         │
└─────────────────────────────────────────┘
```

---

This architecture provides a solid foundation for your RTX Cinema application with room to scale as your user base grows!
