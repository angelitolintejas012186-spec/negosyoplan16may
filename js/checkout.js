// checkout.js - Checkout billing form functionality

document.addEventListener('DOMContentLoaded', function() {
    loadOrderSummary();
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            processBilling();
        });
    }
});

function loadOrderSummary() {
    const cart = window.Cart ? window.Cart.loadCart() : JSON.parse(localStorage.getItem('cart') || '[]');
    const orderItems = document.getElementById('order-items');
    const totalAmount = document.getElementById('total-amount');
    const emptyState = document.getElementById('checkout-empty');
    const form = document.getElementById('checkout-form');

    if (!orderItems) return;

    if (cart.length === 0) {
        orderItems.innerHTML = '<p style="color:var(--text-muted);font-size:0.88rem;text-align:center;padding:1.5rem 0;">Your cart is empty.</p>';
        if (totalAmount) totalAmount.textContent = window.NegosyoPlan.formatPrice(0);
        if (emptyState) emptyState.style.display = 'block';
        if (form) form.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (form) form.style.display = 'grid';

    orderItems.innerHTML = cart.map(item => {
        const c = item.customization;
        const customLine = c
            ? `<p style="font-size:0.76rem;color:var(--orange);margin-top:0.2rem;font-weight:600;">
                   <i class="fas fa-store" style="margin-right:0.25rem;"></i>${c.businessTypeLabel || c.businessType}
                   ${c.location && c.location.city ? ' · ' + c.location.city : ''}
               </p>`
            : '';
        return `
        <div class="order-confirm-row">
            <div>
                <strong style="font-size:0.88rem;color:var(--navy);">${item.name}</strong>
                <p style="font-size:0.78rem;color:var(--text-muted);margin-top:0.15rem;">Qty: ${item.quantity}</p>
                ${customLine}
            </div>
            <strong style="color:var(--orange);font-size:0.88rem;white-space:nowrap;">${window.NegosyoPlan.formatPrice(item.price * item.quantity)}</strong>
        </div>`;
    }).join('');

    const total = window.Cart ? window.Cart.calculateTotal(cart) : cart.reduce((s, i) => s + i.price * i.quantity, 0);
    if (totalAmount) totalAmount.textContent = window.NegosyoPlan.formatPrice(total);
}

function processBilling() {
    const get = id => (document.getElementById(id) || {}).value?.trim() || '';
    const name = get('checkout-name');
    const email = get('checkout-email');
    const phone = get('checkout-phone');
    const address = get('checkout-address');
    const city = get('checkout-city');
    const country = get('checkout-country');

    if (!name || !email || !address) {
        window.NegosyoPlan.showToast('Please fill in all required fields.', 'error');
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        window.NegosyoPlan.showToast('Please enter a valid email address.', 'error');
        return;
    }

    const cart = window.Cart ? window.Cart.loadCart() : JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        window.NegosyoPlan.showToast('Your cart is empty. Please add a bundle first.', 'error');
        return;
    }

    const total = window.Cart ? window.Cart.calculateTotal(cart) : cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const pendingOrder = {
        id: Date.now(),
        customer: { name, email, phone, address, city, country },
        items: cart,
        total,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
    window.location.href = 'payment.html';
}
