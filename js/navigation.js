
/* ================================
   SIDEBAR NAVIGATION
================================ */

export function initializeNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            // Remove active state from all links
            navLinks.forEach(item => {
                item.classList.remove("active");
            });

            // Highlight clicked link
            link.classList.add("active");

            // Scroll to the linked section, if it exists
            const targetId = link.getAttribute("href");

            if (targetId && targetId.startsWith("#")) {
                const target = document.querySelector(targetId);

                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        });
    });
}
