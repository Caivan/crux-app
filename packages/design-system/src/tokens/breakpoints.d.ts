export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const breakpoints: Readonly<Record<BreakpointName, `${number}px`>>;
export const mediaQueries: Readonly<Record<BreakpointName, string>>;
