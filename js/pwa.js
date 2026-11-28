
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
