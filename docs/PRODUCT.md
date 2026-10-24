# Crux Club — Full Product Definition

## Product overview

**Crux Club is a private, mobile-first bouldering app for a group of friends.** Members sign in with Google, join a crew through an invitation, and log completed sends by scanning route QR codes or entering sends manually. They can follow their personal progress and the crew’s activity through statistics, charts, and a monthly points leaderboard.

The app should make climbing social and encouraging. Its leaderboard adds friendly competition without turning Crux Club into a high-pressure training platform.

## Product and crew terminology

- **Crux Halle** is the app’s crew-home section.
- **Amurados** is the first crew’s name.
- The Amurados crew is created before launch, with you assigned as its admin.
- The MVP has no crew-creation flow and supports one crew per user. Supporting multiple crews per user may come later.

## Users, sign-in, and membership

- Google is the MVP’s only sign-in provider.
- New users must accept an invitation before they can access crew information or log sends.
- Only admins can invite people.
- Invitations use shareable, single-use links that expire after seven days.
- Members can leave the crew; admins can remove members.
- Members can view one another’s activity.
- Users can delete their accounts. Deletion removes their account and all their send history. Problems they created remain in the global catalog, with their creator shown as deleted or anonymous.
- Comments, reactions, messaging, and notifications are out of scope for the MVP.

## Global problem catalog

Problems are **global records, not crew-owned records**. A problem is created once and is available in the app’s catalog. It appears in a crew’s activity only after a member of that crew logs a send on it.

The Problems section displays the global catalog. Members can filter it by difficulty and creation date. Results are paginated, with the **50 most recently created problems per page**.

Gym management is out of scope for the MVP. A future release may allow a problem to have an optional gym association.

## QR-code workflows

Every gym route has a QR code. Scanning takes place inside Crux Club. The app uses the QR URL and an extracted route identifier to find or create a global problem.

When a member scans a code:

1. Crux Club checks whether a problem with that QR identifier already exists.
2. If it exists, the member can open it and log a send.
3. If it does not exist, the member selects a color grade. Crux Club creates the global problem with a randomly generated default name that the member can edit.
4. The member can create the problem without logging a send, or create it and log a send in the same flow.
5. The creator receives the **Explorer insignia** on that problem. Explorer is an insignia and awards no points.

The problem detail view stores and displays the original route URL. Tapping the link opens the route page in an external browser.

For the MVP, treat the **entire URL segment after `/route/`** as the QR identifier, including any `~` suffix. Confirm this assumption against additional QR codes before relying on it permanently.

Example QR URL:

`https://beta7.app/route/N7tz40jSLXeKJUNdKbiwTHKvn4t1~1788878804445/`

## Send logging

Members can record completed sends in three ways:

- **Scan a QR code:** Find an existing problem or create a new one, then optionally log a send.
- **Select a catalog problem:** Log a send against an existing global problem. This is the usual manual flow when the problem already exists.
- **Log a standalone manual send:** Record a completed send by selecting its grade and attempt category without linking it to a catalog problem.

A standalone manual send does not create a shared problem. It counts toward the member’s and crew’s statistics and points, and appears in crew activity as a standalone manual send.

The MVP records completed sends only; unsuccessful attempts are not tracked. Members can edit or delete their own sends, but cannot edit a send’s date. Changing a send’s grade recalculates its points immediately.

Each send is associated with a member and crew and may optionally reference a global problem. A problem appears in a crew’s activity only after a member of that crew sends it.

## Difficulty scale and scoring

Crux Club uses an app-wide difficulty scale. Members can choose to display grades as Crux Club colors, Fontainebleau grades, or V-scale grades.

| Crux Club color | Fontainebleau | V-scale | Base points |
|---|---|---|---:|
| Green | 3 | VB | 10 |
| Yellow | 4 | V0 | 20 |
| Blue | 5 to 5+ | V1 to V2 | 30 |
| Red | 6A to 6B | V3 to V4 | 50 |
| Gray | 6B+ to 6C+ | V5 to V6 | 80 |
| Black | 7A to 7B | V6 to V8 | 130 |
| Purple | 7B+ to 8C+ | V9 to V16 | 210 |

Base points follow a Fibonacci-style sequence multiplied by 10.

