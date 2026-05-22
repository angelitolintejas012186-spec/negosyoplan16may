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

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initHamburgerMenu();
    injectMobileNavExtras();
    initSearch();
    initCurrencySelector();
    initSubscribeForm();
    initBackToTop();
    updatePriceTags();
    updateCartBadge();
});

function injectMobileNavExtras() {
    /* ── 1. Mobile action row: 3 buttons below brand name in header ── */
    var header = document.querySelector('header');
    if (header && !document.querySelector('.mobile-action-row')) {
        var row = document.createElement('div');
        row.className = 'mobile-action-row';

        /* Shop */
        var shopA = document.createElement('a');
        shopA.href = 'shop.html';
        shopA.className = 'mob-act-btn mob-shop';
        shopA.innerHTML = '<i class="fas fa-store"></i><span>Shop</span>';

        /* Cart */
        var cartA = document.createElement('a');
        cartA.href = 'cart.html';
        cartA.className = 'mob-act-btn mob-cart';
        cartA.innerHTML = '<i class="fas fa-shopping-cart"></i><span>Cart</span>';

        /* Choose Business Type */
        var bizB = document.createElement('button');
        bizB.setAttribute('type', 'button');
        bizB.className = 'mob-act-btn mob-biz';
        bizB.innerHTML = '<i class="fas fa-briefcase"></i><span>Choose Business</span>';
        bizB.addEventListener('click', function () {
            var first = document.querySelector('.button[data-id]');
            if (first) {
                first.click();
            } else {
                window.location.href = 'shop.html';
            }
        });

        row.appendChild(shopA);
        row.appendChild(cartA);
        row.appendChild(bizB);
        header.appendChild(row);
    }

    /* ── 2. Inject logo into sidebar header so applyBranding can update it ── */
    var sidebarHeader = document.querySelector('.sidebar-header');
    if (sidebarHeader && !sidebarHeader.querySelector('.sidebar-logo-img')) {
        var navLogoSrc = (document.querySelector('nav .logo img') || {}).src || 'assets/images/logo.svg';
        var sidebarLogoWrap = document.createElement('div');
        sidebarLogoWrap.style.cssText = 'display:flex;align-items:center;gap:0.55rem;';

        var sidebarLogoImg = document.createElement('img');
        sidebarLogoImg.src = navLogoSrc;
        sidebarLogoImg.alt = 'Negosyo Plan logo';
        sidebarLogoImg.className = 'site-logo sidebar-logo-img';
        sidebarLogoImg.style.cssText = 'width:34px;height:auto;flex-shrink:0;';

        var sidebarBrandSpan = document.createElement('span');
        sidebarBrandSpan.className = 'brand-name';
        sidebarBrandSpan.style.cssText = 'font-size:0.95rem;letter-spacing:0.1em;';

        sidebarLogoWrap.appendChild(sidebarLogoImg);
        sidebarLogoWrap.appendChild(sidebarBrandSpan);

        var existingH3 = sidebarHeader.querySelector('h3');
        if (existingH3) existingH3.replaceWith(sidebarLogoWrap);
        else sidebarHeader.insertBefore(sidebarLogoWrap, sidebarHeader.firstChild);
    }

    /* ── 3. Sidebar quick-row: Shop | Cart | Business Type (3 buttons) ── */
    var sidebarMenu = document.querySelector('.sidebar-menu');
    if (sidebarMenu && !document.querySelector('.sidebar-quick-row')) {
        var quickRow = document.createElement('div');
        quickRow.className = 'sidebar-quick-row';

        /* Shop button */
        var shopBtn = document.createElement('a');
        shopBtn.href = 'shop.html';
        shopBtn.innerHTML = '<i class="fas fa-store"></i><span>Shop</span>';

        /* Cart button */
        var cartLink = document.createElement('a');
        cartLink.href = 'cart.html';
        cartLink.className = 'sidebar-cart-quick';
        cartLink.setAttribute('aria-label', 'Shopping cart');
        cartLink.innerHTML = '<i class="fas fa-shopping-cart"></i><span>Cart</span>';

        /* Choose Business Type button */
        var bizLink = document.createElement('button');
        bizLink.setAttribute('type', 'button');
        bizLink.className = 'sidebar-biz-quick';
        bizLink.innerHTML = '<i class="fas fa-briefcase"></i><span>Choose Biz</span>';
        bizLink.addEventListener('click', function () {
            /* Close sidebar first */
            var overlay = document.getElementById('overlay');
            var sidebar = document.getElementById('sidebar');
            var hamburger = document.getElementById('hamburger-menu');
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(function () {
                var firstAddBtn = document.querySelector('.button[data-id]');
                if (firstAddBtn) {
                    firstAddBtn.click();
                } else {
                    window.location.href = 'shop.html';
                }
            }, 280);
        });

        quickRow.appendChild(shopBtn);
        quickRow.appendChild(cartLink);
        quickRow.appendChild(bizLink);

        /* Insert above the sidebar-menu list */
        sidebarMenu.parentNode.insertBefore(quickRow, sidebarMenu);

        /* Hide Home, Shop, and Cart from the regular list — they're in the quick-row */
        sidebarMenu.querySelectorAll('li').forEach(function (li) {
            var a = li.querySelector('a');
            if (!a) return;
            var href = a.getAttribute('href') || '';
            var text = (a.textContent || '').trim().toLowerCase();
            if (href === 'index.html' || text.startsWith('home') ||
                href === 'shop.html' || text.startsWith('shop') ||
                href === 'cart.html' || text.startsWith('cart')) {
                li.style.display = 'none';
            }
        });
    }

    /* ── 4. Hide breadcrumbs on home page (redundant "Home" text) ── */
    var page = window.location.pathname.split('/').pop() || 'index.html';
    if (page === 'index.html' || page === '') {
        var bc = document.querySelector('.breadcrumbs');
        if (bc) bc.style.display = 'none';
    }
}

