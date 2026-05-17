(function () {
    'use strict';

    var BASE = window.NEGOSYO_API_BASE || 'http://localhost:8000';
    var CACHE_KEY = 'np_site_settings';
    var CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    function cached() {
        try {
            var raw = sessionStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            var obj = JSON.parse(raw);
            if (Date.now() - obj.ts > CACHE_TTL) return null;
            return obj.data;
        } catch (e) { return null; }
    }

    function cache(data) {
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: data })); } catch (e) {}
    }

    async function fetchSettings() {
        var c = cached();
        if (c) return c;
        try {
            var r = await fetch(BASE + '/api/settings', { signal: AbortSignal.timeout(4000) });
            if (!r.ok) return null;
            var data = await r.json();
            cache(data);
            return data;
        } catch (e) { return null; }
    }

    function applyTheme(theme) {
        if (!theme) return;
        var root = document.documentElement.style;
        if (theme.primary) root.setProperty('--orange', theme.primary);
        if (theme.secondary) root.setProperty('--navy', theme.secondary);
        if (theme.accent) root.setProperty('--amber', theme.accent);
    }

    function applyPricing(pricing) {
        if (!pricing) return;
        var map = { starter: pricing.starter, founder: pricing.founder, complete: pricing.complete, custom: pricing.custom };
        document.querySelectorAll('[data-price-tier]').forEach(function (el) {
            var tier = el.getAttribute('data-price-tier');
            if (map[tier] !== undefined) el.textContent = 'PHP ' + Number(map[tier]).toLocaleString();
        });
    }

    function applyPromoBanner(banner) {
        if (!banner || !banner.enabled) return;
        var existing = document.getElementById('promo-site-banner');
        if (existing) return;

        var bar = document.createElement('div');
        bar.id = 'promo-site-banner';
        bar.style.cssText = 'width:100%;background:' + (banner.bg_color || '#E8420A') + ';color:' + (banner.text_color || '#fff') + ';text-align:center;padding:0.55rem 1rem;font-size:0.82rem;font-weight:600;display:flex;align-items:center;justify-content:center;gap:0.75rem;z-index:1001;position:relative;';
        var text = document.createElement('span');
        text.textContent = banner.text || '';
        bar.appendChild(text);

        if (banner.link && banner.link_text) {
            var btn = document.createElement('a');
            btn.href = banner.link;
            btn.textContent = banner.link_text;
            btn.style.cssText = 'background:rgba(255,255,255,0.22);color:inherit;padding:0.2rem 0.8rem;border-radius:999px;font-weight:700;font-size:0.78rem;border:1px solid currentColor;text-decoration:none;';
            bar.appendChild(btn);
        }

        var header = document.querySelector('header');
        if (header) header.parentNode.insertBefore(bar, header);
        else document.body.prepend(bar);
    }

    function applyHero(hero) {
        if (!hero) return;
        var titleEl = document.querySelector('.hero-title, [data-hero="title"]');
        var subtitleEl = document.querySelector('.hero-subtitle, [data-hero="subtitle"]');
        var cta1 = document.querySelector('[data-hero="cta-primary"]');
        var cta2 = document.querySelector('[data-hero="cta-secondary"]');
        if (titleEl && hero.title) titleEl.textContent = hero.title;
        if (subtitleEl && hero.subtitle) subtitleEl.textContent = hero.subtitle;
        if (cta1 && hero.cta_primary) cta1.textContent = hero.cta_primary;
        if (cta2 && hero.cta_secondary) cta2.textContent = hero.cta_secondary;
    }

    function applyBranding(branding) {
        if (!branding) return;
        if (branding.logo_url) {
            document.querySelectorAll(
                'nav .logo img, .site-logo, .login-logo img, .tb-brand img, header img[alt]'
            ).forEach(function (img) {
                img.src = branding.logo_url;
            });
        }
        if (branding.brand_name) {
            document.querySelectorAll('.brand-name').forEach(function (el) {
                el.textContent = branding.brand_name;
            });
        }
    }

    document.addEventListener('DOMContentLoaded', async function () {
        var s = await fetchSettings();
        if (!s) return;
        applyTheme(s.theme);
        applyPricing(s.pricing);
        applyPromoBanner(s.promo_banner);
        applyHero(s.hero);
        applyBranding(s.branding);
    });

    window.NegosyoSettings = { fetch: fetchSettings };
})();
