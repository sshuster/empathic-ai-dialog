
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateChatResponse } from '../services/ai-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Home } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const ChatExperience: React.FC = () => {
  const { persona, companyInfo, messages, addMessage, isTyping, setIsTyping, resetApp } = useAppContext();
  const [userMessage, setUserMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!userMessage.trim() || isTyping) return;
    
    // Add user message to chat
    addMessage({
      sender: 'user',
      text: userMessage
    });
    
    setUserMessage('');
    
    if (persona) {
      // Simulate persona typing
      setIsTyping(true);
      
      try {
        // Get AI response
        const response = await generateChatResponse(
          userMessage,
          persona,
          companyInfo,
          messages
        );
        
        // Add persona response to chat
        addMessage({
          sender: 'persona',
          text: response
        });
        
        setIsTyping(false);
      } catch (error) {
        console.error('Error generating chat response:', error);
        setIsTyping(false);
        
        toast({
          title: 'Error',
          description: 'Failed to generate a response. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!persona) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col fade-in">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={persona.avatar} alt={persona.name} />
            <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg font-semibold">{persona.name}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(600px-128px)] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-4 py-3 rounded-lg bg-muted">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messageEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Type your reply..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className="flex-1"
          />
          
          <Button
            type="submit"
            disabled={!userMessage.trim() || isTyping}
            className="gap-2"
          >
            <Send size={16} />
            Send
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={resetApp}
            className="gap-2"
          >
            <Home size={16} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatExperience;
