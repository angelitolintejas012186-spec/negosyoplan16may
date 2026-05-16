// ai-generator.js - AI Blueprint Generator (locally powered)

document.addEventListener('DOMContentLoaded', function() {
    initAIGenerator();
    loadBlueprintHistory();
});

function initAIGenerator() {
    const form = document.getElementById('ai-generator-form');
    const downloadButton = document.getElementById('download-blueprint');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            generateBlueprint();
        });
    }

    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            downloadLatestBlueprint();
        });
    }
}

function generateBlueprint() {
    const businessType = document.getElementById('business-type').value;
    const budget = parseInt(document.getElementById('budget').value, 10);
    const executionPeriod = parseInt(document.getElementById('execution-period').value, 10);
    const blueprintName = document.getElementById('blueprint-name').value.trim();
    const location = (document.getElementById('location') || {}).value?.trim() || 'Philippines';
    const businessGoal = (document.getElementById('business-goal') || {}).value?.trim() || 'Launch a successful business';

    if (!businessType || !budget || !executionPeriod || !blueprintName) {
        window.NegosyoPlan.showToast('Please fill in all required fields to generate your blueprint.', 'error');
        return;
    }

    const outputContainer = document.getElementById('ai-output-container');
    const outputEl = document.getElementById('ai-output');
    const outputTitle = document.getElementById('ai-output-title');

    if (outputTitle) outputTitle.textContent = 'Generating...';
    if (outputEl) outputEl.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;"><i class="fas fa-spinner fa-spin" style="font-size:1.5rem;color:var(--orange);"></i><br><br>Building your blueprint...</p>';
    if (outputContainer) outputContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(function() {
        const guidance = createGuidanceText(businessType, budget, executionPeriod, location, businessGoal);
        const blueprint = createBlueprintPackage(blueprintName, businessType, budget, executionPeriod, location, businessGoal, guidance);
        const generatedAt = new Date().toISOString();

        const blueprintRecord = {
            id: Date.now(),
            name: blueprintName,
            businessType,
            budget,
            executionPeriod,
            location,
            businessGoal,
            generatedAt,
            content: blueprint.html,
            summary: blueprint.summary,
            guidance
        };

        saveBlueprint(blueprintRecord);
        renderBlueprint(blueprintRecord);
        renderBlueprintHistory();

        const downloadBtn = document.getElementById('download-blueprint');
        if (downloadBtn) downloadBtn.style.display = 'inline-flex';
        window.NegosyoPlan.showToast('Blueprint generated successfully!', 'success');
    }, 600);
}

function createGuidanceText(businessType, budget, executionPeriod, location, businessGoal) {
    let focusPhrase = 'Build a strong foundation with market research and financial planning.';

    const bType = businessType.toLowerCase();
    if (bType.includes('food') || bType.includes('beverage') || bType.includes('restaurant') || bType.includes('cafe')) {
        focusPhrase = 'Focus on high-margin menu items, consistent quality, and strategic placement near foot traffic areas.';
    } else if (bType.includes('retail') || bType.includes('shop') || bType.includes('kiosk')) {
        focusPhrase = 'Optimize inventory turnover, supplier relationships, and a memorable in-store or online experience.';
    } else if (bType.includes('service') || bType.includes('consulting')) {
        focusPhrase = 'Position yourself as a trusted expert with a clear service promise, portfolio, and referral program.';
    } else if (bType.includes('e-commerce') || bType.includes('online') || bType.includes('digital')) {
        focusPhrase = 'Build a high-converting product page, fast checkout, and compelling social proof to drive sales.';
    } else if (bType.includes('health') || bType.includes('wellness') || bType.includes('fitness')) {
        focusPhrase = 'Leverage community trust and personal transformation stories to build a loyal customer base.';
    } else if (bType.includes('real estate') || bType.includes('rental')) {
        focusPhrase = 'Focus on location selection, legal documentation, and a strong tenant acquisition strategy.';
    } else if (bType.includes('tech') || bType.includes('saas') || bType.includes('technology')) {
        focusPhrase = 'Prioritize a clear value proposition, fast onboarding, and scalable infrastructure from day one.';
    }

    let budgetPhrase = 'Invest strategically to maximize returns on every peso spent.';
    if (budget < 30000) {
        budgetPhrase = 'With a lean budget, prioritize digital channels, minimal overhead, and a fast path to first revenue.';
    } else if (budget >= 30000 && budget < 100000) {
        budgetPhrase = 'Your mid-range budget allows for professional branding, solid systems, and a polished customer experience.';
    } else {
        budgetPhrase = 'With strong capital, you can invest in premium positioning, staffing, and high-impact marketing from launch.';
    }

    let periodPhrase = `Aim to reach your first milestone within ${executionPeriod} months with clear weekly checkpoints.`;
    if (executionPeriod <= 2) {
        periodPhrase = 'Move fast: validate your concept quickly, keep overheads minimal, and adjust based on early feedback.';
    } else if (executionPeriod <= 6) {
        periodPhrase = 'Build deep systems during the first 6 months while maintaining momentum with early marketing wins.';
    } else {
        periodPhrase = 'Use the extended runway to research thoroughly, build your team, and launch with maximum preparation.';
    }

    const locationPhrase = location
        ? `For your ${location} market, research local regulations, cultural preferences, and competition in your specific area.`
        : 'Research your local market carefully to understand customer preferences and competitive landscape.';

    const goalPhrase = businessGoal
        ? `Your goal: "${businessGoal}" — align every decision in this blueprint to serve this primary outcome.`
        : 'Keep your main business goal in mind as you work through each section of this blueprint.';

    return `${focusPhrase}\n${budgetPhrase}\n${periodPhrase}\n${locationPhrase}\n${goalPhrase}`;
}

