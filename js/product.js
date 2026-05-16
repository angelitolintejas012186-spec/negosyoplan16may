// product.js - Product detail page functionality

const PRODUCTS = [
    {
        id: 1,
        name: 'Starter Bundle',
        price: 1900,
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'The perfect starting point for new entrepreneurs. This bundle gives you a practical business plan template, financial projection model, and a complete market analysis guide — everything you need to confidently launch your first venture.',
        rating: 4.5,
        reviews: 120,
        features: [
            { icon: 'fas fa-file-alt', text: 'Business plan template (30+ pages)' },
            { icon: 'fas fa-chart-line', text: 'Financial projection spreadsheet (12 months)' },
            { icon: 'fas fa-search', text: 'Market analysis and competitor guide' },
            { icon: 'fas fa-tasks', text: 'Launch checklist and milestone tracker' },
            { icon: 'fas fa-lightbulb', text: 'Business idea validation framework (SWOT)' }
        ],
        methodology: [
            { step: 'Diagnose', desc: 'Identify your market, audience, and competition.' },
            { step: 'Design', desc: 'Plan your business model, pricing, and structure.' },
            { step: 'Validate', desc: 'Test your idea before committing full capital.' }
        ]
    },
    {
        id: 2,
        name: 'Founder Bundle',
        price: 2600,
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Built for serious entrepreneurs ready to scale. The Founder Bundle includes complete strategy, marketing automation, investor pitch materials, and operational frameworks designed for businesses in growth mode.',
        rating: 5.0,
        reviews: 85,
        features: [
            { icon: 'fas fa-bullseye', text: 'Advanced business model canvas' },
            { icon: 'fas fa-ad', text: 'Full marketing and social media strategy' },
            { icon: 'fas fa-handshake', text: 'Investor pitch deck framework' },
            { icon: 'fas fa-cogs', text: 'Operational SOP and process templates' },
            { icon: 'fas fa-users', text: 'Team structure and hiring guide' },
            { icon: 'fas fa-trophy', text: 'Revenue growth and KPI tracking tools' }
        ],
        methodology: [
            { step: 'Diagnose', desc: 'Deep-dive market and competitive intelligence.' },
            { step: 'Design', desc: 'Build scalable systems and revenue models.' },
            { step: 'Launch', desc: 'Go-to-market playbook and customer acquisition.' },
            { step: 'Scale', desc: 'Systemize operations for repeatable growth.' }
        ]
    },
    {
        id: 3,
        name: 'Complete Set Bundle',
        price: 3500,
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'The most comprehensive business planning kit available. The Complete Set includes every resource from both Starter and Founder bundles, plus exclusive growth playbooks, revenue models, and a full business launch system.',
        rating: 4.8,
        reviews: 200,
        features: [
            { icon: 'fas fa-layer-group', text: 'All Starter and Founder bundle resources' },
            { icon: 'fas fa-rocket', text: 'Complete business launch system' },
            { icon: 'fas fa-chart-bar', text: 'Revenue projection and growth model' },
            { icon: 'fas fa-map', text: 'Market penetration and scaling playbook' },
            { icon: 'fas fa-balance-scale', text: 'Legal and compliance checklist' },
            { icon: 'fas fa-star', text: 'Brand positioning and identity framework' },
            { icon: 'fas fa-phone', text: 'Customer service and retention system' }
        ],
        methodology: [
            { step: 'Diagnose', desc: 'Full market, financial, and competitive analysis.' },
            { step: 'Design', desc: 'Build a complete, scalable business architecture.' },
            { step: 'Validate', desc: 'Proof-of-concept and demand testing framework.' },
            { step: 'Launch', desc: 'Coordinated go-to-market execution plan.' },
            { step: 'Scale', desc: 'Revenue scaling and team growth systems.' }
        ]
    },
    {
        id: 4,
        name: 'Custom Bundle',
        price: 4600,
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'A fully personalized business blueprint built specifically for your industry, city, and capital level. After submitting your request, our team creates a custom planning document tailored to your exact situation.',
        rating: 4.9,
        reviews: 65,
        features: [
            { icon: 'fas fa-user-cog', text: 'Personalized industry-specific roadmap' },
            { icon: 'fas fa-map-marker-alt', text: 'Location-aware market research (your city)' },
            { icon: 'fas fa-money-bill-wave', text: 'Custom financial model for your budget' },
            { icon: 'fas fa-paint-brush', text: 'Brand identity and positioning guide' },
            { icon: 'fas fa-comments', text: 'One-on-one consultation via WhatsApp' },
            { icon: 'fas fa-sync', text: 'One free revision within 30 days' }
        ],
        methodology: [
            { step: 'Design', desc: 'Fully tailored business model for your context.' },
            { step: 'Validate', desc: 'Custom demand validation for your market.' },
            { step: 'Launch', desc: 'Step-by-step launch plan for your timeline.' },
            { step: 'Scale', desc: 'Growth blueprint aligned to your goals.' }
        ]
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'), 10);
    if (productId) {
        loadProductDetails(productId);
    } else {
        const container = document.getElementById('product-detail');
        if (container) container.innerHTML = '<p style="color:var(--text-muted);">Product not found. <a href="shop.html" style="color:var(--orange);">Browse all products.</a></p>';
    }
});

