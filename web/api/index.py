from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, send_from_directory
import os
import json
from datetime import datetime
import base64

# Просте зберігання в пам'яті
class VercelStorage:
    def __init__(self):
        self.tasks = []
        self.current_tasks = []
        self.settings = {
            'telegram_bot_token': '',
            'telegram_chat_id': '',
            'notification_time': 15,
            'notifications_enabled': True,
            'task_notifications': True,
            'current_tasks_notifications': True
        }
        self.task_id_counter = 1
        self.current_task_id_counter = 1
        
        # Додаємо тестові дані
        self.add_task("Зустріч з клієнтом", "2023-03-20", "14:00")
        self.add_task("Здати звіт", "2023-03-22", "18:00")
        self.add_current_task("Відповісти на листи")
        self.add_current_task("Підготувати презентацію")
    
    def add_task(self, title, date=None, time=None):
        """Add a new task"""
        task = [self.task_id_counter, title, date, time]
        self.tasks.append(task)
        self.task_id_counter += 1
        return True
    
    def add_current_task(self, note):
        """Add a current task"""
        task = [self.current_task_id_counter, note]
        self.current_tasks.append(task)
        self.current_task_id_counter += 1
        return True
    
    def get_tasks(self):
        """Get all tasks"""
        return self.tasks
    
    def get_current_tasks(self):
        """Get all current tasks"""
        return self.current_tasks
    
    def send_current_tasks(self):
        """Mock sending current tasks to Telegram"""
        return True
    
    def get_settings(self):
        """Get all settings"""
        return self.settings
    
    def save_settings(self, settings_data):
        """Save settings"""
        self.settings = settings_data
        return True

# Ініціалізуємо сховище даних
storage = VercelStorage()

