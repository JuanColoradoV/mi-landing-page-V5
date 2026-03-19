// --- PRODUCTS: ADD TO CART FLOW ---

import { t } from '../i18n/i18n.js';
import { getCart, saveCart } from '../cart/cart-storage.js';
import { formatMoney } from '../currency/currency.js';
import { showToast } from '../ui/toast.js';
import { closeConfirmationModal, setModalCloseCallback } from '../layout/confirmation-modal.js';
import { openCartDrawer } from '../layout/cart-drawer.js';
import { getProductsData } from '../data/products-data.js';
import { setSizePanelVisibility, updateProductMedia, getModalImageData } from './product-card.js';

const selections = {};

export function selectColor(btn, ref, color) {
    const actualRef = ref || (btn ? btn.getAttribute('data-ref') : '');
    const actualColor = color || (btn ? btn.getAttribute('data-value') : '');
    if (!actualRef || !actualColor) return;
    if (!selections[actualRef]) selections[actualRef] = {};
    selections[actualRef].color = actualColor;
    const container = btn.closest('.flex');
    const buttons = container.querySelectorAll('.color-option-btn');
    buttons.forEach(b => {
        b.classList.remove('ring-2', 'ring-offset-2', 'ring-indigo-500', 'scale-110');
        b.classList.add('border-gray-200');
    });
    btn.classList.remove('border-gray-200');
    btn.classList.add('ring-2', 'ring-offset-2', 'ring-indigo-500', 'scale-110');
    updateProductMedia(actualRef, actualColor);
    setSizePanelVisibility(actualRef, true);
}

export function selectSize(btn, ref, size) {
    const actualRef = ref || (btn ? btn.getAttribute('data-ref') : '');
    const actualSize = size || (btn ? btn.getAttribute('data-value') : '');
    if (!actualRef || !actualSize) return;
    if (!selections[actualRef]) selections[actualRef] = {};
    selections[actualRef].size = actualSize;
    const container = btn.closest('.flex');
    const buttons = container.querySelectorAll('.size-option-btn');
    buttons.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
        b.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
    });
    btn.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
    btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');
}

export function updateQuantityInput(ref, change) {
    const input = document.getElementById('qty-' + ref);
    if (!input) return;
    let currentValue = parseInt(input.value) || 1;
    let newValue = currentValue + change;
    if (newValue < 1) newValue = 1;
    input.value = newValue;
}

function resetProductCard(ref) {
    if (selections[ref]) {
        selections[ref] = {};
    }

    const qtyInput = document.getElementById('qty-' + ref);
    if (qtyInput) qtyInput.value = 1;

    const colorBtns = document.querySelectorAll(`.color-option-btn[data-ref="${ref}"]`);
    colorBtns.forEach(b => {
        b.classList.remove('ring-2', 'ring-offset-2', 'ring-indigo-500', 'scale-110');
        b.classList.add('border-gray-200');
    });
    const sizeBtns = document.querySelectorAll(`.size-option-btn[data-ref="${ref}"]`);
    sizeBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
        b.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
    });

    updateProductMedia(ref, null);
    setSizePanelVisibility(ref, false);
}

function getQuantity(ref) {
    const input = document.getElementById('qty-' + ref);
    return input ? (parseInt(input.value, 10) || 1) : 1;
}

function confirmAddToCart(item) {
    const cart = getCart();
    const existingItem = cart.find(i => i.uniqueId === item.uniqueId);

    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cart.push(item);
    }

    saveCart(cart);
    showToast(t('toast_added'), 'success');
    closeConfirmationModal();
    openCartDrawer({ autoClose: true });
}

export function addToCartHandler(ref) {
    const productsData = getProductsData();
    const product = productsData.find(p => p.ref === ref);
    if (!product) return;

    const userSelection = selections[ref];
    if (!userSelection || !userSelection.color || !userSelection.size) {
        showToast(t('toast_select'), 'warning');
        return;
    }

    const quantity = getQuantity(ref);

    const uniqueId = ref + '-' + userSelection.color + '-' + userSelection.size;
    const cartItem = {
        uniqueId: uniqueId,
        ref: product.ref,
        nombre: product.nombre,
        precio: product.precio,
        imageUrl: product.imageUrl,
        quantity: quantity,
        selectedColor: userSelection.color,
        selectedSize: userSelection.size
    };

    const unitPrice = product.numericPrice;
    const totalPrice = unitPrice * quantity;

    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        const modalImage = document.getElementById('modal-product-image');
        if (modalImage) {
            const imageData = getModalImageData(product, userSelection.color);
            modalImage.src = imageData.src;
            modalImage.alt = product.nombre || '';
            modalImage.onerror = () => {
                modalImage.src = imageData.placeholder;
                modalImage.onerror = null;
            };
        }
        document.getElementById('modal-product-name').textContent = product.nombre;
        document.getElementById('modal-product-color').textContent = userSelection.color;
        document.getElementById('modal-product-size').textContent = userSelection.size;
        document.getElementById('modal-product-quantity').textContent = quantity;
        document.getElementById('modal-product-total').textContent = formatMoney(totalPrice);

        const qtyLabel = document.getElementById('modal-product-quantity');
        const decreaseBtn = document.getElementById('modal-qty-decrease');
        const increaseBtn = document.getElementById('modal-qty-increase');
        if (qtyLabel && decreaseBtn && increaseBtn) {
            let currentQty = quantity;
            const updateModalQty = () => {
                qtyLabel.textContent = currentQty;
                document.getElementById('modal-product-total').textContent = formatMoney(unitPrice * currentQty);
                cartItem.quantity = currentQty;
            };
            updateModalQty();
            decreaseBtn.onclick = () => {
                currentQty = Math.max(1, currentQty - 1);
                updateModalQty();
            };
            increaseBtn.onclick = () => {
                currentQty += 1;
                updateModalQty();
            };
        }

        const confirmBtn = document.getElementById('modal-confirm-btn');
        const newBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

        newBtn.addEventListener('click', () => {
            const modalQty = document.getElementById('modal-product-quantity');
            if (modalQty) {
                const parsedQty = parseInt(modalQty.textContent, 10);
                if (!Number.isNaN(parsedQty)) {
                    cartItem.quantity = parsedQty;
                }
            }
            confirmAddToCart(cartItem);
        });

        setModalCloseCallback(() => {
            resetProductCard(ref);
        });

        modal.classList.remove('hidden');
    }
}
