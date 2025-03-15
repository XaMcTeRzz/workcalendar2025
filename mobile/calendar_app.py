from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.popup import Popup
from kivy.uix.scrollview import ScrollView
from kivy.core.window import Window
from kivy.clock import Clock
import sys
import os

# Add parent directory to path to import core
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.calendar_core import CalendarCore

class CalendarApp(App):
    def build(self):
        self.core = CalendarCore()
        
        # Main layout
        layout = BoxLayout(orientation='vertical', padding=10, spacing=10)
        
        # Tasks section
        tasks_label = Label(text='Задачі', size_hint_y=None, height=30)
        layout.add_widget(tasks_label)
        
        self.tasks_container = BoxLayout(orientation='vertical', size_hint_y=None)
        self.tasks_container.bind(minimum_height=self.tasks_container.setter('height'))
        
        tasks_scroll = ScrollView(size_hint=(1, 0.6))
        tasks_scroll.add_widget(self.tasks_container)
        layout.add_widget(tasks_scroll)
        
        # Current tasks section
        current_tasks_label = Label(text='Поточні задачі', size_hint_y=None, height=30)
        layout.add_widget(current_tasks_label)
        
        self.current_tasks_container = BoxLayout(orientation='vertical', size_hint_y=None)
        self.current_tasks_container.bind(minimum_height=self.current_tasks_container.setter('height'))
        
        current_tasks_scroll = ScrollView(size_hint=(1, 0.3))
        current_tasks_scroll.add_widget(self.current_tasks_container)
        layout.add_widget(current_tasks_scroll)
        
        # Buttons
        buttons_layout = BoxLayout(size_hint_y=None, height=40, spacing=10)
        buttons_layout.add_widget(Button(text='Додати задачу', on_press=self.show_add_task))
        buttons_layout.add_widget(Button(text='Додати поточну', on_press=self.show_add_current))
        buttons_layout.add_widget(Button(text='Надіслати в Telegram', on_press=self.send_to_telegram))
        layout.add_widget(buttons_layout)
        
        # Update displays
        self.update_displays()
        
        # Start notification checker
        Clock.schedule_interval(self.check_notifications, 60)
        
        return layout
    
    def update_displays(self):
        """Update both task displays"""
        # Clear containers
        self.tasks_container.clear_widgets()
        self.current_tasks_container.clear_widgets()
        
        # Update tasks
        tasks = self.core.get_tasks()
        for task in tasks:
            task_text = f"{task[1]} - {task[2] or ''} {task[3] or ''}"
            self.tasks_container.add_widget(Label(
                text=task_text,
                size_hint_y=None,
                height=30,
                text_size=(Window.width - 20, None)
            ))
        
        # Update current tasks
        current_tasks = self.core.get_current_tasks()
        for task in current_tasks:
            self.current_tasks_container.add_widget(Label(
                text=task[1],
                size_hint_y=None,
                height=30,
                text_size=(Window.width - 20, None)
            ))
    
    def show_add_task(self, instance):
        """Show dialog for adding a new task"""
        content = BoxLayout(orientation='vertical', padding=10, spacing=10)
        
        title_input = TextInput(hint_text='Назва задачі', multiline=False)
        date_input = TextInput(hint_text='Дата (YYYY-MM-DD)', multiline=False)
        time_input = TextInput(hint_text='Час (HH:MM)', multiline=False)
        
        content.add_widget(title_input)
        content.add_widget(date_input)
        content.add_widget(time_input)
        
        def save(instance):
            title = title_input.text
            date = date_input.text if date_input.text else None
            time = time_input.text if time_input.text else None
            
            if title:
                self.core.add_task(title, date, time)
                self.update_displays()
                popup.dismiss()
        
        buttons = BoxLayout(size_hint_y=None, height=40)
        buttons.add_widget(Button(text='Зберегти', on_press=save))
        content.add_widget(buttons)
        
        popup = Popup(title='Додати задачу',
                     content=content,
                     size_hint=(None, None), size=(300, 400))
        popup.open()
    
    def show_add_current(self, instance):
        """Show dialog for adding a current task"""
        content = BoxLayout(orientation='vertical', padding=10, spacing=10)
        
        note_input = TextInput(hint_text='Текст замітки', multiline=False)
        content.add_widget(note_input)
        
        def save(instance):
            note = note_input.text
            if note:
                self.core.add_current_task(note)
                self.update_displays()
                popup.dismiss()
        
        buttons = BoxLayout(size_hint_y=None, height=40)
        buttons.add_widget(Button(text='Зберегти', on_press=save))
        content.add_widget(buttons)
        
        popup = Popup(title='Додати поточну задачу',
                     content=content,
                     size_hint=(None, None), size=(300, 200))
        popup.open()
    
    def send_to_telegram(self, instance):
        """Send current tasks to Telegram"""
        import asyncio
        asyncio.run(self.core.send_current_tasks())
    
    def check_notifications(self, dt):
        """Check for upcoming tasks and send notifications"""
        tasks = self.core.check_upcoming_tasks()
        for task in tasks:
            import asyncio
            asyncio.run(self.core.send_notification(task[0]))

if __name__ == '__main__':
    CalendarApp().run() 