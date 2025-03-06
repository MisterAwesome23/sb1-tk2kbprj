import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { useAuth } from '../contexts/AuthContext';
import { getUserApplications } from '../services/jobService';
import { getUserGameResults } from '../services/gameService';
import { Application, GameResult, Interview } from '../types';
import { Briefcase, Clock, CheckCircle, XCircle, AlertCircle, Calendar, FileText, Upload, Loader2 } from 'lucide-react';
import { formatTimeAgo } from '../utils/dateUtils';
import { format, isValid } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

export function EmployeeDashboard() {
  const { profile, loading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!loading && profile) {
        try {
          const [applicationsData, gameResultsData] = await Promise.all([
            getUserApplications(),
            getUserGameResults()
          ]);
          setApplications(applicationsData);
          setGameResults(gameResultsData);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoadingData(false);
        }
      }
    }

    fetchData();
  }, [profile, loading]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsReviewing(true);
    setReviewFeedback(null);

    try {
      // Simulate AI review process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setReviewFeedback(`
        Resume Review Feedback:
        
        Strengths:
        - Clear professional experience section
        - Good use of action verbs
        - Relevant skills highlighted
        
        Areas for Improvement:
        - Add more quantifiable achievements
        - Include a stronger professional summary
        - Consider adding relevant certifications
        
        Overall Score: 8/10
        
        Recommendations:
        1. Add metrics to demonstrate impact in previous roles
        2. Highlight specific technical skills more prominently
        3. Include relevant projects or portfolio work
      `);
      
      toast.success('Resume review completed!');
    } catch (error) {
      console.error('Error reviewing resume:', error);
      toast.error('Failed to review resume. Please try again.');
    } finally {
      setIsReviewing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Date not available';
    
    const date = new Date(dateString);
    if (!isValid(date)) return 'Invalid date';
    
    return format(date, 'MMMM d, yyyy - h:mm a');
  };

  const upcomingInterviews = applications.filter(app => 
    app.status === 'interview_scheduled' && app.interview
  );

  if (loading || loadingData) {
    return (
      <Container>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {profile?.username}!
          </h1>
          <Link
            to="/jobs"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Browse Jobs
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
              <Briefcase className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold mt-2">{applications.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total job applications</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Games Played</h2>
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold mt-2">{gameResults.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total assessments completed</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Avg. Score</h2>
              <CheckCircle className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold mt-2">
              {gameResults.length > 0 
                ? Math.round(gameResults.reduce((sum, result) => sum + result.score, 0) / gameResults.length) 
                : '-'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Average game score</p>
          </div>
        </div>

        {/* AI Resume Review Section */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">AI Resume Review</h2>
            <p className="text-sm text-gray-500 mt-1">Get instant feedback on your resume</p>
          </div>
          <div className="p-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {isReviewing ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                  <p className="mt-2 text-sm text-gray-600">Analyzing your resume...</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600">
                    Drag and drop your resume here, or click to select
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supports PDF files only
                  </p>
                </>
              )}
            </div>
            
            {reviewFeedback && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Feedback</h3>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                  {reviewFeedback}
                </pre>
              </div>
            )}
          </div>
        </div>

        {upcomingInterviews.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Interviews</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {upcomingInterviews.map((application) => (
                <li key={`interview-${application.id}`} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {application.job?.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {application.job?.employer?.username} • {application.job?.location}
                      </p>
                      {application.interview && (
                        <div className="mt-2">
                          <div className="flex items-center text-sm text-blue-600">
                            <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5" />
                            {formatDate(application.interview.scheduled_at)}
                            <span className="ml-2">({application.interview.duration} minutes)</span>
                          </div>
                          {application.interview.meeting_link && (
                            <a 
                              href={application.interview.meeting_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                            >
                              Join Meeting
                            </a>
                          )}
                          {application.interview.location && (
                            <p className="mt-1 text-sm text-gray-600">
                              Location: {application.interview.location}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
          </div>
          {applications.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">You haven't applied to any jobs yet.</p>
              <Link to="/jobs" className="mt-2 inline-block text-indigo-600 hover:text-indigo-500">
                Browse available jobs
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {applications.slice(0, 5).map((application) => (
                <li key={application.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {application.job?.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {application.job?.employer?.username} • {application.job?.location}
                      </p>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          {application.job?.type}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          Applied {formatTimeAgo(new Date(application.created_at))}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(application.status)}
                      <span className="ml-2 text-sm font-medium capitalize">
                        {application.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  {application.feedback && (
                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700">
                      <p className="font-medium">Feedback:</p>
                      <p>{application.feedback}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          {applications.length > 5 && (
            <div className="px-6 py-4 border-t">
              <Link to="/applications" className="text-indigo-600 hover:text-indigo-500">
                View all applications
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Recent Game Results</h2>
          </div>
          {gameResults.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">You haven't played any games yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {gameResults.slice(0, 5).map((result) => (
                <li key={result.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {result.game_type === 'negotiation' ? 'Negotiation Game' : result.game_type}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Played {formatTimeAgo(new Date(result.created_at))}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="text-xl font-bold text-indigo-600">
                        {result.score}
                      </div>
                      <span className="ml-1 text-sm text-gray-500">/100</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {gameResults.length > 5 && (
            <div className="px-6 py-4 border-t">
              <Link to="/games" className="text-indigo-600 hover:text-indigo-500">
                View all game results
              </Link>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}