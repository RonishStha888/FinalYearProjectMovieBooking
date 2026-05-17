import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ text, sender, timestamp }) => {
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className={`message-bubble ${sender === 'user' ? 'user-message' : 'bot-message'}`}>
      <div className="bubble-content">
        <p className="message-text">{text}</p>
      </div>
      <span className="message-timestamp">{formatTime(timestamp)}</span>
    </div>
  );
};

export default MessageBubble;
