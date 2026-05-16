// account.js - Account management functionality

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    initAccountForms();
    initTabs();
});

function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const accountDashboard = document.getElementById('account-dashboard');

    if (user) {
        if (loginSection) loginSection.style.display = 'none';
        if (registerSection) registerSection.style.display = 'none';
        if (accountDashboard) {
            accountDashboard.style.display = 'block';
            document.getElementById('user-email').textContent = user.email;
            loadOrderHistory();
            loadAccountDownloads();
        }
    } else {
        if (loginSection) loginSection.style.display = 'block';
        if (registerSection) registerSection.style.display = 'none';
        if (accountDashboard) accountDashboard.style.display = 'none';
    }
}

function initAccountForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            loginUser(email);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('register-email').value.trim();
            registerUser(email);
        });
    }

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(event) {
            event.preventDefault();
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('register-section').style.display = 'block';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(event) {
            event.preventDefault();
            document.getElementById('register-section').style.display = 'none';
            document.getElementById('login-section').style.display = 'block';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }
}

function loginUser(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);

    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        checkLoginStatus();
        alert('Login successful!');
    } else {
        alert('User not found. Please register first.');
    }
}

function registerUser(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (!email) {
        alert('Please enter a valid email.');
        return;
    }

    if (users.find(u => u.email === email)) {
        alert('User already exists. Please login instead.');
        return;
    }

    const newUser = {
        id: Date.now(),
        email: email,
        registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(newUser));

    checkLoginStatus();
    alert('Registration successful!');
}

function logoutUser() {
    localStorage.removeItem('user');
    checkLoginStatus();
    alert('Logged out successfully.');
}

function loadOrderHistory() {
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const orderHistory = document.getElementById('order-history');

    if (!orderHistory) return;

    if (purchases.length === 0) {
        orderHistory.innerHTML = '<p>No orders found.</p>';
        return;
    }

    orderHistory.innerHTML = purchases.map(purchase => `
        <article class="order-item">
            <h4>Order #${purchase.id}</h4>
            <p>Date: ${new Date(purchase.timestamp).toLocaleDateString()}</p>
            <p>Total: ${window.NegosyoPlan.formatPrice(purchase.total)}</p>
            <p>Status: ${purchase.status}</p>
            <details>
                <summary>View Items</summary>
                <ul>${purchase.items.map(item => `<li>${item.name} x${item.quantity}</li>`).join('')}</ul>
            </details>
        </article>
    `).join('');
}

function loadAccountDownloads() {
    if (typeof window.loadAccountDownloads === 'function') {
        window.loadAccountDownloads();
    } else {
        const accountDownloads = document.getElementById('account-downloads');
        if (accountDownloads) {
            accountDownloads.innerHTML = '<p>Download history is not available.</p>';
        }
    }
}

function initTabs() {
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const tab = this.getAttribute('data-tab');
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            const selected = document.getElementById(`${tab}-tab`);
            if (selected) selected.classList.add('active');
        });
    });
}
