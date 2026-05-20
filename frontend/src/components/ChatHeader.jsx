import React from 'react';
import './ChatHeader.css';

const ChatHeader = ({ onClose, onExpand, onToggleQuickActions, showQuickActions }) => {
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
          className={`header-button quick-actions-toggle ${showQuickActions ? 'active' : ''}`}
          onClick={onToggleQuickActions}
          aria-label="Toggle quick actions"
          title="Quick Questions"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <circle cx="12" cy="12" r="2"/>
            <circle cx="12" cy="5" r="2"/>
            <circle cx="12" cy="19" r="2"/>
          </svg>
        </button>
        
        <button 
          className="header-button expand-button" 
          onClick={onExpand}
          aria-label="Expand chat"
          title="Expand"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M21 3h-6v2h3.59l-4.3 4.29 1.42 1.42L20 6.41V10h2V3zM3 21h6v-2H5.41l4.3-4.29-1.42-1.42L4 17.59V14H2v7z"/>
          </svg>
        </button>
        
        <button 
          className="header-button close-button" 
          onClick={onClose}
          aria-label="Close chat"
          title="Close"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
