import React, { useEffect, useState } from 'react';
import { JobFilters } from '../components/jobs/JobFilters';
import { JobList } from '../components/jobs/JobList';
import { Container } from '../components/ui/Container';
import { useJobFilters } from '../hooks/useJobFilters';
import { getJobListings } from '../services/jobService';
import { Job } from '../types';

export function JobListings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchJobs() {
      try {
        const fetchedJobs = await getJobListings();
        setJobs(fetchedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchJobs();
  }, []);
  
  const { 
    searchQuery, 
    setSearchQuery, 
    sortOrder, 
    setSortOrder, 
    filteredJobs 
  } = useJobFilters(jobs);

  if (loading) {
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Next Opportunity</h1>
        <p className="mt-2 text-gray-600">Discover roles that match your skills and aspirations</p>
      </div>
      
      <JobFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      <JobList jobs={filteredJobs} />
    </Container>
  );
}