function createBlueprintPackage(name, businessType, budget, executionPeriod, location, businessGoal, guidance) {
    const summary = `${name} is a ${businessType} business based in ${location || 'Philippines'}, with a startup budget of PHP ${budget.toLocaleString()} and a ${executionPeriod}-month execution timeline.`;

    const budgetBreakdown = {
        product: Math.round(budget * 0.25),
        marketing: Math.round(budget * 0.30),
        operations: Math.round(budget * 0.25),
        contingency: Math.round(budget * 0.20)
    };

    const months = [];
    const perPeriod = Math.ceil(executionPeriod / 3);
    months.push(`Months 1–${Math.min(perPeriod, executionPeriod)}: Research, registration, and brand setup.`);
    if (executionPeriod > perPeriod) {
        months.push(`Months ${perPeriod + 1}–${Math.min(perPeriod * 2, executionPeriod)}: Build product/service offering and start marketing.`);
    }
    if (executionPeriod > perPeriod * 2) {
        months.push(`Months ${perPeriod * 2 + 1}–${executionPeriod}: Open for business, gather feedback, and optimize operations.`);
    }

    const html = `
<div style="display:grid;gap:1.5rem;">

  <div style="background:var(--surface-soft);border:1px solid var(--border-soft);border-radius:var(--radius-sm);padding:1.25rem;">
    <h4 style="color:var(--orange);margin-bottom:0.75rem;font-size:0.95rem;"><i class="fas fa-file-alt" style="margin-right:0.4rem;"></i>Executive Summary</h4>
    <p style="font-size:0.88rem;line-height:1.75;">${summary} The business goal is: <strong>${businessGoal || 'Build a sustainable, profitable business'}</strong>. This blueprint provides a structured plan to achieve that goal with measurable milestones and practical guidance.</p>
  </div>

  <div style="background:var(--surface-soft);border:1px solid var(--border-soft);border-radius:var(--radius-sm);padding:1.25rem;">
    <h4 style="color:var(--orange);margin-bottom:0.75rem;font-size:0.95rem;"><i class="fas fa-lightbulb" style="margin-right:0.4rem;"></i>AI Guidance</h4>
    <p style="font-size:0.88rem;line-height:1.75;white-space:pre-line;">${guidance}</p>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
    <div style="background:var(--surface-soft);border:1px solid var(--border-soft);border-radius:var(--radius-sm);padding:1.25rem;">
      <h4 style="color:var(--orange);margin-bottom:0.75rem;font-size:0.95rem;"><i class="fas fa-wallet" style="margin-right:0.4rem;"></i>Budget Allocation</h4>
      <p style="font-size:0.83rem;"><strong>Total:</strong> PHP ${budget.toLocaleString()}</p>
      <p style="font-size:0.83rem;margin-top:0.5rem;">• Product/Service: <strong>PHP ${budgetBreakdown.product.toLocaleString()}</strong> (25%)</p>
      <p style="font-size:0.83rem;">• Marketing & Ads: <strong>PHP ${budgetBreakdown.marketing.toLocaleString()}</strong> (30%)</p>
      <p style="font-size:0.83rem;">• Operations: <strong>PHP ${budgetBreakdown.operations.toLocaleString()}</strong> (25%)</p>
      <p style="font-size:0.83rem;">• Contingency: <strong>PHP ${budgetBreakdown.contingency.toLocaleString()}</strong> (20%)</p>
    </div>
    <div style="background:var(--surface-soft);border:1px solid var(--border-soft);border-radius:var(--radius-sm);padding:1.25rem;">
      <h4 style="color:var(--orange);margin-bottom:0.75rem;font-size:0.95rem;"><i class="fas fa-calendar-alt" style="margin-right:0.4rem;"></i>Execution Timeline</h4>
      ${months.map(m => `<p style="font-size:0.83rem;margin-bottom:0.4rem;">• ${m}</p>`).join('')}
    </div>
  </div>

  <div style="background:var(--surface-soft);border:1px solid var(--border-soft);border-radius:var(--radius-sm);padding:1.25rem;">
    <h4 style="color:var(--orange);margin-bottom:0.75rem;font-size:0.95rem;"><i class="fas fa-th" style="margin-right:0.4rem;"></i>Business Model Canvas</h4>
    <p style="font-size:0.83rem;"><strong>Value Proposition:</strong> Solve a specific pain point for your ${location || ''} market with your ${businessType} offering.</p>
    <p style="font-size:0.83rem;margin-top:0.4rem;"><strong>Customer Segments:</strong> Local consumers, small businesses, and referral customers in your target area.</p>
    <p style="font-size:0.83rem;margin-top:0.4rem;"><strong>Channels:</strong> WhatsApp, social media (Facebook/Instagram), word-of-mouth, and your own website or store.</p>
    <p style="font-size:0.83rem;margin-top:0.4rem;"><strong>Revenue Streams:</strong> Direct sales, service fees, recurring subscriptions, or bundle/package pricing.</p>
    <p style="font-size:0.83rem;margin-top:0.4rem;"><strong>Key Resources:</strong> Your skills, network, tools, and initial inventory or service materials.</p>
  </div>

  <div style="background:var(--surface-soft);border:1px solid var(--border-soft);border-radius:var(--radius-sm);padding:1.25rem;">
    <h4 style="color:var(--orange);margin-bottom:0.75rem;font-size:0.95rem;"><i class="fas fa-exclamation-triangle" style="margin-right:0.4rem;"></i>Risk Assessment</h4>
    <p style="font-size:0.83rem;">• <strong>Cash flow risk:</strong> Monitor monthly expenses carefully; don't scale faster than revenue allows.</p>
    <p style="font-size:0.83rem;margin-top:0.4rem;">• <strong>Market risk:</strong> Validate demand before committing your full budget — start small and test first.</p>
    <p style="font-size:0.83rem;margin-top:0.4rem;">• <strong>Operational risk:</strong> Document your processes early so the business can run without you for short periods.</p>
    <p style="font-size:0.83rem;margin-top:0.4rem;">• <strong>Competition risk:</strong> Differentiate clearly and build customer loyalty through excellent service and communication.</p>
  </div>

  <div style="background:linear-gradient(135deg,var(--navy),var(--navy-mid));border-radius:var(--radius-sm);padding:1.25rem;color:#fff;">
    <h4 style="color:var(--amber);margin-bottom:0.75rem;font-size:0.95rem;"><i class="fas fa-forward" style="margin-right:0.4rem;"></i>Recommended Next Steps</h4>
    <p style="font-size:0.83rem;color:rgba(255,255,255,0.85);">1. Register your business name and secure necessary permits in ${location || 'your city'}.</p>
    <p style="font-size:0.83rem;color:rgba(255,255,255,0.85);margin-top:0.4rem;">2. Open a dedicated business bank account and separate personal finances.</p>
    <p style="font-size:0.83rem;color:rgba(255,255,255,0.85);margin-top:0.4rem;">3. Create your first product/service offer and validate it with 3–5 potential customers.</p>
    <p style="font-size:0.83rem;color:rgba(255,255,255,0.85);margin-top:0.4rem;">4. Set up your social media presence and begin building an audience before launch.</p>
    <p style="font-size:0.83rem;color:rgba(255,255,255,0.85);margin-top:0.4rem;">5. Track weekly revenue, expenses, and customers from day one for informed decisions.</p>
  </div>

</div>`;

    return { summary, html };
}

