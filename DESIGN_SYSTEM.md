# HB Notes - Design System & UI Documentation (2026 Edition)

## Overview

HB Notes is a modern, glassmorphism-styled notes application built with Next.js, React, and Tailwind CSS. The design system emphasizes visual hierarchy, smooth animations, and a seamless experience across mobile and desktop devices. This 2026 redesign incorporates dopamine colors, refined glassmorphism, and cinematic gradients for a contemporary aesthetic.

---

## Design Philosophy (2026)

### Core Principles
- **Dopamine Design**: Vibrant, saturated colors that evoke positive emotions
- **Refined Glassmorphism**: Subtler blur, cleaner borders, better contrast for accessibility
- **Cinematic Gradients**: Multi-layer radial gradients for depth and emotion
- **Mobile-First**: Responsive design that prioritizes mobile experience while scaling up to desktop
- **Smooth Animations**: Modern easing functions and timing for micro-interactions
- **Accessibility**: High contrast ratios and clear visual hierarchy
- **Theme Support**: Seamless light/dark mode switching

---

## Color System (2026)

### Light Theme
```css
--background: 0 0% 98% (Off-white)
--foreground: 240 10% 8% (Dark gray)
--muted: 240 5% 92% (Light gray)
--muted-foreground: 240 5% 45% (Medium gray)
--border: 240 5% 88% (Light border)
--ring: 240 5% 8% (Focus ring)
--card: 0 0% 100% (Card background)
--accent: 180 100% 40% (Vibrant teal)
--accent-foreground: 0 0% 100% (White)
--danger: 350 85% 55% (Rose red)
--danger-foreground: 0 0% 100% (White)
```

### Dark Theme
```css
--background: 240 10% 6% (Very dark slate)
--foreground: 0 0% 98% (Near white)
--muted: 240 5% 12% (Dark gray)
--muted-foreground: 240 5% 65% (Medium gray)
--border: 240 5% 18% (Dark border)
--ring: 0 0% 65% (Focus ring)
--card: 240 10% 8% (Card background)
--accent: 180 100% 50% (Vibrant teal)
--accent-foreground: 0 0% 98% (Near white)
--danger: 350 85% 60% (Rose red)
--danger-foreground: 0 0% 100% (White)
```

### Dopamine Color Palette (2026)
```css
--primary: 180 100% 40% (Vibrant teal #14b8a6)
--secondary: 340 85% 55% (Coral pink #f472b6)
--tertiary: 280 75% 55% (Electric purple #a855f7)
--quaternary: 35 95% 55% (Sunny orange #fb923c)
```

### Cinematic Gradient Backgrounds
- **Light**: Multi-layer radial gradients with teal, coral, purple, and orange accents over soft neutral base
- **Dark**: Same radial gradients with reduced opacity over dark slate base
- **Animation**: 20s infinite gradient shift with smooth transitions

---

## Typography (2026)

### Font Families
- **Sans-serif**: Inter, Trebuchet MS, Aptos
- **Mono**: JetBrains Mono, SFMono-Regular, Consolas

### Type Scale
- **H1**: 3xl (30px) - Page titles
- **H2**: 2xl (24px) - Section headers
- **H3**: xl (20px) - Card titles
- **Body**: sm (14px) - Base text
- **Small**: xs (12px) - Labels, metadata
- **Tiny**: 8-10px - Micro text

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600

---

## Spacing System

### Scale
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

### Component Spacing
- **Card padding**: 1.25rem (20px) mobile, 1.5rem (24px) desktop
- **Section gap**: 1.5rem (24px)
- **Button padding**: 0.75rem (12px) horizontal

---

## Glassmorphism Components (2026 Refined)

### Glass Panel
```css
background: rgba(255, 255, 255, 0.72) (light)
background: rgba(30, 41, 59, 0.72) (dark)
backdrop-filter: blur(24px) saturate(160%)
border: 1px solid rgba(255, 255, 255, 0.6) (light)
border: 1px solid rgba(255, 255, 255, 0.08) (dark)
box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.04) (light)
box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 0 rgba(0, 0, 0, 0.2) (dark)
```

