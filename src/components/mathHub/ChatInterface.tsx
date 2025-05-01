import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, User, Bot } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Message } from "./types";
interface ChatInterfaceProps {
  messages: Message[];
  messagesEndRef?: React.RefObject<HTMLDivElement>;
}
const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  messagesEndRef
}) => {
  // Add useEffect to automatically scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages, messagesEndRef]);
  const renderMessageContent = (message: Message) => {
    if (message.role === 'assistant') {
      return <div className="math-content">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
            {message.content}
          </ReactMarkdown>
        </div>;
    } else {
      return <>
          <div>{message.content}</div>
          {message.image && <div className="mt-2 max-w-[200px]">
              {typeof message.image === 'string' && message.image !== 'image' && <img src={message.image} alt="Uploaded" className="rounded-md max-h-[200px] object-contain" />}
              {message.image === 'image' && <div className="p-2 bg-black/10 rounded text-sm text-center">
                  [Image attached]
                </div>}
            </div>}
        </>;
    }
  };
  return <div className="h-[400px] border rounded-lg p-4 relative bg-muted/30">
      <ScrollArea className="h-full pr-4">
        {messages.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">
              No conversation history yet. Ask your first math question!
            </p>
          </div> : <div className="flex flex-col space-y-4 pb-2">
            {messages.map(message => <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg p-4 max-w-[85%] ${message.role === 'user' ? 'bg-mathprimary text-white ml-12' : 'bg-muted mr-12'}`}>
                  {message.role === 'assistant' ? <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage className="object-fill" src="https://cdn.britannica.com/07/266507-050-095F46AB/Publicity-still-scene-The-Wild-Robot-movie.jpg" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="mb-1 font-medium">MathHub AI</div>
                        {renderMessageContent(message)}
                      </div>
                    </div> : <div>
                      <div className="mb-1 font-medium">You</div>
                      {renderMessageContent(message)}
                    </div>}
                </div>
              </div>)}
            {messagesEndRef && <div ref={messagesEndRef} className="h-1" />}
          </div>}
      </ScrollArea>
    </div>;
};
export default ChatInterface;