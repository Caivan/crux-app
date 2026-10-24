const meta = { title: 'Foundations/Design Tokens', tags: ['autodocs'] };
export default meta;

const colors = [
  ['Canvas', '--color-canvas'], ['Surface', '--color-surface'], ['Subtle surface', '--color-surface-subtle'],
  ['Primary text', '--color-text-primary'], ['Secondary text', '--color-text-secondary'], ['Border', '--color-border'],
  ['Action', '--color-action-primary'], ['Highlight', '--color-highlight'], ['Green', '--color-grade-green'],
  ['Yellow', '--color-grade-yellow'], ['Blue', '--color-grade-blue'], ['Red', '--color-grade-red'],
  ['Gray', '--color-grade-gray'], ['Black', '--color-grade-black'], ['Purple', '--color-grade-purple'],
];

export const ColorPalette = {
  render: () => <div className="storybook-stack" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>{colors.map(([name, token]) => <div className="card" style={{ padding: 0, overflow: 'hidden' }} key={token}><div style={{ height: 70, background: `var(${token})` }} /><div style={{ padding: 12 }}><strong>{name}</strong><div className="storybook-label" style={{ marginTop: 6 }}>{token}</div></div></div>)}</div>,
};

export const TypeScale = {
  render: () => <div className="storybook-stack">{[['Hero', '--font-size-hero'], ['Display', '--font-size-display'], ['Heading', '--font-size-heading'], ['Body', '--font-size-body'], ['Label', '--font-size-label']].map(([label, token]) => <div key={token}><span className="storybook-label">{label} · {token}</span><div style={{ fontSize: `var(${token})` }}>The wall is yours</div></div>)}</div>,
};

export const SpacingScale = {
  render: () => <div className="storybook-stack">{['1', '2', '3', '4', '5', '6', '8', '10', '12'].map((step) => <div key={step} className="storybook-row"><span className="storybook-label" style={{ width: 110 }}>space {step}</span><div style={{ height: 18, width: `var(--primitive-space-${step})`, minWidth: 1, background: 'var(--color-highlight)', borderRadius: 3 }} /><code>var(--primitive-space-{step})</code></div>)}</div>,
};
