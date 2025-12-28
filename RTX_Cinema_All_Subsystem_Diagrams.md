# RTX Cinema - All Subsystem Diagrams

## 1. User Authentication & Authorization System (UAAS)

### 1.1 Activity Diagram - UAAS
```mermaid
graph TD
    A[User Registration] --> B{Valid Input?}
    B -->|No| C[Show Validation Errors]
    C --> A
    B -->|Yes| D[Send Verification Email]
    D --> E[User Enters Code]
    E --> F{Code Valid?}
    F -->|No| G[Show Error Message]
    G --> E
    F -->|Yes| H[Create Account]
    H --> I[Send Welcome Email]
    I --> J[Redirect to Login]
    
    K[User Login] --> L{Valid Credentials?}
    L -->|No| M[Show Login Error]
    M --> K
    L -->|Yes| N[Create Session]
    N --> O[Redirect to Home]
    
    P[Password Reset] --> Q[Enter Email]
    Q --> R[Send Reset Code]
    R --> S[Enter Reset Code]
    S --> T{Code Valid?}
    T -->|No| U[Show Error]
    U --> S
    T -->|Yes| V[Enter New Password]
    V --> W[Update Password]
    W --> X[Redirect to Login]
```

### 1.2 Use Case Diagram - UAAS
```mermaid
graph LR
    User((User))
    Guest((Guest))
    System[Authentication System]
    EmailService[Email Service]
    GoogleOAuth[Google OAuth]
    
    User --> |Register Account| System
    User --> |Login| System
    User --> |Logout| System
    User --> |Reset Password| System
    User --> |Update Profile| System
    User --> |Verify Email| System
    Guest --> |Register Account| System
    Guest --> |Login| System
    
    System --> |Send Verification| EmailService
    System --> |Send Welcome| EmailService
    System --> |Send Reset Code| EmailService
    System --> |Authenticate| GoogleOAuth
    
    System --> |Create Session| User
    System --> |Validate Credentials| User
```

### 1.3 Sequence Diagram - UAAS
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth API
    participant D as Database
    participant E as Email Service
    participant G as Google OAuth
    
    Note over U,G: User Registration Flow
    U->>F: Enter registration details
    F->>A: POST /api/auth/signup
    A->>A: Validate input
    A->>D: Check email exists
    D->>A: Email available
    A->>D: Store verification code
    A->>E: Send verification email
    E->>U: Email with code
    U->>F: Enter verification code
    F->>A: POST /api/auth/verify-email
    A->>D: Verify code & create user
    A->>E: Send welcome email
    A->>F: Success response
    F->>U: Account created successfully
    
    Note over U,G: Google OAuth Flow
    U->>F: Click Google Login
    F->>G: Initiate OAuth
    G->>U: Google login page
    U->>G: Authorize
    G->>F: OAuth token
    F->>A: POST /api/auth/google
    A->>D: Create/update user
    A->>F: User data & session
    F->>U: Login successful
