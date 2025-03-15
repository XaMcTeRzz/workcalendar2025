"""
Резервний клас для зберігання даних в пам'яті, якщо MongoDB недоступна
"""

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