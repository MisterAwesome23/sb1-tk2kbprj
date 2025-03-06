import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { useAuth } from '../../contexts/AuthContext';
import { getJobListingById, applyToJob } from '../../services/jobService';
import { JobListing } from '../../types';
import { Briefcase, MapPin, Clock, Building2, CheckCircle, ArrowLeft } from 'lucide-react';
import { formatTimeAgo } from '../../utils/dateUtils';

export function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      if (!id) return;
      
      try {
        const jobData = await getJobListingById(id);
        setJob(jobData);
      } catch (err) {
        setError('Failed to load job details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;
    
    setApplying(true);
    setError(null);
    
    try {
      await applyToJob(id, coverLetter);
      setApplicationSuccess(true);
      setShowApplyForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
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
            onClick={() => navigate('/jobs')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </button>
        </div>
      </Container>
    );
  }

  const isEmployer = profile?.role === 'employer';
  const isJobOwner = profile?.id === job.employer_id;
  const canApply = !isEmployer && user;

  return (
    <Container>
      <div className="max-w-3xl mx-auto py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        {applicationSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Your application has been submitted successfully!
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center text-gray-500 mb-4">
                  <Building2 className="w-5 h-5 mr-1" />
                  <span>{job.employer?.username}</span>
                  <span className="mx-2">•</span>
                  <MapPin className="w-5 h-5 mr-1" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {job.type}
                  </span>
                  <span className="ml-3 text-sm text-gray-500">
                    Posted {formatTimeAgo(new Date(job.created_at))}
                  </span>
                </div>
              </div>
              {canApply && !applicationSuccess && (
                <button
                  onClick={() => setShowApplyForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Apply Now
                </button>
              )}
              {isJobOwner && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/jobs/${job.id}/applications`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    View Applications
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="prose max-w-none text-gray-700">
              <p>{job.description}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>

        {showApplyForm && (
          <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Apply for this position</h2>
            </div>
            <form onSubmit={handleApply} className="px-6 py-5">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}
              <div className="mb-4">
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter (Optional)
                </label>
                <textarea
                  id="coverLetter"
                  rows={6}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Introduce yourself and explain why you're a good fit for this role..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {applying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>Submit Application</>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Container>
  );
}