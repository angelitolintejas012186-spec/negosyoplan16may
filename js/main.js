// main.js - Shared functions for Negosyo Plan website

const CURRENCY_RATES = {
    PHP: 1,
    USD: 0.018,
    EUR: 0.017,
    GBP: 0.014,
    AED: 0.10,
    NGN: 36.4
};

const SUPPORTED_CURRENCIES = ['PHP', 'USD', 'EUR', 'GBP', 'AED', 'NGN'];
let currentCurrency = 'PHP';

const currencyLabels = {
    AED: 'AED',
    PHP: 'PHP',
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP',
    NGN: 'NGN'
};

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initWhatsAppButton();
    initSocialIcons();
    initHamburgerMenu();
    initSearch();
    initCurrencySelector();
    initSubscribeForm();
    updatePriceTags();
    updateCartBadge();
});

function initNavigation() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === page || (href === 'index.html' && page === '')) {
            link.classList.add('active');
        }
    });
}

function initWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            // Track WhatsApp click events if needed
        });
    }
}

function initSocialIcons() {
    const socialLinks = document.querySelectorAll('.social-icons a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Social media click tracking can be added here
        });
    });
}

function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const sidebarClose = document.getElementById('sidebar-close');

    if (hamburger && sidebar && overlay) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });

        sidebarClose.addEventListener('click', function() {
            hamburger.classList.remove('active');
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        overlay.addEventListener('click', function() {
            hamburger.classList.remove('active');
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim().toLowerCase();

    if (query) {
        window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
    }
}

function initCurrencySelector() {
    const savedCurrency = localStorage.getItem('negosyoCurrency');
    currentCurrency = savedCurrency || detectCurrencyFromBrowser();

    const selector = document.getElementById('currency-selector');
    const currencyLabel = document.getElementById('currency-label');

    if (selector) {
        selector.innerHTML = SUPPORTED_CURRENCIES.map(code => `<option value="${code}">${code}</option>`).join('');
        selector.value = currentCurrency;
        selector.addEventListener('change', function() {
            currentCurrency = selector.value;
            localStorage.setItem('negosyoCurrency', currentCurrency);
            updatePriceTags();
            updateCurrencyLabel();
        });
    }

    if (currencyLabel) {
        currencyLabel.textContent = currentCurrency;
    }
}

function initSubscribeForm() {
    const subscribeForm = document.getElementById('subscribe-form');
    if (!subscribeForm) return;

    subscribeForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const emailInput = document.getElementById('subscribe-email');
        const successMessage = document.getElementById('subscribe-success');
        if (!emailInput || !successMessage) return;

        const email = emailInput.value.trim();
        if (!email || !email.includes('@')) {
            successMessage.textContent = 'Please enter a valid email address.';
            successMessage.style.color = '#d9534f';
            return;
        }

        successMessage.textContent = 'Thanks! You are subscribed to business blueprint updates.';
        successMessage.style.color = '#2C3E50';
        emailInput.value = '';
        localStorage.setItem('newsletterSubscriber', email);
    });
}

function detectCurrencyFromBrowser() {
    try {
        const locale = navigator.language || 'en-US';
        const region = locale.split('-')[1] ? locale.split('-')[1].toUpperCase() : 'PH';
        switch (region) {
            case 'US': return 'USD';
            case 'PH': return 'PHP';
            case 'AE': return 'AED';
            case 'GB': return 'GBP';
            case 'EU': return 'EUR';
            case 'DE': return 'EUR';
            case 'FR': return 'EUR';
            case 'NG': return 'NGN';
            case 'ZA': return 'NGN';
            default: return 'PHP';
        }
    } catch (error) {
        return 'USD';
    }
}

function convertAmount(valueInAED) {
    const rate = CURRENCY_RATES[currentCurrency] || 1;
    return valueInAED * rate;
}

function formatPrice(valueInAED) {
    const convertedValue = convertAmount(valueInAED);
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currentCurrency,
        maximumFractionDigits: 2
    }).format(convertedValue);
}

function updatePriceTags() {
    document.querySelectorAll('[data-base-price]').forEach(node => {
        const base = parseFloat(node.getAttribute('data-base-price'));
        if (!Number.isNaN(base)) {
            node.textContent = window.NegosyoPlan.formatPrice(base);
        }
    });

    const currencyLabel = document.getElementById('currency-label');
    if (currencyLabel) {
        currencyLabel.textContent = currentCurrency;
    }
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartLinks = document.querySelectorAll('a[href="cart.html"]');

    cartLinks.forEach(link => {
        let badge = link.querySelector('.cart-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.style.cssText = 'background: #FF9951; color: #fff; border-radius: 999px; padding: 0.2rem 0.55rem; font-size: 0.8rem; margin-left: 0.45rem;';
            link.appendChild(badge);
        }

        if (cart.length > 0) {
            badge.textContent = cart.length;
            badge.style.display = 'inline-flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

window.NegosyoPlan = {
    formatPrice,
    generateStars,
    updateCartBadge
};
