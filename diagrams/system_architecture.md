# RTX Cinema System Architecture Diagrams

## 1. Functional Decomposition Diagram (FDD)

```mermaid
graph TD
    A[RTX Cinema System] --> B[User Authentication & Authorization]
    A --> C[Email Communication & Notification]
    A --> D[Movie Catalog & Content Management]
    A --> E[User Interface & Experience]
    A --> F[Backend Services & Data Management]
    
    B --> B1[Registration]
    B --> B2[Login/Logout]
    B --> B3[Password Reset]
    B --> B4[Google OAuth]
    
    C --> C1[Email Verification]
    C --> C2[Welcome Emails]
    C --> C3[Reset Codes]
    C --> C4[Email Templates]
    
    D --> D1[Movie Browsing]
    D --> D2[Category Filtering]
    D --> D3[Movie Details]
    D --> D4[Search Function]
    
    E --> E1[Responsive Design]
    E --> E2[Navigation]
    E --> E3[Dark Theme]
    E --> E4[Interactive Components]
    
    F --> F1[REST API]
    F --> F2[Database Operations]
    F --> F3[Error Handling]
    F --> F4[Middleware]
```

## 2. System Overview Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React Components]
        B[User Interface]
        C[State Management]
    end
    
    subgraph "API Layer"
        D[Express Server]
        E[Authentication Routes]
        F[Movie Routes]
        G[Email Routes]
    end
    
    subgraph "Service Layer"
        H[Email Service]
        I[Authentication Service]
        J[Movie Service]
    end
    
    subgraph "Data Layer"
        K[MongoDB]
        L[User Collection]
        M[Email Verification]
        N[Password Reset]
    end
    
    subgraph "External Services"
        O[SendGrid/Gmail]
        P[Google OAuth]
        Q[Movie APIs]
    end
    
    A --> D
    B --> E
    C --> F
    D --> H
    E --> I
    F --> J
    H --> O
    I --> P
    J --> Q
    I --> K
    J --> K
    H --> K
    K --> L
    K --> M
    K --> N
```

## 3. Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String login UK
        String email
        String password
        String name
        String googleId
        String authMethod
        Date createdAt
        Date updatedAt
    }
    
    EMAIL_VERIFICATION {
        ObjectId _id PK
        String email FK
        String code
        Object userData
        String verificationType
        Date createdAt
        Date expiresAt
    }
    
    PASSWORD_RESET {
        ObjectId _id PK
        String email FK
        String code
        Date createdAt
        Date expiresAt
    }
    
    MOVIE {
        ObjectId _id PK
        String title
        Number rating
        String genre
        String year
        String image
        String synopsis
        String category
        Date releaseDate
    }
    
    USER_SESSION {
        ObjectId _id PK
        ObjectId userId FK
        String token
        Date createdAt
        Date expiresAt
    }
    
    USER ||--o{ EMAIL_VERIFICATION : "verifies email"
    USER ||--o{ PASSWORD_RESET : "requests reset"
    USER ||--o{ USER_SESSION : "has sessions"
```

## 4. User Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database
    participant E as Email Service
    
    U->>F: Enter signup details
    F->>A: POST /api/auth/signup
    A->>D: Store verification code
    A->>E: Send verification email
    E->>U: Email with code
    U->>F: Enter verification code
    F->>A: POST /api/auth/verify-email
    A->>D: Verify code & create user
    A->>F: Success response
    F->>U: Account created successfully
```

## 5. Movie Browsing Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database
    participant M as Movie Service
    
    U->>F: Select movie category
    F->>A: GET /api/movies?category=action
    A->>D: Query movie database
    D->>A: Return movie list
    A->>M: Fetch additional details
    M->>A: Return movie metadata
    A->>F: Send movie data
    F->>U: Display movie grid
```