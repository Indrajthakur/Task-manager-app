
const CACHE_NAME = "task-manager-static-v1";

const STATIC_ASSETS = [
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./css/reset.css",
    "./css/variables.css",
    "./css/themes.css",
    "./css/main.css",
    "./css/layout.css",
    "./css/components.css",
    "./css/dashboard.css",
    "./css/tasks.css",
    "./css/modals.css",
    "./css/responsive.css",
    "./css/auth.css"
];

// INSTALL SERVICE WORKER

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

// REMOVE OLD CACHE VERSIONS

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name =>
                        name.startsWith("task-manager-static-") &&
                        name !== CACHE_NAME
                    )
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// HANDLE REQUESTS

self.addEventListener("fetch", event => {
    const request = event.request;
    const url = new URL(request.url);

    // Never cache POST, PUT or DELETE requests
    if (request.method !== "GET") return;

    // Never cache external backend requests
    if (url.origin !== self.location.origin) return;

    // Never cache API or authorized requests
    if (
        url.pathname.includes("/api/") ||
        request.headers.has("Authorization")
    ) return;

    // Display an offline message for navigation
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request).catch(() =>
                new Response(
                    "<h1>You are offline</h1>" +
                    "<p>Please reconnect to access Task Manager.</p>",
                    {
                        status: 503,
                        headers: {
                            "Content-Type": "text/html; charset=utf-8"
                        }
                    }
                )
            )
        );
        return;
    }

    // Cache only public static assets
    if (!/\.(css|js|png|svg|ico|woff2)$/.test(url.pathname)
        && !url.pathname.endsWith("/manifest.json")) {
        return;
    }

    // Network first, cache fallback
    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);

            try {
                const response = await fetch(request);

                if (response.ok) {
                    await cache.put(request, response.clone());
                }

                return response;

            } catch {
                return await cache.match(request)
                    || Response.error();
            }
        })()
    );
});
