// --- PRODUCTS: GRID RENDERING ---

import { t } from '../i18n/i18n.js';
import { escapeHTML } from '../security/sanitize.js';
import { getProductsData } from '../data/products-data.js';
import { renderProductMedia } from '../ui/media.js';
import {
    renderColorSelector,
    renderSizePanel,
    renderQuantitySelector,
    formatPriceBadge,
    formatDescription,
    isOfferPrice,
    setSizePanelVisibility
} from './product-card.js';
import { selectColor, selectSize, addToCartHandler, updateQuantityInput } from './add-to-cart.js';

export function renderProductGrid(containerId) {
    const container = document.getElementById(containerId);
    const productsData = getProductsData();

    if (!container || !productsData) return;

    try {
        const isOffersPage = window.location.pathname.endsWith('ofertas.html');
        let productsToRender = productsData;
        if (isOffersPage) {
            const offerKey = t('offer_text').toLowerCase();
            productsToRender = productsData.filter(p => p.precio.toLowerCase().includes(offerKey));
        }

        if (productsToRender.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-600 md:col-span-3 py-12">' + t('no_products') + '</p>';
            return;
        }

        let allProductsHtml = '';

        productsToRender.forEach(product => {
            const canBeBought = product.numericPrice > 0;
            const safeName = escapeHTML(product.nombre);
            const hasOffer = isOfferPrice(product.precio);
            const collectionBadge = '<span class="collection-trapezoid">' + t('badge_collection') + '</span>';

            allProductsHtml +=
                '<div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col card-raise self-start">' +
                    '<div class="product-media relative" data-ref="' + product.ref + '">' +
                        renderProductMedia(product) +
                        (hasOffer ? '<span class="offer-trapezoid">' + t('badge_offer') + '</span>' : collectionBadge) +
                        formatPriceBadge(product.precio) +
                        renderSizePanel(product) +
                    '</div>' +
                    '<div class="p-5 flex flex-col flex-grow">' +
                        '<div class="flex flex-wrap items-center gap-2 mb-1">' +
                            '<h3 class="text-lg font-semibold text-gray-800 flex-1 min-w-[60%]">' + safeName + '</h3>' +
                        '</div>' +
                        '<p class="text-xs text-gray-500 mb-3">' + t('label_ref') + ' ' + escapeHTML(product.ref) + '</p>' +
                        '<div>' + renderColorSelector(product) + '</div>' +
                        renderQuantitySelector(product) +
                        formatDescription(product.descripcion, product.ref) +
                        '<div class="mt-auto pt-3">' +
                            '<button ' +
                                'class="add-to-cart-btn inline-block text-center font-medium py-2.5 px-4 text-sm rounded-md transition-colors shadow-md active:transform active:scale-95 w-full ' +
                                (hasOffer ? 'btn-offer ' : 'btn-primary ') +
                                (!canBeBought ? 'opacity-50 cursor-not-allowed' : '') + '" ' +
                                'data-ref="' + product.ref + '" ' +
                                (!canBeBought ? 'disabled' : '') +
                            '>' +
                                (canBeBought ? t('btn_add') : t('btn_consult')) +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        });

        container.innerHTML = allProductsHtml;

        // --- Event Delegation ---
        const getDetailItems = () => Array.from(container.querySelectorAll('[data-details]'));
        const closeDetail = (detailItem) => {
            if (!detailItem) return;
            const toggle = detailItem.querySelector('[data-details-toggle]');
            const panel = detailItem.querySelector('[data-details-panel]');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
            if (panel) panel.setAttribute('hidden', '');
            detailItem.classList.remove('is-open');
        };
        const openDetail = (detailItem) => {
            if (!detailItem) return;
            const toggle = detailItem.querySelector('[data-details-toggle]');
            const panel = detailItem.querySelector('[data-details-panel]');
            if (toggle) toggle.setAttribute('aria-expanded', 'true');
            if (panel) panel.removeAttribute('hidden');
            detailItem.classList.add('is-open');
        };

        getDetailItems().forEach(closeDetail);

        container.addEventListener('click', (event) => {
            const qtyBtn = event.target.closest('.qty-change');
            if (qtyBtn) {
                const ref = qtyBtn.dataset.qtyRef;
                const change = parseInt(qtyBtn.dataset.change, 10);
                if (ref && !Number.isNaN(change)) {
                    updateQuantityInput(ref, change);
                }
                return;
            }

            const closeBtn = event.target.closest('[data-size-panel-close]');
            if (closeBtn) {
                const panel = closeBtn.closest('[data-size-panel]');
                if (panel) {
                    const ref = panel.getAttribute('data-ref');
                    setSizePanelVisibility(ref, false);
                }
                return;
            }

            const colorBtn = event.target.closest('.color-option-btn');
            if (colorBtn) {
                selectColor(colorBtn);
                return;
            }

            const sizeBtn = event.target.closest('.size-option-btn');
            if (sizeBtn) {
                selectSize(sizeBtn);
                return;
            }

            const toggle = event.target.closest('[data-details-toggle]');
            if (toggle) {
                const detailItem = toggle.closest('[data-details]');
                if (!detailItem) return;
                const isOpen = detailItem.classList.contains('is-open');
                getDetailItems().forEach(closeDetail);
                if (!isOpen) {
                    openDetail(detailItem);
                }
                return;
            }

            const button = event.target.closest('.add-to-cart-btn');
            if (!button || button.disabled) return;
            const ref = button.dataset.ref;
            if (ref) {
                addToCartHandler(ref);
            }
        });
    } catch (error) {
        console.error("Error rendering products:", error);
    }
}
