import React from 'react';
import { Search } from 'lucide-react';
import { JobCard } from './JobCard';
import { Job } from '../../types';

interface JobListProps {
  jobs: Job[];
}

export function JobList({ jobs }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No jobs found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}