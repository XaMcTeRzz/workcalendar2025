from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
import sys
import os
import asyncio
from datetime import datetime
import threading
import time
import json

# Додаємо шлях до core модуля
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from core.calendar_core import CalendarCore, Settings

# Створюємо заглушки для локального зберігання даних
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
        self.load_data()
    
    def load_data(self):
        """Load data from JSON files if they exist"""
        try:
            if os.path.exists('tasks.json'):
                with open('tasks.json', 'r') as f:
                    data = json.load(f)
                    self.tasks = data.get('tasks', [])
                    self.task_id_counter = data.get('counter', 1)
        except Exception as e:
            print(f"Error loading tasks: {e}")
        
        try:
            if os.path.exists('current_tasks.json'):
                with open('current_tasks.json', 'r') as f:
                    data = json.load(f)
                    self.current_tasks = data.get('tasks', [])
                    self.current_task_id_counter = data.get('counter', 1)
        except Exception as e:
            print(f"Error loading current tasks: {e}")
        
        try:
            if os.path.exists('settings.json'):
                with open('settings.json', 'r') as f:
                    self.settings = json.load(f)
        except Exception as e:
            print(f"Error loading settings: {e}")
    
    def save_tasks(self):
        """Save tasks to JSON file"""
        try:
            with open('tasks.json', 'w') as f:
                json.dump({
                    'tasks': self.tasks,
                    'counter': self.task_id_counter
                }, f)
        except Exception as e:
            print(f"Error saving tasks: {e}")
    
    def save_current_tasks(self):
        """Save current tasks to JSON file"""
        try:
            with open('current_tasks.json', 'w') as f:
                json.dump({
                    'tasks': self.current_tasks,
                    'counter': self.current_task_id_counter
                }, f)
        except Exception as e:
            print(f"Error saving current tasks: {e}")
    
    def save_settings(self):
        """Save settings to JSON file"""
        try:
            with open('settings.json', 'w') as f:
                json.dump(self.settings, f)
        except Exception as e:
            print(f"Error saving settings: {e}")
    
    def add_task(self, title, date=None, time=None):
        """Add a new task"""
        task = [self.task_id_counter, title, date, time]
        self.tasks.append(task)
        self.task_id_counter += 1
        self.save_tasks()
        return True
    
    def add_current_task(self, note):
        """Add a current task"""
        task = [self.current_task_id_counter, note]
        self.current_tasks.append(task)
        self.current_task_id_counter += 1
        self.save_current_tasks()
        return True
    
    def get_tasks(self):
        """Get all tasks"""
        return self.tasks
    
    def get_current_tasks(self):
        """Get all current tasks"""
        return self.current_tasks
    
    async def send_current_tasks(self):
        """Mock sending current tasks to Telegram"""
        print("Sending current tasks to Telegram (mock)")
        return True
    
    async def send_notification(self, task_title):
        """Mock sending notification to Telegram"""
        print(f"Sending notification for task: {task_title} (mock)")
        return True
    
    def check_upcoming_tasks(self):
        """Check for upcoming tasks"""
        return []

# Ініціалізуємо сховище даних
storage = VercelStorage()

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Для flash повідомлень

# Ініціалізуємо ядро та налаштування
settings = Settings()
core = CalendarCore(settings)

@app.route('/')
def index():
    tasks = core.get_tasks()
    current_tasks = core.get_current_tasks()
    return render_template('index.html', tasks=tasks, current_tasks=current_tasks)

@app.route('/add_task', methods=['POST'])
def add_task():
    title = request.form.get('title')
    date = request.form.get('date') or None
    time = request.form.get('time') or None
    
    if title:
        core.add_task(title, date, time)
        flash('Задачу успішно додано!', 'success')
    
    return redirect(url_for('index'))

@app.route('/add_current', methods=['POST'])
def add_current():
    note = request.form.get('note')
    
    if note:
        core.add_current_task(note)
        flash('Поточну задачу успішно додано!', 'success')
    
    return redirect(url_for('index'))

@app.route('/send_to_telegram', methods=['POST'])
def send_to_telegram():
    try:
        core.send_current_tasks()
        return jsonify({'success': True, 'message': 'Задачі надіслано в Telegram'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Помилка: {str(e)}'})

@app.route('/settings')
def settings_page():
    return render_template('settings.html', settings=settings.get_all())

@app.route('/save_telegram_settings', methods=['POST'])
def save_telegram_settings():
    bot_token = request.form.get('bot_token')
    chat_id = request.form.get('chat_id')
    
    settings_data = settings.get_all()
    settings_data['telegram_bot_token'] = bot_token
    settings_data['telegram_chat_id'] = chat_id
    
    settings.save(settings_data)
    
    # Реініціалізуємо Telegram з новими налаштуваннями
    core.init_telegram(bot_token, chat_id)
    
    flash('Налаштування Telegram збережено!', 'success')
    return redirect(url_for('settings_page'))

@app.route('/save_notification_settings', methods=['POST'])
def save_notification_settings():
    enable_notifications = 'enable_notifications' in request.form
    notification_time = int(request.form.get('notification_time', 30))
    
    settings_data = settings.get_all()
    settings_data['enable_notifications'] = enable_notifications
    settings_data['notification_time'] = notification_time
    
    settings.save(settings_data)
    
    flash('Налаштування сповіщень збережено!', 'success')
    return redirect(url_for('settings_page'))

@app.context_processor
def inject_current_year():
    return {'current_year': datetime.now().year}

# Для локального запуску
if __name__ == '__main__':
    app.run(debug=True, port=5001) 