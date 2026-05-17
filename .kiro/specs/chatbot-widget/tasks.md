# Implementation Plan

- [x] 1. Set up database models and seed data


  - Create FAQ model with Mongoose schema (question, answer, keywords fields)
  - Create ChatLog model with Mongoose schema (userMessage, matchedFaqId, createdAt fields)
  - Create database seed script with 10 default FAQ entries
  - Add text index on FAQ keywords field for faster searches
  - _Requirements: 5.1, 5.2, 5.3_

- [ ]* 1.1 Write property test for FAQ CRUD operations
  - **Property 16: FAQ CRUD operations**
  - **Validates: Requirements 5.4, 5.5**



- [ ] 2. Implement backend chatbot service and API
  - [ ] 2.1 Create ChatbotService class with keyword matching logic
    - Implement tokenizeMessage() method to lowercase and split messages
    - Implement calculateScore() method for keyword overlap scoring
    - Implement findBestMatch() method to find highest scoring FAQ
    - Implement getFallbackMessage() method
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 2.2 Write property test for message tokenization
  - **Property 10: Message tokenization**
  - **Validates: Requirements 4.1**

- [ ]* 2.3 Write property test for keyword overlap scoring
  - **Property 12: Keyword overlap scoring**
  - **Validates: Requirements 4.3**

- [x]* 2.4 Write property test for matched FAQ response


  - **Property 13: Matched FAQ response**
  - **Validates: Requirements 4.4**

- [ ] 2.5 Create ChatLogService class for logging
  - Implement logInteraction() method to save chat logs
  - Implement getCommonQuestions() analytics method
  - Implement getUnmatchedQuestions() analytics method
  - _Requirements: 4.6, 4.7, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 2.6 Write property test for chat interaction logging
  - **Property 14: Chat interaction logging**
  - **Validates: Requirements 4.6**

- [ ]* 2.7 Write property test for log timestamp recording
  - **Property 15: Log timestamp recording**
  - **Validates: Requirements 4.7, 7.4**

- [ ]* 2.8 Write property test for message logging completeness
  - **Property 17: Message logging completeness**
  - **Validates: Requirements 7.1**

- [ ]* 2.9 Write property test for matched FAQ ID logging
  - **Property 18: Matched FAQ ID logging**
  - **Validates: Requirements 7.2**



- [ ]* 2.10 Write property test for analytics query functionality
  - **Property 19: Analytics query functionality**
  - **Validates: Requirements 7.5**

- [ ] 2.11 Create POST /api/chatbot endpoint
  - Implement route handler to receive user messages
  - Call ChatbotService to find matching FAQ
  - Call ChatLogService to log interaction
  - Return bot response with matched FAQ ID
  - Add input validation and error handling
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ]* 2.12 Write unit tests for chatbot API endpoint
  - Test with valid messages
  - Test with empty/invalid messages


  - Test response format and status codes
  - Test error handling

- [ ] 3. Checkpoint - Ensure backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Create frontend chat widget components
  - [ ] 4.1 Create FloatingChatButton component
    - Implement button with teal-green gradient styling
    - Add chat icon


    - Add bounce animation using CSS keyframes
    - Position fixed at bottom-right (24px from edges)
    - Add onClick handler to toggle chat
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x]* 4.2 Write property test for chat button visibility


  - **Property 1: Chat button visibility**
  - **Validates: Requirements 1.1, 1.2**

- [ ] 4.3 Create ChatHeader component
  - Add dark purple gradient background
  - Display cinema logo on top-left
  - Display "Chatbot" title
  - Add green "Online" indicator dot
  - Add expand and close (X) icons on top-right
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 4.4 Create MessageBubble component
  - Accept props: text, sender ('user' | 'bot'), timestamp
  - Render left-aligned gray bubble for bot messages
  - Render right-aligned purple bubble for user messages
  - Display timestamp below bubble
  - _Requirements: 3.3, 3.6, 3.7_



- [ ]* 4.5 Write property test for message display
  - **Property 3: Message display**
  - **Validates: Requirements 3.3**

- [ ]* 4.6 Write property test for bot response display
  - **Property 6: Bot response display**


  - **Validates: Requirements 3.6**

- [ ]* 4.7 Write property test for message timestamps
  - **Property 7: Message timestamps**
  - **Validates: Requirements 3.7**

