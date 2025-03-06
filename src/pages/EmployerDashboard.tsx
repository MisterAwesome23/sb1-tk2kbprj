import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { useAuth } from '../contexts/AuthContext';
import { getEmployerJobListings, deleteAllJobListings } from '../services/jobService';
import { getUserGameResults } from '../services/gameService';
import { JobListing, GameResult } from '../types';
import { Briefcase, Plus, Users, Clock, CheckCircle, XCircle, Trash, GamepadIcon, Brain, DollarSign } from 'lucide-react';
import { formatTimeAgo } from '../utils/dateUtils';
import { toast } from 'react-toastify';

export function EmployerDashboard() {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!loading && profile) {
        if (profile.role !== 'employer') {
          navigate('/');
          return;
        }
        
        try {
          const [jobListingsData, gameResultsData] = await Promise.all([
            getEmployerJobListings(),
            getUserGameResults()
          ]);
          setJobListings(jobListingsData);
          setGameResults(gameResultsData);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to load your dashboard data');
        } finally {
          setLoadingData(false);
        }
      }
    }

    fetchData();
  }, [profile, loading, navigate]);

  const handleDeleteAllJobs = async () => {
    if (window.confirm('Are you sure you want to delete ALL your job listings? This action cannot be undone.')) {
      setIsDeleting(true);
      setError(null);
      setSuccess(null);
      
      try {
        await deleteAllJobListings();
        setJobListings([]);
        setSuccess('All job listings have been deleted successfully');
        toast.success('All job listings have been deleted successfully');
      } catch (error) {
        console.error('Error deleting job listings:', error);
        setError('Failed to delete job listings');
        toast.error('Failed to delete job listings');
      } finally {
        setIsDeleting(false);
      }
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

  const getStatusBadge = (status: JobListing['status']) => {
    switch (status) {
      case 'open':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Open</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Closed</span>;
      case 'in-progress':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">In Progress</span>;
      default:
        return null;
    }
  };

  // Count applications by status
  const openJobs = jobListings.filter(job => job.status === 'open').length;
  const closedJobs = jobListings.filter(job => job.status === 'closed').length;
  const inProgressJobs = jobListings.filter(job => job.status === 'in-progress').length;

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {profile?.username}!
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={handleDeleteAllJobs}
              disabled={isDeleting || jobListings.length === 0}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete All Jobs
            </button>
            <Link
              to="/create-job"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Open Jobs</h2>
              <Briefcase className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold mt-2">{openJobs}</p>
            <p className="text-sm text-gray-500 mt-1">Active job listings</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">In Progress</h2>
              <Clock className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold mt-2">{inProgressJobs}</p>
            <p className="text-sm text-gray-500 mt-1">Jobs in hiring process</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Closed</h2>
              <CheckCircle className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold mt-2">{closedJobs}</p>
            <p className="text-sm text-gray-500 mt-1">Completed job listings</p>
          </div>
        </div>

        {/* Practice Game Scores Section */}
        {gameResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Practice Game Scores</h2>
              <Link to="/games" className="text-indigo-600 hover:text-indigo-500 text-sm">
                Play More Games
              </Link>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameResults.slice(0, 4).map((result, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      {result.game_type === 'negotiation' ? (
                        <DollarSign className="w-5 h-5 text-indigo-600 mr-2" />
                      ) : (
                        <Brain className="w-5 h-5 text-purple-600 mr-2" />
                      )}
                      <h3 className="font-medium text-gray-900">
                        {result.game_type === 'negotiation' ? 'Negotiation Game' : 'MBTI Test'}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(result.created_at).toLocaleDateString()}
                      </span>
                      <span className="font-bold text-indigo-600">
                        {result.game_type === 'negotiation' 
                          ? `${result.score}/100` 
                          : (result.data?.type || 'N/A')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {gameResults.length > 4 && (
                <div className="mt-4 text-center">
                  <Link to="/games" className="text-indigo-600 hover:text-indigo-500 text-sm">
                    View all game results
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Your Job Listings</h2>
            <Link to="/create-job" className="text-indigo-600 hover:text-indigo-500 text-sm">
              + Post New Job
            </Link>
          </div>
          {jobListings.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">You haven't posted any jobs yet.</p>
              <Link to="/create-job" className="mt-2 inline-block text-indigo-600 hover:text-indigo-500">
                Post your first job
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {jobListings.map((job) => (
                <li key={job.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {job.location} • {job.type}
                      </p>
                      <div className="mt-1 flex items-center">
                        {getStatusBadge(job.status)}
                        <span className="ml-2 text-xs text-gray-500">
                          Posted {formatTimeAgo(new Date(job.created_at))}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View
                      </Link>
                      <Link
                        to={`/jobs/${job.id}/applications`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Users className="w-4 h-4 mr-1" />
                        Applicants
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
}