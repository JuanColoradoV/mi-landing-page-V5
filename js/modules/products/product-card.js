// --- PRODUCTS: CARD RENDERING ---

import { t } from '../i18n/i18n.js';
import { escapeHTML, sanitizeUrl } from '../security/sanitize.js';
import { buildPlaceholderDataUrl, renderProductMediaContent, renderProductMedia } from '../ui/media.js';
import { colorMap, canonicalizeColor, ensureColorMedia } from './color-config.js';
import { getProductsData } from '../data/products-data.js';

export function formatPriceDisplay(priceString) {
    const cleanPrice = priceString.trim();
    const offerKey = t('offer_text').toLowerCase();

    if (cleanPrice.toLowerCase().includes(offerKey)) {
        const parts = cleanPrice.split(new RegExp(offerKey, 'i'));
        if (parts.length >= 2) {
            const originalPrice = escapeHTML(parts[0].trim());
            const salePrice = escapeHTML(parts[1].trim());
            return '<p class="text-xl font-bold text-red-600">' + salePrice +
                   '<span class="ml-2 text-base font-normal text-gray-600 line-through">' + originalPrice + '</span></p>';
        }
    }

    return '<p class="text-xl font-bold text-gray-900">' + escapeHTML(cleanPrice) + '</p>';
}

export function formatPriceBadge(priceString) {
    const cleanPrice = priceString.trim();
    const offerKey = t('offer_text').toLowerCase();
    const consultKey = t('price_consult').toLowerCase();

    if (cleanPrice.toLowerCase().includes(consultKey)) {
        return '<div class="price-badge price-badge--consult"><span class="price-text">' + escapeHTML(cleanPrice) + '</span></div>';
    }

    if (cleanPrice.toLowerCase().includes(offerKey)) {
        const parts = cleanPrice.split(new RegExp(offerKey, 'i'));
        if (parts.length >= 2) {
            const originalPrice = escapeHTML(parts[0].trim());
            const salePrice = escapeHTML(parts[1].trim());
            return '<div class="price-badge price-badge--sale">' +
                   '<span class="price-new">' + salePrice + '</span>' +
                   '<span class="price-old">' + originalPrice + '</span>' +
                   '</div>';
        }
    }

    return '<div class="price-badge"><span class="price-text">' + escapeHTML(cleanPrice) + '</span></div>';
}

export function isOfferPrice(priceString) {
    const cleanPrice = String(priceString || '').toLowerCase();
    const offerKey = t('offer_text').toLowerCase();
    return cleanPrice.includes(offerKey);
}

export function renderColorSelector(product) {
    const colors = product.colores.split(',').map(c => c.trim());
    let html = '<div class="mb-1.5"><p class="text-[0.7rem] font-semibold text-gray-700 mb-2 uppercase tracking-wide">' + t('color_label') + '</p><div class="flex flex-wrap gap-1.5">';

    colors.forEach(color => {
        const safeColor = escapeHTML(color);
        const lowerColor = safeColor.toLowerCase();

        let twClass = colorMap[lowerColor];

        if (!twClass) {
            const normalized = lowerColor.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            twClass = colorMap[normalized];
        }

        if (!twClass) {
            if (lowerColor.includes('marron') || lowerColor.includes('brown')) twClass = 'bg-yellow-900';
            else if (lowerColor.includes('rosa') || lowerColor.includes('pink')) twClass = 'bg-pink-400';
        }

        if (!twClass) {
            console.warn(`Color not found in map: "${lowerColor}"`);
            twClass = 'bg-gray-400';
        }

        html += '<button type="button" ' +
                'class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-200 hover:scale-110 transition-transform focus:outline-none color-option-btn ' + twClass + '" ' +
                'title="' + safeColor + '" ' +
                'data-ref="' + product.ref + '" ' +
                'data-value="' + safeColor + '">' +
                '</button>';
    });

    html += '</div></div>';
    return html;
}

export function renderSizeSelector(product) {
    const sizes = product.tallas.split(',').map(s => s.trim());
    let html = '<div class="flex flex-wrap gap-2">';

    sizes.forEach(size => {
        const safeSize = escapeHTML(size);
        html += '<button type="button" ' +
                'class="min-w-[2.2rem] h-8 px-2 rounded-md border border-gray-300 text-[0.7rem] font-semibold text-gray-700 hover:border-indigo-500 hover:text-indigo-600 bg-white transition-colors size-option-btn" ' +
                'data-ref="' + product.ref + '" ' +
                'data-value="' + safeSize + '">' +
                safeSize +
                '</button>';
    });

    html += '</div>';
    return html;
}

