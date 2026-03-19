// --- APP: HOME PAGE ENTRY POINT ---

import { initCommon } from './init-common.js';
import { renderProductGrid } from '../modules/products/product-grid.js';

document.addEventListener('DOMContentLoaded', () => {
    initCommon();
    renderProductGrid('products-container');
});
