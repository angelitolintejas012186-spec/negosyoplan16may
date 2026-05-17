// api-client.js  –  frontend client for the Negosyo Plan FastAPI backend
// Exposes window.NegosyoAPI  (gracefully no-ops if backend is unreachable)

(function () {
    'use strict';

    // Point this at your running backend.
    // Override before this script loads:  window.NEGOSYO_API_BASE = 'https://your-domain.com'
    var BASE = (typeof window !== 'undefined' && window.NEGOSYO_API_BASE)
        ? window.NEGOSYO_API_BASE
        : 'http://localhost:8000';

    var TIER_MAP = { 1: 'starter', 2: 'founder', 3: 'complete', 4: 'custom' };

    // ── Internal fetch helper ────────────────────────────────────────────────

    async function _post(path, body, timeoutMs) {
        var controller = new AbortController();
        var timer = setTimeout(function () { controller.abort(); }, timeoutMs || 90000);
        try {
            var res = await fetch(BASE + path, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: controller.signal
            });
            clearTimeout(timer);
            if (!res.ok) {
                var err = await res.json().catch(function () { return {}; });
                throw new Error(err.detail || ('HTTP ' + res.status));
            }
            return await res.json();
        } catch (e) {
            clearTimeout(timer);
            throw e;
        }
    }

    // ── Map customization object → API request body ──────────────────────────

    function _toFullRequest(customization, productId) {
        var tier = TIER_MAP[productId] || customization.bundleTier || 'starter';
        return {
            business_type:       customization.businessType       || '',
            business_type_label: customization.businessTypeLabel  || customization.businessType || '',
            bundle_tier:         tier,
            capital:             Number(customization.capital)     || 0,
            location: {
                country:     (customization.location && customization.location.country)     || 'Philippines',
                region:      (customization.location && customization.location.region)      || '',
                city:        (customization.location && customization.location.city)        || '',
                subdivision: (customization.location && customization.location.subdivision) || ''
            },
            description: customization.description || '',
            suppliers: (customization.suppliers || []).map(function (s) {
                return { name: s.name || '', type: s.type || '', contact: s.contact || '', coverage: s.coverage || '' };
            })
        };
    }

    function _toQuickRequest(customization, productId) {
        var full = _toFullRequest(customization, productId);
        return {
            business_type:       full.business_type,
            business_type_label: full.business_type_label,
            bundle_tier:         full.bundle_tier,
            capital:             full.capital,
            location:            full.location
        };
    }

    // ── Public API ───────────────────────────────────────────────────────────

    /**
     * Full blueprint generation (~30-90 s).
     * Returns { success, meta, blueprint } on success.
     */
    async function generateBlueprint(customization, productId) {
        return _post('/api/generate-blueprint', _toFullRequest(customization, productId), 90000);
    }

    /**
     * Quick feasibility check (~3-8 s).
     * Returns { success, analysis } with feasibility_score, revenue estimate, etc.
     */
    async function quickAnalysis(customization, productId) {
        return _post('/api/quick-analysis', _toQuickRequest(customization, productId), 30000);
    }

    /**
     * Health-check.  Resolves true if backend is reachable, false otherwise.
     */
    async function isBackendAvailable() {
        try {
            var res = await fetch(BASE + '/health', { signal: AbortSignal.timeout(4000) });
            return res.ok;
        } catch (_) {
            return false;
        }
    }

    // ── Quick-analysis UI helper ─────────────────────────────────────────────
    // Call this after the business form is submitted to show a small feasibility
    // badge in a toast.  Silently skips if backend is unavailable.

    async function showQuickAnalysisToast(customization, productId) {
        try {
            var available = await isBackendAvailable();
            if (!available) return;

            var result = await quickAnalysis(customization, productId);
            if (!result || !result.success) return;

            var a = result.analysis;
            var score   = a.feasibility_score  || '?';
            var label   = a.feasibility_label  || '';
            var revenue = a.monthly_revenue_estimate_php
                ? 'Est. revenue: PHP ' + Number(a.monthly_revenue_estimate_php).toLocaleString() + '/mo'
                : '';
            var tip = (a.quick_tips && a.quick_tips[0]) ? '\n💡 ' + a.quick_tips[0] : '';

            var scoreColor = { Excellent: '#10B981', Good: '#F5A500', Moderate: '#F59E0B', Challenging: '#EF4444' };
            var color = scoreColor[label] || '#F5A500';

            if (window.NegosyoPlan && window.NegosyoPlan.showToast) {
                window.NegosyoPlan.showToast(
                    '📊 Feasibility: ' + label + ' (' + score + '/10)'
                    + (revenue ? ' · ' + revenue : '')
                    + tip,
                    'info'
                );
            }
        } catch (_) {
            // silently ignore — backend may not be running
        }
    }

    window.NegosyoAPI = {
        generateBlueprint:       generateBlueprint,
        quickAnalysis:           quickAnalysis,
        isBackendAvailable:      isBackendAvailable,
        showQuickAnalysisToast:  showQuickAnalysisToast,
        BASE: BASE
    };
})();
