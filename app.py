import os
import sys

# Додаємо шлях до директорії web
sys.path.append(os.path.join(os.path.dirname(__file__), 'web'))

# Імпортуємо Flask-додаток з директорії web
from web.app import app

# Для локального запуску
if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0') 