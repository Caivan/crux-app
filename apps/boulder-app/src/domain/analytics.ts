import type { Grade, Member, Send, TimeRange } from '@crux/shared-types';
import { GRADES, pointsForSend } from './catalog';

export const currentMonthSends = (sends: Send[], now = new Date()) => sends.filter((send) => {
  const date = new Date(`${send.date}T12:00:00`);
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
});

export const withAwards = (sends: Send[]): Send[] => {
  const earliestByProblem = new Map<string, Send>();
  for (const send of [...sends].filter((item) => item.problemId).sort((a, b) => a.loggedAt.localeCompare(b.loggedAt) || a.id.localeCompare(b.id))) {
    if (send.problemId && !earliestByProblem.has(send.problemId)) earliestByProblem.set(send.problemId, send);
  }
  return sends.map((send) => {
    const riskTaker = Boolean(send.problemId && earliestByProblem.get(send.problemId)?.id === send.id);
    return { ...send, riskTaker, points: pointsForSend(send.grade, send.attempt, riskTaker) };
  });
};

export const monthlyLeaderboard = (members: Member[], sends: Send[], now = new Date()) => {
  const month = currentMonthSends(sends, now);
  return members.map((member) => {
    const ownSends = month.filter((send) => send.memberId === member.id);
    return { member, points: ownSends.reduce((sum, send) => sum + send.points, 0), sends: ownSends.length };
  }).sort((a, b) => b.points - a.points || b.sends - a.sends || a.member.name.localeCompare(b.member.name));
};

export const gradeBreakdown = (sends: Send[]) => GRADES.map(({ grade }) => ({ grade, count: sends.filter((send) => send.grade === grade).length, points: sends.filter((send) => send.grade === grade).reduce((sum, send) => sum + send.points, 0) }));

export interface ChartPoint { label: string; date: string; bucketIndex: number; sends: number; hardest: Grade | null; }

export const sendMatchesChartPoint = (sendDate: string, point: ChartPoint, range: TimeRange) => {
  const date = new Date(`${sendDate.slice(0, 10)}T12:00:00`);
  const pointDate = new Date(point.date);
  if (range === 'week') return date.toDateString() === pointDate.toDateString();
  if (range === 'month') return date.getFullYear() === pointDate.getFullYear() && date.getMonth() === pointDate.getMonth() && Math.floor((date.getDate() - 1) / 7) === point.bucketIndex;
  return date.getFullYear() === pointDate.getFullYear() && date.getMonth() === pointDate.getMonth();
};

export const chartPoints = (sends: Send[], range: TimeRange, now = new Date()): ChartPoint[] => {
  const count = range === 'week' ? 7 : range === 'month' ? Math.ceil(now.getDate() / 7) : 12;
  const periods = Array.from({ length: count }, (_, index) => {
    const date = new Date(now);
    date.setHours(12, 0, 0, 0);
    if (range === 'week') date.setDate(date.getDate() - (count - index - 1));
    else if (range === 'month') date.setDate(index * 7 + 1);
    else date.setMonth(date.getMonth() - (count - index - 1), 1);
    return date;
  });
  const gradeRank = new Map(GRADES.map((item, index) => [item.grade, index]));
  return periods.map((date, bucketIndex) => {
    const matches = sends.filter((send) => sendMatchesChartPoint(send.date, { date: date.toISOString(), bucketIndex, label: '', sends: 0, hardest: null }, range));
    const hardest = matches.reduce<Grade | null>((current, item) => (current === null || (gradeRank.get(item.grade) ?? -1) > (gradeRank.get(current) ?? -1) ? item.grade : current), null);
    return { date: date.toISOString(), bucketIndex, label: range === 'week' ? date.toLocaleDateString('en', { weekday: 'short' }) : range === 'year' ? date.toLocaleDateString('en', { month: 'short' }) : `W${bucketIndex + 1}`, sends: matches.length, hardest };
  });
};
