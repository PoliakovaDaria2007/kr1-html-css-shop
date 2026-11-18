// ==========================================================
// 1. АККОРДЕОН
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    const accordionHeaders = document.querySelectorAll('.accordion__header');
    
    if (accordionHeaders.length > 0) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.closest('.accordion__item');
                const content = item.querySelector('.accordion__content');
                const isOpen = item.classList.contains('open');
                
                // Закрываем все открытые элементы
                document.querySelectorAll('.accordion__item').forEach(i => {
                    i.classList.remove('open');
                    const c = i.querySelector('.accordion__content');
                    if (c) {
                        c.style.maxHeight = '0';
                        c.style.padding = '0';
                    }
                });
                
                // Открываем текущий элемент
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
});

// ==========================================================
// 2. МОДАЛЬНОЕ ОКНО С ПОДРОБНОСТЯМИ О ТОВАРЕ
// ==========================================================

const productDialog = document.getElementById('product-dialog');

if (productDialog) {
    const closeProductBtn = document.getElementById('close-product-dialog');
    const openOrderFromProductBtn = document.getElementById('open-order-from-product');
    const actionButtons = document.querySelectorAll('.product-card__button');
    let currentProductTitle = '';

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
            const orderDialogEl = document.getElementById('order-dialog');
            const selectedProductInput = document.getElementById('selected-product');
            
            if (orderDialogEl && selectedProductInput) {
                selectedProductInput.value = currentProductTitle;
                orderDialogEl.showModal();
            }
        });
    }
}

// ==========================================================
// 3. ФОРМА ЗАКАЗА
// ==========================================================

const orderDialog = document.getElementById('order-dialog');
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

if (orderDialog && orderForm && successMessage) {
    const orderButtons = document.querySelectorAll('.product-card__button[data-action="order"]');
    const closeDialogButton = document.getElementById('close-order-dialog');
    const selectedProductInput = document.getElementById('selected-product');

    // Открытие формы заказа по кнопке в карточке товара
    orderButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (selectedProductInput) {
                selectedProductInput.value = button.dataset.title || '';
            }
            orderDialog.showModal();
        });
    });

    // Закрытие формы заказа
    if (closeDialogButton) {
        closeDialogButton.addEventListener('click', () => orderDialog.close());
    }

    // Отправка формы
    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Здесь можно добавить отправку данных на сервер (fetch)
        
        successMessage.style.display = 'block';
        orderForm.reset();

        setTimeout(() => {
            successMessage.style.display = 'none';
            orderDialog.close();
        }, 2000);
    });

    // Закрытие при клике на фон (backdrop)
    orderDialog.addEventListener('click', (event) => {
        if (event.target === orderDialog) {
            orderDialog.close();
        }
    });
}