### Glass Card
```css
background: rgba(255, 255, 255, 0.68) (light)
background: rgba(30, 41, 59, 0.68) (dark)
backdrop-filter: blur(20px) saturate(170%)
border: 1px solid rgba(255, 255, 255, 0.55) (light)
border: 1px solid rgba(255, 255, 255, 0.08) (dark)
box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.05), 0 1px 4px 0 rgba(0, 0, 0, 0.03) (light)
box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.25), 0 1px 4px 0 rgba(0, 0, 0, 0.15) (dark)
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

### Glass Chip
```css
background: rgba(255, 255, 255, 0.6) (light)
background: rgba(30, 41, 59, 0.6) (dark)
backdrop-filter: blur(12px) saturate(160%)
border: 1px solid rgba(255, 255, 255, 0.5) (light)
border: 1px solid rgba(255, 255, 255, 0.06) (dark)
box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02) (light)
box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.08) (dark)
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)
```

### Glass Editor
```css
background: rgba(255, 255, 255, 0.65) (light)
background: rgba(30, 41, 59, 0.65) (dark)
backdrop-filter: blur(24px) saturate(170%)
border: 1px solid rgba(255, 255, 255, 0.5) (light)
border: 1px solid rgba(255, 255, 255, 0.06) (dark)
box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.05), 0 1px 4px 0 rgba(0, 0, 0, 0.03) (light)
box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.2), 0 1px 4px 0 rgba(0, 0, 0, 0.1) (dark)
```

---

## Border Radius

- **sm**: 0.5rem (8px) - Small elements
- **md**: 1rem (16px) - Medium elements
- **xl**: 1rem (16px) - Cards
- **2xl**: 1.5rem (24px) - Large cards, panels
- **3xl**: 1.5rem (24px) - Note cards
- **full**: 9999px - Pills, buttons, FAB

---

## Shadows

### Panel Shadow
```css
box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12)
```

### Glass Shadows
```css
Light: 0 8px 32px 0 rgba(31, 38, 135, 0.15)
Dark: 0 8px 32px 0 rgba(0, 0, 0, 0.37)
```

### Button Shadows
```css
FAB: 0 10px 40px rgba(102, 126, 234, 0.4)
Hover: 0 15px 50px rgba(102, 126, 234, 0.5)
```

---

## Responsive Breakpoints (2026)

### Tailwind Default
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Custom Breakpoints
- **Mobile**: < 1280px (xl breakpoint)
- **Desktop**: ≥ 1280px (xl breakpoint)

### Layout Updates (2026)
- **Desktop max-width**: 1800px (increased from 1600px)
- **Sidebar width**: 400px (increased from 380px)
- **Desktop padding**: 2rem (32px) (increased from 1.5rem)
- **Desktop gap**: 1.5rem (24px) (increased from 1rem)
- **Panel rounded corners**: 1.75rem (28px) (increased from 1.5rem)

---

## Component Library

### 1. Navigation Components

#### Bottom Navigation (Mobile Only)
- **Position**: Fixed bottom, 16px from edges
- **Container**: Glass panel, rounded-3xl, max-w-md
- **Items**: Home, Favorites, Tags, Settings
- **Active State**: Blue glow effect, color change
- **Animation**: Slide up from bottom (motion)

#### Sidebar (Desktop Only)
- **Width**: 380px fixed
- **Height**: calc(100vh - 3rem)
- **Components**: Logo, User menu, Note list
- **Background**: Glass panel
- **Border Radius**: 1.5rem

### 2. Note List Component

#### Search Bar
- **Style**: Glass panel, rounded-2xl
- **Icon**: Search (left), X (clear, right)
- **Animation**: Scale on focus
- **Placeholder**: "Search notes..." / "Search trashed notes"

#### Filter Chips
- **Style**: Glass chip, rounded-full
- **Options**: All, Work, Personal, Ideas
- **Active State**: Blue background tint
- **Animation**: Scale on hover/tap

#### Note Card
- **Style**: Glass card, rounded-3xl
- **Padding**: 1.25rem (20px)
- **Hover**: Translate Y -4px
- **Selected State**: Background tint, shadow
- **Animation**: Staggered fade-in, spring physics
- **Content**:
  - Title (line-clamp-1, base font-medium)
  - Preview (line-clamp-2, sm opacity-70)
  - Metadata (time, attachments)

### 3. Editor Panel

#### Header
- **Style**: Glass panel, border-bottom
- **Components**: Back button (mobile), Title, Actions
- **Actions**: Preview/Edit, Pin, Share, Export, Trash
- **Button Style**: Glass panel, rounded-full, h-11

#### Editor Area
- **Style**: Glass editor, rounded-[2rem]
- **Padding**: 1.5rem (24px) mobile, 2rem (32px) desktop
- **Font**: Mono for editing, Sans for preview
- **Grid Layout**: 2 columns on desktop (editor + sidebar)

#### Sidebar (Editor)
- **Width**: 380px on desktop
- **Components**: Tags input, Attachments
- **Background**: bg-card/20

### 4. Credit Card View

#### Card Design
- **Aspect Ratio**: 1.586/1 (standard credit card)
- **Max Width**: 420px
- **Background**: Purple gradient (indigo → violet → purple)
- **Border Radius**: 2xl
- **Effects**: Blur, shadow, inset highlight

#### Card Content
- **Top**: Card type (uppercase, tracking-widest), Wifi icon
- **Middle**: Gold chip, Card number (monospace, tracking)
- **Bottom**: Cardholder name, Valid Thru date
- **Text Color**: White with drop shadow

### 5. Floating Action Button (FAB)

#### Design
- **Size**: 64px × 64px
- **Position**: Fixed bottom-24 right-5
- **Gradient**: #14b8a6 (teal) → #f472b6 (coral) → #a855f7 (purple)
- **Icon**: Plus with rotation animation
- **Animation**: Scale in, hover scale, tap scale, 4s rotation cycle
- **Visibility**: Mobile only (hidden on xl)

### 6. Template Modal

#### Design
- **Overlay**: Glass panel backdrop
- **Container**: Glass panel, rounded-2xl
- **Animation**: Scale in/out
- **Content**: Template grid, preview

---

## Layout Patterns

### Mobile Layout (< 1280px)

```
┌─────────────────────────┐
│                         │
│   Note List (Full)      │
│   - Header              │
│   - Search              │
│   - Filters             │
│   - Note Cards          │
│                         │
├─────────────────────────┤
│   Bottom Navigation     │
├─────────────────────────┤
│   FAB                   │
└─────────────────────────┘

