// --- LAYOUT: HEADER ---

import { setLanguage, translatePage } from '../i18n/i18n.js';
import { updateCartCount } from '../cart/cart-storage.js';

function highlightActiveLink(headerElement) {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const desktopLinks = headerElement.querySelectorAll('.hidden.md\\:flex a');
    desktopLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('nav-link--active');
        }
    });

    const mobileLinks = headerElement.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('nav-link-mobile--active');
        }
    });
}

function setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('icon-menu-open');
    const iconClose = document.getElementById('icon-menu-close');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !isExpanded);

            if (isExpanded) {
                menu.classList.add('hidden');
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
            } else {
                menu.classList.remove('hidden');
                iconOpen.classList.add('hidden');
                iconClose.classList.remove('hidden');
            }
        });
    }
}

function updateActiveLanguageState() {
    const currentLang = localStorage.getItem('site_lang') || 'es';
    const buttons = document.querySelectorAll('.lang-btn');

    buttons.forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLang) {
            btn.classList.remove('border-transparent', 'opacity-50');
            btn.classList.add('border-indigo-600', 'bg-indigo-50', 'opacity-100');
        } else {
            btn.classList.add('border-transparent', 'opacity-50');
            btn.classList.remove('border-indigo-600', 'bg-indigo-50', 'opacity-100');
        }
    });
}

function setupLanguageButtons(headerElement) {
    if (!headerElement) return;
    const buttons = headerElement.querySelectorAll('.lang-btn[data-lang]');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang) {
                setLanguage(lang);
            }
        });
    });
}

export function renderHeader() {
    const headerHtml = `
    <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">

                <!-- Logo -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="index.html" class="text-2xl font-bold text-gray-900">TuTienda</a>
                </div>

                <!-- Desktop Menu (Hidden on mobile) -->
                <div class="hidden md:flex md:space-x-8">
                    <a href="index.html" class="nav-link font-medium px-3 py-2 rounded-md text-sm" data-i18n="nav_home">Nueva Colección</a>
                    <a href="ofertas.html" class="nav-link font-medium px-3 py-2 rounded-md text-sm" data-i18n="nav_offers">Ofertas</a>
                    <a href="contacto.html" class="nav-link font-medium px-3 py-2 rounded-md text-sm" data-i18n="nav_contact">Contacto</a>
                </div>

                <!-- Right Side Icons (Lang + Cart) -->
                <div class="flex items-center space-x-4">

                    <!-- Language Selector -->
                    <div class="hidden sm:flex items-center space-x-2 mr-2">
                        <button type="button" class="lang-btn text-xl hover:scale-110 transition-transform focus:outline-none p-1 rounded-md border-2 border-transparent" data-lang="es" title="Español" aria-label="Seleccionar Español">🇨🇴</button>
                        <button type="button" class="lang-btn text-xl hover:scale-110 transition-transform focus:outline-none p-1 rounded-md border-2 border-transparent" data-lang="en" title="English" aria-label="Select English">🇺🇸</button>
                        <button type="button" class="lang-btn text-xl hover:scale-110 transition-transform focus:outline-none p-1 rounded-md border-2 border-transparent" data-lang="ru" title="Русский" aria-label="Выбрать Русский">🇷🇺</button>
                    </div>

                    <!-- Cart -->
                    <div class="relative">
                        <a href="carrito.html" id="cart-drawer-trigger" class="nav-icon text-gray-600 p-1 block" aria-haspopup="dialog" aria-controls="cart-drawer" aria-expanded="false">
                            <span class="sr-only" data-i18n="cart_title">Ver carrito</span>
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            <!-- Badge -->
                            <span class="cart-count-badge absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">0</span>
                        </a>
                    </div>

                    <!-- Mobile Menu Button -->
                    <div class="-mr-2 flex md:hidden ml-4">
                        <button type="button" id="mobile-menu-btn" class="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-expanded="false" aria-controls="mobile-menu">
                            <span class="sr-only">Abrir menú principal</span>
                            <!-- Icono Menu (Hamburguesa) -->
                            <svg id="icon-menu-open" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <!-- Icono Cerrar (X) - oculto por defecto -->
                            <svg id="icon-menu-close" class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Menu Panel (Hidden by default) -->
        <div class="hidden md:hidden" id="mobile-menu">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                <a href="index.html" class="nav-link-mobile block px-3 py-2 rounded-md text-base font-medium" data-i18n="nav_home">Nueva Colección</a>
                <a href="ofertas.html" class="nav-link-mobile block px-3 py-2 rounded-md text-base font-medium" data-i18n="nav_offers">Ofertas</a>
                <a href="contacto.html" class="nav-link-mobile block px-3 py-2 rounded-md text-base font-medium" data-i18n="nav_contact">Contacto</a>

                <!-- Mobile Language Selector -->
                <div class="flex items-center space-x-4 px-3 py-3 mt-2 border-t border-gray-100">
                    <span class="text-sm text-gray-600">Idioma:</span>
                    <button type="button" class="lang-btn text-2xl p-1 rounded-md border-2 border-transparent" data-lang="es" aria-label="Seleccionar Español">🇨🇴</button>
                    <button type="button" class="lang-btn text-2xl p-1 rounded-md border-2 border-transparent" data-lang="en" aria-label="Select English">🇺🇸</button>
                    <button type="button" class="lang-btn text-2xl p-1 rounded-md border-2 border-transparent" data-lang="ru" aria-label="Выбрать Русский">🇷🇺</button>
                </div>
            </div>
        </div>
    </nav>
    `;

    const header = document.querySelector('header');
    if (header) {
        header.innerHTML = headerHtml;
        highlightActiveLink(header);
        setupMobileMenu();
        updateCartCount();
        translatePage();
        updateActiveLanguageState();
        setupLanguageButtons(header);
    }
}
