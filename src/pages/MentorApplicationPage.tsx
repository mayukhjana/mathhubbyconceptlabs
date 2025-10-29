import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, FileText, Loader2, GraduationCap } from 'lucide-react';
import { z } from 'zod';

const mentorSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  qualification: z.string().trim().min(5, 'Qualification must be at least 5 characters').max(200, 'Qualification must be less than 200 characters'),
  schoolPast: z.string().trim().min(10, 'Please provide detailed information about your educational background').max(500, 'This field must be less than 500 characters'),
  specialization: z.string().trim().min(3, 'Specialization must be at least 3 characters').max(100, 'Specialization must be less than 100 characters'),
  hourlyRate: z.number().min(100, 'Hourly rate must be at least ₹100').max(10000, 'Hourly rate must be less than ₹10,000'),
  experience: z.number().min(0, 'Experience cannot be negative').max(50, 'Experience must be less than 50 years'),
  bio: z.string().trim().min(50, 'Bio must be at least 50 characters').max(1000, 'Bio must be less than 1000 characters'),
});

const MentorApplicationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    qualification: '',
    schoolPast: '',
    specialization: '',
    hourlyRate: '',
    experience: '',
    bio: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Only PDF, JPG, and PNG files are allowed');
        return;
      }
      setDocument(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to apply');
      navigate('/auth');
      return;
    }

    if (!document) {
      toast.error('Please upload a verification document');
      return;
    }

    // Validate form
    try {
      const validated = mentorSchema.parse({
        fullName: formData.fullName,
        qualification: formData.qualification,
        schoolPast: formData.schoolPast,
        specialization: formData.specialization,
        hourlyRate: parseFloat(formData.hourlyRate),
        experience: parseInt(formData.experience),
        bio: formData.bio,
      });

      setLoading(true);

      // Upload document first
      const fileExt = document.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('mentor-documents')
        .upload(fileName, document);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('mentor-documents')
        .getPublicUrl(fileName);

      // Update profile with full name
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: validated.fullName,
        });

      // Submit application
      const { error: insertError } = await supabase
        .from('teachers')
        .insert({
          user_id: user.id,
          specialization: validated.specialization,
          hourly_rate: validated.hourlyRate,
          bio: validated.bio,
          experience_years: validated.experience,
          qualification: validated.qualification,
          school_past: validated.schoolPast,
          documents_url: publicUrl,
          verification_status: 'pending',
        });

      if (insertError) throw insertError;

      toast.success('Application submitted successfully! We will review it shortly.');
      navigate('/mentorships');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error('Please fix the errors in the form');
      } else {
        console.error('Error submitting application:', error);
        toast.error(error.message || 'Failed to submit application');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Apply to be a Mentor - MathHub</title>
        <meta name="description" content="Join MathHub as a mentor and help students excel in mathematics. Share your expertise and earn while teaching." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-primary rounded-full mb-4">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Apply to be a Mentor</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Share your knowledge and help students succeed. Fill out the application below to join our community of educators.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Mentor Application Form</CardTitle>
                <CardDescription>All fields are required. Your application will be reviewed by our admin team.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      maxLength={100}
                      required
                    />
                    {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input
                      id="qualification"
                      value={formData.qualification}
                      onChange={(e) => handleInputChange('qualification', e.target.value)}
                      placeholder="e.g., M.Sc. Mathematics, B.Ed."
                      maxLength={200}
                      required
                    />
                    {errors.qualification && <p className="text-sm text-destructive">{errors.qualification}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolPast">Educational Background</Label>
                    <Textarea
                      id="schoolPast"
                      value={formData.schoolPast}
                      onChange={(e) => handleInputChange('schoolPast', e.target.value)}
                      placeholder="Describe your educational background, schools/colleges attended, and relevant achievements..."
                      maxLength={500}
                      rows={4}
                      required
                    />
                    {errors.schoolPast && <p className="text-sm text-destructive">{errors.schoolPast}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        placeholder="e.g., Algebra, Calculus"
                        maxLength={100}
                        required
                      />
                      {errors.specialization && <p className="text-sm text-destructive">{errors.specialization}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="0"
                        min="0"
                        max="50"
                        required
                      />
                      {errors.experience && <p className="text-sm text-destructive">{errors.experience}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                      placeholder="500"
                      min="100"
                      max="10000"
                      required
                    />
                    {errors.hourlyRate && <p className="text-sm text-destructive">{errors.hourlyRate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself, your teaching philosophy, and what makes you a great mentor..."
                      maxLength={1000}
                      rows={6}
                      required
                    />
                    {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
                    <p className="text-xs text-muted-foreground">{formData.bio.length}/1000 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document">Verification Document</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <input
                        id="document"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="document" className="cursor-pointer">
                        {document ? (
                          <div className="flex items-center justify-center gap-2 text-primary">
                            <FileText className="h-6 w-6" />
                            <span className="font-medium">{document.name}</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload your qualification certificate or ID proof
                            </p>
                            <p className="text-xs text-muted-foreground">PDF, JPG, or PNG (max 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MentorApplicationPage;
