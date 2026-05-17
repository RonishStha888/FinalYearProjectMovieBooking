import React from 'react';
import './ChatHeader.css';

const ChatHeader = ({ onClose, onExpand }) => {
  return (
    <div className="chat-header">
      <div className="header-left">
        <div className="cinema-logo">
          <span className="logo-text">RTX</span>
        </div>
        <div className="header-info">
          <h3 className="header-title">Chatbot</h3>
          <div className="online-status">
            <span className="online-dot"></span>
            <span className="online-text">Online</span>
          </div>
        </div>
      </div>
      
      <div className="header-right">
        <button 
          className="header-button expand-button" 
          onClick={onExpand}
          aria-label="Expand chat"
          title="Expand"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </button>
        
        <button 
          className="header-button close-button" 
          onClick={onClose}
          aria-label="Close chat"
          title="Close"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
