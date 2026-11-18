// ==========================================================
// 1. ЛОГИКА ДЛЯ МОДАЛЬНОГО ОКНА С ПОДРОБНОСТЯМИ О ТОВАРЕ
// ==========================================================
const productDialog = document.getElementById('product-dialog');
const closeProductBtn = document.getElementById('close-product-dialog');
const openOrderFromProductBtn = document.getElementById('open-order-from-product');
const actionButtons = document.querySelectorAll('.product-card__button');
let currentProductTitle = '';

if (productDialog) {
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            if (action === 'details') {
                const titleEl = document.getElementById('product-title');
                const priceEl = document.getElementById('product-price');
                const descEl = document.getElementById('product-desc');
                const imgEl = document.getElementById('product-image');
                const catEl = document.getElementById('product-category');
                const stockEl = document.getElementById('product-stock');

                if (titleEl) titleEl.textContent = button.dataset.title;
                if (priceEl) priceEl.textContent = button.dataset.price;
                if (descEl) descEl.textContent = button.dataset.desc;
                if (imgEl) imgEl.src = button.dataset.image || 'images/default.jpg';
                if (catEl) catEl.textContent = button.dataset.category || '—';
                if (stockEl) stockEl.textContent = button.dataset.stock || 'В наличии';

                currentProductTitle = button.dataset.title;
                productDialog.showModal();
            }
        });
    });

    if (closeProductBtn) {
        closeProductBtn.addEventListener('click', () => productDialog.close());
    }

    if (openOrderFromProductBtn) {
        openOrderFromProductBtn.addEventListener('click', () => {
            productDialog.close();
            const orderDialog = document.getElementById('order-dialog');
            const selectedProductInput = document.getElementById('selected-product');
            
            if (orderDialog && selectedProductInput) {
                selectedProductInput.value = currentProductTitle;
                orderDialog.showModal();
            }
        });
    }
}

// ==========================================================
// 2. ЛОГИКА ДЛЯ ФОРМЫ ЗАКАЗА
// ==========================================================
const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button[data-action="order"]');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

// Выполняем логику заказа ТОЛЬКО если есть все необходимые элементы
if (orderDialog && orderButtons && selectedProductInput) {
    orderButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedProductInput.value = button.dataset.title;
            orderDialog.showModal();
        });
    });

    if (closeDialogButton) {
        closeDialogButton.addEventListener('click', () => orderDialog.close());
    }
}

// Обрабатываем отправку формы ТОЛЬКО если есть форма и сообщение
if (orderForm && successMessage) {
    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const formElements = Array.from(orderForm.elements);
        formElements.forEach(el => {
            if (el.willValidate) el.removeAttribute('aria-invalid');
        });

        if (!orderForm.checkValidity()) {
            formElements.forEach(el => {
                if (el.willValidate && !el.checkValidity()) {
                    el.setAttribute('aria-invalid', 'true');
                }
            });
            orderForm.reportValidity();
            return;
        }

        successMessage.hidden = false;
        orderForm.reset();
        
        const dialog = document.getElementById('order-dialog');
        if (dialog) dialog.close();
    });
}

// ==========================================================
// 3. АККОРДЕОН (Теперь этот код точно выполнится)
// ==========================================================
const accordionHeaders = document.querySelectorAll('.accordion__header');

if (accordionHeaders.length > 0) {
    accordionHeaders.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.accordion__item');
            const content = item.querySelector('.accordion__content');
            const isOpen = item.classList.contains('open');

            // Закрываем все остальные
            document.querySelectorAll('.accordion__item').forEach(i => {
                i.classList.remove('open');
                const c = i.querySelector('.accordion__content');
                if (c) {
                    c.style.maxHeight = '0';
                    c.style.padding = '0';
                }
            });

            if (!isOpen) {
                item.classList.add('open');
                if (content) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.padding = '16px';
                }
            }
        });
    });
}

