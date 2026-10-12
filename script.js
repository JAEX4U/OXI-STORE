/* ==========================================================================
   Configuration & State
   ========================================================================== */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUKKj6Hr8xAHyX42avjCDvzL6lYXDUZ-z0lJoytW1_O6dJs_3Cus8WcE0EV1jIcBf0Cw/exec";

let cart = JSON.parse(localStorage.getItem('storeCart')) || [];
let currentThreadElement = null;
let threadReplies = {};

window.addEventListener('load', () => {
    updateCartUI();
    
    // Attach payment form submit listener safely if element exists
    const payForm = document.getElementById('payForm');
    if (payForm) {
        payForm.addEventListener('submit', handlePaymentSubmit);
    }
});

/* ==========================================================================
   Navigation Dropdown Menu
   ========================================================================== */
function toggleDropdown() {
    const dropdown = document.getElementById("navDropdown");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
}

// Close dropdown menu when clicking outside
window.addEventListener("click", function (event) {
    if (!event.target.closest('.menu-container')) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('show')) {
                dropdowns[i].classList.remove('show');
            }
        }
    }
});

/* ==========================================================================
   Tab Switcher (Ranks / Crate Keys)
   ========================================================================== */
function switchTab(tabName, event) {
    document.querySelectorAll('.store-grid').forEach(grid => grid.classList.remove('active-content'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active-content');
    }

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

/* ==========================================================================
   Quantity Validation
   ========================================================================== */
function validateQty(input) {
    let val = parseInt(input.value);
    if (val > 50) {
        input.value = 50;
    } else if (val < 1 || isNaN(val)) {
        input.value = 1;
    }
}

/* ==========================================================================
   Cart Operations
   ========================================================================== */
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

/* ==========================================================================
   Modals Control
   ========================================================================== */
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
    const payForm = document.getElementById('payForm');
    if (payForm) payForm.reset();
}

/* ==========================================================================
   Utilities & Notifications
   ========================================================================== */
function copyIP() {
    navigator.clipboard.writeText("dioxide.pixelforge.gg");
    showToast("Server IP copied: dioxide.pixelforge.gg");
}

function showToast(message) {
    let toast = document.querySelector('.toast-notification');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    
    toast.innerText = message;

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

/* ==========================================================================
   Google Sheet Form Submission Handler
   ========================================================================== */
function handlePaymentSubmit(e) {
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
}

/* ==========================================================================
   Forum Filtering & Interactive Thread Controls
   ========================================================================== */
function filterForum(category, element) {
    document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
    if (element && element.parentElement) {
        element.parentElement.classList.add('active');
    }

    const threads = document.querySelectorAll('.thread-row');
    threads.forEach(thread => {
        const threadCat = thread.getAttribute('data-category');
        if (category === 'all' || threadCat === category) {
            thread.style.display = 'flex';
        } else {
            thread.style.display = 'none';
        }
    });
}

function filterTab(type, element) {
    const tabs = document.querySelectorAll('.forum-content-header .filter-group:first-child .filter-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    if (element) element.classList.add('active');

    const threads = document.querySelectorAll('.thread-row');
    threads.forEach(thread => {
        const isAnswered = thread.getAttribute('data-answered');
        if (type === 'all') {
            thread.style.display = 'flex';
        } else if (type === 'unanswered') {
            if (isAnswered === 'false') {
                thread.style.display = 'flex';
            } else {
                thread.style.display = 'none';
            }
        }
    });
}

function toggleStar(starElement) {
    starElement.classList.toggle('starred');
    if (starElement.classList.contains('starred')) {
        showToast("Thread saved/starred!");
    } else {
        showToast("Thread unstarred.");
    }
}

// New Thread Modal
function openNewThreadModal() {
    const modal = document.getElementById('newThreadModal');
    if (modal) modal.style.display = 'flex';
}

function closeNewThreadModal() {
    const modal = document.getElementById('newThreadModal');
    if (modal) modal.style.display = 'none';
    const form = document.getElementById('newThreadForm');
    if (form) form.reset();
}

function submitNewThread(e) {
    e.preventDefault();
    const author = document.getElementById('postAuthor').value;
    const category = document.getElementById('postCategory').value;
    const title = document.getElementById('postTitle').value;
    const body = document.getElementById('postBody').value;

    const categoryLabels = {
        'announcements': '📢 Announcements',
        'help': '🛠️ Help & Suggestions',
        'showcase': '🏗️ Base Showcases',
        'economy': '💰 Economy & Trading',
        'rules': '📜 Directives & Rules'
    };

    const threadList = document.getElementById('threadList');
    if (!threadList) return;

    const newRow = document.createElement('article');
    newRow.className = 'thread-row';
    newRow.setAttribute('data-category', category);
    newRow.setAttribute('data-answered', 'false');

    const initial = author.charAt(0).toUpperCase();

    newRow.innerHTML = `
        <div class="thread-left">
            <button class="star-icon" onclick="toggleStar(this)">★</button>
            <div class="thread-content-box">
                <div class="thread-title" onclick="openThreadModal(this, '${title}', '${author}', '${categoryLabels[category]}', '${body}')">${title}</div>
                <div class="thread-meta">
                    <span class="avatar-small">${initial}</span>
                    <span style="color:#a78bfa; font-weight:700;">${author}</span>
                    <span>•</span>
                    <span>${categoryLabels[category]}</span>
                    <span>•</span>
                    <span class="reply-count">💬 0 replies</span>
                </div>
                <button class="read-more-btn" onclick="openThreadModal(this.parentElement, '${title}', '${author}', '${categoryLabels[category]}', '${body}')" style="background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer; margin-top: 8px;">📖 Read & Reply</button>
            </div>
        </div>
        <div class="thread-right">
            <span>Just now</span>
        </div>
    `;

    threadList.prepend(newRow);
    closeNewThreadModal();
    showToast('Thread posted successfully!');
}

// Read & Reply Thread Modal
function openThreadModal(element, title, author, category, content) {
    currentThreadElement = element.closest('.thread-row');
    
    document.getElementById('modalThreadTitle').innerText = title;
    document.getElementById('modalThreadAuthor').innerText = `Posted by ${author}`;
    document.getElementById('modalCategoryBadge').innerText = category;
    document.getElementById('modalThreadContent').innerText = content;

    renderReplies(title);
    document.getElementById('threadModal').style.display = 'flex';
}

function closeThreadModal() {
    document.getElementById('threadModal').style.display = 'none';
    const replyForm = document.getElementById('replyForm');
    if (replyForm) replyForm.reset();
}

function renderReplies(threadTitle) {
    const replyContainer = document.getElementById('replyContainer');
    if (!replyContainer) return;

    const replies = threadReplies[threadTitle] || [];
    
    const replyCountHeader = document.getElementById('replyCountHeader');
    if (replyCountHeader) replyCountHeader.innerText = replies.length;

    if (replies.length === 0) {
        replyContainer.innerHTML = '<p style="color: #64748b; font-size: 0.85rem; font-style: italic;">No replies yet. Be the first to respond!</p>';
    } else {
        replyContainer.innerHTML = replies.map(r => `
            <div class="reply-box">
                <div class="reply-header">
                    <strong style="color: #38bdf8;">${r.author}</strong>
                    <span>${r.time}</span>
                </div>
                <div class="reply-text">${r.text}</div>
            </div>
        `).join('');
    }
}

function submitReply(e) {
    e.preventDefault();
    const title = document.getElementById('modalThreadTitle').innerText;
    const author = document.getElementById('replyAuthor').value;
    const text = document.getElementById('replyText').value;

    if (!threadReplies[title]) {
        threadReplies[title] = [];
    }

    threadReplies[title].push({
        author: author,
        text: text,
        time: 'Just now'
    });

    renderReplies(title);
    document.getElementById('replyText').value = '';

    if (currentThreadElement) {
        const countBadge = currentThreadElement.querySelector('.reply-count');
        if (countBadge) {
            countBadge.innerText = `💬 ${threadReplies[title].length} replies`;
        }
        currentThreadElement.setAttribute('data-answered', 'true');
    }

    showToast('Reply added!');
       }
                   
