// --- UI: TOAST NOTIFICATIONS ---

export function showToast(message, type = 'info') {
    const toastType = typeof type === 'string' ? type : 'info';
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast toast--${toastType}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast--hide');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
