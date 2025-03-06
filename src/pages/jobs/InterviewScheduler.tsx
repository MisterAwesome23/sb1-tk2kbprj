import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { useAuth } from '../../contexts/AuthContext';
import { getJobListingById, getJobApplications, scheduleInterview } from '../../services/jobService';
import { JobListing, Application, Interview } from '../../types';
import { ArrowLeft, Calendar, Clock, MapPin, Video, MessageSquare } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { addDays, setHours, setMinutes, format } from 'date-fns';
import { INTERVIEW } from '../../lib/constants';
import { toast } from 'react-toastify';

export function InterviewScheduler() {
  const { id, applicationId } = useParams<{ id: string; applicationId: string }>();
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const [job, setJob] = useState<JobListing | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [interviewDate, setInterviewDate] = useState<Date | null>(addDays(new Date(), 3));
  const [interviewType, setInterviewType] = useState<string>('Video call');
  const [duration, setDuration] = useState<number>(INTERVIEW.DEFAULT_DURATION);
  const [location, setLocation] = useState<string>('');
  const [meetingLink, setMeetingLink] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      if (!id || !applicationId) return;
      
      try {
        const [jobData, applicationsData] = await Promise.all([
          getJobListingById(id),
          getJobApplications(id)
        ]);
        
        setJob(jobData);
        
        const app = applicationsData.find(a => a.id === applicationId);
        if (!app) {
          throw new Error('Application not found');
        }
        
        setApplication(app);
      } catch (err) {
        setError('Failed to load application data');
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, [id, applicationId]);

  // Redirect if not an employer or not the job owner
  useEffect(() => {
    if (!loading && (!profile || profile.role !== 'employer' || (job && profile.id !== job.employer_id))) {
      navigate('/');
    }
  }, [profile, loading, navigate, job]);

  // Set default meeting link based on interview type
  useEffect(() => {
    if (interviewType === 'Video call' && !meetingLink) {
      setMeetingLink('https://meet.google.com/');
    } else if (interviewType === 'In-person' && !location) {
      setLocation('Company Office');
    }
  }, [interviewType, meetingLink, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!interviewDate) {
      toast.error('Please select an interview date');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      if (!applicationId) throw new Error('Application ID is missing');
      
      await scheduleInterview(applicationId, {
        scheduled_at: interviewDate.toISOString(),
        duration,
        location: interviewType === 'In-person' ? location : undefined,
        meeting_link: interviewType === 'Video call' ? meetingLink : undefined,
        notes
      });
      
      toast.success('Interview scheduled successfully!');
      navigate(`/jobs/${id}/applications`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule interview');
      toast.error(err instanceof Error ? err.message : 'Failed to schedule interview');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || loadingData) {
    return (
      <Container>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Container>
    );
  }

  if (error || !job || !application) {
    return (
      <Container>
        <div className="max-w-3xl mx-auto py-12">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error || 'Job or application not found'}
          </div>
          <button
            onClick={() => navigate(`/jobs/${id}/applications`)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Applications
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-3xl mx-auto py-12">
        <button
          onClick={() => navigate(`/jobs/${id}/applications`)}
          className="mb-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Applications
        </button>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Schedule Interview</h1>
            <p className="text-gray-600 mt-1">
              {job.title} - Candidate: {application.candidate?.username}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Type
                </label>
                <div className="mt-1">
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {INTERVIEW.TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date and Time
                </label>
                <div className="mt-1">
                  <DatePicker
                    selected={interviewDate}
                    onChange={(date) => setInterviewDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <div className="mt-1">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {INTERVIEW.DURATIONS.map((d) => (
                      <option key={d} value={d}>{d} minutes</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}