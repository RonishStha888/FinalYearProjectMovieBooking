# Requirements Document

## Introduction

This document specifies the requirements for a Live Chat/FAQ Chatbot Widget that provides automated customer support for the RTX Cinema booking website. The feature includes a floating chat button, an expandable chat interface, an intelligent FAQ matching system, and comprehensive logging for analytics. The chatbot assists users with common questions about booking, payments, cancellations, and cinema information.

## Glossary

- **Chatbot Widget**: The complete floating chat interface including the collapsed button and expanded chat window
- **Floating Chat Button**: A fixed-position button in the bottom-right corner that opens the chat interface
- **Chat Window**: The expanded modal interface where users interact with the chatbot
- **FAQ System**: The backend knowledge base containing questions, answers, and keywords for matching user queries
- **Keyword Matching**: An algorithm that scores user messages against FAQ keywords to find the best answer
- **Chat Logs**: Database records of all user interactions for analytics and improvement
- **Bot Message**: A message displayed from the chatbot (left-aligned, gray bubble)
- **User Message**: A message sent by the user (right-aligned, purple bubble)
- **Typing Indicator**: An animated visual cue showing the bot is "thinking" or processing
- **Fallback Message**: The default response when no FAQ match is found
- **Message Bubble**: A styled container for displaying individual chat messages
- **Greeting Message**: The initial welcome message displayed when the chat opens
- **Online Indicator**: A visual dot showing the chatbot is active/available

## Requirements

### Requirement 1

**User Story:** As a website visitor, I want to access a chat widget from any page, so that I can quickly get help without navigating away from my current task.

#### Acceptance Criteria

1. WHEN a user loads any page of the website THEN the system SHALL display a floating "LIVE CHAT" button in the bottom-right corner
2. WHEN the floating button is displayed THEN the system SHALL position it at 24px from the bottom and 24px from the right
3. WHEN the floating button is displayed THEN the system SHALL style it as a teal-green gradient pill shape with a chat icon
4. WHEN the floating button is idle THEN the system SHALL apply a subtle bounce animation to attract attention
5. WHEN a user clicks the floating button THEN the system SHALL expand the chat window with a smooth slide-up and fade animation

### Requirement 2

**User Story:** As a user, I want to see a welcoming chat interface when I open the chatbot, so that I understand how to use it and when support is available.

#### Acceptance Criteria

1. WHEN the chat window opens THEN the system SHALL display a header with dark purple gradient background
2. WHEN the chat window header is displayed THEN the system SHALL show the cinema logo on the top-left
3. WHEN the chat window header is displayed THEN the system SHALL show "Chatbot" as the title
4. WHEN the chat window header is displayed THEN the system SHALL show a green "Online" indicator dot
5. WHEN the chat window header is displayed THEN the system SHALL show expand and close icons on the top-right
6. WHEN the chat window opens THEN the system SHALL display a greeting message stating "Welcome to RTX Cinema 🎬 Our support team is available daily from 10:00 AM to 9:00 PM. Please go ahead and share your question — we'll be with you shortly to assist."
7. WHEN the chat window is displayed THEN the system SHALL size it at approximately 380px wide and 500px tall
8. WHEN a user clicks the close icon THEN the system SHALL collapse the chat window with a smooth animation

### Requirement 3

**User Story:** As a user, I want to send messages to the chatbot and receive relevant answers, so that I can get quick help with my questions.

#### Acceptance Criteria

1. WHEN the chat window is open THEN the system SHALL display an input field at the bottom with placeholder text "Write a message..."
2. WHEN the input field is displayed THEN the system SHALL show a paperclip icon and emoji icon
3. WHEN a user types a message and presses Enter or clicks send THEN the system SHALL display the user's message as a right-aligned purple bubble
4. WHEN a user message is sent THEN the system SHALL display a typing indicator with animated dots for 800 milliseconds
5. WHEN the typing indicator is shown THEN the system SHALL send the message to the chatbot API endpoint
6. WHEN the chatbot API returns a response THEN the system SHALL display the bot's reply as a left-aligned gray bubble
7. WHEN messages are displayed THEN the system SHALL show timestamps on each message
8. WHEN multiple messages exist THEN the system SHALL make the message area scrollable
9. WHEN new messages are added THEN the system SHALL auto-scroll to the bottom of the message area

### Requirement 4

**User Story:** As a user, I want the chatbot to understand my questions and provide accurate answers from the FAQ database, so that I can get immediate help without waiting for human support.

#### Acceptance Criteria

