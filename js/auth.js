
import { supabase } from "./supabase.js";

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

    authTitle.textContent = signup ? "Create Account" : "Welcome Back";

    authDescription.textContent = signup
        ? "Create your account to manage your tasks"
        : "Login to manage your tasks";

    authSubmit.textContent = signup ? "Create Account" : "Login";

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
    authMessage.style.color = isError ? "#ff6685" : "#16c995";
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

            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) throw error;

            if (data.session) {
                window.location.href = "./index.html";
            } else {
                showMessage(
                    "Account created! Check your email to confirm your account."
                );
            }

        } else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            window.location.href = "./index.html";
        }

    } catch (error) {
        showMessage(error.message, true);

    } finally {
        authSubmit.disabled = false;
        authSubmit.textContent = isSignup ? "Create Account" : "Login";
    }
});

// Start in Login mode
setAuthMode(false);
