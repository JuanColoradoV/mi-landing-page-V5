// --- LAYOUT: CONFIRMATION MODAL ---

import { t } from '../i18n/i18n.js';

let onCloseCallback = null;

export function setModalCloseCallback(fn) {
    onCloseCallback = fn;
}

export function closeConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    if (typeof onCloseCallback === 'function') {
        onCloseCallback();
        onCloseCallback = null;
    }
}

export function renderConfirmationModal() {
    const modalHtml = `
    <div id="confirmation-modal" class="fixed inset-0 z-[100] hidden overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" data-modal-backdrop></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <!-- Modal Panel -->
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="w-full">
                        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            ${t('modal_confirm_title')}
                        </h3>
                        <div class="mt-4 bg-gray-50 p-4 rounded-lg">
                            <div class="flex flex-col sm:flex-row sm:items-start gap-4">
                                <div class="flex items-start gap-4 flex-1">
                                    <img id="modal-product-image" src="" alt="" class="w-24 h-24 sm:w-28 sm:h-28 modal-product-image rounded-lg border border-gray-200 bg-white" loading="lazy" decoding="async">
                                    <div class="min-w-0">
                                        <p id="modal-product-name" class="text-base font-semibold text-gray-900"></p>
                                        <div class="mt-2 flex flex-wrap gap-2">
                                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-xs font-medium text-gray-700 border border-gray-200">
                                                <span class="text-gray-500">${t('color_label')}</span>
                                                <span id="modal-product-color" class="text-gray-900 font-semibold"></span>
                                            </span>
                                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-xs font-medium text-gray-700 border border-gray-200">
                                                <span class="text-gray-500">${t('size_label')}</span>
                                                <span id="modal-product-size" class="text-gray-900 font-semibold"></span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="sm:w-44 flex-shrink-0">
                                    <p class="text-[0.7rem] uppercase tracking-wide text-gray-500 mb-2">${t('qty_label')}</p>
                                    <div class="flex items-center">
                                        <button type="button" id="modal-qty-decrease" class="w-7 h-7 rounded-l border flex items-center justify-center font-bold quantity-change" aria-label="${t('aria_decrease_qty')}">-</button>
                                        <span id="modal-product-quantity" class="w-8 h-7 border-t border-b border-gray-300 flex items-center justify-center text-gray-900 text-sm bg-white">1</span>
                                        <button type="button" id="modal-qty-increase" class="w-7 h-7 rounded-r border flex items-center justify-center font-bold quantity-change" aria-label="${t('aria_increase_qty')}">+</button>
                                    </div>
                                    <p class="text-xs text-gray-500 mt-4">${t('label_total')}</p>
                                    <p class="text-lg font-bold text-gray-900"><span id="modal-product-total"></span></p>
                                </div>
                            </div>
                        </div>
                        <p class="text-sm text-gray-600 mt-3">
                            ${t('modal_confirm_question')}
                        </p>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" id="modal-confirm-btn" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                        ${t('modal_btn_confirm')}
                    </button>
                    <button type="button" data-modal-close class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        ${t('modal_btn_cancel')}
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

export function setupConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    if (!modal) return;
    const backdrop = modal.querySelector('[data-modal-backdrop]');
    const closeButtons = modal.querySelectorAll('[data-modal-close]');

    if (backdrop) {
        backdrop.addEventListener('click', closeConfirmationModal);
    }
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeConfirmationModal);
    });
}
