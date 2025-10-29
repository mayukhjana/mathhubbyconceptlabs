import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TeacherCard } from '@/components/mentorship/TeacherCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Teacher {
  id: string;
  user_id: string;
  specialization: string;
  hourly_rate: number;
  bio: string | null;
  experience_years: number | null;
  qualification?: string | null;
  current_company?: string | null;
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

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      
      // Fetch only approved teachers
      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select('*')
        .eq('verification_status', 'approved')
        .order('created_at', { ascending: false });

      if (teachersError) throw teachersError;

      // Fetch profiles and reviews for each teacher
      const teachersWithDetails = await Promise.all(
        (teachersData || []).map(async (teacher) => {
          // Fetch profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', teacher.user_id)
            .single();

          // Fetch reviews
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

  return (
    <>
      <Helmet>
        <title>Find a Mentor - MathHub</title>
        <meta name="description" content="Connect with experienced teachers and mentors to help you excel in mathematics. Browse profiles, read reviews, and find the perfect tutor for your needs." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Find Your Perfect Mentor</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Connect with experienced teachers who can guide you to success. 
                Browse profiles, check reviews, and book sessions with top educators.
              </p>
            </div>

            {/* Search */}
            <div className="mb-8 max-w-md mx-auto">
              <Label htmlFor="search" className="sr-only">Search teachers</Label>
              <Input
                id="search"
                type="text"
                placeholder="Search by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Teachers Grid */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeachers.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
                ))}
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
