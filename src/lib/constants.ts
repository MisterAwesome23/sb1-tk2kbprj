export const APP_NAME = 'HireFusion';

export const ROUTES = {
  HOME: '/',
  JOBS: '/jobs',
  EMPLOYERS: '/employers',
  ABOUT: '/about',
  LOGIN: '/login',
  PROFILE: '/profile',
  EMPLOYEE_DASHBOARD: '/employee-dashboard',
  EMPLOYER_DASHBOARD: '/employer-dashboard',
  GAMES: '/games',
} as const;

export const JOB_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
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
