import React from 'react';
import './FloatingChatButton.css';

const FloatingChatButton = ({ onClick, isOpen }) => {
  if (isOpen) return null; // Hide button when chat is open

  return (
    <button 
      className="floating-chat-button"
      onClick={onClick}
      aria-label="Open live chat"
    >
      <svg 
        className="chat-icon" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span className="button-text">LIVE CHAT</span>
    </button>
  );
};

export default FloatingChatButton;
