# Average Grade Calculator

A modern, interactive web application that allows students to calculate their **subject and overall grade averages** with real-time feedback. Designed for usability, aesthetic appeal, and flexibility, it includes light/dark mode, theme selection, and persistent storage of grades.

---

## **Features**

- **Dynamic Subjects & Criteria**: Supports multiple subjects, each with customizable criteria (A–D).
- **Real-Time Subject Average**: Shows the average per subject as you type grades.
- **Overall Average Calculation**: Calculates the overall average based on only the grades entered.
- **Input Validation**: Only allows grades from `0–8`. Invalid entries are highlighted; empty inputs are ignored.
- **Highlight High/Low Grades**: Outstanding and low grades are visually distinguished for feedback.
- **Dark Mode & Theme Selection**: Toggle between light/dark mode or select from multiple color themes.
- **Persistent Data**: Grades and selected theme are saved to local storage, so your data persists between sessions.
- **Copy Result & Reset**: Easily copy the overall average to clipboard or reset all inputs.

---

## **Installation & Usage**

1. **Clone the repository:**

```bash
git clone https://github.com/flappibird123/averageGradeCalculator.git
cd averageGradeCalculator
```

2. **Open in a browser:**
   Simply open `index.html` in your preferred browser.

3. **(Optional) TypeScript Compilation:**
   If using TypeScript for development:

```bash
npm install -g typescript
tsc
```

This will generate `script.js` from `script.ts`.

---

## **How to Use**

1. Enter grades (0–8) for any criteria in each subject.
2. The **subject average** updates automatically.
3. Click **Calculate Overall Average** to get your total average.
4. Use **Copy Result** to copy the average, or **Reset** to clear all grades.
5. Change the theme or toggle **Dark Mode** using the menu/buttons.

> Only entered grades are considered in calculations, so partial progress is accounted for.

---

## **Technologies Used**

- **HTML5** – Structure of the app.
- **CSS3** – Styling, gradients, animations, and theme management.
- **JavaScript / TypeScript** – Dynamic behavior, input validation, real-time calculations.
- **Local Storage** – Persistent storage of grades and selected theme.

---

## **Future Improvements**

- Predictive grade outcomes or “what-if” scenarios.
- Weighted grades per subject or criterion.
- Interactive charts and statistics.
- Export results to CSV or PDF.
- Mobile-friendly accordion view for better usability on small screens.

---

## **License**

This project is open-source under the **MIT License**.
