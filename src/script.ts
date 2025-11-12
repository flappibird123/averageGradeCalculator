"use strict";

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

// --- DOM Elements ---
const subjectsContainer = document.querySelector<HTMLDivElement>('.subjects')!;
const calculateBtn = document.getElementById('calculateBtn') as HTMLButtonElement;
const resultDiv = document.getElementById('result') as HTMLDivElement;
const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
const copyBtn = document.getElementById('copyBtn') as HTMLButtonElement;
const themeSelect = document.getElementById('themeSelect') as HTMLSelectElement;
const toggleDark = document.getElementById('toggleDark') as HTMLButtonElement;

// --- Data ---
const criteria: string[] = ['A', 'B', 'C', 'D'];
const subjects: string[] = [
  'English', 'Christian Development', 'Language', 'History/Geography',
  'Maths', 'Music', 'PDHPE', 'Science', 'Technology', 'Visual Arts'
];
const gradeInputsArray: HTMLInputElement[][] = [];

// --- Themes ---
const themes: Theme[] = [
  {
    name: "Blue",
    main: "#2196F3",
    bgStart: "#f5f7fa",
    bgEnd: "#c3cfe2",
    text: "#222",
    highColor: "#c8facc",
    lowColor: "#fff7c0",
    glowAvg: "#4CAF50",
    glowResult: "#FF9800"
  },
  {
    name: "Green",
    main: "#4CAF50",
    bgStart: "#f5f7fa",
    bgEnd: "#c3f0d0",
    text: "#222",
    highColor: "#b9f2d5",
    lowColor: "#fffec0",
    glowAvg: "#4CAF50",
    glowResult: "#4CAF50"
  },
  {
    name: "Orange",
    main: "#FF9800",
    bgStart: "#fff5e6",
    bgEnd: "#ffe0b2",
    text: "#222",
    highColor: "#ffe0b2",
    lowColor: "#fff7c0",
    glowAvg: "#FF9800",
    glowResult: "#FF9800"
  },
  {
    name: "Purple",
    main: "#9C27B0",
    bgStart: "#f3e5f5",
    bgEnd: "#e1bee7",
    text: "#222",
    highColor: "#e3c8facc",
    lowColor: "#fff0c0",
    glowAvg: "#9C27B0",
    glowResult: "#9C27B0"
  }
];

// --- Functions ---
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty('--main-color', theme.main);
  root.style.setProperty('--bg-start', theme.bgStart);
  root.style.setProperty('--bg-end', theme.bgEnd);
  root.style.setProperty('--text-color', theme.text);

  // Update glow and high/low colors dynamically
  document.querySelectorAll<HTMLInputElement>('.criterion-box input').forEach(input => {
    if (input.classList.contains('high')) input.style.backgroundColor = theme.highColor;
    if (input.classList.contains('low')) input.style.backgroundColor = theme.lowColor;
  });

  const avgStyle = document.createElement('style');
  avgStyle.id = 'theme-glow-style';
  avgStyle.textContent = `
    @keyframes avgGlow { 
      0% { opacity: 0; transform: translateY(-5px); text-shadow: 0 0 0 ${theme.glowAvg}; }
      50% { opacity: 1; transform: translateY(0); text-shadow: 0 0 8px ${theme.glowAvg}, 0 0 12px ${theme.glowAvg}; }
      100% { opacity: 1; transform: translateY(0); text-shadow: 0 0 0 ${theme.glowAvg}; }
    }
    @keyframes resultGlow {
      0% { opacity: 0; transform: translateY(-10px); text-shadow: 0 0 0 ${theme.glowResult}; }
      50% { opacity: 1; transform: translateY(0); text-shadow: 0 0 12px ${theme.glowResult}, 0 0 20px ${theme.glowResult}; }
      100% { opacity: 1; transform: translateY(0); text-shadow: 0 0 0 ${theme.glowResult}; }
    }
  `;
  const existing = document.getElementById('theme-glow-style');
  if (existing) existing.replaceWith(avgStyle);
  else document.head.appendChild(avgStyle);

  localStorage.setItem('customTheme', JSON.stringify(theme));
}

function clampGrade(value: string): string {
  let num = parseInt(value.replace(/[^0-9]/g, ''));
  if (isNaN(num)) return '';
  return Math.max(0, Math.min(8, num)).toString();
}

function updateSubjectAverage(gradeInputs: HTMLInputElement[], avgDiv: HTMLDivElement) {
  let total = 0, count = 0;
  gradeInputs.forEach(input => {
    input.classList.remove('high', 'low');
    const val = parseInt(input.value);
    if (!isNaN(val)) {
      total += val;
      count++;
      if (val >= 7) {
        input.classList.add('high');
        input.style.backgroundColor = getCurrentTheme()?.highColor!;
      } else if (val <= 2) {
        input.classList.add('low');
        input.style.backgroundColor = getCurrentTheme()?.lowColor!;
      } else {
        input.style.backgroundColor = '';
      }
    } else {
      input.style.backgroundColor = '';
    }
  });

  const avg = count ? (total / count).toFixed(2) : '';
  avgDiv.textContent = avg ? `Subject Average: ${avg}` : '';
  avgDiv.classList.toggle('show', !!avg);
  avgDiv.classList.remove('glow');

  if (avg) {
    void avgDiv.offsetWidth; // force reflow
    avgDiv.classList.add('glow');
  }
}

