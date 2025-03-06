export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  description: string;
  requirements: string[];
  createdAt: Date;
  status?: 'open' | 'closed' | 'in-progress';
  employerId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'employer';
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

export interface Profile {
  id: string;
  username: string;
  role: 'employee' | 'employer';
  email?: string;
  company?: string;
  position?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  location?: string;
  website?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JobListing {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  employer_id: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  status: 'open' | 'closed' | 'in-progress';
  created_at: string;
  updated_at: string;
  employer?: Profile;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: 'applied' | 'standby' | 'selected' | 'rejected' | 'interview_scheduled';
  cover_letter?: string;
  ai_score?: number;
  game_score?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
  job?: JobListing;
  candidate?: Profile;
}

export interface Interview {
  id: string;
  application_id: string;
  scheduled_at: string;
  duration: number; // in minutes
  location?: string;
  meeting_link?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'canceled';
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  created_at: string;
}

export interface GameResult {
  id: string;
  user_id: string;
  game_type: string;
  score: number;
  data?: any;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'canceled' | 'expired';
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface NegotiationGameState {
  round: number;
  playerOffer: number;
  aiOffer: number;
  timeRemaining: number;
  history: {
    round: number;
    playerOffer: number;
    aiOffer: number;
    accepted: boolean;
  }[];
  status: 'in-progress' | 'completed' | 'timeout';
  finalScore?: number;
  skillAssessment?: Record<string, number>;
}