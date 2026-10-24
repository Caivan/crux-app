# @crux/design-system

Shared UI building blocks for Crux Club.

## Exports

- `@crux/design-system` exposes shared React primitives and illustration components.
- `@crux/design-system/tokens.css` exposes primitive, semantic, and component CSS tokens.
- `@crux/design-system/illustrations` exposes the editable SVG art generators.

## Storybook

Run `yarn storybook` from the repository root to open the component library at `http://localhost:6006`. Build a static catalog with `yarn build-storybook`.

Stories live next to the source they document. The catalog includes shared buttons and surfaces, climbing illustrations, and the semantic color, type, and spacing foundations. Use the Palette toolbar to preview the Crux and Summit semantic palettes.

The package is consumed as source by the Vite app. Keep app routes, local persistence, and page composition in `apps/boulder-app`; put reusable visual rules and primitives here.

## Token layers

- `src/tokens/primitives.css`: palette values, type scale, spacing scale, radii, and shadows.
- `src/tokens/semantic.css`: interface roles, including the Crux and Summit palettes.
- `src/tokens/components.css`: values specific to shared controls and surfaces.

Change the palette on the frontend `<html>` element with `data-palette="crux"` or `data-palette="summit"`. New palettes should override semantic roles and keep component token names stable.
