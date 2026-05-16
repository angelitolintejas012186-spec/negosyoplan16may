// cart.js - Cart management functionality

const products = [
    {
        id: 1,
        name: 'Starter Bundle',
        price: 1900,
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Perfect for beginners starting their entrepreneurial journey with planning templates and launch guidance.',
        features: ['Business plan template', 'Financial projection model', 'Market analysis guide'],
        methodology: ['Diagnose', 'Design', 'Validate']
    },
    {
        id: 2,
        name: 'Founder Bundle',
        price: 2600,
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Advanced tools for established entrepreneurs with complete strategy, marketing, and investor materials.',
        features: ['Marketing plan', 'Operational templates', 'Pitch deck framework'],
        methodology: ['Diagnose', 'Design', 'Launch', 'Scale']
    },
    {
        id: 3,
        name: 'Complete Set Bundle',
        price: 3500,
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Everything in one package for entrepreneurs who want a full business planning system.',
        features: ['All starter and founder resources', 'Scaling checklist', 'Revenue model workbook'],
        methodology: ['Diagnose', 'Design', 'Validate', 'Launch', 'Scale']
    },
    {
        id: 4,
        name: 'Custom Bundle',
        price: 4600,
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Build your own bundle with personalized PDF planning tools and tailored business strategy.',
        features: ['Custom planning checklist', 'Operational guides', 'Growth roadmap'],
        methodology: ['Design', 'Validate', 'Launch', 'Scale']
    }
];

function loadCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.NegosyoPlan.updateCartBadge();
}

function addToCart(productId) {
    const cart = loadCart();
    const existing = cart.find(item => item.id === productId);
    const product = products.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else if (product) {
        cart.push({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: 1
        });
    }

    saveCart(cart);
    if (window.NegosyoPlan && window.NegosyoPlan.showToast && product) {
        window.NegosyoPlan.showToast(product.name + ' added to cart!', 'success');
    }
}

function removeFromCart(productId) {
    const cart = loadCart();
    const updated = cart.filter(item => item.id !== productId);
    saveCart(updated);
    renderCart();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    const cart = loadCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        renderCart();
    }
}

function calculateTotal(cart) {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
    const cart = loadCart();
    const container = document.getElementById('cart-items');
    const subtotal = document.getElementById('subtotal');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        if (subtotal) subtotal.textContent = window.NegosyoPlan.formatPrice(0);
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div>
                <h3>${item.name}</h3>
                <p>${window.NegosyoPlan.formatPrice(item.price)}</p>
                <div class="quantity-controls">
                    <button type="button" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <p class="item-total">Total: ${window.NegosyoPlan.formatPrice(item.price * item.quantity)}</p>
            </div>
            <button type="button" class="button secondary" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');

    const total = window.NegosyoPlan.formatPrice(calculateTotal(cart));
    if (subtotal) subtotal.textContent = total;
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) cartTotal.textContent = total;
    if (checkoutBtn) checkoutBtn.style.display = 'flex';
}

function initCartControls() {
    document.querySelectorAll('button[data-id]').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'), 10);
            addToCart(productId);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    renderCart();
    initCartControls();
});

window.Cart = {
    loadCart,
    saveCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    renderCart
};
