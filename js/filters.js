
/* ================================
   TASK FILTERS
================================ */

let currentFilter = "all";
let currentPriority = "all";

// Set task status filter
export function setFilter(filter) {
    currentFilter = filter;
}

// Set priority filter
export function setPriorityFilter(priority) {
    currentPriority = priority;
}

// Get filtered tasks
export function getFilteredTasks(tasks) {
    let filteredTasks = [...tasks];

    // Status filter
    if (currentFilter === "active") {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(task => task.completed);
    }

    // Priority filter
    if (currentPriority !== "all") {
        filteredTasks = filteredTasks.filter(
            task => task.priority === currentPriority
        );
    }

    return filteredTasks;
}

// Reset all filters
export function resetFilters() {
    currentFilter = "all";
    currentPriority = "all";
}
