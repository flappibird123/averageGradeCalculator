# Source Code Overview – Grade Average Calculator

This README explains the structure and functionality of the **source code** inside the `src/` directory. It is intended for developers who want to understand, modify, or extend the code.

---

## Files

- **`index.html`**  
  The main HTML file. Contains:
  - Toolbar for theme selection, dark mode toggle, and reset.
  - Form container for subjects and criteria inputs.
  - Buttons to calculate and copy the overall average.
  - References to `styles.css` and `script.ts`.

- **`styles.css`**  
  Full styling for the project:
  - CSS variables for dynamic themes (`--main-color`, `--bg-start`, `--bg-end`, `--text-color`).  
  - Animations: background gradient, glow effects for averages.  
  - Responsive design for mobile and desktop.  
  - Input highlights for high and low grades.  
  - Dark mode support.

- **`script.ts`**  
  Main TypeScript logic:
  - Dynamically generates subjects and criteria inputs.
  - Calculates **subject averages** and **overall average**.
  - Validates grades (0–8) and applies high/low highlights.
  - Handles theme switching via a centralized `themes` array.
  - Manages dark mode toggle.
  - Persists grades and theme settings in `localStorage`.
  - Includes type safety and helper functions for maintainability.

---

## Themes

- Themes are defined as an array of objects:

```ts
interface Theme {
  name: string;
  main: string;
  bgStart: string;
  bgEnd: string;
  text: string;
  highColor: string;
  lowColor: string;
  glowAvg: string;
  glowResult: string;
}
