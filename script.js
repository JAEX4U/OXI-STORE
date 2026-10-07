// Replace with your live hosted backend URL (e.g. from Render or Koyeb)
const API_URL = "https://your-backend-server.onrender.com/api/orders";

document.getElementById('payForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    const msg = document.getElementById('status-msg');
    const username = document.getElementById('username').value.trim();
    const utr = document.getElementById('utr').value.trim();

    btn.disabled = true;
    btn.innerText = "Submitting...";
    msg.style.color = "#ffaa00";
    msg.innerText = "Logging order...";

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            utr: utr,
            item: "VIP Rank"
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            msg.style.color = "#55ff55";
            msg.innerText = "Order submitted! Waiting for admin payment verification.";
            document.getElementById('payForm').reset();
        } else {
            throw new Error(data.error);
        }
    })
    .catch(error => {
        msg.style.color = "#ff5555";
        msg.innerText = "Error submitting order. Please try again.";
        console.error("Error:", error);
    })
    .finally(() => {
        btn.disabled = false;
        btn.innerText = "I Have Paid";
    });
});
