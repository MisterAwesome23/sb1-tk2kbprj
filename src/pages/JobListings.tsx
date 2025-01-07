import React from 'react';
import { JobFilters } from '../components/jobs/JobFilters';
import { JobList } from '../components/jobs/JobList';
import { Container } from '../components/ui/Container';
import { useJobFilters } from '../hooks/useJobFilters';
import { mockJobs } from '../data/mockJobs';

export function JobListings() {
  const { 
    searchQuery, 
    setSearchQuery, 
    sortOrder, 
    setSortOrder, 
    filteredJobs 
  } = useJobFilters(mockJobs);

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