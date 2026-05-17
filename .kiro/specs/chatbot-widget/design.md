# Design Document

## Overview

The Live Chat/FAQ Chatbot Widget is a floating customer support interface that provides instant automated assistance to users browsing the RTX Cinema website. The system consists of three main components: a React-based frontend chat widget, a Node.js/Express backend API with intelligent FAQ matching, and a MongoDB database for storing FAQs and chat logs. The chatbot uses keyword-based matching to find relevant answers from a curated FAQ database, with comprehensive logging for analytics and continuous improvement.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ ChatbotButton  │  │ ChatWindow   │  │ MessageBubble   │ │
│  │ (Floating)     │  │ (Modal)      │  │ (User/Bot)      │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP POST /api/chatbot
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Node.js/Express)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Chatbot Controller                        │ │
│  │  • Receive message                                     │ │
│  │  • Tokenize & lowercase                                │ │
│  │  • Call FAQ matching service                           │ │
│  │  • Log interaction                                     │ │
│  │  • Return response                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              FAQ Matching Service                      │ │
│  │  • Keyword overlap scoring                             │ │
│  │  • Best match selection                                │ │
│  │  • Fallback handling                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ MongoDB Queries
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (MongoDB)                        │
│  ┌──────────────┐              ┌──────────────────────────┐ │
│  │ faqs         │              │ chatLogs                 │ │
│  │ • question   │              │ • userMessage            │ │
│  │ • answer     │              │ • matchedFaqId           │ │
│  │ • keywords   │              │ • createdAt              │ │
│  └──────────────┘              └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: React.js with hooks (useState, useEffect, useRef)
- **Styling**: CSS modules with gradient backgrounds and animations
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful HTTP endpoints
- **State Management**: React local state (no Redux needed for this feature)

### Design Patterns

1. **Component-Based Architecture**: Modular React components for reusability
2. **Service Layer Pattern**: Separate business logic from route handlers
3. **Repository Pattern**: Database access abstracted through Mongoose models
4. **Keyword Matching Algorithm**: Simple but effective scoring system
5. **Graceful Degradation**: Fallback messages when no match found

## Components and Interfaces

### Frontend Components

#### 1. ChatbotWidget (Container Component)
```javascript
// Props: none (self-contained)
// State:
// - isOpen: boolean
// - messages: Array<{id, text, sender, timestamp}>
// - inputValue: string
// - isTyping: boolean

// Methods:
// - toggleChat()
// - sendMessage(text)
// - handleApiResponse(response)
```

#### 2. FloatingChatButton
```javascript
// Props:
// - onClick: function
// - isOpen: boolean

// Renders: Teal-green gradient pill with chat icon and bounce animation
```

#### 3. ChatWindow
```javascript
// Props:
// - isOpen: boolean
// - messages: Array
// - onClose: function
// - onSendMessage: function
// - isTyping: boolean

// Children:
// - ChatHeader
// - MessageList
// - ChatInput
```

#### 4. ChatHeader
```javascript
// Props: none

// Renders: Logo, "Chatbot" title, online indicator, expand/close buttons
```

#### 5. MessageList
```javascript
// Props:
// - messages: Array<{id, text, sender, timestamp}>
// - isTyping: boolean

// Renders: Scrollable list of MessageBubble components + typing indicator
```

#### 6. MessageBubble
```javascript
// Props:
// - text: string
// - sender: 'user' | 'bot'
// - timestamp: Date

// Renders: Styled bubble (left/gray for bot, right/purple for user)
```

#### 7. ChatInput
```javascript
// Props:
// - value: string
// - onChange: function
// - onSubmit: function

// Renders: Input field with placeholder, paperclip icon, emoji icon, send button
```

#### 8. TypingIndicator
```javascript
// Props: none

// Renders: Animated three-dot indicator
```

### Backend API Endpoints

#### POST /api/chatbot
```javascript
// Request Body:
{
  message: string  // User's question
}

// Response:
{
  success: boolean,
  reply: string,    // Bot's answer or fallback message
  matchedFaqId: number | null  // For logging purposes
}

// Error Response:
{
  success: false,
  error: string
}
```

### Backend Services

#### ChatbotService
```javascript
class ChatbotService {
  // Tokenize and lowercase user message
  tokenizeMessage(message: string): string[]
  
  // Find best matching FAQ
  findBestMatch(tokens: string[]): { faq: FAQ | null, score: number }
  
  // Calculate keyword overlap score
  calculateScore(messageTokens: string[], faqKeywords: string[]): number
  
  // Get fallback message
  getFallbackMessage(): string
}
```

