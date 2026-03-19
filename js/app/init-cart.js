// --- APP: CART PAGE ENTRY POINT ---

import { initCommon } from './init-common.js';
import { updateCartCount, getCart, saveCart } from '../modules/cart/cart-storage.js';
import { renderCartItems, calculateTotals, removeFromCart, updateQuantity } from '../modules/cart-page/cart-page.js';
import { addToRemovedHistory, restoreItemFromHistory, renderRemovedItems } from '../modules/cart-page/cart-history.js';
import { t } from '../modules/i18n/i18n.js';
import { showToast } from '../modules/ui/toast.js';

document.addEventListener('DOMContentLoaded', () => {
    initCommon();
    updateCartCount();
    renderCartItems();
    calculateTotals();
    renderRemovedItems();

    // Event Delegation for cart items
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
        cartContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;
            const uniqueId = button.dataset.id;

            if (button.classList.contains('quantity-change')) {
                const change = parseInt(button.dataset.change, 10);
                const cart = getCart();
                const item = cart.find(i => i.uniqueId === uniqueId);
                if (item) {
                    updateQuantity(uniqueId, item.quantity + change);
                }
            }
            if (button.classList.contains('remove-item')) {
                removeFromCart(uniqueId);
            }
        });
    }

    // History Restore
    const historyContainer = document.getElementById('removed-items-container');
    if (historyContainer) {
        historyContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.restore-btn');
            if (!button) return;
            const index = parseInt(button.dataset.index, 10);
            restoreItemFromHistory(index);
        });
    }

    // Clear Cart Modal
    const clearBtn = document.getElementById('clear-cart-button');
    const modal = document.getElementById('clear-cart-modal');
    const confirmClearBtn = document.getElementById('confirm-clear-btn');
    const cancelClearBtn = document.getElementById('cancel-clear-btn');

    if (clearBtn && modal) {
        clearBtn.addEventListener('click', () => {
            const cart = getCart();
            if (cart.length === 0) {
                showToast(t('toast_cart_empty'), 'warning');
                return;
            }
            modal.classList.remove('hidden');
        });
    }

    if (cancelClearBtn && modal) {
        cancelClearBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    if (confirmClearBtn && modal) {
        confirmClearBtn.addEventListener('click', () => {
            const currentCart = getCart();
            addToRemovedHistory(currentCart);
            saveCart([]);
            renderCartItems();
            calculateTotals();
            modal.classList.add('hidden');
            showToast(t('toast_cart_cleared'), 'alert');
        });
    }

    // Clear History Modal
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const historyModal = document.getElementById('clear-history-modal');
    const confirmClearHistoryBtn = document.getElementById('confirm-clear-history-btn');
    const cancelClearHistoryBtn = document.getElementById('cancel-clear-history-btn');

    if (clearHistoryBtn && historyModal) {
        clearHistoryBtn.addEventListener('click', () => {
            historyModal.classList.remove('hidden');
        });
    }

    if (cancelClearHistoryBtn && historyModal) {
        cancelClearHistoryBtn.addEventListener('click', () => {
            historyModal.classList.add('hidden');
        });
    }

    if (confirmClearHistoryBtn && historyModal) {
        confirmClearHistoryBtn.addEventListener('click', () => {
            sessionStorage.removeItem('removedCartItems');
            renderRemovedItems();
            historyModal.classList.add('hidden');
            showToast(t('toast_history_cleared'), 'alert');
        });
    }

    // Keep cart UI in sync
    window.addEventListener('cartUpdated', () => {
        renderCartItems();
        calculateTotals();
    });
    window.addEventListener('storage', (e) => {
        if (e.key === 'shoppingCart') {
            renderCartItems();
            calculateTotals();
        }
    });
});
