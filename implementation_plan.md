# Koto-Inspired UI Implementation Plan (Phase 5)

## Goal Description

Replicate the Koto.com header design: a minimal floating header with just a hamburger/MENU button that expands into a full-screen overlay navigation. The navigation should be globally available across all public pages.

### Key Design Elements from Koto.com

- **Minimal Header**: Just a "MENU" button (hamburger icon) in the top-right corner
- **Full-Screen Overlay**: When clicked, reveals a full-screen navigation menu
- **Dark Theme**: Pitch black `#0a0a0a` background, stark white text
- **Accent Color**: `#ffeb00` (Koto Yellow) for the logo/brand name
- **Content-First**: Logo appears in hero content area, not in header
- **Smooth Animations**: Fade/slide transitions for menu open/close

---

## Phase 5 Implementation

### 1. `client/src/components/Navigation.jsx` [NEW]

- **Minimal floating header** with hamburger/MENU button
- **Full-screen overlay menu** when opened
- **Menu items** with hover "twist" (descriptive text that appears on hover)
- **States**: `isOpen` (menu open/closed), `isScrolled` (header background on scroll)
- **Close on route change** and outside click
- **Twist Structure** (overlap fix using opacity cross-fade):
  ```jsx
  <div className="relative">
    <span className="block transition-opacity duration-300 group-hover:opacity-0">
      {item.label}
    </span>
    <span className="absolute left-0 top-0 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {item.twist}
    </span>
  </div>
  ```

### 2. `client/src/components/PublicLayout.jsx` [NEW]

- Global wrapper for all public routes:
  ```jsx
  import { Outlet } from "react-router-dom";
  import Navigation from "./Navigation";
  export default function PublicLayout() {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navigation />
        <main>
          <Outlet />
        </main>
      </div>
    );
  }
  ```

### 3. `client/src/App.jsx` [MODIFY]

- Wrap all public routes (Home, Archive, BlogList, BlogPost) in `PublicLayout`
- Keep admin routes separate (no PublicLayout)

### 4. `client/src/components/Layout.jsx` [MODIFY]

- Remove the old `<header>` block entirely
- Remove the 50/50 left sidebar layout
- Center main content across full width
- Keep only the right-side content area

### 5. Cookie Consent Banner [OPTIONAL]

- Add a dismissible cookie consent banner at bottom of screen
- "CUSTOMISE" and "ACCEPT" buttons
- Store preference in localStorage
