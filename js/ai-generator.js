// ai-generator.js - AI Blueprint Generator simulation

// DeepSeek provides adaptive business advice based on the user's inputs.
// Genspark structures that advice into a reusable business blueprint template.

document.addEventListener('DOMContentLoaded', function() {
    initAIGenerator();
    loadBlueprintHistory();
});

function initAIGenerator() {
    const form = document.getElementById('ai-generator-form');
    const downloadButton = document.getElementById('download-blueprint');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
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

    if (!businessType || !budget || !executionPeriod || !blueprintName) {
        alert('Please complete every field to generate your blueprint.');
        return;
    }

    const deepSeekText = createDeepSeekText(businessType, budget, executionPeriod);
    const blueprint = createGensparkBlueprint(blueprintName, businessType, budget, executionPeriod, deepSeekText);
    const generatedAt = new Date().toISOString();

    const blueprintRecord = {
        id: Date.now(),
        name: blueprintName,
        businessType,
        budget,
        executionPeriod,
        generatedAt,
        content: blueprint.html,
        summary: blueprint.summary,
        deepSeekText
    };

    saveBlueprint(blueprintRecord);
    renderBlueprint(blueprintRecord);
    renderBlueprintHistory();

    document.getElementById('download-blueprint').style.display = 'inline-flex';
}

function createDeepSeekText(businessType, budget, executionPeriod) {
    let focusPhrase = 'Build a strong foundation with market research and financial planning.';

    if (businessType.includes('food') || businessType.includes('café') || businessType.includes('restaurant')) {
        focusPhrase = 'Focus on high-margin menu items, delivery partnerships, and location-based demand.';
    } else if (businessType.includes('shop') || businessType.includes('retail')) {
        focusPhrase = 'Optimize inventory turnover, customer loyalty, and product sourcing for rapid growth.';
    } else if (businessType.includes('services') || businessType.includes('consulting')) {
        focusPhrase = 'Position yourself as a trusted expert with a clear service promise and referral plan.';
    } else if (businessType.includes('online') || businessType.includes('e-commerce')) {
        focusPhrase = 'Create an efficient digital funnel, fast checkout, and compelling product storytelling.';
    }

    let budgetPhrase = 'Use your budget to secure the strongest returns with practical investments.';
    if (budget < 150) {
        budgetPhrase = 'Prioritize affordable digital tools, lean operations, and marketing strategies that require lower upfront capital.';
    } else if (budget >= 150 && budget < 250) {
        budgetPhrase = 'Invest in professional branding, solid systems, and a polished customer experience.';
    } else {
        budgetPhrase = 'Scale quickly with high-impact operations, hiring support, and premium market positioning.';
    }

    let periodPhrase = `Aim to launch within ${executionPeriod} months with clear milestones.`;
    if (executionPeriod <= 2) {
        periodPhrase = 'Move fast: validate your concept quickly and keep overheads low.';
    } else if (executionPeriod <= 6) {
        periodPhrase = 'Develop deeper systems while maintaining customer momentum during the first six months.';
    }

    return `DeepSeek guidance for ${businessType}:
${focusPhrase}
${budgetPhrase}
${periodPhrase}`;
}