#### ChatLogService
```javascript
class ChatLogService {
  // Log user interaction
  logInteraction(userMessage: string, matchedFaqId: number | null): Promise<void>
  
  // Get analytics data
  getCommonQuestions(limit: number): Promise<Array>
  getUnmatchedQuestions(limit: number): Promise<Array>
}
```

## Data Models

### FAQ Model (MongoDB)
```javascript
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  keywords: {
    type: String,  // Comma-separated keywords
    required: true,
    lowercase: true
  }
}, {
  timestamps: true
});

// Index for faster keyword searches
faqSchema.index({ keywords: 'text' });
```

### ChatLog Model (MongoDB)
```javascript
const chatLogSchema = new mongoose.Schema({
  userMessage: {
    type: String,
    required: true
  },
  matchedFaqId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FAQ',
    default: null  // null when no match found
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for analytics queries
chatLogSchema.index({ createdAt: -1 });
chatLogSchema.index({ matchedFaqId: 1 });
```

### Default FAQ Seed Data
```javascript
const defaultFAQs = [
  {
    question: 'How do I book a movie ticket?',
    answer: 'You can book tickets by selecting a movie, choosing your showtime, picking your seats, and completing payment on our website.',
    keywords: 'book,ticket,how,purchase,buy,reserve'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards, eSewa, Khalti, and cash at the counter.',
    keywords: 'payment,pay,card,esewa,khalti,cash,method,accept'
  },
  {
    question: 'Can I cancel or refund my ticket?',
    answer: 'Yes, cancellations are allowed up to 2 hours before the showtime. Refunds are processed within 3-5 business days.',
    keywords: 'cancel,refund,return,money back,cancellation'
  },
  {
    question: 'How do I select seats?',
    answer: 'After choosing your showtime, an interactive seat map will appear. Click on available seats to select them.',
    keywords: 'seat,select,choose,map,pick'
  },
  {
    question: 'Are there any discounts or offers?',
    answer: 'We offer student discounts, weekend combo deals, and loyalty rewards for regular customers.',
    keywords: 'discount,offer,deal,promo,student,cheap,sale'
  },
  {
    question: 'What are the cinema timings?',
    answer: 'Our cinema is open daily from 10:00 AM to 11:00 PM. Showtimes vary by movie.',
    keywords: 'timing,time,open,hours,schedule,when'
  },
  {
    question: 'How do I get my tickets after booking?',
    answer: 'You will receive an e-ticket via email and SMS. You can also download it from your account under "My Bookings".',
    keywords: 'get ticket,e-ticket,download,email,sms,my bookings,receive'
  },
  {
    question: 'Can I book tickets for a group?',
    answer: 'Yes, you can book up to 10 tickets in a single transaction. For larger groups, please contact us directly.',
    keywords: 'group,multiple,bulk,many people,friends,family'
  },
  {
    question: 'Is there parking available?',
    answer: 'Yes, we have free parking available for all moviegoers.',
    keywords: 'parking,park,car,vehicle'
  },
  {
    question: 'Do you have food and beverages?',
    answer: 'Yes, we have a full concession stand with popcorn, drinks, snacks, and combo meals.',
    keywords: 'food,drink,popcorn,snack,beverage,concession,eat,combo'
  }
];
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Chat button visibility
*For any* page in the application, the floating chat button should be rendered in the DOM at the bottom-right corner with correct positioning
**Validates: Requirements 1.1, 1.2**

### Property 2: Chat window toggle
*For any* click on the floating button or close icon, the chat window should toggle between open and closed states
**Validates: Requirements 1.5, 2.8**

### Property 3: Message display
*For any* user message sent, the message should appear as a right-aligned purple bubble in the message list
**Validates: Requirements 3.3**

### Property 4: Typing indicator timing
*For any* message submission, the typing indicator should display for exactly 800 milliseconds before the bot response appears
**Validates: Requirements 3.4**

### Property 5: API call on message send
*For any* message sent by the user, an HTTP POST request should be made to /api/chatbot with the message text
**Validates: Requirements 3.5**

### Property 6: Bot response display
*For any* API response received, the bot's reply should appear as a left-aligned gray bubble in the message list
**Validates: Requirements 3.6**

### Property 7: Message timestamps
*For any* message displayed (user or bot), a timestamp should be shown with the message
**Validates: Requirements 3.7**

### Property 8: Message area scrolling
*For any* state where messages exceed the visible area, the message container should be scrollable
**Validates: Requirements 3.8**

### Property 9: Auto-scroll on new message
*For any* new message added to the chat, the message area should automatically scroll to show the latest message at the bottom
**Validates: Requirements 3.9**

### Property 10: Message tokenization
*For any* user message received by the backend, the message should be lowercased and split into individual keyword tokens
**Validates: Requirements 4.1**

### Property 11: FAQ search execution
*For any* tokenized message, the system should query the FAQs collection to find matching entries
**Validates: Requirements 4.2**

### Property 12: Keyword overlap scoring
*For any* FAQ entry and set of message tokens, a keyword overlap score should be calculated based on the number of matching keywords
**Validates: Requirements 4.3**

### Property 13: Matched FAQ response
*For any* FAQ with a positive keyword overlap score, the system should return that FAQ's answer as the response
**Validates: Requirements 4.4**

### Property 14: Chat interaction logging
*For any* message processed by the chatbot, a log entry should be created in the chat_logs collection with the user message and matched FAQ ID
**Validates: Requirements 4.6**

### Property 15: Log timestamp recording
*For any* chat log entry created, the createdAt timestamp should be automatically set to the current date and time
**Validates: Requirements 4.7, 7.4**

### Property 16: FAQ CRUD operations
*For any* FAQ added or updated by an administrator, the changes should be immediately reflected in the database and available for matching
**Validates: Requirements 5.4, 5.5**

### Property 17: Message logging completeness
*For any* user message sent, the complete message text should be stored in the chat_logs table
**Validates: Requirements 7.1**

### Property 18: Matched FAQ ID logging
*For any* successful FAQ match, the matched FAQ's ID should be stored in the chat_logs entry
**Validates: Requirements 7.2**

### Property 19: Analytics query functionality
*For any* query to the chat_logs collection, the system should be able to aggregate data showing message frequency and match rates
**Validates: Requirements 7.5**

### Property 20: Widget presence across pages
*For any* user-facing page in the application, the chatbot widget should be rendered and functional
**Validates: Requirements 8.2**

## Error Handling

### Frontend Error Scenarios

1. **API Request Failure**
   - Display error message: "Sorry, I'm having trouble connecting. Please try again."
   - Log error to console
   - Allow user to retry

2. **Network Timeout**
   - Show timeout message after 10 seconds
   - Provide fallback contact information

3. **Invalid Input**
   - Prevent empty message submission
   - Trim whitespace from messages

### Backend Error Scenarios

1. **Database Connection Failure**
   - Return 500 status with generic error message
   - Log detailed error for debugging
   - Attempt reconnection

2. **FAQ Collection Empty**
   - Return fallback message
   - Log warning for admin attention

3. **Malformed Request**
   - Return 400 status with validation error
   - Specify which field is invalid

## Testing Strategy

### Unit Testing

**Frontend Components:**
- Test ChatbotWidget state management (open/close, message handling)
- Test MessageBubble rendering with different props
- Test ChatInput validation and submission
- Test TypingIndicator animation

**Backend Services:**
- Test tokenizeMessage() with various inputs
- Test calculateScore() with different keyword combinations
- Test findBestMatch() with multiple FAQs
- Test logInteraction() database writes

**API Endpoints:**
- Test POST /api/chatbot with valid messages
- Test POST /api/chatbot with empty/invalid messages
- Test response format and status codes

### Property-Based Testing

Property-based tests will use a testing library appropriate for the stack (e.g., fast-check for JavaScript). Each test should run a minimum of 100 iterations.

**Property Test 1: Message tokenization consistency**
- Generate random strings
- Verify all are lowercased and split correctly
- **Feature: chatbot-widget, Property 10: Message tokenization**
- **Validates: Requirements 4.1**

**Property Test 2: Keyword scoring non-negative**
- Generate random keyword sets
- Verify scores are always >= 0
- **Feature: chatbot-widget, Property 12: Keyword overlap scoring**
- **Validates: Requirements 4.3**

**Property Test 3: Logging completeness**
- Generate random messages
- Verify each creates exactly one log entry
- **Feature: chatbot-widget, Property 14: Chat interaction logging**
- **Validates: Requirements 4.6**

**Property Test 4: Auto-scroll behavior**
- Add random number of messages
- Verify scroll position is always at bottom
- **Feature: chatbot-widget, Property 9: Auto-scroll on new message**
- **Validates: Requirements 3.9**

### Integration Testing

1. **End-to-End Chat Flow**
   - Open chat widget
   - Send message
   - Verify API call
   - Verify bot response
   - Verify logging

2. **FAQ Matching Accuracy**
   - Test with known questions
   - Verify correct answers returned
   - Test with variations/typos

3. **Mobile Responsiveness**
   - Test on various viewport sizes
   - Verify layout adapts correctly

## Performance Considerations

### Frontend Optimization

1. **Lazy Loading**: Load chat widget only when needed
2. **Message Virtualization**: For long chat histories, render only visible messages
3. **Debouncing**: Prevent rapid-fire message submissions
4. **CSS Animations**: Use GPU-accelerated transforms for smooth animations

### Backend Optimization

1. **Database Indexing**: Index keywords field for faster searches
2. **Caching**: Cache FAQ data in memory (refresh periodically)
3. **Query Optimization**: Limit FAQ search results to top 5 matches
4. **Connection Pooling**: Reuse database connections

### Scalability

- **Horizontal Scaling**: Stateless API allows multiple backend instances
- **Database Sharding**: Partition chat_logs by date for large volumes
- **CDN**: Serve static chat widget assets from CDN

## Security Considerations

1. **Input Sanitization**: Escape HTML/script tags in user messages
2. **Rate Limiting**: Limit messages per user per minute (e.g., 10 messages/min)
3. **CORS**: Configure proper CORS headers for API
4. **SQL Injection Prevention**: Use parameterized queries (Mongoose handles this)
5. **XSS Prevention**: Sanitize message content before rendering

## Deployment Strategy

### Database Setup

1. Create MongoDB collections (faqs, chatLogs)
2. Run seed script to populate default FAQs
3. Create indexes for performance

### Backend Deployment

1. Add chatbot routes to Express server
2. Register chatbot controller
3. Configure environment variables
4. Test API endpoints

### Frontend Deployment

1. Add ChatbotWidget to App.jsx or base layout
2. Configure API endpoint URL
3. Test on all pages
4. Verify mobile responsiveness

## Future Enhancements

### Phase 2: Advanced Features

1. **Natural Language Processing**: Use NLP library for better intent matching
2. **Multi-language Support**: Detect user language and respond accordingly
3. **Rich Media Responses**: Support images, videos, links in bot responses
4. **Conversation Context**: Remember previous messages in the session
5. **Sentiment Analysis**: Detect frustrated users and escalate to human support

### Phase 3: Admin Features

1. **Admin Dashboard**: View chat analytics, common questions, unmatched queries
2. **FAQ Management UI**: Add/edit/delete FAQs without database access
3. **Live Chat Handoff**: Transfer to human agent when needed
4. **Canned Responses**: Quick reply templates for common scenarios
5. **A/B Testing**: Test different greeting messages and response styles

### Phase 4: Intelligence

1. **Machine Learning**: Train model on chat logs to improve matching
2. **Personalization**: Tailor responses based on user history
3. **Proactive Suggestions**: Suggest FAQs based on current page
4. **Voice Input**: Allow users to speak their questions
5. **Chatbot Analytics**: Track conversion rates, satisfaction scores

## Accessibility

1. **Keyboard Navigation**: Full keyboard support for opening, navigating, and sending messages
2. **Screen Reader Support**: ARIA labels on all interactive elements
3. **Focus Management**: Proper focus handling when opening/closing chat
4. **Color Contrast**: Ensure text meets WCAG AA standards
5. **Reduced Motion**: Respect prefers-reduced-motion for animations

## Monitoring and Analytics

### Metrics to Track

1. **Usage Metrics**
   - Total messages sent
   - Unique users
   - Average messages per session
   - Peak usage times

2. **Performance Metrics**
   - API response time
   - FAQ match rate
   - Fallback message frequency

3. **Quality Metrics**
   - User satisfaction (if feedback added)
   - Most common questions
   - Unmatched queries (gaps in FAQ coverage)

### Logging Strategy

- Log all API requests/responses
- Log FAQ match scores for tuning
- Log errors with stack traces
- Aggregate logs for weekly reports

## Color Palette

```css
/* Header Gradient */
--header-gradient: linear-gradient(135deg, #4a0e6e 0%, #8b2fc9 100%);

/* Floating Button Gradient */
--button-gradient: linear-gradient(135deg, #00c9a7 0%, #00e5c0 100%);

/* Bot Message Bubble */
--bot-bubble-bg: #f0f0f0;
--bot-bubble-text: #333333;

/* User Message Bubble */
--user-bubble-bg: #6c3fc5;
--user-bubble-text: #ffffff;

/* Online Indicator */
--online-dot: #00e676;

/* Accent Colors */
--primary-purple: #6c3fc5;
--teal-green: #00c9a7;
--dark-purple: #4a0e6e;
```

## Typography

```css
/* Font Family */
font-family: 'DM Sans', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Font Sizes */
--font-size-header: 18px;
--font-size-message: 14px;
--font-size-timestamp: 11px;
--font-size-input: 14px;

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-bold: 600;
```

## Summary

The Live Chat/FAQ Chatbot Widget provides an intelligent, user-friendly support interface that enhances the RTX Cinema booking experience. The system uses a simple but effective keyword matching algorithm to provide instant answers to common questions, with comprehensive logging for continuous improvement. The modular architecture allows for easy maintenance and future enhancements, while the responsive design ensures a consistent experience across all devices.