### Attempt categories

When logging a completed send, members choose one category:

| Result | Attempts | Multiplier |
|---|---:|---:|
| Flash | 1 | 1.3× |
| Second attempt | 2 | 1.0× |
| Third or later | 3 or more | 0.8× |

Calculate points as **grade base points × attempt multiplier**, rounded to the nearest whole point.

### Risk Taker

The first climber to send a shared catalog problem earns **5 extra points**, awarded only once per problem ever. Add this fixed bonus after applying the attempt multiplier. It is not multiplied by grade or attempts.

For example, the first climber to flash a Blue problem earns `30 × 1.3 + 5 = 44` points.

Standalone manual sends have no shared problem, so they do not qualify for Risk Taker.

If the send earning the Risk Taker bonus is deleted, the product still needs a rule for whether that bonus passes to the next earliest send or disappears.

### Explorer

The member who creates a problem by scanning its unregistered QR code earns an **Explorer insignia** on that problem. Explorer awards no points. The same member can earn Explorer and Risk Taker by creating a problem and logging its first send.

## App sections

### Crux Halle — crew home

Crux Halle is the default crew-home section and shows activity for the **Amurados** crew.

It displays:

- Crew member count.
- Hardest send in the current calendar month.
- Total crew sends.
- The five latest sends in **Fresh Sends**.
- A monthly leaderboard showing the top five members by points.
- Crew activity charts, with a member filter.

Monthly leaderboard points are calculated from sends dated within that calendar month. The leaderboard starts fresh each month; historical sends and scores are retained for future monthly, yearly, and all-time views.

### Your Crew

Your Crew displays the full leaderboard for the current period. Include all members in a table ordered by points from highest to lowest, showing each member’s points and send count at each difficulty level.

The current calendar month is the MVP period. Browsing historical monthly, yearly, or all-time rankings is a future feature.

### Problems

Problems displays the global catalog, including problems that no member of the current crew has sent. Members can filter by grade and creation date. Show 50 problems per page, ordered from newest to oldest.

A problem detail view can show its grade, original route link, Explorer insignia, and sends. The original route link opens in an external browser.

### Member profiles

Members can view one another’s activity. Profiles show points, recent sends, grade breakdown, and progress charts.

## Charts and statistics

Personal profiles and Crux Halle use the same core chart types. Crew charts also provide a member filter.

Charts support **weekly, monthly, and yearly** views, with weekly as the default.

1. **Sends by level over time:** Show the count of sends at each grade in each time bucket. Allow filtering by grade and switching grade labels between Crux Club colors, Fontainebleau, and V-scale. Grade filters are colored buttons with a boulder-hold icon.
2. **Highest level over time:** Show the hardest grade sent in each time bucket, using the selected grade classification.

Use these time buckets:

- **Weekly view:** daily data points across the week.
- **Monthly view:** weekly data points across the month.
- **Yearly view:** monthly data points across the year.

## Look and feel

Crux Club should feel like a playful, welcoming climbing club for friends: community-led and encouraging, with a touch of surreal humor. Keep it friendly rather than elite or overly competitive. Progress should feel personal and celebratory.

### Illustration style

Use modern cartoon and comic-inspired illustrations with clear, dark plum outlines, simple silhouettes, confident hand-drawn curves, and large areas of flat color. Keep shading restrained. Use small highlights, texture marks, and soft shadows without making illustrations look realistic.

Give climbing details personality with expressive holds, curious eyes, chalky textures, curled shoe toes, and occasional tiny mushrooms or organic growth. Use the existing SVG artwork as the visual source of truth. Prefer editable, scalable SVG and CSS artwork for icons and interface illustrations, and keep recurring shapes and outlines consistent across holds, boulders, climbers, shoes, and decorative details.

### Color palette

Pair soft pastel surfaces with vivid climbing accents:

- **Warm cream** for readable content surfaces.
- **Blush pink and lavender** for atmosphere and secondary surfaces.
- **Sky blue** for selected climbing objects and illustrations.
- **Poison-lime green, toxic purple, mustard yellow, and orange** for holds, grade markers, highlights, and small bursts of color.
- **Deep plum or charcoal-plum** for text and illustration outlines.

