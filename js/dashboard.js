
/* ================================
   DASHBOARD
================================ */

import { getTasks } from "./storage.js";
import { formatDate, isOverdue } from "./utils.js";

// Update dashboard statistics
export function updateDashboard() {
    const tasks = getTasks();

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    const overdue = tasks.filter(
        task => !task.completed && isOverdue(task)
    ).length;

    // Update statistics
    const totalElement = document.getElementById("totalTasks");
    const completedElement = document.getElementById("completedTasks");
    const pendingElement = document.getElementById("pendingTasks");
    const overdueElement = document.getElementById("overdueTasks");

    if (totalElement) totalElement.textContent = total;
    if (completedElement) completedElement.textContent = completed;
    if (pendingElement) pendingElement.textContent = pending;
    if (overdueElement) overdueElement.textContent = overdue;

    // Update progress
    updateProgress(total, completed);

    // Update upcoming tasks
    
}

// Update progress circle
function updateProgress(total, completed) {
    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    const progressValue = document.getElementById("progressValue");
    const progressCircle = document.getElementById("progressCircle");

    if (progressValue) {
        progressValue.textContent = `${percentage}%`;
    }

    if (progressCircle) {
        progressCircle.style.background = `
            conic-gradient(
                var(--purple) ${percentage}%,
                var(--bg-hover) ${percentage}%
            )
        `;
    }
}

// Show upcoming tasks
function updateUpcomingTasks(tasks) {
    const container = document.getElementById("upcomingTasks");

    if (!container) return;

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    // Get future, incomplete tasks
    const upcoming = tasks
        .filter(task =>
            !task.completed &&
            task.dueDate &&
            task.dueDate > todayString
        )
        .sort((a, b) =>
            a.dueDate.localeCompare(b.dueDate)
        )
        .slice(0, 4);

    container.replaceChildren();

    // Empty state
    if (upcoming.length === 0) {
        const message = document.createElement("p");

        message.className = "empty-state";
        message.textContent = "No upcoming tasks yet.";

        container.appendChild(message);
        return;
    }

    // Display upcoming tasks
    upcoming.forEach(task => {
        const item = document.createElement("div");

        item.className = "upcoming-task";

        const title = document.createElement("span");
        title.textContent = task.title;

        const date = document.createElement("small");
        date.textContent = formatDate(task.dueDate);

        item.append(title, date);

        container.appendChild(item);
    });
}
