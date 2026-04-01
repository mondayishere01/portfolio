# Architecture Decisions

## Stack Choice: MERN

MongoDB + Express + React + Node. Chosen for JavaScript end-to-end consistency and fast iteration on a solo portfolio project. No GraphQL — REST is sufficient for the data complexity here.

## CSS Custom Properties for Theming (not Tailwind dark mode)

Tailwind's `dark:` variant requires class toggling and doesn't support runtime switching cleanly. Instead, all colors are CSS variables defined in `index.css` under `:root` (dark) and `[data-theme="light"]`. The theme is applied by setting `data-theme` on `<html>`. This gives full runtime control and a single source of truth for every color token.

## No CSS-in-JS / Styled Components

Framer Motion + Tailwind + CSS variables covers all needs. Adding a CSS-in-JS library would increase bundle size and complexity with no benefit for a static portfolio.

## Axios Singleton (`client/src/api/index.js`)

All API calls go through one configured Axios instance. JWT attachment and 401 auto-logout are handled in interceptors once, not scattered across components. Adding a new endpoint = one export line.

## JWT in localStorage (not httpOnly cookies)

This is a single-admin portfolio, not a multi-user SaaS. The attack surface is low. localStorage avoids CSRF complexity and works cleanly with the Vercel (client) + Render (server) split-origin deployment.

## Framer Motion for Animations

`whileInView` with `once: true` gives scroll-triggered entrance animations with zero manual IntersectionObserver setup. `sectionVariants` and `staggerContainer` are defined once in `utils/animations.js` and reused everywhere.

## Cloudinary for Media

Avoids storing binaries in MongoDB or managing a file server. Multer streams uploads directly to Cloudinary on the server — the client never holds a binary, only a URL string. Public IDs are stored for deletion.

## Single About Document (upsert pattern)

There is only ever one portfolio owner. `About`, `Settings` use `findOneAndUpdate({}, data, { upsert: true })` — no ID management needed, no risk of duplicates.

## Blog Newsletter via `setImmediate`

Email broadcasts on blog publish are fire-and-forget using `setImmediate`. The API responds immediately to the admin; email failures don't surface as HTTP errors. Acceptable for a portfolio newsletter with low subscriber counts.

## Admin as Nested Routes under `<Dashboard>`

All `/admin/*` routes are children of the `<Dashboard>` route which renders an `<Outlet>`. This means the sidebar/shell renders once and only the content area swaps — no full remounts on navigation.

## No State Management Library (no Redux/Zustand)

Two contexts (`AuthContext`, `ThemeContext`) cover all shared state. Everything else is local component state + direct API calls. Adding a store would be over-engineering for this scope.

## Deployment Split: Vercel (client) + Render (server)

Vercel gives instant CDN-cached React builds with zero config. Render handles the always-on Node/Express API. `CLIENT_URL` env var on the server controls CORS, supporting multiple allowed origins via comma-separated values.
