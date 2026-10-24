import type { AttemptCategory, GradeDefinition } from '@crux/shared-types';

export const GRADES: GradeDefinition[] = [
  { grade: 'Green', fontainebleau: '3', vscale: 'VB', points: 10 },
  { grade: 'Yellow', fontainebleau: '4', vscale: 'V0', points: 20 },
  { grade: 'Blue', fontainebleau: '5 to 5+', vscale: 'V1 to V2', points: 30 },
  { grade: 'Red', fontainebleau: '6A to 6B', vscale: 'V3 to V4', points: 50 },
  { grade: 'Gray', fontainebleau: '6B+ to 6C+', vscale: 'V5 to V6', points: 80 },
  { grade: 'Black', fontainebleau: '7A to 7B', vscale: 'V6 to V8', points: 130 },
  { grade: 'Purple', fontainebleau: '7B+ to 8C+', vscale: 'V9 to V16', points: 210 },
];

export const ATTEMPTS: { id: AttemptCategory; label: string; detail: string; multiplier: number }[] = [
  { id: 'flash', label: 'Flash', detail: 'First try', multiplier: 1.3 },
  { id: 'second', label: 'Second attempt', detail: 'Second try', multiplier: 1 },
  { id: 'third-plus', label: 'Third or later', detail: '3+ tries', multiplier: 0.8 },
];

export const GRADE_COLORS: Record<string, string> = {
  Green: 'var(--color-grade-green)', Yellow: 'var(--color-grade-yellow)', Blue: 'var(--color-grade-blue)',
  Red: 'var(--color-grade-red)', Gray: 'var(--color-grade-gray)', Black: 'var(--color-grade-black)', Purple: 'var(--color-grade-purple)',
};
export const GRADE_TINTS: Record<string, string> = {
  Green: '#e4eee0', Yellow: '#f4edcd', Blue: '#dce9f0', Red: '#f2dfd9', Gray: '#e9e9e5', Black: '#e5e5df', Purple: '#eadcf0',
};
export const MEMBER_COLORS = ['#477b57', '#de915f', '#6b91a1', '#b27366', '#82867d', '#a489b5'];

export const gradeLabel = (grade: string, system: 'color' | 'fontainebleau' | 'vscale' = 'color') => {
  const definition = GRADES.find((item) => item.grade === grade);
  if (!definition) return grade;
  return system === 'fontainebleau' ? definition.fontainebleau : system === 'vscale' ? definition.vscale : definition.grade;
};

export const pointsForSend = (grade: string, attempt: AttemptCategory, riskTaker = false) => {
  const base = GRADES.find((item) => item.grade === grade)?.points ?? 0;
  const multiplier = ATTEMPTS.find((item) => item.id === attempt)?.multiplier ?? 1;
  return Math.round(base * multiplier) + (riskTaker ? 5 : 0);
};
