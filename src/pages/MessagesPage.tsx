
import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMessages } from '@/hooks/useMessages';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Loader2 } from 'lucide-react';

const MessagesPage = () => {
  const {
    conversations,
    messages,
    isTyping,
    loading,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
    startTyping,
    stopTyping,
    formatMessageTime
  } = useMessages();
  
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when conversation changes
  useEffect(() => {
    if (selectedConversation && !loading) {
      inputRef.current?.focus();
    }
  }, [selectedConversation, loading]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;
    
    setSendingMessage(true);
    try {
      await sendMessage(messageInput);
      setMessageInput('');
    } finally {
      setSendingMessage(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    startTyping();
  };
  
  const handleInputBlur = () => {
    stopTyping();
  };
  
  // Get active conversation details
  const activeConversation = selectedConversation 
    ? conversations.find(c => c.id === selectedConversation) 
    : null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">Messages</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle>Conversations</CardTitle>
                <CardDescription>Chat with idea sellers and investors</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(80vh-12rem)]">
                  {conversations.length === 0 ? (
                    <div className="px-4 py-6 text-center text-muted-foreground">
                      <MessageCircle className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
                      <p>No conversations yet</p>
                      <p className="text-sm">Start messaging by contacting an idea seller or investor</p>
                    </div>
                  ) : (
                    <div>
                      {conversations.map(conversation => (
                        <div 
                          key={conversation.id}
                          onClick={() => setSelectedConversation(conversation.id)}
                          className={`px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                            selectedConversation === conversation.id ? 'bg-gray-100' : ''
                          }`}
                        >
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={conversation.participantAvatar} alt={conversation.participantName} />
                            <AvatarFallback>{conversation.participantName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="font-medium text-sm truncate">{conversation.participantName}</p>
                              <span className="text-xs text-muted-foreground">
                                {formatMessageTime(conversation.lastMessageTimestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="rounded-full h-5 w-5 p-0 flex items-center justify-center">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Messages */}
            <Card className="lg:col-span-2">
              {selectedConversation ? (
                <div className="flex flex-col h-[calc(80vh-8rem)]">
                  {/* Conversation Header */}
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={activeConversation?.participantAvatar} alt={activeConversation?.participantName} />
                        <AvatarFallback>{activeConversation?.participantName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{activeConversation?.participantName}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {/* Messages List */}
                  <ScrollArea className="flex-grow p-4">
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-start gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[250px]" />
                              <Skeleton className="h-4 w-[200px]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        {messages.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-4">
                            <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="font-medium text-lg mb-1">No messages yet</h3>
                            <p className="text-muted-foreground">
                              Send your first message to {activeConversation?.participantName}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {messages.map(message => (
                              <div 
                                key={message.id}
                                className={`flex ${message.senderId === 'u1' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className="flex items-start gap-2 max-w-[80%]">
                                  {message.senderId !== 'u1' && (
                                    <Avatar className="h-8 w-8 mt-0.5">
                                      <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                                      <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                  )}
                                  
                                  <div className={`space-y-1 ${message.senderId === 'u1' ? 'order-first' : ''}`}>
                                    <div 
                                      className={`rounded-lg py-2 px-3 ${
                                        message.senderId === 'u1' 
                                          ? 'bg-idea-primary text-white' 
                                          : 'bg-gray-100'
                                      }`}
                                    >
                                      {message.content}
                                    </div>
                                    <div className="flex justify-end">
                                      <span className="text-xs text-muted-foreground">
                                        {formatMessageTime(message.timestamp)}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {message.senderId === 'u1' && (
                                    <Avatar className="h-8 w-8 mt-0.5">
                                      <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                                      <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                  )}
                                </div>
                              </div>
                            ))}
                            
                            {isTyping && (
                              <div className="flex items-center gap-2">
                                <div className="bg-gray-100 rounded-lg py-2 px-4">
                                  <div className="flex space-x-1">
                                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                  </div>
                                </div>
                                <span className="text-xs text-muted-foreground">Typing...</span>
                              </div>
                            )}
                            
                            <div ref={messageEndRef} />
                          </div>
                        )}
                      </>
                    )}
                  </ScrollArea>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                      <Input
                        ref={inputRef}
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        disabled={loading || sendingMessage}
                        className="flex-grow"
                        autoComplete="off"
                      />
                      <Button
                        type="submit" 
                        size="icon" 
                        disabled={!messageInput.trim() || loading || sendingMessage}
                      >
                        {sendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="h-[calc(80vh-8rem)] flex flex-col items-center justify-center text-center p-8">
                  <MessageCircle className="h-16 w-16 text-muted-foreground/30 mb-6" />
                  <h2 className="text-2xl font-semibold mb-2">Select a Conversation</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Choose a conversation from the list to start messaging, or initiate a new conversation from an idea page.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MessagesPage;
