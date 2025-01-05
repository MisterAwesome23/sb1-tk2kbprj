import { useState, useMemo } from 'react';
import { Job } from '../types';
import { fuzzyMatch } from '../utils/searchUtils';

export function useJobFilters(jobs: Job[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredJobs = useMemo(() => {
    return jobs
      .filter(job => {
        const searchFields = [
          job.title,
          job.company,
          job.description,
          job.location,
          job.type,
          ...job.requirements
        ];

        return searchFields.some(field => 
          fuzzyMatch(field, searchQuery)
        );
      })
      .sort((a, b) => {
        if (sortOrder === 'newest') {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
  }, [jobs, searchQuery, sortOrder]);

  return {
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    filteredJobs
  };
}