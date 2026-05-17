(function () {
    'use strict';

    var BASE = 'http://localhost:8000';
    var TOKEN_KEY = 'np_admin_token';
    var currentSettings = {};

    /* ── helpers ──────────────────────────────────────────────── */
    function token() { return sessionStorage.getItem(TOKEN_KEY); }

    function authHeaders() {
        return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token() };
    }

    function showToast(msg, type) {
        var t = document.getElementById('a-toast');
        if (!t) return;
        t.className = 'toast-' + (type || 'info');
        t.innerHTML = '<i class="fas fa-' + (type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle') + '"></i> ' + msg;
        t.classList.add('visible');
        clearTimeout(t._timer);
        t._timer = setTimeout(function () { t.classList.remove('visible'); }, 3500);
    }

    async function apiFetch(path, opts) {
        try {
            var r = await fetch(BASE + path, opts);
            if (r.status === 401) { doLogout(); return null; }
            return r;
        } catch (e) {
            return null;
        }
    }

    /* ── auth ──────────────────────────────────────────────────── */
    async function doLogin() {
        var btn = document.getElementById('login-btn');
        var errWrap = document.getElementById('login-error');
        var errMsg = document.getElementById('login-error-msg');
        errWrap.style.display = 'none';

        var username = (document.getElementById('l-user').value || '').trim();
        var password = (document.getElementById('l-pass').value || '');
        if (!username || !password) {
            errMsg.textContent = 'Please enter both username and password.';
            errWrap.style.display = 'flex';
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in…';

        var r, data;
        try {
            r = await fetch(BASE + '/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password })
            });
            data = await r.json();
        } catch (e) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            errMsg.textContent = 'Cannot connect to backend at ' + BASE + '. Make sure the server is running.';
            errWrap.style.display = 'flex';
            return;
        }

        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';

        if (!r.ok) {
            errMsg.textContent = data.detail || 'Invalid username or password.';
            errWrap.style.display = 'flex';
            document.getElementById('l-pass').value = '';
            return;
        }

        sessionStorage.setItem(TOKEN_KEY, data.access_token);
        var uEl = document.getElementById('admin-username');
        if (uEl) uEl.textContent = data.username || username;
        enterShell();
    }

    function doLogout() {
        sessionStorage.removeItem(TOKEN_KEY);
        document.getElementById('admin-shell').style.display = 'none';
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('l-user').value = '';
        document.getElementById('l-pass').value = '';
    }

    function enterShell() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-shell').style.display = 'flex';
        loadSettings();
        checkBackendStatus();
    }

    /* ── section nav ───────────────────────────────────────────── */
    window.showSection = function (name) {
        document.querySelectorAll('.section-panel').forEach(function (p) { p.classList.remove('active'); });
        var target = document.getElementById('sec-' + name);
        if (target) target.classList.add('active');

        document.querySelectorAll('.nav-item').forEach(function (b) { b.classList.remove('active'); });
        var navBtns = document.querySelectorAll('.nav-item');
        navBtns.forEach(function (b) {
            if (b.getAttribute('onclick') === "showSection('" + name + "')") b.classList.add('active');
        });
    };

    /* ── backend status ────────────────────────────────────────── */
    async function checkBackendStatus() {
        var statusEl = document.getElementById('backend-status');
        var detailEl = document.getElementById('system-status-detail');
        var apiBase = document.getElementById('api-base-display');
        if (apiBase) apiBase.textContent = BASE;

        try {
            var r = await fetch(BASE + '/health', { signal: AbortSignal.timeout(4000) });
            var data = r.ok ? await r.json() : null;
            if (r.ok && data) {
                if (statusEl) statusEl.innerHTML = '<span style="display:inline-flex;align-items:center;gap:0.4rem;font-size:0.78rem;color:#4CAF50;"><i class="fas fa-circle" style="font-size:0.5rem;"></i>Backend Online</span>';
                if (detailEl) detailEl.innerHTML = '<span style="color:#4CAF50;"><i class="fas fa-check-circle"></i> Backend is online and responding.</span><br><small>Status: ' + (data.status || 'ok') + '</small>';
            } else {
                throw new Error('not ok');
            }
        } catch (e) {
            if (statusEl) statusEl.innerHTML = '<span style="display:inline-flex;align-items:center;gap:0.4rem;font-size:0.78rem;color:#FF5252;"><i class="fas fa-circle" style="font-size:0.5rem;"></i>Backend Offline</span>';
            if (detailEl) detailEl.innerHTML = '<span style="color:#FF5252;"><i class="fas fa-times-circle"></i> Cannot reach backend at ' + BASE + '</span><br><small>Start the FastAPI server to enable settings management.</small>';
        }
    }

    /* ── load settings ─────────────────────────────────────────── */
    async function loadSettings() {
        var r = await apiFetch('/api/settings', { headers: { 'Authorization': 'Bearer ' + token() } });
        if (!r || !r.ok) { showToast('Failed to load settings.', 'error'); return; }
        var s = await r.json();
        currentSettings = s;
        populateAll(s);
    }

    function populateAll(s) {
        /* pricing */
        if (s.pricing) {
            setVal('p-starter', s.pricing.starter);
            setVal('p-founder', s.pricing.founder);
            setVal('p-complete', s.pricing.complete);
            setVal('p-custom', s.pricing.custom);
        }

        /* promo banner */
        if (s.promo_banner) {
            var pb = s.promo_banner;
            setChecked('promo-enabled', pb.enabled);
            setVal('promo-text', pb.text);
            setColor('promo-bg', 'promo-bg-hex', pb.bg_color || '#E8420A');
            setColor('promo-txt', 'promo-txt-hex', pb.text_color || '#ffffff');
            setVal('promo-link', pb.link);
            setVal('promo-link-text', pb.link_text);
            updateBannerPreview();
        }

        /* theme */
        if (s.theme) {
            setColor('t-primary', 't-primary-hex', s.theme.primary || '#E8420A');
            setColor('t-secondary', 't-secondary-hex', s.theme.secondary || '#0F1F3D');
            setColor('t-accent', 't-accent-hex', s.theme.accent || '#F5A500');
        }

        /* hero */
        if (s.hero) {
            setVal('h-title', s.hero.title);
            setVal('h-subtitle', s.hero.subtitle);
            setVal('h-cta1', s.hero.cta_primary);
            setVal('h-cta2', s.hero.cta_secondary);
        }

        /* contact */
        if (s.contact) {
            setVal('c-whatsapp', s.contact.whatsapp);
            setVal('c-email', s.contact.email);
        }

        /* products */
        if (s.products) buildProductCards(s.products);

        /* overview stats */
        buildOverview(s);
    }

    function buildOverview(s) {
        var el = document.getElementById('overview-stats');
        if (!el || !s) return;
        var pricing = s.pricing || {};
        var promo = s.promo_banner || {};
        var theme = s.theme || {};
        el.innerHTML = [
            stat('fas fa-tag', 'Starter', 'PHP ' + fmtPrice(pricing.starter)),
            stat('fas fa-briefcase', 'Founder', 'PHP ' + fmtPrice(pricing.founder)),
            stat('fas fa-layer-group', 'Complete Set', 'PHP ' + fmtPrice(pricing.complete)),
            stat('fas fa-star', 'Custom Bundle', 'PHP ' + fmtPrice(pricing.custom)),
            stat('fas fa-bullhorn', 'Promo Banner', promo.enabled ? '<span style="color:#4CAF50;">Active</span>' : '<span style="color:var(--muted);">Off</span>'),
            stat('fas fa-palette', 'Primary Color', '<span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:' + (theme.primary || '#E8420A') + ';vertical-align:middle;margin-right:4px;border:1px solid rgba(255,255,255,0.2);"></span>' + (theme.primary || '#E8420A')),
        ].join('');
    }

    function stat(icon, label, value) {
        return '<div class="stat-card"><div class="stat-icon"><i class="' + icon + '"></i></div><div><div class="stat-label">' + label + '</div><div class="stat-value">' + value + '</div></div></div>';
    }

    function buildProductCards(products) {
        var container = document.getElementById('products-card');
        if (!container) return;
        var html = '<h3 style="margin-bottom:1rem;"><i class="fas fa-cubes"></i> All Bundles</h3>';
        var names = { 1: 'Starter Bundle', 2: 'Founder Bundle', 3: 'Complete Set Bundle', 4: 'Custom Bundle' };
        [1, 2, 3, 4].forEach(function (id) {
            var p = (products[id] || products[String(id)] || {});
            html += '<div class="product-editor" style="border:1px solid var(--border);border-radius:10px;padding:1.25rem;margin-bottom:1rem;">';
            html += '<div style="font-size:0.75rem;font-weight:700;color:var(--orange);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.75rem;">Bundle ' + id + ' — ' + (p.name || names[id]) + '</div>';
            html += '<div class="grid-3">';
            html += '<div class="form-field" style="grid-column:span 1;"><label>Product Name</label><input type="text" id="prod-name-' + id + '" value="' + esc(p.name || '') + '" placeholder="' + names[id] + '"></div>';
            html += '<div class="form-field" style="grid-column:span 2;"><label>Image URL</label><input type="text" id="prod-img-' + id + '" value="' + esc(p.image || '') + '" placeholder="https://…"></div>';
            html += '</div>';
            html += '<div class="form-field"><label>Short Description</label><input type="text" id="prod-desc-' + id + '" value="' + esc(p.description || '') + '" placeholder="Brief product description…"></div>';
            html += '</div>';
        });
        container.innerHTML = html;
    }

    /* ── save functions ────────────────────────────────────────── */
    async function putSettings(patch, label) {
        var r = await apiFetch('/admin/settings', {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(patch)
        });
        if (!r) { showToast('Cannot connect to backend.', 'error'); return false; }
        if (!r.ok) {
            var d = await r.json().catch(function () { return {}; });
            showToast((d.detail || 'Save failed.'), 'error');
            return false;
        }
        var updated = await r.json();
        currentSettings = updated;
        buildOverview(updated);
        showToast(label + ' saved successfully.', 'success');
        return true;
    }

    window.savePricing = async function () {
        var patch = { pricing: {
            starter: numVal('p-starter'),
            founder: numVal('p-founder'),
            complete: numVal('p-complete'),
            custom: numVal('p-custom')
        }};
        await putSettings(patch, 'Pricing');
    };

    window.savePromo = async function () {
        var patch = { promo_banner: {
            enabled: document.getElementById('promo-enabled').checked,
            text: strVal('promo-text'),
            bg_color: strVal('promo-bg-hex') || strVal('promo-bg'),
            text_color: strVal('promo-txt-hex') || strVal('promo-txt'),
            link: strVal('promo-link'),
            link_text: strVal('promo-link-text')
        }};
        await putSettings(patch, 'Promo banner');
    };

    window.saveTheme = async function () {
        var patch = { theme: {
            primary: strVal('t-primary-hex') || strVal('t-primary'),
            secondary: strVal('t-secondary-hex') || strVal('t-secondary'),
            accent: strVal('t-accent-hex') || strVal('t-accent')
        }};
        await putSettings(patch, 'Theme');
    };

    window.resetTheme = function () {
        setColor('t-primary', 't-primary-hex', '#E8420A');
        setColor('t-secondary', 't-secondary-hex', '#0F1F3D');
        setColor('t-accent', 't-accent-hex', '#F5A500');
    };

    window.saveProducts = async function () {
        var products = {};
        [1, 2, 3, 4].forEach(function (id) {
            products[id] = {
                name: strVal('prod-name-' + id),
                image: strVal('prod-img-' + id),
                description: strVal('prod-desc-' + id)
            };
        });
        await putSettings({ products: products }, 'Products');
    };

    window.saveHero = async function () {
        var patch = { hero: {
            title: strVal('h-title'),
            subtitle: strVal('h-subtitle'),
            cta_primary: strVal('h-cta1'),
            cta_secondary: strVal('h-cta2')
        }};
        await putSettings(patch, 'Hero content');
    };

    window.saveContact = async function () {
        var patch = { contact: {
            whatsapp: strVal('c-whatsapp'),
            email: strVal('c-email')
        }};
        await putSettings(patch, 'Contact info');
    };

    /* ── reset ─────────────────────────────────────────────────── */
    window.confirmReset = async function () {
        if (!confirm('Reset ALL settings to factory defaults? This cannot be undone.')) return;
        var r = await apiFetch('/admin/settings/reset', { method: 'POST', headers: authHeaders() });
        if (!r || !r.ok) { showToast('Reset failed.', 'error'); return; }
        var data = await r.json();
        currentSettings = data.settings || data;
        populateAll(currentSettings);
        showToast('Settings reset to defaults.', 'success');
    };

    /* ── color helpers ─────────────────────────────────────────── */
    window.syncColor = function (colorId, hexId) {
        var hex = document.getElementById(colorId);
        var txt = document.getElementById(hexId);
        if (hex && txt) txt.value = hex.value;
    };

    window.syncHex = function (colorId, hexId) {
        var hex = document.getElementById(colorId);
        var txt = document.getElementById(hexId);
        if (!hex || !txt) return;
        var v = txt.value.trim();
        if (/^#[0-9a-fA-F]{6}$/.test(v)) hex.value = v;
    };

    window.updateBannerPreview = function () {
        var preview = document.getElementById('banner-preview');
        var prevText = document.getElementById('banner-prev-text');
        var prevBtn = document.getElementById('banner-prev-btn');
        if (!preview) return;
        var bg = strVal('promo-bg-hex') || strVal('promo-bg') || '#E8420A';
        var txtClr = strVal('promo-txt-hex') || strVal('promo-txt') || '#ffffff';
        var text = strVal('promo-text') || 'Preview text';
        var btnTxt = strVal('promo-link-text') || 'Shop Now';
        preview.style.background = bg;
        preview.style.color = txtClr;
        if (prevText) prevText.textContent = text;
        if (prevBtn) {
            prevBtn.textContent = btnTxt;
            prevBtn.style.color = txtClr;
            prevBtn.style.border = '1px solid ' + txtClr;
        }
    };

    /* ── utils ─────────────────────────────────────────────────── */
    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = (val !== undefined && val !== null) ? String(val) : '';
    }

    function setChecked(id, val) {
        var el = document.getElementById(id);
        if (el) el.checked = !!val;
    }

    function setColor(colorId, hexId, val) {
        if (!val) return;
        var normalized = val.trim();
        if (normalized && !normalized.startsWith('#')) normalized = '#' + normalized;
        var colorEl = document.getElementById(colorId);
        var hexEl = document.getElementById(hexId);
        if (colorEl) colorEl.value = normalized;
        if (hexEl) hexEl.value = normalized;
    }

    function strVal(id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function numVal(id) {
        var el = document.getElementById(id);
        return el ? (parseFloat(el.value) || 0) : 0;
    }

    function fmtPrice(n) {
        if (!n && n !== 0) return '—';
        return Number(n).toLocaleString();
    }

    function esc(str) {
        return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    /* ── keyboard enter on login ───────────────────────────────── */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && document.getElementById('login-screen').style.display !== 'none') {
            doLogin();
        }
    });

    /* ── expose globals ────────────────────────────────────────── */
    window.doLogin = doLogin;
    window.doLogout = doLogout;
    window.loadSettings = loadSettings;

    /* ── init: auto-login if token exists ──────────────────────── */
    (async function init() {
        var saved = token();
        if (!saved) return;

        var r = await apiFetch('/admin/verify', { headers: { 'Authorization': 'Bearer ' + saved } });
        if (r && r.ok) {
            var d = await r.json();
            var uEl = document.getElementById('admin-username');
            if (uEl && d.username) uEl.textContent = d.username;
            enterShell();
        } else {
            sessionStorage.removeItem(TOKEN_KEY);
        }
    })();

})();
