// DOM Elements
const taskInput = document.getElementById("taskInput");
const category = document.getElementById("category");
const priority = document.getElementById("priority");
const deadline = document.getElementById("deadline");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

document.addEventListener("DOMContentLoaded", loadTasks);

addBtn.addEventListener("click", () => {
  if (taskInput.value.trim() === "") {
    alert("Please enter a task!");
    return;
  }
  addTask(taskInput.value, category.value, priority.value, deadline.value, false);
  saveTasks();
  taskInput.value = "";
  deadline.value = "";
});

function addTask(text, category, priority, deadline, completed) {
  const li = document.createElement("li");
  li.classList.add(priority.toLowerCase());

  if (completed) li.classList.add("completed");

  let countdown = "";
  if (deadline) {
    const timeLeft = getTimeLeft(deadline);
    countdown = `<br><small class="deadline">⏳ ${timeLeft}</small>`;
  }

  li.innerHTML = `
    <div class="task-details">
      <strong>${text}</strong> <br>
      <small>${category} | ${priority}</small>
      ${countdown}
    </div>
    <div class="task-actions">
      <button class="complete-btn">✔</button>
      <button class="delete-btn">🗑</button>
    </div>
  `;

  // Buttons
  li.querySelector(".complete-btn").addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  li.querySelector(".delete-btn").addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  taskList.appendChild(li);
}

// Save to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("li").forEach(li => {
    tasks.push({
      text: li.querySelector("strong").innerText,
      category: li.querySelector("small").innerText.split(" | ")[0],
      priority: li.querySelector("small").innerText.split(" | ")[1],
      deadline: li.querySelector(".deadline")?.innerText.replace("⏳ ", ""),
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    addTask(task.text, task.category, task.priority, task.deadline, task.completed);
  });
}

// Countdown Function
function getTimeLeft(deadline) {
  const diff = new Date(deadline) - new Date();
  if (diff <= 0) return "Deadline Passed";
  const hrs = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  return `${hrs}h ${mins}m left`;
}
