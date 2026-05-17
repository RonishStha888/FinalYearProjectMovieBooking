import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import './ChatWindow.css';

const ChatWindow = ({ isOpen, messages, onClose, onSendMessage, isTyping }) => {
  if (!isOpen) return null;

  const handleExpand = () => {
    // Toggle fullscreen mode
    const chatWindow = document.querySelector('.chat-window');
    if (chatWindow) {
      chatWindow.classList.toggle('fullscreen');
    }
  };

  return (
    <div className="chat-window-overlay">
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <ChatHeader onClose={onClose} onExpand={handleExpand} />
        <MessageList messages={messages} isTyping={isTyping} />
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