# Вбудовані шаблони (для Vercel)
TEMPLATES = {
    'base.html': '''<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Календар задач</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #4a6da7;
            --primary-dark: #3a5a8c;
            --secondary-color: #f8f9fa;
            --text-color: #333;
            --light-text: #6c757d;
            --danger-color: #dc3545;
            --success-color: #28a745;
            --warning-color: #ffc107;
            --border-color: #dee2e6;
            --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            --spacing-xs: 0.25rem;
            --spacing-sm: 0.5rem;
            --spacing-md: 1rem;
            --spacing-lg: 1.5rem;
            --spacing-xl: 2rem;
            --border-radius: 0.5rem;
            --transition-speed: 0.3s;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Roboto', sans-serif;
            background-color: var(--secondary-color);
            color: var(--text-color);
            line-height: 1.6;
            padding-bottom: 70px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: var(--spacing-md);
        }

        .navbar {
            background-color: var(--primary-color);
            color: white;
            padding: var(--spacing-md) 0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .navbar-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 var(--spacing-md);
        }

        .navbar-brand {
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            text-decoration: none;
        }

        .navbar-nav {
            display: flex;
            list-style: none;
        }

        .nav-item {
            margin-left: var(--spacing-md);
        }

        .nav-link {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: color var(--transition-speed);
        }

        .nav-link:hover {
            color: var(--warning-color);
        }

        .card {
            background-color: white;
            border-radius: var(--border-radius);
            box-shadow: var(--card-shadow);
            margin-bottom: var(--spacing-lg);
            overflow: hidden;
            transition: transform var(--transition-speed);
        }

        .card:hover {
            transform: translateY(-5px);
        }

        .card-header {
            background-color: var(--primary-color);
            color: white;
            padding: var(--spacing-md);
            font-weight: 500;
        }

        .card-body {
            padding: var(--spacing-lg);
        }

        .form-group {
            margin-bottom: var(--spacing-md);
        }

        .form-label {
            display: block;
            margin-bottom: var(--spacing-xs);
            font-weight: 500;
        }

        .form-control {
            width: 100%;
            padding: var(--spacing-sm) var(--spacing-md);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            font-size: 1rem;
            transition: border-color var(--transition-speed);
        }

        .form-control:focus {
            outline: none;
            border-color: var(--primary-color);
        }

        .btn {
            display: inline-block;
            font-weight: 500;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            user-select: none;
            border: 1px solid transparent;
            padding: var(--spacing-sm) var(--spacing-lg);
            font-size: 1rem;
            line-height: 1.5;
            border-radius: var(--border-radius);
            transition: all var(--transition-speed);
            cursor: pointer;
        }

        .btn-primary {
            color: white;
            background-color: var(--primary-color);
            border-color: var(--primary-color);
        }

        .btn-primary:hover {
            background-color: var(--primary-dark);
            border-color: var(--primary-dark);
        }

        .btn-danger {
            color: white;
            background-color: var(--danger-color);
            border-color: var(--danger-color);
        }

        .btn-danger:hover {
            background-color: #bd2130;
            border-color: #bd2130;
        }

        .btn-success {
            color: white;
            background-color: var(--success-color);
            border-color: var(--success-color);
        }

        .btn-success:hover {
            background-color: #218838;
            border-color: #1e7e34;
        }

        .task-list {
            list-style: none;
        }

        .task-item {
            background-color: white;
            border-radius: var(--border-radius);
            box-shadow: var(--card-shadow);
            margin-bottom: var(--spacing-md);
            padding: var(--spacing-md);
            display: flex;
            justify-content: space-between;
            align-items: center;
            animation: fadeIn 0.5s ease-in-out;
        }

        .task-title {
            font-weight: 500;
        }

        .task-date {
            color: var(--light-text);
            font-size: 0.9rem;
        }

        .task-actions {
            display: flex;
        }

        .task-action-btn {
            background: none;
            border: none;
            color: var(--light-text);
            cursor: pointer;
            margin-left: var(--spacing-sm);
            transition: color var(--transition-speed);
        }

        .task-action-btn:hover {
            color: var(--primary-color);
        }

        .alert {
            padding: var(--spacing-md);
            margin-bottom: var(--spacing-md);
            border: 1px solid transparent;
            border-radius: var(--border-radius);
        }

        .alert-success {
            color: #155724;
            background-color: #d4edda;
            border-color: #c3e6cb;
        }

        .alert-danger {
            color: #721c24;
            background-color: #f8d7da;
            border-color: #f5c6cb;
        }

        .alert-warning {
            color: #856404;
            background-color: #fff3cd;
            border-color: #ffeeba;
        }

        .footer {
            background-color: var(--primary-color);
            color: white;
            text-align: center;
            padding: var(--spacing-md) 0;
            position: fixed;
            bottom: 0;
            width: 100%;
        }

        /* Анімації */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Кастомний скроллбар */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--primary-dark);
        }

        /* Медіа-запити для мобільних пристроїв */
        @media (max-width: 768px) {
            .navbar-nav {
                display: none;
            }

            .card-body {
                padding: var(--spacing-md);
            }

            .task-item {
                flex-direction: column;
                align-items: flex-start;
            }

            .task-actions {
                margin-top: var(--spacing-sm);
            }

            /* Нижня навігація для мобільних */
            .mobile-nav {
                display: flex;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: white;
                box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
                z-index: 1000;
            }

            .mobile-nav-item {
                flex: 1;
                text-align: center;
                padding: var(--spacing-sm) 0;
            }

            .mobile-nav-link {
                color: var(--light-text);
                text-decoration: none;
                font-size: 0.8rem;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .mobile-nav-link.active {
                color: var(--primary-color);
            }

            .mobile-nav-icon {
                font-size: 1.5rem;
                margin-bottom: var(--spacing-xs);
            }

            /* Плаваюча кнопка для додавання */
            .fab {
                position: fixed;
                bottom: 70px;
                right: 20px;
                width: 60px;
                height: 60px;
                background-color: var(--primary-color);
                color: white;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                font-size: 24px;
                text-decoration: none;
            }

            .fab:hover {
                background-color: var(--primary-dark);
            }

            body {
                padding-bottom: 70px;
            }

            .footer {
                display: none;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="navbar-container">
            <a href="/" class="navbar-brand">Календар задач</a>
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a href="/" class="nav-link">Головна</a>
                </li>
                <li class="nav-item">
                    <a href="/settings" class="nav-link">Налаштування</a>
                </li>
            </ul>
        </div>
    </nav>

    <div class="container">
        {% with messages = get_flashed_messages(with_categories=true) %}
            {% if messages %}
                {% for category, message in messages %}
                    <div class="alert alert-{{ category }}">
                        {{ message }}
                    </div>
                {% endfor %}
            {% endif %}
        {% endwith %}

        {% block content %}{% endblock %}
    </div>

    <footer class="footer">
        <div class="container">
            <p>&copy; {{ current_year }} Календар задач. Всі права захищено.</p>
        </div>
    </footer>

    <!-- Мобільна навігація -->
    <div class="mobile-nav">
        <div class="mobile-nav-item">
            <a href="/" class="mobile-nav-link {% if request.path == '/' %}active{% endif %}">
                <div class="mobile-nav-icon">📋</div>
                <span>Задачі</span>
            </a>
        </div>
        <div class="mobile-nav-item">
            <a href="/settings" class="mobile-nav-link {% if request.path == '/settings' %}active{% endif %}">
                <div class="mobile-nav-icon">⚙️</div>
                <span>Налаштування</span>
            </a>
        </div>
    </div>

    <script>
        // Базовий JavaScript для інтерактивності
        document.addEventListener('DOMContentLoaded', function() {
            // Автоматичне закриття повідомлень
            const alerts = document.querySelectorAll('.alert');
            alerts.forEach(function(alert) {
                setTimeout(function() {
                    alert.style.opacity = '0';
                    setTimeout(function() {
                        alert.style.display = 'none';
                    }, 500);
                }, 3000);
            });
        });
    </script>
</body>
</html>''',
    'index.html': '''{% extends "base.html" %}

{% block content %}
<div class="row">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                Заплановані задачі
            </div>
            <div class="card-body">
                <form action="/add_task" method="post">
                    <div class="form-group">
                        <label for="title" class="form-label">Назва задачі</label>
                        <input type="text" class="form-control" id="title" name="title" required>
                    </div>
                    <div class="form-group">
                        <label for="date" class="form-label">Дата</label>
                        <input type="date" class="form-control" id="date" name="date">
                    </div>
                    <div class="form-group">
                        <label for="time" class="form-label">Час</label>
                        <input type="time" class="form-control" id="time" name="time">
                    </div>
                    <button type="submit" class="btn btn-primary">Додати задачу</button>
                </form>

                <h3 style="margin-top: 20px;">Список задач</h3>
                <ul class="task-list">
                    {% for task in tasks %}
                    <li class="task-item">
                        <div>
                            <div class="task-title">{{ task[1] }}</div>
                            {% if task[2] or task[3] %}
                            <div class="task-date">
                                {% if task[2] %}{{ task[2] }}{% endif %}
                                {% if task[3] %} о {{ task[3] }}{% endif %}
                            </div>
                            {% endif %}
                        </div>
                        <div class="task-actions">
                            <button class="task-action-btn">✏️</button>
                            <button class="task-action-btn">🗑️</button>
                        </div>
                    </li>
                    {% endfor %}
                </ul>
            </div>
        </div>
    </div>

    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                Поточні задачі
            </div>
            <div class="card-body">
                <form action="/add_current" method="post">
                    <div class="form-group">
                        <label for="note" class="form-label">Нотатка</label>
                        <input type="text" class="form-control" id="note" name="note" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Додати нотатку</button>
                </form>

                <h3 style="margin-top: 20px;">Список поточних задач</h3>
                <ul class="task-list">
                    {% for task in current_tasks %}
                    <li class="task-item">
                        <div class="task-title">{{ task[1] }}</div>
                        <div class="task-actions">
                            <button class="task-action-btn">✏️</button>
                            <button class="task-action-btn">🗑️</button>
                        </div>
                    </li>
                    {% endfor %}
                </ul>

                <div style="margin-top: 20px;">
                    <button id="sendToTelegram" class="btn btn-success">Надіслати в Telegram</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    document.getElementById('sendToTelegram').addEventListener('click', function() {
        fetch('/send_to_telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Задачі успішно надіслано в Telegram!');
            } else {
                alert('Помилка: ' + data.message);
            }
        })
        .catch(error => {
            alert('Помилка при надсиланні запиту: ' + error);
        });
    });
</script>
{% endblock %}''',
    'settings.html': '''{% extends "base.html" %}

{% block content %}
<div class="card">
    <div class="card-header">
        Налаштування Telegram
    </div>
    <div class="card-body">
        <form action="/save_telegram_settings" method="post">
            <div class="form-group">
                <label for="bot_token" class="form-label">Токен бота</label>
                <input type="text" class="form-control" id="bot_token" name="bot_token" value="{{ settings.telegram_bot_token }}">
                <small class="text-muted">Отримайте токен у <a href="https://t.me/BotFather" target="_blank">@BotFather</a></small>
            </div>
            <div class="form-group">
                <label for="chat_id" class="form-label">ID чату</label>
                <input type="text" class="form-control" id="chat_id" name="chat_id" value="{{ settings.telegram_chat_id }}">
                <small class="text-muted">Ваш особистий ID або ID групи</small>
            </div>
            <button type="submit" class="btn btn-primary">Зберегти налаштування</button>
        </form>
    </div>
</div>

<div class="card" style="margin-top: 20px;">
    <div class="card-header">
        Налаштування сповіщень
    </div>
    <div class="card-body">
        <form action="/save_notification_settings" method="post">
            <div class="form-group">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="enable_notifications" name="enable_notifications" {% if settings.notifications_enabled %}checked{% endif %}>
                    <label class="form-check-label" for="enable_notifications">
                        Увімкнути сповіщення
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label for="notification_time" class="form-label">Час сповіщення (хвилин до події)</label>
                <input type="number" class="form-control" id="notification_time" name="notification_time" value="{{ settings.notification_time }}" min="1" max="60">
            </div>
            <button type="submit" class="btn btn-primary">Зберегти налаштування</button>
        </form>
    </div>
</div>
{% endblock %}'''
}

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Для flash повідомлень

