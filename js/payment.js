// payment.js - Payment processing for all methods

const CARD_METHODS = ['Stripe'];
const WALLET_METHODS = ['GCash', 'PayMaya', 'GoTyme', 'GrabPay', 'ShopeePay'];
const BANK_METHODS = ['BDO', 'BPI', 'PayPal'];

document.addEventListener('DOMContentLoaded', function() {
    initPaymentMethods();
    renderPendingOrder();
    const form = document.getElementById('payment-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            completePayment();
        });
    }
});

function initPaymentMethods() {
    const methodCards = document.querySelectorAll('.payment-method-card');
    methodCards.forEach(card => {
        card.addEventListener('click', function() {
            selectPaymentMethod(this.dataset.method);
        });
    });
    const selectedCard = document.querySelector('.payment-method-card.selected');
    selectPaymentMethod(selectedCard ? selectedCard.dataset.method : 'Stripe');
}

function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-method-card').forEach(card => {
        const input = card.querySelector('input[type="radio"]');
        const active = card.dataset.method === method;
        card.classList.toggle('selected', active);
        if (input) input.checked = active;
    });

    const cardFields = document.getElementById('card-fields');
    const ewalletFields = document.getElementById('ewallet-fields');
    const bankInfo = document.getElementById('bank-info');

    if (cardFields) cardFields.style.display = CARD_METHODS.includes(method) ? 'grid' : 'none';
    if (ewalletFields) ewalletFields.style.display = WALLET_METHODS.includes(method) ? 'block' : 'none';
    if (bankInfo) bankInfo.style.display = BANK_METHODS.includes(method) ? 'block' : 'none';
}

function renderPendingOrder() {
    const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder') || 'null');
    const orderSummary = document.getElementById('payment-order-summary');
    const noOrderMessage = document.getElementById('no-pending-order');

    if (!orderSummary) return;

    if (!pendingOrder || !pendingOrder.items || pendingOrder.items.length === 0) {
        if (noOrderMessage) noOrderMessage.style.display = 'block';
        orderSummary.innerHTML = '<p style="color:var(--text-muted);font-size:0.88rem;">No active order. <a href="cart.html" style="color:var(--orange);">Return to cart.</a></p>';
        return;
    }
    if (noOrderMessage) noOrderMessage.style.display = 'none';

    const total = pendingOrder.items.reduce((s, i) => s + i.price * i.quantity, 0);
    orderSummary.innerHTML = `
        <h3 style="margin-bottom:1.25rem;">Order Summary</h3>
        ${pendingOrder.items.map(item => `
            <div class="order-confirm-row">
                <div>
                    <strong style="font-size:0.88rem;color:var(--navy);">${item.name}</strong>
                    <p style="font-size:0.78rem;color:var(--text-muted);margin-top:0.15rem;">Qty: ${item.quantity}</p>
                </div>
                <strong style="color:var(--orange);font-size:0.88rem;white-space:nowrap;">${window.NegosyoPlan.formatPrice(item.price * item.quantity)}</strong>
            </div>
        `).join('')}
        <div class="order-total">
            <h3 style="font-size:1.1rem;">Total: <span style="color:var(--orange);">${window.NegosyoPlan.formatPrice(total)}</span></h3>
        </div>
        <div class="page-notice" style="margin-top:1rem;font-size:0.83rem;">
            <i class="fas fa-user" style="margin-right:0.4rem;color:var(--orange);"></i>
            <strong>${pendingOrder.customer.name}</strong> &mdash; ${pendingOrder.customer.email}
        </div>
        <div style="margin-top:1rem;padding:0.75rem;background:rgba(26,158,92,0.08);border-radius:10px;border:1px solid rgba(26,158,92,0.2);">
            <p style="font-size:0.8rem;color:#0d7c45;"><i class="fas fa-shield-alt" style="margin-right:0.35rem;"></i><strong>SSL Secured.</strong> Your payment is encrypted and safe.</p>
        </div>
    `;
}

function completePayment() {
    const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder') || 'null');
    if (!pendingOrder || !pendingOrder.items || pendingOrder.items.length === 0) {
        window.NegosyoPlan.showToast('No pending order found. Please return to checkout.', 'error');
        return;
    }

    const selectedRadio = document.querySelector('input[name="payment-method"]:checked');
    if (!selectedRadio) {
        window.NegosyoPlan.showToast('Please select a payment method.', 'error');
        return;
    }
    const method = selectedRadio.value;

    if (CARD_METHODS.includes(method)) {
        const cardNumber = (document.getElementById('card-number') || {}).value?.trim();
        const cardName = (document.getElementById('card-name') || {}).value?.trim();
        const expiry = (document.getElementById('card-expiry') || {}).value?.trim();
        const cvv = (document.getElementById('card-cvv') || {}).value?.trim();
        if (!cardNumber || !cardName || !expiry || !cvv) {
            window.NegosyoPlan.showToast('Please fill in all card details.', 'error');
            return;
        }
    } else if (WALLET_METHODS.includes(method)) {
        const mobileNum = (document.getElementById('wallet-number') || {}).value?.trim();
        if (!mobileNum) {
            window.NegosyoPlan.showToast('Please enter your registered mobile number for ' + method + '.', 'error');
            return;
        }
    }

    const payBtn = document.getElementById('pay-now');
    if (payBtn) {
        payBtn.disabled = true;
        payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
    }

    setTimeout(function() {
        const total = pendingOrder.items.reduce((s, i) => s + i.price * i.quantity, 0);
        const purchase = {
            id: Date.now(),
            token: 'NPAY-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
            customer: pendingOrder.customer,
            items: pendingOrder.items,
            total,
            paymentMethod: method,
            timestamp: new Date().toISOString(),
            status: 'Completed'
        };

        const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
        purchases.push(purchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        localStorage.setItem('lastPurchase', JSON.stringify(purchase));
        localStorage.removeItem('pendingOrder');
        localStorage.setItem('cart', '[]');
        if (window.NegosyoPlan) window.NegosyoPlan.updateCartBadge();
        window.location.href = 'thank-you.html';
    }, 1800);
}
