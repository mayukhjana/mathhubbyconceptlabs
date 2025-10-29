
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileFormProps {
  displayName: string;
  username: string;
  schoolName: string;
  board: string;
  classValue: string;
  loading: boolean;
  onDisplayNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onSchoolNameChange: (value: string) => void;
  onBoardChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onSignOut: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileForm = ({
  displayName,
  username,
  schoolName,
  board,
  classValue,
  loading,
  onDisplayNameChange,
  onUsernameChange,
  onSchoolNameChange,
  onBoardChange,
  onClassChange,
  onSignOut,
  onSubmit
}: ProfileFormProps) => {
  const { user } = useAuth();

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ''} disabled />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => onDisplayNameChange(e.target.value)}
              placeholder="Your display name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              placeholder="Your username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolName">School Name</Label>
            <Input
              id="schoolName"
              value={schoolName}
              onChange={(e) => onSchoolNameChange(e.target.value)}
              placeholder="Your school name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="board">Board</Label>
            <Input
              id="board"
              value={board}
              onChange={(e) => onBoardChange(e.target.value)}
              placeholder="e.g., CBSE, ICSE, State Board"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Input
              id="class"
              value={classValue}
              onChange={(e) => onClassChange(e.target.value)}
              placeholder="e.g., 10th, 12th"
            />
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onSignOut}
            >
              Sign Out
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
