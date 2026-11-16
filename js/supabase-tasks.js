
import { supabase } from "./supabase.js";

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

// Load tasks belonging to the logged-in user
export async function fetchTasks() {
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map(formatTask);
}

// Add a task
export async function createTask(title, priority, dueDate) {
    const { data: userData, error: userError } =
        await supabase.auth.getUser();

    if (userError) throw userError;
    if (!userData.user) throw new Error("You must be logged in.");

    const { data, error } = await supabase
        .from("tasks")
        .insert({
            user_id: userData.user.id,
            title: title.trim(),
            priority,
            due_date: dueDate,
            completed: false
        })
        .select()
        .single();

    if (error) throw error;

    return formatTask(data);
}

// Delete a task
export async function removeTask(taskId) {
    const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

    if (error) throw error;
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
        databaseUpdates.due_date = updates.dueDate;
    }

    const { data, error } = await supabase
        .from("tasks")
        .update(databaseUpdates)
        .eq("id", taskId)
        .select()
        .single();

    if (error) throw error;

    return formatTask(data);
}

// Change task completion status
export async function setTaskCompletion(taskId, completed) {
    const { data, error } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", taskId)
        .select()
        .single();

    if (error) throw error;

    return formatTask(data);
}
