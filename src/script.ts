"use strict";

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

// --- Store references to inputs ---
const gradeInputsArray: HTMLInputElement[][] = [];

// --- Functions ---
function clampGrade(value: string): string {
  let num = parseInt(value.replace(/[^0-9]/g, ''));
  if (isNaN(num)) return '';
  if (num < 0) num = 0;
  if (num > 8) num = 8;
  return num.toString();
}

function updateSubjectAverage(gradeInputs: HTMLInputElement[], avgDiv: HTMLDivElement): void {
  let total = 0;
  let count = 0;

  gradeInputs.forEach(input => {
    input.classList.remove('high', 'low');
    const val = parseInt(input.value);
    if (!isNaN(val)) {
      total += val;
      count++;
      if (val >= 7) input.classList.add('high');
      else if (val <= 2) input.classList.add('low');
    }
  });

  const avg: string = count ? (total / count).toFixed(2) : '';
  avgDiv.textContent = avg ? `Subject Average: ${avg}` : '';
  avgDiv.classList.toggle('show', !!avg);
  avgDiv.classList.remove('glow');

  if (avg) {
    void avgDiv.offsetWidth;
    avgDiv.classList.add('glow');
  }
}

function calculateOverallAverage(): void {
  let total = 0;
  let count = 0;

  gradeInputsArray.flat().forEach(input => {
    const val = parseInt(input.value);
    if (!isNaN(val)) {
      total += val;
      count++;
    }
  });

  if (count === 0) {
    resultDiv.textContent = "Please enter some grades!";
    copyBtn.style.display = 'none';
    resultDiv.classList.remove('show');
  } else {
    const average = (total / count).toFixed(2);
    resultDiv.textContent = `Average Grade: ${average}`;
    resultDiv.classList.add('show');
    copyBtn.style.display = 'inline-block';
  }
}

function saveGrades(): void {
  const gradeData = gradeInputsArray.map(subArr => subArr.map(inp => inp.value));
  localStorage.setItem('grades', JSON.stringify(gradeData));
}

function loadGrades(): void {
  const storedGrades = JSON.parse(localStorage.getItem('grades') || '[]') as string[][];
  if (storedGrades) {
    storedGrades.forEach((subArr, i) => {
      subArr.forEach((val, j) => {
        if (gradeInputsArray[i][j]) {
          gradeInputsArray[i][j].value = val;
          gradeInputsArray[i][j].dispatchEvent(new Event('input'));
        }
      });
    });
  }
}

function loadTheme(): void {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    themeSelect.value = storedTheme;
    document.body.classList.add(storedTheme);
  }

  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('theme-dark');
    toggleDark.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
  }
}

// --- Generate subjects & inputs ---
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
    input.classList.add('grade');
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
  updateSubjectAverage(gradeInputs, avgDiv);
});

// --- Event Listeners ---
calculateBtn.addEventListener('click', calculateOverallAverage);

copyBtn.addEventListener('click', () => {
  const numMatch = resultDiv.textContent?.match(/[\d.]+/);
  if (!numMatch) return;
  navigator.clipboard.writeText(numMatch[0]);
  copyBtn.textContent = 'Copied!';
  setTimeout(() => copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Result', 1500);
});

resetBtn.addEventListener('click', () => {
  gradeInputsArray.flat().forEach(input => {
    input.value = '';
    input.classList.remove('high', 'low');
  });
  document.querySelectorAll<HTMLDivElement>('.subject-average').forEach(avg => {
    avg.textContent = '';
    avg.classList.remove('show', 'glow');
  });
  resultDiv.textContent = '';
  resultDiv.classList.remove('show');
  copyBtn.style.display = 'none';
  saveGrades();
});

themeSelect.addEventListener('change', () => {
  document.body.classList.remove('theme-blue', 'theme-green', 'theme-orange', 'theme-purple');
  document.body.classList.add(themeSelect.value);
  localStorage.setItem('theme', themeSelect.value);
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
