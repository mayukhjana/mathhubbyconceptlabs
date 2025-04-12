
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle } from "lucide-react";
import LoadingAnimation from "@/components/LoadingAnimation";

type SupportTicket = {
  id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

const SupportTicket = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  
  const supportForm = useForm({
    defaultValues: {
      subject: "",
      message: ""
    }
  });

  const handleSubmitSupportTicket = async (values: { subject: string; message: string }) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to submit a ticket");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`https://gpzoytysrrormkmytmyk.supabase.co/functions/v1/submit-support-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(values)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit support ticket");
      }
      
      toast.success("Support ticket submitted successfully");
      supportForm.reset();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to submit support ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Need Help?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our support team is here to assist you. Submit a ticket and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="mr-2 text-mathprimary" />
                Submit Support Ticket
              </CardTitle>
              <CardDescription>
                {isAuthenticated 
                  ? "Tell us what you need help with and we'll respond promptly." 
                  : "Please sign in to submit a support ticket."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isAuthenticated ? (
                <div className="text-center py-4">
                  <Button asChild>
                    <a href="/auth">Sign In to Submit Ticket</a>
                  </Button>
                </div>
              ) : (
                <Form {...supportForm}>
                  <form
                    onSubmit={supportForm.handleSubmit(handleSubmitSupportTicket)}
                    className="space-y-4"
                  >
                    <FormField
                      control={supportForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief description of your issue" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={supportForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe your issue in detail..." {...field} rows={5} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <LoadingAnimation size="sm" /> : "Submit Ticket"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SupportTicket;
