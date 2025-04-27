
import React, { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { History, CalendarClock, Clock, User, Bot, Sparkles, TrashIcon } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ChatSession, Message } from "./types";

interface ChatHistoryProps {
  chatSessions: ChatSession[];
  clearHistory: () => void;
  loadMoreHistory: () => void;
  showAllHistory: boolean;
  isPremium: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatSessions,
  clearHistory,
  loadMoreHistory,
  showAllHistory,
  isPremium,
}) => {
  const historyEndRef = useRef<HTMLDivElement>(null);

  const formatSessionDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };

  const renderMessageContent = (message: Message) => {
    if (message.role === 'assistant') {
      return (
        <div className="math-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      );
    } else {
      return (
        <>
          <div>{message.content}</div>
          {message.image && (
            <div className="mt-2 max-w-[200px]">
              {typeof message.image === 'string' && message.image !== 'image' && (
                <img 
                  src={message.image} 
                  alt="Uploaded" 
                  className="rounded-md max-h-[200px] object-contain"
                />
              )}
              {message.image === 'image' && (
                <div className="p-2 bg-black/10 rounded text-sm text-center">
                  [Image attached]
                </div>
              )}
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <ScrollArea className="h-[500px] pr-4">
        {chatSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <History className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">
              No chat history found. Start a new conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {chatSessions.map((session) => (
              <div key={session.date} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">{formatSessionDate(session.date)}</h3>
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {session.messages.length / 2} conversations
                  </div>
                </div>
                
                {session.messages.reduce<React.ReactNode[]>((pairs, message, index) => {
                  if (index % 2 === 0 && index < session.messages.length - 1) {
                    const userMessage = message;
                    const aiMessage = session.messages[index + 1];
                    
                    pairs.push(
                      <Card key={userMessage.id} className="border border-muted">
                        <CardContent className="p-4 space-y-4">
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarFallback className="bg-mathprimary text-white">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="font-medium mb-1">You</div>
                                <div className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {format(new Date(userMessage.created_at), 'h:mm a')}
                                </div>
                              </div>
                              {renderMessageContent(userMessage)}
                            </div>
                          </div>
                          
                          <div className="border-t border-border my-2" />
                          
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarImage src="/lovable-uploads/0cfac2ed-f408-4c67-81fa-bb01eb283ca8.png" />
                              <AvatarFallback className="bg-muted">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="font-medium mb-1">MathHub AI</div>
                                <div className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {format(new Date(aiMessage.created_at), 'h:mm a')}
                                </div>
                              </div>
                              {renderMessageContent(aiMessage)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                  return pairs;
                }, [])}
              </div>
            ))}
            
            {!isPremium && !showAllHistory && chatSessions.length >= 5 && (
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={loadMoreHistory}
                  className="flex items-center"
                >
                  <Sparkles className="h-4 w-4 mr-2 text-mathprimary" />
                  Upgrade to Premium for Full History
                </Button>
              </div>
            )}
            <div ref={historyEndRef} />
          </div>
        )}
      </ScrollArea>
      
      {chatSessions.length > 0 && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={clearHistory} 
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Clear All History
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
