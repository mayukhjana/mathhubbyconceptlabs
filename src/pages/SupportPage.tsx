
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { LifeBuoy, Send, Clock, CheckCircle2, AlertCircle, HelpCircle, User } from "lucide-react";
import LoadingAnimation from "@/components/LoadingAnimation";

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const SupportPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    fetchTickets();
  }, [isAuthenticated, navigate]);
  
  const fetchTickets = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      toast.error('Failed to load support tickets');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitTicket = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!subject || !message) {
      toast.error('Please fill in both subject and message fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase.functions.invoke('submit-support-ticket', {
        body: {
          subject,
          message
        }
      });
      
      if (error) throw error;
      
      toast.success('Support ticket submitted successfully');
      setShowSuccessDialog(true);
      setSubject("");
      setMessage("");
      
      // Refresh the ticket list
      fetchTickets();
      
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast.error('Failed to submit support ticket');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return (
          <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            <Clock size={12} className="mr-1" />
            <span>Open</span>
          </div>
        );
      case 'in progress':
        return (
          <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
            <HelpCircle size={12} className="mr-1" />
            <span>In Progress</span>
          </div>
        );
      case 'resolved':
        return (
          <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            <CheckCircle2 size={12} className="mr-1" />
            <span>Resolved</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
            <AlertCircle size={12} className="mr-1" />
            <span>{status}</span>
          </div>
        );
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <LoadingAnimation />
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <LifeBuoy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Support Center</h1>
              <p className="text-muted-foreground">
                Get help with your studies and account
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="create" className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Submit a Ticket</TabsTrigger>
              <TabsTrigger value="history">Your Tickets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Fill out the form below to get help from our team. We usually respond within 24 hours.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitTicket}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject" 
                        placeholder="Brief description of your issue" 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Please provide as much detail as possible" 
                        className="min-h-[150px]" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto gap-2" 
                      disabled={isSubmitting}
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? "Submitting..." : "Submit Ticket"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Support Tickets</CardTitle>
                  <CardDescription>
                    View the status and history of your support requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tickets.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <LifeBuoy className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Tickets Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't submitted any support tickets yet.
                      </p>
                      <Button variant="outline" onClick={() => document.querySelector('[data-value="create"]')?.click()}>
                        Create Your First Ticket
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tickets.map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="whitespace-nowrap">
                              {format(new Date(ticket.created_at), "PP")}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{ticket.subject}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {ticket.message}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(ticket.status)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Need immediate help?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>For urgent matters, please contact us directly at:</p>
              <p className="mt-2 font-medium">support@mathhub.example.com</p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
      
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ticket Submitted</AlertDialogTitle>
            <AlertDialogDescription>
              Your support ticket has been successfully submitted. Our team will respond to you as soon as possible. You can track the status of your ticket in the "Your Tickets" tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SupportPage;
