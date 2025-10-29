import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, FileText, ExternalLink, Clock } from 'lucide-react';

interface MentorApplication {
  id: string;
  user_id: string;
  specialization: string;
  hourly_rate: number;
  bio: string | null;
  experience_years: number | null;
  qualification: string | null;
  school_past: string | null;
  documents_url: string | null;
  verification_status: string;
  submitted_at: string;
  profiles?: {
    full_name: string | null;
  };
}

const AdminMentorVerificationPage = () => {
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<MentorApplication | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      const { data: teachersData, error } = await supabase
        .from('teachers')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles for each teacher
      const applicationsWithProfiles = await Promise.all(
        (teachersData || []).map(async (teacher) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', teacher.user_id)
            .single();

          return {
            ...teacher,
            profiles: profile || { full_name: null },
          };
        })
      );

      setApplications(applicationsWithProfiles);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      setProcessing(true);
      
      const { error } = await supabase
        .from('teachers')
        .update({ verification_status: status })
        .eq('id', applicationId);

      if (error) throw error;

      toast.success(`Application ${status} successfully`);
      setSelectedApplication(null);
      fetchApplications();
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Mentor Verification - Admin - MathHub</title>
        <meta name="description" content="Admin panel for verifying mentor applications" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Mentor Verification</h1>
              <p className="text-muted-foreground">Review and verify mentor applications</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : applications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-20">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Applications</h3>
                  <p className="text-muted-foreground">There are no mentor applications at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {applications.map((application) => (
                  <Card key={application.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{application.profiles?.full_name || 'Unnamed Applicant'}</CardTitle>
                          <CardDescription>
                            Applied on {new Date(application.submitted_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        {getStatusBadge(application.verification_status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Specialization</p>
                          <p className="font-medium">{application.specialization}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Hourly Rate</p>
                          <p className="font-medium">₹{application.hourly_rate}/hour</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Experience</p>
                          <p className="font-medium">{application.experience_years || 0} years</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Qualification</p>
                          <p className="font-medium">{application.qualification || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => setSelectedApplication(application)}
                        variant="outline"
                        className="w-full"
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the mentor application and verify the credentials
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p>{selectedApplication.profiles?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Qualification</p>
                    <p>{selectedApplication.qualification || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Educational Background</p>
                    <p className="whitespace-pre-wrap">{selectedApplication.school_past || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Professional Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Specialization</p>
                    <p>{selectedApplication.specialization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p>{selectedApplication.experience_years || 0} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hourly Rate</p>
                    <p>₹{selectedApplication.hourly_rate}/hour</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bio</p>
                    <p className="whitespace-pre-wrap">{selectedApplication.bio || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedApplication.documents_url && (
                <div>
                  <h3 className="font-semibold mb-2">Verification Document</h3>
                  <a 
                    href={selectedApplication.documents_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    View Document
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Status</h3>
                {getStatusBadge(selectedApplication.verification_status)}
              </div>

              {selectedApplication.verification_status === 'pending' && (
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    onClick={() => handleVerification(selectedApplication.id, 'approved')}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    disabled={processing}
                  >
                    {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleVerification(selectedApplication.id, 'rejected')}
                    variant="destructive"
                    className="flex-1"
                    disabled={processing}
                  >
                    {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminMentorVerificationPage;
