import os
import sqlite3
import speech_recognition as sr
from telegram import Bot
import tkinter as tk
from tkinter import ttk, messagebox
from dotenv import load_dotenv, set_key
import asyncio
from datetime import datetime, timedelta
import schedule
import time
import threading
import json
import platform

# Load environment variables
load_dotenv()

class Settings:
    def __init__(self):
        self.config_file = 'config.json'
        self.load_settings()

    def load_settings(self):
        """Load settings from config file"""
        default_settings = {
            'telegram_bot_token': os.getenv('TELEGRAM_BOT_TOKEN', ''),
            'telegram_chat_id': os.getenv('TELEGRAM_CHAT_ID', ''),
            'notification_time': 15,  # minutes before task
            'notifications_enabled': True,
            'current_tasks_notifications': True,
            'task_notifications': True
        }
        
        try:
            with open(self.config_file, 'r') as f:
                self.settings = {**default_settings, **json.load(f)}
        except FileNotFoundError:
            self.settings = default_settings
            self.save_settings()

    def save_settings(self):
        """Save settings to config file"""
        with open(self.config_file, 'w') as f:
            json.dump(self.settings, f, indent=4)
        
        # Update environment variables
        os.environ['TELEGRAM_BOT_TOKEN'] = self.settings['telegram_bot_token']
        os.environ['TELEGRAM_CHAT_ID'] = self.settings['telegram_chat_id']
        
        # Update .env file
        set_key('.env', 'TELEGRAM_BOT_TOKEN', self.settings['telegram_bot_token'])
        set_key('.env', 'TELEGRAM_CHAT_ID', self.settings['telegram_chat_id'])

