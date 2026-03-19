// --- CONTACT: FORM VALIDATION ---

import { t } from '../i18n/i18n.js';
import { showToast } from '../ui/toast.js';

const forbiddenPatterns = [
    /<script\b[^>]*>([\s\S]*?)<\/script>/im,
    /javascript:/im,
    /vbscript:/im,
    /onload=/im,
    /onerror=/im,
    /onclick=/im,
    /\b(groseria|palabrota|insulto|estupido|idiota|tonto)\b/im
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showError(fieldId, message) {
    const errorElement = document.getElementById(`error-${fieldId}`);
    const inputElement = document.getElementById(fieldId);

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

    if (inputElement) {
        inputElement.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        inputElement.classList.remove('border-gray-300', 'focus:ring-indigo-500', 'focus:border-indigo-500');
    }
}

function clearError(fieldId) {
    const errorElement = document.getElementById(`error-${fieldId}`);
    const inputElement = document.getElementById(fieldId);

    if (errorElement) {
        errorElement.classList.add('hidden');
        errorElement.textContent = '';
    }

    if (inputElement) {
        inputElement.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        inputElement.classList.add('border-gray-300', 'focus:ring-indigo-500', 'focus:border-indigo-500');
    }
}

function containsForbiddenContent(text) {
    for (const pattern of forbiddenPatterns) {
        if (pattern.test(text)) {
            return true;
        }
    }
    return false;
}

export function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const trapField = document.getElementById('website_trap');
            if (trapField && trapField.value !== '') {
                console.log("Spam attempt blocked.");
                showToast(t('toast_contact_spam'), 'warning');
                contactForm.reset();
                return;
            }

            let isValid = true;

            const nameInput = document.getElementById('name');
            const nameValue = nameInput.value.trim();
            clearError('name');

            if (!nameValue) {
                showError('name', t('error_name_required'));
                isValid = false;
            } else if (containsForbiddenContent(nameValue)) {
                showError('name', t('error_name_forbidden'));
                isValid = false;
            }

            const emailInput = document.getElementById('email');
            const emailValue = emailInput.value.trim();
            clearError('email');

            if (!emailValue) {
                showError('email', t('error_email_required'));
                isValid = false;
            } else if (!emailRegex.test(emailValue)) {
                showError('email', t('error_email_invalid'));
                isValid = false;
            }

            const subjectInput = document.getElementById('subject');
            const subjectValue = subjectInput.value.trim();
            clearError('subject');

            if (containsForbiddenContent(subjectValue)) {
                showError('subject', t('error_subject_forbidden'));
                isValid = false;
            }

            const messageInput = document.getElementById('message');
            const messageValue = messageInput.value.trim();
            clearError('message');

            if (!messageValue) {
                showError('message', t('error_message_required'));
                isValid = false;
            } else if (containsForbiddenContent(messageValue)) {
                showError('message', t('error_message_forbidden'));
                isValid = false;
            }

            if (isValid) {
                showToast(t('toast_contact_success'), 'success');
                contactForm.reset();
            }
        });

        const inputs = ['name', 'email', 'subject', 'message'];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => clearError(id));
            }
        });
    }
}
