// payment.js - Payment step after checkout

document.addEventListener('DOMContentLoaded', function() {
    renderPendingOrder();
    const form = document.getElementById('payment-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            completePayment();
        });
    }
});

function renderPendingOrder() {
    const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder') || 'null');
    const orderSummary = document.getElementById('payment-order-summary');
    const noOrderMessage = document.getElementById('no-pending-order');

    if (!orderSummary) return;

    if (!pendingOrder || !pendingOrder.items || pendingOrder.items.length === 0) {
        orderSummary.innerHTML = '<p>No pending payment order was found. Please return to checkout.</p>';
        if (noOrderMessage) noOrderMessage.style.display = 'block';
        return;
    }

    if (noOrderMessage) noOrderMessage.style.display = 'none';

    const total = pendingOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    orderSummary.innerHTML = `
        <div class="section-card">
            <h3>Order Summary</h3>
            ${pendingOrder.items.map(item => `
                <div class="order-item">
                    <div>
                        <strong>${item.name}</strong>
                        <p>Qty: ${item.quantity}</p>
                    </div>
                    <p>${window.NegosyoPlan.formatPrice(item.price * item.quantity)}</p>
                </div>
            `).join('')}
            <div class="order-total">
                <h3>Total</h3>
                <p>${window.NegosyoPlan.formatPrice(total)}</p>
            </div>
        </div>
    `;
}

function completePayment() {
    const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder') || 'null');
    if (!pendingOrder || !pendingOrder.items || pendingOrder.items.length === 0) {
        alert('No pending payment order found.');
        return;
    }

    const cardNumber = document.getElementById('card-number').value.trim();
    const cardName = document.getElementById('card-name').value.trim();
    const expiry = document.getElementById('card-expiry').value.trim();
    const cvv = document.getElementById('card-cvv').value.trim();

    if (!cardNumber || !cardName || !expiry || !cvv) {
        alert('Please fill in your payment information.');
        return;
    }

    const submitButton = document.getElementById('pay-now');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Processing payment...';
    }

    setTimeout(function() {
        const total = pendingOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const purchase = {
            id: Date.now(),
            token: generatePurchaseToken(),
            customer: pendingOrder.customer,
            items: pendingOrder.items,
            total,
            paymentMethod: 'Card ending ' + cardNumber.slice(-4),
            timestamp: new Date().toISOString(),
            status: 'Completed'
        };

        const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
        purchases.push(purchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        localStorage.setItem('lastPurchase', JSON.stringify(purchase));
        localStorage.removeItem('pendingOrder');
        localStorage.setItem('cart', '[]');
        window.NegosyoPlan.updateCartBadge();
        window.location.href = 'thank-you.html';
    }, 1800);
}

function generatePurchaseToken() {
    return 'NPAY-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}