function saveBlueprint(record) {
    const history = JSON.parse(localStorage.getItem('blueprintHistory') || '[]');
    history.unshift(record);
    localStorage.setItem('blueprintHistory', JSON.stringify(history.slice(0, 10)));
}

function loadBlueprintHistory() {
    const history = JSON.parse(localStorage.getItem('blueprintHistory') || '[]');
    if (history.length > 0) {
        renderBlueprint(history[0]);
        renderBlueprintHistory();
        const downloadBtn = document.getElementById('download-blueprint');
        if (downloadBtn) downloadBtn.style.display = 'inline-flex';
    }
}

function renderBlueprint(record) {
    const output = document.getElementById('ai-output');
    const title = document.getElementById('ai-output-title');
    if (!output || !title) return;
    title.textContent = record.name + ' Blueprint';
    output.innerHTML = record.content;
}

function renderBlueprintHistory() {
    const history = JSON.parse(localStorage.getItem('blueprintHistory') || '[]');
    const historyContainer = document.getElementById('history-list');
    if (!historyContainer) return;

    if (history.length === 0) {
        historyContainer.innerHTML = '<p style="color:var(--text-muted);font-size:0.88rem;">No blueprints generated yet.</p>';
        return;
    }

    historyContainer.innerHTML = history.map(item => `
        <article class="history-card">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
                <div>
                    <h4 style="font-size:0.95rem;margin-bottom:0.3rem;">${item.name}</h4>
                    <p style="font-size:0.82rem;color:var(--text-muted);">${item.businessType} &bull; ${item.location || 'Philippines'}</p>
                    <p style="font-size:0.78rem;color:var(--text-muted);margin-top:0.2rem;">${new Date(item.generatedAt).toLocaleDateString()}</p>
                </div>
                <button class="button secondary" style="flex-shrink:0;font-size:0.82rem;padding:0.5rem 0.9rem;" onclick="loadBlueprintFromHistory(${item.id})">View</button>
            </div>
        </article>
    `).join('');
}

