const API_URL = '/api/auth/';

document.addEventListener('DOMContentLoaded', () => {
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    // Toggle Forms
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.classList.add('hidden');
        registerBox.classList.remove('hidden');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
    });

    // Login
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const alertBox = document.getElementById('login-alert');

        try {
            const response = await fetch(API_URL + 'signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'dashboard.html';
            } else {
                showAlert(alertBox, data.message || 'Login failed', 'error');
            }
        } catch (error) {
            showAlert(alertBox, 'An error occurred. Please try again.', 'error');
        }
    });

    // Register
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const alertBox = document.getElementById('register-alert');

        try {
            const response = await fetch(API_URL + 'signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, role: ['user'] })
            });

            const data = await response.json();

            if (response.ok) {
                showAlert(alertBox, 'Registration successful! Please login.', 'success');
                setTimeout(() => {
                    registerBox.classList.add('hidden');
                    loginBox.classList.remove('hidden');
                }, 2000);
            } else {
                showAlert(alertBox, data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            showAlert(alertBox, 'An error occurred. Please try again.', 'error');
        }
    });
});

function showAlert(element, message, type) {
    element.textContent = message;
    element.className = `alert alert-${type}`;
    element.classList.remove('hidden');
}
