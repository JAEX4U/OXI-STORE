const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby7TUSTxFgYqAGKLz3KT2gyxY7_MRvbpsMqrSB5_joxbd-eVsm85exnfN8TuOGrdsLZfg/exec";

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

    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
            action: "NEW_ORDER",
            username: username,
            utr: utr,
            item: "VIP Rank"
        })
    })
    .then(res => res.text())
    .then(data => {
        msg.style.color = "#55ff55";
        msg.innerText = "Order submitted! Processing payment once bank SMS is received.";
        document.getElementById('payForm').reset();
    })
    .catch(error => {
        msg.style.color = "#ff5555";
        msg.innerText = "Error submitting order. Please try again.";
        console.error("Error:", error);
    })
    .finally(() => {
        btn.disabled = false;
        btn.innerText = "Submit Payment";
    });
});
