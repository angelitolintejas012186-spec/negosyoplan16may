// checkout.js - Checkout and payment functionality

document.addEventListener('DOMContentLoaded', function() {
    loadOrderSummary();
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            processPayment();
        });
    }
});

function loadOrderSummary() {
    const cart = window.Cart.loadCart();
    const orderItems = document.getElementById('order-items');
    const totalAmount = document.getElementById('total-amount');
    const emptyState = document.getElementById('checkout-empty');

    if (!orderItems || !totalAmount) return;

    if (cart.length === 0) {
        orderItems.innerHTML = '<p>Your cart is empty. Add products before checkout.</p>';
        totalAmount.textContent = '0 AED';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    orderItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        return `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div>
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <p>${window.NegosyoPlan.formatPrice(itemTotal)}</p>
            </div>
        `;
    }).join('');
    totalAmount.textContent = window.NegosyoPlan.formatPrice(window.Cart.calculateTotal(cart));
}

function processPayment() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();

    if (!name || !email || !address) {
        alert('Please complete all required fields.');
        return;
    }

    const cart = window.Cart.loadCart();
    if (cart.length === 0) {
        alert('Your cart is empty. Add a bundle before checkout.');
        return;
    }

    const pendingOrder = {
        id: Date.now(),
        customer: { name, email, address },
        items: cart,
        total: window.Cart.calculateTotal(cart),
        createdAt: new Date().toISOString()
    };

    localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
    window.location.href = 'payment.html';
}

function generatePurchaseToken() {
    return 'NP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}
