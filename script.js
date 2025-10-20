const subjectsContainer = document.querySelector('.subjects');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');
const toggleModeBtn = document.getElementById('toggleMode');

// Copy button
const copyBtn = document.createElement('button');
copyBtn.textContent = 'Copy Result';
copyBtn.id = 'copyBtn';
copyBtn.style.display = 'none';
copyBtn.type = 'button';
resultDiv.after(copyBtn);

const criteria = ['A','B','C','D'];
const subjects = [
  'English','Christian Development','Language','History/Geography',
  'Maths','Music','PDHPE','Science','Technology','Visual Arts'
];

// Generate subject cards and inputs
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
    input.placeholder = '';
    input.classList.add('grade');

    const label = document.createElement('label');
    label.textContent = `Criterion ${c}`;

    // Enforce 0–8 integers
    input.addEventListener('input', () => {
      // Remove non-digit characters
      input.value = input.value.replace(/[^0-8]/g, '');

      // Clamp value between 0 and 8
      if(input.value !== '') {
        input.value = Math.min(8, Math.max(0, parseInt(input.value)));
      }

      // Update subject average live
      const total = gradeInputs.reduce((sum, el) => {
        const val = parseInt(el.value);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
      const count = gradeInputs.filter(el => el.value !== '').length;
      const avg = count ? (total / count).toFixed(2) : '';
      avgDiv.textContent = avg ? `Subject Average: ${avg}` : '';
      if(avg) avgDiv.classList.add('show');
      else avgDiv.classList.remove('show');
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
});

// Calculate overall average
calculateBtn.addEventListener('click', () => {
  const gradeInputs = document.querySelectorAll('.grade');
  let total = 0;
  let count = 0;

  gradeInputs.forEach(input => {
    const val = parseInt(input.value);
    if(!isNaN(val)) {
      total += val;
      count++;
    }
  });

  if(count === 0) {
    resultDiv.textContent = "Please enter some grades!";
    copyBtn.style.display = 'none';
    resultDiv.classList.remove('show');
  } else {
    const average = (total / count).toFixed(2);
    resultDiv.textContent = `Average Grade: ${average}`;
    resultDiv.classList.add('show');

    // Glow animation
    resultDiv.classList.remove('glow');
    void resultDiv.offsetWidth; // force reflow
    resultDiv.classList.add('glow');

    copyBtn.style.display = 'inline-block';
  }
});

// Copy result to clipboard
copyBtn.addEventListener('click', () => {
  const numMatch = resultDiv.textContent.match(/[\d.]+/);
  if(!numMatch) return;
  const num = numMatch[0];
  navigator.clipboard.writeText(num).then(() => {
    copyBtn.textContent = 'Copied!';
    setTimeout(() => copyBtn.textContent = 'Copy Result', 1500);
  });
});

// Light/Dark mode toggle
toggleModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  toggleModeBtn.textContent = document.body.classList.contains('dark') ? "Switch to Light Mode" : "Switch to Dark Mode";
});
