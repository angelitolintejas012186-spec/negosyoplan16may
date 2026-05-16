// product.js - Product detail page functionality

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'), 10);

    if (productId) {
        loadProductDetails(productId);
    } else {
        const container = document.getElementById('product-detail');
        if (container) container.innerHTML = '<p>Product not found.</p>';
    }
});

const products = [
    {
        id: 1,
        name: 'Starter Bundle',
        price: 130,
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Starter bundle for new entrepreneurs with core business templates, budget planning, and launch checklists.',
        rating: 4.5,
        reviews: 120,
        features: ['Business plan template', 'Financial projection spreadsheet', 'Market analysis guide', 'SWOT framework'],
        methodology: ['Diagnose', 'Design', 'Validate']
    },
    {
        id: 2,
        name: 'Founder Bundle',
        price: 200,
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Founder bundle for established businesses with complete strategy, marketing, and investor pitch tools.',
        rating: 5.0,
        reviews: 85,
        features: ['Advanced business model canvas', 'Marketing strategy', 'Investor pitch framework', 'Operational templates'],
        methodology: ['Diagnose', 'Design', 'Launch', 'Scale']
    },
    {
        id: 3,
        name: 'Complete Set Bundle',
        price: 250,
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Complete business planning toolkit for growth-minded entrepreneurs seeking a full execution system.',
        rating: 4.8,
        reviews: 200,
        features: ['All Starter & Founder resources', 'Scaling checklist', 'Revenue projection templates', 'Market launch plan'],
        methodology: ['Diagnose', 'Design', 'Validate', 'Launch', 'Scale']
    },
    {
        id: 4,
        name: 'Custom Bundle',
        price: 300,
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Custom bundle tailored to your industry, goals, and budget, with premium planning support.',
        rating: 4.9,
        reviews: 65,
        features: ['Personalized planning roadmap', 'Custom operations guide', 'Financial model', 'Marketing blueprint'],
        methodology: ['Design', 'Validate', 'Launch', 'Scale']
    }
];

function loadProductDetails(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) {
        const container = document.getElementById('product-detail');
        if (container) container.innerHTML = '<p>Product not found.</p>';
        return;
    }

    const productImg = document.getElementById('product-img');
    const title = document.getElementById('product-title');
    const price = document.getElementById('product-price');
    const description = document.getElementById('product-description');
    const rating = document.getElementById('product-rating');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const methodologyList = document.getElementById('methodology-list');
    const featureList = document.getElementById('feature-list');
    const productImageContainer = document.getElementById('product-image');

    if (productImg) {
        productImg.src = product.image;
        productImg.alt = product.name;
    }
    if (title) title.textContent = product.name;
    if (price) price.textContent = window.NegosyoPlan.formatPrice(product.price);
    if (description) description.textContent = product.description;
    if (rating) rating.innerHTML = `${window.NegosyoPlan.generateStars(product.rating)} <span>${product.rating} (${product.reviews} reviews)</span>`;

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            window.Cart.addToCart(product.id);
        });
    }

    if (methodologyList) {
        methodologyList.innerHTML = product.methodology.map(step => `
            <article class="methodology-card">
                <h4>${step}</h4>
                <p>This bundle supports the ${step} stage of the Negosyo Plan Blueprint OS.</p>
            </article>
        `).join('');
    }

    if (featureList) {
        featureList.innerHTML = product.features.map(feature => `
            <div class="trust-card">
                <h4>${feature}</h4>
                <p>Included as part of your downloadable PDF toolkit.</p>
            </div>
        `).join('');
    }
}
