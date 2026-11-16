
/* ================================
   UTILITY FUNCTIONS
================================ */

// Generate a unique task ID
export function generateId() {
    return Date.now().toString(36) +
        Math.random().toString(36).slice(2);
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Format a date
export function formatDate(date) {
    if (!date) return "No due date";

    const [year, month, day] = date.split("-").map(Number);

    const dateObject = new Date(year, month - 1, day);

    if (Number.isNaN(dateObject.getTime())) {
        return "No due date";
    }

    return dateObject.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

// Check whether a task is overdue
export function isOverdue(task) {
    if (!task.dueDate || task.completed) {
        return false;
    }

    return task.dueDate < getTodayDate();
}
