import React from 'react';
import { Clock } from 'lucide-react';

interface SortDropdownProps {
  value: 'newest' | 'oldest';
  onChange: (value: 'newest' | 'oldest') => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center space-x-2">
      <Clock className="h-5 w-5 text-gray-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as 'newest' | 'oldest')}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
    </div>
  );
}