class CalendarApp:
    def __init__(self):
        self.settings = Settings()
        self.init_database()
        self.init_telegram()
        self.init_gui()
        if self.settings.settings['notifications_enabled']:
            self.start_notification_scheduler()
        
    def init_database(self):
        """Initialize SQLite database"""
        self.conn = sqlite3.connect('tasks.db')
        self.cursor = self.conn.cursor()
        
        # Create tasks table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY,
                title TEXT,
                date TEXT,
                time TEXT
            )
        ''')
        
        # Create current_tasks table
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS current_tasks (
                id INTEGER PRIMARY KEY,
                note TEXT
            )
        ''')
        self.conn.commit()

    def init_telegram(self):
        """Initialize Telegram bot"""
        self.telegram_bot = Bot(token=self.settings.settings['telegram_bot_token'])
        self.chat_id = self.settings.settings['telegram_chat_id']
        
    def init_gui(self):
        """Initialize GUI components"""
        self.root = tk.Tk()
        self.root.title("Робочий Календар")
        self.root.geometry("800x600")
        
        # Create menu
        self.create_menu()
        
        # Create main container
        main_container = ttk.Frame(self.root)
        main_container.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Left section - Tasks
        tasks_frame = ttk.LabelFrame(main_container, text="Задачі")
        tasks_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5)
        
        self.tasks_tree = ttk.Treeview(tasks_frame, columns=('Title', 'Date', 'Time'), show='headings')
        self.tasks_tree.heading('Title', text='Назва')
        self.tasks_tree.heading('Date', text='Дата')
        self.tasks_tree.heading('Time', text='Час')
        self.tasks_tree.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Right section - Current Tasks
        current_tasks_frame = ttk.LabelFrame(main_container, text="Поточні задачі")
        current_tasks_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=5)
        
        self.current_tasks_list = tk.Listbox(current_tasks_frame)
        self.current_tasks_list.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Buttons
        button_frame = ttk.Frame(self.root)
        button_frame.pack(fill=tk.X, padx=10, pady=5)
        
        ttk.Button(button_frame, text="Додати задачу", command=self.show_add_task_dialog).pack(side=tk.LEFT, padx=5)
        if platform.system() != "Android":  # Hide voice input on Android
            ttk.Button(button_frame, text="Голосове введення", command=self.voice_input).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Надіслати поточне", command=self.send_current_tasks).pack(side=tk.LEFT, padx=5)
        
        self.update_displays()

    def create_menu(self):
        """Create application menu"""
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)
        
        # Settings menu
        settings_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Налаштування", menu=settings_menu)
        settings_menu.add_command(label="Telegram налаштування", command=self.show_telegram_settings)
        settings_menu.add_command(label="Налаштування сповіщень", command=self.show_notification_settings)
        
        # Help menu
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Допомога", menu=help_menu)
        help_menu.add_command(label="Про програму", command=self.show_about)

    def show_telegram_settings(self):
        """Show Telegram settings dialog"""
        dialog = tk.Toplevel(self.root)
        dialog.title("Налаштування Telegram")
        dialog.geometry("400x200")
        
        ttk.Label(dialog, text="Токен бота:").pack(pady=5)
        token_entry = ttk.Entry(dialog, width=50)
        token_entry.insert(0, self.settings.settings['telegram_bot_token'])
        token_entry.pack(pady=5)
        
        ttk.Label(dialog, text="Chat ID:").pack(pady=5)
        chat_id_entry = ttk.Entry(dialog, width=50)
        chat_id_entry.insert(0, self.settings.settings['telegram_chat_id'])
        chat_id_entry.pack(pady=5)
        
        def save():
            self.settings.settings['telegram_bot_token'] = token_entry.get()
            self.settings.settings['telegram_chat_id'] = chat_id_entry.get()
            self.settings.save_settings()
            self.init_telegram()
            dialog.destroy()
            messagebox.showinfo("Успіх", "Налаштування збережено")
        
        ttk.Button(dialog, text="Зберегти", command=save).pack(pady=10)
        ttk.Label(dialog, text="Як отримати токен бота та chat_id?", cursor="hand2").pack(pady=5)

    def show_notification_settings(self):
        """Show notification settings dialog"""
        dialog = tk.Toplevel(self.root)
        dialog.title("Налаштування сповіщень")
        dialog.geometry("400x300")
        
        # Enable/disable notifications
        notifications_var = tk.BooleanVar(value=self.settings.settings['notifications_enabled'])
        ttk.Checkbutton(dialog, text="Увімкнути сповіщення", 
                       variable=notifications_var).pack(pady=5)
        
        # Task notifications
        task_notifications_var = tk.BooleanVar(value=self.settings.settings['task_notifications'])
        ttk.Checkbutton(dialog, text="Сповіщення про задачі", 
                       variable=task_notifications_var).pack(pady=5)
        
        # Current tasks notifications
        current_tasks_var = tk.BooleanVar(value=self.settings.settings['current_tasks_notifications'])
        ttk.Checkbutton(dialog, text="Сповіщення про поточні задачі", 
                       variable=current_tasks_var).pack(pady=5)
        
        # Notification time
        ttk.Label(dialog, text="Час сповіщення до задачі (хвилин):").pack(pady=5)
        time_entry = ttk.Entry(dialog)
        time_entry.insert(0, str(self.settings.settings['notification_time']))
        time_entry.pack(pady=5)
        
        def save():
            try:
                notification_time = int(time_entry.get())
                if notification_time <= 0:
                    raise ValueError("Час повинен бути більше 0")
                
                self.settings.settings['notifications_enabled'] = notifications_var.get()
                self.settings.settings['task_notifications'] = task_notifications_var.get()
                self.settings.settings['current_tasks_notifications'] = current_tasks_var.get()
                self.settings.settings['notification_time'] = notification_time
                
                self.settings.save_settings()
                
                if self.settings.settings['notifications_enabled']:
                    self.start_notification_scheduler()
                
                dialog.destroy()
                messagebox.showinfo("Успіх", "Налаштування збережено")
                
            except ValueError as e:
                messagebox.showerror("Помилка", str(e))
        
        ttk.Button(dialog, text="Зберегти", command=save).pack(pady=10)

    def show_about(self):
        """Show about dialog"""
        messagebox.showinfo("Про програму", 
                          "Робочий Календар\n\n"
                          "Версія: 1.0\n"
                          "Програма для управління задачами з підтримкою:\n"
                          "- Telegram сповіщень\n"
                          "- Голосового введення\n"
                          "- Поточних задач\n\n"
                          "Розробник: Your Name")

    def show_add_task_dialog(self):
        """Show dialog for adding a new task"""
        dialog = tk.Toplevel(self.root)
        dialog.title("Додати задачу")
        dialog.geometry("300x200")
        
        ttk.Label(dialog, text="Назва:").pack(pady=5)
        title_entry = ttk.Entry(dialog)
        title_entry.pack(pady=5)
        
        ttk.Label(dialog, text="Дата (YYYY-MM-DD):").pack(pady=5)
        date_entry = ttk.Entry(dialog)
        date_entry.pack(pady=5)
        
        ttk.Label(dialog, text="Час (HH:MM):").pack(pady=5)
        time_entry = ttk.Entry(dialog)
        time_entry.pack(pady=5)
        
        def save():
            title = title_entry.get()
            date = date_entry.get()
            time = time_entry.get()
            self.add_task(title, date if date else None, time if time else None)
            dialog.destroy()
        
        ttk.Button(dialog, text="Зберегти", command=save).pack(pady=10)

    def add_task(self, title, date=None, time=None):
        """Add a new task"""
        self.cursor.execute(
            'INSERT INTO tasks (title, date, time) VALUES (?, ?, ?)',
            (title, date, time)
        )
        self.conn.commit()
        self.update_displays()

    def add_current_task(self, note):
        """Add a current task"""
        self.cursor.execute('INSERT INTO current_tasks (note) VALUES (?)', (note,))
        self.conn.commit()
        self.update_displays()

    def update_displays(self):
        """Update both task displays"""
        # Update tasks
        for item in self.tasks_tree.get_children():
            self.tasks_tree.delete(item)
            
        self.cursor.execute('SELECT title, date, time FROM tasks ORDER BY date, time')
        for task in self.cursor.fetchall():
            self.tasks_tree.insert('', 'end', values=task)
        
        # Update current tasks
        self.current_tasks_list.delete(0, tk.END)
        self.cursor.execute('SELECT note FROM current_tasks')
        for task in self.cursor.fetchall():
            self.current_tasks_list.insert(tk.END, task[0])

    def voice_input(self):
        """Handle voice input"""
        r = sr.Recognizer()
        with sr.Microphone() as source:
            try:
                messagebox.showinfo("Голосове введення", "Говоріть...")
                r.adjust_for_ambient_noise(source)
                audio = r.listen(source)
                text = r.recognize_google(audio, language='uk-UA')
                self.parse_voice_command(text)
            except sr.UnknownValueError:
                messagebox.showerror("Помилка", "Не вдалося розпізнати мову")
            except sr.RequestError:
                messagebox.showerror("Помилка", "Помилка сервісу розпізнавання мови")

    def parse_voice_command(self, text):
        """Parse voice command"""
        text = text.lower()
        if "додати в поточні:" in text:
            note = text.split("додати в поточні:")[1].strip()
            self.add_current_task(note)
        else:
            parts = text.split(',')
            if len(parts) >= 2:
                title = parts[0].strip()
                date = parts[1].strip()
                time = parts[2].strip() if len(parts) > 2 else None
                self.add_task(title, date, time)

    async def send_current_tasks(self):
        """Send current tasks to Telegram"""
        self.cursor.execute('SELECT note FROM current_tasks')
        tasks = self.cursor.fetchall()
        if tasks:
            message = "Поточні задачі:\n" + "\n".join(f"- {task[0]}" for task in tasks)
            await self.telegram_bot.send_message(chat_id=self.chat_id, text=message)

    def start_notification_scheduler(self):
        """Start the notification scheduler"""
        def check_upcoming_tasks():
            if not self.settings.settings['notifications_enabled']:
                return
                
            now = datetime.now()
            notification_time = now + timedelta(minutes=self.settings.settings['notification_time'])
            
            if self.settings.settings['task_notifications']:
                self.cursor.execute('''
                    SELECT title, date, time 
                    FROM tasks 
                    WHERE date = ? AND time = ?
                ''', (
                    notification_time.strftime("%Y-%m-%d"),
                    notification_time.strftime("%H:%M")
                ))
                
                for task in self.cursor.fetchall():
                    asyncio.run(self.telegram_bot.send_message(
                        chat_id=self.chat_id,
                        text=f"Нагадування: через {self.settings.settings['notification_time']} хвилин задача '{task[0]}'"
                    ))
        
        schedule.every().minute.do(check_upcoming_tasks)
        
        def run_scheduler():
            while True:
                schedule.run_pending()
                time.sleep(60)
        
        scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
        scheduler_thread.start()

    def run(self):
        """Start the application"""
        self.root.mainloop()

if __name__ == "__main__":
    app = CalendarApp()
    app.run() 