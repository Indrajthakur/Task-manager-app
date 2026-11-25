import { apiRequest } from "./api.js";

// Convert database fields into app fields
function formatTask(task) {
    return {
        id: task.id,
        title: task.title,
        priority: task.priority,
        dueDate: task.due_date,
        completed: task.completed,
        createdAt: task.created_at
    };
}

// Load tasks
export async function fetchTasks() {
    const data = await apiRequest("/api/tasks");

    return data.map(formatTask);
}

// Add a task
export async function createTask(title, priority, dueDate) {
    const data = await apiRequest("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
            title: title.trim(),
            priority,
            due_date: dueDate || null
        })
    });

    return formatTask(data);
}

// Delete a task
export async function removeTask(taskId) {
    await apiRequest(`/api/tasks/${taskId}`, {
        method: "DELETE"
    });
}

// Update a task
export async function editTask(taskId, updates) {
    const databaseUpdates = {};

    if (updates.title !== undefined) {
        databaseUpdates.title = updates.title.trim();
    }

    if (updates.priority !== undefined) {
        databaseUpdates.priority = updates.priority;
    }

    if (updates.dueDate !== undefined) {
        databaseUpdates.due_date = updates.dueDate || null;
    }

    const data = await apiRequest(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(databaseUpdates)
    });

    return formatTask(data);
}

// Change task completion status
export async function setTaskCompletion(taskId, completed) {
    const data = await apiRequest(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ completed })
    });

    return formatTask(data);
}