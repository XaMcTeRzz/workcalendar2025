// Функція для надсилання поточних задач в Telegram
function sendToTelegram() {
    // Показуємо індикатор завантаження
    const button = document.querySelector('button[onclick="sendToTelegram()"]');
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Надсилання...';
    
    // Відправляємо запит на сервер
    fetch('/send_to_telegram', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        // Відновлюємо кнопку
        button.disabled = false;
        button.innerHTML = originalText;
        
        // Показуємо повідомлення про результат
        if (data.success) {
            showToast('Успіх', data.message, 'success');
        } else {
            showToast('Помилка', data.message, 'danger');
        }
    })
    .catch(error => {
        // Відновлюємо кнопку і показуємо помилку
        button.disabled = false;
        button.innerHTML = originalText;
        showToast('Помилка', 'Не вдалося надіслати запит: ' + error, 'danger');
    });
}

// Функція для показу повідомлень
function showToast(title, message, type = 'info') {
    // Створюємо елемент toast
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        // Створюємо контейнер, якщо його немає
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(container);
    }
    
    // Генеруємо унікальний ID
    const toastId = 'toast-' + Date.now();
    
    // Створюємо HTML для toast
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    // Додаємо toast до контейнера
    document.getElementById('toast-container').innerHTML += toastHtml;
    
    // Ініціалізуємо і показуємо toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 5000
    });
    toast.show();
    
    // Видаляємо toast після закриття
    toastElement.addEventListener('hidden.bs.toast', function () {
        toastElement.remove();
    });
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    // Обробка flash повідомлень від сервера
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(message => {
        const type = message.dataset.type || 'info';
        const title = type.charAt(0).toUpperCase() + type.slice(1);
        showToast(title, message.textContent, type);
        message.remove();
    });
    
    // Ініціалізація мобільного меню
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function() {
            mobileNavItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Ініціалізація плаваючої кнопки для мобільних пристроїв
    const fab = document.querySelector('.fab');
    if (fab) {
        fab.addEventListener('click', function() {
            const fabMenu = document.querySelector('.fab-menu');
            fabMenu.classList.toggle('show');
            this.classList.toggle('active');
        });
    }
    
    // Закриття меню при кліку поза ним
    document.addEventListener('click', function(event) {
        const fab = document.querySelector('.fab');
        const fabMenu = document.querySelector('.fab-menu');
        if (fab && fabMenu && !fab.contains(event.target) && !fabMenu.contains(event.target)) {
            fabMenu.classList.remove('show');
            fab.classList.remove('active');
        }
    });
}); 