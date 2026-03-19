// --- CART PAGE: MAIN RENDERING ---

import { t } from '../i18n/i18n.js';
import { getCart, saveCart, updateCartCount } from '../cart/cart-storage.js';
import { formatMoney } from '../currency/currency.js';
import { escapeHTML } from '../security/sanitize.js';
import { showToast } from '../ui/toast.js';
import { getProductsData } from '../data/products-data.js';
import { renderCartItemMedia } from '../ui/media.js';
import { addToRemovedHistory } from './cart-history.js';

function getRealPrice(itemRef) {
    const productsData = getProductsData();
    if (productsData) {
        const product = productsData.find(p => p.ref === itemRef);
        if (product) {
            return product.numericPrice;
        }
    }
    return 0;
}

export function removeFromCart(uniqueId) {
    let cart = getCart();
    const itemToRemove = cart.find(item => item.uniqueId === uniqueId);
    if (itemToRemove) addToRemovedHistory(itemToRemove);
    cart = cart.filter(item => item.uniqueId !== uniqueId);
    saveCart(cart);
    renderCartItems();
    calculateTotals();
}

export function updateQuantity(uniqueId, newQuantity) {
    let cart = getCart();
    const item = cart.find(item => item.uniqueId === uniqueId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(uniqueId);
        } else {
            item.quantity = newQuantity;
            saveCart(cart);
            renderCartItems();
            calculateTotals();
        }
    }
}

export function renderCartItems() {
    const cart = getCart();
    const container = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('empty-cart-message');
    if (!container || !emptyMessage) return;

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    container.appendChild(emptyMessage);

    if (cart.length === 0) {
        emptyMessage.classList.remove('hidden');
        return;
    }
    emptyMessage.classList.add('hidden');

    cart.forEach(item => {
        const realPrice = getRealPrice(item.ref);
        const itemTotal = realPrice * item.quantity;

        const safeName = escapeHTML(item.nombre);
        const color = escapeHTML(item.selectedColor || 'Sin color');
        const size = escapeHTML(item.selectedSize || 'Sin talla');
        const itemId = item.uniqueId || item.ref;

        const mediaHtml = renderCartItemMedia(item.imageUrl, safeName, "w-24 h-24 object-cover rounded-md");

        const itemHtml = `
            <div class="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4 mb-4">
                ${mediaHtml}
                <div class="flex-grow">
                    <h3 class="text-lg font-semibold text-gray-800">${safeName}</h3>
                    <p class="text-xs text-gray-600 mb-1">${t('label_ref')} ${escapeHTML(item.ref)}</p>
                    <div class="flex items-center space-x-3 text-sm text-gray-600 mb-1">
                        <span class="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium border border-gray-200">${t('size_label')} ${size}</span>
                        <span class="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium border border-gray-200">
                            ${t('color_label')} ${color}
                        </span>
                    </div>
                    <p class="text-base font-medium text-indigo-600">${formatMoney(realPrice)}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="quantity-change p-1 rounded-full text-gray-600 hover:bg-gray-200" data-id="${itemId}" data-change="-1" aria-label="${t('aria_decrease_qty')}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                    </button>
                    <input type="number" value="${item.quantity}" class="w-12 text-center border-gray-300 rounded-md" readonly>
                    <button class="quantity-change p-1 rounded-full text-gray-600 hover:bg-gray-200" data-id="${itemId}" data-change="1" aria-label="${t('aria_increase_qty')}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                </div>
                <p class="text-lg font-bold text-gray-900 w-24 text-right hidden sm:block">${formatMoney(itemTotal)}</p>
                <button class="remove-item p-1 rounded-full text-gray-600 hover:text-red-600" data-id="${itemId}" aria-label="${t('aria_remove_item')}">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        `;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = itemHtml;
        container.appendChild(tempDiv.firstElementChild);
    });
}

export function calculateTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => {
        const realPrice = getRealPrice(item.ref);
        return sum + (realPrice * item.quantity);
    }, 0);

    const shipping = (subtotal > 0 ? 12000 : 0);
    const total = subtotal + shipping;
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const totalEl = document.getElementById('cart-total');
    if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
    if (shippingEl) shippingEl.textContent = formatMoney(shipping);
    if (totalEl) totalEl.textContent = formatMoney(total);
}
