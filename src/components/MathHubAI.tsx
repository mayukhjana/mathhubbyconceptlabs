
import React, { useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ChatInterface from "./mathHub/ChatInterface";
import ChatInputForm from "./mathHub/ChatInputForm";
import ChatHistory from "./mathHub/ChatHistory";
import MathHubHeader from "./mathHub/MathHubHeader";
import { useChat } from "@/hooks/useChat";

const MathHubAI: React.FC = () => {
  const {
    question,
    setQuestion,
    imagePreview,
    isLoading,
    messages,
    chatSessions,
    dailyQuestionsCount,
    error,
    showAllHistory,
    isPremium,
    handleImageUpload,
    removeImage,
    handleSubmit,
    clearHistory,
    loadMoreHistory,
    startNewChat,
    refreshChatHistory
  } = useChat();

  const [activeTab, setActiveTab] = React.useState("new-chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  // Update this useEffect to also refresh chat history when switching to history tab
  React.useEffect(() => {
    if (activeTab === "new-chat" && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    } else if (activeTab === "history" && historyEndRef.current) {
      refreshChatHistory();
      setTimeout(() => {
        historyEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  }, [messages, chatSessions, activeTab, refreshChatHistory]);

  // Add handler for tab change to refresh history and save current chat if needed
  const handleTabChange = (value: string) => {
    // If switching from new-chat to history, save the current chat first
    if (activeTab === "new-chat" && value === "history" && messages.length > 0) {
      // We don't need to explicitly save the chat as it's saved when messages are exchanged
      // But we do need to refresh the history to show the latest conversations
    }
    
    setActiveTab(value);
    
    if (value === "history") {
      refreshChatHistory();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4 max-w-5xl mx-auto">
        <MathHubHeader 
          remainingQuestions={dailyQuestionsCount} 
          isPremium={isPremium} 
        />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="new-chat">New Chat</TabsTrigger>
            <TabsTrigger value="history">Chat History</TabsTrigger>
          </TabsList>

          <TabsContent value="new-chat">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Math AI Assistant</CardTitle>
                    <CardDescription>
                      Ask any math question or upload a math problem image
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={startNewChat} 
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    New Chat
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <ChatInterface 
                    messages={messages} 
                    messagesEndRef={messagesEndRef}
                  />
                  <ChatInputForm 
                    question={question}
                    setQuestion={setQuestion}
                    imagePreview={imagePreview}
                    handleImageUpload={handleImageUpload}
                    removeImage={removeImage}
                    handleSubmit={handleSubmit}
                    clearHistory={clearHistory}
                    isLoading={isLoading}
                    hasMessages={messages.length > 0}
                    isPremium={isPremium}
                    remainingQuestions={5 - dailyQuestionsCount}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Chat History</CardTitle>
                <CardDescription>
                  {isPremium 
                    ? "Access all your previous conversations" 
                    : "Free users can view up to 5 days of chat history"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatHistory 
                  chatSessions={chatSessions}
                  clearHistory={clearHistory}
                  loadMoreHistory={loadMoreHistory}
                  showAllHistory={showAllHistory}
                  isPremium={isPremium}
                  historyEndRef={historyEndRef}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MathHubAI;