- [ ] 4.8 Create TypingIndicator component
  - Implement animated three-dot indicator
  - Use CSS animation for pulsing effect
  - _Requirements: 3.4_

- [ ]* 4.9 Write property test for typing indicator timing
  - **Property 4: Typing indicator timing**
  - **Validates: Requirements 3.4**



- [ ] 4.10 Create MessageList component
  - Accept props: messages array, isTyping boolean
  - Render scrollable container for messages
  - Map over messages to render MessageBubble components
  - Show TypingIndicator when isTyping is true
  - Implement auto-scroll to bottom on new messages using useRef and useEffect


  - _Requirements: 3.7, 3.8, 3.9_

- [ ]* 4.11 Write property test for message area scrolling
  - **Property 8: Message area scrolling**
  - **Validates: Requirements 3.8**

- [ ]* 4.12 Write property test for auto-scroll on new message
  - **Property 9: Auto-scroll on new message**
  - **Validates: Requirements 3.9**

- [x] 4.13 Create ChatInput component


  - Implement input field with placeholder "Write a message..."
  - Add paperclip icon (left side)
  - Add emoji icon (right side)
  - Add send button or Enter key handler
  - Prevent empty message submission

  - Trim whitespace from messages
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 4.14 Create ChatWindow component

  - Accept props: isOpen, messages, onClose, onSendMessage, isTyping
  - Render modal container (~380px wide, ~500px tall)
  - Include ChatHeader, MessageList, and ChatInput as children
  - Add slide-up and fade animation for open/close
  - Position fixed on screen
  - _Requirements: 2.1, 2.6, 2.7, 2.8_

- [ ]* 4.15 Write property test for chat window toggle
  - **Property 2: Chat window toggle**
  - **Validates: Requirements 1.5, 2.8**

- [ ] 5. Implement ChatbotWidget container component
  - [x] 5.1 Set up component state

    - Add isOpen state (boolean) for chat window visibility
    - Add messages state (array) for chat history
    - Add inputValue state (string) for current input
    - Add isTyping state (boolean) for typing indicator
    - _Requirements: 1.5, 2.8, 3.3, 3.4_



- [ ] 5.2 Implement toggleChat method
  - Toggle isOpen state
  - If opening for first time, add greeting message to messages array
  - _Requirements: 1.5, 2.6_

- [ ] 5.3 Implement sendMessage method
  - Add user message to messages array immediately
  - Set isTyping to true

  - Call API endpoint POST /api/chatbot with message
  - Wait 800ms before processing response
  - Add bot response to messages array
  - Set isTyping to false

  - Handle API errors gracefully
  - _Requirements: 3.3, 3.4, 3.5, 3.6_

- [ ]* 5.4 Write property test for API call on message send
  - **Property 5: API call on message send**
  - **Validates: Requirements 3.5**

- [x] 5.5 Render FloatingChatButton and ChatWindow

  - Pass isOpen state to both components
  - Pass toggleChat to FloatingChatButton onClick
  - Pass messages, isTyping, and sendMessage to ChatWindow
  - _Requirements: 1.1, 1.5, 2.1, 2.8_


- [ ] 6. Integrate ChatbotWidget into application
  - [ ] 6.1 Add ChatbotWidget to App.jsx or base layout component
    - Import ChatbotWidget component
    - Render ChatbotWidget at root level (outside main content)
    - Ensure it appears on all user-facing pages
    - _Requirements: 8.1, 8.2_

- [ ]* 6.2 Write property test for widget presence across pages
  - **Property 20: Widget presence across pages**
  - **Validates: Requirements 8.2**


- [ ] 6.3 Add z-index styling to ensure widget stays on top
  - Set z-index to high value (e.g., 9999)
  - Ensure widget doesn't interfere with existing page elements
  - _Requirements: 8.3, 8.5_


