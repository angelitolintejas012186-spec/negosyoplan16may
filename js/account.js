// account.js - Account management (localStorage-based)

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    initAccountForms();
    initTabs();
});

function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const authPanels = document.getElementById('auth-panels');
    const dashboard = document.getElementById('account-dashboard');

    if (user) {
        if (authPanels) authPanels.style.display = 'none';
        if (dashboard) {
            dashboard.style.display = 'block';
            populateDashboard(user);
        }
    } else {
        if (authPanels) authPanels.style.display = 'block';
        if (dashboard) dashboard.style.display = 'none';
    }
}

function populateDashboard(user) {
    const nameEl = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email-display');
    const joinedEl = document.getElementById('user-joined');

    if (nameEl) nameEl.textContent = user.name || 'Customer';
    if (emailEl) emailEl.textContent = user.email;
    if (joinedEl) joinedEl.textContent = 'Member since ' + new Date(user.registeredAt).toLocaleDateString();

    loadOrderHistory();
    if (typeof loadAccountDownloads === 'function') loadAccountDownloads();
    loadProfileInfo(user);
}

function loadProfileInfo(user) {
    const profileInfo = document.getElementById('profile-info');
    if (!profileInfo) return;
    profileInfo.innerHTML = `
        <div class="trust-card"><h4><i class="fas fa-user" style="color:var(--orange);margin-right:0.4rem;"></i>Full Name</h4><p>${user.name || 'Not set'}</p></div>
        <div class="trust-card"><h4><i class="fas fa-envelope" style="color:var(--orange);margin-right:0.4rem;"></i>Email Address</h4><p>${user.email}</p></div>
        <div class="trust-card"><h4><i class="fas fa-calendar" style="color:var(--orange);margin-right:0.4rem;"></i>Member Since</h4><p>${new Date(user.registeredAt).toLocaleDateString()}</p></div>
        <div class="trust-card"><h4><i class="fas fa-check-circle" style="color:#0d7c45;margin-right:0.4rem;"></i>Account Status</h4><p style="color:#0d7c45;font-weight:700;">Active</p></div>
    `;
}

function initAccountForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            loginUser(email, password);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;
            registerUser(name, email, password, confirm);
        });
    }

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('register-section').style.display = 'block';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('register-section').style.display = 'none';
            document.getElementById('login-section').style.display = 'block';
        });
    }

    if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);
}

function loginUser(email, password) {
    if (!email || !password) {
        window.NegosyoPlan.showToast('Please enter your email and password.', 'error');
        return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        checkLoginStatus();
        window.NegosyoPlan.showToast('Welcome back, ' + (user.name || 'Customer') + '!', 'success');
    } else {
        window.NegosyoPlan.showToast('Incorrect email or password. Please try again.', 'error');
    }
}

function registerUser(name, email, password, confirm) {
    if (!name || !email || !password) {
        window.NegosyoPlan.showToast('Please fill in all required fields.', 'error');
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        window.NegosyoPlan.showToast('Please enter a valid email address.', 'error');
        return;
    }
    if (password.length < 6) {
        window.NegosyoPlan.showToast('Password must be at least 6 characters.', 'error');
        return;
    }
    if (password !== confirm) {
        window.NegosyoPlan.showToast('Passwords do not match. Please check and retry.', 'error');
        return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        window.NegosyoPlan.showToast('An account with this email already exists. Please log in.', 'error');
        return;
    }
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        registeredAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(newUser));
    checkLoginStatus();
    window.NegosyoPlan.showToast('Account created! Welcome, ' + name + '!', 'success');
}

function logoutUser() {
    localStorage.removeItem('user');
    checkLoginStatus();
    window.NegosyoPlan.showToast('You have been logged out successfully.', 'info');
}

function loadOrderHistory() {
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const orderHistory = document.getElementById('order-history');
    if (!orderHistory) return;
    if (purchases.length === 0) {
        orderHistory.innerHTML = '<p style="color:var(--text-muted);font-size:0.88rem;">No orders yet. <a href="shop.html" style="color:var(--orange);font-weight:600;">Start shopping.</a></p>';
        return;
    }
    orderHistory.innerHTML = purchases.slice().reverse().map(purchase => `
        <div class="order-history-row">
            <div>
                <strong style="font-size:0.88rem;">Order #${purchase.id}</strong>
                <p style="font-size:0.79rem;color:var(--text-muted);margin-top:0.2rem;">${new Date(purchase.timestamp).toLocaleDateString()} &bull; ${purchase.items ? purchase.items.map(i => i.name).join(', ') : 'Blueprint Bundle'}</p>
            </div>
            <div style="text-align:right;flex-shrink:0;">
                <p style="font-weight:800;color:var(--navy);font-size:0.9rem;">${window.NegosyoPlan.formatPrice(purchase.total)}</p>
                <span class="order-badge badge-paid">${purchase.status || 'Completed'}</span>
            </div>
        </div>
    `).join('');
}

function initTabs() {
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const tab = this.getAttribute('data-tab');
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            const selected = document.getElementById(tab + '-tab');
            if (selected) selected.classList.add('active');
        });
    });
}