Note Selected (Mobile):
┌─────────────────────────┐
│   Editor (Full Screen)  │
│   - Back Button         │
│   - Title               │
│   - Actions             │
│   - Editor Area         │
│   - Tags/Attachments    │
└─────────────────────────┘
```

### Desktop Layout (≥ 1280px)
```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌──────────┐  ┌────────────────────────┐  │
│  │          │  │                        │  │
│  │ Sidebar  │  │   Editor Panel         │  │
│  │          │  │                        │  │
│  │ - Logo   │  │   - Header             │  │
│  │ - User   │  │   - Editor Area        │  │
│  │ - List   │  │   - Tags/Attachments   │  │
│  │          │  │                        │  │
│  │ 400px    │  │   Flex Column          │  │
│  │          │  │                        │  │
│  └──────────┘  └────────────────────────┘  │
│                                             │
│  Padding: 2rem, Max-width: 1800px           │
└─────────────────────────────────────────────┘
```

---

## Animation Guidelines (2026)

### Motion Principles
- **Duration**: Fast (150-300ms) for micro-interactions
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1) for modern feel
- **Spring Physics**: For card animations (stiffness: 300, damping: 25)
- **Stagger**: 50ms delay for list items
- **Hover**: Subtle scale (1.02-1.05) and translate
- **Tap**: Scale down (0.95-0.98)

### Animation Types
1. **Page Transitions**: Fade in, slide up
2. **List Items**: Staggered fade-in with spring
3. **Buttons**: Scale on hover/tap
4. **Modals**: Scale in/out with backdrop
5. **Cards**: Hover lift (-2px Y with translateY)
6. **FAB**: Pulse, rotate icon (4s cycle)
7. **Shimmer**: Glass card hover effect (2s cubic-bezier)
8. **Gradient**: 20s infinite shift with smooth transitions

---

## Icon System

### Icon Library
- **Library**: Lucide React
- **Size**: 16px (xs), 20px (sm), 24px (base), 32px (lg)

### Common Icons
- **Navigation**: Home, Heart, Tag, Settings
- **Actions**: Plus, Search, Pin, Trash2, Download, Link2, Eye, EyeOff
- **Note**: FileText, StickyNote, Sparkles
- **Editor**: ChevronLeft, RotateCcw, Save
- **Card**: CreditCard, LayoutTemplate, Landmark, Plane, User

---

## Accessibility

### Contrast Ratios
- **Text**: WCAG AA (4.5:1) minimum
- **Large Text**: WCAG AA (3:1) minimum
- **Interactive Elements**: Clear visual feedback

### Focus States
- **Ring**: Custom ring color
- **Outline**: 2px ring with 50% opacity
- **Skip Links**: Consider adding for keyboard navigation

### Touch Targets
- **Minimum**: 44px × 44px
- **Buttons**: h-11 (44px) standard
- **Cards**: Full width, easy tap

---

## State Management

### Visual States
- **Default**: Base glass style
- **Hover**: Scale, shadow increase, shimmer
- **Active/Selected**: Background tint, shadow
- **Focus**: Ring outline
- **Disabled**: Opacity 50%
- **Loading**: Spinner or text

---

## Special Effects

### Noise Texture
- **Purpose**: Add depth to glass elements
- **Opacity**: 0.03 (light), 0.05 (dark)
- **Method**: SVG filter with fractal noise

### Shimmer Effect
- **Purpose**: Subtle highlight on hover
- **Animation**: 1.5s ease-in-out
- **Gradient**: White 0% → 30% → 0%

### Gradient Animation
- **Purpose**: Dynamic background
- **Duration**: 15s infinite
- **Pattern**: 0% → 100% → 0%

---

## Credit Card Specific Design

### Color Palette
- **Primary**: Indigo (#667eea)
- **Secondary**: Purple (#764ba2)
- **Accent**: Pink (#f093fb)
- **Gold**: #D4AF37 (chip)

### Typography
- **Card Type**: lg/xl, uppercase, tracking-widest
- **Card Number**: 2xl/3xl, monospace, tracking-[0.14em]
- **Cardholder**: sm/[15px], uppercase, tracking-wider
- **Labels**: 8-10px, uppercase, tracking-widest

### Effects
- **Background**: Purple gradient (0.8-0.9 opacity)
- **Blur**: 20px backdrop
- **Border**: 1px white with 0.3 opacity
- **Shadow**: Multi-layer with inset highlight
- **Text Shadow**: For readability on gradient

---

## Responsive Behavior

### Mobile (< 1280px)
- Full-width note list
- Bottom navigation visible
- FAB visible
- Editor: Full screen overlay
- Sidebar: Hidden
- Header: Minimal with back button

### Desktop (≥ 1280px)
- Split layout (sidebar + editor)
- Bottom navigation: Hidden
- FAB: Hidden
- Editor: Side-by-side with tags
- Sidebar: Always visible
- Header: Full with logo and user menu

---

## Performance Considerations

### Optimizations
- **Images**: Lazy loading, WebP format
- **Animations**: GPU-accelerated transforms
- **Blur**: Hardware-accelerated backdrop-filter
- **Scroll**: Smooth scrolling, touch momentum
- **Debounce**: Search input (250ms)

### Bundle Size
- **Icons**: Tree-shaken Lucide icons
- **Motion**: Framer Motion with dynamic imports
- **Fonts**: Inter font with subset

---

## Future Enhancements

### Planned Features
- [ ] Drag and drop note reordering
- [ ] Note folders/collections
- [ ] Rich text editor with formatting
- [ ] Collaborative editing
- [ ] Voice notes
- [ ] Image annotations
- [ ] Keyboard shortcuts
- [ ] Export to PDF/Markdown
- [ ] Note templates gallery
- [ ] Dark mode auto-detect

### Design Improvements
- [ ] Skeleton loading states
- [ ] Empty state illustrations
- [ ] Onboarding flow
- [ ] Settings panel design
- [ ] Notification system
- [ ] Share modal redesign
- [ ] Attachment gallery view

---

## Browser Support

### Target Browsers
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Android 10+

### Fallbacks
- **Backdrop-filter**: Solid background fallback
- **CSS Grid**: Flexbox fallback
- **CSS Variables**: Fallback colors

---

## Design Tokens Reference

### Spacing Tokens
```css
--space-xs: 0.25rem;
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--space-xl: 2rem;
--space-2xl: 3rem;
```

### Radius Tokens
```css
--radius-sm: 0.5rem;
--radius-md: 1rem;
--radius-xl: 1rem;
--radius-2xl: 1.5rem;
--radius-3xl: 1.5rem;
--radius-full: 9999px;
```

### Shadow Tokens
```css
--shadow-sm: 0 4px 16px 0 rgba(31, 38, 135, 0.08);
--shadow-md: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
--shadow-lg: 0 12px 48px 0 rgba(31, 38, 135, 0.18);
--shadow-panel: 0 20px 60px rgba(15, 23, 42, 0.12);
```

---

## Component Usage Examples

### Note Card
```tsx
<motion.button
  className="glass-card rounded-3xl p-5"
  whileHover={{ y: -4 }}
  whileTap={{ scale: 0.98 }}
