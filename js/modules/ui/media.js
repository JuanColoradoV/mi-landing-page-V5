// --- UI: MEDIA RENDERING (Consolidated) ---

import { t } from '../i18n/i18n.js';
import { sanitizeUrl } from '../security/sanitize.js';

export function buildPlaceholderDataUrl(text, options = {}) {
    const width = options.width || 600;
    const height = options.height || 400;
    const bg = options.bg || '#f3f4f6';
    const fg = options.fg || '#9ca3af';
    const safeText = String(text || '').slice(0, 40);
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${safeText}">` +
        `<rect width="100%" height="100%" fill="${bg}"/>` +
        `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${fg}" font-family="Arial, sans-serif" font-size="24">${safeText}</text>` +
        `</svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function handleMediaFallback(event) {
    const target = event.target;
    if (target instanceof HTMLImageElement) {
        const fallback = target.getAttribute('data-fallback-src');
        if (!fallback) return;
        if (target.dataset.fallbackApplied === 'true') return;
        target.dataset.fallbackApplied = 'true';
        target.src = fallback;
        return;
    }

    if (target instanceof HTMLVideoElement) {
        const action = target.getAttribute('data-fallback');
        if (action === 'next') {
            target.classList.add('hidden');
            const next = target.nextElementSibling;
            if (next && next.tagName === 'IMG') {
                next.classList.remove('hidden');
            }
        }
    }
}

// Consolidated media rendering - replaces 3 duplicated functions
function getPlaceholderUrl() {
    const placeholderText = t('placeholder_no_image');
    return buildPlaceholderDataUrl(placeholderText);
}

function getPosterUrl(safeUrl, placeholderUrl) {
    if (safeUrl && safeUrl.endsWith('.mp4')) {
        return safeUrl.replace(/[^/]+\.mp4$/, 'poster.jpg');
    }
    return placeholderUrl;
}

// Drawer media: small thumbnail, static image only (no video)
export function renderDrawerMedia(url, alt) {
    const placeholderUrl = getPlaceholderUrl();
    const safeUrl = sanitizeUrl(url);
    const posterUrl = getPosterUrl(safeUrl, placeholderUrl);

    if (safeUrl && safeUrl.endsWith('.mp4')) {
        return `<img src="${posterUrl}" alt="${alt}" class="w-16 h-16 object-cover rounded-md" loading="lazy" decoding="async" data-fallback-src="${placeholderUrl}">`;
    }
    return `<img src="${safeUrl || placeholderUrl}" alt="${alt}" class="w-16 h-16 object-cover rounded-md" loading="lazy" decoding="async" data-fallback-src="${placeholderUrl}">`;
}

// Cart page media: supports video with fallback
export function renderCartItemMedia(url, alt, className = "w-24 h-24 object-cover rounded-md") {
    const placeholderUrl = getPlaceholderUrl();
    const safeUrl = sanitizeUrl(url);
    const posterUrl = getPosterUrl(safeUrl, placeholderUrl);

    if (safeUrl && safeUrl.endsWith('.mp4')) {
        return `<video src="${safeUrl}" class="${className}" autoplay loop muted playsinline preload="metadata" poster="${posterUrl}" data-fallback="next"></video>` +
               `<img src="${posterUrl}" alt="${alt}" class="${className} media-fallback hidden" loading="lazy" decoding="async" data-fallback-src="${placeholderUrl}">`;
    }

    return `<img src="${safeUrl || placeholderUrl}" alt="${alt}" class="${className}" loading="lazy" decoding="async" data-fallback-src="${placeholderUrl}">`;
}

// Product card media content (inner content without wrapper)
export function renderProductMediaContent(product, overrideUrl) {
    const imageUrl = sanitizeUrl(overrideUrl || product.imageUrl);
    const nombre = product.nombre;
    const ref = product.ref;
    const placeholderUrl = buildPlaceholderDataUrl(ref);
    const safeImageUrl = imageUrl || placeholderUrl;
    const posterUrl = getPosterUrl(imageUrl, placeholderUrl);

    if (imageUrl && imageUrl.endsWith('.mp4')) {
        return '<video src="' + imageUrl + '" ' +
               'class="w-full h-full object-cover object-top" ' +
               'autoplay loop muted playsinline preload="metadata" poster="' + posterUrl + '" ' +
               'data-fallback="next">' +
               '</video>' +
               '<img src="' + posterUrl + '" alt="' + nombre + '" class="w-full h-full product-image media-fallback hidden" loading="lazy" decoding="async" width="600" height="400" data-fallback-src="' + placeholderUrl + '">';
    }
    return '<img src="' + safeImageUrl + '" alt="' + nombre + '" class="w-full h-full product-image" loading="lazy" decoding="async" width="600" height="400" data-fallback-src="' + placeholderUrl + '">';
}

// Product card media (with wrapper div)
export function renderProductMedia(product, overrideUrl) {
    return '<div class="product-media-content">' + renderProductMediaContent(product, overrideUrl) + '</div>';
}
