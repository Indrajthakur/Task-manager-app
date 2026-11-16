
/* ================================
   TASK SEARCH
================================ */

export function searchTasks(tasks, searchText) {
    const query = (searchText || "").trim().toLowerCase();

    // Return all tasks if search is empty
    if (!query) {
        return tasks;
    }

    // Search tasks by title
    return tasks.filter(task =>
        (task.title || "").toLowerCase().includes(query)
    );
}
