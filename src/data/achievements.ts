export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  svg: string;
  unlockCriteria: string;
}

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#4ade80" stroke="#22c55e" stroke-width="4"/><text x="24" y="30" text-anchor="middle" font-size="18" fill="#fff" font-family="Arial">👣</text></svg>`,
    unlockCriteria: 'Complete Lesson 1.'
  },
  {
    id: 'quiz-whiz',
    name: 'Quiz Whiz',
    description: 'Score 100% on any quiz',
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#fbbf24" stroke="#f59e42" stroke-width="4"/><text x="24" y="30" text-anchor="middle" font-size="18" fill="#fff" font-family="Arial">🧠</text></svg>`,
    unlockCriteria: 'Get all answers correct on a quiz.'
  },
  {
    id: 'persistence',
    name: 'Persistence',
    description: 'Log in 5 days in a row',
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#60a5fa" stroke="#2563eb" stroke-width="4"/><text x="24" y="30" text-anchor="middle" font-size="18" fill="#fff" font-family="Arial">🔥</text></svg>`,
    unlockCriteria: 'Log in 5 days in a row.'
  },
  {
    id: 'course-champion',
    name: 'Course Champion',
    description: 'Complete all lessons in a course',
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#f472b6" stroke="#be185d" stroke-width="4"/><text x="24" y="30" text-anchor="middle" font-size="18" fill="#fff" font-family="Arial">🏆</text></svg>`,
    unlockCriteria: 'Finish every lesson in a course.'
  },
  {
    id: 'code-explorer',
    name: 'Code Explorer',
    description: 'Try every lesson in a week',
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#f87171" stroke="#b91c1c" stroke-width="4"/><text x="24" y="30" text-anchor="middle" font-size="18" fill="#fff" font-family="Arial">🧭</text></svg>`,
    unlockCriteria: 'Open every lesson in a week.'
  },
  {
    id: 'perfect-streak',
    name: 'Perfect Streak',
    description: 'Complete a week with all quizzes perfect',
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#a78bfa" stroke="#7c3aed" stroke-width="4"/><text x="24" y="30" text-anchor="middle" font-size="18" fill="#fff" font-family="Arial">⭐</text></svg>`,
    unlockCriteria: 'Score 100% on all quizzes in a week.'
  },
  {
    id: 'hero-collector',
    name: 'Hero Collector',
    description: 'Unlock all characters',
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#34d399" stroke="#059669" stroke-width="4"/><text x="24" y="30" text-anchor="middle" font-size="18" fill="#fff" font-family="Arial">🦸</text></svg>`,
    unlockCriteria: 'Unlock every playable character.'
  },
  {
    id: 'debug-master',
    name: 'Debug Master',
    description: "Use the code editor's debug feature",
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="#facc15" stroke="#ca8a04" stroke-width="4"/><text x="24" y="30" text-anchor="middle" font-size="18" fill="#fff" font-family="Arial">🔍</text></svg>`,
    unlockCriteria: 'Use the debug feature in the code editor.'
  }
]; 