import axios from 'axios';
import { Job } from '../types';

const THEIRSTACK_API_URL = 'https://api.theirstack.com/v1';
const API_KEY = import.meta.env.VITE_THEIRSTACK_API_KEY;

interface TheirStackJob {
  id: string;
  title: string;
  company: {
    name: string;
    logo?: string;
  };
  location: string;
  type: string;
  description: string;
  requirements: string[];
  url: string;
  created_at: string;
}

export async function getTheirStackJobs(): Promise<Job[]> {
  try {
    const response = await axios.get(`${THEIRSTACK_API_URL}/jobs/search`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    });

    // Ensure we have an array of jobs
    const jobs = Array.isArray(response.data.jobs) ? response.data.jobs : [];
    
    // Transform jobs directly without intermediate state
    return jobs.map((job: TheirStackJob) => ({
      id: `ts_${job.id}`,
      title: job.title || 'Untitled Position',
      company: job.company?.name || 'Unknown Company',
      location: job.location || 'Remote',
      type: normalizeJobType(job.type),
      description: job.description || '',
      requirements: Array.isArray(job.requirements) ? job.requirements : [],
      createdAt: new Date(job.created_at || Date.now()),
      status: 'open',
      externalUrl: job.url,
      isExternal: true
    }));
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching TheirStack jobs:', error.message);
    } else {
      console.error('Error fetching TheirStack jobs:', error);
    }
    return [];
  }
}

export async function getTheirStackJobById(id: string): Promise<Job | null> {
  try {
    const jobId = id.replace('ts_', '');
    const response = await axios.get(`${THEIRSTACK_API_URL}/jobs/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    });

    const job = response.data;
    if (!job || typeof job !== 'object') {
      return null;
    }

    return {
      id: `ts_${job.id}`,
      title: job.title || 'Untitled Position',
      company: job.company?.name || 'Unknown Company',
      location: job.location || 'Remote',
      type: normalizeJobType(job.type),
      description: job.description || '',
      requirements: Array.isArray(job.requirements) ? job.requirements : [],
      createdAt: new Date(job.created_at || Date.now()),
      status: 'open',
      externalUrl: job.url,
      isExternal: true
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching TheirStack job:', error.message);
    } else {
      console.error('Error fetching TheirStack job:', error);
    }
    return null;
  }
}

function normalizeJobType(type: string): Job['type'] {
  if (!type || typeof type !== 'string') {
    return 'full-time';
  }
  
  const normalizedType = type.toLowerCase();
  if (normalizedType.includes('contract') || normalizedType.includes('freelance')) {
    return 'contract';
  }
  if (normalizedType.includes('part-time') || normalizedType.includes('part time')) {
    return 'part-time';
  }
  return 'full-time';
}