function loadBlueprintFromHistory(id) {
    const history = JSON.parse(localStorage.getItem('blueprintHistory') || '[]');
    const record = history.find(item => item.id === id);
    if (record) {
        renderBlueprint(record);
        const downloadBtn = document.getElementById('download-blueprint');
        if (downloadBtn) downloadBtn.style.display = 'inline-flex';
        document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
    }
}

function downloadLatestBlueprint() {
    const history = JSON.parse(localStorage.getItem('blueprintHistory') || '[]');
    if (!history.length) {
        window.NegosyoPlan.showToast('Please generate a blueprint first.', 'error');
        return;
    }

    const latest = history[0];
    const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${latest.name} Business Blueprint - Negosyo Plan</title>
<style>
body{font-family:Arial,sans-serif;padding:2.5rem;background:#FFF8F2;color:#0F1F3D;max-width:860px;margin:0 auto;}
h1{color:#E8420A;font-size:1.8rem;border-bottom:3px solid #E8420A;padding-bottom:0.75rem;margin-bottom:0.5rem;}
h4{color:#E8420A;margin-top:1.5rem;margin-bottom:0.5rem;}
p{line-height:1.8;font-size:0.9rem;color:#333;margin-bottom:0.4rem;}
.badge{display:inline-block;background:#F5A500;color:#0F1F3D;padding:0.3rem 0.8rem;border-radius:999px;font-size:0.75rem;font-weight:700;margin-bottom:1.5rem;}
.section{background:#fff;border:1px solid #eee;border-radius:10px;padding:1.25rem;margin-bottom:1rem;}
footer{margin-top:3rem;font-size:0.78rem;color:#999;border-top:1px solid #ddd;padding-top:1rem;}
</style>
</head>
<body>
<h1>${latest.name}</h1>
<span class="badge">AI Blueprint by Negosyo Plan</span>
<p><strong>Business Type:</strong> ${latest.businessType} &nbsp;|&nbsp; <strong>Location:</strong> ${latest.location || 'Philippines'} &nbsp;|&nbsp; <strong>Budget:</strong> PHP ${latest.budget?.toLocaleString()}</p>
<p><strong>Goal:</strong> ${latest.businessGoal || 'Build a successful business'} &nbsp;|&nbsp; <strong>Timeline:</strong> ${latest.executionPeriod} months</p>
<p><strong>Generated:</strong> ${new Date(latest.generatedAt).toLocaleString()}</p>
<div class="section">${latest.content}</div>
<footer>&copy; 2026 Negosyo Plan. All rights reserved. This document is for personal use only.</footer>
</body>
</html>`;

    const blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = latest.name.replace(/\s+/g, '_').toLowerCase() + '_blueprint.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    window.NegosyoPlan.showToast('Blueprint downloaded!', 'success');
}
