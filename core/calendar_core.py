import sqlite3
import json
import os
from datetime import datetime, timedelta
import asyncio
import threading

# Обходимо проблему з imghdr в Python 3.13
try:
    from telegram import Bot
except ImportError:
    # Створюємо заглушку для Bot
    class Bot:
        def __init__(self, token=None):
            self.token = token
            
        async def send_message(self, chat_id=None, text=None):
            print(f"[MOCK] Sending message to {chat_id}: {text}")
            return True

class Settings:
    def __init__(self):
        self.config_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'config.json')
        self.settings = self.load_settings()

    def load_settings(self):
        """Load settings from config file"""
        default_settings = {
            'telegram_bot_token': os.getenv('TELEGRAM_BOT_TOKEN', ''),
            'telegram_chat_id': os.getenv('TELEGRAM_CHAT_ID', ''),
            'notification_time': 30,
            'enable_notifications': True
        }
        
        try:
            with open(self.config_file, 'r') as f:
                return {**default_settings, **json.load(f)}
        except (FileNotFoundError, json.JSONDecodeError):
            self.save(default_settings)
            return default_settings

    def save(self, settings_data):
        """Save settings to config file"""
        self.settings = settings_data
        
        # Оновлюємо змінні середовища для поточної сесії
        if 'telegram_bot_token' in settings_data:
            os.environ['TELEGRAM_BOT_TOKEN'] = settings_data['telegram_bot_token']
        if 'telegram_chat_id' in settings_data:
            os.environ['TELEGRAM_CHAT_ID'] = settings_data['telegram_chat_id']
            
        with open(self.config_file, 'w') as f:
            json.dump(settings_data, f, indent=4)
    
    def get_all(self):
        """Get all settings"""
        return self.settings

# Локальне сховище для з'єднань з базою даних для кожного потоку
_local = threading.local()

class CalendarCore:
    def __init__(self, settings=None):
        self.settings = settings if settings else Settings()
        self.db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'tasks.db')
        self.init_database()
        self.telegram_bot = None
        self.chat_id = None
        
        # Ініціалізуємо Telegram, якщо є налаштування
        bot_token = self.settings.settings.get('telegram_bot_token')
        chat_id = self.settings.settings.get('telegram_chat_id')
        if bot_token and chat_id:
            self.init_telegram(bot_token, chat_id)
    
    def get_db_connection(self):
        """Get database connection for current thread"""
        if not hasattr(_local, 'connection') or _local.connection is None:
            _local.connection = sqlite3.connect(self.db_path)
        return _local.connection
    
    def get_cursor(self):
        """Get cursor for current thread"""
        conn = self.get_db_connection()
        return conn.cursor()
        
    def init_database(self):
        """Initialize SQLite database"""
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        # Create tasks table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY,
                title TEXT,
                date TEXT,
                time TEXT
            )
        ''')
        
        # Create current_tasks table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS current_tasks (
                id INTEGER PRIMARY KEY,
                note TEXT
            )
        ''')
        conn.commit()

    def init_telegram(self, bot_token=None, chat_id=None):
        """Initialize Telegram bot"""
        try:
            token = bot_token or self.settings.settings.get('telegram_bot_token')
            self.chat_id = chat_id or self.settings.settings.get('telegram_chat_id')
            
            if token and self.chat_id:
                self.telegram_bot = Bot(token=token)
                return True
            return False
        except Exception as e:
            print(f"Failed to initialize Telegram bot: {e}")
            self.telegram_bot = None
            self.chat_id = None
            return False

    def add_task(self, title, date=None, time=None):
        """Add a new task"""
        cursor = self.get_cursor()
        cursor.execute(
            'INSERT INTO tasks (title, date, time) VALUES (?, ?, ?)',
            (title, date, time)
        )
        self.get_db_connection().commit()
        return True

    def add_current_task(self, note):
        """Add a current task"""
        cursor = self.get_cursor()
        cursor.execute('INSERT INTO current_tasks (note) VALUES (?)', (note,))
        self.get_db_connection().commit()
        return True

    def get_tasks(self):
        """Get all tasks"""
        cursor = self.get_cursor()
        cursor.execute('SELECT id, title, date, time FROM tasks ORDER BY date, time')
        return cursor.fetchall()

    def get_current_tasks(self):
        """Get all current tasks"""
        cursor = self.get_cursor()
        cursor.execute('SELECT id, note FROM current_tasks')
        return cursor.fetchall()

    def send_current_tasks(self):
        """Send current tasks to Telegram"""
        if not self.telegram_bot or not self.chat_id:
            raise Exception("Telegram бот не налаштований. Перевірте налаштування.")
            
        tasks = self.get_current_tasks()
        if not tasks:
            raise Exception("Немає поточних задач для надсилання.")
            
        message = "📋 Поточні задачі:\n" + "\n".join(f"• {task[1]}" for task in tasks)
        
        # Запускаємо асинхронну функцію в синхронному контексті
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            result = loop.run_until_complete(self.telegram_bot.send_message(
                chat_id=self.chat_id,
                text=message
            ))
            return True
        except Exception as e:
            raise Exception(f"Помилка надсилання повідомлення: {str(e)}")
        finally:
            loop.close()

    async def send_notification(self, task_title):
        """Send notification to Telegram"""
        if not self.telegram_bot or not self.chat_id:
            print("Telegram bot not configured")
            return False
            
        try:
            await self.telegram_bot.send_message(
                chat_id=self.chat_id,
                text=f"⏰ Нагадування: через {self.settings.settings.get('notification_time', 30)} хвилин задача '{task_title}'"
            )
            return True
        except Exception as e:
            print(f"Error sending notification: {e}")
            return False

    def check_upcoming_tasks(self):
        """Check for upcoming tasks"""
        if not self.settings.settings.get('enable_notifications', True):
            return []
            
        now = datetime.now()
        notification_time = now + timedelta(minutes=int(self.settings.settings.get('notification_time', 30)))
        
        cursor = self.get_cursor()
        cursor.execute('''
            SELECT title, date, time 
            FROM tasks 
            WHERE date = ? AND time = ?
        ''', (
            notification_time.strftime("%Y-%m-%d"),
            notification_time.strftime("%H:%M")
        ))
        return cursor.fetchall() 