// downloads.js - Downloads page and account downloads functionality

const FREE_RESOURCES = [
    {
        id: 'free-1',
        title: 'Business Idea Validation Checklist',
        description: 'A 10-point checklist to quickly assess whether your business idea is ready to launch.',
        icon: 'fas fa-clipboard-check'
    },
    {
        id: 'free-2',
        title: 'OFW Entrepreneur Starter Guide',
        description: 'Essential tips for overseas Filipino workers planning to invest in a business back home.',
        icon: 'fas fa-globe-asia'
    },
    {
        id: 'free-3',
        title: 'Filipino Market Research Template',
        description: 'Research demand for your product or service with this structured market analysis template.',
        icon: 'fas fa-chart-bar'
    },
    {
        id: 'free-4',
        title: 'Startup Budget Planner',
        description: 'A simple budget spreadsheet to plan your startup costs and monthly operating expenses.',
        icon: 'fas fa-calculator'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    loadPurchasedProducts();
    loadFreeDownloads();
});

function loadPurchasedProducts() {
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const downloadList = document.getElementById('download-list');
    const noDownloads = document.getElementById('no-downloads');

    if (!downloadList) return;

    const downloadedItems = [];
    purchases.forEach(purchase => {
        if (purchase.items) {
            purchase.items.forEach(item => {
                downloadedItems.push({
                    ...item,
                    purchaseDate: purchase.timestamp,
                    orderId: purchase.id,
                    token: purchase.token
                });
            });
        }
    });

    if (downloadedItems.length === 0) {
        downloadList.style.display = 'none';
        if (noDownloads) noDownloads.style.display = 'flex';
        return;
    }

    if (noDownloads) noDownloads.style.display = 'none';
    downloadList.style.display = 'block';

    downloadList.innerHTML = downloadedItems.map(item => `
        <div class="download-item-card">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div>
                <h4 style="font-size:0.95rem;font-weight:700;color:var(--navy);margin-bottom:0.25rem;">${item.name}</h4>
                <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.15rem;"><i class="fas fa-calendar" style="margin-right:0.3rem;"></i>Purchased: ${new Date(item.purchaseDate).toLocaleDateString()}</p>
                <p style="font-size:0.78rem;color:var(--text-muted);">Qty: ${item.quantity} &nbsp;&bull;&nbsp; Order #${item.orderId}</p>
            </div>
            <button type="button" class="button" onclick="downloadProduct('${escStr(item.name)}')">
                <i class="fas fa-download"></i> Download
            </button>
        </div>
    `).join('');
}

function loadFreeDownloads() {
    const container = document.getElementById('free-downloads');
    if (!container) return;
    container.innerHTML = FREE_RESOURCES.map(resource => `
        <div class="free-download-card">
            <div class="free-download-icon"><i class="${resource.icon}"></i></div>
            <div style="flex:1;">
                <h4 style="font-size:0.9rem;font-weight:700;color:var(--navy);margin-bottom:0.2rem;">${resource.title}</h4>
                <p style="font-size:0.8rem;color:var(--text-muted);">${resource.description}</p>
            </div>
            <button type="button" class="button secondary" style="flex-shrink:0;" onclick="downloadFreeResource('${resource.id}', '${escStr(resource.title)}')">
                <i class="fas fa-download"></i> Free
            </button>
        </div>
    `).join('');
}

function escStr(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function downloadProduct(productName) {
    const safeName = productName.replace(/\s+/g, '_').toLowerCase();
    const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${productName} - Negosyo Plan</title>
<style>
body{font-family:Arial,sans-serif;padding:2.5rem;background:#FFF8F2;color:#0F1F3D;max-width:820px;margin:0 auto;}
h1{color:#E8420A;font-size:2rem;border-bottom:3px solid #E8420A;padding-bottom:0.75rem;margin-bottom:1.5rem;}
h2{color:#0F1F3D;font-size:1.15rem;margin-top:2rem;margin-bottom:0.5rem;}
p{line-height:1.85;color:#333;margin-bottom:0.75rem;}
.badge{display:inline-block;background:#F5A500;color:#0F1F3D;padding:0.3rem 0.8rem;border-radius:999px;font-size:0.78rem;font-weight:700;margin-bottom:1.5rem;}
.checklist{list-style:none;padding:0;}
.checklist li{padding:0.5rem 0;border-bottom:1px solid #eee;font-size:0.9rem;}
.checklist li::before{content:"✓ ";color:#E8420A;font-weight:700;}
footer{margin-top:3rem;padding-top:1rem;border-top:1px solid #ddd;font-size:0.8rem;color:#999;}
</style>
</head>
<body>
<h1>Negosyo Plan<br>${productName}</h1>
<span class="badge">Blueprint OS Certified</span>
<h2>Executive Summary</h2>
<p>This <strong>${productName}</strong> is your practical guide to launching, growing, and managing your business with confidence. Built for OFWs and entrepreneurs in the Philippines and abroad, every section is designed to be immediately actionable.</p>
<h2>What's Inside</h2>
<ul class="checklist">
<li>Business planning templates ready for immediate use</li>
<li>Financial projection models with built-in calculations</li>
<li>Market research frameworks for your local or target market</li>
<li>Operations setup and launch checklists</li>
<li>Growth and scaling strategies and KPI trackers</li>
<li>Brand positioning and customer acquisition guide</li>
</ul>
<h2>How to Use This Blueprint</h2>
<p>Start with the Executive Summary to understand the overall strategy. Then work through each section in order, completing the templates and worksheets as you go. Customize every framework to your specific business type and market.</p>
<h2>Methodology: Blueprint OS</h2>
<p><strong>Diagnose →</strong> Understand your market, competition, and customers.<br>
<strong>Design →</strong> Build your business model, pricing, and team structure.<br>
<strong>Validate →</strong> Test your assumptions before full investment.<br>
<strong>Launch →</strong> Execute your go-to-market plan with confidence.<br>
<strong>Scale →</strong> Systemize operations and grow revenue sustainably.</p>
<h2>Support & Contact</h2>
<p>Need help with your plan?<br>
&bull; WhatsApp: wa.me/1234567890<br>
&bull; Email: support@negosyoplan.com<br>
&bull; Website: negosyoplan.com/contact.html</p>
<footer>&copy; 2026 Negosyo Plan. All rights reserved. This document is licensed for personal use only. Redistribution is prohibited.</footer>
</body>
</html>`;

    const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = safeName + '_blueprint.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (window.NegosyoPlan) window.NegosyoPlan.showToast(productName + ' download started!', 'success');
}

function downloadFreeResource(id, title) {
    downloadProduct(title);
}

function loadAccountDownloads() {
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const accountDownloads = document.getElementById('account-downloads');
    if (!accountDownloads) return;

    const items = [];
    purchases.forEach(purchase => {
        if (purchase.items) {
            purchase.items.forEach(item => items.push({ ...item, purchaseDate: purchase.timestamp }));
        }
    });

    if (items.length === 0) {
        accountDownloads.innerHTML = '<p style="color:var(--text-muted);font-size:0.88rem;">No downloads yet. <a href="shop.html" style="color:var(--orange);font-weight:600;">Browse our bundles.</a></p>';
        return;
    }

    accountDownloads.innerHTML = items.map(item => `
        <div class="download-btn-row">
            <div class="file-info">
                <h4>${item.name}</h4>
                <p>Purchased ${new Date(item.purchaseDate).toLocaleDateString()}</p>
            </div>
            <button type="button" class="button" style="flex-shrink:0;" onclick="downloadProduct('${escStr(item.name)}')">
                <i class="fas fa-download"></i>
            </button>
        </div>
    `).join('');
}
