# UI Components & Patterns

## Theming Rules

- All colors MUST use CSS custom properties: `style={{ color: 'var(--token)' }}`
- Never hardcode hex values or use Tailwind color utilities (e.g. `text-white`, `bg-black`) in new components — these break light mode
- Use Tailwind only for layout, spacing, typography scale, and transitions
- Full token reference is in `client/src/index.css`

Common tokens:

- Surfaces: `--surface-base`, `--surface-card`, `--surface-accent`
- Text: `--content-primary`, `--content-body`, `--content-muted`, `--content-tertiary`
- Accent/interactive: `--accent-brand`, `--interactive-base`, `--interactive-hover`
- Borders: `--border-alpha-10`, `--border-alpha-15`, `--border-alpha-20`
- States: `--hover-bg`, `--active-bg`, `--skeleton`

---

## Section Pattern

Every public-facing section follows this exact structure:

```jsx
import { motion } from "framer-motion";
import { sectionVariants } from "../utils/animations";
import SectionHeader from "../components/SectionHeader";

<motion.section
  id="section-id"
  className="mb-12 scroll-mt-16 md:mb-16 lg:mb-24 lg:scroll-mt-24"
  aria-label="Section name"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  variants={sectionVariants}
>
  <SectionHeader label="Section Name" />
  {/* content */}
</motion.section>;
```

`sectionVariants` = `{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }`
`staggerContainer` is available for animating lists of children with 0.1s stagger.

---

## SectionHeader

Sticky on mobile, static on desktop. Always the first child of a section.

```jsx
<SectionHeader label="About" />
```

Renders an `<h2>` in `--accent-brand` color with `text-sm font-bold uppercase tracking-widest`.

---

## Card Pattern (ExperienceCard / ProjectCard)

Both cards use the same hover-highlight approach:

- Wrapper: `className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4"`
- Invisible hover overlay as first child: `absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-[12px]` — gets `background: var(--surface-card)` and `border-color: var(--border-alpha-15)` on group hover via inline `<style>` tag
- Content divs use `z-10` and `transition-all duration-300 lg:group-hover:pr-4` (or `pl-4`) for the slide-in effect
- Links use `onMouseEnter/onMouseLeave` to swap between `--content-body` and `--accent-brand`
- Tags: `rounded-full px-3 py-1 text-xs font-medium` with `background: var(--interactive-base-10)`, `color: var(--accent-brand)`
- External links always include `target="_blank" rel="noreferrer"` and an `aria-label`
- Images have an `imageError` fallback state showing a Lucide icon in a `--skeleton` background box

---

## Skeleton Loading

Use `animate-pulse` with `--skeleton` background. Match the shape of the real content:

```jsx
<div
  className="h-4 w-full rounded animate-pulse"
  style={{ backgroundColor: "var(--skeleton)" }}
/>
```

---

## Tag Pills

Two variants in use:

- Rounded (experience): `rounded-full px-3 py-1 text-xs font-medium` — `bg: --interactive-base-10`, `color: --accent-brand`
- Rounded-md (project): `rounded-md px-3 py-1 text-xs font-medium` with added `border: 1px solid var(--interactive-base-20)`

---

## Buttons

Primary action button pattern:

```jsx
<button
  className="group inline-flex items-center gap-2 rounded-md px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg cursor-pointer"
  style={{
    backgroundColor: "var(--interactive-base)",
    color: "var(--content-primary-inv)",
  }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.backgroundColor = "var(--interactive-hover)")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.backgroundColor = "var(--interactive-base)")
  }
>
  Label <Icon size={16} />
</button>
```

---

## Icons

Only use `lucide-react`. Import individually: `import { ArrowUpRight, Github } from 'lucide-react'`

- External link indicator: `<ArrowUpRight size={16} className="inline-block ml-1 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />`

---

## Custom Cursor

- `cursor: none` is set globally on `body` — never override this
- Add `data-cursor-text="Label"` to any element to show a label in the cursor ring
- Default labels are auto-detected: cards → "View", external anchors → "Visit", buttons → "Click"
- The cursor is disabled automatically on touch devices

---

## Navigation

- Pill nav: fixed top-left, 320px wide on desktop, full-width on mobile
- Expands on click to show nav links as a dropdown
- On non-home pages, a "Back to Portfolio" pill appears at `left: 350px`
- Cross-page anchor scrolling: `sessionStorage.setItem('scrollTo', sectionId)` then navigate to `/`

---

## Layout

Public pages use `<PublicLayout>` (Navigation + Outlet).
The inner `<Layout>` wrapper: `relative min-h-screen pt-6 pb-2 py-12 md:px-12 md:py-20 lg:pl-3 lg:pr-12`
Main content: `pt-16 px-6 pb-20 md:px-0`

---

## Multi-line Text Rendering

API fields like `bio` and `description` may contain `\n` newlines. Always render them as:

```jsx
{
  text.split("\n").map((line, i) => (
    <span key={i} className="block">
      {line}
    </span>
  ));
}
```

---

## Image Fallbacks

Always handle broken images with an `imageError` state:

```jsx
const [imageError, setImageError] = useState(false);
// ...
{
  imageUrl && !imageError ? (
    <img
      src={imageUrl}
      onError={() => setImageError(true)}
      loading="lazy"
      alt={label}
    />
  ) : (
    <div style={{ backgroundColor: "var(--skeleton)" }}>
      <FallbackIcon />
    </div>
  );
}
```
