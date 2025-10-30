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
import { Upload, FileText, Loader2, GraduationCap, Plus, X } from 'lucide-react';
import { z } from 'zod';

const mentorSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  qualification: z.string().trim().min(5, 'Qualification must be at least 5 characters').max(200),
  schoolPast: z.string().trim().min(10, 'Educational background must be at least 10 characters').max(500),
  currentCompany: z.string().trim().max(200).optional(),
  specialization: z.string().trim().min(3, 'Specialization must be at least 3 characters').max(100),
  hourlyRate: z.number().min(100, 'Hourly rate must be at least ₹100').max(10000),
  experience: z.number().min(0, 'Experience cannot be negative').max(50),
  bio: z.string().trim().min(50, 'Bio must be at least 50 characters').max(1000),
  aboutMentor: z.string().trim().min(100, 'About section must be at least 100 characters').max(2000),
  linkedIn: z.string().trim().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  facebook: z.string().trim().url('Please enter a valid Facebook URL').optional().or(z.literal('')),
  instagram: z.string().trim().url('Please enter a valid Instagram URL').optional().or(z.literal('')),
  twitter: z.string().trim().url('Please enter a valid Twitter URL').optional().or(z.literal('')),
  achievements: z.string().trim().max(500).optional(),
  topics: z.array(z.string()).min(1, 'Add at least one topic you can teach'),
  languages: z.array(z.string()).min(1, 'Add at least one language'),
});

interface EducationEntry {
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
}

