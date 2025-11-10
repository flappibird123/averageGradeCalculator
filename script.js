"use strict";
// --- DOM Elements ---
const subjectsContainer = document.querySelector('.subjects');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');
const resetBtn = document.getElementById('resetBtn');
const copyBtn = document.getElementById('copyBtn');
const themeSelect = document.getElementById('themeSelect');
const toggleDark = document.getElementById('toggleDark');
// --- Data ---
const criteria = ['A', 'B', 'C', 'D'];
const subjects = [
    'English', 'Christian Development', 'Language', 'History/Geography',
    'Maths', 'Music', 'PDHPE', 'Science', 'Technology', 'Visual Arts'
];
// Store references to inputs
const gradeInputsArray = [];
// --- Generate subjects & inputs ---
subjects.forEach(subjectName => {
    const subjectDiv = document.createElement('div');
    subjectDiv.classList.add('subject');
    subjectDiv.innerHTML = `<h3>${subjectName}</h3>`;
    const inputsRow = document.createElement('div');
    inputsRow.classList.add('criterion-row');
    const gradeInputs = [];
    criteria.forEach(c => {
        const box = document.createElement('div');
        box.classList.add('criterion-box');
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('grade');
        input.placeholder = '0-8';
        const label = document.createElement('label');
        label.textContent = `Criterion ${c}`;
        // --- Input validation: 0-8 inclusive, empty allowed ---
        input.addEventListener('input', () => {
            // Remove non-digits
            input.value = input.value.replace(/[^0-9]/g, '');
            // Clamp between 0-8 if not empty
            if (input.value !== '') {
                let val = parseInt(input.value);
                if (val > 8)
                    val = 8;
                if (val < 0)
                    val = 0;
                input.value = val.toString();
            }
            updateSubjectAverage();
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
    // --- Function to update subject average ---
    function updateSubjectAverage() {
        let total = 0;
        let count = 0;
        gradeInputs.forEach(input => {
            input.classList.remove('high', 'low');
            const val = parseInt(input.value);
            if (!isNaN(val)) {
                total += val;
                count++;
                if (val >= 7)
                    input.classList.add('high');
                else if (val <= 2)
                    input.classList.add('low');
            }
        });
        const avg = count ? (total / count).toFixed(2) : '';
        avgDiv.textContent = avg ? `Subject Average: ${avg}` : '';
        avgDiv.classList.toggle('show', !!avg);
        avgDiv.classList.remove('glow');
        if (avg) {
            void avgDiv.offsetWidth;
            avgDiv.classList.add('glow');
        }
    }
    updateSubjectAverage();
});
// --- Calculate overall average ---
calculateBtn.addEventListener('click', () => {
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
    }
    else {
        const average = (total / count).toFixed(2);
        resultDiv.textContent = `Average Grade: ${average}`;
        resultDiv.classList.add('show');
        copyBtn.style.display = 'inline-block';
    }
});
// --- Copy result ---
copyBtn.addEventListener('click', () => {
    var _a;
    const numMatch = (_a = resultDiv.textContent) === null || _a === void 0 ? void 0 : _a.match(/[\d.]+/);
    if (!numMatch)
        return;
    navigator.clipboard.writeText(numMatch[0]);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Result', 1500);
});
// --- Reset all ---
resetBtn.addEventListener('click', () => {
    // Clear all input values and remove highlight classes
    gradeInputsArray.flat().forEach(input => {
        input.value = '';
        input.classList.remove('high', 'low');
    });
    // Clear subject averages
    document.querySelectorAll('.subject-average').forEach(avg => {
        avg.textContent = '';
        avg.classList.remove('show', 'glow');
    });
    // Clear overall result
    resultDiv.textContent = '';
    resultDiv.classList.remove('show');
    // Hide copy button
    copyBtn.style.display = 'none';
    // Save cleared grades to localStorage
    saveGrades();
});
// --- Theme Picker ---
themeSelect.addEventListener('change', () => {
    document.body.classList.remove('theme-blue', 'theme-green', 'theme-orange', 'theme-purple');
    document.body.classList.add(themeSelect.value);
    localStorage.setItem('theme', themeSelect.value);
});
// --- Dark Mode Toggle ---
toggleDark.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    if (document.body.classList.contains('theme-dark')) {
        toggleDark.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
    else {
        toggleDark.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
    localStorage.setItem('darkMode', document.body.classList.contains('theme-dark').toString());
});
// --- Local Storage Functions ---
function saveGrades() {
    const gradeData = gradeInputsArray.map(subArr => subArr.map(inp => inp.value));
    localStorage.setItem('grades', JSON.stringify(gradeData));
}
// --- Load grades, theme, dark mode ---
window.addEventListener('DOMContentLoaded', () => {
    const storedGrades = JSON.parse(localStorage.getItem('grades') || '[]');
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
    // Load theme
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        themeSelect.value = storedTheme;
        document.body.classList.add(storedTheme);
    }
    // Load dark mode
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('theme-dark');
        toggleDark.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
});
