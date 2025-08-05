const form = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskDate = document.getElementById('task-date');
const tasksByDateContainer = document.getElementById('tasks-by-date');
const themeToggle = document.getElementById('theme-toggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
let currentFilter = 'all';
let isDark = localStorage.getItem('theme') === 'dark';

if (isDark) {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️ Light Mode';
}

// Handle Theme Toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  isDark = !isDark;
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const task = taskInput.value.trim();
  const date = taskDate.value;

  if (!task || !date) return;

  if (!tasks[date]) tasks[date] = [];

  tasks[date].push({ name: task, completed: false });

  taskInput.value = '';
  taskDate.value = '';

  saveTasks();
  renderTasks();
});

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  tasksByDateContainer.innerHTML = '';
  const selectedMonth = document.getElementById('selectedMonth').value;

  Object.keys(tasks).sort().forEach(date => {
    if (selectedMonth && !date.startsWith(selectedMonth)) return;
    const filtered = tasks[date].filter(task => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'completed') return task.completed;
      if (currentFilter === 'pending') return !task.completed;
    });

    if (filtered.length === 0) return;

    const section = document.createElement('div');
    section.className = 'task-section';

    const heading = document.createElement('h3');
    heading.textContent = `📅 ${new Date(date).toLocaleDateString()}`;
    section.appendChild(heading);

    filtered.forEach((task, idx) => {
      const taskEl = document.createElement('div');
      taskEl.className = 'task';
      if (task.completed) taskEl.classList.add('completed');

      const nameSpan = document.createElement('span');
      nameSpan.textContent = task.name;
      taskEl.appendChild(nameSpan);

      const statusSpan = document.createElement('span');
      statusSpan.className = 'status';
      statusSpan.textContent = task.completed ? '✅ Completed' : '❌ Not Completed';
      taskEl.appendChild(statusSpan);

      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = 'Toggle';
      toggleBtn.onclick = () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
      };
      taskEl.appendChild(toggleBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => {
        tasks[date].splice(idx, 1);
        if (tasks[date].length === 0) delete tasks[date];
        saveTasks();
        renderTasks();
      };
      taskEl.appendChild(deleteBtn);

      section.appendChild(taskEl);
    });

    tasksByDateContainer.appendChild(section);
  });
}

function filterTasks(type) {
  currentFilter = type;
  renderTasks();
}


renderTasks();
