const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUKKj6Hr8xAHyX42avjCDvzL6lYXDUZ-z0lJoytW1_O6dJs_3Cus8WcE0EV1jIcBf0Cw/exec";

// Switch between Ranks and Crate Keys tabs
function switchTab(tabName) {
    document.querySelectorAll('.store-grid').forEach(grid => grid.classList.remove('active-content'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active-content');
    event.currentTarget.classList.add('active');
}

// Enforce minimum of 1 and maximum limit of 50 keys
function validateQty(input) {
    let val = parseInt(input.value);
    if (val > 50) {
        input.value = 50;
    } else if (val < 1 || isNaN(val)) {
        input.value = 1;
    }
}

// Open Payment Modal for Ranks
function openCheckout(itemName, price) {
    const itemFullString = `${itemName} (₹${price})`;
    document.getElementById('modalItemTitle').innerText = `Item: ${itemFullString}`;
    document.getElementById('selectedItem').value = itemFullString;
    document.getElementById('paymentModal').style.display = 'flex';
}

// Open Payment Modal for Keys with Quantity & Total Calculation
function openKeyCheckout(keyName, unitPrice, inputId) {
    let qty = parseInt(document.getElementById(inputId).value) || 1;
    if (qty > 50) qty = 50;
    if (qty < 1) qty = 1;

    const totalPrice = unitPrice * qty;
    const itemFullString = `${qty}x ${keyName} - Total: ₹${totalPrice}`;

    document.getElementById('modalItemTitle').innerText = `Item: ${itemFullString}`;
    document.getElementById('selectedItem').value = itemFullString;
    document.getElementById('paymentModal').style.display = 'flex';
}

// Close Payment Modal
function closeCheckout() {
    document.getElementById('paymentModal').style.display = 'none';
    document.getElementById('msg').innerText = '';
    document.getElementById('payForm').reset();
}

// Copy Server IP to Clipboard
function copyIP() {
    navigator.clipboard.writeText("dioxide.pixelforge.gg");
    alert("Server IP copied: dioxide.pixelforge.gg");
}

// Handle Form Submission to Google Apps Script
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
        