```

### 1.4 Class Diagram - UAAS
```mermaid
classDiagram
    class User {
        +String id
        +String login
        +String email
        +String password
        +String name
        +String googleId
        +String authMethod
        +Date createdAt
        +Date updatedAt
        +register()
        +login()
        +logout()
        +resetPassword()
        +updateProfile()
        +verifyEmail()
        +validatePassword()
    }
    
    class EmailVerification {
        +String id
        +String email
        +String code
        +Object userData
        +String verificationType
        +Date createdAt
        +Date expiresAt
        +generateCode()
        +validateCode()
        +isExpired()
        +cleanup()
    }
    
    class PasswordReset {
        +String id
        +String email
        +String code
        +Date createdAt
        +Date expiresAt
        +generateResetCode()
        +validateResetCode()
        +isExpired()
        +cleanup()
    }
    
    class AuthController {
        +signup()
        +verifyEmail()
        +login()
        +logout()
        +resetPassword()
        +googleAuth()
        +updateProfile()
    }
    
    class SessionManager {
        +String sessionId
        +String userId
        +Date expiresAt
        +createSession()
        +validateSession()
        +destroySession()
        +refreshSession()
    }
    
    User ||--o{ EmailVerification : verifies
    User ||--o{ PasswordReset : requests
    User ||--o{ SessionManager : has
    AuthController --> User : manages
    AuthController --> EmailVerification : creates
    AuthController --> PasswordReset : creates
```

## 2. Email Communication & Notification System (ECNS)

### 2.1 Activity Diagram - ECNS
```mermaid
graph TD
    A[Email Request] --> B{Email Type?}
    B -->|Verification| C[Generate 6-digit Code]
    B -->|Welcome| D[Load Welcome Template]
    B -->|Reset| E[Generate Reset Code]
    B -->|Test| F[Load Test Template]
    
    C --> G[Store Code in Database]
    D --> H[Personalize Content]
    E --> I[Store Reset Token]
    F --> J[Prepare Test Email]
    
    G --> K[Send Email via Primary Provider]
    H --> K
    I --> K
    J --> K
    
    K --> L{Email Sent?}
    L -->|Yes| M[Log Success]
    L -->|No| N[Try Fallback Provider]
    
    N --> O{Fallback Success?}
    O -->|Yes| M
    O -->|No| P[Log Error & Notify Admin]
    
    M --> Q[Update Email Status]
    P --> R[Return Error Response]
    Q --> S[Return Success Response]
```

### 2.2 Use Case Diagram - ECNS
```mermaid
graph LR
    User((User))
    System[Email System]
    Admin((Admin))
    
    EmailProvider[Email Provider]
    SMTPService[SMTP Service]
    SendGridAPI[SendGrid API]
    GmailAPI[Gmail API]
    
    User --> |Request Verification| System
    User --> |Request Welcome| System
    User --> |Request Reset| System
    User --> |Test Email| System
    Admin --> |Monitor Delivery| System
    Admin --> |Manage Templates| System
    
    System --> |Send Email| EmailProvider
    System --> |Fallback Send| SMTPService
    System --> |Primary Send| SendGridAPI
    System --> |Backup Send| GmailAPI
    
    EmailProvider --> |Deliver Email| User
    System --> |Log Status| Admin
    System --> |Generate Reports| Admin
```

### 2.3 Sequence Diagram - ECNS
```mermaid
sequenceDiagram
    participant U as User
    participant S as System
    participant E as Email Service
    participant P1 as Primary Provider
    participant P2 as Fallback Provider
    participant D as Database
    participant L as Logger
    
    Note over U,L: Email Verification Flow
    U->>S: Request email verification
    S->>S: Generate verification code
    S->>D: Store code with expiration
    S->>E: Send verification email
    E->>E: Load email template
    E->>E: Personalize content
    E->>P1: Send via primary provider
    
    alt Primary provider success
        P1->>U: Email delivered
        P1->>E: Delivery confirmation
        E->>L: Log success
        E->>S: Return success
    else Primary provider fails
        P1->>E: Delivery failed
        E->>P2: Try fallback provider
        P2->>U: Email delivered
        P2->>E: Delivery confirmation
        E->>L: Log fallback success
        E->>S: Return success
    else All providers fail
        P2->>E: Delivery failed
        E->>L: Log error
        E->>S: Return error
        S->>U: Show error message
    end
```

### 2.4 Class Diagram - ECNS
```mermaid
classDiagram
    class EmailService {
        +String primaryProvider
        +String fallbackProvider
        +Object config
        +sendVerificationEmail()
        +sendWelcomeEmail()
        +sendResetEmail()
        +sendTestEmail()
        +generateCode()
        +validateProvider()
        +switchProvider()
    }
    
    class EmailTemplate {
        +String id
        +String type
        +String subject
        +String htmlContent
        +String textContent
        +Object variables
        +render()
        +personalize()
        +validate()
        +preview()
    }
    
    class EmailProvider {
        +String name
        +String apiKey
        +String endpoint
        +Object config
        +send()
        +validateConfig()
        +testConnection()
        +getStatus()
    }
    
    class EmailLog {
        +String id
        +String recipient
        +String type
        +String status
        +String provider
        +Date sentAt
        +String errorMessage
        +logDelivery()
        +trackStatus()
        +generateReport()
    }
    
    class EmailQueue {
        +String id
        +String recipient
        +String type
        +Object data
        +Number priority
        +Number retryCount
        +Date scheduledAt
        +enqueue()
        +dequeue()
        +retry()
        +process()
    }
    
    EmailService ||--o{ EmailTemplate : uses
    EmailService ||--o{ EmailProvider : manages
    EmailService ||--o{ EmailLog : creates
    EmailService ||--o{ EmailQueue : processes
    EmailProvider ||--o{ EmailLog : generates
```

## 3. Movie Catalog & Content Management System (MCCMS)

### 3.1 Activity Diagram - MCCMS
```mermaid
graph TD
    A[User Accesses Movies] --> B{Category Selected?}
    B -->|Top Rated| C[Load Top Rated Movies]
    B -->|Action| D[Load Action Movies]
    B -->|Coming Soon| E[Load Coming Soon Movies]
    B -->|Search| F[Process Search Query]
    
    C --> G[Fetch from Database]
    D --> G
    E --> G
    F --> H{Search Results?}
    
    G --> I[Apply Filters]
    H -->|Found| I
    H -->|Not Found| J[Show No Results]
    
    I --> K[Sort Movies]
    K --> L[Format Movie Data]
    L --> M[Display Movie Grid]
    
    M --> N[User Clicks Movie]
    N --> O[Load Movie Details]
    O --> P[Fetch Additional Info]
    P --> Q[Display Full Movie Info]
    
    Q --> R{User Action?}
    R -->|Back to List| M
    R -->|New Search| F
    R -->|Change Category| B
```

### 3.2 Use Case Diagram - MCCMS
```mermaid
graph LR
    User((User))
    Guest((Guest))
    Admin((Admin))
    
    MovieSystem[Movie Catalog System]
    MovieAPI[External Movie API]
    Database[(Movie Database)]
    
    User --> |Browse Categories| MovieSystem
    User --> |Search Movies| MovieSystem
    User --> |View Details| MovieSystem
    User --> |Filter Movies| MovieSystem
    User --> |Rate Movies| MovieSystem
    
    Guest --> |Browse Movies| MovieSystem
    Guest --> |View Details| MovieSystem
    
    Admin --> |Add Movies| MovieSystem
    Admin --> |Update Movies| MovieSystem
    Admin --> |Manage Categories| MovieSystem
    Admin --> |Monitor Usage| MovieSystem
    
    MovieSystem --> |Fetch Data| MovieAPI
    MovieSystem --> |Store Data| Database
    MovieSystem --> |Query Data| Database
    MovieAPI --> |Return Movie Info| MovieSystem
    Database --> |Return Results| MovieSystem
```

### 3.3 Sequence Diagram - MCCMS
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant C as Cache
    participant D as Database
    participant E as External API
    participant S as Search Engine
    
    Note over U,S: Browse Movies Flow
    U->>F: Select movie category
    F->>A: GET /api/movies?category=action
    A->>C: Check cache
    
    alt Cache hit
        C->>A: Return cached data
        A->>F: Send movie list
    else Cache miss
        A->>D: Query movie database
        D->>A: Return movie list
        A->>E: Fetch additional details
        E->>A: Return movie metadata
        A->>C: Store in cache
        A->>F: Send movie data
    end
    
    F->>U: Display movie grid
    
    Note over U,S: Search Movies Flow
    U->>F: Enter search query
    F->>A: GET /api/movies/search?q=batman
    A->>S: Process search query
    S->>D: Search database
    D->>S: Return search results
    S->>A: Ranked results
    A->>F: Send search results
    F->>U: Display search results
    
    Note over U,S: Movie Details Flow
    U->>F: Click movie
    F->>A: GET /api/movies/:id
    A->>D: Get movie details
    D->>A: Return movie data
    A->>E: Get additional info
    E->>A: Return extra details
    A->>F: Send complete movie info
    F->>U: Display movie details
```

### 3.4 Class Diagram - MCCMS
```mermaid
classDiagram
    class Movie {
        +String id
        +String title
        +Number rating
        +String genre
        +String year
        +String image
        +String synopsis
        +Array cast
        +String category
        +Date releaseDate
        +String director
        +Number duration
        +getDetails()
        +updateRating()
        +addReview()
        +updateInfo()
    }
    
    class Category {
        +String id
        +String name
        +String description
        +Array movies
        +String sortOrder
        +addMovie()
        +removeMovie()
        +getMovies()
        +updateCategory()
    }
    
    class Review {
        +String id
        +String movieId
        +String userId
        +Number rating
        +String comment
        +Date createdAt
        +Boolean approved
        +validate()
        +moderate()
        +approve()
    }
    
    class SearchEngine {
        +String indexName
        +Object config
        +search()
        +indexMovie()
        +updateIndex()
        +deleteFromIndex()
        +buildQuery()
        +rankResults()
    }
    
    class MovieController {
        +getMovies()
        +getMovieById()
        +searchMovies()
        +getCategories()
        +addMovie()
        +updateMovie()
        +deleteMovie()
    }
    
    class CacheManager {
        +String cacheKey
        +Number ttl
        +get()
        +set()
        +delete()
        +clear()
        +exists()
    }
    
    Movie ||--o{ Review : has
    Category ||--o{ Movie : contains
    MovieController --> Movie : manages
    MovieController --> Category : manages
    MovieController --> SearchEngine : uses
    MovieController --> CacheManager : uses
    SearchEngine --> Movie : indexes
```

## 4. User Interface & Experience System (UIES)

### 4.1 Activity Diagram - UIES
```mermaid
graph TD
    A[User Accesses Platform] --> B{Device Type?}
    B -->|Desktop| C[Load Desktop Layout]
    B -->|Tablet| D[Load Tablet Layout]
    B -->|Mobile| E[Load Mobile Layout]
    
    C --> F[Apply Dark Theme]
    D --> F
    E --> F
    
    F --> G[Initialize Navigation]
    G --> H[Load User Preferences]
    H --> I{User Logged In?}
    
    I -->|Yes| J[Show Personalized Interface]
    I -->|No| K[Show Guest Interface]
    
    J --> L[Enable All Features]
    K --> M[Show Limited Features]
    
    L --> N[User Interaction]
    M --> N
    
    N --> O{Interaction Type?}
    O -->|Navigation| P[Update Route]
    O -->|Theme Toggle| Q[Switch Theme]
    O -->|Search| R[Show Search Interface]
    O -->|Menu| S[Toggle Menu]
    
    P --> T[Smooth Transition]
    Q --> U[Apply New Theme]
    R --> V[Focus Search Input]
    S --> W[Animate Menu]
    
    T --> N
    U --> N
    V --> N
    W --> N
```

### 4.2 Use Case Diagram - UIES
```mermaid
graph LR
    User((User))
    Guest((Guest))
    MobileUser((Mobile User))
    
    UISystem[UI System]
    ThemeManager[Theme Manager]
    NavigationManager[Navigation Manager]
    ResponsiveManager[Responsive Manager]
    
    User --> |Navigate Pages| UISystem
    User --> |Change Theme| ThemeManager
    User --> |Interact Components| UISystem
    User --> |Search Interface| UISystem
    User --> |Manage Preferences| UISystem
    
    Guest --> |View Interface| UISystem
    Guest --> |Navigate Public Pages| NavigationManager
    
    MobileUser --> |Touch Interactions| UISystem
    MobileUser --> |Mobile Navigation| ResponsiveManager
    
    UISystem --> |Apply Styles| ThemeManager
    UISystem --> |Route Changes| NavigationManager
    UISystem --> |Adapt Layout| ResponsiveManager
    
    ThemeManager --> |Update Colors| UISystem
    NavigationManager --> |Update URL| UISystem
    ResponsiveManager --> |Adjust Components| UISystem
```

### 4.3 Sequence Diagram - UIES
```mermaid
sequenceDiagram
    participant U as User
    participant UI as UI Component
    participant T as Theme Manager
    participant N as Navigation Manager
    participant S as State Manager
    participant R as Responsive Manager
    
    Note over U,R: Page Navigation Flow
    U->>UI: Click navigation item
    UI->>N: Request route change
    N->>S: Update current route state
    S->>T: Apply page-specific theme
    T->>UI: Return styled components
    UI->>R: Check responsive breakpoints
    R->>UI: Apply responsive styles
    UI->>U: Display new page with transition
    
    Note over U,R: Theme Toggle Flow
    U->>UI: Click theme toggle
    UI->>T: Toggle theme
    T->>T: Switch color scheme
    T->>S: Update theme state
    S->>UI: Trigger re-render
    UI->>R: Apply responsive theme
    R->>UI: Return adapted styles
    UI->>U: Display updated theme
    
    Note over U,R: Search Interface Flow
    U->>UI: Click search button
    UI->>S: Update search state
    S->>UI: Show search interface
    UI->>UI: Focus search input
    U->>UI: Type search query
    UI->>S: Update search query
    S->>UI: Show search suggestions
    UI->>U: Display suggestions
```

### 4.4 Class Diagram - UIES
```mermaid
classDiagram
    class UIComponent {
        +String id
        +Object props
        +Object state
        +String theme
        +Boolean responsive
        +render()
        +handleEvents()
        +updateState()
        +applyStyles()
    }
    
    class ThemeManager {
        +Object darkTheme
        +Object lightTheme
        +String currentTheme
        +Object customColors
        +applyTheme()
        +toggleTheme()
        +getColors()
        +setCustomTheme()
        +validateTheme()
    }
    
    class NavigationManager {
        +Array routes
        +String currentRoute
        +Object history
        +Object breadcrumbs
        +navigate()
        +goBack()
        +goForward()
        +updateRoute()
        +generateBreadcrumbs()
    }
    
    class ResponsiveManager {
        +Object breakpoints
        +String currentBreakpoint
        +Object deviceInfo
        +checkBreakpoint()
        +adaptLayout()
        +getDeviceType()
        +updateBreakpoint()
    }
    
    class StateManager {
        +Object globalState
        +Object userPreferences
        +Object uiState
        +updateState()
        +getState()
        +resetState()
        +persistState()
        +loadState()
    }
    
    class InteractionHandler {
        +Object eventListeners
        +handleClick()
        +handleHover()
        +handleKeyboard()
        +handleTouch()
        +handleScroll()
        +debounce()
        +throttle()
    }
    
    UIComponent ||--o{ ThemeManager : uses
    UIComponent ||--o{ NavigationManager : uses
    UIComponent ||--o{ ResponsiveManager : uses
    UIComponent ||--o{ StateManager : uses
    UIComponent ||--o{ InteractionHandler : uses
    ThemeManager --> StateManager : updates
    NavigationManager --> StateManager : updates
```

## 5. Backend Services & Data Management System (BSDMS)

### 5.1 Activity Diagram - BSDMS
```mermaid
graph TD
    A[API Request Received] --> B[CORS Middleware]
    B --> C[Request Logging]
    C --> D[Authentication Middleware]
    D --> E{Authenticated?}
    
    E -->|No| F[Return 401 Unauthorized]
    E -->|Yes| G[Authorization Check]
    G --> H{Authorized?}
    
    H -->|No| I[Return 403 Forbidden]
    H -->|Yes| J[Validation Middleware]
    J --> K{Valid Input?}
    
    K -->|No| L[Return 400 Bad Request]
    K -->|Yes| M[Rate Limiting Check]
    M --> N{Rate Limit OK?}
    
    N -->|No| O[Return 429 Too Many Requests]
    N -->|Yes| P[Route Handler]
    P --> Q[Database Operation]
    Q --> R{Operation Success?}
    
    R -->|No| S[Error Handler]
    R -->|Yes| T[Format Response]
    
    S --> U[Log Error]
    T --> V[Response Logging]
    U --> W[Return Error Response]
    V --> X[Send Success Response]
    
    W --> Y[End]
    X --> Y
    F --> Y
    I --> Y
    L --> Y
    O --> Y
```

### 5.2 Use Case Diagram - BSDMS
```mermaid
graph LR
    Client((Client))
    Admin((Admin))
    System((System))
    
    APIGateway[API Gateway]
    Database[(Database)]
    CacheLayer[Cache Layer]
    LoggingService[Logging Service]
    MonitoringService[Monitoring Service]
    
    Client --> |HTTP Request| APIGateway
    Admin --> |Monitor System| MonitoringService
    Admin --> |View Logs| LoggingService
    Admin --> |Manage Database| Database
    
    System --> |Health Check| APIGateway
    System --> |Backup Data| Database
    System --> |Clear Cache| CacheLayer
    
    APIGateway --> |Query/Update| Database
    APIGateway --> |Cache Data| CacheLayer
    APIGateway --> |Log Events| LoggingService
    APIGateway --> |Send Metrics| MonitoringService
    
    Database --> |Data| APIGateway
    CacheLayer --> |Cached Data| APIGateway
    LoggingService --> |Log Data| Admin
    MonitoringService --> |Metrics| Admin
```

### 5.3 Sequence Diagram - BSDMS
```mermaid
sequenceDiagram
    participant C as Client
    participant G as API Gateway
    participant A as Auth Service
    participant V as Validator
    participant R as Rate Limiter
    participant H as Route Handler
    participant D as Database
    participant Cache as Cache
    participant L as Logger
    participant M as Monitor
    
    Note over C,M: API Request Processing
    C->>G: HTTP Request
    G->>L: Log incoming request
    G->>A: Validate authentication
    
    alt Authentication valid
        A->>G: Auth success
        G->>V: Validate request data
        V->>G: Validation passed
        G->>R: Check rate limits
        R->>G: Rate limit OK
        G->>H: Route to handler
        
        H->>Cache: Check cache
        alt Cache hit
            Cache->>H: Return cached data
        else Cache miss
            H->>D: Database query
            D->>H: Return data
            H->>Cache: Store in cache
        end
        
        H->>G: Return response data
        G->>L: Log successful response
        G->>M: Send success metrics
        G->>C: HTTP 200 Response
        
    else Authentication failed
        A->>G: Auth failed
        G->>L: Log auth failure
        G->>M: Send error metrics
        G->>C: HTTP 401 Unauthorized
    end
    
    Note over C,M: Error Handling
    alt Database error
        D->>H: Database error
        H->>G: Internal error
        G->>L: Log database error
        G->>M: Send error metrics
        G->>C: HTTP 500 Internal Server Error
    end
```

### 5.4 Class Diagram - BSDMS
```mermaid
classDiagram
    class APIServer {
        +Number port
        +Object config
        +Array routes
        +Array middleware
        +start()
        +stop()
        +addRoute()
        +addMiddleware()
        +handleRequest()
    }
    
    class DatabaseManager {
        +String connectionString
        +Object connection
        +Object pool
        +connect()
        +disconnect()
        +query()
        +transaction()
        +backup()
        +migrate()
    }
    
    class CacheManager {
        +String cacheType
        +Object config
        +Number defaultTTL
        +get()
        +set()
        +delete()
        +clear()
        +exists()
        +expire()
    }
    
    class ErrorHandler {
        +Object logger
        +Object config
        +handleError()
        +logError()
        +formatError()
        +sendErrorResponse()
        +notifyAdmin()
    }
    
    class Middleware {
        +String name
        +Number priority
        +execute()
        +validate()
        +authenticate()
        +authorize()
        +rateLimit()
        +cors()
    }
    
    class Logger {
        +String level
        +Object config
        +Array transports
        +info()
        +warn()
        +error()
        +debug()
        +createLogEntry()
        +rotate()
    }
    
    class MonitoringService {
        +Object metrics
        +Object alerts
        +collectMetrics()
        +sendAlert()
        +healthCheck()
        +generateReport()
        +trackPerformance()
    }
    
    class SecurityManager {
        +Object config
        +validateToken()
        +hashPassword()
        +encryptData()
        +decryptData()
        +sanitizeInput()
        +preventInjection()
    }
    
    APIServer ||--o{ DatabaseManager : uses
    APIServer ||--o{ CacheManager : uses
    APIServer ||--o{ ErrorHandler : uses
    APIServer ||--o{ Middleware : uses
    APIServer ||--o{ Logger : uses
    APIServer ||--o{ MonitoringService : uses
    APIServer ||--o{ SecurityManager : uses
    
    ErrorHandler --> Logger : logs
    MonitoringService --> Logger : logs
    Middleware --> SecurityManager : validates
    DatabaseManager --> Logger : logs
```

---

## Summary

This document contains all 20 diagrams (4 types × 5 subsystems) for the RTX Cinema system:

### Diagram Types per Subsystem:
1. **Activity Diagram** - Shows the flow of activities and decision points
2. **Use Case Diagram** - Shows interactions between actors and system
3. **Sequence Diagram** - Shows message flow over time
4. **Class Diagram** - Shows system structure and relationships

### 5 Subsystems:
1. **UAAS** - User Authentication & Authorization System
2. **ECNS** - Email Communication & Notification System  
3. **MCCMS** - Movie Catalog & Content Management System
4. **UIES** - User Interface & Experience System
5. **BSDMS** - Backend Services & Data Management System

All diagrams are in Mermaid format and can be rendered using the HTML file or online Mermaid editors.