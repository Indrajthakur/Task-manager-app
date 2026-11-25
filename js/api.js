const API_URL = "https://developer-backend-lavp.onrender.com";

export function getToken() {
    return sessionStorage.getItem("task_manager_token");
}

export function getUser() {
    return JSON.parse(
        sessionStorage.getItem("task_manager_user") || "null"
    );
}

export function saveSession(token, user) {
    sessionStorage.setItem("task_manager_token", token);
    sessionStorage.setItem(
        "task_manager_user",
        JSON.stringify(user)
    );
}

export function clearSession() {
    sessionStorage.removeItem("task_manager_token");
    sessionStorage.removeItem("task_manager_user");
}

export async function apiRequest(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Request failed");
    }

    return data;
}

export function register(name, email, password) {
    return apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password })
    });
}

export async function login(email, password) {
    const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });

    saveSession(data.token, data.user);

    return data;
}

export function logout() {
    clearSession();
    window.location.href = "./auth.html";
}