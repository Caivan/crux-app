import { Surface } from './Surface.jsx';

const meta = {
  title: 'Components/Surface',
  component: Surface,
  tags: ['autodocs'],
  args: { children: 'A shared card surface for stats, problem details, and profile sections.' },
  argTypes: { as: { control: 'select', options: ['section', 'article', 'div'] } },
};

export default meta;

export const Default = {};
export const WithHeading = {
  render: () => <Surface><span className="storybook-label">The climb, over time</span><h2 style={{ margin: '0.5rem 0' }}>Crew progress</h2><p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>A reusable surface styled with semantic and component tokens.</p></Surface>,
};
