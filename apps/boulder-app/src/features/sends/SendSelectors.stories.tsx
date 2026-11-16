import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import type { Grade } from '@crux/shared-types';
import { GradePicker } from './GradePicker';
import { ClimberPicker } from './ClimberPicker';
import { cruxTheme } from '../../styles/theme';

const members = [
  { name: 'You', joinedAt: '1992-10-23' }, // Reservoir Dogs release
  { name: 'Mia Wallace', joinedAt: '1994-10-14' }, // Pulp Fiction release
  { name: 'Vincent Vega', joinedAt: '1992-10-23' },
  { name: 'The Bride', joinedAt: '2003-10-10' }, // Kill Bill: Vol. 1 release
  { name: 'Beatrix Kiddo', joinedAt: '2004-04-16' }, // Kill Bill: Vol. 2 release
  { name: 'Jules Winnfield', joinedAt: '1994-10-14' },
  { name: 'Hans Landa', joinedAt: '2009-08-21' }, // Inglourious Basterds release
  { name: 'Django Freeman', joinedAt: '2012-12-25' }, // Django Unchained release
  { name: 'Mr. Orange', joinedAt: '1992-10-23' },
  { name: 'Jackie Brown', joinedAt: '1997-12-25' }, // Jackie Brown release
  { name: 'Cliff Booth', joinedAt: '2019-07-26' }, // Once Upon a Time in Hollywood release
].map(({ name, joinedAt }, index) => ({
  id: index === 0 ? 'you' : `member-${index}`,
  name,
  color: index % 8,
  role: 'member' as const,
  joinedAt,
}));

function SendSelectorsStory() {
  const [grade, setGrade] = useState<Grade>('Green');
  const [memberId, setMemberId] = useState('you');

  return (
    <ThemeProvider theme={cruxTheme}>
      <div
        style={{
          maxWidth: 300,
          padding: 16,
          display: 'grid',
          gap: 24,
          background: 'var(--color-surface)',
          borderRadius: 16,
        }}
      >
        <section>
          <div
            style={{
              marginBottom: 8,
              color: 'var(--color-text-muted)',
              font: '500 11px var(--font-family-mono)',
              letterSpacing: '.08em',
            }}
          >
            Level completed
          </div>
          <GradePicker value={grade} onChange={setGrade} />
        </section>
        <ClimberPicker
          members={members}
          currentMemberId="you"
          value={memberId}
          onChange={setMemberId}
        />
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 12 }}>
          Both selectors show at most two rows; scroll within either selector to reach more options.
        </p>
      </div>
    </ThemeProvider>
  );
}

const meta = { title: 'Boulder App/Send selectors', component: SendSelectorsStory } satisfies Meta<
  typeof SendSelectorsStory
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TwoRowsThenScroll: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gradeGroup = canvas.getByRole('radiogroup', { name: 'Level completed' });
    const climberGroup = canvas.getByRole('radiogroup', { name: 'Climber who sent the problem' });

    await userEvent.click(within(gradeGroup).getByRole('radio', { name: 'Blue, 30 points' }));
    await expect(
      within(gradeGroup).getByRole('radio', { name: 'Blue, 30 points' }),
    ).toHaveAttribute('aria-checked', 'true');
    expect(gradeGroup.scrollHeight).toBeGreaterThan(gradeGroup.clientHeight);
    gradeGroup.scrollTop = gradeGroup.scrollHeight;
    expect(gradeGroup.scrollTop).toBeGreaterThan(0);
    await expect(
      within(gradeGroup).getByRole('radio', { name: 'Purple, 100 points' }),
    ).toBeVisible();

    await userEvent.click(within(climberGroup).getByRole('radio', { name: 'Mia Wallace' }));
    await expect(within(climberGroup).getByRole('radio', { name: 'Mia Wallace' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(climberGroup.scrollHeight).toBeGreaterThan(climberGroup.clientHeight);
    climberGroup.scrollTop = climberGroup.scrollHeight;
    expect(climberGroup.scrollTop).toBeGreaterThan(0);
    await expect(within(climberGroup).getByRole('radio', { name: 'Cliff Booth' })).toBeVisible();
  },
};
