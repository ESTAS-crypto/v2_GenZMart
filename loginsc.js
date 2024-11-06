// Particles.js configuration
particlesJS("particles-js", {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800,
            },
        },
        color: {
            value: ["#48A277", "#ffffff", "#3d8b65"]
        },
        shape: {
            type: "circle",
        },
        opacity: {
            value: 0.6,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "bounce",
            bounce: false,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        },
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "grab"
            },
            onclick: {
                enable: true,
                mode: "push"
            },
            resize: true,
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            push: {
                particles_nb: 4
            },
        },
    },
    retina_detect: true,
});

// Initialize necessary DOM elements and event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');
    const regUsername = document.getElementById('reg-username');
    const regEmail = document.getElementById('reg-email');
    const regPassword = document.getElementById('reg-password');
    const regConfirmPassword = document.getElementById('reg-confirm-password');
    // Add form submit event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', validateLoginForm);
    }
    if (registerForm) {
        registerForm.addEventListener('submit', validateRegisterForm);
    }

    // Initialize password strength checker
    if (regPassword) {
        regPassword.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }

    // Initialize password toggle functionality
    initPasswordToggles();
});

// Password toggle functionality
function initPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);

            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    this.classList.remove('fa-eye-slash');
                    this.classList.add('fa-eye');
                } else {
                    input.type = 'password';
                    this.classList.remove('fa-eye');
                    this.classList.add('fa-eye-slash');
                }

                this.style.transform = 'translateY(-50%) scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-50%) scale(1)';
                }, 200);
            }
        });
    });
}

// Form toggle functionality
document.querySelectorAll('.toggle-form').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.style.display !== 'none') {
                form.style.display = 'none';
            } else {
                form.style.display = 'block';
            }
        });
    });
});

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[$@#&!]+/)) strength += 1;
    if (password.length >= 12) strength += 1;
    return strength;
}

function updatePasswordStrength(password) {
    const strength = checkPasswordStrength(password);
    const indicator = document.querySelector('.password-strength');

    if (indicator) {
        indicator.className = 'password-strength';

        if (password.length === 0) {
            indicator.style.width = '0%';
        } else {
            if (strength <= 2) {
                indicator.classList.add('strength-weak');
                indicator.style.width = '33%';
            } else if (strength <= 4) {
                indicator.classList.add('strength-medium');
                indicator.style.width = '66%';
            } else {
                indicator.classList.add('strength-strong');
                indicator.style.width = '100%';
            }
        }
    }
}

// Form validation functions
function validateRegisterForm(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    removeAllErrors();
    let isValid = true;

    // Validate username
    if (username.length < 5) {
        showError('reg-username', 'Username must be at least 5 characters long');
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('reg-email', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate password
    if (checkPasswordStrength(password) < 3) {
        showError('reg-password', 'Password is too weak. Include uppercase, lowercase, numbers, and symbols');
        isValid = false;
    }

    if (password !== confirmPassword) {
        showError('reg-confirm-password', 'Passwords do not match');
        isValid = false;
    }

    if (isValid) {
        submitButton.disabled = true;
        submitButton.classList.add('loading');


    }
}

function validateLoginForm(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    removeAllErrors();
    let isValid = true;
    //batas user atau invalid
    if (username.length < 5) {
        showError('login-username', 'Invalid username');
        isValid = false;
    }

    if (isValid) {
        if (isUserLockedOut()) {
            showLockoutMessage();
            return;
        }

        submitButton.disabled = true;
        submitButton.classList.add('loading');

        // tempat link html
        setTimeout(() => {
            incrementLoginAttempts();
            showSuccess(form, 'Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        }, 1500);
    }
}

// Helper functions
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    element.parentNode.insertBefore(errorDiv, element.nextSibling);
}

function showSuccess(form, message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    form.appendChild(successDiv);
}

function removeAllErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
}

// banyak login dan durasi
const STORAGE_KEY = 'loginAttempts';
const MAX_ATTEMPTS = 1;
const LOCKOUT_DURATION = 0 * 60 * 100; // 30 minutes

function getLoginAttempts() {
    const attempts = localStorage.getItem(STORAGE_KEY);
    return attempts ? JSON.parse(attempts) : { count: 0, timestamp: Date.now() };
}

function incrementLoginAttempts() {
    const attempts = getLoginAttempts();
    attempts.count++;
    attempts.timestamp = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
}

function isUserLockedOut() {
    const attempts = getLoginAttempts();
    if (attempts.count >= MAX_ATTEMPTS) {
        const timePassed = Date.now() - attempts.timestamp;
        if (timePassed < LOCKOUT_DURATION) {
            return true;
        }
        resetLoginAttempts();
    }
    return false;
}

function resetLoginAttempts() {
    localStorage.removeItem(STORAGE_KEY);
}

function showLockoutMessage() {
    const attempts = getLoginAttempts();
    const timeLeft = Math.ceil((LOCKOUT_DURATION - (Date.now() - attempts.timestamp)) / 60000);
    showError('login-username', `Too many login attempts. Please try again in ${timeLeft} minutes.`);
}

// Easter egg implementation
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiPosition = 0;

document.addEventListener('keydown', function(e) {
    if (e.key === konamiCode[konamiPosition]) {
        konamiPosition++;
        if (konamiPosition === konamiCode.length) {
            activateEasterEgg();
            konamiPosition = 0;
        }
    } else {
        konamiPosition = 0;
    }
});

function activateEasterEgg() {
    const colors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#8f00ff"];
    if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.particles.color.value = colors;
        window.pJSDom[0].pJS.particles.line_linked.color = colors[0];
    }

    const form = document.querySelector('.form');
    if (form) {
        form.classList.add('rainbow-border');
        setTimeout(() => {
            form.classList.remove('rainbow-border');
        }, 5000);
    }
}