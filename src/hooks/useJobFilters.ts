import { useState, useMemo, useCallback } from 'react';
import { Job } from '../types';
import { fuzzyMatch } from '../utils/searchUtils';

export function useJobFilters(jobs: Job[]) {
  const [filters, setFilters] = useState({
    searchQuery: '',
    sortOrder: 'newest' as const,
  });

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }));
  }, []);

  const setSortOrder = useCallback((sortOrder: 'newest' | 'oldest') => {
    setFilters(prev => ({ ...prev, sortOrder }));
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter(job => {
        if (!filters.searchQuery) return true;

        const searchFields = [
          job.title,
          job.company,
          job.description,
          job.location,
          job.type,
          ...job.requirements
        ];

        return searchFields.some(field => fuzzyMatch(field, filters.searchQuery));
      })
      .sort((a, b) => {
        const order = filters.sortOrder === 'newest' ? -1 : 1;
        return order * (a.createdAt.getTime() - b.createdAt.getTime());
      });
  }, [jobs, filters.searchQuery, filters.sortOrder]);

  return {
    ...filters,
    setSearchQuery,
    setSortOrder,
    filteredJobs,
  };
}