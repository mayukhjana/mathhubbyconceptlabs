import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, User, Clock, Briefcase, GraduationCap } from 'lucide-react';

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

interface TeacherCardProps {
  teacher: Teacher;
}

export const TeacherCard = ({ teacher }: TeacherCardProps) => {
  const averageRating = teacher.average_rating || 0;
  const reviewCount = teacher.review_count || 0;
  const isTopMentor = averageRating >= 4.5 && reviewCount >= 10;

  return (
    <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-primary/10">
              <AvatarImage src={teacher.profiles?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10">
                <User className="h-12 w-12 text-primary" />
              </AvatarFallback>
            </Avatar>
            {teacher.experience_years && teacher.experience_years >= 3 && (
              <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-1">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="space-y-2 w-full">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 fill-green-600 text-green-600 dark:fill-green-400 dark:text-green-400" />
                <span className="font-bold text-green-700 dark:text-green-400">{averageRating.toFixed(1)}</span>
              </div>
              {isTopMentor && (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                  ⭐ Top Mentor
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-xl font-bold">
              {teacher.profiles?.full_name || 'Teacher'}
            </CardTitle>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{teacher.experience_years || 0} years</span>
              <span className="mx-1">•</span>
              <Briefcase className="h-4 w-4" />
              <span className="font-medium">{teacher.specialization}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0">
        {teacher.review_count && teacher.review_count > 0 && (
          <div className="text-center text-sm text-muted-foreground border-t pt-3">
            <span className="font-medium">{reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}</span>
          </div>
        )}

        {(teacher.current_company || teacher.qualification) && (
          <div className="space-y-2 border-t pt-3">
            {teacher.qualification && (
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground lg:hidden font-semibold">{teacher.qualification}</span>
                <span className="text-muted-foreground hidden lg:inline">{teacher.qualification}</span>
              </div>
            )}
            {teacher.current_company && (
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground lg:hidden font-semibold">{teacher.current_company}</span>
                <span className="text-muted-foreground hidden lg:inline">{teacher.current_company}</span>
              </div>
            )}
          </div>
        )}
        
        {teacher.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2 border-t pt-3">
            {teacher.bio}
          </p>
        )}
        
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-center gap-2 bg-primary/5 dark:bg-primary/10 p-3 rounded-lg">
            <span className="text-2xl font-bold text-primary">₹{teacher.hourly_rate}</span>
            <span className="text-sm text-muted-foreground">/hour</span>
          </div>

        <Button className="w-full bg-primary hover:bg-primary/90 font-semibold" size="lg" onClick={() => window.location.href = `/mentor/${teacher.id}`}>
          View Profile
        </Button>
        </div>
      </CardContent>
    </Card>
  );
};
