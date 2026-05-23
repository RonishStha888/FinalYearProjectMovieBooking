import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import './ChatWindow.css';

const ChatWindow = ({ isOpen, messages, onClose, onSendMessage, isTyping }) => {
  const [showQuickActions, setShowQuickActions] = useState(false);

  if (!isOpen) return null;

  const handleExpand = () => {
    // Toggle fullscreen mode
    const chatWindow = document.querySelector('.chat-window');
    if (chatWindow) {
      chatWindow.classList.toggle('fullscreen');
    }
  };

  const toggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
  };

  // Quick action buttons with pre-defined questions
  const quickActions = [
    { id: 1, icon: '🎫', label: 'Book Tickets', question: 'How do I book tickets?' },
    { id: 2, icon: '💳', label: 'Payment', question: 'What payment methods do you accept?' },
    { id: 3, icon: '🪑', label: 'Seat Selection', question: 'How do I select seats?' },
    { id: 4, icon: '🎁', label: 'Offers', question: 'Do you have any discounts or offers?' },
    { id: 5, icon: '🕐', label: 'Timings', question: 'What are your cinema timings?' },
    { id: 6, icon: '🍿', label: 'Food & Drinks', question: 'Do you have food and beverages?' }
  ];

  const handleQuickAction = (question) => {
    onSendMessage(question);
    setShowQuickActions(false);
  };

  return (
    <div className="chat-window-overlay">
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <ChatHeader 
          onClose={onClose} 
          onExpand={handleExpand}
          onToggleQuickActions={toggleQuickActions}
          showQuickActions={showQuickActions}
        />
        
        {/* Quick Actions Panel */}
        <div className={`chat-quick-actions ${showQuickActions ? 'visible' : ''}`}>
          <div className="quick-actions-header">
            <span>Quick Questions</span>
            <button 
              className="quick-actions-close"
              onClick={toggleQuickActions}
              aria-label="Close quick actions"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map(action => (
              <button
                key={action.id}
                className="quick-action-btn"
                onClick={() => handleQuickAction(action.question)}
                title={action.question}
              >
                <span className="quick-action-icon">{action.icon}</span>
                <span className="quick-action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <MessageList messages={messages} isTyping={isTyping} showQuickActions={showQuickActions} />
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
