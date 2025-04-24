
import React from 'react';
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

const TutorHomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([]);

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
      const { error } = await supabase
        .from('tutor_applications')
        .insert({
          user_id: user.id,
          full_name: String(formData.get('fullName')),
          education: String(formData.get('education')),
          experience: formData.get('experience') ? String(formData.get('experience')) : null,
          subjects: selectedSubjects
        });

      if (error) throw error;

      toast.success("Application submitted successfully!");
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Apply as a Tutor</CardTitle>
            <CardDescription>
              Join ConceptLabs Academy as a tutor and help students excel in their studies
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default TutorHomePage;
