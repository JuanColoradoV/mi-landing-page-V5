// --- APP: CONTACT PAGE ENTRY POINT ---

import { initCommon } from './init-common.js';
import { initContactForm } from '../modules/contact/contact-form.js';

document.addEventListener('DOMContentLoaded', () => {
    initCommon();
    initContactForm();
});
