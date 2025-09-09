const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filters button");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const themeToggle = document.getElementById("themeToggle");

document.addEventListener("DOMContentLoaded", loadTasks);
addBtn.addEventListener("click", addTask);
themeToggle.addEventListener("click", toggleTheme);

filterBtns.forEach(btn =>
  btn.addEventListener("click", () => {
    document.querySelector(".filters .active").classList.remove("active");
    btn.classList.add("active");
    filterTasks(btn.dataset.filter);
  })
);

function addTask() {
  const text = taskInput.value.trim();
  const date = taskDate.value;
  if (text === "") return;

  const task = { text, date, completed: false };
  saveTask(task);
  createTaskElement(task);

  taskInput.value = "";
  taskDate.value = "";
  updateProgress();
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span>${task.text} ${task.date ? `<small>(${task.date})</small>` : ""}</span>
  `;

  if (task.completed) li.classList.add("completed");

  li.addEventListener("click", () => {
    task.completed = !task.completed;
    li.classList.toggle("completed");
    updateTask(task);
    updateProgress();
  });

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.classList.add("deleteBtn");
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    taskList.removeChild(li);
    deleteTask(task);
    updateProgress();
  });

  li.appendChild(delBtn);
  taskList.appendChild(li);
}

function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTask(updatedTask) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(t => t.text === updatedTask.text ? updatedTask : t);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskToDelete) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(t => t.text !== taskToDelete.text);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => createTaskElement(task));

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }
  updateProgress();
}

function filterTasks(filter) {
  const tasks = document.querySelectorAll("#taskList li");
  tasks.forEach(task => {
    if (filter === "all") {
      task.style.display = "flex";
    } else if (filter === "completed") {
      task.style.display = task.classList.contains("completed") ? "flex" : "none";
    } else {
      task.style.display = task.classList.contains("completed") ? "none" : "flex";
    }
  });
}

function updateProgress() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;

  progressText.textContent = `${completed}/${total} tasks completed`;
  progressFill.style.width = total > 0 ? `${(completed / total) * 100}%` : "0%";
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}
