export interface CruxTheme {
  color: {
    canvas: string; surface: string; surfaceSubtle: string; text: string; muted: string;
    border: string; primary: string; primaryHover: string; green: string; highlight: string;
  };
  space: { xs: string; sm: string; md: string; lg: string; xl: string; section: string };
  radius: { control: string; card: string; dialog: string; pill: string };
  shadow: { card: string; dialog: string };
  type: { body: string; display: string; mono: string };
}

export const cruxTheme: CruxTheme = {
  color: {
    canvas: 'var(--color-canvas)', surface: 'var(--color-surface)', surfaceSubtle: 'var(--color-surface-subtle)',
    text: 'var(--color-text-primary)', muted: 'var(--color-text-secondary)', border: 'var(--color-border)',
    primary: 'var(--color-action-primary)', primaryHover: 'var(--color-action-primary-hover)', green: 'var(--color-highlight)', highlight: 'var(--color-highlight-strong)',
  },
  space: { xs: 'var(--primitive-space-1)', sm: 'var(--primitive-space-2)', md: 'var(--primitive-space-4)', lg: 'var(--primitive-space-6)', xl: 'var(--primitive-space-8)', section: 'var(--space-section-gap)' },
  radius: { control: 'var(--radius-control)', card: 'var(--radius-card)', dialog: 'var(--radius-dialog)', pill: 'var(--primitive-radius-pill)' },
  shadow: { card: 'var(--shadow-card)', dialog: 'var(--shadow-dialog)' },
  type: { body: 'var(--font-family-body)', display: 'var(--font-family-display)', mono: 'var(--font-family-mono)' },
};

declare module 'styled-components' {
  export interface DefaultTheme extends CruxTheme {}
}
