import React, { useState, useEffect } from 'react';
import FloatingChatButton from './FloatingChatButton';
import ChatWindow from './ChatWindow';
import { sanitizeInput } from '../utils/sanitize';
import { API_URL } from '../config';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  // Greeting message
  const greetingMessage = {
    id: 'greeting',
    text: 'Welcome to RTX Cinema 🎬\n\nOur support team is available daily from 10:00 AM to 9:00 PM.\n\nPlease go ahead and share your question — we\'ll be with you shortly to assist.',
    sender: 'bot',
    timestamp: new Date()
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // Add greeting message on first open
    if (!isOpen && !hasGreeted) {
      setMessages([greetingMessage]);
      setHasGreeted(true);
    }
  };

  // Send message to chatbot API
  const sendMessage = async (text) => {
    // Sanitize input
    const sanitizedText = sanitizeInput(text);
    
    // Add user message immediately
    const userMessage = {
      id: `user-${Date.now()}`,
      text: sanitizedText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Wait 800ms before making API call (for typing indicator)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Call chatbot API
      const response = await fetch('${API_URL}/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: sanitizedText })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add bot response
      if (data.success) {
        const botMessage = {
          id: `bot-${Date.now()}`,
          text: data.reply,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Error response
        const errorMessage = {
          id: `bot-error-${Date.now()}`,
          text: data.error || 'Sorry, I\'m having trouble connecting. Please try again.',
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Network error response
      const errorMessage = {
        id: `bot-error-${Date.now()}`,
        text: 'Sorry, I\'m having trouble connecting. Please make sure the backend server is running on http://localhost:5000',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <FloatingChatButton onClick={toggleChat} isOpen={isOpen} />
      <ChatWindow
        isOpen={isOpen}
        messages={messages}
        onClose={toggleChat}
        onSendMessage={sendMessage}
        isTyping={isTyping}
      />
    </>
  );
};

export default ChatbotWidget;
