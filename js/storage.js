
/* ================================
   TASK STORAGE
================================ */

let tasksCache = [];

// Get tasks from memory
export function getTasks() {
    return tasksCache;
}

// Update the task cache
export function saveTasks(tasks) {
    tasksCache = tasks;
}

// Clear the task cache
export function clearTasks() {
    tasksCache = [];
}
