const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUKKj6Hr8xAHyX42avjCDvzL6lYXDUZ-z0lJoytW1_O6dJs_3Cus8WcE0EV1jIcBf0Cw/exec";

let cart = JSON.parse(localStorage.getItem('storeCart')) || [];

window.addEventListener('load', updateCartUI);

function switchTab(tabName, event) {
    document.querySelectorAll('.store-grid').forEach(grid => grid.classList.remove('active-content'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active-content');
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

function validateQty(input) {
    let val = parseInt(input.value);
    if (val > 50) {
        input.value = 50;
    } else if (val < 1 || isNaN(val)) {
        input.value = 1;
    }
}

function addToCart(itemName, price, qty = 1) {
    const cartItem = {
        id: Date.now(),
        name: itemName,
        price: price,
        quantity: qty,
        total: price * qty
    };

    cart.push(cartItem);
    localStorage.setItem('storeCart', JSON.stringify(cart));
    updateCartUI();
    showToast(`${itemName} added to cart!`);
}

function addKeyToCart(keyName, unitPrice, inputId) {
    let qty = parseInt(document.getElementById(inputId).value) || 1;
    if (qty > 50) qty = 50;
    if (qty < 1) qty = 1;

    const cartItem = {
        id: Date.now(),
        name: `${qty}x ${keyName}`,
        price: unitPrice,
        quantity: qty,
        total: unitPrice * qty
    };

    cart.push(cartItem);
    localStorage.setItem('storeCart', JSON.stringify(cart));
    updateCartUI();
    showToast(`${qty}x ${keyName} added to cart!`);
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('storeCart', JSON.stringify(cart));
    updateCartUI();
    displayCartItems();
    showToast('Item removed from cart');
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItemsContainer || !cartTotal) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.style.display = 'none';
        return;
    }

    let html = '<div class="cart-items-list">';
    let totalPrice = 0;

    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price} × ${item.quantity}</p>
                    <p class="cart-item-total">Total: ₹${item.total}</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        totalPrice += item.total;
    });

    html += '</div>';
    cartItemsContainer.innerHTML = html;
    document.getElementById('totalPrice').innerText = `₹${totalPrice}`;
    cartTotal.style.display = 'block';
}

function openCartModal() {
    displayCartItems();
    document.getElementById('cartModal').style.display = 'flex';
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

function checkoutCart() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + item.total, 0);
    const itemSummary = cart.map(item => `${item.name} (₹${item.total})`).join(', ');

    document.getElementById('modalItemTitle').innerText = `Items: ${itemSummary} | Total: ₹${totalPrice}`;
    document.getElementById('selectedItem').value = itemSummary + ` | Total: ₹${totalPrice}`;

    let summaryHTML = '<h4 style="margin-bottom: 15px; text-align: left;">Order Summary:</h4>';
    cart.forEach(item => {
        summaryHTML += `<div class="summary-item"><span>${item.name}</span><span>₹${item.total}</span></div>`;
    });
    summaryHTML += `<div class="summary-total"><span>Total:</span><span>₹${totalPrice}</span></div>`;
    document.getElementById('cartSummary').innerHTML = summaryHTML;

    closeCartModal();
    document.getElementById('paymentModal').style.display = 'flex';
}

function openCheckout(itemName, price) {
    const itemFullString = `${itemName} (₹${price})`;
    document.getElementById('modalItemTitle').innerText = `Item: ${itemFullString}`;
    document.getElementById('selectedItem').value = itemFullString;
    document.getElementById('cartSummary').innerHTML = `
        <div class="summary-item"><span>${itemName}</span><span>₹${price}</span></div>
        <div class="summary-total"><span>Total:</span><span>₹${price}</span></div>
    `;
    document.getElementById('paymentModal').style.display = 'flex';
}

function openKeyCheckout(keyName, unitPrice, inputId) {
    let qty = parseInt(document.getElementById(inputId).value) || 1;
    if (qty > 50) qty = 50;
    if (qty < 1) qty = 1;

    const totalPrice = unitPrice * qty;
    const itemFullString = `${qty}x ${keyName} - Total: ₹${totalPrice}`;

    document.getElementById('modalItemTitle').innerText = `Item: ${itemFullString}`;
    document.getElementById('selectedItem').value = itemFullString;
    document.getElementById('cartSummary').innerHTML = `
        <div class="summary-item"><span>${qty}x ${keyName}</span><span>₹${totalPrice}</span></div>
        <div class="summary-total"><span>Total:</span><span>₹${totalPrice}</span></div>
    `;
    document.getElementById('paymentModal').style.display = 'flex';
}

function closeCheckout() {
    document.getElementById('paymentModal').style.display = 'none';
    document.getElementById('msg').innerText = '';
    document.getElementById('payForm').reset();
}

function copyIP() {
    navigator.clipboard.writeText("dioxide.pixelforge.gg");
    showToast("Server IP copied: dioxide.pixelforge.gg");
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

document.getElementById('payForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const msg = document.getElementById('msg');

    submitBtn.disabled = true;
    msg.style.color = "#eab308";
    msg.innerText = "Logging payment...";

    const payload = {
        username: document.getElementById('username').value,
        utr: document.getElementById('utr').value,
        item: document.getElementById('selectedItem').value
    };

    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
    })
    .then(() => {
        msg.style.color = "#22c55e";
        msg.innerText = "Bill logged! Staff will verify your UTR shortly.";
        document.getElementById('payForm').reset();

        cart = [];
        localStorage.setItem('storeCart', JSON.stringify(cart));
        updateCartUI();

        setTimeout(closeCheckout, 3000);
    })
    .catch(err => {
        console.error(err);
        msg.style.color = "#ef4444";
        msg.innerText = "Error logging bill. Please try again.";
    })
    .finally(() => {
        submitBtn.disabled = false;
    });
});
  
