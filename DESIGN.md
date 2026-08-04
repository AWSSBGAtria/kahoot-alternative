# DESIGN.md — SBG Quiz Visual System

## Visual Direction: Classroom Bulletin Board

A warm, tactile classroom bulletin board aesthetic. Cork texture backgrounds, pinned paper cards with real drop shadows, construction paper color blocks for quiz answers, handwritten-style labels, and bright, inviting warmth.

## Anti-Goals

No dark mode default. No gradient text. No bounce/elastic animations. No glass morphism/backdrop-blur. No glowing borders/neon. No generic `rounded-2xl-everything`. No gradient backgrounds on pages.

## Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `cork-100` | `#f4e4b8` | Card borders, thumbtack accent |
| `cork-200` | `#ebd593` | Card borders, input focus |
| `cork-300` | `#e2a838` | Main cork texture, header bg |
| `cork-400` | `#d4943a` | Hover states, active sidebar |
| `cork-500` | `#b87333` | Timer numbers, bold accents |
| `paper-cream` | `#fef7e8` | Page backgrounds |
| `paper-white` | `#fefdfb` | Cards, inputs, content areas |
| `paper-red` | `#dc2626` | Choice A, errors, destructive |
| `paper-blue` | `#2563eb` | Choice B, links, active states |
| `paper-green` | `#16a34a` | Choice D, success, correct |
| `paper-yellow` | `#eab308` | Choice C, badges, highlights |
| `paper-orange` | `#ea580c` | 3rd place podium, hover states |
| `paper-purple` | `#7c3aed` | Decorative accent, logo |
| `paper-pink` | `#ec4899` | Decorative accent, pin |
| `paper-teal` | `#0891b2` | Decorative accent, sidebar |
| `charcoal` | `#1e293b` | Primary text |
| `pencil` | `#64748b` | Secondary text, labels |

## Typography

- **Display/Headings:** Bungee (400) — game show signage energy, slab-typeface, commanding presence. Used for h1–h6, timers, score numbers, podium names, large labels. Single weight — Bungee's inherent boldness carries the role without weight variation.
- **Body/UI:** DM Sans (400/500/600/700) — geometric sans with clean terminals, excellent readability at small sizes. Used for questions, forms, labels, buttons, badges, navigation, metadata.
- **Mono/Code:** JetBrains Mono (500/700) — room codes, question counters, technical data.

## Shadows

- `shadow-card`: `0 2px 8px rgba(0,0,0,0.08)` — default cards
- `shadow-card-hover`: `0 8px 24px rgba(0,0,0,0.12)` — elevated/active
- `shadow-pin`: `0 1px 4px rgba(0,0,0,0.12)` — buttons, small elements
- `shadow-xl`: `0 20px 40px rgba(0,0,0,0.08)` — modals
- `shadow-glow-green`: `0 0 12px rgba(22,163,74,0.25)` — 1st place gold
- `shadow-glow-cork`: `0 0 10px rgba(226,168,56,0.2)` — 2nd place silver
- `shadow-glow-orange`: `0 0 10px rgba(234,88,12,0.2)` — 3rd place bronze

## Border Radii

- `rounded-card`: 16px — cards, buttons
- `rounded-lg`: 10px — inputs, badges, small elements

## Component Patterns

### Pinned Cards (`card-pinned`)
Cards with `.card-pinned` class get a `::before` pseudo-element thumbtack at top center. Optional colored pin via `.pin`, `.pin-blue`, `.pin-green`, `.pin-yellow`. Cards use `bg-paper-white` with `border-2 border-cork-200` and `shadow-card`.

### Buttons
- `.btn` — base: `px-5 py-2.5 rounded-card font-semibold transition-all active:scale-[0.98]`
- `.btn-primary` — `bg-paper-blue text-white hover:brightness-110 shadow-pin`
- `.btn-danger` — `bg-paper-red text-white hover:brightness-110`

### Inputs
- `.input` — `w-full px-4 py-2.5 bg-paper-white border-2 border-cork-200 rounded-card text-charcoal placeholder-pencil focus:outline-none focus:ring-2 focus:ring-paper-blue/30 focus:border-paper-blue transition-all`

### Error Banner
- `.error-banner` — `bg-paper-red/10 border border-paper-red/30 rounded-card px-4 py-2.5 text-sm text-paper-red text-center font-medium`

## Animations

- `fade-in` — opacity 0→1
- `slide-up` — translateY(16px)→0 + fade
- `pop-in` — scale(0.9)→1 + fade
- `pulse-soft` — subtle opacity pulse
- `float` — gentle vertical hover

## What NOT To Do

- Never use `bg-gradient-to-br` on page backgrounds
- Never use `bg-gradient-to-r` on text (gradient text)
- Never use `backdrop-blur` or glass morphism
- Never use `animate-bounce` (use `animate-pop-in` or `animate-pulse-soft`)
- Never use `animate-wiggle` or elastic easing
- Never use neon glow colors (`#8b5cf6` glow, `#a855f7` glow)
- Never use `shadow-[0_0_*]` glow shadows except `shadow-glow-green/cork/orange`
- Never use `hover:scale-105` (use `active:scale-[0.98]` for press feedback)
