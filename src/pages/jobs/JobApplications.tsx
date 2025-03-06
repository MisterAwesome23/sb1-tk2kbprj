import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { useAuth } from '../../contexts/AuthContext';
import { getJobListingById, getJobApplications, updateApplicationStatus } from '../../services/jobService';
import { getCandidateGameResults } from '../../services/gameService';
import { JobListing, Application, GameResult, Interview } from '../../types';
import { ArrowLeft, UserCircle, Clock, CheckCircle, XCircle, AlertCircle, BarChart, MessageSquare, Calendar } from 'lucide-react';
import { formatTimeAgo } from '../../utils/dateUtils';
import { toast } from 'react-toastify';
import { format, isValid } from 'date-fns';

export function JobApplications() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const [job, setJob] = useState<JobListing | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [feedback, setFeedback] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [candidateGameResults, setCandidateGameResults] = useState<Record<string, GameResult[]>>({});

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      
      try {
        const [jobData, applicationsData] = await Promise.all([
          getJobListingById(id),
          getJobApplications(id)
        ]);
        
        setJob(jobData);
        setApplications(applicationsData);
        
        // Fetch game results for each candidate
        if (applicationsData.length > 0) {
          const gameResultsPromises = applicationsData.map(app => 
            getCandidateGameResults(app.candidate_id)
          );
          
          const gameResultsData = await Promise.all(gameResultsPromises);
          
          const resultsMap: Record<string, GameResult[]> = {};
          applicationsData.forEach((app, index) => {
            resultsMap[app.candidate_id] = gameResultsData[index];
          });
          
          setCandidateGameResults(resultsMap);
        }
      } catch (err) {
        setError('Failed to load job applications');
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, [id]);

  // Redirect if not an employer or not the job owner
  useEffect(() => {
    if (!loading && (!profile || profile.role !== 'employer' || (job && profile.id !== job.employer_id))) {
      navigate('/');
    }
  }, [profile, loading, navigate, job]);

  const handleStatusUpdate = async (status: Application['status']) => {
    if (!selectedApplication) return;
    
    setUpdatingStatus(true);
    setError(null);
    
    try {
      const updatedApplication = await updateApplicationStatus(
        selectedApplication.id,
        status,
        feedback
      );
      
      // Update the applications list
      setApplications(apps => 
        apps.map(app => 
          app.id === updatedApplication.id ? { ...app, ...updatedApplication } : app
        )
      );
      
      setSelectedApplication(null);
      setFeedback('');
      
      // If status is 'selected', navigate to interview scheduler
      if (status === 'selected') {
        toast.success('Application status updated. Redirecting to interview scheduler...');
        setTimeout(() => {
          navigate(`/jobs/${id}/applications/${updatedApplication.id}/schedule`);
        }, 1500);
      } else {
        toast.success('Application status updated successfully');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application status');
      toast.error(err instanceof Error ? err.message : 'Failed to update application status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'selected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'standby':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'interview_scheduled':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  // Helper function to safely format dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Date not available';
    
    const date = new Date(dateString);
    if (!isValid(date)) return 'Invalid date';
    
    return format(date, 'MMMM d, yyyy - h:mm a');
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

  if (error || !job) {
    return (
      <Container>
        <div className="max-w-3xl mx-auto py-12">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error || 'Job not found'}
          </div>
          <button
            onClick={() => navigate('/employer-dashboard')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-12">
        <button
          onClick={() => navigate(`/jobs/${id}`)}
          className="mb-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Job
        </button>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
            <p className="text-gray-500">Applications ({applications.length})</p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <p className="text-gray-500">No applications yet for this position.</p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {applications.map((application) => (
                <li key={application.id} className="px-6 py-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <UserCircle className="w-6 h-6 text-gray-400 mr-2" />
                        <h2 className="text-lg font-medium text-gray-900">
                          {application.candidate?.username}
                        </h2>
                        <div className="ml-3 flex items-center">
                          {getStatusIcon(application.status)}
                          <span className="ml-1 text-sm font-medium capitalize text-gray-700">
                            {application.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Applied {formatTimeAgo(new Date(application.created_at))}
                      </p>
                      
                      {/* Game Results */}
                      {candidateGameResults[application.candidate_id]?.length > 0 && (
                        <div className="mt-3">
                          <h3 className="text-sm font-medium text-gray-700 flex items-center">
                            <BarChart className="w-4 h-4 mr-1" />
                            Assessment Results
                          </h3>
                          <div className="mt-1 space-y-1">
                            {candidateGameResults[application.candidate_id].map((result) => (
                              <div key={result.id} className="flex items-center">
                                <span className="text-xs text-gray-500">
                                  {result.game_type === 'negotiation' ? 'Negotiation Game' : result.game_type}:
                                </span>
                                <div className="ml-2 w-24 h-2 bg-gray-200 rounded-full">
                                  <div
                                    className="h-2 bg-indigo-600 rounded-full"
                                    style={{ width: `${result.score}%` }}
                                  />
                                </div>
                                <span className="ml-2 text-xs font-medium text-gray-700">
                                  {result.score}/100
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Cover Letter */}
                      {application.cover_letter && (
                        <div className="mt-3">
                          <button
                            onClick={() => setSelectedApplication(application)}
                            className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            View Cover Letter
                          </button>
                        </div>
                      )}
                      
                      {/* Interview Details */}
                      {application.interview && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md">
                          <h4 className="text-sm font-medium text-blue-700 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Interview Scheduled
                          </h4>
                          <p className="text-sm text-blue-600 mt-1">
                            {formatDate(application.interview.scheduled_at)}
                          </p>
                          {application.interview.meeting_link && (
                            <a 
                              href={application.interview.meeting_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 underline mt-1 inline-block"
                            >
                              Join Meeting
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {application.status === 'applied' || application.status === 'standby' ? (
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setFeedback(application.feedback || '');
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Move to 2nd Stage
                        </button>
                      ) : application.status === 'selected' && !application.interview ? (
                        <button
                          onClick={() => navigate(`/jobs/${id}/applications/${application.id}/schedule`)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          Schedule Interview
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setFeedback(application.feedback || '');
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Update Status
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Feedback (if exists) */}
                  {application.feedback && (
                    <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                      <p className="font-medium">Feedback:</p>
                      <p>{application.feedback}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Application Status Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {selectedApplication.cover_letter && !feedback
                  ? 'Cover Letter' 
                  : `Update Status for ${selectedApplication.candidate?.username}`}
              </h2>
              
              {selectedApplication.cover_letter && !feedback && (
                <div className="mb-4 p-4 bg-gray-50 rounded-md text-gray-700 max-h-60 overflow-y-auto">
                  {selectedApplication.cover_letter}
                </div>
              )}
              
              {!selectedApplication.cover_letter || feedback ? (
                <>
                  <div className="mb-4">
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                      Feedback (Optional)
                    </label>
                    <textarea
                      id="feedback"
                      rows={4}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Provide feedback to the candidate..."
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => handleStatusUpdate('selected')}
                      disabled={updatingStatus}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Move to 2nd Stage
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('standby')}
                      disabled={updatingStatus}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Standby
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('rejected')}
                      disabled={updatingStatus}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => {
                      setFeedback(selectedApplication.feedback || '');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Update Status
                  </button>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSelectedApplication(null);
                    setFeedback('');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}