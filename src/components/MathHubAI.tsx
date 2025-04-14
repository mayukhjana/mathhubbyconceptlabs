
import React from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MathHubAI: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Sparkles className="mr-2 h-8 w-8 text-mathprimary" />
              MathHub AI
            </h1>
            <p className="text-muted-foreground mt-1">
              Your personal math tutor - Coming Soon!
            </p>
          </div>
        </div>

        <Card className="opacity-50 pointer-events-none">
          <CardHeader>
            <CardTitle className="text-xl">MathHub AI</CardTitle>
            <CardDescription>
              Our AI-powered math tutor is currently being developed
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Sparkles className="h-16 w-16 text-gray-300" />
              <h2 className="text-2xl font-semibold text-gray-600">Coming Soon</h2>
              <p className="text-muted-foreground max-w-md text-center">
                We're working hard to bring you an intelligent AI math tutor. 
                Stay tuned for an amazing learning experience!
              </p>
              <Button variant="outline" disabled>
                AI Tutor Unavailable
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MathHubAI;
