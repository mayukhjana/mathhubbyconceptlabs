import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, DollarSign, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Booking {
  id: string;
  booking_date: string;
  duration: number;
  amount: number;
  status: string;
  created_at: string;
  student_id: string;
  student_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

const MentorDashboardPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchMentorData();
  }, [user]);

  const fetchMentorData = async () => {
    try {
      setLoading(true);

      // Get mentor's teacher record
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', user?.id)
        .eq('verification_status', 'approved')
        .single();

      if (teacherError || !teacher) {
        toast.error('You are not a verified mentor');
        navigate('/');
        return;
      }

      setTeacherId(teacher.id);

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('mentor_bookings')
        .select('*')
        .eq('teacher_id', teacher.id)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Fetch student profiles for each booking
      const bookingsWithProfiles = await Promise.all(
        (bookingsData || []).map(async (booking) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', booking.student_id)
            .single();

          return {
            ...booking,
            student_profile: profile || { full_name: null, avatar_url: null }
          };
        })
      );

      setBookings(bookingsWithProfiles);

      // Calculate total earnings from completed bookings
      const earnings = bookingsWithProfiles
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + Number(b.amount), 0);
      setTotalEarnings(earnings);

    } catch (error: any) {
      console.error('Error fetching mentor data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('mentor_bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success(`Booking ${status}`);
      fetchMentorData(); // Refresh data
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: 'Pending', variant: 'secondary' },
      accepted: { label: 'Accepted', variant: 'default' },
      rejected: { label: 'Rejected', variant: 'destructive' },
      completed: { label: 'Completed', variant: 'outline' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mentor Dashboard - MathHub</title>
        <meta name="description" content="Manage your mentorship bookings and track your earnings" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Mentor Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">From completed sessions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length}</div>
                  <p className="text-xs text-muted-foreground">All time bookings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bookings.filter(b => b.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Awaiting your response</p>
                </CardContent>
              </Card>
            </div>

            {/* Bookings List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground">
                      Your bookings will appear here once students start booking sessions with you.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="border-2">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="font-semibold text-lg">
                                  {booking.student_profile?.full_name || 'Student'}
                                </div>
                                {getStatusBadge(booking.status)}
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(booking.booking_date).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>{booking.duration} minutes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4" />
                                  <span className="font-semibold">₹{booking.amount}</span>
                                </div>
                              </div>
                            </div>

                            {booking.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => updateBookingStatus(booking.id, 'accepted')}
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateBookingStatus(booking.id, 'rejected')}
                                  className="flex items-center gap-2"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            )}

                            {booking.status === 'accepted' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, 'completed')}
                              >
                                Mark as Completed
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default MentorDashboardPage;
