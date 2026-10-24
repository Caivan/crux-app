# Crux Club

Crux Club is a private, mobile-first bouldering log for the Amurados crew. Members can scan route QR codes, add problems to the shared catalog, log completed sends, and follow personal and crew progress.

## Monorepo

```text
apps/boulder-app/             React 19 + TypeScript + Vite app
packages/design-system/       Tokens, reusable components, SVG art, Storybook
packages/backend-services/    Supabase authentication and data services
packages/shared-types/        Shared domain types
supabase/migrations/          Database schema, scoring, RPCs, and RLS
archive/current-react-app/    Snapshot of the React app before the product rebuild
```

Yarn workspaces and Turborepo coordinate builds. The React app is written in strict TypeScript and organized by feature. UI styling uses `styled-components`; the CSS-in-JS components read CSS custom properties from the design-system token layers. This keeps component styles scoped and makes palette changes flow through primitive, semantic, and component tokens.

## Run locally

Use Node 20.19+ or 22.12+ with Yarn 4.9.2:

```sh
yarn install
yarn dev
```

The app starts in a local demo mode when Supabase is not configured. Demo changes persist in this browser only. To run Storybook and see the design-system documentation:

```sh
yarn storybook
yarn build-storybook
```

Other useful commands are `yarn build` for the monorepo production build and `yarn workspace @crux/boulder-app build` to type-check and build the frontend.

## Connect Supabase

1. Create a Supabase project and enable Google under Authentication providers. Add the local and production callback URLs to the Google and Supabase OAuth settings.
2. Run [`supabase/migrations/202610240001_crux_core.sql`](./supabase/migrations/202610240001_crux_core.sql) in the Supabase SQL editor (or with the Supabase CLI).
3. Create `apps/boulder-app/.env.local` from `.env.example` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Sign into the app once with the Google account that should administer Amurados. In the Supabase SQL editor, use that account's email to bootstrap the pre-created crew membership:

   ```sql
   insert into public.crew_members (crew_id, user_id, role)
   select c.id, p.id, 'admin'
   from public.crews c
   join public.profiles p on lower(p.email) = lower('your-google-email@example.com')
   where c.name = 'Amurados'
   on conflict (user_id) do update set role = 'admin';
   ```

   The migration creates Amurados with Crux Halle as its home gym. No gym management or crew-creation flow is included in this MVP.
5. Restart `yarn dev`, sign in with Google, then create a seven-day, single-use invite from the crew app.

The frontend uses `@crux/backend-services` for Google auth, crew snapshots, invitations, problem creation, and send mutations. Supabase row-level security protects private crew membership and send data. Do not expose a service-role key in the frontend.

## Product behavior

- Problems are global catalog records. The catalog is newest-first with grade and creation-date filters and 50 results per page. Crew activity only includes sends logged by that crew.
- QR IDs are the complete URL path segment following `/route/`, including a `~` suffix. Confirm this rule against additional gym QR formats before depending on it.
- Sends may link to a catalog problem or be standalone. Logging defaults to your own profile, with an avatar picker to record a send for another crew member. The person who recorded an entry can edit or delete it; the original send date is retained when edited.
- Grade labels can be displayed as Crux colors, Fontainebleau, or V-scale. Points are grade base points multiplied by the attempt category multiplier and rounded. The first send on a shared problem earns a one-time +5 Risk Taker bonus; deleting that send passes the bonus to the next earliest send. Explorer is a non-scoring insignia.
- Weekly charts show daily data, monthly charts show weekly buckets, and yearly charts show monthly buckets. The dashboard and member profiles support grade filters; crew charts also support a member filter.
- Account deletion removes the member's sends and anonymizes their created problems. Leaving a crew removes membership and access to that crew's data.

## Design system

The full product requirements are kept in [docs/PRODUCT.md](./docs/PRODUCT.md). Design guidance and token layers are documented in [DESIGN.md](./DESIGN.md) and rendered in Storybook under **Design System**. The design system contains primitive, semantic, and component tokens, shared UI, the hold and boulder icon library, climber illustrations, and palette previews. Crux is the default palette; Summit is an alternate palette for quick comparison.