# Функція для рендерингу шаблонів з вбудованих даних
def render_template_string_with_context(template_name, **context):
    if template_name in TEMPLATES:
        template_content = TEMPLATES[template_name]
        # Додаємо базовий шаблон до контексту
        if template_name != 'base.html':
            context['base_template'] = TEMPLATES['base.html']
        # Додаємо поточний рік
        context['current_year'] = datetime.now().year
        # Додаємо об'єкт request
        context['request'] = request
        return render_template_string(template_content, **context)
    return f"Template {template_name} not found", 404

# Маршрути для статичних файлів
@app.route('/static/<path:filename>')
def static_file(filename):
    return send_from_directory('static', filename)

# Головна сторінка
@app.route('/')
def index():
    try:
        return render_template_string_with_context('index.html', tasks=storage.get_tasks(), current_tasks=storage.get_current_tasks())
    except Exception as e:
        return jsonify({"error": str(e), "type": type(e).__name__}), 500

# Додавання задачі
@app.route('/add_task', methods=['POST'])
def add_task():
    title = request.form.get('title')
    date = request.form.get('date') or None
    time = request.form.get('time') or None
    
    if title:
        storage.add_task(title, date, time)
        flash('Задачу успішно додано!', 'success')
    
    return redirect(url_for('index'))

