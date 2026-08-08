---
name: ForgeIQ Technical Interface
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#ffb786'
  on-tertiary: '#502400'
  tertiary-container: '#df7412'
  on-tertiary-container: '#461f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  mono-code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1440px
  gutter: 20px
---

## Brand & Style

The design system is engineered for high-performance developer workflows, emphasizing technical precision, information density, and focused utility. It draws heavily from **Minimalism** and **Modern Corporate** aesthetics, utilizing a "Dark-first" philosophy to reduce eye strain during prolonged deep-work sessions.

The visual language is defined by sharp edges, subtle 1px borders, and a rigorous adherence to a systematic grid. It avoids decorative fluff, favoring functional metadata and clear hierarchy. The emotional response should be one of control, reliability, and institutional power—positioning the platform as a serious tool for serious engineering.

## Colors

The palette is anchored in an "Obsidian" base to provide maximum contrast for technical text.

- **Primary Action:** Electric Blue (#3B82F6) is used exclusively for primary calls to action, active states, and progress indicators.
- **Surface Strategy:** Surfaces use subtle shifts in value (Slate/Charcoal) rather than dramatic color changes to define hierarchy.
- **Status System:**
  - **Success (Complete):** Emerald Green, paired with a checkmark icon.
  - **Warning (Gap):** Amber, used for low-priority alerts.
  - **In Progress:** Primary Blue or Amber depending on urgency.
  - **Neutral (Not Started):** Low-contrast Slate Grey.
- **Borders:** All borders must be 1px solid using `border_subtle` to maintain a blueprint-like aesthetic.

## Typography

This design system utilizes a dual-font strategy to distinguish between narrative content and technical data.

- **Geist/Inter:** Used for the primary UI, headings, and body copy.
- **JetBrains Mono:** Reserved for technical metadata — tags, status badges, and code blocks.
- **Hierarchy:** Tight letter spacing on larger headlines. Body text maintains standard tracking.

## Layout & Spacing

- **Desktop:** 12-column fluid grid with 20px gutters. Max-width 1440px.
- **Density:** High. `md` (16px) padding for standard surfaces; `sm` (8px) for condensed lists.
- **Reflow:** Mobile collapses to a single stack. Margins 24px → 16px.

## Elevation & Depth

Depth via tonal layers, not heavy shadows. Cards use 1px `border_subtle`. Soft radius `0.25rem`.
