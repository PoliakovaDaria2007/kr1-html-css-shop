// ==========================================================
// 1. МОДАЛЬНОЕ ОКНО С ПОДРОБНОСТЯМИ О ТОВАРЕ
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

                if (titleEl) titleEl.textContent = button.dataset.title || '';
                if (priceEl) priceEl.textContent = button.dataset.price || '';
                if (descEl) descEl.textContent = button.dataset.desc || '';
                if (imgEl) imgEl.src = button.dataset.image || 'images/default.jpg';
                if (catEl) catEl.textContent = button.dataset.category || '—';
                if (stockEl) stockEl.textContent = button.dataset.stock || 'В наличии';

                currentProductTitle = button.dataset.title || '';
                productDialog.showModal();
            }
        });
    });

    // Закрытие по кнопке
    if (closeProductBtn) {
        closeProductBtn.addEventListener('click', () => productDialog.close());
    }

    // Закрытие по клику на фон (только если клик именно по самому dialog, а не по его содержимому)
    productDialog.addEventListener('click', (event) => {
        if (event.target === productDialog) {
            productDialog.close();
        }
    });

    // Переход к форме заказа из окна товара
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
// 2. ФОРМА ЗАКАЗА
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

    // Закрытие формы заказа по кнопке
    if (closeDialogButton) {
        closeDialogButton.addEventListener('click', () => orderDialog.close());
    }

    // Отправка формы
    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Проверка чекбокса согласия (HTML required работает, но на всякий случай)
        const agreement = document.getElementById('order-agreement');
        if (agreement && !agreement.checked) {
            agreement.reportValidity();
            return;
        }

        // Показываем сообщение об успехе
        successMessage.hidden = false;
        orderForm.reset();

        setTimeout(() => {
            successMessage.hidden = true;
            orderDialog.close();
        }, 2000);
    });

    // Закрытие при клике на фон (только по самому dialog)
    orderDialog.addEventListener('click', (event) => {
        if (event.target === orderDialog) {
            orderDialog.close();
        }
    });

    // При закрытии формы (любым способом) скрываем сообщение об успехе
    orderDialog.addEventListener('close', () => {
        successMessage.hidden = true;
    });
}
// ==========================================================
// 3. ИЗБРАННОЕ (localStorage)
// ==========================================================

(function () {
    const KEY = 'leonardo_favorites';
    const countEl = document.getElementById('favorites-count');

    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveFavorites(list) {
        localStorage.setItem(KEY, JSON.stringify(list));
        updateCount();
    }

    function updateCount() {
        if (countEl) countEl.textContent = getFavorites().length;
    }

    // Кнопки "В избранное" на карточках
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-favorite]');
        if (!btn) return;
        e.preventDefault();

        const title = btn.dataset.favorite;
        const list = getFavorites();
        const index = list.findIndex(item => item.title === title);

        if (index === -1) {
            list.push({
                title,
                price: btn.dataset.price || '',
                image: btn.dataset.image || ''
            });
            btn.classList.add('is-favorite');
        } else {
            list.splice(index, 1);
            btn.classList.remove('is-favorite');
        }

        saveFavorites(list);
    });

    // Пометить уже добавленные в избранное при загрузке
    document.querySelectorAll('[data-favorite]').forEach(btn => {
        const list = getFavorites();
        if (list.some(item => item.title === btn.dataset.favorite)) {
            btn.classList.add('is-favorite');
        }
    });

    updateCount();
})();

// ==========================================================
// 4. ВИДЖЕТ ЧАТА
// ==========================================================

(function () {
    const widget = document.getElementById('chat-widget');
    if (!widget) return;

    const toggle = document.getElementById('chat-toggle');
    const panel = document.getElementById('chat-panel');
    const closeBtn = document.getElementById('chat-close');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');

    toggle.addEventListener('click', () => {
        panel.hidden = !panel.hidden;
    });

    closeBtn.addEventListener('click', () => {
        panel.hidden = true;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        const userMsg = document.createElement('p');
        userMsg.className = 'chat-widget__message chat-widget__message--user';
        userMsg.textContent = text;
        messages.appendChild(userMsg);

        input.value = '';
        messages.scrollTop = messages.scrollHeight;

        setTimeout(() => {
            const botMsg = document.createElement('p');
            botMsg.className = 'chat-widget__message chat-widget__message--bot';
            botMsg.textContent = 'Спасибо за сообщение! Консультант скоро ответит.';
            messages.appendChild(botMsg);
            messages.scrollTop = messages.scrollHeight;
        }, 800);
    });
})();

// ==========================================================
// 5. ПОИСК ВНУТРИ КАТЕГОРИИ
// ==========================================================

(function () {
    const form = document.querySelector('.site-search');
    if (!form) return;

    const input = form.querySelector('input[name="q"]');
    const cards = document.querySelectorAll('.products-grid .product-card');
    if (!input || !cards.length) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = input.value.trim().toLowerCase();

        cards.forEach(card => {
            const title = card.querySelector('.product-card__title')?.textContent.toLowerCase() || '';
            card.style.display = title.includes(query) ? '' : 'none';
        });
    });
})();
