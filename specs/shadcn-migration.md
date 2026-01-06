# Shadcn UI Migration Plan

## Phase 1: Initialization & Theme Setup
- [x] Create `components.json` configuration file.
- [x] Apply "Mono" theme using `tweakcn` registry.
- [x] Verify `app/globals.css` updates (CSS variables).
- [x] Verify `tailwind.config.ts` updates.

## Phase 2: Core Component Installation
- [x] Install foundational components:
    - [x] `Button`
    - [x] `Input`
    - [x] `Card`
    - [x] `Label`
    - [x] `Form` (if needed later)
    - [x] `DropdownMenu` (for user menu)
    - [x] `Sonner` (replacement for Toast)

## Phase 3: Component Migration (Refactoring)
### Auth Components
- [x] Refactor `AuthButton.tsx` to use `components/ui/button`.
- [x] Refactor `SignInPanel.tsx` to use `Card`, `Input`, `Button`.
- [x] Refactor `SignedOutPrompt.tsx` to use `Card`, `Button`.

### Layout & Landing
- [x] Update `Landing.tsx` to use semantic colors (`bg-primary`, `text-muted-foreground`) instead of hardcoded colors (`bg-blue-600`, `text-gray-600`).
- [x] Update `NavLink.tsx` to use standard hover states.
- [x] Update `ThemeToggle.tsx` to use `Button` (ghost variant) and `DropdownMenu` (optional).

## Phase 4: Standardization
- [ ] Audit `app/` pages for hardcoded Tailwind colors and replace with semantic tokens.
- [ ] Ensure all new UI development uses `components/ui` primitives.
- [ ] Remove unused custom CSS from `globals.css` if any.
