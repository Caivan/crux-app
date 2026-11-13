import { COLOR_GRADE_HUES, type Grade } from '@crux/shared-types';

export interface RgbColorSample { red: number; green: number; blue: number }

/** Pick a grade when a clear majority of route-tag color samples match its color. */
export function pickGradeFromRouteColor(samples: Iterable<RgbColorSample>): Grade | undefined {
  const chromaticVotes = new Map<Grade, number>();
  const neutralVotes = new Map<Grade, number>();

  for (const { red, green, blue } of samples) {
    const { hue, saturation, value } = toHsv(red, green, blue);
    if (saturation >= 0.28 && value >= 0.28) {
      let closestGrade: Grade | undefined;
      let closestDifference = Infinity;
      for (const [grade, gradeHue] of COLOR_GRADE_HUES) {
        if (gradeHue === null) continue; // Gray and Black are picked from neutral brightness below.
        const difference = hueDifference(hue, gradeHue);
        if (difference < closestDifference) {
          closestGrade = grade;
          closestDifference = difference;
        }
      }
      if (closestGrade && closestDifference <= 25) {
        chromaticVotes.set(closestGrade, (chromaticVotes.get(closestGrade) ?? 0) + 1);
      }
    } else if (saturation < 0.2) {
      const neutralGrade: Grade | undefined = value >= 0.38 && value <= 0.82
        ? 'Gray'
        : value >= 0.12 && value < 0.38
          ? 'Black'
          : undefined;
      if (neutralGrade) neutralVotes.set(neutralGrade, (neutralVotes.get(neutralGrade) ?? 0) + 1);
    }
  }

  return confidentWinner(chromaticVotes, 8) ?? confidentWinner(neutralVotes, 8);
}

function confidentWinner(votes: Map<Grade, number>, minimumVotes: number): Grade | undefined {
  const ranked = [...votes].sort((a, b) => b[1] - a[1]);
  const [winner, count] = ranked[0] ?? [];
  const runnerUp = ranked[1]?.[1] ?? 0;
  const total = ranked.reduce((sum, [, votesForGrade]) => sum + votesForGrade, 0);
  if (!winner || count < minimumVotes || count / total < 0.55 || (runnerUp > 0 && count / runnerUp < 1.3)) return undefined;
  return winner;
}

function hueDifference(first: number, second: number): number {
  const difference = Math.abs(first - second);
  return Math.min(difference, 360 - difference);
}

function toHsv(red: number, green: number, blue: number): { hue: number; saturation: number; value: number } {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;

  if (delta) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }
  if (hue < 0) hue += 360;
  return { hue, saturation: max === 0 ? 0 : delta / max, value: max };
}
