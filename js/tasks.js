
/* ================================
   TASK MANAGEMENT - SUPABASE
================================ */

import {
    getTasks,
    saveTasks
} from "./storage.js";

import {
    createTask,
    removeTask,
    editTask,
    setTaskCompletion
} from "./supabase-tasks.js";

// Add a task
export async function addTask(title, priority, dueDate) {
    const newTask = await createTask(title, priority, dueDate);

    saveTasks([newTask, ...getTasks()]);

    return newTask;
}

// Delete a task
export async function deleteTask(taskId) {
    await removeTask(taskId);

    const updatedTasks = getTasks().filter(
        task => task.id !== taskId
    );

    saveTasks(updatedTasks);

    return updatedTasks;
}

// Update a task
export async function updateTask(taskId, updates) {
    const updatedTask = await editTask(taskId, updates);

    const updatedTasks = getTasks().map(task =>
        task.id === taskId ? updatedTask : task
    );

    saveTasks(updatedTasks);

    return updatedTasks;
}

// Toggle task completion
export async function toggleTask(taskId) {
    const task = getTasks().find(
        task => task.id === taskId
    );

    if (!task) {
        throw new Error("Task not found.");
    }

    const updatedTask = await setTaskCompletion(
        taskId,
        !task.completed
    );

    const updatedTasks = getTasks().map(item =>
        item.id === taskId ? updatedTask : item
    );

    saveTasks(updatedTasks);

    return updatedTasks;
}

// Get a single task
export function getTaskById(taskId) {
    return getTasks().find(task => task.id === taskId);
}
