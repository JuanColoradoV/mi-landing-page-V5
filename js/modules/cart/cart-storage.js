// --- CART: STORAGE & MANAGEMENT ---

import { sanitizeUrl } from '../security/sanitize.js';

function normalizeCartItem(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const quantity = Math.max(1, parseInt(raw.quantity, 10) || 1);
    const ref = String(raw.ref || '').slice(0, 64);
    if (!ref) return null;
    const uniqueId = String(raw.uniqueId || ref).slice(0, 128);
    return {
        uniqueId: uniqueId,
        ref: ref,
        nombre: typeof raw.nombre === 'string' ? raw.nombre.slice(0, 200) : '',
        precio: typeof raw.precio === 'string' ? raw.precio.slice(0, 60) : '',
        imageUrl: sanitizeUrl(raw.imageUrl || ''),
        quantity: quantity,
        selectedColor: typeof raw.selectedColor === 'string' ? raw.selectedColor.slice(0, 60) : '',
        selectedSize: typeof raw.selectedSize === 'string' ? raw.selectedSize.slice(0, 20) : ''
    };
}

export function getCart() {
    const cart = localStorage.getItem('shoppingCart');
    if (!cart) return [];
    try {
        const parsed = JSON.parse(cart);
        if (!Array.isArray(parsed)) return [];
        return parsed.map(normalizeCartItem).filter(Boolean);
    } catch (err) {
        console.warn('Invalid cart data, resetting.');
        return [];
    }
}

export function saveCart(cart) {
    const safeCart = Array.isArray(cart)
        ? cart.map(normalizeCartItem).filter(Boolean)
        : [];
    localStorage.setItem('shoppingCart', JSON.stringify(safeCart));
    updateCartCount();
    window.dispatchEvent(new Event('cartUpdated'));
}

export function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count-badge');

    badges.forEach(badge => {
        badge.textContent = totalItems;
        badge.classList.toggle('hidden', totalItems === 0);
    });
}

export function migrateCartIfNeeded() {
    if (localStorage.getItem('cart_version') !== 'v2') {
        console.log("Migrating Cart to V2 (Numeric Prices)...");
        localStorage.removeItem('shoppingCart');
        localStorage.setItem('cart_version', 'v2');
        updateCartCount();
    }
}