- [ ] 6.4 Apply color palette and typography
  - Use header gradient (#4a0e6e → #8b2fc9)
  - Use button gradient (#00c9a7 → #00e5c0)

  - Use bot bubble color (#f0f0f0)
  - Use user bubble color (#6c3fc5)
  - Apply DM Sans or Poppins font family
  - _Requirements: 8.4_

- [ ] 7. Implement mobile responsive design
  - [ ] 7.1 Add media queries for mobile viewport
    - Make chat window full-width minus padding on mobile
    - Adjust font sizes for readability
    - Ensure touch-friendly spacing (min 44px touch targets)
    - _Requirements: 6.1, 6.2, 6.3, 6.4_



- [ ] 7.2 Test keyboard handling on mobile
  - Ensure input field adjusts when keyboard appears


  - Test on iOS and Android if possible
  - _Requirements: 6.5_



- [ ]* 7.3 Write unit tests for mobile responsiveness
  - Test button visibility on mobile viewport
  - Test chat window layout on mobile viewport
  - Test input field behavior with keyboard

- [ ] 8. Add error handling and edge cases
  - [ ] 8.1 Handle API request failures
    - Display error message to user
    - Log error to console
    - Allow user to retry
    - _Requirements: 3.5, 3.6_

- [ ] 8.2 Handle network timeouts
  - Set 10-second timeout for API requests
  - Show timeout message with fallback contact info
    - _Requirements: 3.5_

- [ ] 8.3 Validate user input
  - Prevent empty message submission
  - Trim whitespace from messages
  - Sanitize HTML/script tags for security
  - _Requirements: 3.3_

- [ ]* 8.4 Write unit tests for error handling
  - Test API failure scenarios
  - Test timeout scenarios
  - Test input validation

- [ ] 9. Implement security measures
  - [ ] 9.1 Add input sanitization
    - Escape HTML and script tags in user messages
    - Use DOMPurify or similar library
    - _Requirements: 3.3_

- [ ] 9.2 Add rate limiting to backend
  - Limit to 10 messages per user per minute
  - Return 429 status when limit exceeded
    - _Requirements: 4.1_

- [ ] 9.3 Configure CORS headers
  - Allow requests from frontend domain only
  - Set proper CORS configuration in Express
    - _Requirements: 4.1_

- [ ] 10. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. End-to-end testing and polish
  - [ ] 11.1 Test complete chat flow
    - Open chat widget
    - Send various messages
    - Verify correct FAQ matches
    - Verify fallback message for unmatched queries
    - Verify logging in database
    - _Requirements: 1.1, 1.5, 3.3, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 11.2 Test on multiple pages
  - Verify widget appears on homepage
  - Verify widget appears on booking page
  - Verify widget appears on profile page
  - Verify widget state persists across page navigation
  - _Requirements: 8.2_

- [ ] 11.3 Test mobile responsiveness
  - Test on various mobile devices/emulators
  - Verify layout adapts correctly
  - Verify touch interactions work smoothly
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 11.4 Write integration tests for end-to-end flow
  - Test complete user journey from opening chat to receiving response
  - Test FAQ matching accuracy with known questions
  - Test logging completeness

- [ ] 11.5 Performance optimization
  - Verify animations are smooth (60fps)
  - Check API response times
  - Optimize bundle size if needed
  - _Requirements: 1.4, 1.5, 2.8_

- [ ] 11.6 Accessibility audit
  - Test keyboard navigation
  - Test with screen reader
  - Verify ARIA labels
  - Check color contrast ratios
  - _Requirements: 1.1, 1.5, 2.1, 3.1_

- [ ] 12. Enhance button visibility and styling
  - [ ] 12.1 Verify and enhance header button visibility
    - Ensure close (X) button is clearly visible with white icon on header background
    - Ensure expand button is clearly visible with white icon
    - Verify button hover states provide clear visual feedback
    - Ensure minimum 32px touch target size
    - Test button contrast ratios meet accessibility standards
    - _Requirements: 9.1, 9.2, 9.3, 9.5, 9.7_
  
  - [ ] 12.2 Verify and enhance send button visibility
    - Ensure send button has prominent gradient background (#D84040 to #ff5252)
    - Verify paper plane icon is white and clearly visible
    - Test hover effect (scale and shadow)
    - Ensure disabled state is visually distinct
    - Verify 36px circular size
    - _Requirements: 9.4, 9.5, 9.6_
  
  - [ ] 12.3 Verify input area button visibility
    - Ensure attach and emoji buttons are visible
    - Test hover states for all input buttons
    - Verify proper spacing between buttons
    - _Requirements: 9.5, 9.6_
  
  - [ ] 12.4 Test button interactions across devices
    - Test on desktop with mouse hover
    - Test on mobile with touch interactions
    - Verify all buttons work correctly
    - _Requirements: 9.5, 9.7_
