export const GRADE_ORDER = ['Green', 'Yellow', 'Blue', 'Red', 'Gray', 'Black', 'Purple'] as const;
export type Grade = (typeof GRADE_ORDER)[number];
export type GradeDisplay = 'color' | 'fontainebleau' | 'vscale';
export type AttemptCategory = 'flash' | 'second' | 'third-plus';
export type TimeRange = 'week' | 'month' | 'year';
export type AppSection = 'home' | 'problems' | 'crew' | 'profile';
export type SendKind = 'problem' | 'standalone';

export interface Member {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  color: number;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface Problem {
  id: string;
  name: string;
  grade: Grade;
  createdAt: string;
  creatorId: string | null;
  creatorDeleted?: boolean;
  qrIdentifier?: string;
  routeUrl?: string;
  isStandalone?: boolean;
  explorerIds: string[];
}

export interface Send {
  id: string;
  memberId: string;
  loggedBy?: string;
  crewId: string;
  problemId: string | null;
  grade: Grade;
  date: string;
  loggedAt: string;
  attempt: AttemptCategory;
  points: number;
  riskTaker: boolean;
}

export interface Crew {
  id: string;
  name: string;
  homeName: string;
  adminIds: string[];
  memberIds: string[];
}

export interface CruxData {
  crew: Crew;
  currentMemberId: string;
  members: Member[];
  problems: Problem[];
  sends: Send[];
}

export interface Invitation {
  id: string;
  crewId: string;
  createdBy: string;
  token: string;
  expiresAt: string;
  usedAt: string | null;
  usedBy: string | null;
}

export interface GradeDefinition {
  grade: Grade;
  fontainebleau: string;
  vscale: string;
  points: number;
}
