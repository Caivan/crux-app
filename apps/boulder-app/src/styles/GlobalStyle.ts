import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html { min-width: 320px; background: var(--color-canvas); }
  body { margin: 0; color: var(--color-text-primary); background-color: var(--color-canvas); background-image: linear-gradient(color-mix(in srgb, var(--color-canvas) 20%, transparent), color-mix(in srgb, var(--color-canvas) 20%, transparent)), url('/wall-illustration.svg'); background-size: cover; background-position: center top; background-attachment: fixed; font: 400 14px/1.5 var(--font-family-body); }
  button, input, select, textarea { font: inherit; }
  button { color: inherit; }
  button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible { outline: 3px solid var(--color-outline); outline-offset: 3px; }
  a { color: inherit; }
  ::selection { color: var(--color-text-primary); background: #e6d9ea; }
  .avatar-wrap .avatar { display: inline-grid; width: 2.75rem; height: 2.75rem; border-radius: 50%; place-items: center; overflow: hidden; }
  .avatar-wrap .avatar-face { width: 100%; height: 100%; }
  .hold-icon { display: block; width: 34px; height: 32px; }
  .hold-icon-small { width: 24px; height: 22px; }
`;
