// --- CART PAGE: REMOVED ITEMS HISTORY ---

import { t } from '../i18n/i18n.js';
import { getCart, saveCart } from '../cart/cart-storage.js';
import { escapeHTML } from '../security/sanitize.js';
import { formatMoney } from '../currency/currency.js';
import { showToast } from '../ui/toast.js';
import { renderCartItemMedia } from '../ui/media.js';
import { getProductsData } from '../data/products-data.js';

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

export function addToRemovedHistory(itemsToAdd) {
    if (!itemsToAdd) return;
    let history = JSON.parse(sessionStorage.getItem('removedCartItems')) || [];
    const newItems = Array.isArray(itemsToAdd) ? itemsToAdd : [itemsToAdd];
    history = [...newItems, ...history];
    history = history.slice(0, 3);
    sessionStorage.setItem('removedCartItems', JSON.stringify(history));
    renderRemovedItems();
}

export function restoreItemFromHistory(index) {
    let history = JSON.parse(sessionStorage.getItem('removedCartItems')) || [];
    if (index >= 0 && index < history.length) {
        const itemToRestore = history[index];
        let cart = getCart();
        const existingItem = cart.find(p => p.uniqueId === itemToRestore.uniqueId);
        if (existingItem) {
            existingItem.quantity += itemToRestore.quantity;
        } else {
            cart.push(itemToRestore);
        }
        saveCart(cart);
        history.splice(index, 1);
        sessionStorage.setItem('removedCartItems', JSON.stringify(history));
        showToast(t('toast_restored'), 'success');
    }
}

export function renderRemovedItems() {
    const history = JSON.parse(sessionStorage.getItem('removedCartItems')) || [];
    const section = document.getElementById('removed-items-section');
    const container = document.getElementById('removed-items-container');
    if (!container || !section) return;

    if (history.length === 0) {
        section.classList.add('hidden');
        return;
    }
    section.classList.remove('hidden');

    let html = '';
    history.forEach((item, index) => {
        const realPrice = getRealPrice(item.ref);

        const safeName = escapeHTML(item.nombre);
        const color = escapeHTML(item.selectedColor || 'N/A');
        const size = escapeHTML(item.selectedSize || 'N/A');

        const mediaHtml = renderCartItemMedia(item.imageUrl, safeName, "w-16 h-16 object-cover rounded-md opacity-75");

        html += `
            <div class="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col relative">
                <div class="flex items-center space-x-4">
                    ${mediaHtml}
                    <div class="flex-grow min-w-0">
                        <h4 class="text-sm font-semibold text-gray-600 truncate">${safeName}</h4>
                         <p class="text-xs text-gray-600">${t('color_label')} ${color} | ${t('size_label')} ${size}</p>
                        <p class="text-xs text-gray-600">${t('qty_label')} ${item.quantity}</p>
                    </div>
                </div>
                <div class="mt-4 flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-600">${formatMoney(realPrice)}</span>
                    <button class="restore-btn text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-1 px-3 rounded transition-colors" data-index="${index}">
                        ${t('btn_restore')}
                    </button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}
