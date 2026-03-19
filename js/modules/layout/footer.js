// --- LAYOUT: FOOTER ---

import { translatePage } from '../i18n/i18n.js';

export function renderFooter() {
    const footerHtml = `
    <div class="max-w-[1750px] mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-base text-gray-600">
            &copy; ${new Date().getFullYear()} TuTienda. <span data-i18n="footer_rights">Todos los derechos reservados.</span>
        </p>
    </div>
    `;
    const footer = document.querySelector('footer');
    if (footer) {
        footer.innerHTML = footerHtml;
        translatePage();
    }
}
