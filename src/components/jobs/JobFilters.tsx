import React from 'react';
import { SearchBar } from './SearchBar';
import { SortDropdown } from './SortDropdown';

interface JobFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOrder: 'newest' | 'oldest';
  onSortChange: (value: 'newest' | 'oldest') => void;
}

export function JobFilters({ 
  searchQuery, 
  onSearchChange, 
  sortOrder, 
  onSortChange 
}: JobFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <SearchBar value={searchQuery} onChange={onSearchChange} />
      <SortDropdown value={sortOrder} onChange={onSortChange} />
    </div>
  );
}