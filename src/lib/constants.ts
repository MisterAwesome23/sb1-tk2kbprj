export const APP_NAME = 'HireFusion';

export const ROUTES = {
  HOME: '/',
  JOBS: '/jobs',
  EMPLOYERS: '/employers',
  EMPLOYEES: '/employees',
  ABOUT: '/about',
  LOGIN: '/login',
  PROFILE: '/profile',
  EMPLOYEE_DASHBOARD: '/employee-dashboard',
  EMPLOYER_DASHBOARD: '/employer-dashboard',
  GAMES: '/games',
  CREATE_JOB: '/create-job',
  EDIT_JOB: '/edit-job',
  JOB_DETAIL: '/jobs/:id',
  APPLICATIONS: '/applications',
  NEGOTIATION_GAME: '/games/negotiation',
  NOTIFICATIONS: '/notifications',
} as const;

export const JOB_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
} as const;

export const JOB_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  IN_PROGRESS: 'in-progress',
} as const;

export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  STANDBY: 'standby',
  SELECTED: 'selected',
  REJECTED: 'rejected',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
} as const;

export const INTERVIEW_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
} as const;

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELED: 'canceled',
  EXPIRED: 'expired',
} as const;

export const MBTI_QUESTIONS = [
  {
    id: 1,
    text: "How do you prefer to spend your free time?",
    dimension: "E-I",
    options: [
      { text: "Meeting friends and socializing", value: "E" },
      { text: "Relaxing alone with a book or hobby", value: "I" }
    ]
  },
  {
    id: 2,
    text: "In group discussions, you tend to:",
    dimension: "E-I",
    options: [
      { text: "Speak up and share thoughts quickly", value: "E" },
      { text: "Listen and reflect before speaking", value: "I" }
    ]
  },
  {
    id: 3,
    text: "When solving problems, you prefer to:",
    dimension: "S-N",
    options: [
      { text: "Focus on concrete facts and details", value: "S" },
      { text: "Consider patterns and possibilities", value: "N" }
    ]
  },
  {
    id: 4,
    text: "When learning something new, you prefer:",
    dimension: "S-N",
    options: [
      { text: "Step-by-step practical instructions", value: "S" },
      { text: "Understanding the big picture first", value: "N" }
    ]
  },
  {
    id: 5,
    text: "When making decisions, you primarily consider:",
    dimension: "T-F",
    options: [
      { text: "Logic and objective analysis", value: "T" },
      { text: "Impact on people and harmony", value: "F" }
    ]
  },
  {
    id: 6,
    text: "In conflicts, you tend to:",
    dimension: "T-F",
    options: [
      { text: "Focus on finding the fairest solution", value: "T" },
      { text: "Prioritize maintaining relationships", value: "F" }
    ]
  },
  {
    id: 7,
    text: "How do you prefer to plan your day?",
    dimension: "J-P",
    options: [
      { text: "With a clear schedule and structure", value: "J" },
      { text: "Keeping options open and flexible", value: "P" }
    ]
  },
  {
    id: 8,
    text: "When working on projects, you prefer to:",
    dimension: "J-P",
    options: [
      { text: "Follow a planned approach to completion", value: "J" },
      { text: "Adapt and explore as you go", value: "P" }
    ]
  }
];