>
  <h3 className="line-clamp-1 mb-2 text-base font-medium">
    {note.title}
  </h3>
  <p className="mb-3 line-clamp-2 text-sm opacity-70">
    {note.content}
  </p>
</motion.button>
```

### Glass Button
```tsx
<button className="glass-panel inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm transition hover:-translate-y-0.5">
  <Icon className="h-4 w-4" />
  {label}
</button>
```

### Search Input
```tsx
<div className="glass-panel relative rounded-2xl">
  <Search className="h-5 w-5 text-muted-foreground" />
  <input className="flex-1 bg-transparent text-sm outline-none" placeholder="Search notes..." />
</div>
```

---

## Design System Maintenance

### Version Control
- Document version: 1.0.0
- Last updated: April 2026
- Maintainer: Design Team

### Update Process
1. Document new components
2. Update color/spacing tokens
3. Add responsive behavior notes
4. Include animation specifications
5. Update component examples

---

## Resources

### Design Tools
- Figma: Component library
- Storybook: Component documentation
- Chromatic: Visual regression testing

### Documentation
- Tailwind CSS: https://tailwindcss.com
- Framer Motion: https://www.framer.com/motion
- Lucide Icons: https://lucide.dev
- Shadcn/ui: Component inspiration

---

*This design system is a living document and will evolve as the application grows.*
