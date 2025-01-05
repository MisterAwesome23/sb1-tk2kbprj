import { Job } from '../types';

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    type: 'full-time',
    description: 'We are seeking an experienced Full Stack Developer to join our growing team. The ideal candidate will have strong experience with React, Node.js, and cloud technologies.',
    requirements: [
      '5+ years of experience in full-stack development',
      'Strong proficiency in React and Node.js',
      'Experience with cloud platforms (AWS/GCP/Azure)',
      'Strong problem-solving skills'
    ],
    createdAt: new Date('2024-03-15')
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Design Innovations',
    location: 'Remote',
    type: 'full-time',
    description: "Join our design team to create beautiful and intuitive user experiences for our enterprise clients. You'll work closely with developers and stakeholders to bring designs to life.",
    requirements: [
      '3+ years of product design experience',
      'Strong portfolio demonstrating UX/UI skills',
      'Experience with Figma and design systems',
      'Excellent communication skills'
    ],
    createdAt: new Date('2024-03-14')
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: 'CloudScale Systems',
    location: 'New York, NY',
    type: 'contract',
    description: 'Looking for a DevOps engineer to help streamline our deployment processes and improve our infrastructure automation. Experience with Kubernetes and CI/CD required.',
    requirements: [
      'Strong experience with Kubernetes and Docker',
      'Familiarity with CI/CD pipelines',
      'Infrastructure as Code experience',
      'Strong scripting skills'
    ],
    createdAt: new Date('2024-03-13')
  },
  {
    id: '4',
    title: 'Machine Learning Engineer',
    company: 'AI Innovations Lab',
    location: 'Boston, MA',
    type: 'full-time',
    description: 'Join our AI team to develop cutting-edge machine learning solutions. You\'ll work on challenging problems in computer vision and natural language processing.',
    requirements: [
      'MS/PhD in Computer Science or related field',
      'Strong background in machine learning',
      'Experience with PyTorch or TensorFlow',
      'Published research is a plus'
    ],
    createdAt: new Date('2024-03-12')
  },
  {
    id: '5',
    title: 'Frontend Developer',
    company: 'WebTech Solutions',
    location: 'Remote',
    type: 'part-time',
    description: 'Seeking a frontend developer to help build responsive and accessible web applications. Focus on React and modern CSS practices.',
    requirements: [
      '2+ years of frontend development experience',
      'Strong knowledge of React and TypeScript',
      'Experience with responsive design',
      'Understanding of web accessibility'
    ],
    createdAt: new Date('2024-03-11')
  }
];