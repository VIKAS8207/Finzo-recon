---
name: button-pointer
description: Every button in this project must show a pointer cursor on hover. Use when creating or editing any button, clickable element or UI component.
---

# Button pointer cursor

- A global rule in `src/index.css` (`@layer base`) sets `cursor: pointer` on all enabled `<button>`, `[role="button"]` and `input[type="submit"]`.
- Do not add `cursor-pointer` per button; the global rule covers it.
- A clickable element that is not a `<button>` (a div or span with `onClick`) needs `role="button"` so the rule applies, or use a real `<button>`.
- Disabled buttons keep the default cursor.
