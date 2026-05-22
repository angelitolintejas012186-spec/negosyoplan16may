(function () {
    'use strict';

    const API_BASE = window.NEGOSYO_API_BASE || 'http://localhost:8000';

    function mapCustomization(c) {
        return {
            business_type: c.businessType || 'general_business',
            business_type_label: c.businessTypeLabel || 'General Business',
            bundle_tier: c.bundleTier || 'starter',
            capital: parseFloat(c.capital) || 50000,
            location: {
                country: (c.location && c.location.country) || 'Philippines',
                region: (c.location && c.location.region) || '',
                city: (c.location && c.location.city) || '',
                subdivision: (c.location && c.location.subdivision) || '',
            },
            description: c.description || '',
            suppliers: (c.suppliers || []).map(function (s) {
                return typeof s === 'string'
                    ? { name: s, type: '', contact: '', coverage: '' }
                    : { name: s.name || '', type: s.type || '', contact: s.contact || '', coverage: s.coverage || '' };
            }),
        };
    }

    function locationStr(c) {
        return [
            c.location && c.location.city,
            c.location && c.location.region,
            'Philippines',
        ].filter(Boolean).join(', ');
    }

    function buildGensparkOutline(purchase) {
        var item = purchase.items[0];
        var c = item.customization || {};
        var loc = locationStr(c);
        var sups = (c.suppliers || []).map(function (s) { return s.name || s; }).join(', ') || 'Not specified';

        return [
            'NEGOSYO PLAN — BUSINESS BLUEPRINT PRESENTATION',
            '================================================',
            'Business: ' + (c.businessTypeLabel || item.name),
            'Capital: PHP ' + parseFloat(c.capital || 0).toLocaleString(),
            'Location: ' + loc,
            'Bundle Tier: ' + (c.bundleTier || 'starter').toUpperCase(),
            'Suppliers: ' + sups,
            'Description: ' + (c.description || 'Not provided'),
            '',
            'SLIDES TO CREATE (11 slides):',
            '1. Cover Slide — Business name, type, capital, location, bundle tier',
            '2. Executive Summary — Business concept, unique value proposition, revenue model, key success factors',
            '3. SWOT Analysis — Strengths, Weaknesses, Opportunities, Threats in a 2×2 grid',
            '4. Financial Analysis — 6-month revenue projection, break-even, gross margin, ROI, startup costs',
            '5. Operations & Management — Daily checklist, staffing plan, KPIs',
            '6. Marketing Strategy — Traditional tactics, digital platforms (FB/TikTok/Shopee), SEO keywords',
            '7. Implementation Timeline — Phased action plan with budgets per phase',
            '8. Permits & Legal — Registration steps (DTI, Barangay, Mayor\'s Permit, BIR) with costs',
            '9. Risk Analysis — Top 5 risks with probability/impact matrix and mitigation',
            '10. Materials & Equipment — Equipment list with costs, monthly materials, sourcing tips',
            '11. Closing — Checklist summary, next steps, contact information',
            '',
            'DESIGN NOTES:',
            '- Brand colors: Orange #E8420A, Navy #0F1F3D, Amber #F5A500',
            '- Professional business style, suitable for investors and banks',
            '- Include Philippine peso (₱) for all currency values',
            '- Widescreen 16:9 format',
        ].join('\n');
    }

    // ── Loading / Ready / Error states ────────────────────────────────────────

    function showLoading(section, message) {
        section.innerHTML =
            '<div class="pres-loading">' +
            '  <div class="pres-spinner"><i class="fas fa-cog fa-spin"></i></div>' +
            '  <h4>' + (message || 'Generating Your Presentation') + '</h4>' +
            '  <p>AI is building your professional slides.<br>This takes about 60–90 seconds — please wait.</p>' +
            '  <div class="pres-progress-bar"><div class="pres-progress-fill"></div></div>' +
            '</div>';
    }

    function showGensparkLoading(section) {
        section.innerHTML =
            '<div class="pres-loading">' +
            '  <div class="pres-spinner" style="color:#6366F1;"><i class="fas fa-magic fa-spin"></i></div>' +
            '  <h4 style="color:#6366F1;">Designing in Genspark AI…</h4>' +
            '  <p>Genspark is generating your professional slide design.<br>This may take up to 90 seconds.</p>' +
            '  <div class="pres-progress-bar"><div class="pres-progress-fill" style="background:#6366F1;"></div></div>' +
            '</div>';
    }

    function showPptxReady(section, downloadUrl, gensparkOutline, cust, purchase) {
        section.innerHTML =
            '<div class="pres-ready">' +
            '  <div class="pres-ready-icon"><i class="fas fa-check-circle"></i></div>' +
            '  <h4>Your Presentation is Ready!</h4>' +
            '  <p>11-slide professional business blueprint presentation created.</p>' +
            '  <div class="pres-actions">' +
            '    <a href="' + API_BASE + downloadUrl + '" class="button" download>' +
            '      <i class="fas fa-file-powerpoint"></i> Download PPTX' +
            '    </a>' +
            '    <button class="button" id="genspark-design-btn" style="background:linear-gradient(135deg,#6366F1,#4F46E5);border-color:#6366F1;">' +
            '      <i class="fas fa-magic"></i> Design in Genspark AI' +
            '    </button>' +
            '  </div>' +
            '  <p class="pres-note"><i class="fas fa-info-circle"></i> PPTX works with PowerPoint, Google Slides, and Keynote. File saved for 24 hours.</p>' +
            '</div>';

        document.getElementById('genspark-design-btn').addEventListener('click', function () {
            doGenspark(cust, purchase, section);
        });
    }

    function showGensparkReady(section, sparkUrl, cust, purchase, pptxDownloadUrl) {
        section.innerHTML =
            '<div class="pres-ready">' +
            '  <div class="pres-ready-icon" style="color:#6366F1;"><i class="fas fa-magic"></i></div>' +
            '  <h4 style="color:#6366F1;">Genspark Presentation Ready!</h4>' +
            '  <p>Your AI-designed business presentation has been created by Genspark.</p>' +
            '  <div class="pres-actions">' +
            '    <a href="' + sparkUrl + '" target="_blank" rel="noopener" class="button" style="background:linear-gradient(135deg,#6366F1,#4F46E5);border-color:#6366F1;">' +
            '      <i class="fas fa-external-link-alt"></i> Open Genspark Presentation' +
            '    </a>' +
            (pptxDownloadUrl
                ? '    <a href="' + API_BASE + pptxDownloadUrl + '" class="button secondary" download><i class="fas fa-file-powerpoint"></i> Download PPTX</a>'
                : '    <button class="button secondary" id="gen-pptx-again-btn"><i class="fas fa-file-powerpoint"></i> Also Download PPTX</button>'
            ) +
            '  </div>' +
            '  <div class="pres-spark-embed-wrap" style="margin-top:1.25rem;">' +
            '    <iframe src="' + sparkUrl + '" style="width:100%;height:420px;border:none;border-radius:10px;box-shadow:0 4px 24px rgba(99,102,241,0.15);" loading="lazy" title="Genspark Presentation"></iframe>' +
            '  </div>' +
            '  <p class="pres-note" style="margin-top:0.75rem;"><i class="fas fa-info-circle"></i> Presentation powered by Genspark AI. Click "Open" to view fullscreen.</p>' +
            '</div>';

        if (!pptxDownloadUrl) {
            var btn = document.getElementById('gen-pptx-again-btn');
            if (btn) {
                btn.addEventListener('click', function () {
                    doPptx(cust, purchase, section);
                });
            }
        }
    }

    function showError(section, message, retryFn) {
        section.innerHTML =
            '<div class="pres-error">' +
            '  <i class="fas fa-exclamation-triangle"></i>' +
            '  <h4>Generation Failed</h4>' +
            '  <p>' + (message || 'An unexpected error occurred.') + '</p>' +
            '  <button class="button secondary" id="pres-retry-btn"><i class="fas fa-redo"></i> Retry</button>' +
            '</div>';
        var btn = document.getElementById('pres-retry-btn');
        if (btn) btn.addEventListener('click', retryFn);
    }

    // ── PPTX generation via backend ───────────────────────────────────────────

    var _lastPptxUrl = null;

    function doPptx(customization, purchase, section) {
        showLoading(section, 'Generating PPTX Presentation');
        var reqBody = mapCustomization(customization);

        var controller = new AbortController();
        var timeout = setTimeout(function () { controller.abort(); }, 150000);

        fetch(API_BASE + '/api/generate-presentation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody),
            signal: controller.signal,
        })
            .then(function (res) {
                clearTimeout(timeout);
                if (!res.ok) {
                    return res.json().then(function (e) {
                        throw new Error(e.detail || 'Server error ' + res.status);
                    }).catch(function () { throw new Error('Server error ' + res.status); });
                }
                return res.json();
            })
            .then(function (data) {
                if (!data.success) throw new Error('Generation failed');
                _lastPptxUrl = data.download_url;
                showPptxReady(section, data.download_url, buildGensparkOutline(purchase), customization, purchase);
            })
            .catch(function (err) {
                clearTimeout(timeout);
                var msg = err.name === 'AbortError'
                    ? 'Request timed out (150 s). The backend may be busy — please retry.'
                    : (err.message || 'Unexpected error.');
                showError(section, msg, function () { doPptx(customization, purchase, section); });
            });
    }

    // ── Genspark design via backend ───────────────────────────────────────────

    function doGenspark(customization, purchase, section) {
        showGensparkLoading(section);
        var item = purchase.items[0];
        var loc = locationStr(customization);

        var payload = {
            title: (item.name || 'Business Blueprint') + ' — ' + (customization.businessTypeLabel || 'Business'),
            business_type_label: customization.businessTypeLabel || 'General Business',
            bundle_tier: customization.bundleTier || 'starter',
            capital: parseFloat(customization.capital) || 50000,
            location: loc,
            description: customization.description || '',
            outline: buildGensparkOutline(purchase),
        };

        var controller = new AbortController();
        var timeout = setTimeout(function () { controller.abort(); }, 150000);

        fetch(API_BASE + '/api/genspark-spark', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal,
        })
            .then(function (res) {
                clearTimeout(timeout);
                if (!res.ok) {
                    return res.json().then(function (e) {
                        throw new Error(e.detail || 'Genspark error ' + res.status);
                    }).catch(function () { throw new Error('Genspark error ' + res.status); });
                }
                return res.json();
            })
            .then(function (data) {
                if (!data.success || !data.spark_url) throw new Error('No presentation URL returned by Genspark');
                showGensparkReady(section, data.spark_url, customization, purchase, _lastPptxUrl);
            })
            .catch(function (err) {
                clearTimeout(timeout);
                var msg = err.name === 'AbortError'
                    ? 'Genspark request timed out. Please retry.'
                    : (err.message || 'Unexpected error.');
                showError(section, msg, function () { doGenspark(customization, purchase, section); });
            });
    }

    // ── Entry point ───────────────────────────────────────────────────────────

    function initPresentation() {
        var section = document.getElementById('presentation-body');
        if (!section) return;

        var purchase = null;
        try { purchase = JSON.parse(localStorage.getItem('lastPurchase') || 'null'); } catch (e) {}

        if (!purchase || !purchase.items || !purchase.items.length) {
            section.innerHTML = '<p style="color:var(--text-muted);font-size:0.88rem;">No purchase data found. Complete a purchase to generate a presentation.</p>';
            return;
        }

        var item = purchase.items[0];
        var cust = item.customization;

        if (!cust) {
            section.innerHTML = '<p style="color:var(--text-muted);font-size:0.88rem;">No business customization data found. Please fill in the business form when adding to cart.</p>';
            return;
        }

        var loc = locationStr(cust) || 'Philippines';

        section.innerHTML =
            '<div class="pres-intro">' +
            '  <div class="pres-intro-details">' +
            '    <div class="pres-detail-row"><span>Business</span><strong>' + (cust.businessTypeLabel || item.name) + '</strong></div>' +
            '    <div class="pres-detail-row"><span>Capital</span><strong>PHP ' + parseFloat(cust.capital || 0).toLocaleString() + '</strong></div>' +
            '    <div class="pres-detail-row"><span>Location</span><strong>' + loc + '</strong></div>' +
            '    <div class="pres-detail-row"><span>Slides</span><strong>11 professional slides</strong></div>' +
            '  </div>' +
            '  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;margin-top:1rem;">' +
            '    <button class="button" id="gen-pptx-btn"><i class="fas fa-file-powerpoint"></i> Generate PPTX</button>' +
            '    <button class="button" id="gen-genspark-btn" style="background:linear-gradient(135deg,#6366F1,#4F46E5);border-color:#6366F1;">' +
            '      <i class="fas fa-magic"></i> Design in Genspark AI' +
            '    </button>' +
            '  </div>' +
            '  <p class="pres-note"><i class="fas fa-clock"></i> PPTX: ~60–90 s via AI. Genspark: AI-designed slides — opens as a live web presentation.</p>' +
            '</div>';

        document.getElementById('gen-pptx-btn').addEventListener('click', function () {
            doPptx(cust, purchase, section);
        });

        document.getElementById('gen-genspark-btn').addEventListener('click', function () {
            doGenspark(cust, purchase, section);
        });
    }

    document.addEventListener('DOMContentLoaded', initPresentation);
})();