function createGensparkBlueprint(name, businessType, budget, executionPeriod, deepSeekText) {
    const summary = `This blueprint is designed for ${name}, a ${businessType} business with a budget of ${budget} AED and a ${executionPeriod}-month execution plan.`;
    const executiveSummary = `Executive Summary: ${summary} The plan focuses on practical steps, financial clarity, and measurable progress.`;

    const businessModelCanvas = `Business Model Canvas:\n- Customer Segments: OFWs, startup founders, local small business owners.\n- Value Proposition: Fast, easy, proven business blueprints.\n- Channels: WhatsApp, online store, email, social media.\n- Revenue Streams: PDF bundle sales, premium consulting add-ons.`;

    const budgetAllocation = `Budget Allocation:\n- Product Development: ${Math.round(budget * 0.25)} AED\n- Marketing & Ads: ${Math.round(budget * 0.35)} AED\n- Operations: ${Math.round(budget * 0.2)} AED\n- Contingency: ${Math.round(budget * 0.2)} AED`;

    const executionTimeline = `Execution Timeline:\n- Month 1: Research, positioning, branding.\n- Month 2: Build offerings, set pricing, launch marketing.\n- Month 3: Open sales, collect feedback, refine operations.\n- Month 4+: Scale through repeatable systems.`;

    const riskAssessment = `Risk Assessment:\n- Cash flow pressure if sales start slow.\n- Operational overload without clear systems.\n- Customer trust risk when communication is not consistent.`;

    const nextSteps = `Next Steps:\n1. Validate demand with an initial offer.\n2. Build the first sales-ready PDF package.\n3. Launch with targeted outreach.\n4. Monitor results and adjust monthly.`;

    const html = `
<section class="generator-output">
  <h3>${name} - Business Blueprint</h3>
  <section>
    <h4>Executive Summary</h4>
    <p>${executiveSummary}</p>
  </section>
  <section>
    <h4>Business Model Canvas</h4>
    <p>${businessModelCanvas.replace(/\n/g, '<br>')}</p>
  </section>
  <section>
    <h4>Budget Allocation</h4>
    <p>${budgetAllocation.replace(/\n/g, '<br>')}</p>
  </section>
  <section>
    <h4>Execution Timeline</h4>
    <p>${executionTimeline.replace(/\n/g, '<br>')}</p>
  </section>
  <section>
    <h4>Risk Assessment</h4>
    <p>${riskAssessment.replace(/\n/g, '<br>')}</p>
  </section>
  <section>
    <h4>Next Steps</h4>
    <p>${nextSteps.replace(/\n/g, '<br>')}</p>
  </section>
  <section>
    <h4>DeepSeek Insight</h4>
    <p>${deepSeekText.replace(/\n/g, '<br>')}</p>
  </section>
</section>`;

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
        document.getElementById('download-blueprint').style.display = 'inline-flex';
    }
}

function renderBlueprint(record) {
    const output = document.getElementById('ai-output');
    const title = document.getElementById('ai-output-title');
    if (!output || !title) return;

    title.textContent = `${record.name} Blueprint`;
    output.innerHTML = record.content;
}

function renderBlueprintHistory() {
    const history = JSON.parse(localStorage.getItem('blueprintHistory') || '[]');
    const historyContainer = document.getElementById('history-list');

    if (!historyContainer) return;

    if (history.length === 0) {
        historyContainer.innerHTML = '<p>No blueprints generated yet.</p>';
        return;
    }

    historyContainer.innerHTML = history.map(item => `
        <article class="history-card">
            <h4>${item.name}</h4>
            <p><strong>Business type:</strong> ${item.businessType}</p>
            <p><strong>Generated:</strong> ${new Date(item.generatedAt).toLocaleDateString()}</p>
            <button class="button secondary" onclick="loadBlueprintFromHistory(${item.id})">View Blueprint</button>
        </article>
    `).join('');
}

function loadBlueprintFromHistory(id) {
    const history = JSON.parse(localStorage.getItem('blueprintHistory') || '[]');
    const record = history.find(item => item.id === id);
    if (record) {
        renderBlueprint(record);
        document.getElementById('download-blueprint').style.display = 'inline-flex';
    }
}

function downloadLatestBlueprint() {
    const history = JSON.parse(localStorage.getItem('blueprintHistory') || '[]');
    if (!history.length) {
        alert('Please generate a blueprint first.');
        return;
    }

    const latest = history[0];
    const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${latest.name} Business Blueprint</title>
<style>body{font-family:Arial,sans-serif;padding:2rem;background:#FFF8EB;color:#2C3E50;}h1{color:#FF9951;}section{margin-bottom:1.5rem;}h2{color:#FF9951;}p{line-height:1.8;}</style>
</head>
<body>
<h1>${latest.name} Business Blueprint</h1>
${latest.content}
</body>
</html>`;

    const blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${latest.name.replace(/\s+/g, '_').toLowerCase()}_blueprint.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
