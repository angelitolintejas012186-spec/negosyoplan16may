(function () {
    'use strict';

    const API_BASE = 'http://localhost:8000';

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

    function buildGensparkOutline(purchase) {
        var item = purchase.items[0];
        var c = item.customization || {};
        var loc = [
            c.location && c.location.city,
            c.location && c.location.region,
            'Philippines',
        ].filter(Boolean).join(', ');
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

    function showLoading(section) {
        section.innerHTML =
            '<div class="pres-loading">' +
            '  <div class="pres-spinner"><i class="fas fa-cog fa-spin"></i></div>' +
            '  <h4>Generating Your Presentation</h4>' +
            '  <p>AI is extracting blueprint details and building 11 professional slides.<br>This takes about 60–90 seconds — please wait.</p>' +
            '  <div class="pres-progress-bar"><div class="pres-progress-fill"></div></div>' +
            '</div>';
    }

    function showReady(section, downloadUrl, gensparkOutline) {
        section.innerHTML =
            '<div class="pres-ready">' +
            '  <div class="pres-ready-icon"><i class="fas fa-check-circle"></i></div>' +
            '  <h4>Your Presentation is Ready!</h4>' +
            '  <p>11-slide professional business blueprint created from your AI-generated blueprint data.</p>' +
            '  <div class="pres-actions">' +
            '    <a href="' + API_BASE + downloadUrl + '" class="button" download>' +
            '      <i class="fas fa-file-powerpoint"></i> Download PPTX' +
            '    </a>' +
            '    <button class="button secondary" id="genspark-btn">' +
            '      <i class="fas fa-magic"></i> Export to Genspark' +
            '    </button>' +
            '  </div>' +
            '  <p class="pres-note"><i class="fas fa-info-circle"></i> Compatible with PowerPoint, Google Slides, and Keynote. File saved for 24 hours.</p>' +
            '</div>';

        var gsBtn = document.getElementById('genspark-btn');
        if (gsBtn) {
            gsBtn.addEventListener('click', function () {
                navigator.clipboard.writeText(gensparkOutline).then(function () {
                    gsBtn.innerHTML = '<i class="fas fa-check"></i> Copied! Opening Genspark...';
                    gsBtn.disabled = true;
                    setTimeout(function () {
                        window.open('https://www.genspark.ai', '_blank', 'noopener');
                    }, 700);
                }).catch(function () {
                    window.open('https://www.genspark.ai', '_blank', 'noopener');
                });
            });
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

    function doGenerate(customization, purchase, section) {
        showLoading(section);
        var reqBody = mapCustomization(customization);
        var outline = buildGensparkOutline(purchase);

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
                    }).catch(function () {
                        throw new Error('Server error ' + res.status);
                    });
                }
                return res.json();
            })
            .then(function (data) {
                if (!data.success) throw new Error('Generation failed');
                showReady(section, data.download_url, outline);
            })
            .catch(function (err) {
                clearTimeout(timeout);
                var msg = err.name === 'AbortError'
                    ? 'Request timed out (150 s). The backend may be busy — please retry.'
                    : (err.message || 'Unexpected error.');
                showError(section, msg, function () { doGenerate(customization, purchase, section); });
            });
    }

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

        var loc = [
            cust.location && cust.location.city,
            cust.location && cust.location.region,
        ].filter(Boolean).join(', ') || 'Philippines';

        section.innerHTML =
            '<div class="pres-intro">' +
            '  <div class="pres-intro-details">' +
            '    <div class="pres-detail-row"><span>Business</span><strong>' + (cust.businessTypeLabel || item.name) + '</strong></div>' +
            '    <div class="pres-detail-row"><span>Capital</span><strong>PHP ' + parseFloat(cust.capital || 0).toLocaleString() + '</strong></div>' +
            '    <div class="pres-detail-row"><span>Location</span><strong>' + loc + '</strong></div>' +
            '    <div class="pres-detail-row"><span>Slides</span><strong>11 professional slides</strong></div>' +
            '  </div>' +
            '  <button class="button" id="gen-pres-btn"><i class="fas fa-file-powerpoint"></i> Generate Presentation</button>' +
            '  <p class="pres-note"><i class="fas fa-clock"></i> AI will analyze your business and build a full slide deck — takes about 60–90 seconds.</p>' +
            '</div>';

        document.getElementById('gen-pres-btn').addEventListener('click', function () {
            doGenerate(cust, purchase, section);
        });
    }

    document.addEventListener('DOMContentLoaded', initPresentation);
})();
