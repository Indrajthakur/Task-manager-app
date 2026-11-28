
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

// Enable Task Manager notifications

const notificationBtn =
    document.getElementById("notificationBtn");

notificationBtn?.addEventListener("click", async () => {

    if (!("Notification" in window) ||
        !("serviceWorker" in navigator)) {

        alert("Notifications are not supported on this device.");
        return;
    }

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
            alert("Please refresh the app and try again.");
            return;
        }

        await registration.showNotification("Task Manager 🚀", {
            body: "Notifications are successfully enabled!",
            icon: "./icons/icon-192.png",
            badge: "./icons/icon-192.png"
        });

    } catch (error) {
        console.error("Notification error:", error);
        alert("Unable to display notification.");
    }
});
