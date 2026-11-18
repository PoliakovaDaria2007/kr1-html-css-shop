// ==========================================================
// 1. ЛОГИКА ДЛЯ МОДАЛЬНОГО ОКНА С ПОДРОБНОСТЯМИ О ТОВАРЕ
// ==========================================================

// Находим окно подробностей и элементы внутри него
const productDialog = document.getElementById('product-dialog');
const closeProductBtn = document.getElementById('close-product-dialog');
const openOrderFromProductBtn = document.getElementById('open-order-from-product');

// Находим все кнопки, у которых есть атрибут data-action
const actionButtons = document.querySelectorAll('.product-card__button');

// Переменная для хранения текущего выбранного товара
let currentProductTitle = '';

// Если на странице есть окно с подробностями (чтобы не было ошибок на других страницах)
if (productDialog) {
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;

            if (action === 'details') {
                // Заполняем окно данными из data-атрибутов
                document.getElementById('product-title').textContent = button.dataset.title;
                document.getElementById('product-price').textContent = button.dataset.price;
                document.getElementById('product-desc').textContent = button.dataset.desc;
                document.getElementById('product-image').src = button.dataset.image || 'images/default.jpg';
                
                // Подставляем категорию и наличие (если их нет, ставим прочерк)
                document.getElementById('product-category').textContent = button.dataset.category || '—';
                document.getElementById('product-stock').textContent = button.dataset.stock || 'В наличии';

                // Запоминаем название товара для формы заказа
                currentProductTitle = button.dataset.title;

                // Открываем окно подробностей
                productDialog.showModal();
            }
        });
    });

    // Закрываем окно подробностей
    if (closeProductBtn) {
        closeProductBtn.addEventListener('click', () => {
            productDialog.close();
        });
    }

    // Переход из окна подробностей в форму заказа
    if (openOrderFromProductBtn) {
        openOrderFromProductBtn.addEventListener('click', () => {
            // Закрываем окно подробностей
            productDialog.close();
            // Открываем форму заказа (логика ниже)
            if (orderDialog) {
                selectedProductInput.value = currentProductTitle;
                orderDialog.showModal();
            }
        });
    }
}


// ==========================================================
// 2. СТАРАЯ ЛОГИКА ДЛЯ ФОРМЫ ЗАКАЗА (МОДАЛЬНОЕ ОКНО 2)
// ==========================================================

// Получаем модальное окно заказа
const orderDialog = document.getElementById('order-dialog');

// Получаем все кнопки заказа (с атрибутом data-action="order")
const orderButtons = document.querySelectorAll('.product-card__button[data-action="order"]');

// Получаем кнопку закрытия окна заказа
const closeDialogButton = document.getElementById('close-order-dialog');

// Получаем скрытое поле
const selectedProductInput = document.getElementById('selected-product');

// Вешаем событие на кнопки "Заказать" (сразу на карточке)
if (orderButtons && orderDialog) {
    orderButtons.forEach((button) => {
        button.addEventListener('click', () => {
            // Получаем название товара из data-атрибута
            const productName = button.dataset.title; // Внимание: здесь data-title, а не data-product!

            // Записываем название товара в скрытое поле формы.
            selectedProductInput.value = productName;

            // Открываем модальное окно.
            orderDialog.showModal();
        });
    });
}

// Закрываем модальное окно по кнопке «Закрыть»
if (closeDialogButton) {
    closeDialogButton.addEventListener('click', () => {
        orderDialog.close();
    });
}

// Получаем форму заявки
const orderForm = document.getElementById('order-form');

// Получаем сообщение об успешной отправке
const successMessage = document.getElementById('success-message');

// Обрабатываем отправку формы
if (orderForm) {
    orderForm.addEventListener('submit', (event) => {
        // Отменяем стандартную отправку формы
        event.preventDefault();

        // Сбрасываем предыдущие признаки ошибок
        const formElements = Array.from(orderForm.elements);

        formElements.forEach((element) => {
            if (element.willValidate) {
                element.removeAttribute('aria-invalid');
            }
        });

        // Проверяем встроенные HTML-ограничения формы
        if (!orderForm.checkValidity()) {
            formElements.forEach((element) => {
                if (element.willValidate && !element.checkValidity()) {
                    element.setAttribute('aria-invalid', 'true');
                }
            });

            // Показываем стандартные сообщения браузера
            orderForm.reportValidity();
            return;
        }

        // Показываем сообщение об успешной отправке
        successMessage.hidden = false;

        // Очищаем форму
        orderForm.reset();

        // Закрываем модальное окно
        orderDialog.close();
    });
}
document.querySelectorAll('.accordion__header').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.accordion__item');
    const content = item.querySelector('.accordion__content');
    const isOpen = item.classList.contains('open');

    // Закрываем все остальные
    document.querySelectorAll('.accordion__item').forEach(i => {
      i.classList.remove('open');
      const c = i.querySelector('.accordion__content');
      c.style.maxHeight = '0';
      c.style.padding = '0';
    });

    if (!isOpen) {
      item.classList.add('open');
      content.style.maxHeight = content.scrollHeight + 'px';
      content.style.padding = '16px';
    }
  });
});