interface ExperienceEntry {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

const MentorApplicationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    qualification: '',
    schoolPast: '',
    currentCompany: '',
    specialization: '',
    hourlyRate: '',
    experience: '',
    bio: '',
    aboutMentor: '',
    linkedIn: '',
    facebook: '',
    instagram: '',
    twitter: '',
    achievements: '',
  });

  const [topics, setTopics] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState('');
  
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);
  
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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTopic = () => {
    if (currentTopic.trim() && !topics.includes(currentTopic.trim())) {
      setTopics([...topics, currentTopic.trim()]);
      setCurrentTopic('');
    }
  };

  const removeTopic = (topic: string) => {
    setTopics(topics.filter(t => t !== topic));
  };

  const addLanguage = () => {
    if (currentLanguage.trim() && !languages.includes(currentLanguage.trim())) {
      setLanguages([...languages, currentLanguage.trim()]);
      setCurrentLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter(l => l !== lang));
  };

  const addEducation = () => {
    setEducation([...education, {
      institutionName: '',
      degree: '',
      fieldOfStudy: '',
      startYear: '',
      endYear: ''
    }]);
  };

  const updateEducation = (index: number, field: keyof EducationEntry, value: string) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setExperience([...experience, {
      companyName: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false
    }]);
  };

  const updateExperience = (index: number, field: keyof ExperienceEntry, value: string | boolean) => {
    const updated = [...experience];
    if (field === 'isCurrent') {
      updated[index][field] = value as boolean;
    } else {
      updated[index][field] = value as string;
    }
    setExperience(updated);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
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

    if (topics.length === 0) {
      toast.error('Add at least one topic you can teach');
      return;
    }

    if (languages.length === 0) {
      toast.error('Add at least one language you speak');
      return;
    }

    try {
      const validated = mentorSchema.parse({
        fullName: formData.fullName,
        qualification: formData.qualification,
        schoolPast: formData.schoolPast,
        currentCompany: formData.currentCompany || undefined,
        specialization: formData.specialization,
        hourlyRate: parseFloat(formData.hourlyRate),
        experience: parseInt(formData.experience),
        bio: formData.bio,
        aboutMentor: formData.aboutMentor,
        linkedIn: formData.linkedIn || undefined,
        facebook: formData.facebook || undefined,
        instagram: formData.instagram || undefined,
        twitter: formData.twitter || undefined,
        achievements: formData.achievements || undefined,
        topics,
        languages,
      });

      setLoading(true);

      // Upload document
      const fileExt = document.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('mentor-documents')
        .upload(fileName, document);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('mentor-documents')
        .getPublicUrl(fileName);

      // Update profile
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: validated.fullName,
        });

      // Insert teacher record
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .insert({
          user_id: user.id,
          specialization: validated.specialization,
          hourly_rate: validated.hourlyRate,
          bio: validated.bio,
          about_mentor: validated.aboutMentor,
          experience_years: validated.experience,
          qualification: validated.qualification,
          school_past: validated.schoolPast,
          current_company: validated.currentCompany || null,
          linkedin_url: validated.linkedIn || null,
          facebook_url: validated.facebook || null,
          instagram_url: validated.instagram || null,
          twitter_url: validated.twitter || null,
          achievements: validated.achievements || null,
          topics: validated.topics,
          languages: validated.languages,
          documents_url: publicUrl,
          verification_status: 'pending',
        })
        .select()
        .single();

      if (teacherError) throw teacherError;

      // Insert education entries
      if (education.length > 0) {
        const educationRecords = education.filter(edu => 
          edu.institutionName && edu.degree
        ).map(edu => ({
          teacher_id: teacherData.id,
          institution_name: edu.institutionName,
          degree: edu.degree,
          field_of_study: edu.fieldOfStudy || null,
          start_year: edu.startYear ? parseInt(edu.startYear) : null,
          end_year: edu.endYear ? parseInt(edu.endYear) : null,
        }));

        if (educationRecords.length > 0) {
          await supabase.from('teacher_education').insert(educationRecords);
        }
      }

      // Insert experience entries
      if (experience.length > 0) {
        const experienceRecords = experience.filter(exp => 
          exp.companyName && exp.position && exp.startDate
        ).map(exp => ({
          teacher_id: teacherData.id,
          company_name: exp.companyName,
          position: exp.position,
          start_date: exp.startDate,
          end_date: exp.isCurrent ? null : exp.endDate || null,
          is_current: exp.isCurrent,
        }));

        if (experienceRecords.length > 0) {
          await supabase.from('teacher_experience').insert(experienceRecords);
        }
      }

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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-primary rounded-full mb-4">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Apply to be a Mentor</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Share your knowledge and help students succeed. Fill out the comprehensive application below.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Mentor Application</CardTitle>
                <CardDescription>Complete all sections to help us understand your expertise</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="qualification">Highest Qualification *</Label>
                        <Input
                          id="qualification"
                          value={formData.qualification}
                          onChange={(e) => handleInputChange('qualification', e.target.value)}
                          placeholder="e.g., M.Sc. Mathematics, B.Ed."
                          required
                        />
                        {errors.qualification && <p className="text-sm text-destructive">{errors.qualification}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schoolPast">Educational Background *</Label>
                      <Textarea
                        id="schoolPast"
                        value={formData.schoolPast}
                        onChange={(e) => handleInputChange('schoolPast', e.target.value)}
                        placeholder="Describe your educational journey, achievements, and background..."
                        rows={3}
                        required
                      />
                      {errors.schoolPast && <p className="text-sm text-destructive">{errors.schoolPast}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentCompany">Current Company/Institution</Label>
                        <Input
                          id="currentCompany"
                          value={formData.currentCompany}
                          onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                          placeholder="e.g., ABC School, XYZ Coaching"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization *</Label>
                        <Input
                          id="specialization"
                          value={formData.specialization}
                          onChange={(e) => handleInputChange('specialization', e.target.value)}
                          placeholder="e.g., Algebra, Calculus"
                          required
                        />
                        {errors.specialization && <p className="text-sm text-destructive">{errors.specialization}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience *</Label>
                        <Input
                          id="experience"
                          type="number"
                          value={formData.experience}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                          min="0"
                          required
                        />
                        {errors.experience && <p className="text-sm text-destructive">{errors.experience}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate">Hourly Rate (₹) *</Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          value={formData.hourlyRate}
                          onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                          min="100"
                          placeholder="500"
                          required
                        />
                        {errors.hourlyRate && <p className="text-sm text-destructive">{errors.hourlyRate}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Topics & Languages */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Topics & Languages</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="topics">Topics You Can Teach *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="topics"
                          value={currentTopic}
                          onChange={(e) => setCurrentTopic(e.target.value)}
                          placeholder="e.g., Algebra, JEE Preparation"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                        />
                        <Button type="button" onClick={addTopic} size="icon">
                          <Plus size={16} />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {topics.map(topic => (
                          <div key={topic} className="bg-primary/10 px-3 py-1 rounded-full flex items-center gap-2">
                            <span className="text-sm">{topic}</span>
                            <button type="button" onClick={() => removeTopic(topic)} className="text-destructive">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="languages">Languages You're Fluent In *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="languages"
                          value={currentLanguage}
                          onChange={(e) => setCurrentLanguage(e.target.value)}
                          placeholder="e.g., English, Hindi, Bengali"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                        />
                        <Button type="button" onClick={addLanguage} size="icon">
                          <Plus size={16} />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {languages.map(lang => (
                          <div key={lang} className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2">
                            <span className="text-sm">{lang}</span>
                            <button type="button" onClick={() => removeLanguage(lang)} className="text-destructive">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Education History */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="text-lg font-semibold">Education History</h3>
                      <Button type="button" onClick={addEducation} size="sm" variant="outline">
                        <Plus size={16} className="mr-1" /> Add Education
                      </Button>
                    </div>
                    
                    {education.map((edu, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Education #{index + 1}</h4>
                          <Button type="button" onClick={() => removeEducation(index)} size="sm" variant="ghost">
                            <X size={16} />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Institution Name</Label>
                            <Input
                              value={edu.institutionName}
                              onChange={(e) => updateEducation(index, 'institutionName', e.target.value)}
                              placeholder="e.g., IIT Delhi"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Degree</Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                              placeholder="e.g., B.Tech, M.Sc."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Field of Study</Label>
                            <Input
                              value={edu.fieldOfStudy}
                              onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                              placeholder="e.g., Mathematics"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label>Start Year</Label>
                              <Input
                                type="number"
                                value={edu.startYear}
                                onChange={(e) => updateEducation(index, 'startYear', e.target.value)}
                                placeholder="2018"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>End Year</Label>
                              <Input
                                type="number"
                                value={edu.endYear}
                                onChange={(e) => updateEducation(index, 'endYear', e.target.value)}
                                placeholder="2022"
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Work Experience */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="text-lg font-semibold">Work Experience</h3>
                      <Button type="button" onClick={addExperience} size="sm" variant="outline">
                        <Plus size={16} className="mr-1" /> Add Experience
                      </Button>
                    </div>
                    
                    {experience.map((exp, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Experience #{index + 1}</h4>
                          <Button type="button" onClick={() => removeExperience(index)} size="sm" variant="ghost">
                            <X size={16} />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input
                              value={exp.companyName}
                              onChange={(e) => updateExperience(index, 'companyName', e.target.value)}
                              placeholder="e.g., Unstop, KPMG"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Position</Label>
                            <Input
                              value={exp.position}
                              onChange={(e) => updateExperience(index, 'position', e.target.value)}
                              placeholder="e.g., Program Manager"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                              value={exp.startDate}
                              onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                              placeholder="e.g., Jan 2020"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                              value={exp.endDate}
                              onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                              placeholder="e.g., Dec 2022"
                              disabled={exp.isCurrent}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`current-${index}`}
                              checked={exp.isCurrent}
                              onChange={(e) => updateExperience(index, 'isCurrent', e.target.checked)}
                              className="rounded"
                            />
                            <Label htmlFor={`current-${index}`}>Currently working here</Label>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* About & Bio */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">About You</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aboutMentor">About Mentor (Detailed) *</Label>
                      <Textarea
                        id="aboutMentor"
                        value={formData.aboutMentor}
                        onChange={(e) => handleInputChange('aboutMentor', e.target.value)}
                        placeholder="Write a detailed description about yourself, your expertise, teaching methodology, and what makes you unique as a mentor..."
                        rows={6}
                        required
                      />
                      {errors.aboutMentor && <p className="text-sm text-destructive">{errors.aboutMentor}</p>}
                      <p className="text-xs text-muted-foreground">{formData.aboutMentor.length}/2000 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Short Bio (For Card Display) *</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="A brief introduction for your mentor card..."
                        rows={3}
                        required
                      />
                      {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
                      <p className="text-xs text-muted-foreground">{formData.bio.length}/1000 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="achievements">Achievements & Awards</Label>
                      <Textarea
                        id="achievements"
                        value={formData.achievements}
                        onChange={(e) => handleInputChange('achievements', e.target.value)}
                        placeholder="List your notable achievements, awards, certifications..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Social Media Links</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                        <Input
                          id="linkedIn"
                          type="url"
                          value={formData.linkedIn}
                          onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                        {errors.linkedIn && <p className="text-sm text-destructive">{errors.linkedIn}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook Profile</Label>
                        <Input
                          id="facebook"
                          type="url"
                          value={formData.facebook}
                          onChange={(e) => handleInputChange('facebook', e.target.value)}
                          placeholder="https://facebook.com/yourprofile"
                        />
                        {errors.facebook && <p className="text-sm text-destructive">{errors.facebook}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram Profile</Label>
                        <Input
                          id="instagram"
                          type="url"
                          value={formData.instagram}
                          onChange={(e) => handleInputChange('instagram', e.target.value)}
                          placeholder="https://instagram.com/yourprofile"
                        />
                        {errors.instagram && <p className="text-sm text-destructive">{errors.instagram}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter/X Profile</Label>
                        <Input
                          id="twitter"
                          type="url"
                          value={formData.twitter}
                          onChange={(e) => handleInputChange('twitter', e.target.value)}
                          placeholder="https://twitter.com/yourprofile"
                        />
                        {errors.twitter && <p className="text-sm text-destructive">{errors.twitter}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Verification Document *</h3>
                    
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
                              Click to upload qualification certificate or ID proof
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
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Application...
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