function loadProductDetails(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
        const container = document.getElementById('product-detail');
        if (container) container.innerHTML = '<p style="color:var(--text-muted);">Product not found. <a href="shop.html" style="color:var(--orange);">Browse all products.</a></p>';
        return;
    }

    const breadcrumb = document.getElementById('product-name-breadcrumb');
    if (breadcrumb) breadcrumb.textContent = product.name;

    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = product.name + ' - Negosyo Plan';

    const productImg = document.getElementById('product-img');
    if (productImg) { productImg.src = product.image; productImg.alt = product.name; }

    const titleH = document.getElementById('product-title');
    if (titleH) titleH.textContent = product.name;

    const priceEl = document.getElementById('product-price');
    if (priceEl) priceEl.textContent = window.NegosyoPlan.formatPrice(product.price);

    const descEl = document.getElementById('product-description');
    if (descEl) descEl.textContent = product.description;

    const ratingEl = document.getElementById('product-rating');
    if (ratingEl) ratingEl.innerHTML = window.NegosyoPlan.generateStars(product.rating) + ` <span>${product.rating} (${product.reviews} reviews)</span>`;

    const addBtn = document.getElementById('add-to-cart-btn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            window.Cart.addToCart(product.id);
        });
    }

    const featureList = document.getElementById('feature-list');
    if (featureList) {
        featureList.innerHTML = product.features.map(f => `
            <div class="product-feature">
                <i class="${f.icon}"></i>
                <span style="font-size:0.88rem;color:var(--text-muted);">${f.text}</span>
            </div>
        `).join('');
    }

    const methodList = document.getElementById('methodology-list');
    if (methodList) {
        methodList.innerHTML = product.methodology.map((m, i) => `
            <article class="methodology-card">
                <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.6rem;">
                    <span style="width:28px;height:28px;border-radius:50%;background:var(--orange);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:800;flex-shrink:0;">${i + 1}</span>
                    <h4 style="font-size:0.93rem;color:var(--navy);">${m.step}</h4>
                </div>
                <p style="font-size:0.83rem;color:var(--text-muted);">${m.desc}</p>
            </article>
        `).join('');
    }

    const relatedList = document.getElementById('related-products');
    if (relatedList) {
        const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);
        relatedList.innerHTML = related.map(p => `
            <article class="product-card">
                <div class="product-image">
                    <img src="${p.image}" alt="${p.name}" loading="lazy">
                    <div class="pdf-badge">Blueprint OS</div>
                </div>
                <h3>${p.name}</h3>
                <p class="price">${window.NegosyoPlan.formatPrice(p.price)}</p>
                <p>${p.description.substring(0, 90)}...</p>
                <div class="product-actions">
                    <a href="product.html?id=${p.id}" class="button">View Details</a>
                </div>
            </article>
        `).join('');
    }
}
