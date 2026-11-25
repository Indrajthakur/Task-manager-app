import { register, login } from "./api.js";

// Elements
const authForm = document.getElementById("authForm");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const authTitle = document.querySelector(".auth-card h1");
const authDescription = document.getElementById("authDescription");
const authSubmit = document.getElementById("authSubmit");
const authMessage = document.getElementById("authMessage");

const emailInput = document.getElementById("authEmail");
const passwordInput = document.getElementById("authPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const confirmPasswordField = document.getElementById("confirmPasswordField");

let isSignup = false;

// Switch between Login and Sign Up
function setAuthMode(signup) {
    isSignup = signup;

    loginTab.classList.toggle("active", !signup);
    signupTab.classList.toggle("active", signup);

    authTitle.textContent = signup
        ? "Create Account"
        : "Welcome Back";

    authDescription.textContent = signup
        ? "Create your account to manage your tasks"
        : "Login to manage your tasks";

    authSubmit.textContent = signup
        ? "Create Account"
        : "Login";

    confirmPasswordField.hidden = !signup;
    confirmPasswordInput.required = signup;

    authMessage.textContent = "";
}

// Tab events
loginTab.addEventListener("click", () => {
    setAuthMode(false);
});

signupTab.addEventListener("click", () => {
    setAuthMode(true);
});

// Display messages
function showMessage(message, isError = false) {
    authMessage.textContent = message;
    authMessage.style.color = isError
        ? "#ff6685"
        : "#16c995";
}

// Handle authentication
authForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    authSubmit.disabled = true;
    authSubmit.textContent = "Please wait...";

    try {
        if (isSignup) {
            const confirmPassword = confirmPasswordInput.value;

            if (password !== confirmPassword) {
                showMessage("Passwords do not match.", true);
                return;
            }

            if (password.length < 8) {
                showMessage(
                    "Password must contain at least 8 characters.",
                    true
                );
                return;
            }

            const name = email.split("@")[0].slice(0, 100);

            await register(name, email, password);

            setAuthMode(false);

            passwordInput.value = "";
            confirmPasswordInput.value = "";

            showMessage(
                "Account created successfully! Please login."
            );

        } else {
            await login(email, password);

            window.location.href = "./index.html";
        }

    } catch (error) {
        showMessage(error.message, true);

    } finally {
        authSubmit.disabled = false;
        authSubmit.textContent = isSignup
            ? "Create Account"
            : "Login";
    }
});

// Start in Login mode
setAuthMode(false);