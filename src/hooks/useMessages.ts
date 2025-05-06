
import { useState, useEffect, useCallback } from 'react';
import { webSocketService, Conversation, Message } from '@/services/webSocketService';

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await webSocketService.getConversations();
        setConversations(data);
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    };
    
    loadConversations();
  }, []);
  
  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedConversation) return;
    
    const loadMessages = async () => {
      setLoading(true);
      try {
        const data = await webSocketService.getMessages(selectedConversation);
        setMessages(data);
        await webSocketService.markAsRead(selectedConversation);
        
        // Update unread count in conversations
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation 
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
  }, [selectedConversation]);
  
  // Listen for new messages and typing status
  useEffect(() => {
    const handleNewMessage = (data: { conversationId: string, message: Message }) => {
      // Update messages if this is the selected conversation
      if (data.conversationId === selectedConversation) {
        setMessages(prev => [...prev, data.message]);
        webSocketService.markAsRead(data.conversationId);
      } else {
        // Update unread count for other conversations
        setConversations(prev => 
          prev.map(conv => 
            conv.id === data.conversationId 
              ? { 
                  ...conv, 
                  lastMessage: data.message.content,
                  lastMessageTimestamp: data.message.timestamp,
                  unreadCount: conv.unreadCount + 1 
                }
              : conv
          )
        );
      }
    };
    
    const handleTyping = (data: { conversationId: string, isTyping: boolean }) => {
      if (data.conversationId === selectedConversation) {
        setIsTyping(data.isTyping);
      }
    };
    
    webSocketService.addEventListener('message', handleNewMessage);
    webSocketService.addEventListener('typing', handleTyping);
    
    return () => {
      webSocketService.removeEventListener('message', handleNewMessage);
      webSocketService.removeEventListener('typing', handleTyping);
    };
  }, [selectedConversation]);
  
  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!selectedConversation || !content.trim()) return;
    
    try {
      const newMessage = await webSocketService.sendMessage(selectedConversation, content);
      
      // Update conversations list with the new message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation 
            ? { 
                ...conv, 
                lastMessage: content,
                lastMessageTimestamp: newMessage.timestamp
              }
            : conv
        )
      );
      
      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }, [selectedConversation]);
  
  // Start typing
  const startTyping = useCallback(() => {
    if (!selectedConversation) return;
    webSocketService.setTypingStatus(selectedConversation, true);
  }, [selectedConversation]);
  
  // Stop typing
  const stopTyping = useCallback(() => {
    if (!selectedConversation) return;
    webSocketService.setTypingStatus(selectedConversation, false);
  }, [selectedConversation]);
  
  // Start a new conversation
  const startConversation = useCallback(async (userId: string, userName: string, userAvatar: string) => {
    try {
      const newConversation = await webSocketService.startConversation(userId, userName, userAvatar);
      setConversations(prev => [newConversation, ...prev]);
      return newConversation;
    } catch (error) {
      console.error('Error starting conversation:', error);
      return null;
    }
  }, []);
  
  // Format message timestamp
  const formatMessageTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today, show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // This week, show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older, show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }, []);
  
  return {
    conversations,
    messages,
    isTyping,
    loading,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
    startTyping,
    stopTyping,
    startConversation,
    formatMessageTime
  };
}