function initNavigation() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === page || (href === 'index.html' && page === '')) {
            link.classList.add('active');
        }
    });
}

function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const sidebarClose = document.getElementById('sidebar-close');

    if (!hamburger || !sidebar || !overlay) return;

    function openSidebar() {
        hamburger.classList.add('active');
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        hamburger.classList.remove('active');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openSidebar);
    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
}

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (!searchInput || !searchBtn) return;

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
}

function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput ? searchInput.value.trim() : '';
    if (query) {
        window.location.href = 'shop.html?search=' + encodeURIComponent(query.toLowerCase());
    }
}

function initCurrencySelector() {
    const saved = localStorage.getItem('negosyoCurrency');
    currentCurrency = saved || detectCurrencyFromBrowser();

    const selector = document.getElementById('currency-selector');
    if (selector) {
        selector.innerHTML = SUPPORTED_CURRENCIES.map(code =>
            `<option value="${code}">${code}</option>`
        ).join('');
        selector.value = currentCurrency;
        selector.addEventListener('change', function() {
            currentCurrency = selector.value;
            localStorage.setItem('negosyoCurrency', currentCurrency);
            updatePriceTags();
        });
    }
}

function initSubscribeForm() {
    const form = document.getElementById('subscribe-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = document.getElementById('subscribe-email');
        const successMsg = document.getElementById('subscribe-success');
        const email = emailInput ? emailInput.value.trim() : '';

        if (!email || !email.includes('@')) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        localStorage.setItem('newsletterSubscriber', email);
        if (successMsg) successMsg.textContent = 'Thanks! You are subscribed to business blueprint updates.';
        if (emailInput) emailInput.value = '';
        showToast('Subscribed successfully!', 'success');
    });
}

function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function() {
        btn.classList.toggle('visible', window.scrollY > 400);
    });

    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function detectCurrencyFromBrowser() {
    try {
        const locale = navigator.language || 'en-US';
        const region = (locale.split('-')[1] || '').toUpperCase();
        const map = { US: 'USD', PH: 'PHP', AE: 'AED', GB: 'GBP', DE: 'EUR', FR: 'EUR', NL: 'EUR', NG: 'NGN', ZA: 'NGN' };
        return map[region] || 'PHP';
    } catch (e) {
        return 'PHP';
    }
}

function formatPrice(valueInPHP) {
    const rate = CURRENCY_RATES[currentCurrency] || 1;
    const converted = valueInPHP * rate;
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currentCurrency,
        maximumFractionDigits: 2
    }).format(converted);
}

function updatePriceTags() {
    document.querySelectorAll('[data-base-price]').forEach(node => {
        const base = parseFloat(node.getAttribute('data-base-price'));
        if (!Number.isNaN(base)) {
            node.textContent = formatPrice(base);
        }
    });
}

function generateStars(rating, maxStars) {
    maxStars = maxStars || 5;
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = '';
    for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
    if (half) html += '<i class="fas fa-star-half-alt"></i>';
    const empty = maxStars - full - (half ? 1 : 0);
    for (let i = 0; i < empty; i++) html += '<i class="far fa-star"></i>';
    return html;
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.length;

    /* nav-cart-btn specific badge */
    const navBadge = document.getElementById('nav-cart-count');
    if (navBadge) {
        navBadge.textContent = count;
        navBadge.style.display = count > 0 ? 'flex' : 'none';
    }

    /* generic cart link badges (other pages) */
    document.querySelectorAll('a[href="cart.html"]:not(.nav-cart-btn)').forEach(link => {
        let badge = link.querySelector('.cart-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            link.appendChild(badge);
        }
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });
}

function showToast(message, type) {
    type = type || 'success';
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : 'exclamation-circle') + '"></i> ' + message;
    container.appendChild(toast);

    requestAnimationFrame(function() {
        toast.classList.add('show');
    });

    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() { toast.remove(); }, 350);
    }, 3500);
}

window.NegosyoPlan = {
    formatPrice,
    generateStars,
    updateCartBadge,
    showToast,
    currentCurrency: function() { return currentCurrency; }
};
