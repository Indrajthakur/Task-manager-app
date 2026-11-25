import { getToken, clearSession } from "./api.js";

function isSessionValid() {
    const token = getToken();

    if (!token) return false;

    try {
        const payload = JSON.parse(
            atob(token.split(".")[1]
                .replace(/-/g, "+")
                .replace(/_/g, "/"))
        );

        return payload.exp * 1000 > Date.now();

    } catch {
        return false;
    }
}

if (!isSessionValid()) {
    clearSession();
    window.location.replace("./auth.html");
}