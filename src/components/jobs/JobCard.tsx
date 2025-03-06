import React from 'react';
import { MapPin, Clock, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Job } from '../../types';
import { formatTimeAgo } from '../../utils/dateUtils';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow">
      <Link to={`/jobs/${job.id}`} className="block p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Building2 className="flex-shrink-0 mr-1.5 h-5 w-5" />
              {job.company}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5" />
              {job.location}
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            {job.type}
          </span>
        </div>
        <p className="mt-4 text-gray-600 line-clamp-2">{job.description}</p>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <Clock className="flex-shrink-0 mr-1.5 h-5 w-5" />
          {formatTimeAgo(job.createdAt)}
        </div>
      </Link>
    </div>
  );
}