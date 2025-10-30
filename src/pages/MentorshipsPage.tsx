import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Users, Star, Briefcase, Clock, User, Heart, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Teacher {
  id: string;
  user_id: string;
  specialization: string;
  hourly_rate: number;
  bio: string | null;
  experience_years: number | null;
  qualification?: string | null;
  current_company?: string | null;
  about_mentor?: string | null;
  topics?: string[] | null;
  languages?: string[] | null;
  linkedin_url?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  twitter_url?: string | null;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  average_rating?: number;
  review_count?: number;
}

const MentorshipsPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [entranceExamFilter, setEntranceExamFilter] = useState<string>('all');
  const [chapterFilter, setChapterFilter] = useState<string>('all');

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (teachers.length > 0 && !selectedTeacher) {
      setSelectedTeacher(teachers[0]);
    }
  }, [teachers]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      
      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select('*')
        .eq('verification_status', 'approved')
        .order('created_at', { ascending: false });

      if (teachersError) throw teachersError;

      const teachersWithDetails = await Promise.all(
        (teachersData || []).map(async (teacher) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', teacher.user_id)
            .single();

          const { data: reviews } = await supabase
            .from('teacher_reviews')
            .select('rating')
            .eq('teacher_id', teacher.id);

          const reviewCount = reviews?.length || 0;
          const averageRating = reviewCount > 0
            ? reviews!.reduce((sum, review) => sum + review.rating, 0) / reviewCount
            : 0;

          return {
            ...teacher,
            profiles: profile || { full_name: null, avatar_url: null },
            average_rating: averageRating,
            review_count: reviewCount
          };
        })
      );

      setTeachers(teachersWithDetails);
    } catch (error: any) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const searchLower = searchQuery.toLowerCase();
    const name = teacher.profiles?.full_name?.toLowerCase() || '';
    const specialization = teacher.specialization.toLowerCase();
    return name.includes(searchLower) || specialization.includes(searchLower);
  });

  const isTopMentor = selectedTeacher && selectedTeacher.average_rating! >= 4.5 && selectedTeacher.review_count! >= 10;

  return (
    <>
      <Helmet>
        <title>Find a Mentor - MathHub</title>
        <meta name="description" content="Connect with experienced teachers and mentors to help you excel in mathematics. Browse profiles, read reviews, and find the perfect tutor for your needs." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Find Your Perfect Mentor</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Connect with experienced teachers who can guide you to success.
              </p>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={entranceExamFilter} onValueChange={setEntranceExamFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Entrance Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entrance Exams</SelectItem>
                    <SelectItem value="jee">JEE</SelectItem>
                    <SelectItem value="neet">NEET</SelectItem>
                    <SelectItem value="cat">CAT</SelectItem>
                    <SelectItem value="gate">GATE</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={chapterFilter} onValueChange={setChapterFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chapters</SelectItem>
                    <SelectItem value="algebra">Algebra</SelectItem>
                    <SelectItem value="calculus">Calculus</SelectItem>
                    <SelectItem value="geometry">Geometry</SelectItem>
                    <SelectItem value="trigonometry">Trigonometry</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="text"
                  placeholder="Search by name or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="text-center py-20">
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No teachers found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search criteria' : 'Be the first to join as a mentor!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side - Teacher Cards List */}
                <div className="lg:col-span-1 space-y-4 max-h-[800px] overflow-y-auto pr-2">
                  {filteredTeachers.map((teacher) => (
                    <Card 
                      key={teacher.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${selectedTeacher?.id === teacher.id ? 'border-primary border-2' : ''}`}
                      onClick={() => setSelectedTeacher(teacher)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="h-16 w-16 border-2 border-primary/10">
                              <AvatarImage src={teacher.profiles?.avatar_url || undefined} />
                              <AvatarFallback className="bg-primary/10">
                                <User className="h-8 w-8 text-primary" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg truncate">{teacher.profiles?.full_name || 'Teacher'}</h3>
                              {teacher.average_rating! >= 4.5 && teacher.review_count! >= 10 && (
                                <Badge className="bg-amber-500 text-white text-xs">Top</Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="h-3 w-3 fill-green-600 text-green-600" />
                              <span className="font-bold text-sm">{teacher.average_rating?.toFixed(1)}</span>
                              <span className="text-xs text-muted-foreground">({teacher.review_count} Reviews)</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <Clock className="h-3 w-3" />
                              <span>{teacher.experience_years || 0} years</span>
                              <span>•</span>
                              <Briefcase className="h-3 w-3" />
                              <span className="truncate">{teacher.specialization}</span>
                            </div>
                            
                            {teacher.current_company && (
                              <p className="text-xs text-muted-foreground truncate">
                                {teacher.current_company}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Right Side - Selected Teacher Details */}
                {selectedTeacher && (
                  <div className="lg:col-span-2">
                    <Card className="overflow-hidden">
                      <CardContent className="p-6">
                        {/* Profile Header */}
                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                          <div className="relative flex-shrink-0">
                            <Avatar className="h-32 w-32 border-4 border-primary/10">
                              <AvatarImage src={selectedTeacher.profiles?.avatar_url || undefined} />
                              <AvatarFallback className="bg-primary/10">
                                <User className="h-16 w-16 text-primary" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Available</Badge>
                                  <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                                    <Star className="h-4 w-4 fill-green-600 text-green-600" />
                                    <span className="font-bold text-green-700 dark:text-green-400">{selectedTeacher.average_rating?.toFixed(1)}</span>
                                  </div>
                                  {isTopMentor && (
                                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white">⭐ Top Mentor</Badge>
                                  )}
                                </div>
                                <h2 className="text-3xl font-bold mb-2">{selectedTeacher.profiles?.full_name || 'Teacher'}</h2>
                              </div>
                              <Button variant="ghost" size="icon">
                                <Heart className="h-5 w-5" />
                              </Button>
                            </div>
                            
                            <p className="text-muted-foreground mb-4">
                              {selectedTeacher.current_company || selectedTeacher.bio}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                <span>{selectedTeacher.experience_years || 0} years</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{selectedTeacher.specialization}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{selectedTeacher.review_count || 0} Mentee Engagements</span>
                              </div>
                            </div>
                            
                            {/* Social Links */}
                            <div className="flex gap-3">
                              {selectedTeacher.facebook_url && (
                                <Button variant="ghost" size="icon" asChild>
                                  <a href={selectedTeacher.facebook_url} target="_blank" rel="noopener noreferrer">
                                    <Facebook className="h-5 w-5" />
                                  </a>
                                </Button>
                              )}
                              {selectedTeacher.instagram_url && (
                                <Button variant="ghost" size="icon" asChild>
                                  <a href={selectedTeacher.instagram_url} target="_blank" rel="noopener noreferrer">
                                    <Instagram className="h-5 w-5" />
                                  </a>
                                </Button>
                              )}
                              {selectedTeacher.linkedin_url && (
                                <Button variant="ghost" size="icon" asChild>
                                  <a href={selectedTeacher.linkedin_url} target="_blank" rel="noopener noreferrer">
                                    <Linkedin className="h-5 w-5" />
                                  </a>
                                </Button>
                              )}
                              {selectedTeacher.twitter_url && (
                                <Button variant="ghost" size="icon" asChild>
                                  <a href={selectedTeacher.twitter_url} target="_blank" rel="noopener noreferrer">
                                    <Twitter className="h-5 w-5" />
                                  </a>
                                </Button>
                              )}
                              <Button className="ml-auto" onClick={() => window.location.href = `/mentor/${selectedTeacher.id}`}>
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Services Section */}
                        <div className="border-t pt-6">
                          <h3 className="text-2xl font-bold mb-4">Services</h3>
                          <div className="space-y-4">
                            <Card className="border-2">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                                        👤 1:1 Call
                                      </Badge>
                                      <Badge className="bg-amber-500 text-white">Best Seller</Badge>
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">Mathematics Doubt Clearing Session</h4>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                      <Clock className="h-4 w-4" />
                                      <span>60 Min</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                      Get your doubts cleared with personalized 1:1 session. Perfect for {selectedTeacher.specialization} preparation.
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-2xl font-bold text-primary">₹{selectedTeacher.hourly_rate}</span>
                                    </div>
                                  </div>
                                  <Button className="ml-4">Book Now</Button>
                                </div>
                              </CardContent>
                            </Card>

                            {selectedTeacher.topics && selectedTeacher.topics.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2">Topics Covered</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedTeacher.topics.map((topic, index) => (
                                    <Badge key={index} variant="secondary">{topic}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {selectedTeacher.languages && selectedTeacher.languages.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2">Languages</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedTeacher.languages.map((lang, index) => (
                                    <Badge key={index} variant="outline">{lang}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default MentorshipsPage;
