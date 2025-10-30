import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  User, Clock, Star, GraduationCap, Briefcase, 
  Globe, Linkedin, Facebook, Instagram, Twitter,
  Calendar, Building2, BookOpen, MessageCircle
} from 'lucide-react';

interface Education {
  id: string;
  institution_name: string;
  degree: string;
  field_of_study: string | null;
  start_year: number | null;
  end_year: number | null;
}

interface Experience {
  id: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface Teacher {
  id: string;
  specialization: string;
  hourly_rate: number;
  bio: string | null;
  about_mentor: string | null;
  experience_years: number | null;
  qualification: string | null;
  current_company: string | null;
  topics: string[] | null;
  languages: string[] | null;
  achievements: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  };
  average_rating: number;
  review_count: number;
}

const MentorProfilePage = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentorDetails();
  }, [id]);

  const fetchMentorDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);

      // Fetch teacher details
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', id)
        .eq('verification_status', 'approved')
        .single();

      if (teacherError) throw teacherError;

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', teacherData.user_id)
        .single();

      // Fetch reviews with count and average
      const { data: reviewsData } = await supabase
        .from('teacher_reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          student_id,
          profiles!teacher_reviews_student_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('teacher_id', id)
        .order('created_at', { ascending: false });

      const reviewCount = reviewsData?.length || 0;
      const averageRating = reviewCount > 0
        ? reviewsData!.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0;

      setTeacher({
        ...teacherData,
        profiles: profile || { full_name: null, avatar_url: null },
        average_rating: averageRating,
        review_count: reviewCount,
      });

      setReviews(reviewsData as any || []);

      // Fetch education
      const { data: educationData } = await supabase
        .from('teacher_education')
        .select('*')
        .eq('teacher_id', id)
        .order('start_year', { ascending: false });

      setEducation(educationData || []);

      // Fetch experience
      const { data: experienceData } = await supabase
        .from('teacher_experience')
        .select('*')
        .eq('teacher_id', id)
        .order('start_date', { ascending: false });

      setExperience(experienceData || []);
    } catch (error: any) {
      console.error('Error fetching mentor details:', error);
      toast.error('Failed to load mentor profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Mentor not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const isTopMentor = teacher.average_rating >= 4.5 && teacher.review_count >= 10;

  return (
    <>
      <Helmet>
        <title>{teacher.profiles.full_name} - Mentor Profile | MathHub</title>
        <meta name="description" content={teacher.bio || 'Expert mathematics mentor on MathHub'} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Sidebar - Mentor Info Card */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6 space-y-6">
                    {/* Avatar and Basic Info */}
                    <div className="flex flex-col items-center text-center">
                      <div className="relative">
                        <Avatar className="h-32 w-32 border-4 border-primary/10">
                          <AvatarImage src={teacher.profiles.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-3xl">
                            <User className="h-16 w-16 text-primary" />
                          </AvatarFallback>
                        </Avatar>
                        {teacher.experience_years && teacher.experience_years >= 3 && (
                          <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 space-y-2 w-full">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <Badge className="bg-green-600 hover:bg-green-700 text-white">
                            ✓ Available
                          </Badge>
                          <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                            <Star className="h-4 w-4 fill-green-600 text-green-600 dark:fill-green-400 dark:text-green-400" />
                            <span className="font-bold text-green-700 dark:text-green-400">{teacher.average_rating.toFixed(1)}</span>
                          </div>
                          {isTopMentor && (
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                              ⭐ Top Mentor
                            </Badge>
                          )}
                        </div>

                        <h1 className="text-2xl font-bold">{teacher.profiles.full_name}</h1>

                        <p className="text-muted-foreground">{teacher.bio}</p>

                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{teacher.experience_years || 0} years</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{teacher.review_count} {teacher.review_count === 1 ? 'review' : 'reviews'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    {(teacher.linkedin_url || teacher.facebook_url || teacher.instagram_url || teacher.twitter_url) && (
                      <div className="flex justify-center gap-3 pt-4 border-t">
                        {teacher.linkedin_url && (
                          <a href={teacher.linkedin_url} target="_blank" rel="noopener noreferrer" 
                             className="text-muted-foreground hover:text-blue-600 transition-colors">
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                        {teacher.facebook_url && (
                          <a href={teacher.facebook_url} target="_blank" rel="noopener noreferrer"
                             className="text-muted-foreground hover:text-blue-600 transition-colors">
                            <Facebook className="h-5 w-5" />
                          </a>
                        )}
                        {teacher.instagram_url && (
                          <a href={teacher.instagram_url} target="_blank" rel="noopener noreferrer"
                             className="text-muted-foreground hover:text-pink-600 transition-colors">
                            <Instagram className="h-5 w-5" />
                          </a>
                        )}
                        {teacher.twitter_url && (
                          <a href={teacher.twitter_url} target="_blank" rel="noopener noreferrer"
                             className="text-muted-foreground hover:text-blue-400 transition-colors">
                            <Twitter className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Quick Info */}
                    <div className="space-y-3 pt-4 border-t">
                      {teacher.current_company && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="h-4 w-4 text-primary" />
                          <span>{teacher.current_company}</span>
                        </div>
                      )}
                      {teacher.qualification && (
                        <div className="flex items-center gap-2 text-sm">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span>{teacher.qualification}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span>{teacher.specialization}</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary">₹{teacher.hourly_rate}</div>
                      <div className="text-sm text-muted-foreground">/hour</div>
                    </div>

                    <Button className="w-full" size="lg">
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Topics */}
                {teacher.topics && teacher.topics.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4">Topics</h2>
                      <div className="flex flex-wrap gap-2">
                        {teacher.topics.map((topic, index) => (
                          <Badge key={index} variant="secondary" className="text-sm px-4 py-2">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Languages */}
                {teacher.languages && teacher.languages.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4">Fluent in</h2>
                      <div className="flex flex-wrap gap-2">
                        {teacher.languages.map((lang, index) => (
                          <Badge key={index} variant="outline" className="text-sm px-4 py-2">
                            <Globe className="h-3 w-3 mr-1" />
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* About Mentor */}
                {teacher.about_mentor && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4">About Mentor</h2>
                      <p className="text-muted-foreground whitespace-pre-line">{teacher.about_mentor}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Education */}
                {education.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4">Education</h2>
                      <div className="space-y-4">
                        {education.map((edu) => (
                          <div key={edu.id} className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                                <GraduationCap className="h-6 w-6 text-primary" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{edu.institution_name}</h3>
                              <p className="text-sm text-muted-foreground">{edu.degree}</p>
                              {edu.field_of_study && (
                                <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>
                              )}
                              {edu.start_year && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  {edu.start_year} - {edu.end_year || 'Present'}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Work Experience */}
                {experience.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4">Work Experience</h2>
                      <div className="space-y-4">
                        {experience.map((exp) => (
                          <div key={exp.id} className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                                <Briefcase className="h-6 w-6 text-primary" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{exp.position}</h3>
                              <p className="text-sm text-muted-foreground">{exp.company_name}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Achievements */}
                {teacher.achievements && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4">Achievements & Awards</h2>
                      <p className="text-muted-foreground whitespace-pre-line">{teacher.achievements}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Reviews */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Reviews</h2>
                    
                    {teacher.review_count > 0 ? (
                      <>
                        <div className="flex items-center gap-6 mb-6 p-4 bg-muted/50 rounded-lg">
                          <div className="text-center">
                            <div className="text-5xl font-bold">{teacher.average_rating.toFixed(1)}</div>
                            <div className="flex items-center gap-1 mt-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-5 w-5 ${
                                    star <= Math.round(teacher.average_rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Average Rating
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold">{teacher.review_count}</div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {teacher.review_count === 1 ? 'Review' : 'Reviews'}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <div key={review.id} className="border-b pb-4 last:border-0">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={review.profiles?.avatar_url || undefined} />
                                  <AvatarFallback>
                                    <User className="h-5 w-5" />
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold">{review.profiles?.full_name || 'Anonymous'}</h4>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                          star <= review.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-muted-foreground'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  {review.comment && (
                                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No reviews yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MentorProfilePage;