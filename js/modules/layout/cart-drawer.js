// --- LAYOUT: CART DRAWER ---

import { t } from '../i18n/i18n.js';
import { getCart, saveCart } from '../cart/cart-storage.js';
import { formatMoney } from '../currency/currency.js';
import { escapeHTML } from '../security/sanitize.js';
import { renderDrawerMedia } from '../ui/media.js';
import { getProductsData } from '../data/products-data.js';

const CART_DRAWER_AUTO_CLOSE_MS = 6000;
let drawerTimer = null;

function getRealPriceByRef(itemRef) {
    const productsData = getProductsData();
    if (productsData) {
        const product = productsData.find(p => p.ref === itemRef);
        if (product) {
            return product.numericPrice;
        }
    }
    return 0;
}

function updateCartDrawer() {
    const itemsContainer = document.getElementById('cart-drawer-items');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    if (!itemsContainer || !subtotalEl) return;

    const cart = getCart();
    if (cart.length === 0) {
        itemsContainer.innerHTML = `<p class="text-sm text-gray-600" data-i18n="drawer_empty">${t('drawer_empty')}</p>`;
        subtotalEl.textContent = formatMoney(0);
        return;
    }

    let subtotal = 0;
    let html = '';
    cart.forEach(item => {
        const unitPrice = getRealPriceByRef(item.ref);
        const lineTotal = unitPrice * item.quantity;
        subtotal += lineTotal;
        const name = escapeHTML(item.nombre || '');
        const color = escapeHTML(item.selectedColor || '');
        const size = escapeHTML(item.selectedSize || '');
        const itemId = item.uniqueId || item.ref || '';

        html += `
            <div class="flex items-start gap-3">
                ${renderDrawerMedia(item.imageUrl, name)}
                <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900 truncate">${name}</p>
                    <p class="text-xs text-gray-500">${t('label_ref')} ${escapeHTML(item.ref || '')}</p>
                    <p class="text-xs text-gray-500">${t('color_label')} ${color} · ${t('size_label')} ${size}</p>
                    <div class="mt-2 flex items-center justify-between gap-2">
                        <div class="flex items-center">
                            <button type="button" class="drawer-qty-change quantity-change w-6 h-6 rounded-l text-sm font-bold" data-id="${itemId}" data-change="-1" aria-label="${t('aria_decrease_qty')}">-</button>
                            <span class="w-8 h-6 border-t border-b border-gray-300 flex items-center justify-center text-xs text-gray-900 bg-white">${item.quantity}</span>
                            <button type="button" class="drawer-qty-change quantity-change w-6 h-6 rounded-r text-sm font-bold" data-id="${itemId}" data-change="1" aria-label="${t('aria_increase_qty')}">+</button>
                        </div>
                        <button type="button" class="drawer-remove text-xs font-medium text-red-600 hover:text-red-700" data-id="${itemId}" aria-label="${t('aria_remove_item')}">
                            ${t('btn_remove')}
                        </button>
                    </div>
                </div>
                <div class="text-sm font-semibold text-gray-900 flex-shrink-0">${formatMoney(lineTotal)}</div>
            </div>
        `;
    });
    itemsContainer.innerHTML = html;
    subtotalEl.textContent = formatMoney(subtotal);
}

function updateDrawerQuantity(uniqueId, change) {
    if (!uniqueId) return;
    const cart = getCart();
    let item = cart.find(i => i.uniqueId === uniqueId);
    if (!item) item = cart.find(i => i.ref === uniqueId);
    if (!item) return;
    const newQty = item.quantity + change;
    if (newQty <= 0) {
        const updatedCart = cart.filter(i => i.uniqueId !== uniqueId);
        saveCart(updatedCart);
        return;
    }
    item.quantity = newQty;
    saveCart(cart);
}

function removeDrawerItem(uniqueId) {
    if (!uniqueId) return;
    const cart = getCart();
    let updatedCart = cart.filter(i => i.uniqueId !== uniqueId);
    if (updatedCart.length === cart.length) {
        updatedCart = cart.filter(i => i.ref !== uniqueId);
    }
    saveCart(updatedCart);
}

