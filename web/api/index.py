from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
import os
import json
from datetime import datetime

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

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Для flash повідомлень

# Налаштування шляхів до статичних файлів та шаблонів
app.static_folder = 'static'
app.template_folder = 'templates'

@app.route('/')
def index():
    try:
        return render_template('index.html', tasks=storage.get_tasks(), current_tasks=storage.get_current_tasks())
    except Exception as e:
        return jsonify({"error": str(e), "type": type(e).__name__}), 500

@app.route('/add_task', methods=['POST'])
def add_task():
    title = request.form.get('title')
    date = request.form.get('date') or None
    time = request.form.get('time') or None
    
    if title:
        storage.add_task(title, date, time)
        flash('Задачу успішно додано!', 'success')
    
    return redirect(url_for('index'))

@app.route('/add_current', methods=['POST'])
def add_current():
    note = request.form.get('note')
    
    if note:
        storage.add_current_task(note)
        flash('Поточну задачу успішно додано!', 'success')
    
    return redirect(url_for('index'))

@app.route('/send_to_telegram', methods=['POST'])
def send_to_telegram():
    try:
        storage.send_current_tasks()
        return jsonify({'success': True, 'message': 'Задачі надіслано в Telegram'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Помилка: {str(e)}'})

@app.route('/settings')
def settings_page():
    try:
        return render_template('settings.html', settings=storage.get_settings())
    except Exception as e:
        return jsonify({"error": str(e), "type": type(e).__name__}), 500

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

@app.route('/save_notification_settings', methods=['POST'])
def save_notification_settings():
    enable_notifications = 'enable_notifications' in request.form
    notification_time = int(request.form.get('notification_time', 30))
    
    settings_data = storage.get_settings()
    settings_data['enable_notifications'] = enable_notifications
    settings_data['notification_time'] = notification_time
    
    storage.save_settings(settings_data)
    
    flash('Налаштування сповіщень збережено!', 'success')
    return redirect(url_for('settings_page'))

@app.context_processor
def inject_current_year():
    return {'current_year': datetime.now().year}

# Для діагностики
@app.route('/debug')
def debug():
    return jsonify({
        'env': dict(os.environ),
        'tasks': storage.get_tasks(),
        'current_tasks': storage.get_current_tasks(),
        'app_config': {
            'static_folder': app.static_folder,
            'template_folder': app.template_folder,
            'debug': app.debug
        }
    })

# Простий маршрут для перевірки
@app.route('/ping')
def ping():
    return "pong"

# Тестова HTML-сторінка
@app.route('/test')
def test_page():
    with open('index.html', 'r') as f:
        return f.read()

# Для Vercel Serverless Functions
app.debug = True

# Правильний експорт для Vercel
def handler(request, context):
    return app 