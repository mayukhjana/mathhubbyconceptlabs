import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, User, Clock } from 'lucide-react';

interface Teacher {
  id: string;
  user_id: string;
  specialization: string;
  hourly_rate: number;
  bio: string | null;
  experience_years: number | null;
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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={teacher.profiles?.avatar_url || undefined} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl">
              {teacher.profiles?.full_name || 'Teacher'}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{teacher.specialization}</Badge>
              {teacher.experience_years && (
                <span className="text-sm text-muted-foreground">
                  {teacher.experience_years} years exp.
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {teacher.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {teacher.bio}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-bold text-lg">₹{teacher.hourly_rate}</span>
            <span className="text-sm text-muted-foreground">/hour</span>
          </div>
        </div>

        <Button className="w-full">Contact Teacher</Button>
      </CardContent>
    </Card>
  );
};
