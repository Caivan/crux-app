# Crux Club visual design direction

Use this guide for future visual changes to the BoulderApp.

## Brand feeling

Build a playful, welcoming climbing-club identity for friends. The app should feel community-led and encouraging, with a little surreal humor. Keep it friendly rather than elite or overly competitive.

## Illustration style

- Use modern cartoon and playful comic art with clear, dark plum outlines.
- Favor simple silhouettes, confident hand-drawn curves, and large flat color shapes.
- Keep shading restrained. Use small highlights, texture marks, and soft shadows to add character without making illustrations look realistic.
- Bring climbing objects to life in small ways: expressive holds, curious eyes, chalky textures, curled shoe toes, and occasional tiny mushrooms or organic growth.
- Use the existing SVG artwork as the visual source of truth. Prefer editable, scalable SVG and CSS artwork for icons and interface illustrations.
- Keep recurring outlines and shapes consistent across holds, boulders, climbers, shoes, and decorative details.

## Color palette

Pair soft pastel surfaces with a few vivid climbing accents:

- Warm cream for readable content surfaces.
- Blush pink and lavender for the page atmosphere and secondary surfaces.
- Sky blue for selected climbing objects and illustrations.
- Poison-lime green, toxic purple, mustard yellow, and orange for holds, route grades, highlights, and small bursts of color.
- Deep plum or charcoal-plum for illustration outlines and text.

Use color to make grade and climber distinctions easy to scan. Keep text contrast strong and avoid placing bright accents behind small text.

## Interface principles

- Keep the interface clear and practical even when the artwork is whimsical.
- Use clean, readable type and predictable spacing for route lists, send logging, charts, and rankings.
- Cards and controls may have gently rounded corners, visible outlines, and small offset shadows that echo comic illustration.
- Use decorative art around the edges or in illustration areas; do not let it obstruct labels, chart data, or buttons.
- Make progress feel celebratory and personal. Competition should stay light and friendly.
- Preserve responsive layouts and ensure icons remain recognizable at both small UI sizes and when enlarged.

## Design-system implementation

- Raw color, typography, spacing, radius, and shadow values live in `packages/design-system/src/tokens/primitives.css`.
- Meaning-based roles live in `packages/design-system/src/tokens/semantic.css`.
- Component-level mappings live in `packages/design-system/src/tokens/components.css`.
- The default Crux palette is selected with `data-palette="crux"`; `summit` is an alternate palette for quick visual comparison.
- Shared React components and the SVG illustration library live in `packages/design-system/src/components` and `packages/design-system/src/illustrations`.
- App-only components and feature pages live in `apps/boulder-app/src/components` and `apps/boulder-app/src/features`; shared types live in `packages/shared-types`.
- App styling uses `styled-components` for scoped component styles and CSS custom properties from the design-system tokens for visual values. This keeps the requested CSS-in-JS workflow while preserving palette-wide token changes.

## Existing implementation cues

- `apps/boulder-app/src/styles/GlobalStyle.ts` applies global typography and layout defaults; feature components use `styled-components` and the shared tokens.
- `apps/boulder-app/public/wall-illustration.svg` provides the climbing-gym background art.
- `packages/design-system/src/illustrations` contains inline SVG artwork for holds, boulders, climbers, crew, and climbing shoes.

When adding a new visual element, match the hand-drawn outline, pastel-plus-pop palette, and simple flat shading used by these assets.
