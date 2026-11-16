
/* ================================
   MODAL CONTROLS
================================ */

export function initializeModal() {
    const modal = document.getElementById("taskModal");
    const addButton = document.getElementById("addTaskBtn");
    const closeButton = document.getElementById("closeModal");
    const taskForm = document.getElementById("taskForm");

    if (!modal || !addButton || !closeButton) return;

    // Open modal
    addButton.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    // Reusable close function
    function closeModal() {
        modal.classList.add("hidden");
        taskForm?.reset();
    }

    // Close button
    closeButton.addEventListener("click", closeModal);

    // Close when clicking outside modal content
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close using Escape key
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !modal.classList.contains("hidden")) {
            closeModal();
        }
    });
}
