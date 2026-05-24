import React, { useState } from 'react';
import './ChatInput.css';

const ChatInput = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedValue = inputValue.trim();
    
    // Prevent empty message submission
    if (trimmedValue.length === 0) {
      return;
    }
    
    onSendMessage(trimmedValue);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <button 
        type="button" 
        className="input-icon-button"
        aria-label="Attach file"
        title="Attach file"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
        </svg>
      </button>
      
      <input
        type="text"
        className="message-input"
        placeholder="Write a message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        aria-label="Type your message"
      />
      
      <button 
        type="submit" 
        className="send-button"
        aria-label="Send message"
        title="Send"
        disabled={inputValue.trim().length === 0}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
        <span className="button-label">Send</span>
      </button>
    </form>
  );
};

export default ChatInput;
