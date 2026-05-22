(function () {
    'use strict';

    var BASE = window.NEGOSYO_API_BASE || 'http://localhost:8000';
    var TOKEN_KEY = 'np_admin_token';
    var currentSettings = {};
    var dirtyMap = {};
    var pendingLogoFile = null;

    var SECTION_KEYS = ['overview','pricing','promo','branding','theme','products','hero','contact','system'];

    /* ── Color presets ──────────────────────────────────────── */
    var PRESETS = [
        { name:'Original', p:'#E8420A', s:'#0F1F3D', a:'#F5A500' },
        { name:'Ocean',    p:'#0077B6', s:'#03045E', a:'#00B4D8' },
        { name:'Forest',   p:'#2D6A4F', s:'#1B4332', a:'#95D5B2' },
        { name:'Purple',   p:'#7B2D8B', s:'#240046', a:'#E040FB' },
        { name:'Crimson',  p:'#C0392B', s:'#1A0A0A', a:'#E67E22' },
        { name:'Slate',    p:'#475569', s:'#0F172A', a:'#38BDF8' },
    ];

    /* ── Token helpers ─────────────────────────────────────── */
    function token() { return sessionStorage.getItem(TOKEN_KEY); }
    function authHeaders() {
        return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token() };
    }

    /* ── Toast ──────────────────────────────────────────────── */
    function showToast(msg, type) {
        var t = document.getElementById('a-toast');
        if (!t) return;
        var icons = { success:'check-circle', error:'exclamation-circle', info:'info-circle' };
        t.className = 'toast-' + (type || 'info');
        t.innerHTML = '<i class="fas fa-' + (icons[type] || 'info-circle') + '"></i> ' + msg;
        t.classList.add('visible');
        clearTimeout(t._timer);
        t._timer = setTimeout(function () { t.classList.remove('visible'); }, 3500);
    }

    /* ── Dirty tracking ────────────────────────────────────── */
    window.markDirty = function (section) {
        dirtyMap[section] = true;
        document.querySelectorAll('.nav-item[data-section="' + section + '"]').forEach(function (b) {
            b.classList.add('dirty');
        });
    };

    function clearDirty(section) {
        dirtyMap[section] = false;
        document.querySelectorAll('.nav-item[data-section="' + section + '"]').forEach(function (b) {
            b.classList.remove('dirty');
        });
    }

    /* ── API fetch ─────────────────────────────────────────── */
    async function apiFetch(path, opts) {
        try {
            var r = await fetch(BASE + path, opts);
            if (r.status === 401 && path !== '/admin/login') { doLogout(); return null; }
            return r;
        } catch (e) { return null; }
    }

    /* ── Auth ───────────────────────────────────────────────── */
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
        buildPresets();
        loadSettings();
        checkBackendStatus();
    }

    /* ── Branding ───────────────────────────────────────────── */
    window.handleLogoDrop = function (e) {
        e.preventDefault();
        document.getElementById('logo-dropzone').classList.remove('drag-over');
        var file = e.dataTransfer.files[0];
        if (file) applyLogoFile(file);
    };

    window.handleLogoFileInput = function (input) {
        var file = input.files[0];
        if (file) applyLogoFile(file);
    };

    function applyLogoFile(file) {
        var allowed = ['image/png','image/jpeg','image/jpg','image/svg+xml','image/webp','image/x-icon'];
        if (!allowed.includes(file.type) && !file.name.match(/\.(png|jpg|jpeg|svg|webp|ico)$/i)) {
            showToast('Invalid file type. Use PNG, JPG, SVG, or WebP.', 'error');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast('File too large. Maximum 5 MB.', 'error');
            return;
        }
        pendingLogoFile = file;
        var reader = new FileReader();
        reader.onload = function (e) {
            var src = e.target.result;
            var prevImg = document.getElementById('new-logo-preview');
            var prevBox = document.getElementById('new-logo-box');
            if (prevImg) prevImg.src = src;
            if (prevBox) prevBox.style.display = 'block';
            var info = document.getElementById('logo-file-info');
            if (info) info.innerHTML = file.name + '<br>' + (file.size / 1024).toFixed(1) + ' KB';
            var statusEl = document.getElementById('logo-save-status');
            if (statusEl) statusEl.textContent = 'Ready to upload: ' + file.name;
            markDirty('branding');
        };
        reader.readAsDataURL(file);
    }

    window.previewLogoUrl = function () {
        var url = strVal('logo-url-input');
        var prevImg = document.getElementById('new-logo-preview');
        var prevBox = document.getElementById('new-logo-box');
        var info = document.getElementById('logo-file-info');
        if (url) {
            if (prevImg) { prevImg.src = url; prevImg.onerror = function () { prevImg.src = ''; }; }
            if (prevBox) prevBox.style.display = 'block';
            if (info) info.textContent = 'URL preview';
            pendingLogoFile = null;
        } else {
            if (prevBox) prevBox.style.display = 'none';
        }
        markDirty('branding');
    };

    window.resetLogoSelection = function () {
        pendingLogoFile = null;
        var prevBox = document.getElementById('new-logo-box');
        var urlInput = document.getElementById('logo-url-input');
        var fileInput = document.getElementById('logo-file-input');
        var statusEl = document.getElementById('logo-save-status');
        if (prevBox) prevBox.style.display = 'none';
        if (urlInput) urlInput.value = '';
        if (fileInput) fileInput.value = '';
        if (statusEl) statusEl.textContent = 'Select a file above or paste a URL, then save.';
    };

    window.saveLogo = async function () {
        var btn = document.getElementById('logo-save-btn');
        var statusEl = document.getElementById('logo-save-status');
        var urlInput = strVal('logo-url-input');

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving…';

        try {
            var logoUrl = '';

            if (urlInput) {
                logoUrl = urlInput;
            } else if (pendingLogoFile) {
                if (statusEl) statusEl.textContent = 'Uploading file…';
                var form = new FormData();
                form.append('file', pendingLogoFile);
                var r = await fetch(BASE + '/admin/upload-logo', {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token() },
                    body: form
                });
                if (!r.ok) {
                    var err = await r.json().catch(function () { return {}; });
                    throw new Error(err.detail || 'Upload failed.');
                }
                var uploadData = await r.json();
                logoUrl = uploadData.url;
            } else {
                showToast('No file or URL provided.', 'error');
                return;
            }

            var ok = await putSettings({ branding: { logo_url: logoUrl } }, 'Logo', 'branding');
            if (ok) {
                var currentImg = document.getElementById('current-logo-display');
                var mockLogo = document.getElementById('brand-mock-logo');
                if (currentImg) currentImg.src = logoUrl + '?t=' + Date.now();
                if (mockLogo) mockLogo.src = logoUrl + '?t=' + Date.now();
                if (statusEl) statusEl.textContent = 'Logo saved: ' + logoUrl;
                pendingLogoFile = null;
            }
        } catch (e) {
            showToast(e.message || 'Upload failed.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-upload"></i> Upload &amp; Save';
        }
    };

    window.saveBrandName = async function () {
        await putSettings({ branding: { brand_name: strVal('brand-name-input') } }, 'Brand name', 'branding');
    };

    window.updateBrandPreview = function () {
        var name = strVal('brand-name-input') || 'NEGOSYO PLAN';
        var mockName = document.getElementById('brand-mock-name');
        if (mockName) mockName.textContent = name;
    };

    /* ── Section nav ────────────────────────────────────────── */
    window.showSection = function (name) {
        document.querySelectorAll('.section-panel').forEach(function (p) { p.classList.remove('active'); });
        var t = document.getElementById('sec-' + name);
        if (t) t.classList.add('active');
        document.querySelectorAll('.nav-item').forEach(function (b) { b.classList.remove('active'); });
        document.querySelectorAll('.nav-item[data-section="' + name + '"]').forEach(function (b) {
            b.classList.add('active');
        });
    };

    /* ── Backend status ─────────────────────────────────────── */
    window.checkBackendStatus = async function () {
        var statusEl = document.getElementById('backend-status');
        var detailEl = document.getElementById('system-status-detail');
        var apiBase = document.getElementById('api-base-display');
        if (apiBase) apiBase.textContent = BASE;

        if (statusEl) statusEl.innerHTML = '<div class="tb-status"><i class="fas fa-circle"></i> Checking…</div>';
        try {
            var r = await fetch(BASE + '/health', { signal: AbortSignal.timeout(5000) });
            var d = r.ok ? await r.json() : null;
            if (r.ok && d) {
                if (statusEl) statusEl.innerHTML = '<div class="tb-status online"><i class="fas fa-circle"></i> Online</div>';
                if (detailEl) detailEl.innerHTML =
                    '<span class="tag tag-green"><i class="fas fa-check-circle"></i> Backend online</span>' +
                    '<br><span style="color:var(--muted);font-size:.78rem;margin-top:.4rem;display:block;">Model: ' + (d.model || 'deepseek-chat') + ' &nbsp;·&nbsp; DeepSeek: ' + (d.deepseek_configured ? '✓ Configured' : '✗ Not set') + '</span>';
            } else { throw new Error(); }
        } catch (e) {
            if (statusEl) statusEl.innerHTML = '<div class="tb-status offline"><i class="fas fa-circle"></i> Offline</div>';
            if (detailEl) detailEl.innerHTML =
                '<span class="tag tag-red"><i class="fas fa-times-circle"></i> Cannot reach backend</span>' +
                '<br><small style="color:var(--muted);margin-top:.4rem;display:block;">Start uvicorn: <code style="background:var(--surface2);padding:1px 5px;border-radius:4px;">uvicorn main:app --reload --port 8000</code></small>';
        }
    };

    /* ── Load settings ──────────────────────────────────────── */
    async function loadSettings() {
        var r = await apiFetch('/api/settings', { headers: { 'Authorization': 'Bearer ' + token() } });
        if (!r || !r.ok) { showToast('Failed to load settings.', 'error'); return; }
        var s = await r.json();
        currentSettings = s;
        populateAll(s);
    }

    function populateAll(s) {
        if (s.pricing) {
            setVal('p-starter', s.pricing.starter);
            setVal('p-founder', s.pricing.founder);
            setVal('p-complete', s.pricing.complete);
            setVal('p-custom', s.pricing.custom);
            ['starter','founder','complete','custom'].forEach(function (k) {
                updatePriceDisplay('p-' + k, 'p-' + k + '-live');
            });
        }
        if (s.promo_banner) {
            var pb = s.promo_banner;
            setChecked('promo-enabled', pb.enabled);
            setVal('promo-text', pb.text);
            setSwatchAll('promo-bg', 'promo-bg-swatch', 'promo-bg-hex-display', 'promo-bg-hex', pb.bg_color || '#E8420A');
            setSwatchAll('promo-txt', 'promo-txt-swatch', 'promo-txt-hex-display', 'promo-txt-hex', pb.text_color || '#ffffff');
            setVal('promo-link', pb.link);
            setVal('promo-link-text', pb.link_text);
            updateBannerPreview();
        }
        if (s.theme) {
            setThemeColor('t-primary', s.theme.primary || '#E8420A');
            setThemeColor('t-secondary', s.theme.secondary || '#0F1F3D');
            setThemeColor('t-accent', s.theme.accent || '#F5A500');
            updateThemePreview();
        }
        if (s.hero) {
            setVal('h-title', s.hero.title);
            setVal('h-subtitle', s.hero.subtitle);
            setVal('h-cta1', s.hero.cta_primary);
            setVal('h-cta2', s.hero.cta_secondary);
        }
        if (s.contact) {
            setVal('c-whatsapp', s.contact.whatsapp);
            setVal('c-email', s.contact.email);
        }
        if (s.products) buildProductCards(s.products);
        if (s.branding) {
            var logoUrl = s.branding.logo_url || 'assets/images/logo.svg';
            var brandName = s.branding.brand_name || 'NEGOSYO PLAN';
            setVal('brand-name-input', brandName);
            setVal('logo-url-input', s.branding.logo_url || '');
            var curLogo = document.getElementById('current-logo-display');
            var mockLogo = document.getElementById('brand-mock-logo');
            var mockName = document.getElementById('brand-mock-name');
            if (curLogo) curLogo.src = logoUrl;
            if (mockLogo) mockLogo.src = logoUrl;
            if (mockName) mockName.textContent = brandName;
        }
        buildOverview(s);
        dirtyMap = {};
        document.querySelectorAll('.nav-item').forEach(function (b) { b.classList.remove('dirty'); });
    }

    /* ── Overview ───────────────────────────────────────────── */
    function buildOverview(s) {
        var el = document.getElementById('overview-stats');
        if (!el || !s) return;
        var pr = s.pricing || {};
        var pb = s.promo_banner || {};
        var th = s.theme || {};
        var links = {
            starter:'pricing', founder:'pricing', complete:'pricing', custom:'pricing',
            promo:'promo', primary:'theme', secondary:'theme', accent:'theme'
        };
        function card(icon, label, value, section) {
            return '<div class="overview-card" onclick="showSection(\'' + section + '\')">' +
                '<div class="ov-icon"><i class="fas fa-' + icon + '"></i></div>' +
                '<div><div class="ov-label">' + label + '</div><div class="ov-value">' + value + '</div></div>' +
                '</div>';
        }
        function dot(color) {
            return '<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:' + color + ';vertical-align:middle;margin-right:4px;border:1.5px solid rgba(255,255,255,.2);"></span>' + color;
        }
        el.innerHTML = [
            card('star', 'Starter', '₱' + fmtNum(pr.starter), 'pricing'),
            card('briefcase', 'Founder', '₱' + fmtNum(pr.founder), 'pricing'),
            card('layer-group', 'Complete Set', '₱' + fmtNum(pr.complete), 'pricing'),
            card('gem', 'Custom Bundle', '₱' + fmtNum(pr.custom), 'pricing'),
            card('bullhorn', 'Promo Banner', pb.enabled ?
                '<span class="tag tag-green" style="font-size:.68rem;">Active</span>' :
                '<span class="tag" style="font-size:.68rem;background:var(--surface2);color:var(--muted);">Off</span>', 'promo'),
            card('palette', 'Primary Color', dot(th.primary || '#E8420A'), 'theme'),
        ].join('');
    }

    /* ── Product cards ──────────────────────────────────────── */
    function buildProductCards(products) {
        var container = document.getElementById('products-card');
        if (!container) return;
        var names = { 1:'Starter Bundle', 2:'Founder Bundle', 3:'Complete Set Bundle', 4:'Custom Bundle' };
        var html = '';
        [1, 2, 3, 4].forEach(function (id) {
            var p = products[id] || products[String(id)] || {};
            html += '<div class="admin-card" style="margin-bottom:1rem;">' +
                '<div class="product-editor">' +
                '<div class="product-thumb-wrap">' +
                '<img class="product-thumb-img" id="prod-thumb-' + id + '" src="' + esc(p.image || '') + '" alt="" onerror="this.src=\'\';">' +
                '<div class="product-thumb-overlay"><i class="fas fa-image"></i></div>' +
                '</div>' +
                '<div>' +
                '<div class="product-id-badge">Bundle ' + id + '</div>' +
                '<div class="form-field" style="margin-bottom:.65rem;">' +
                '<label>Name</label>' +
                '<input type="text" id="prod-name-' + id + '" value="' + esc(p.name || '') + '" placeholder="' + names[id] + '" oninput="markDirty(\'products\')">' +
                '</div>' +
                '<div class="form-field" style="margin-bottom:.65rem;">' +
                '<label>Image URL</label>' +
                '<input type="text" id="prod-img-' + id + '" value="' + esc(p.image || '') + '" placeholder="https://…" oninput="updateThumb(' + id + ');markDirty(\'products\')">' +
                '</div>' +
                '<div class="form-field" style="margin-bottom:0;">' +
                '<label>Description</label>' +
                '<input type="text" id="prod-desc-' + id + '" value="' + esc(p.description || '') + '" placeholder="Short description…" oninput="markDirty(\'products\')">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        });
        container.innerHTML = html;
    }

    window.updateThumb = function (id) {
        var img = document.getElementById('prod-thumb-' + id);
        var url = (document.getElementById('prod-img-' + id) || {}).value || '';
        if (img) img.src = url;
    };

    /* ── Save helpers ───────────────────────────────────────── */
    async function putSettings(patch, label, section) {
        var r = await apiFetch('/admin/settings', {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(patch)
        });
        if (!r) { showToast('Cannot connect to backend.', 'error'); return false; }
        if (!r.ok) {
            var d = await r.json().catch(function () { return {}; });
            showToast(d.detail || 'Save failed.', 'error');
            return false;
        }
        var updated = await r.json();
        currentSettings = updated.settings || updated;
        buildOverview(currentSettings);
        if (section) clearDirty(section);
        showToast(label + ' saved.', 'success');
        return true;
    }

    window.savePricing = async function () {
        await putSettings({ pricing: {
            starter: numVal('p-starter'),
            founder: numVal('p-founder'),
            complete: numVal('p-complete'),
            custom: numVal('p-custom')
        }}, 'Pricing', 'pricing');
    };

    window.savePromo = async function () {
        await putSettings({ promo_banner: {
            enabled: document.getElementById('promo-enabled').checked,
            text: strVal('promo-text'),
            bg_color: strVal('promo-bg-hex') || colorVal('promo-bg'),
            text_color: strVal('promo-txt-hex') || colorVal('promo-txt'),
            link: strVal('promo-link'),
            link_text: strVal('promo-link-text')
        }}, 'Promo banner', 'promo');
    };

    window.saveTheme = async function () {
        await putSettings({ theme: {
            primary: strVal('t-primary-hex') || colorVal('t-primary'),
            secondary: strVal('t-secondary-hex') || colorVal('t-secondary'),
            accent: strVal('t-accent-hex') || colorVal('t-accent')
        }}, 'Theme', 'theme');
    };

    window.resetTheme = function () {
        setThemeColor('t-primary', '#E8420A');
        setThemeColor('t-secondary', '#0F1F3D');
        setThemeColor('t-accent', '#F5A500');
        updateThemePreview();
        markDirty('theme');
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
        await putSettings({ products: products }, 'Products', 'products');
    };

    window.saveHero = async function () {
        await putSettings({ hero: {
            title: strVal('h-title'),
            subtitle: strVal('h-subtitle'),
            cta_primary: strVal('h-cta1'),
            cta_secondary: strVal('h-cta2')
        }}, 'Hero content', 'hero');
    };

    window.saveContact = async function () {
        await putSettings({ contact: {
            whatsapp: strVal('c-whatsapp'),
            email: strVal('c-email')
        }}, 'Contact info', 'contact');
    };

    /* ── Reset ──────────────────────────────────────────────── */
    window.confirmReset = async function () {
        if (!confirm('Reset ALL settings to factory defaults?\n\nThis cannot be undone.')) return;
        var r = await apiFetch('/admin/settings/reset', { method: 'POST', headers: authHeaders() });
        if (!r || !r.ok) { showToast('Reset failed.', 'error'); return; }
        var data = await r.json();
        currentSettings = data.settings || data;
        populateAll(currentSettings);
        showToast('Settings reset to defaults.', 'success');
    };

    /* ── Theme color helpers ────────────────────────────────── */
    function setThemeColor(id, val) {
        var normalized = normalizeHex(val);
        if (!normalized) return;
        var colorEl = document.getElementById(id);
        var hexEl = document.getElementById(id + '-hex');
        var swatchEl = document.getElementById(id + '-swatch');
        var hexDisplay = document.getElementById(id + '-hex-display');
        if (colorEl) colorEl.value = normalized;
        if (hexEl) hexEl.value = normalized;
        if (swatchEl) swatchEl.style.background = normalized;
        if (hexDisplay) hexDisplay.textContent = normalized;
    }

    window.onThemeColor = function (id) {
        var colorEl = document.getElementById(id);
        if (!colorEl) return;
        var val = colorEl.value;
        var hexEl = document.getElementById(id + '-hex');
        var swatchEl = document.getElementById(id + '-swatch');
        var hexDisplay = document.getElementById(id + '-hex-display');
        if (hexEl) hexEl.value = val;
        if (swatchEl) swatchEl.style.background = val;
        if (hexDisplay) hexDisplay.textContent = val;
        updateThemePreview();
        markDirty('theme');
    };

    window.onThemeHex = function (id) {
        var hexEl = document.getElementById(id + '-hex');
        if (!hexEl) return;
        var val = hexEl.value.trim();
        var normalized = normalizeHex(val);
        if (!normalized) return;
        var colorEl = document.getElementById(id);
        var swatchEl = document.getElementById(id + '-swatch');
        var hexDisplay = document.getElementById(id + '-hex-display');
        if (colorEl) colorEl.value = normalized;
        if (swatchEl) swatchEl.style.background = normalized;
        if (hexDisplay) hexDisplay.textContent = normalized;
        updateThemePreview();
        markDirty('theme');
    };

    /* ── Theme live preview ─────────────────────────────────── */
    function updateThemePreview() {
        var p = colorVal('t-primary') || '#E8420A';
        var s = colorVal('t-secondary') || '#0F1F3D';
        var a = colorVal('t-accent') || '#F5A500';
        var preview = document.getElementById('theme-preview');
        if (!preview) return;
        preview.style.setProperty('--tp-primary', p);
        preview.style.setProperty('--tp-secondary', s);
        preview.style.setProperty('--tp-accent', a);
        preview.querySelectorAll('.tp-nav-btn,.tp-hero-btn,.tp-card-btn').forEach(function (el) {
            el.style.background = p;
        });
        preview.querySelectorAll('.tp-card-badge').forEach(function (el) {
            el.style.background = a;
        });
        preview.querySelectorAll('.tp-card-price').forEach(function (el) {
            el.style.color = p;
        });
        preview.querySelectorAll('.tp-nav').forEach(function (el) {
            el.style.background = s;
        });
        preview.querySelectorAll('.tp-hero').forEach(function (el) {
            el.style.background = 'linear-gradient(135deg,' + s + ',' + s + 'aa)';
        });
        preview.querySelectorAll('.tp-nav-logo').forEach(function (el) {
            el.style.background = a;
        });
    }

    /* ── Presets ────────────────────────────────────────────── */
    function buildPresets() {
        var grid = document.getElementById('preset-grid');
        if (!grid) return;
        grid.innerHTML = PRESETS.map(function (pr) {
            return '<button class="preset-btn" onclick="applyPreset(\'' + pr.p + '\',\'' + pr.s + '\',\'' + pr.a + '\')">' +
                '<div class="preset-swatches">' +
                '<div class="preset-dot" style="background:' + pr.p + ';"></div>' +
                '<div class="preset-dot" style="background:' + pr.s + ';"></div>' +
                '<div class="preset-dot" style="background:' + pr.a + ';"></div>' +
                '</div>' + pr.name + '</button>';
        }).join('');
    }

    window.applyPreset = function (p, s, a) {
        setThemeColor('t-primary', p);
        setThemeColor('t-secondary', s);
        setThemeColor('t-accent', a);
        updateThemePreview();
        markDirty('theme');
        showToast('Preset applied — click Save Theme to keep it.', 'info');
    };

    /* ── Promo color sync ───────────────────────────────────── */
    window.syncSwatchColor = function (colorId, swatchId, displayId, hexId) {
        var colorEl = document.getElementById(colorId);
        if (!colorEl) return;
        var val = colorEl.value;
        var sw = document.getElementById(swatchId);
        var dp = document.getElementById(displayId);
        var hx = document.getElementById(hexId);
        if (sw) sw.style.background = val;
        if (dp) dp.textContent = val;
        if (hx) hx.value = val;
    };

    window.syncHexToSwatch = function (colorId, swatchId, displayId, hexId) {
        var hexEl = document.getElementById(hexId);
        if (!hexEl) return;
        var normalized = normalizeHex(hexEl.value.trim());
        if (!normalized) return;
        var colorEl = document.getElementById(colorId);
        var sw = document.getElementById(swatchId);
        var dp = document.getElementById(displayId);
        if (colorEl) colorEl.value = normalized;
        if (sw) sw.style.background = normalized;
        if (dp) dp.textContent = normalized;
    };

    function setSwatchAll(colorId, swatchId, displayId, hexId, val) {
        var normalized = normalizeHex(val) || val;
        var colorEl = document.getElementById(colorId);
        var sw = document.getElementById(swatchId);
        var dp = document.getElementById(displayId);
        var hx = document.getElementById(hexId);
        if (colorEl) colorEl.value = normalized;
        if (sw) sw.style.background = normalized;
        if (dp) dp.textContent = normalized;
        if (hx) hx.value = normalized;
    }

    /* ── Banner preview ─────────────────────────────────────── */
    window.updateBannerPreview = function () {
        var preview = document.getElementById('banner-preview');
        var prevText = document.getElementById('banner-prev-text');
        var prevBtn = document.getElementById('banner-prev-btn');
        if (!preview) return;
        var bg = strVal('promo-bg-hex') || colorVal('promo-bg') || '#E8420A';
        var txtClr = strVal('promo-txt-hex') || colorVal('promo-txt') || '#ffffff';
        var text = strVal('promo-text') || 'Your banner text appears here';
        var btnTxt = strVal('promo-link-text') || 'Shop Now';
        preview.style.background = bg;
        preview.style.color = txtClr;
        if (prevText) prevText.textContent = text;
        if (prevBtn) {
            prevBtn.textContent = btnTxt;
            prevBtn.style.borderColor = txtClr;
            prevBtn.style.color = txtClr;
        }
    };

    /* ── Price display ──────────────────────────────────────── */
    window.updatePriceDisplay = function (inputId, displayId) {
        var el = document.getElementById(displayId);
        var val = parseFloat((document.getElementById(inputId) || {}).value || 0);
        if (el) el.textContent = val > 0 ? '₱' + val.toLocaleString() : '';
        markDirty('pricing');
    };

    /* ── Keyboard shortcuts ─────────────────────────────────── */
    var sectionOrder = ['overview','pricing','promo','theme','products','hero','contact','system'];
    document.addEventListener('keydown', function (e) {
        var shell = document.getElementById('admin-shell');
        var loginVisible = document.getElementById('login-screen').style.display !== 'none';

        if (loginVisible && e.key === 'Enter') { doLogin(); return; }

        if (shell && shell.style.display !== 'none') {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                var active = document.querySelector('.section-panel.active');
                if (!active) return;
                var id = active.id.replace('sec-', '');
                var saveFns = {
                    pricing: window.savePricing, promo: window.savePromo,
                    branding: window.saveBrandName,
                    theme: window.saveTheme, products: window.saveProducts,
                    hero: window.saveHero, contact: window.saveContact
                };
                if (saveFns[id]) saveFns[id]();
                return;
            }
            if ((e.ctrlKey || e.metaKey) && /^[1-8]$/.test(e.key)) {
                e.preventDefault();
                var idx = parseInt(e.key, 10) - 1;
                if (sectionOrder[idx]) showSection(sectionOrder[idx]);
            }
        }
    });

    /* ── Utility ────────────────────────────────────────────── */
    function normalizeHex(val) {
        if (!val) return null;
        val = val.trim();
        if (!/^#/.test(val)) val = '#' + val;
        return /^#[0-9a-fA-F]{6}$/.test(val) ? val : null;
    }
    function colorVal(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
    }
    function strVal(id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }
    function numVal(id) {
        var el = document.getElementById(id);
        return el ? (parseFloat(el.value) || 0) : 0;
    }
    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = (val !== undefined && val !== null) ? String(val) : '';
    }
    function setChecked(id, val) {
        var el = document.getElementById(id);
        if (el) el.checked = !!val;
    }
    function fmtNum(n) {
        return (n || 0).toLocaleString();
    }
    function esc(str) {
        return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    /* ── Expose globals ─────────────────────────────────────── */
    window.doLogin = doLogin;
    window.doLogout = doLogout;
    window.loadSettings = loadSettings;
    window.checkBackendStatus = window.checkBackendStatus;

    /* ── Auto-login on reload ───────────────────────────────── */
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