Use color to make grades and climbers easy to scan. Maintain strong text contrast, and avoid putting bright accents behind small text.

### Interface principles

Keep the interface clear and practical even when the artwork is whimsical. Use clean, readable type and predictable spacing for problem lists, send logging, charts, and rankings. Cards and controls can have gently rounded corners, visible outlines, and small offset shadows that echo the comic style.

Place decorative art around the edges or in illustration areas so it does not obstruct labels, chart data, or controls. Preserve responsive layouts, make icons recognizable at small and large sizes, and make scanning and logging sends quick on mobile.

## Technical architecture

Build Crux Club as a scalable **monorepo** that keeps the responsive web app, shared design system, and backend services clearly separated. Organize code into reusable modules and components so the MVP is maintainable and future features can grow without tightly coupling the interface to backend details.

### Monorepo packages

The monorepo should contain:

- **Responsive web app:** A mobile-first React application organized by feature and built from reusable components.
- **Shared design system:** General UI components, design tokens, bouldering-themed icons and illustrations, and Storybook documentation.
- **Backend services:** A separate layer for services that communicate with Supabase. UI components and pages call these services rather than embedding database or authentication operations directly.
- **Shared types and utilities:** Common data types, validation, and utilities where they are genuinely shared.

Keep clear boundaries between the web app, design system, and backend services. Reuse common code without creating unnecessary dependencies between features.

### Design system

The design system provides the shared visual and component foundation:

- **Reusable components** for common patterns such as buttons, forms, cards, dialogs, navigation, tables, and charts.
- **Design tokens** for colors, typography, spacing, sizing, radii, shadows, and other visual roles. Structure tokens into primitive, semantic, and component layers so the palette and visual language can evolve consistently.
- **Bouldering-themed icons and illustrations**, including grade-colored holds and other climbing visuals.
- **Storybook** to document and preview components, tokens, and variants independently from the full app.

Components should be responsive, accessible, consistent with the Crux Club visual direction, and flexible enough for future features.

### Web application

Build a responsive, **mobile-first** web app. Organize it by feature and keep pages, reusable UI components, application logic, and data access in clear modules. The experience should work well on both mobile and larger screens.

### Supabase backend

Use **Supabase** as the backend solution for persistent data, authentication, and the app’s backend functionality. Use Google authentication and enforce authorization rules for accounts, crews, invitations, global problems, and sends.

Keep Supabase communication behind dedicated service or data-access modules. Application components and pages should call application-facing service functions instead of making direct Supabase calls. This keeps backend implementation details isolated and supports consistent validation and error handling.

The data model should support:

- Google-authenticated accounts.
- The pre-created Amurados crew, its members, and admin roles.
- Single-use invitations that expire after seven days.
- Global problems with QR identifiers, original URLs, grades, editable generated names, and Explorer attribution.
- Sends linked to a member and crew, optionally linked to a global problem, with date, attempt category, and points.
- Risk Taker awards and calendar-month leaderboard calculations.
- Account deletion that removes the account and its sends while retaining created problems with anonymous creator attribution.
- A future optional gym association for problems, without requiring gym data in the MVP.

Enforce membership and admin permissions in Supabase. Crew activity must be private to authorized members, and only admins can invite or remove members. Problems remain global; a problem appears in a crew’s activity when a member of that crew sends it.

Centralize business rules—including point calculation, first-send awards, invitation expiry, and monthly leaderboard calculations—so they remain consistent and can be maintained independently of UI components.

## Out of scope for the MVP

- Multiple crews per user.
- Crew creation.
- Gym management or gym associations on problems.
- Comments, reactions, messaging, and notifications.
- Sign-in providers other than Google.
- Browsing historical leaderboards by month, year, or all time.
- Editing a problem’s grade.

## MVP success criteria

The MVP is successful when you can invite friends to **Amurados** and they can sign in with Google and join Crux Club. Members can find or create global QR-linked problems, create problems without logging a send, log linked sends, or record standalone manual sends. Their sends update points, charts, and crew statistics.

The crew can see Fresh Sends, its monthly top-five leaderboard, the full points and grade table, and weekly, monthly, and yearly progress charts. The Problems section provides a searchable-by-filters global catalog with 50 newest problems per page.