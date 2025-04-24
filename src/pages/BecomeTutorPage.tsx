
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const BecomeTutorPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology",
    "Computer Science", "English", "History", "Geography"
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    
    setIsSubmitting(true);
    try {
      // First submit the tutor application
      const { error: applicationError } = await supabase
        .from('tutor_applications')
        .insert([{
          user_id: user.id,
          full_name: String(formData.get('fullName')),
          education: String(formData.get('education')),
          experience: formData.get('experience') ? String(formData.get('experience')) : null,
          subjects: selectedSubjects
        }]);

      if (applicationError) throw applicationError;

      // Then update the user's profile to indicate they're now a tutor
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ user_type: 'tutor' })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast.success("Your application has been submitted!");
      toast.info("Your account has been converted to a tutor account.");
      
      // Redirect to tutor page after a brief delay
      setTimeout(() => {
        navigate('/tutor');
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">You must be signed in to become a tutor</h1>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Become a Tutor</CardTitle>
            <CardDescription>
              Convert your student account to a tutor account and help others excel in their studies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="education">Educational Qualifications</Label>
                <Textarea 
                  id="education" 
                  name="education" 
                  placeholder="Enter your educational background"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Teaching Experience (Optional)</Label>
                <Textarea 
                  id="experience" 
                  name="experience" 
                  placeholder="Describe your teaching experience"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Subjects you can teach</Label>
                <div className="grid grid-cols-2 gap-4">
                  {subjects.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox 
                        id={subject}
                        checked={selectedSubjects.includes(subject)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSubjects(prev => [...prev, subject]);
                          } else {
                            setSelectedSubjects(prev => 
                              prev.filter(s => s !== subject)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={subject}>{subject}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                <p className="text-amber-800 dark:text-amber-300 text-sm">
                  <strong>Note:</strong> By submitting this application, your account will be converted to a tutor account.
                  You will still have access to all student features, but will also gain access to tutor-specific features.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Converting Account..." : "Convert to Tutor Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeTutorPage;