function calculateOverallAverage() {
  let total = 0, count = 0;
  gradeInputsArray.flat().forEach(input => {
    const val = parseInt(input.value);
    if (!isNaN(val)) { total += val; count++; }
  });
  if (!count) {
    resultDiv.textContent = "Please enter some grades!";
    copyBtn.style.display = 'none';
    resultDiv.classList.remove('show');
    return;
  }
  const average = (total / count).toFixed(2);
  resultDiv.textContent = `Average Grade: ${average}`;
  resultDiv.classList.add('show');
  copyBtn.style.display = 'inline-block';
}

function saveGrades() {
  const data = gradeInputsArray.map(subArr => subArr.map(inp => inp.value));
  localStorage.setItem('grades', JSON.stringify(data));
}

function loadGrades() {
  const stored = JSON.parse(localStorage.getItem('grades') || '[]') as string[][];
  stored.forEach((subArr, i) => {
    subArr.forEach((val, j) => {
      if (gradeInputsArray[i][j]) {
        gradeInputsArray[i][j].value = val;
        gradeInputsArray[i][j].dispatchEvent(new Event('input'));
      }
    });
  });
}

function loadTheme() {
  const stored = localStorage.getItem('customTheme');
  if (stored) applyTheme(JSON.parse(stored));
  else applyTheme(themes[0]);
}

function getCurrentTheme(): Theme | undefined {
  const stored = localStorage.getItem('customTheme');
  return stored ? JSON.parse(stored) as Theme : themes[0];
}

// --- Populate Dropdown ---
themes.forEach(theme => {
  const option = document.createElement('option');
  option.value = theme.name;
  option.textContent = theme.name;
  themeSelect.appendChild(option);
});

// --- Generate Subjects & Inputs ---
subjects.forEach(subjectName => {
  const subjectDiv = document.createElement('div');
  subjectDiv.classList.add('subject');
  subjectDiv.innerHTML = `<h3>${subjectName}</h3>`;

  const inputsRow = document.createElement('div');
  inputsRow.classList.add('criterion-row');
  const gradeInputs: HTMLInputElement[] = [];

  criteria.forEach(c => {
    const box = document.createElement('div');
    box.classList.add('criterion-box');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '0-8';
    const label = document.createElement('label');
    label.textContent = `Criterion ${c}`;
    input.addEventListener('input', () => {
      input.value = clampGrade(input.value);
      updateSubjectAverage(gradeInputs, avgDiv);
      saveGrades();
    });
    gradeInputs.push(input);
    box.appendChild(input);
    box.appendChild(label);
    inputsRow.appendChild(box);
  });

  const avgDiv = document.createElement('div');
  avgDiv.classList.add('subject-average');
  subjectDiv.appendChild(inputsRow);
  subjectDiv.appendChild(avgDiv);
  subjectsContainer.appendChild(subjectDiv);
  gradeInputsArray.push(gradeInputs);
});

// --- Event Listeners ---
calculateBtn.addEventListener('click', calculateOverallAverage);

copyBtn.addEventListener('click', () => {
  const match = resultDiv.textContent?.match(/[\d.]+/);
  if (!match) return;
  navigator.clipboard.writeText(match[0]);
  copyBtn.textContent = 'Copied!';
  setTimeout(() => copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Result', 1500);
});

resetBtn.addEventListener('click', () => {
  gradeInputsArray.flat().forEach(input => {
    input.value = '';
    input.classList.remove('high', 'low');
    input.style.backgroundColor = '';
  });
  document.querySelectorAll('.subject-average').forEach(avg => {
    avg.textContent = '';
    avg.classList.remove('show', 'glow');
  });
  resultDiv.textContent = '';
  resultDiv.classList.remove('show');
  copyBtn.style.display = 'none';
  saveGrades();
});

themeSelect.addEventListener('change', () => {
  const selected = themes.find(t => t.name === themeSelect.value);
  if (selected) applyTheme(selected);
});

toggleDark.addEventListener('click', () => {
  document.body.classList.toggle('theme-dark');
  toggleDark.innerHTML = document.body.classList.contains('theme-dark')
    ? '<i class="fas fa-sun"></i> Light Mode'
    : '<i class="fas fa-moon"></i> Dark Mode';
  localStorage.setItem('darkMode', document.body.classList.contains('theme-dark').toString());
});

// --- Initial Load ---
window.addEventListener('DOMContentLoaded', () => {
  loadGrades();
  loadTheme();
});
