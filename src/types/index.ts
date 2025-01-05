export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  description: string;
  requirements: string[];
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'employer';
  company?: string;
  position?: string;
}

export interface Assessment {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'pending' | 'completed';
  score?: number;
  gameResults?: Record<string, any>;
  completedAt?: Date;
}