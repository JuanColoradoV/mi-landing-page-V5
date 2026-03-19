// --- INTERNATIONALIZATION LOGIC ---

import { TRANSLATIONS } from './translations.js';

const availableLangs = ['es', 'en', 'ru'];
let currentLang = localStorage.getItem('site_lang') || 'es';

if (!availableLangs.includes(currentLang)) {
    currentLang = 'es';
}

export function getCurrentLang() {
    return currentLang;
}

export function t(key) {
    return TRANSLATIONS[currentLang][key] || key;
}

export function setLanguage(lang) {
    if (availableLangs.includes(lang)) {
        localStorage.setItem('site_lang', lang);
        window.location.reload();
    }
}

export function translateColors(colorString) {
    if (!colorString) return "";
    return colorString.split(',').map(c => {
        const normalizedC = c.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const key = 'col_' + normalizedC.replace(/ /g, '_');
        return t(key) || c.trim();
    }).join(', ');
}

export function translatePage() {
    document.documentElement.lang = currentLang;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = TRANSLATIONS[currentLang][key];
            } else {
                el.textContent = TRANSLATIONS[currentLang][key];
            }
        }
    });
}
