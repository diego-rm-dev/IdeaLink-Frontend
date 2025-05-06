
// Mock implementation of WebSocket service for frontend development

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participantId: 's2',
    participantName: 'Maria Garcia',
    participantAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    lastMessage: 'I have some questions about your AI-powered app idea',
    lastMessageTimestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    unreadCount: 2
  },
  {
    id: 'conv2',
    participantId: 's3',
    participantName: 'David Kim',
    participantAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    lastMessage: 'Would you consider selling a partial stake in your idea?',
    lastMessageTimestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
    unreadCount: 0
  },
  {
    id: 'conv3',
    participantId: 's4',
    participantName: 'Sarah Wilson',
    participantAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    lastMessage: 'Thank you for considering my investment proposal',
    lastMessageTimestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    unreadCount: 0
  }
];

// Mock messages for each conversation
const mockMessages: Record<string, Message[]> = {
  'conv1': [
    {
      id: 'msg1',
      senderId: 's2',
      senderName: 'Maria Garcia',
      senderAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      receiverId: 'u1',
      content: 'Hello! I saw your idea about the AI-powered plant health monitoring app.',
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      isRead: true
    },
    {
      id: 'msg2',
      senderId: 'u1',
      senderName: 'Alex Johnson',
      senderAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      receiverId: 's2',
      content: 'Hi Maria! Thanks for your interest. What would you like to know?',
      timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
      isRead: true
    },
    {
      id: 'msg3',
      senderId: 's2',
      senderName: 'Maria Garcia',
      senderAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      receiverId: 'u1',
      content: 'I\'m wondering about the technical feasibility. Have you already built a prototype or is this just at the concept stage?',
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
      isRead: true
    },
    {
      id: 'msg4',
      senderId: 's2',
      senderName: 'Maria Garcia',
      senderAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      receiverId: 'u1',
      content: 'Also, I have some questions about your AI-powered app idea and potential market size.',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      isRead: false
    }
  ],
  'conv2': [
    {
      id: 'msg5',
      senderId: 's3',
      senderName: 'David Kim',
      senderAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      receiverId: 'u1',
      content: 'I like your smart home energy optimization system. Very innovative!',
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      isRead: true
    },
    {
      id: 'msg6',
      senderId: 'u1',
      senderName: 'Alex Johnson',
      senderAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      receiverId: 's3',
      content: 'Thank you, David! I\'ve been working on that concept for almost a year.',
      timestamp: new Date(Date.now() - 23 * 3600000).toISOString(),
      isRead: true
    },
    {
      id: 'msg7',
      senderId: 's3',
      senderName: 'David Kim', 
      senderAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      receiverId: 'u1',
      content: 'Would you consider selling a partial stake in your idea? I might be interested in investing rather than buying it outright.',
      timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
      isRead: true
    }
  ],
  'conv3': [
    {
      id: 'msg8',
      senderId: 'u1',
      senderName: 'Alex Johnson',
      senderAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      receiverId: 's4',
      content: 'Hi Sarah, I saw you\'re interested in my VR physical therapy platform.',
      timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
      isRead: true
    },
    {
      id: 'msg9',
      senderId: 's4',
      senderName: 'Sarah Wilson',
      senderAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      receiverId: 'u1',
      content: 'Yes! I think it has great potential in the healthcare sector.',
      timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
      isRead: true
    },
    {
      id: 'msg10',
      senderId: 'u1',
      senderName: 'Alex Johnson',
      senderAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      receiverId: 's4',
      content: 'I\'m looking for an investment of $50k for 15% equity. Would that interest you?',
      timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
      isRead: true
    },
    {
      id: 'msg11',
      senderId: 's4',
      senderName: 'Sarah Wilson',
      senderAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      receiverId: 'u1',
      content: 'Thank you for considering my investment proposal. Let me review the details and get back to you tomorrow.',
      timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
      isRead: true
    }
  ]
};

class WebSocketService {
  private listeners: {[key: string]: Function[]} = {};
  private typing: {[key: string]: boolean} = {};
  
  // In a real implementation, this would connect to a WebSocket server
  constructor() {
    console.log('WebSocket service initialized');
    // Simulate WebSocket connection
  }
  
  // Get all conversations for the current user
  getConversations(): Promise<Conversation[]> {
    // In a real app, this would fetch from the server
    return Promise.resolve([...mockConversations]);
  }
  
  // Get messages for a specific conversation
  getMessages(conversationId: string): Promise<Message[]> {
    // In a real app, this would fetch from the server
    return Promise.resolve(mockMessages[conversationId] || []);
  }
  
  // Send a message
  sendMessage(conversationId: string, content: string): Promise<Message> {
    // In a real app, this would send through WebSocket
    const newMessage: Message = {
      id: 'msg' + Date.now(),
      senderId: 'u1', // Current user
      senderName: 'Alex Johnson',
      senderAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      receiverId: mockConversations.find(c => c.id === conversationId)?.participantId || '',
      content,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    // Add to mock data
    if (!mockMessages[conversationId]) {
      mockMessages[conversationId] = [];
    }
    mockMessages[conversationId].push(newMessage);
    
    // Update last message in conversation
    const conversationIndex = mockConversations.findIndex(c => c.id === conversationId);
    if (conversationIndex >= 0) {
      mockConversations[conversationIndex].lastMessage = content;
      mockConversations[conversationIndex].lastMessageTimestamp = newMessage.timestamp;
    }
    
    // Notify listeners
    this.notifyListeners('message', { conversationId, message: newMessage });
    
    return Promise.resolve(newMessage);
  }
  
  // Start a new conversation
  startConversation(userId: string, userName: string, userAvatar: string): Promise<Conversation> {
    // In a real app, this would create a conversation on the server
    const newConversation: Conversation = {
      id: 'conv' + Date.now(),
      participantId: userId,
      participantName: userName,
      participantAvatar: userAvatar,
      lastMessage: '',
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    };
    
    mockConversations.unshift(newConversation);
    mockMessages[newConversation.id] = []; 
    
    return Promise.resolve(newConversation);
  }
  
  // Mark messages as read
  markAsRead(conversationId: string): Promise<void> {
    // In a real app, this would send a read receipt
    if (mockMessages[conversationId]) {
      mockMessages[conversationId].forEach(msg => {
        if (msg.receiverId === 'u1') {
          msg.isRead = true;
        }
      });
    }
    
    // Update unread count
    const conversationIndex = mockConversations.findIndex(c => c.id === conversationId);
    if (conversationIndex >= 0) {
      mockConversations[conversationIndex].unreadCount = 0;
    }
    
    return Promise.resolve();
  }
  
  // Set typing status
  setTypingStatus(conversationId: string, isTyping: boolean): void {
    // In a real app, this would send through WebSocket
    this.typing[conversationId] = isTyping;
    this.notifyListeners('typing', { conversationId, isTyping });
  }
  
  // Get typing status
  getTypingStatus(conversationId: string): boolean {
    return this.typing[conversationId] || false;
  }
  
  // Add event listener
  addEventListener(event: string, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  // Remove event listener
  removeEventListener(event: string, callback: Function): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }
  
  // Notify listeners
  private notifyListeners(event: string, data: any): void {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