# Додавання поточної задачі
@app.route('/add_current', methods=['POST'])
def add_current():
    note = request.form.get('note')
    
    if note:
        storage.add_current_task(note)
        flash('Поточну задачу успішно додано!', 'success')
    
    return redirect(url_for('index'))

# Надсилання в Telegram
@app.route('/send_to_telegram', methods=['POST'])
def send_to_telegram():
    try:
        storage.send_current_tasks()
        return jsonify({'success': True, 'message': 'Задачі надіслано в Telegram'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Помилка: {str(e)}'})

# Сторінка налаштувань
@app.route('/settings')
def settings_page():
    try:
        return render_template_string_with_context('settings.html', settings=storage.get_settings())
    except Exception as e:
        return jsonify({"error": str(e), "type": type(e).__name__}), 500

# Збереження налаштувань Telegram
@app.route('/save_telegram_settings', methods=['POST'])
def save_telegram_settings():
    bot_token = request.form.get('bot_token')
    chat_id = request.form.get('chat_id')
    
    settings_data = storage.get_settings()
    settings_data['telegram_bot_token'] = bot_token
    settings_data['telegram_chat_id'] = chat_id
    
    storage.save_settings(settings_data)
    
    flash('Налаштування Telegram збережено!', 'success')
    return redirect(url_for('settings_page'))

# Збереження налаштувань сповіщень
@app.route('/save_notification_settings', methods=['POST'])
def save_notification_settings():
    enable_notifications = 'enable_notifications' in request.form
    notification_time = int(request.form.get('notification_time', 30))
    
    settings_data = storage.get_settings()
    settings_data['notifications_enabled'] = enable_notifications
    settings_data['notification_time'] = notification_time
    
    storage.save_settings(settings_data)
    
    flash('Налаштування сповіщень збережено!', 'success')
    return redirect(url_for('settings_page'))

# API маршрути для отримання даних
@app.route('/api/tasks')
def api_tasks():
    return jsonify({"tasks": storage.get_tasks()})

@app.route('/api/current-tasks')
def api_current_tasks():
    return jsonify({"current_tasks": storage.get_current_tasks()})

# Маршрут для перевірки
@app.route('/ping')
def ping():
    return "pong"

# Для Vercel Serverless Functions
def handler(request, context):
    return app 