const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUKKj6Hr8xAHyX42avjCDvzL6lYXDUZ-z0lJoytW1_O6dJs_3Cus8WcE0EV1jIcBf0Cw/exec";

document.getElementById('payForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const msg = document.getElementById('msg');
    
    submitBtn.disabled = true;
    msg.style.color = "#ffaa00";
    msg.innerText = "Logging your bill...";

    const payload = {
        username: document.getElementById('username').value,
        utr: document.getElementById('utr').value,
        item: document.getElementById('item').value
    };

    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
    })
    .then(() => {
        msg.style.color = "#55ff55";
        msg.innerText = "Bill logged successfully! Admin will verify your UTR soon.";
        document.getElementById('payForm').reset();
    })
    .catch(err => {
        console.error(err);
        msg.style.color = "#ff5555";
        msg.innerText = "Error logging bill. Please try again.";
    })
    .finally(() => {
        submitBtn.disabled = false;
    });
});
