# MovieBox Tracker - Design Guidelines

This document outlines the core design principles, patterns, and standards used throughout the MovieBox Tracker application.

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Layout & Spacing](#layout--spacing)
5. [Components](#components)
6. [Interactions](#interactions)
7. [Iconography](#iconography)
8. [Imagery](#imagery)
9. [Responsive Design](#responsive-design)

---

## Design Philosophy

MovieBox Tracker embraces a **modern, cinematic aesthetic** that puts content first. The design is inspired by premium streaming platforms with a focus on:

- **Dark UI**: Reduces eye strain during extended browsing sessions
- **High Contrast**: Ensures readability and accessibility
- **Content-Focused**: Movie posters and imagery are the visual heroes
- **Smooth Interactions**: Subtle animations and transitions enhance UX
- **Clean Hierarchy**: Clear visual organization of information

---

## Color Palette

### Primary Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Black** | `#000000` | Primary backgrounds, hero sections |
| **Gray-900** | `#111827` | Card backgrounds, elevated surfaces |
| **Gray-800** | `#1F2937` | Input fields, secondary surfaces |
| **Gray-700** | `#374151` | Borders, dividers |

### Accent Colors

| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| **Rose-700** | `#BE123C` | `bg-rose-700` | Primary CTAs, brand accent |
| **Rose-800** | `#9F1239` | `bg-rose-800` | Hover states for primary buttons |
| **Rose-500** | `#F43F5E` | `text-rose-500` | Links, secondary accents |
| **Rose-400** | `#FB7185` | `text-rose-400` | Link hover states |

### Semantic Colors

| Color | Purpose | Tailwind Class |
|-------|---------|----------------|
| **Green-600** | Success, "Watched" status | `bg-green-600` |
| **Green-700** | Hover state for success actions | `bg-green-700` |
| **Yellow-500** | IMDB badge background | `bg-yellow-500` |
| **Red-600** | Rotten Tomatoes indicator | `bg-red-600` |

### Text Colors

| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| **White** | `#FFFFFF` | `text-white` | Primary text on dark backgrounds |
| **Gray-900** | `#111827` | `text-gray-900` | Text on light backgrounds |
| **Gray-400** | `#9CA3AF` | `text-gray-400` | Secondary text, metadata |
| **Gray-500** | `#6B7280` | `text-gray-500` | Tertiary text, captions |
| **Gray-300** | `#D1D5DB` | `text-gray-300` | Disabled text, subtle information |

---

## Typography

### Font Family

Primary typeface: **DM Sans** (from Google Fonts)

- **Display/Headings**: DM Sans Bold
- **Body Text**: DM Sans Regular
- **UI Elements**: DM Sans Medium
- **Emphasis**: DM Sans Bold

### Font Variation Settings

All DM Sans text uses the following CSS property:
```css
font-variation-settings: 'opsz' 14;
```

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| **Hero Title** | 48px | Bold | 56px | Main hero headings |
| **Page Title** | 48px | Bold | Normal | Page headers |
| **Section Heading** | 36px | Bold | Normal | Section titles |
| **Card Title** | 24px | Bold | Normal | Modal/card headers |
| **Movie Title** | 18px | Bold | Normal | Movie card titles |
| **Button Text** | 16px | Bold | 24px | Primary buttons |
| **Body Text** | 16px | Regular | Normal | Descriptions, paragraphs |
| **UI Text** | 14px | Medium | 18px | Secondary UI elements |
| **Metadata** | 12px | Regular | 12px | Dates, ratings, tags |
| **Small Text** | 12px | Bold | Normal | Labels, badges |
| **Micro Text** | 10px | Bold | Normal | Badge text (IMDB) |

### Typography Classes

Common font class patterns used throughout the app:

```tsx
// Hero/Page Titles
className="font-['DM_Sans:Bold',_sans-serif] font-bold text-[48px] text-white"
style={{ fontVariationSettings: "'opsz' 14" }}

// Section Headings
className="font-['DM_Sans:Bold',_sans-serif] font-bold text-[36px] text-black"
style={{ fontVariationSettings: "'opsz' 14" }}

// Body Text
className="font-['DM_Sans:Regular',_sans-serif] font-normal text-[16px] text-gray-300"
style={{ fontVariationSettings: "'opsz' 14" }}

// Metadata
className="font-['DM_Sans:Bold',_sans-serif] font-bold text-[12px] text-gray-400"
style={{ fontVariationSettings: "'opsz' 14" }}
```

---

## Layout & Spacing

### Grid System

**Movie Card Grid:**
```css
grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
gap-x-[80px] gap-y-[60px]
```

- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Large Desktop: 4 columns

### Page Layout

**Horizontal Padding:**
- Desktop: `px-[98px]` (98px left/right padding)
- Content max-width: Naturally constrained by padding

**Vertical Spacing:**
- Section spacing: `py-[70px]` or `py-[60px]`
- Section bottom spacing: `pb-[70px]`
- Card spacing in grid: `gap-y-[60px]`

### Component Spacing

| Element | Spacing | Class |
|---------|---------|-------|
| Small gap | 8px | `gap-[8px]` |
| Default gap | 16px | `gap-[16px]` |
| Medium gap | 24px | `gap-[24px]` |
| Large gap | 48px | `gap-[48px]` |
| XL gap | 80px | `gap-[80px]` |

### Header

- Fixed height: `h-[80px]`
- Position: `absolute` with `top-0 left-0 w-full`
- Z-index: `z-50`
- Logo left margin: `left-[95px]`

### Hero Section

- Standard height: `h-[600px]`
- Content starts at: `top-[158px]`
- Left alignment: `left-[98px]`

---

## Components

### Movie Card

**Dimensions:**
- Width: `250px`
- Height: `370px` (poster)
- Aspect ratio: Approximately 2:3

**Structure:**
- Poster image with rounded mask
- Overlay with watchlist heart icon (top-right)
- "Mark Watched" button (top-left overlay)
- Release date (12px, gray-400)
- Title (18px, bold, gray-900)
- Ratings row (IMDB + Rotten Tomatoes)
- Genres (12px, gray-400)

**States:**
- Default: Gray background for badges
- In Watchlist: Rose-700 heart, filled
- Watched: Green-600 badge with checkmark
- Hover: Cursor pointer, card scales slightly

### Buttons

**Primary Button (Rose):**
```tsx
className="bg-rose-700 hover:bg-rose-800 text-white px-[16px] py-[6px] rounded-[6px] 
           font-['DM_Sans:Bold',_sans-serif] text-[14px] uppercase transition-colors"
```

**Success Button (Green):**
```tsx
className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg
           font-['DM_Sans:Bold',_sans-serif] text-[16px] transition-colors"
```

**Secondary Button (Outline):**
```tsx
className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg
           font-['DM_Sans:Bold',_sans-serif] text-[16px] transition-colors"
```

**Button Sizing:**
- Small: `px-[8px] py-[3px]` (badges)
- Medium: `px-[16px] py-[6px]` (default)
- Large: `px-6 py-3` (forms, primary actions)
- X-Large: `py-6` (full-width form buttons)

### Form Inputs

**Standard Input:**
```tsx
className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 
           focus:border-rose-500 focus:ring-rose-500"
```

**Input Features:**
- Background: Gray-800
- Border: Gray-700
- Focus ring: Rose-500
- Placeholder: Gray-500
- Text: White
- Password toggle icon positioned absolutely

### Cards/Panels

**Elevated Surface:**
```tsx
className="bg-gray-900 rounded-lg p-8 shadow-2xl"
```

**Page Header:**
```tsx
className="bg-black h-[200px] relative"
// With title positioned at left-[98px] top-[120px]
```

### Badges

**Small Badge (12px):**
```tsx
className="px-[8px] py-[3px] rounded-[12px] bg-[rgba(243,244,246,0.5)] 
           backdrop-blur-[1px] font-['DM_Sans:Bold',_sans-serif] text-[12px]"
```

**IMDB Badge:**
```tsx
className="h-[17px] w-[35px] bg-yellow-500 rounded px-1 flex items-center justify-center"
// Text: font-bold text-[10px] text-black
```

### Navigation Menu

**Dropdown Menu:**
```tsx
className="absolute right-0 top-[50px] bg-gray-900 rounded-lg shadow-lg 
           min-w-[200px] py-2 z-50"
```

**Menu Items:**
```tsx
className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 transition-colors"
```

---

## Interactions

### Hover States

**Buttons:**
- Primary: `bg-rose-700` → `bg-rose-800`
- Links: `text-rose-500` → `text-rose-400`
- Menu items: `transparent` → `bg-gray-800`
- Icons: `scale-110` transform

**Cards:**
- Movie cards: `cursor-pointer` on entire card
- Subtle scale transform (optional)

### Click/Active States

**Watchlist Heart:**
- Not in list: Gray-300 fill, 50% opacity background
- In list: Rose-700 background, white fill

**Watched Badge:**
- Not watched: "Mark Watched" button with plus icon
- Watched: Green badge with checkmark icon

### Transitions

Standard transition class:
```tsx
className="transition-colors"
// or
className="transition-transform"
```

**Duration:** Default (150ms)

### Loading States

Button loading:
```tsx
disabled={isLoading}
{isLoading ? 'Loading...' : 'Button Text'}
```

### Error States

Error message container:
```tsx
className="bg-rose-900/20 border border-rose-500 text-rose-200 px-4 py-3 rounded-lg"
```

---

## Iconography

### Icon Library

**Primary:** Lucide React
```tsx
import { Heart, Check, Plus, Search, Menu, Eye, EyeOff, LogOut, User, ArrowLeft } from 'lucide-react';
```

### Icon Sizing

| Size | Class | Usage |
|------|-------|-------|
| Small | `w-3 h-3` | Badge icons |
| Medium | `w-4 h-4` | Menu icons, form icons |
| Default | `w-5 h-5` | Standard UI icons |
| Large | `w-6 h-6` | Primary action icons |

### Icon Colors

Icons inherit text color from parent:
```tsx
<Heart className="w-5 h-5 text-white fill-white" />
<Check className="w-3 h-3 text-white" />
```

### Common Icon Patterns

**Filled Icons:**
```tsx
className="fill-white text-white" // Both fill and stroke
```

**Conditional Icons:**
```tsx
{showPassword ? <EyeOff /> : <Eye />}
{watched ? <Check /> : <Plus />}
```

---

## Imagery

### Movie Posters

**Source:** Figma assets via `figma:asset/[hash].png`

**Display:**
- Object fit: `object-cover`
- Object position: `object-50%-50%` (centered)
- Pointer events: `pointer-events-none` (for overlays)

**Mask/Clipping:**
```tsx
className="mask-alpha mask-intersect mask-no-clip mask-no-repeat"
style={{ maskImage: `url('${maskSVG}')` }}
```

### Hero Background Images

**Treatment:**
1. Base image at full size
2. Overlay: `bg-[rgba(0,0,0,0.5)]` (50% black)
3. Optional gradient: `bg-gradient-to-t from-black via-black/60 to-transparent`

### Backdrop Blur

For glassmorphism effects:
```tsx
className="backdrop-blur-[1px] backdrop-filter bg-[rgba(243,244,246,0.5)]"
```

---

## Responsive Design

### Breakpoints

Using Tailwind's default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Responsive Patterns

**Grid Columns:**
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
```

**Spacing:**
- Maintain `px-[98px]` on desktop
- Reduce to `px-4` or `px-6` on mobile (if needed)

**Typography:**
- Hero titles may scale down on mobile
- Body text remains consistent

**Header:**
- Fixed layout works across breakpoints
- Menu button accessible on all sizes

### Mobile Considerations

- Touch targets minimum 44px × 44px
- Clickable cards work well on touch devices
- Dropdown menus position relative to viewport
- Forms full-width on mobile

---

## Best Practices

### Do's ✅

- **Use the established color palette** - Stick to blacks, grays, and rose accents
- **Maintain consistent spacing** - Use the 98px page margins and established gaps
- **Follow the typography scale** - Use predefined font sizes and weights
- **Keep interactions smooth** - Add transitions to interactive elements
- **Ensure high contrast** - White text on dark backgrounds
- **Use semantic colors** - Green for success, rose for primary actions
- **Make cards clickable** - Entire movie cards should navigate to details

### Don'ts ❌

- **Don't introduce new colors** without updating this guide
- **Don't use light backgrounds** for main content areas
- **Don't forget font-variation-settings** for DM Sans
- **Don't overlay text on images** without proper contrast (use overlays)
- **Don't create custom spacing** - use the established scale
- **Don't mix font families** - stick to DM Sans throughout
- **Don't forget hover states** on interactive elements

---

## Accessibility

### Color Contrast

- All text meets WCAG AA standards (4.5:1 for normal text)
- White on black/gray-900: Excellent contrast
- Rose-500 links on dark backgrounds: AA compliant

### Focus States

- All interactive elements have visible focus rings
- Focus color: Rose-500
- Focus ring: `focus:ring-rose-500 focus:border-rose-500`

### Semantic HTML

- Use proper heading hierarchy (h1, h2, h3)
- Use `<button>` for clickable elements
- Use `<Link>` for navigation
- Label all form inputs

### Screen Readers

- Images have `alt` attributes
- Decorative images: `alt=""` and `aria-hidden="true"`
- Icon buttons include accessible labels

---

## File Organization

### Component Location

- **Page components:** `/pages/`
- **Reusable components:** `/components/`
- **UI primitives:** `/components/ui/`
- **Context providers:** `/context/`
- **Mock data:** `/data/`
- **Figma imports:** `/imports/`

### Naming Conventions

- **Components:** PascalCase (e.g., `MovieCard.tsx`)
- **Pages:** PascalCase with "Page" suffix (e.g., `HomePage.tsx`)
- **Utilities:** camelCase (e.g., `mockMovies.ts`)
- **Contexts:** PascalCase with "Context" suffix (e.g., `AuthContext.tsx`)

---

## Version History

- **v1.0** (2025-01-27): Initial design guidelines established
  - Core color palette defined
  - Typography system documented
  - Component patterns established
  - Responsive grid system implemented

---

## Questions or Updates?

This is a living document. As the design system evolves, update this file to reflect new patterns, components, and standards.

For major changes, consider:
1. Reviewing impact across all pages
2. Updating existing components
3. Adding examples to this guide
4. Communicating changes to the team
