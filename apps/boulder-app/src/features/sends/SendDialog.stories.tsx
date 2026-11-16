import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../../styles/GlobalStyle';
import { cruxTheme } from '../../styles/theme';
import { DEMO_DATA } from '../../data/demoData';
import { SendDialog } from './SendDialog';

const tarantinoNames = [
  'Mia Wallace',
  'Vincent Vega',
  'Jules Winnfield',
  'The Bride',
  'Beatrix Kiddo',
  'Hans Landa',
  'Django Freeman',
  'Jackie Brown',
  'Cliff Booth',
  'Mr. Orange',
  'Mr. White',
  'Mr. Pink',
  'O-Ren Ishii',
  'Elle Driver',
  'Calvin Candie',
  'Shosanna Dreyfus',
  'Ordell Robbie',
  'Butch Coolidge',
  'Max Cherry',
  'Rick Dalton',
];

const storyData = {
  ...DEMO_DATA,
  members: DEMO_DATA.members.map((member, index) => ({ ...member, name: tarantinoNames[index] }))
    .concat(tarantinoNames.slice(DEMO_DATA.members.length).map((name, index) => ({
      id: `tarantino-member-${index + 1}`,
      name,
      email: `${name.toLowerCase().replaceAll(' ', '.')}@example.com`,
      color: (index + DEMO_DATA.members.length) % 8,
      role: 'member' as const,
      joinedAt: '2024-01-01',
    }))),
  crew: {
    ...DEMO_DATA.crew,
    memberIds: [
      ...DEMO_DATA.crew.memberIds,
      ...tarantinoNames.slice(DEMO_DATA.members.length).map((_, index) => `tarantino-member-${index + 1}`),
    ],
  },
};

const problem = storyData.problems[0];
const existingSend = storyData.sends[0];

const meta = {
  title: 'Boulder App/Send dialog',
  component: SendDialog,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <ThemeProvider theme={cruxTheme}>
        <GlobalStyle />
        <Story />
      </ThemeProvider>
    ),
  ],
  args: {
    data: storyData,
    sends: storyData.sends,
    edit: null,
    problem: null,
    gradeDisplay: 'color' as const,
    onClose: () => undefined,
    onSave: () => undefined,
  },
} satisfies Meta<typeof SendDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standalone: Story = {};

export const CatalogProblem: Story = {
  args: { problem },
};

export const LockedProblem: Story = {
  args: { problem, lockProblem: true },
};

export const EditSend: Story = {
  args: { edit: existingSend, problem: storyData.problems.find((item) => item.id === existingSend.problemId) ?? null },
};
