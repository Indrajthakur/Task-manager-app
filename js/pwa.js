
import { apiRequest } from "./api.js";
let deferredPrompt = null;

const installButton =
    document.getElementById("installAppBtn");

// Detect installation availability
window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();

    deferredPrompt = event;

    if (installButton) {
        installButton.hidden = false;
    }
});

// Install application
installButton?.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    console.log("Installation:", outcome);

    deferredPrompt = null;
    installButton.hidden = true;
});

// Detect successful installation
window.addEventListener("appinstalled", () => {
    deferredPrompt = null;

    if (installButton) {
        installButton.hidden = true;
    }

    console.log("Task Manager installed successfully!");
});


// PUSH NOTIFICATION SUBSCRIPTION

const notificationBtn =
    document.getElementById("notificationBtn");

// Convert VAPID public key
function urlBase64ToUint8Array(base64String) {
    const padding =
        "=".repeat((4 - base64String.length % 4) % 4);

    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);

    return Uint8Array.from(
        rawData,
        char => char.charCodeAt(0)
    );
}

// Enable push notifications
notificationBtn?.addEventListener("click", async () => {

    if (
        !("Notification" in window) ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window)
    ) {
        alert("Push notifications are not supported.");
        return;
    }

    notificationBtn.disabled = true;

    try {
        const permission =
            await Notification.requestPermission();

        if (permission !== "granted") {
            alert("Notification permission was not granted.");
            return;
        }

        const registration =
            await navigator.serviceWorker.getRegistration();

        if (!registration?.active) {
            alert("Refresh the app and try again.");
            return;
        }

        // Get public VAPID key from backend

        const { publicKey } = await apiRequest(
            "/api/notifications/public-key"
        );

        // Check existing subscription

        let subscription =
            await registration.pushManager.getSubscription();

        // Create subscription

        if (!subscription) {
            subscription =
                await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey:
                        urlBase64ToUint8Array(publicKey)
                });
        }

        // Save subscription in PostgreSQL

        await apiRequest("/api/notifications/subscribe", {
            method: "POST",
            body: JSON.stringify(subscription.toJSON())
        });

        await registration.showNotification(
            "Task Manager 🚀",
            {
                body: "Push notifications enabled successfully!",
                icon: "./icons/icon-192.png"
            }
        );

        console.log("Push subscription saved!");

    } catch (error) {
        console.error("Push subscription error:", error);

        alert(error.message || "Subscription failed.");

    } finally {
        notificationBtn.disabled = false;
    }
});
