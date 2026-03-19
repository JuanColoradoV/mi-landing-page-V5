// --- CURRENCY & FORMATTING ---

import { getCurrentLang } from '../i18n/i18n.js';

const CURRENCY_CONFIG = {
    es: { code: 'COP', rate: 1, locale: 'es-CO' },
    en: { code: 'USD', rate: 0.00024, locale: 'en-US' },
    ru: { code: 'RUB', rate: 0.023, locale: 'ru-RU' }
};

export function formatMoney(amountInCOP) {
    const safeAmount = amountInCOP || 0;
    const lang = getCurrentLang();
    const config = CURRENCY_CONFIG[lang] || CURRENCY_CONFIG['es'];
    const convertedAmount = safeAmount * config.rate;

    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.code,
        minimumFractionDigits: (config.code === 'COP') ? 0 : 2,
        maximumFractionDigits: (config.code === 'COP') ? 0 : 2
    }).format(convertedAmount);
}
