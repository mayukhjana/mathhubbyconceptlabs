import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, FileText, ExternalLink, Clock, Edit2, Save, X, Trash2 } from 'lucide-react';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<MentorApplication>>({});

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

  const handleEdit = () => {
    if (selectedApplication) {
      setEditForm({
        specialization: selectedApplication.specialization,
        hourly_rate: selectedApplication.hourly_rate,
        bio: selectedApplication.bio,
        experience_years: selectedApplication.experience_years,
        qualification: selectedApplication.qualification,
        school_past: selectedApplication.school_past,
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleSaveEdit = async () => {
    if (!selectedApplication) return;

    try {
      setProcessing(true);
      
      const { error } = await supabase
        .from('teachers')
        .update(editForm)
        .eq('id', selectedApplication.id);

      if (error) throw error;

      toast.success('Application updated successfully');
      setIsEditing(false);
      setEditForm({});
      fetchApplications();
      
      // Update selected application with new data
      setSelectedApplication({ ...selectedApplication, ...editForm } as MentorApplication);
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this mentor application? This action cannot be undone.')) {
      return;
    }

    try {
      setProcessing(true);
      
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;

      toast.success('Application deleted successfully');
      setSelectedApplication(null);
      fetchApplications();
    } catch (error: any) {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application');
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

      <Dialog open={!!selectedApplication} onOpenChange={() => {
        setSelectedApplication(null);
        setIsEditing(false);
        setEditForm({});
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Application Details</span>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  disabled={processing}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edit the mentor application details' : 'Review the mentor application and verify the credentials'}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Full Name</Label>
                    <p className="mt-1">{selectedApplication.profiles?.full_name || 'N/A'}</p>
                  </div>
                  
                  {isEditing ? (
                    <div>
                      <Label htmlFor="qualification">Qualification</Label>
                      <Input
                        id="qualification"
                        value={editForm.qualification || ''}
                        onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })}
                        placeholder="Enter qualification"
                      />
                    </div>
                  ) : (
                    <div>
                      <Label className="text-sm text-muted-foreground">Qualification</Label>
                      <p className="mt-1">{selectedApplication.qualification || 'N/A'}</p>
                    </div>
                  )}

                  {isEditing ? (
                    <div>
                      <Label htmlFor="school_past">Educational Background</Label>
                      <Textarea
                        id="school_past"
                        value={editForm.school_past || ''}
                        onChange={(e) => setEditForm({ ...editForm, school_past: e.target.value })}
                        placeholder="Enter educational background"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div>
                      <Label className="text-sm text-muted-foreground">Educational Background</Label>
                      <p className="mt-1 whitespace-pre-wrap">{selectedApplication.school_past || 'N/A'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Professional Information</h3>
                <div className="space-y-4">
                  {isEditing ? (
                    <div>
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={editForm.specialization || ''}
                        onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                        placeholder="Enter specialization"
                      />
                    </div>
                  ) : (
                    <div>
                      <Label className="text-sm text-muted-foreground">Specialization</Label>
                      <p className="mt-1">{selectedApplication.specialization}</p>
                    </div>
                  )}

                  {isEditing ? (
                    <div>
                      <Label htmlFor="experience_years">Experience (years)</Label>
                      <Input
                        id="experience_years"
                        type="number"
                        value={editForm.experience_years || 0}
                        onChange={(e) => setEditForm({ ...editForm, experience_years: parseInt(e.target.value) || 0 })}
                        placeholder="Enter years of experience"
                      />
                    </div>
                  ) : (
                    <div>
                      <Label className="text-sm text-muted-foreground">Experience</Label>
                      <p className="mt-1">{selectedApplication.experience_years || 0} years</p>
                    </div>
                  )}

                  {isEditing ? (
                    <div>
                      <Label htmlFor="hourly_rate">Hourly Rate (₹)</Label>
                      <Input
                        id="hourly_rate"
                        type="number"
                        value={editForm.hourly_rate || 0}
                        onChange={(e) => setEditForm({ ...editForm, hourly_rate: parseFloat(e.target.value) || 0 })}
                        placeholder="Enter hourly rate"
                      />
                    </div>
                  ) : (
                    <div>
                      <Label className="text-sm text-muted-foreground">Hourly Rate</Label>
                      <p className="mt-1">₹{selectedApplication.hourly_rate}/hour</p>
                    </div>
                  )}

                  {isEditing ? (
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio || ''}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Enter bio"
                        rows={4}
                      />
                    </div>
                  ) : (
                    <div>
                      <Label className="text-sm text-muted-foreground">Bio</Label>
                      <p className="mt-1 whitespace-pre-wrap">{selectedApplication.bio || 'N/A'}</p>
                    </div>
                  )}
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

              {isEditing ? (
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    onClick={handleSaveEdit}
                    className="flex-1"
                    disabled={processing}
                  >
                    {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="flex-1"
                    disabled={processing}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 pt-4 border-t">
                  {selectedApplication.verification_status === 'pending' && (
                    <div className="flex gap-4">
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
                  <Button
                    onClick={() => handleDelete(selectedApplication.id)}
                    variant="outline"
                    className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    disabled={processing}
                  >
                    {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                    Delete Application
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
