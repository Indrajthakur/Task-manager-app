
/* ================================
   NOTIFICATIONS
================================ */

let notificationTimer;

// Show notification
export function showNotification(message, type = "success") {

    // Remove previous notification
    const existing = document.querySelector(".app-notification");

    if (existing) {
        existing.remove();
    }

    // Clear previous timer
    clearTimeout(notificationTimer);

    // Create notification
    const notification = document.createElement("div");

    notification.className = `app-notification ${type}`;
    notification.textContent = message;

    // Notification styling
    Object.assign(notification.style, {
        position: "fixed",
        top: "25px",
        right: "25px",
        zIndex: "2000",
        padding: "15px 22px",
        borderRadius: "12px",
        background: type === "error" ? "#f04478" : "#7138ff",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "600",
        boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
        opacity: "0",
        transform: "translateY(-10px)",
        transition: "all 0.3s ease"
    });

    document.body.appendChild(notification);

    // Show notification
    requestAnimationFrame(() => {
        notification.style.opacity = "1";
        notification.style.transform = "translateY(0)";
    });

    // Remove after 3 seconds
    notificationTimer = setTimeout(() => {

        notification.style.opacity = "0";
        notification.style.transform = "translateY(-10px)";

        setTimeout(() => {
            notification.remove();
        }, 300);

    }, 3000);
}
