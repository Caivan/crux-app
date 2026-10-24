/**
 * Mobile-first screen widths and matching min-width media queries.
 * Keep these in sync with the Breakpoints story and design-system guide.
 */
export const breakpoints = {
  xs: '320px',
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1312px',
};

export const mediaQueries = Object.fromEntries(
  Object.entries(breakpoints).map(([name, width]) => [name, `(min-width: ${width})`]),
);
