// --- APP: COMMON INITIALIZATION ---

import { translatePage } from '../modules/i18n/i18n.js';
import { updateCartCount, migrateCartIfNeeded } from '../modules/cart/cart-storage.js';
import { handleMediaFallback } from '../modules/ui/media.js';
import { renderHeader } from '../modules/layout/header.js';
import { renderFooter } from '../modules/layout/footer.js';
import { renderConfirmationModal, setupConfirmationModal } from '../modules/layout/confirmation-modal.js';
import { renderCartDrawer, setupCartDrawer } from '../modules/layout/cart-drawer.js';

export function initCommon() {
    migrateCartIfNeeded();
    renderHeader();
    renderFooter();
    renderConfirmationModal();
    setupConfirmationModal();
    renderCartDrawer();
    setupCartDrawer();
    translatePage();
    updateCartCount();

    // Global error listener for media fallback
    window.addEventListener('error', handleMediaFallback, true);

    // Cross-tab sync
    window.addEventListener('storage', (e) => {
        if (e.key === 'shoppingCart') {
            updateCartCount();
        }
    });
}
