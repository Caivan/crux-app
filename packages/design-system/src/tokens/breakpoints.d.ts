export type BreakpointName = 'compact' | 'narrow' | 'mobile' | 'tablet' | 'wide';

export const breakpoints: Readonly<Record<BreakpointName, `${number}px`>>;
