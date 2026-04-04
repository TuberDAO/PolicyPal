# PolicyPal — style guide

Implementation-focused visual rules. **Tokens live in code:** `src/app/globals.css` (`@theme`). **Do not hardcode hex in components**—use Tailwind utilities mapped to those tokens (e.g. `bg-surface`, `text-muted`, `border-border`, `bg-cta`).

## Typography

| Role | Font |
|------|------|
| Body / UI | **Inter** |
| Headings (h1–h4) | **Sora** |

Loaded via `next/font/google` in the root layout; CSS variables `--font-inter` and `--font-sora` back `--font-sans` and `--font-heading`.

## Color tokens (reference hex)

Use the **semantic Tailwind names** in components; these are the underlying values:

| Token purpose | Hex | Typical utilities |
|---------------|-----|-------------------|
| Page background | `#F8FAFC` | `bg-background` |
| Cards / panels | `#FFFFFF` | `bg-surface` |
| Primary text | `#0F172A` | `text-foreground` |
| Secondary text | `#475569` | `text-muted` |
| Subtle border | `#E2E8F0` | `border-border` |
| Soft accent background | `#EEF4FF` | `bg-accent-light` |
| Accent blue | `#4F7DF3` | `text-accent`, `bg-accent`, etc. |
| Primary CTA | `#1E3A8A` | `bg-cta`, `hover:bg-cta-hover` |

Additional tokens (error, success, CTA hover) are defined in `globals.css` for consistency.

## Visual direction

- **Calm, modern, high-trust**
- **Premium but restrained**—no loud gradients-for-the-sake-of-it, no “crypto landing page” energy
- **Clean hierarchy:** readable type, clear sections, enough whitespace

## Mobile-first

- Design and test from **narrow widths up** (e.g. ~375px → tablet → desktop).
- **Spacing:** generous vertical rhythm and padding; avoid cramped stacks.
- **Forms:** large tap targets, comfortable inputs and text areas, obvious labels and errors.
- **Top navigation (marketing):** **Examples**, **Pricing**, and **Start review** must stay **reachable on mobile**—use a compact row or small menu, not hiding core links behind unclear patterns.

## What to avoid

- **Grey-heavy generic Tailwind:** don’t default to anonymous `gray-500` stacks; use the locked palette and semantic tokens.
- **Flashy SaaS styling:** excessive glassmorphism, neon accents, or busy illustration-heavy hero clichés.
- **Hardcoded colors** in JSX/CSS modules when a token already exists.

## Implementation checklist

1. New UI uses `@theme` tokens via utilities.
2. Headings use the heading font (global `h1–h4` rule in `globals.css` or explicit `font-heading`).
3. Body/UI uses Inter (`font-sans` / default body).
4. Mobile layout checked for readability, nav access, and form usability.
