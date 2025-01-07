export const APP_NAME = 'HireFusion';

export const ROUTES = {
  HOME: '/',
  JOBS: '/jobs',
  EMPLOYERS: '/employers',
  ABOUT: '/about',
  LOGIN: '/login',
} as const;

export const JOB_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
} as const;