1. WHEN the backend receives a user message THEN the system SHALL lowercase and tokenize the message into keywords
2. WHEN the message is tokenized THEN the system SHALL search the FAQs table for matching keywords
3. WHEN searching FAQs THEN the system SHALL calculate a keyword overlap score for each FAQ entry
4. WHEN a FAQ match is found with score greater than zero THEN the system SHALL return the corresponding answer
5. WHEN NO FAQ match is found THEN the system SHALL return the fallback message "Sorry, I don't have an answer for that. Please contact us via call or WhatsApp us at 9828999454 for further assistance!"
6. WHEN the chatbot processes a message THEN the system SHALL log the user message and matched FAQ ID to the chat_logs table
7. WHEN logging chat interactions THEN the system SHALL record the timestamp of each interaction

### Requirement 5

**User Story:** As a cinema administrator, I want to manage FAQ entries in a database, so that I can easily update chatbot responses without modifying code.

#### Acceptance Criteria

1. WHEN the system is initialized THEN the system SHALL create a faqs table with columns for id, question, answer, and keywords
2. WHEN the faqs table is created THEN the system SHALL populate it with default FAQ entries covering booking, payments, cancellations, seats, discounts, timings, tickets, groups, parking, and food
3. WHEN the system is initialized THEN the system SHALL create a chat_logs table with columns for id, user_message, matched_faq_id, and created_at
4. WHEN an administrator adds a new FAQ THEN the system SHALL store the question, answer, and comma-separated keywords
5. WHEN an administrator updates an FAQ THEN the system SHALL immediately reflect the changes in chatbot responses

### Requirement 6

**User Story:** As a mobile user, I want the chat widget to work properly on my device, so that I can get support regardless of screen size.

#### Acceptance Criteria

1. WHEN a user views the chat widget on a mobile device THEN the system SHALL display the floating button in the bottom-right corner
2. WHEN the chat window opens on a mobile device THEN the system SHALL expand to full-width minus padding
3. WHEN the chat window is displayed on mobile THEN the system SHALL maintain proper spacing for touch interactions
4. WHEN messages are displayed on mobile THEN the system SHALL ensure text remains readable and bubbles are appropriately sized
5. WHEN the input field is focused on mobile THEN the system SHALL adjust the layout to accommodate the on-screen keyboard

### Requirement 7

**User Story:** As a cinema administrator, I want to analyze chatbot usage and identify gaps in the FAQ database, so that I can improve the chatbot's effectiveness over time.

#### Acceptance Criteria

1. WHEN a user sends a message THEN the system SHALL log the complete message text to the chat_logs table
2. WHEN a FAQ match is found THEN the system SHALL log the matched FAQ ID in the chat_logs table
3. WHEN NO FAQ match is found THEN the system SHALL log NULL for the matched_faq_id field
4. WHEN logging chat interactions THEN the system SHALL automatically record the timestamp
5. WHEN an administrator queries chat_logs THEN the system SHALL provide data showing which questions are most common and which have no matches

### Requirement 8

**User Story:** As a developer, I want the chatbot widget to integrate seamlessly with the existing RTX Cinema application, so that it works consistently across all pages without conflicts.

#### Acceptance Criteria

1. WHEN the chatbot widget is implemented THEN the system SHALL include it in the base layout or App component
2. WHEN the chatbot widget is rendered THEN the system SHALL ensure it appears on all user-facing pages
3. WHEN the chatbot widget is displayed THEN the system SHALL use z-index positioning to stay above other page content
4. WHEN the chatbot widget is styled THEN the system SHALL use the existing color palette (purple gradient header, teal-green button, purple user bubbles)
5. WHEN the chatbot widget is implemented THEN the system SHALL not interfere with existing page functionality or navigation

### Requirement 9

**User Story:** As a user, I want to clearly see and interact with all chatbot control buttons, so that I can easily close, expand, or send messages without confusion.

#### Acceptance Criteria

1. WHEN the chat header is displayed THEN the system SHALL show visible close and expand buttons with clear icons
2. WHEN the close button is displayed THEN the system SHALL render an X icon with sufficient contrast against the header background
3. WHEN the expand button is displayed THEN the system SHALL render a maximize/fullscreen icon with sufficient contrast
4. WHEN the send button is displayed THEN the system SHALL render a paper plane icon with the primary brand color
5. WHEN any button is hovered THEN the system SHALL provide visual feedback through color change or scale transformation
6. WHEN the input area is displayed THEN the system SHALL show the send button prominently on the right side
7. WHEN buttons are rendered THEN the system SHALL ensure minimum touch target size of 32px for mobile usability
