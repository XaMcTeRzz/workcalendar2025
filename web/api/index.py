from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
import os
import json
from datetime import datetime
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

# Клас для роботи з MongoDB
class MongoDBStorage:
    def __init__(self):
        # Отримуємо URI підключення з змінних середовища або використовуємо тестове значення
        mongo_uri = os.environ.get('MONGODB_URI', 'mongodb+srv://username:password@cluster.mongodb.net/calendar?retryWrites=true&w=majority')
        
        # Підключаємося до MongoDB
        self.client = MongoClient(mongo_uri)
        self.db = self.client.get_database()
        
        # Колекції для зберігання даних
        self.tasks_collection = self.db.tasks
        self.current_tasks_collection = self.db.current_tasks
        self.settings_collection = self.db.settings
        
        # Ініціалізуємо налаштування, якщо вони не існують
        if self.settings_collection.count_documents({}) == 0:
            self.settings_collection.insert_one({
                'telegram_bot_token': '',
                'telegram_chat_id': '',
                'notification_time': 15,
                'notifications_enabled': True,
                'task_notifications': True,
                'current_tasks_notifications': True
            })
    
    def add_task(self, title, date=None, time=None):
        """Add a new task"""
        task = {
            'title': title,
            'date': date,
            'time': time,
            'created_at': datetime.now()
        }
        result = self.tasks_collection.insert_one(task)
        return result.acknowledged
    
    def add_current_task(self, note):
        """Add a current task"""
        task = {
            'note': note,
            'created_at': datetime.now()
        }
        result = self.current_tasks_collection.insert_one(task)
        return result.acknowledged
    
    def get_tasks(self):
        """Get all tasks"""
        tasks = []
        for task in self.tasks_collection.find().sort('created_at', -1):
            # Перетворюємо MongoDB документ у формат, який очікує шаблон
            tasks.append([
                str(task['_id']),  # ID як рядок
                task['title'],
                task.get('date'),
                task.get('time')
            ])
        return tasks
    
    def get_current_tasks(self):
        """Get all current tasks"""
        tasks = []
        for task in self.current_tasks_collection.find().sort('created_at', -1):
            # Перетворюємо MongoDB документ у формат, який очікує шаблон
            tasks.append([
                str(task['_id']),  # ID як рядок
                task['note']
            ])
        return tasks
    
    def send_current_tasks(self):
        """Mock sending current tasks to Telegram"""
        return True
    
    def get_settings(self):
        """Get all settings"""
        settings = self.settings_collection.find_one()
        if settings:
            # Видаляємо _id з результату
            if '_id' in settings:
                del settings['_id']
            return settings
        return {}
    
    def save_settings(self, settings_data):
        """Save settings"""
        # Оновлюємо налаштування
        result = self.settings_collection.update_one({}, {'$set': settings_data})
        return result.acknowledged

# Ініціалізуємо сховище даних
try:
    storage = MongoDBStorage()
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    # Якщо не вдалося підключитися до MongoDB, використовуємо резервне зберігання в пам'яті
    from vercel_memory_storage import VercelStorage
    storage = VercelStorage()

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your_secret_key')  # Для flash повідомлень

# Налаштування шляхів до статичних файлів та шаблонів
app.static_folder = 'static'
app.template_folder = 'templates'

@app.route('/')
def index():
    return render_template('index.html', tasks=storage.get_tasks(), current_tasks=storage.get_current_tasks())

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
    return render_template('settings.html', settings=storage.get_settings())

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

# Для Vercel Serverless Functions
def handler(request, context):
    return app 