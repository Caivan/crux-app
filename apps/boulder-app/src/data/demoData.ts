import type { CruxData, Grade, Problem, Send } from '@crux/shared-types';
import { localDateString } from '../domain/date';
import { pointsForSend } from '../domain/catalog';

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return localDateString(date);
};

const problems: Problem[] = [
  ['p-01', 'Soft landing', 'Green', 40, 'maya'], ['p-02', 'Pocket change', 'Yellow', 36, 'leo'], ['p-03', 'Easy does it', 'Yellow', 32, 'jonas'],
  ['p-04', 'Blue hour', 'Blue', 29, 'maya'], ['p-05', 'Side quest', 'Blue', 26, 'leo'], ['p-06', 'The long way', 'Red', 23, 'you'],
  ['p-07', 'Static electricity', 'Gray', 21, 'jonas'], ['p-08', 'One more move', 'Green', 19, 'maya'], ['p-09', 'Hold my chalk', 'Black', 16, 'leo'],
  ['p-10', 'Mushroom kingdom', 'Blue', 14, 'you'], ['p-11', 'Tiny victories', 'Green', 12, 'jonas'], ['p-12', 'Purple haze', 'Purple', 10, 'maya'],
  ['p-13', 'Gravity snacks', 'Yellow', 8, 'leo'], ['p-14', 'Good noodles', 'Red', 6, 'you'], ['p-15', 'Slabsolutely', 'Gray', 4, 'jonas'],
  ['p-16', 'Moon shoes', 'Black', 3, 'maya'], ['p-17', 'Chalk and awe', 'Blue', 2, 'leo'], ['p-18', 'The crux of it', 'Purple', 1, 'you'],
].map(([id, name, grade, age, creator]) => ({
  id: String(id), name: String(name), grade: grade as Grade, createdAt: daysAgo(Number(age)), creatorId: String(creator),
  qrIdentifier: `crux-route-${id}`, routeUrl: `https://beta7.app/route/crux-route-${id}/`, explorerIds: [String(creator)],
}));

const sendRows: [string, number, string, Grade, 'flash' | 'second' | 'third-plus'][] = [
  ['maya', 28, 'p-02', 'Yellow', 'flash'], ['leo', 26, 'p-01', 'Green', 'second'], ['you', 24, 'p-01', 'Green', 'flash'], ['jonas', 23, 'p-03', 'Yellow', 'second'],
  ['maya', 22, 'p-04', 'Blue', 'flash'], ['you', 20, 'p-03', 'Yellow', 'second'], ['leo', 18, 'p-04', 'Blue', 'second'], ['maya', 17, 'p-05', 'Blue', 'third-plus'],
  ['jonas', 16, 'p-05', 'Blue', 'flash'], ['you', 15, 'p-04', 'Blue', 'second'], ['leo', 14, 'p-06', 'Red', 'second'], ['maya', 13, 'p-06', 'Red', 'flash'],
  ['jonas', 12, 'p-07', 'Gray', 'third-plus'], ['you', 11, 'p-08', 'Green', 'flash'], ['maya', 10, 'p-08', 'Green', 'second'], ['leo', 9, 'p-09', 'Black', 'third-plus'],
  ['jonas', 8, 'p-09', 'Black', 'second'], ['you', 7, 'p-10', 'Blue', 'flash'], ['maya', 6, 'p-10', 'Blue', 'second'], ['leo', 5, 'p-11', 'Green', 'flash'],
  ['jonas', 4, 'p-12', 'Purple', 'third-plus'], ['maya', 3, 'p-12', 'Purple', 'second'], ['you', 2, 'p-13', 'Yellow', 'flash'], ['leo', 1, 'p-14', 'Red', 'second'],
  ['maya', 0, 'p-15', 'Gray', 'flash'], ['you', 0, 'p-16', 'Black', 'third-plus'],
];

const memberIds: Record<string, string> = { you: 'member-you', maya: 'member-maya', leo: 'member-leo', jonas: 'member-jonas', ivancho: 'member-ivancho' };

const initialSends: Send[] = sendRows.map(([who, days, problemId, grade, attempt], index) => ({
  id: `send-${String(index + 1).padStart(2, '0')}`, memberId: memberIds[who], loggedBy: memberIds[who], crewId: 'crew-amurados', problemId, grade,
  date: daysAgo(days), loggedAt: `${daysAgo(days)}T12:00:00.000Z`, attempt, points: pointsForSend(grade, attempt), riskTaker: false,
}));

export const DEMO_DATA: CruxData = {
  crew: { id: 'crew-amurados', name: 'Amurados', homeName: 'Crux Halle', adminIds: ['member-you'], memberIds: Object.values(memberIds) },
  currentMemberId: 'member-you',
  members: [
    { id: 'member-you', name: 'You', email: 'climber@example.com', color: 0, role: 'admin', joinedAt: daysAgo(90) },
    { id: 'member-maya', name: 'Maya', color: 2, role: 'member', joinedAt: daysAgo(72) },
    { id: 'member-leo', name: 'Leo', color: 1, role: 'member', joinedAt: daysAgo(68) },
    { id: 'member-jonas', name: 'Jonas', color: 3, role: 'member', joinedAt: daysAgo(63) },
    { id: 'member-ivancho', name: 'Ivancho', color: 5, role: 'member', joinedAt: daysAgo(14) },
  ],
  problems,
  sends: initialSends,
};

export const DEMO_STORAGE_KEY = 'crux-club-product-v2';