export function openCartDrawer(options = {}) {
    const { autoClose = false } = options;
    const drawer = document.getElementById('cart-drawer');
    const panel = document.getElementById('cart-drawer-panel');
    const backdrop = drawer ? drawer.querySelector('[data-drawer-backdrop]') : null;
    const trigger = document.getElementById('cart-drawer-trigger');
    if (!drawer || !panel || !backdrop) return;

    updateCartDrawer();
    drawer.classList.remove('hidden');
    drawer.setAttribute('aria-hidden', 'false');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => {
        panel.classList.remove('translate-x-full');
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
    });

    if (autoClose) {
        if (drawerTimer) clearTimeout(drawerTimer);
        const duration = typeof options.durationMs === 'number' ? options.durationMs : CART_DRAWER_AUTO_CLOSE_MS;
        drawerTimer = setTimeout(() => {
            closeCartDrawer();
        }, duration);
    }
}

export function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const panel = document.getElementById('cart-drawer-panel');
    const backdrop = drawer ? drawer.querySelector('[data-drawer-backdrop]') : null;
    const trigger = document.getElementById('cart-drawer-trigger');
    if (!drawer || !panel || !backdrop) return;

    panel.classList.add('translate-x-full');
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');
    drawer.setAttribute('aria-hidden', 'true');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');

    setTimeout(() => {
        drawer.classList.add('hidden');
    }, 250);
}

export function renderCartDrawer() {
    const drawerHtml = `
    <div id="cart-drawer" class="fixed inset-0 z-[90] hidden" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-900/40 opacity-0 transition-opacity" data-drawer-backdrop></div>
        <aside id="cart-drawer-panel" class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform translate-x-full transition-transform">
            <div class="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900" data-i18n="drawer_title">Tu carrito</h2>
                <button type="button" id="cart-drawer-close" class="text-gray-500 hover:text-gray-700" aria-label="Cerrar">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div id="cart-drawer-items" class="p-4 space-y-4 overflow-y-auto h-[calc(100%-190px)]">
                <p class="text-sm text-gray-600" data-i18n="drawer_empty">Tu carrito está vacío.</p>
            </div>
            <div class="p-4 border-t border-gray-200">
                <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span data-i18n="label_subtotal">Subtotal</span>
                    <span id="cart-drawer-subtotal" class="font-semibold text-gray-900">$0</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button type="button" id="cart-drawer-continue" class="w-full border border-gray-300 text-gray-700 font-medium py-2 rounded-md hover:bg-gray-50 btn-secondary" data-i18n="drawer_continue">Seguir comprando</button>
                    <a href="carrito.html" class="w-full text-center bg-indigo-600 text-white font-medium py-2 rounded-md hover:bg-indigo-700" data-i18n="drawer_view_cart">Ver carrito</a>
                </div>
            </div>
        </aside>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', drawerHtml);
}

export function setupCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;

    const backdrop = drawer.querySelector('[data-drawer-backdrop]');
    const closeBtn = document.getElementById('cart-drawer-close');
    const continueBtn = document.getElementById('cart-drawer-continue');
    const panel = document.getElementById('cart-drawer-panel');
    const trigger = document.getElementById('cart-drawer-trigger');
    const itemsContainer = document.getElementById('cart-drawer-items');

    if (backdrop) backdrop.addEventListener('click', closeCartDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
    if (continueBtn) continueBtn.addEventListener('click', closeCartDrawer);
    if (panel) {
        panel.addEventListener('mouseenter', () => {
            if (drawerTimer) clearTimeout(drawerTimer);
        });
    }
    if (trigger) {
        trigger.addEventListener('click', (e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            openCartDrawer({ autoClose: false });
        });
    }

    if (itemsContainer) {
        itemsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;
            const uniqueId = button.dataset.id;
            if (!uniqueId) return;

            if (button.classList.contains('drawer-qty-change')) {
                const change = parseInt(button.dataset.change, 10);
                if (!Number.isNaN(change)) updateDrawerQuantity(uniqueId, change);
            }
            if (button.classList.contains('drawer-remove')) {
                removeDrawerItem(uniqueId);
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCartDrawer();
    });

    window.addEventListener('cartUpdated', () => {
        if (!drawer.classList.contains('hidden')) updateCartDrawer();
    });
}
