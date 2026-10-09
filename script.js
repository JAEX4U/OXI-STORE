const copyButtons = document.querySelectorAll('[data-copy]');

function showToast(message) {
    const toast = document.querySelector('.toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 1800);
}

copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
        const text = button.dataset.copy || button.textContent.trim();

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const temp = document.createElement('textarea');
                temp.value = text;
                document.body.appendChild(temp);
                temp.select();
                document.execCommand('copy');
                temp.remove();
            }

            showToast(`Copied: ${text}`);
        } catch (error) {
            console.error('Copy failed:', error);
            showToast('Copy failed');
        }
    });
});