export function renderSizePanel(product) {
    return `
        <div class="size-panel" data-size-panel data-ref="${product.ref}" aria-hidden="true">
            <div class="size-panel-inner">
                <button type="button" class="size-panel-close" data-size-panel-close aria-label="${t('aria_close')}">×</button>
                <p class="size-panel-title">${t('select_size_prompt')}</p>
                ${renderSizeSelector(product)}
            </div>
        </div>
    `;
}

export function renderQuantitySelector(product) {
    return `
    <div class="mb-1.5 hidden">
        <p class="text-[0.7rem] font-semibold text-gray-700 mb-2 uppercase tracking-wide">${t('qty_label')}</p>
        <div class="flex items-center">
            <button type="button" class="qty-change w-6 h-6 rounded-l border border-gray-300 bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 focus:outline-none" data-qty-ref="${product.ref}" data-change="-1" aria-label="${t('aria_decrease_qty')}">-</button>
            <input type="number" id="qty-${product.ref}" value="1" min="1" readonly class="w-9 h-6 border-t border-b border-gray-300 text-center text-[0.7rem] text-gray-900 focus:outline-none bg-white">
            <button type="button" class="qty-change w-6 h-6 rounded-r border border-gray-300 bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 focus:outline-none" data-qty-ref="${product.ref}" data-change="1" aria-label="${t('aria_increase_qty')}">+</button>
        </div>
    </div>
    `;
}

function sanitizeId(value) {
    const cleaned = String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return cleaned || 'item';
}

export function formatDescription(description, ref) {
    const safeDesc = escapeHTML(description);
    const safeRef = sanitizeId(ref);
    const panelId = `details-${safeRef}`;
    const buttonId = `${panelId}-toggle`;
    return `
        <div class="product-details mt-2 mb-4 text-sm text-gray-600" data-details>
            <button type="button" class="details-toggle text-[0.7rem] font-semibold text-gray-700 uppercase tracking-wide" data-details-toggle aria-expanded="false" aria-controls="${panelId}" id="${buttonId}">
                <span>${t('details_label')}</span>
                <span class="details-icon" aria-hidden="true">+</span>
            </button>
            <div class="details-panel" id="${panelId}" data-details-panel role="region" aria-labelledby="${buttonId}" hidden>
                <p class="text-xs text-gray-600">${safeDesc}</p>
            </div>
        </div>
    `;
}

export function setSizePanelVisibility(ref, isVisible) {
    const panel = document.querySelector(`.size-panel[data-ref="${ref}"]`);
    if (!panel) return;
    if (isVisible) {
        panel.classList.add('is-visible');
        panel.setAttribute('aria-hidden', 'false');
    } else {
        panel.classList.remove('is-visible');
        panel.setAttribute('aria-hidden', 'true');
    }
}

export function getMediaForColor(product, colorLabel) {
    if (!colorLabel) return product.imageUrl;
    ensureColorMedia(product);
    const key = canonicalizeColor(colorLabel);
    if (product.colorMedia) {
        if (product.colorMedia[key]) return product.colorMedia[key];
        if (product.colorMedia[colorLabel]) return product.colorMedia[colorLabel];
        const lowerLabel = String(colorLabel).toLowerCase();
        if (product.colorMedia[lowerLabel]) return product.colorMedia[lowerLabel];
    }
    return product.imageUrl;
}

export function updateProductMedia(ref, colorLabel) {
    const productsData = getProductsData();
    const product = productsData ? productsData.find(p => p.ref === ref) : null;
    if (!product) return;
    const mediaUrl = getMediaForColor(product, colorLabel);
    const mediaContainer = document.querySelector(`.product-media[data-ref="${ref}"]`);
    if (!mediaContainer) return;
    const content = mediaContainer.querySelector('.product-media-content');
    if (content) {
        content.innerHTML = renderProductMediaContent(product, mediaUrl);
    } else {
        mediaContainer.innerHTML = renderProductMedia(product, mediaUrl);
    }
}

export function getModalImageData(product, selectedColor) {
    const placeholderText = t('placeholder_no_image');
    const placeholderUrl = buildPlaceholderDataUrl(placeholderText);
    let mediaUrl = getMediaForColor(product, selectedColor) || product.imageUrl;
    mediaUrl = sanitizeUrl(mediaUrl);
    if (mediaUrl && mediaUrl.endsWith('.mp4')) {
        mediaUrl = mediaUrl.replace(/[^/]+\.mp4$/, 'poster.jpg');
    }
    return {
        src: mediaUrl || placeholderUrl,
        placeholder: placeholderUrl
    };
}
