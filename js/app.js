
/* =================================
   TASK MANAGER - MAIN APPLICATION
================================= */

import { getTasks, saveTasks, clearTasks } from "./storage.js";

import {
    addTask,
    deleteTask,
    toggleTask,
    updateTask
} from "./tasks.js";

import { fetchTasks } from "./task-api.js";
import { getToken, clearSession, logout } from "./api.js";

import { updateDashboard } from "./dashboard.js";

import {
    setFilter,
    setPriorityFilter,
    getFilteredTasks,
    resetFilters
} from "./filters.js";

import { searchTasks } from "./search.js";
import { initializeModal } from "./modal.js";
import { showNotification } from "./notifications.js";
import { formatDate } from "./utils.js";

// APPLICATION STATE
let searchText = "";
let currentView = "all";
let editingTaskId = null;

// GET TODAY'S DATE
function getTodayString() {
    const today = new Date();

    return [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");
}

// =================================
// RENDER MAIN TASKS
// =================================

function renderTasks() {
    const taskList = document.getElementById("taskList");

    if (!taskList) return;

    const allTasks = getTasks();

    let tasks = getFilteredTasks(allTasks);

    if (currentView === "today") {
        tasks = allTasks.filter(task =>
            task.dueDate === getTodayString()
        );
    }

    if (currentView === "upcoming") {
        tasks = allTasks.filter(task =>
            task.dueDate &&
            task.dueDate > getTodayString() &&
            !task.completed
        );
    }

    if (currentView === "completed") {
        tasks = allTasks.filter(task => task.completed);
    }

    tasks = searchTasks(tasks, searchText);

    taskList.replaceChildren();

    if (tasks.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-state";
        emptyMessage.textContent = "No tasks found. Add a new task!";

        taskList.appendChild(emptyMessage);
        return;
    }

    tasks.forEach(task => {
        const item = document.createElement("div");

        item.className = `task-item ${task.completed ? "completed" : ""}`;

        // CHECKBOX
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Complete task");

        checkbox.addEventListener("change", async () => {
            try {
                await toggleTask(task.id);

                renderApp();

                showNotification(
                    task.completed
                        ? "Task marked as pending"
                        : "Task completed!"
                );
            } catch (error) {
                console.error("Could not update task:", error);
                showNotification("Could not update task.", "error");
                checkbox.checked = task.completed;
            }
        });

        // TASK INFORMATION
        const info = document.createElement("div");
        info.className = "task-info";

        const title = document.createElement("h3");
        title.className = "task-title";
        title.textContent = task.title;

        const meta = document.createElement("div");
        meta.className = "task-meta";

        const priority = document.createElement("span");

        priority.className = `task-priority priority-${task.priority}`;

        priority.textContent =
            task.priority.charAt(0).toUpperCase() +
            task.priority.slice(1);

        const date = document.createElement("span");
        date.textContent = formatDate(task.dueDate);

        meta.append(priority, date);
        info.append(title, meta);

        // TASK ACTIONS
        const actions = document.createElement("div");
        actions.className = "task-actions";

        // DELETE BUTTON
        const deleteButton = document.createElement("button");

        deleteButton.className = "task-action-btn";
        deleteButton.type = "button";
        deleteButton.textContent = "🗑";
        deleteButton.setAttribute("aria-label", "Delete task");

        deleteButton.addEventListener("click", async () => {
            try {
                await deleteTask(task.id);

                renderApp();

                showNotification("Task deleted!");
            } catch (error) {
                console.error("Could not delete task:", error);
                showNotification("Could not delete task.", "error");
            }
        });

        // EDIT BUTTON
        const editButton = document.createElement("button");

        editButton.className = "task-action-btn";
        editButton.type = "button";
        editButton.textContent = "✏️";
        editButton.setAttribute("aria-label", "Edit task");

        editButton.addEventListener("click", () => {
            editingTaskId = task.id;

            document.getElementById("modalTitle").textContent = "Edit Task";
            document.getElementById("taskTitle").value = task.title;
            document.getElementById("taskPriority").value = task.priority;
            document.getElementById("taskDate").value = task.dueDate;

            document.getElementById("saveTaskBtn").textContent = "Update Task";

            document.getElementById("taskModal").classList.remove("hidden");
        });

        actions.append(editButton, deleteButton);

        item.append(checkbox, info, actions);

        taskList.appendChild(item);
    });
}

// =================================
// RENDER UPCOMING TASKS
// =================================

function renderUpcomingTasks() {
    const container = document.getElementById("upcomingTasks");

    if (!container) return;

    const upcoming = getTasks()
        .filter(task =>
            task.dueDate &&
            task.dueDate > getTodayString() &&
            !task.completed
        )
        .sort((a, b) =>
            a.dueDate.localeCompare(b.dueDate)
        )
        .slice(0, 5);

    container.replaceChildren();

    if (upcoming.length === 0) {
        const message = document.createElement("p");

        message.className = "empty-state";
        message.textContent = "No upcoming tasks. You're all caught up!";

        container.appendChild(message);
        return;
    }

    upcoming.forEach(task => {
        const item = document.createElement("div");

        item.className = "upcoming-task-item";

        const title = document.createElement("h3");
        title.textContent = task.title;

        const date = document.createElement("span");
        date.textContent = formatDate(task.dueDate);

        item.append(title, date);

        container.appendChild(item);
    });
}

// =================================
// UPDATE APPLICATION
// =================================

function renderApp() {
    renderTasks();
    renderUpcomingTasks();
    updateDashboard();
}

// =================================
// ADD AND EDIT TASK FORM
// =================================

function initializeTaskForm() {
    const form = document.getElementById("taskForm");
    const modal = document.getElementById("taskModal");

    if (!form) return;

    const addButton = document.getElementById("addTaskBtn");
    const saveButton = document.getElementById("saveTaskBtn");

    if (addButton) {
        addButton.addEventListener("click", () => {
            editingTaskId = null;

            form.reset();

            document.getElementById("modalTitle").textContent = "Add New Task";
            saveButton.textContent = "Save Task";
        });
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();

        const title = document.getElementById("taskTitle").value.trim();
        const priority = document.getElementById("taskPriority").value;
        const dueDate = document.getElementById("taskDate").value;

        if (!title || !dueDate) {
            showNotification("Please complete all required fields.", "error");
            return;
        }

        saveButton.disabled = true;
        saveButton.textContent = "Please wait...";

        try {
            if (editingTaskId) {
                await updateTask(editingTaskId, {
                    title,
                    priority,
                    dueDate
                });

                editingTaskId = null;

                document.getElementById("modalTitle").textContent = "Add New Task";
                showNotification("Task updated successfully!");
            } else {
                await addTask(title, priority, dueDate);

                showNotification("Task added successfully!");
            }

            form.reset();

            if (modal) {
                modal.classList.add("hidden");
            }

            currentView = "all";

            renderApp();

        } catch (error) {
            console.error("Could not save task:", error);
            showNotification("Could not save task. Please try again.", "error");

        } finally {
            saveButton.disabled = false;
            saveButton.textContent = editingTaskId ? "Update Task" : "Save Task";
        }
    });
}