export const PERSONALITY_TYPES = {
  'ISTJ': {
    name: 'The Inspector',
    description: 'Practical and fact-minded individuals, whose reliability cannot be doubted.',
    characteristics: ['Organized', 'Reliable', 'Practical', 'Dutiful'],
    famousPeople: ['Queen Elizabeth II', 'Jeff Bezos', 'Warren Buffett']
  },
  'ISFJ': {
    name: 'The Protector',
    description: 'Very dedicated and warm protectors, always ready to defend their loved ones.',
    characteristics: ['Supportive', 'Reliable', 'Patient', 'Detail-oriented'],
    famousPeople: ['Mother Teresa', 'Kate Middleton', 'George H.W. Bush']
  },
  'INFJ': {
    name: 'The Counselor',
    description: 'Quiet, mystical, and insightful individuals who see the deeper meaning in life.',
    characteristics: ['Insightful', 'Creative', 'Principled', 'Complex'],
    famousPeople: ['Martin Luther King Jr.', 'Nelson Mandela', 'Lady Gaga']
  },
  'INTJ': {
    name: 'The Mastermind',
    description: 'Innovative inventors with an unquenchable thirst for knowledge.',
    characteristics: ['Strategic', 'Independent', 'Analytical', 'Determined'],
    famousPeople: ['Elon Musk', 'Friedrich Nietzsche', 'Christopher Nolan']
  },
  'ISTP': {
    name: 'The Craftsperson',
    description: 'Bold and practical experimenters, masters of tools and techniques.',
    characteristics: ['Adaptable', 'Observant', 'Practical', 'Action-oriented'],
    famousPeople: ['Tom Cruise', 'Bruce Lee', 'Michael Jordan']
  },
  'ISFP': {
    name: 'The Composer',
    description: "Artistic, sensitive, and caring individuals who enjoy life's simple pleasures.",
    characteristics: ['Artistic', 'Sensitive', 'Gentle', 'Spontaneous'],
    famousPeople: ['Bob Dylan', 'Frida Kahlo', 'David Beckham']
  },
  'INFP': {
    name: 'The Healer',
    description: 'Poetic, kind, and altruistic individuals, always eager to help a good cause.',
    characteristics: ['Idealistic', 'Empathetic', 'Creative', 'Authentic'],
    famousPeople: ['William Shakespeare', 'J.R.R. Tolkien', 'Johnny Depp']
  },
  'INTP': {
    name: 'The Architect',
    description: 'Innovative inventors with an unquenchable thirst for knowledge.',
    characteristics: ['Logical', 'Original', 'Creative', 'Analytical'],
    famousPeople: ['Albert Einstein', 'Charles Darwin', 'Bill Gates']
  },
  'ESTP': {
    name: 'The Dynamo',
    description: 'Smart, energetic, and very perceptive people who truly enjoy living on the edge.',
    characteristics: ['Energetic', 'Risk-taking', 'Practical', 'Spontaneous'],
    famousPeople: ['Donald Trump', 'Madonna', 'Eddie Murphy']
  },
  'ESFP': {
    name: 'The Performer',
    description: 'Spontaneous, energetic, and enthusiastic people – life is never boring around them.',
    characteristics: ['Enthusiastic', 'Fun-loving', 'Sociable', 'Spontaneous'],
    famousPeople: ['Marilyn Monroe', 'Elvis Presley', 'Jamie Oliver']
  },
  'ENFP': {
    name: 'The Champion',
    description: 'Enthusiastic, creative, and sociable free spirits who can always find a reason to smile.',
    characteristics: ['Creative', 'Enthusiastic', 'Optimistic', 'Versatile'],
    famousPeople: ['Robert Downey Jr.', 'Robin Williams', 'Walt Disney']
  },
  'ENTP': {
    name: 'The Visionary',
    description: 'Smart and curious thinkers who cannot resist an intellectual challenge.',
    characteristics: ['Innovative', 'Strategic', 'Outspoken', 'Resourceful'],
    famousPeople: ['Leonardo da Vinci', 'Steve Jobs', 'Mark Twain']
  },
  'ESTJ': {
    name: 'The Supervisor',
    description: 'Excellent administrators, unsurpassed at managing things or people.',
    characteristics: ['Organized', 'Practical', 'Direct', 'Systematic'],
    famousPeople: ['John D. Rockefeller', 'Judge Judy', 'Dr. Phil']
  },
  'ESFJ': {
    name: 'The Provider',
    description: 'Extraordinarily caring, social, and popular people, always eager to help.',
    characteristics: ['Caring', 'Popular', 'Traditional', 'Organized'],
    famousPeople: ['Taylor Swift', 'Bill Clinton', 'Sally Field']
  },
  'ENFJ': {
    name: 'The Teacher',
    description: 'Charismatic and inspiring leaders, able to mesmerize their listeners.',
    characteristics: ['Charismatic', 'Inspiring', 'Idealistic', 'Organized'],
    famousPeople: ['Barack Obama', 'Oprah Winfrey', 'Morgan Freeman']
  },
  'ENTJ': {
    name: 'The Commander',
    description: 'Bold, imaginative, and strong-willed leaders, always finding a way – or making one.',
    characteristics: ['Strategic', 'Charismatic', 'Efficient', 'Energetic'],
    famousPeople: ['Steve Jobs', 'Margaret Thatcher', 'Franklin D. Roosevelt']
  }
} as const;

// Negotiation game constants
export const NEGOTIATION_GAME = {
  ROUNDS: 5,
  MIN_OFFER: 500,
  MAX_OFFER: 10000,
  TIME_LIMIT: 60, // seconds
  SKILLS_ASSESSED: [
    'Value perception',
    'Patience',
    'Risk tolerance',
    'Communication style',
    'Decision making'
  ]
};

// Interview scheduling constants
export const INTERVIEW = {
  MIN_DURATION: 15, // minutes
  MAX_DURATION: 120, // minutes
  DEFAULT_DURATION: 45, // minutes
  AVAILABLE_TIMES: [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ],
  TYPES: ['In-person', 'Video call', 'Phone call'],
  DURATIONS: [15, 30, 45, 60, 90, 120]
};

// Premium career services
export const PREMIUM_SERVICES = {
  RESUME_REVIEW: {
    name: 'Professional Resume Review',
    description: 'Get expert feedback on your resume with actionable suggestions for improvement.',
    price: 49
  },
  RESUME_MAKEOVER: {
    name: 'Complete Resume Makeover',
    description: 'Our professional writers will transform your resume to highlight your strengths and achievements.',
    price: 99
  },
  COVER_LETTER: {
    name: 'Custom Cover Letter Writing',
    description: 'Personalized cover letters tailored to specific job applications to help you stand out.',
    price: 79
  },
  MOCK_INTERVIEW: {
    name: 'Mock Interview Session',
    description: '60-minute practice interview with feedback from an industry professional.',
    price: 129
  },
  CAREER_COACHING: {
    name: 'Career Coaching Session',
    description: 'One-on-one guidance to help you navigate your career path and achieve your goals.',
    price: 149
  },
  LINKEDIN_OPTIMIZATION: {
    name: 'LinkedIn Profile Optimization',
    description: 'Enhance your LinkedIn presence to attract recruiters and networking opportunities.',
    price: 89
  }
};