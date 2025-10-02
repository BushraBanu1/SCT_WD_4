const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const deadlineInput = document.getElementById("deadlineInput");
const priorityInput = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");
const progressBar = document.getElementById("progress");
const progressText = document.getElementById("progressText");

let tasks = [];

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  const deadline = deadlineInput.value;
  const priority = priorityInput.value;

  if (taskText === "") return;

  const task = {
    id: Date.now(),
    text: taskText,
    deadline: deadline,
    priority: priority,
    completed: false,
  };

  tasks.push(task);
  renderTasks();
  taskForm.reset();
});

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <div class="task-info">
        <strong>${task.text}</strong> 
        ${task.deadline ? `<small>📅 ${task.deadline}</small>` : ""}
        <span class="priority-${task.priority.toLowerCase()}">[${task.priority}]</span>
      </div>
      <div class="task-actions">
        <button onclick="toggleComplete(${task.id})">✔</button>
        <button class="edit" onclick="editTask(${task.id})">✏</button>
        <button class="delete" onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });

  updateProgress();
}

function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  taskInput.value = task.text;
  deadlineInput.value = task.deadline;
  priorityInput.value = task.priority;

  deleteTask(id); // Remove old version before editing
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

clearAllBtn.addEventListener("click", () => {
  tasks = [];
  renderTasks();
});

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressBar.style.width = percent + "%";
  progressBar.textContent = percent + "%";
  progressText.textContent = `${completed} of ${total} tasks completed`;
}
