/* genspark-export.js — Genspark AI Workspace 4.0 integration for blueprint delivery */
(function () {
    'use strict';

    var GENSPARK_URL = 'https://www.genspark.ai/';

    /* ── Build the rich prompt sent to Genspark ── */
    function buildPrompt(productName, customization) {
        var bt        = (customization && customization.businessType)      || 'general_business';
        var btLabel   = (customization && customization.businessTypeLabel) || productName || 'Your Business';
        var capital   = customization && customization.capital ? Number(customization.capital) : 0;
        var loc       = (customization && customization.location) || {};
        var desc      = (customization && customization.description) || '';
        var suppliers = (customization && customization.suppliers || [])
                            .map(function (s) { return s.name || s; })
                            .filter(Boolean).join(', ');
        var bundleTier = (customization && customization.bundleTier) || 'starter';
        var locationStr = [loc.city, loc.region, loc.country || 'Philippines']
                            .filter(Boolean).join(', ') || 'Philippines';

        var tierMap = { starter: 'Starter Bundle', founder: 'Founder Bundle',
                        complete: 'Complete Set Bundle', custom: 'Custom Bundle' };
        var tierLabel = tierMap[bundleTier] || productName;

        var lines = [
            '# NEGOSYO PLAN — PROFESSIONAL BUSINESS BLUEPRINT',
            '> Created with Genspark AI Workspace 4.0 | Negosyo Plan Platform',
            '',
            '## Business Details',
            '| Field | Value |',
            '|---|---|',
            '| Business Type | ' + btLabel + ' |',
            '| Bundle Package | ' + tierLabel + ' |',
            '| Starting Capital | PHP ' + capital.toLocaleString() + ' |',
            '| Business Location | ' + locationStr + ' |',
            suppliers ? '| Key Suppliers | ' + suppliers + ' |' : '',
            desc      ? '| Description | ' + desc + ' |' : '',
            '',
            '---',
            '',
            '## Create a Complete Professional Business Blueprint Document',
            'Design a beautifully formatted, investor-ready business blueprint document with these 12 sections:',
            '',
            '### 1. Cover Page',
            'Business name, type (' + btLabel + '), capital (PHP ' + capital.toLocaleString() + '), location (' + locationStr + '), date, and Negosyo Plan branding. Use navy (#0F1F3D) header with orange (#E8420A) accent.',
            '',
            '### 2. Executive Summary',
            'Business concept, unique value proposition, target revenue model, key success factors, and one-paragraph investor pitch.',
            '',
            '### 3. Business Overview',
            'Products/services, pricing strategy, business model canvas, competitive advantage.',
            '',
            '### 4. Market Analysis',
            'Target customer profile, market demand in ' + locationStr + ', competitor landscape, market opportunity sizing.',
            '',
            '### 5. Financial Projections',
            'Startup costs breakdown table, 6-month revenue forecast (Month 1–6), gross margin, break-even analysis, ROI timeline. Use Philippine Peso (₱).',
            '',
            '### 6. Operations Plan',
            'Daily management checklist (opening, midday, closing), staffing plan (owner + staff roles), workflows, KPIs to track weekly.',
            '',
            '### 7. Marketing Strategy',
            'Traditional tactics (tarpaulin, leaflets, loyalty cards, grand opening promo) AND digital strategy (Facebook Business Page posting schedule, TikTok, Shopee/Lazada setup, Google My Business). Include PHP 50/day Facebook ad setup.',
            '',
            '### 8. SWOT Analysis',
            'Strengths, Weaknesses, Opportunities, Threats in a 2×2 grid with at least 4 points each. Specific to ' + btLabel + ' in ' + locationStr + '.',
            '',
            '### 9. Risk Management',
            'Top 5 business risks with probability (High/Medium/Low), impact rating, and specific mitigation action for each.',
            '',
            '### 10. Implementation Timeline',
            'Month-by-month action plan for Months 1–6: pre-launch, soft launch, growth, stabilization. Include budget per phase.',
            '',
            '### 11. Permits & Legal Requirements (Philippines)',
            'Step-by-step registration guide: DTI Business Name Registration, Barangay Clearance, Mayor\'s Business Permit, BIR Certificate of Registration, and other industry-specific permits. Include estimated costs and processing time.',
            '',
            '### 12. Equipment & Supplier Directory',
            suppliers
                ? 'Equipment list with costs. Supplier contacts: ' + suppliers + '. Include backup supplier recommendations.'
                : 'Equipment list with costs, recommended national and local suppliers with contact details, sourcing tips to reduce startup cost.',
            '',
            '---',
            '',
            '## Design Specifications for Genspark',
            '- **Brand Colors:** Orange #E8420A (accent/headings), Navy #0F1F3D (header/text), Amber #F5A500 (highlights)',
            '- **Style:** Professional investor-grade document — clean, modern, data-rich',
            '- **Currency:** Philippine Peso (₱ / PHP) for all money values',
            '- **Audience:** OFWs and Filipino entrepreneurs ready to launch a business',
            '- **Format:** Include tables, checklists, visual charts, and callout boxes',
            '- **Tone:** Practical, actionable, encouraging — like a mentor guiding a first-time entrepreneur',
        ].filter(function (l) { return l !== null && l !== undefined; }).join('\n');

        return lines;
    }

    /* ── 3-step instruction modal (shown when clipboard fails) ── */
    function showModal(productName, prompt) {
        var existing = document.getElementById('gs-export-modal');
        if (existing) existing.remove();

        var overlay = document.createElement('div');
        overlay.id  = 'gs-export-modal';
        overlay.className = 'gs-overlay';
        overlay.innerHTML =
            '<div class="gs-modal" role="dialog" aria-modal="true" aria-labelledby="gs-modal-title">' +
              '<div class="gs-modal-head">' +
                '<div class="gs-logo-row">' +
                  '<span class="gs-logo-icon"><i class="fas fa-sparkles"></i></span>' +
                  '<div>' +
                    '<h3 id="gs-modal-title">Open in Genspark Workspace</h3>' +
                    '<p class="gs-sub">' + productName + ' blueprint ready</p>' +
                  '</div>' +
                '</div>' +
                '<button class="gs-close" id="gs-close" aria-label="Close">&times;</button>' +
              '</div>' +

              '<div class="gs-steps-row">' +
                '<div class="gs-step"><div class="gs-num">1</div><strong>Copy</strong><span>Click the button below</span></div>' +
                '<div class="gs-arrow">›</div>' +
                '<div class="gs-step"><div class="gs-num">2</div><strong>Open</strong><span>Genspark Workspace</span></div>' +
                '<div class="gs-arrow">›</div>' +
                '<div class="gs-step"><div class="gs-num">3</div><strong>Paste &amp; Generate</strong><span>Get your blueprint</span></div>' +
              '</div>' +

              '<div class="gs-prompt-wrap">' +
                '<textarea class="gs-prompt-ta" id="gs-prompt-ta" readonly>' + _escHtml(prompt) + '</textarea>' +
              '</div>' +

              '<div class="gs-modal-footer">' +
                '<button class="button gs-copy-btn" id="gs-copy-btn"><i class="fas fa-copy"></i> Copy Prompt</button>' +
                '<a href="' + GENSPARK_URL + '" target="_blank" rel="noopener" class="button gs-open-btn"><i class="fas fa-arrow-up-right-from-square"></i> Open Genspark</a>' +
                '<button class="button secondary" id="gs-cancel-btn"><i class="fas fa-times"></i> Close</button>' +
              '</div>' +
            '</div>';

        document.body.appendChild(overlay);

        var copyBtn = overlay.querySelector('#gs-copy-btn');
        var ta = overlay.querySelector('#gs-prompt-ta');

        copyBtn.addEventListener('click', function () {
            navigator.clipboard.writeText(prompt).then(function () {
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.disabled = true;
            }).catch(function () {
                ta.select(); document.execCommand('copy');
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.disabled = true;
            });
        });

        function close() { var m = document.getElementById('gs-export-modal'); if (m) m.remove(); }
        overlay.querySelector('#gs-close').addEventListener('click', close);
        overlay.querySelector('#gs-cancel-btn').addEventListener('click', close);
        overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    }

    /* ── Main entry point ── */
    function openInGenspark(productName, customization) {
        var prompt = buildPrompt(productName, customization || {});

        navigator.clipboard.writeText(prompt).then(function () {
            var toast = window.NegosyoPlan && window.NegosyoPlan.showToast;
            if (toast) toast('Blueprint prompt copied! Opening Genspark Workspace…', 'success');
            setTimeout(function () {
                window.open(GENSPARK_URL, '_blank', 'noopener');
            }, 700);
        }).catch(function () {
            showModal(productName, prompt);
        });
    }

    function _escHtml(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    window.GensparkExport = { openInGenspark: openInGenspark, buildPrompt: buildPrompt };
})();
