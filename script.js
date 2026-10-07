const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUKKj6Hr8xAHyX42avjCDvzL6lYXDUZ-z0lJoytW1_O6dJs_3Cus8WcE0EV1jIcBf0Cw/exec";

// Switch between Ranks and Keys tabs
function switchTab(tabName) {
    document.querySelectorAll('.store-grid').forEach(grid => grid.classList.remove('active-content'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active-content');
    event.currentTarget.classList.add('active');
}

// Open Payment Modal
function openCheckout(itemName, price) {
    document.getElementById('modalItemTitle').innerText = `Item: ${itemName} (₹${price})`;
    document.getElementById('selectedItem').value = itemName;
    document.getElementById('paymentModal').style.display = 'flex';
}

// Close Payment Modal
function closeCheckout() {
    document.getElementById('paymentModal').style.display = 'none';
    document.getElementById('msg').innerText = '';
    document.getElementById('payForm').reset();
}

// Copy Server IP
function copyIP() {
    navigator.clipboard.writeText("play.yourserver.com");
    alert("Server IP copied to clipboard!");
}

// Form Submission to Google Sheet & Discord Webhook
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
        msg.innerText = "Bill logged! Staff will verify your UTR shorty.";
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
                                                    