// =================================
// SEARCH
// =================================

function initializeSearch() {
    const searchInput = document.getElementById("searchInput");

    if (!searchInput) return;

    searchInput.addEventListener("input", event => {
        searchText = event.target.value;

        renderTasks();
    });
}

// =================================
// TASK FILTERS
// =================================

function initializeFilters() {
    const filterButtons = document.querySelectorAll(
        "[data-filter], .task-tab"
    );

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = (
                button.dataset.filter ||
                button.textContent
            ).trim().toLowerCase();

            if (filter.includes("complete")) {
                setFilter("completed");
            } else if (
                filter.includes("active") ||
                filter.includes("pending")
            ) {
                setFilter("active");
            } else {
                setFilter("all");
                resetFilters();
            }

            currentView = "all";

            filterButtons.forEach(item =>
                item.classList.remove("active")
            );

            button.classList.add("active");

            renderTasks();
        });
    });

    // PRIORITY FILTERS
    const priorityButtons = document.querySelectorAll("[data-priority]");

    priorityButtons.forEach(button => {
        button.addEventListener("click", () => {
            setPriorityFilter(button.dataset.priority);

            currentView = "all";

            priorityButtons.forEach(item =>
                item.classList.remove("active")
            );

            button.classList.add("active");

            renderTasks();
        });
    });
}

// =================================
// SIDEBAR NAVIGATION
// =================================

function initializeNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            const label = link.textContent.trim().toLowerCase();

            if (label.includes("dashboard")) {
                currentView = "all";
                setFilter("all");

            } else if (label.includes("today")) {
                currentView = "today";

            } else if (label.includes("upcoming")) {
                currentView = "upcoming";

            } else if (label.includes("completed")) {
                currentView = "completed";

            } else if (label.includes("all tasks")) {
                currentView = "all";
                setFilter("all");

            } else if (label.includes("settings")) {
                showNotification("Settings are coming soon!");
                return;

            } else if (label.includes("appearance")) {
                document.body.classList.toggle("light-theme");
                return;
            }

            navLinks.forEach(item =>
                item.classList.remove("active")
            );

            link.classList.add("active");

            renderTasks();

            document.querySelector(".tasks-panel")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        });
    });
}

// =================================
// DARK MODE
// =================================

function initializeTheme() {
    const themeButton = document.getElementById("themeToggle");

    if (!themeButton) return;

    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");

        showNotification("Theme changed!");
    });
}

// =================================
// VIEW ALL UPCOMING TASKS
// =================================

function initializeViewAll() {
    const buttons = document.querySelectorAll(".upcoming-panel button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            currentView = "upcoming";

            renderTasks();

            document.querySelector(".tasks-panel")
                ?.scrollIntoView({
                    behavior: "smooth"
                });
        });
    });
}

// =================================
// START APPLICATION
// =================================

document.addEventListener("DOMContentLoaded", async () => {
        document.getElementById("logoutBtn")
        ?.addEventListener("click", () => {
            clearTasks();
            logout();
        });
    try {
        const token = getToken();

        if (!token) {
            clearSession();
            window.location.replace("./auth.html");
            return;
        }

        const tasks = await fetchTasks();

        saveTasks(tasks);

        initializeNavigation();
        initializeModal();
        initializeTaskForm();
        initializeSearch();
        initializeFilters();
        initializeTheme();
        initializeViewAll();

        renderApp();

        console.log("Task Manager initialized successfully!");

    } catch (error) {
        console.error("Could not load tasks:", error);

        if (
            error.message === "Invalid or expired token" ||
            error.message === "Access token required"
        ) {
            clearSession();
            window.location.replace("./auth.html");
            return;
        }

        showNotification(
            "Could not load tasks. Please try again.",
            "error"
        );
    }
});