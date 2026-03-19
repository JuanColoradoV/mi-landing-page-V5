// --- PRODUCTS: COLOR CONFIGURATION ---

import { buildPlaceholderDataUrl } from '../ui/media.js';

export const colorMap = {
    // Spanish
    'negro': 'bg-black',
    'blanco': 'bg-white border border-gray-300',
    'rojo': 'bg-red-600',
    'azul': 'bg-blue-600',
    'beige': 'bg-yellow-100',
    'camel': 'bg-yellow-700',
    'amarillo': 'bg-yellow-400',
    'rosa intenso': 'bg-pink-600',
    'palo de rosa': 'bg-pink-300',
    'vino': 'bg-red-800',
    'marrón': 'bg-yellow-900',
    'marron': 'bg-yellow-900',
    'estampado': 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400',

    // English
    'black': 'bg-black',
    'white': 'bg-white border border-gray-300',
    'red': 'bg-red-600',
    'blue': 'bg-blue-600',
    'yellow': 'bg-yellow-400',
    'hot pink': 'bg-pink-600',
    'rosewood': 'bg-pink-300',
    'wine': 'bg-red-800',
    'brown': 'bg-yellow-900',
    'print': 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400',

    // Russian
    'черный': 'bg-black',
    'белый': 'bg-white border border-gray-300',
    'красный': 'bg-red-600',
    'синий': 'bg-blue-600',
    'бежевый': 'bg-yellow-100',
    'кэмел': 'bg-yellow-700',
    'желтый': 'bg-yellow-400',
    'ярко-розовый': 'bg-pink-600',
    'пыльная роза': 'bg-pink-300',
    'бордовый': 'bg-red-800',
    'коричневый': 'bg-yellow-900',
    'принт': 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400'
};

export const colorAliases = {
    'blanco': 'blanco',
    'white': 'blanco',
    'белый': 'blanco',
    'negro': 'negro',
    'black': 'negro',
    'черный': 'negro',
    'rojo': 'rojo',
    'red': 'rojo',
    'красный': 'rojo',
    'azul': 'azul',
    'blue': 'azul',
    'синий': 'azul',
    'beige': 'beige',
    'бежевый': 'beige',
    'camel': 'camel',
    'кэмел': 'camel',
    'amarillo': 'amarillo',
    'yellow': 'amarillo',
    'желтый': 'amarillo',
    'rosa intenso': 'rosa_intenso',
    'hot pink': 'rosa_intenso',
    'ярко-розовый': 'rosa_intenso',
    'palo de rosa': 'palo_de_rosa',
    'rosewood': 'palo_de_rosa',
    'пыльная роза': 'palo_de_rosa',
    'vino': 'vino',
    'wine': 'vino',
    'бордовый': 'vino',
    'marrón': 'marron',
    'marron': 'marron',
    'brown': 'marron',
    'коричневый': 'marron',
    'estampado': 'estampado',
    'print': 'estampado',
    'принт': 'estampado'
};

export const colorHexMap = {
    blanco: 'f9fafb',
    negro: '111827',
    rojo: 'dc2626',
    azul: '2563eb',
    beige: 'f5f5dc',
    camel: 'b45309',
    amarillo: 'facc15',
    rosa_intenso: 'db2777',
    palo_de_rosa: 'fbcfe8',
    vino: '7f1d1d',
    marron: '78350f',
    estampado: '8b5cf6'
};

const USE_COLOR_PLACEHOLDERS = false;

export function canonicalizeColor(label) {
    if (!label) return '';
    const normalized = label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    return colorAliases[normalized] || normalized.replace(/\s+/g, '_');
}

function getContrastText(hex) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.6 ? '111827' : 'ffffff';
}

function buildColorPlaceholder(label, key) {
    const hex = colorHexMap[key] || 'e5e7eb';
    const textHex = getContrastText(hex);
    return buildPlaceholderDataUrl(label, { bg: `#${hex}`, fg: `#${textHex}` });
}

export function ensureColorMedia(product) {
    if (product.colorMedia || !product.colores || !USE_COLOR_PLACEHOLDERS) return;
    const mapping = {};
    product.colores.split(',').forEach(raw => {
        const label = raw.trim();
        if (!label) return;
        const key = canonicalizeColor(label);
        mapping[key] = buildColorPlaceholder(label, key);
    });
    product.colorMedia = mapping;
}
