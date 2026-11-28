
import { register, login } from "./api.js";

// =================================
// AUTHENTICATION ELEMENTS
// =================================

const authForm = document.getElementById("authForm");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const authTitle = document.querySelector(".auth-card h1");
const authDescription = document.getElementById("authDescription");
const authSubmit = document.getElementById("authSubmit");
const authMessage = document.getElementById("authMessage");

const emailInput = document.getElementById("authEmail");
const passwordInput = document.getElementById("authPassword");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const confirmPasswordField =
    document.getElementById("confirmPasswordField");

// APPLICATION STATE

let isSignup = false;
let isSubmitting = false;

// =================================
// SWITCH AUTHENTICATION MODE
// =================================

function setAuthMode(signup) {
    isSignup = signup;

    loginTab.classList.toggle("active", !signup);
    signupTab.classList.toggle("active", signup);

    loginTab.setAttribute("aria-pressed", String(!signup));
    signupTab.setAttribute("aria-pressed", String(signup));

    authTitle.textContent = signup
        ? "Create Account"
        : "Welcome Back";

    authDescription.textContent = signup
        ? "Create your account to manage your tasks"
        : "Login to manage your tasks";

    authSubmit.textContent = signup
        ? "Create Account"
        : "Login";

    // Confirm password visibility

    confirmPasswordField.hidden = !signup;
    confirmPasswordInput.required = signup;
    confirmPasswordInput.disabled = !signup;

    // Password manager support

    passwordInput.autocomplete = signup
        ? "new-password"
        : "current-password";

    passwordInput.value = "";
    confirmPasswordInput.value = "";

    authMessage.textContent = "";
}

// =================================
// AUTHENTICATION TAB EVENTS
// =================================

loginTab.addEventListener("click", () => {
    if (!isSubmitting && isSignup) {
        setAuthMode(false);
    }
});

signupTab.addEventListener("click", () => {
    if (!isSubmitting && !isSignup) {
        setAuthMode(true);
    }
});

// =================================
// DISPLAY AUTHENTICATION MESSAGES
// =================================

function showMessage(message, isError = false) {
    authMessage.textContent = message;

    authMessage.style.color = isError
        ? "#ff6685"
        : "#16c995";
}

// =================================
// LOADING STATE
// =================================

function setLoading(loading) {
    isSubmitting = loading;

    authSubmit.disabled = loading;
    loginTab.disabled = loading;
    signupTab.disabled = loading;

    authForm.setAttribute("aria-busy", String(loading));

    authSubmit.textContent = loading
        ? "Please wait..."
        : isSignup
            ? "Create Account"
            : "Login";
}

// =================================
// HANDLE AUTHENTICATION
// =================================

authForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    authMessage.textContent = "";

    // Validate required fields

    if (!email || !password) {
        showMessage(
            "Please complete all required fields.",
            true
        );
        return;
    }

    if (isSignup) {
        const confirmPassword = confirmPasswordInput.value;

        if (password.length < 8) {
            showMessage(
                "Password must contain at least 8 characters.",
                true
            );
            return;
        }

        if (password !== confirmPassword) {
            showMessage(
                "Passwords do not match.",
                true
            );
            return;
        }
    }

    // Check internet connection

    if (!navigator.onLine) {
        showMessage(
            "You are offline. Please check your internet connection.",
            true
        );
        return;
    }

    setLoading(true);

    try {
        // CREATE ACCOUNT

        if (isSignup) {
            const name = email.split("@")[0].slice(0, 100);

            await register(name, email, password);

            setAuthMode(false);

            showMessage(
                "Account created successfully! Please login."
            );

        } else {
            // LOGIN

            await login(email, password);

            window.location.replace("./index.html");
        }

    } catch (error) {
        console.error("Authentication failed:", error);

        showMessage(
            error.message || "Authentication failed. Please try again.",
            true
        );

    } finally {
        setLoading(false);
    }
});

// =================================
// INITIALIZE AUTHENTICATION
// =================================

setAuthMode(false);
