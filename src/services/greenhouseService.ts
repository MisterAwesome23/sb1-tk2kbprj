import axios from 'axios';
import { Job } from '../types';

const GREENHOUSE_API_URL = 'https://boards-api.greenhouse.io/v1/boards';
const BOARD_TOKEN = import.meta.env.VITE_GREENHOUSE_BOARD_TOKEN || 'demo';

interface GreenhouseJob {
  id: number;
  title: string;
  location: {
    name: string;
  };
  content: string;
  metadata: any[];
  absolute_url: string;
  updated_at: string;
  requisition_id: string | null;
}

export async function getGreenhouseJobs(): Promise<Job[]> {
  try {
    const response = await axios.get(`${GREENHOUSE_API_URL}/${BOARD_TOKEN}/jobs`);
    const jobs = response.data.jobs as GreenhouseJob[];

    return jobs.map(job => ({
      id: `gh_${job.id}`,
      title: job.title,
      company: 'Greenhouse',
      location: job.location.name,
      type: determineJobType(job),
      description: job.content,
      requirements: extractRequirements(job.content),
      createdAt: new Date(job.updated_at),
      status: 'open',
      externalUrl: job.absolute_url,
      isExternal: true
    }));
  } catch (error) {
    console.error('Error fetching Greenhouse jobs:', error);
    return [];
  }
}

export async function getGreenhouseJobById(id: string): Promise<Job | null> {
  try {
    const numericId = id.replace('gh_', '');
    const response = await axios.get(`${GREENHOUSE_API_URL}/${BOARD_TOKEN}/jobs/${numericId}`);
    const job = response.data as GreenhouseJob;

    return {
      id: `gh_${job.id}`,
      title: job.title,
      company: 'Greenhouse',
      location: job.location.name,
      type: determineJobType(job),
      description: job.content,
      requirements: extractRequirements(job.content),
      createdAt: new Date(job.updated_at),
      status: 'open',
      externalUrl: job.absolute_url,
      isExternal: true
    };
  } catch (error) {
    console.error('Error fetching Greenhouse job:', error);
    return null;
  }
}

function determineJobType(job: GreenhouseJob): Job['type'] {
  const content = job.content.toLowerCase();
  if (content.includes('contract') || content.includes('contractor')) {
    return 'contract';
  }
  if (content.includes('part-time') || content.includes('part time')) {
    return 'part-time';
  }
  return 'full-time';
}

function extractRequirements(content: string): string[] {
  const requirements: string[] = [];
  const lines = content.split('\n');
  let inRequirements = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.toLowerCase().includes('requirements') || 
        trimmedLine.toLowerCase().includes('qualifications')) {
      inRequirements = true;
      continue;
    }
    if (inRequirements && trimmedLine.startsWith('-')) {
      requirements.push(trimmedLine.substring(1).trim());
    }
    if (inRequirements && trimmedLine === '') {
      inRequirements = false;
    }
  }

  return requirements.length > 0 ? requirements : ['No specific requirements listed'];
}