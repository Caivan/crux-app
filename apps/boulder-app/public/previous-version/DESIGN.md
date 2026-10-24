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

## Existing implementation cues

- `styles.css` defines the UI palette, surfaces, outlines, shadows, and responsive layout.
- `wall-illustration.svg` provides the climbing-gym background art.
- `app.js` contains inline SVG artwork for holds, boulders, climbers, crew, and climbing shoes.

When adding a new visual element, match the hand-drawn outline, pastel-plus-pop palette, and simple flat shading used by these assets.
