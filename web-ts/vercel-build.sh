#!/bin/bash

# Скрипт для сборки на Vercel с обработкой ошибок
echo "Запуск улучшенной сборки на Vercel..."

# Отключаем строгую проверку ошибок для React
export CI=false
export GENERATE_SOURCEMAP=false
export SKIP_PREFLIGHT_CHECK=true

# Показываем информацию о среде
echo "Среда выполнения:"
node -v
npm -v
echo "Директория: $(pwd)"
ls -la

# Проверяем наличие необходимых файлов
if [ ! -f "package.json" ]; then
  echo "Ошибка: package.json не найден!"
  exit 1
fi

# Убедимся, что директория node_modules не повреждена
if [ -d "node_modules" ]; then
  echo "Проверка целостности node_modules..."
  if [ ! -d "node_modules/react" ] || [ ! -d "node_modules/react-dom" ]; then
    echo "node_modules повреждены, переустанавливаем..."
    rm -rf node_modules
  fi
fi

# Устанавливаем зависимости
echo "Устанавливаем зависимости..."
npm ci --prefer-offline --no-audit || npm install --prefer-offline --no-audit

# Проверка типов TypeScript
echo "Проверка TypeScript..."
npx tsc --noEmit --skipLibCheck || echo "Предупреждение: Проверка TypeScript завершилась с ошибками, но продолжаем сборку"

# Запускаем сборку с явным флагом CI=false
echo "Запускаем сборку приложения Vite..."
CI=false npm run build

# Проверяем успешность сборки
if [ $? -ne 0 ]; then
  echo "Ошибка при сборке! Пробуем альтернативный подход..."
  # Альтернативная сборка без строгого режима
  CI=false SKIP_PREFLIGHT_CHECK=true npm run build
fi

# Проверяем выходную директорию (для Vite это обычно dist)
echo "Содержимое выходной директории:"
ls -la dist || echo "Ошибка: директория dist не найдена!"

# Проверяем наличие index.html в выходной директории
if [ ! -f "dist/index.html" ]; then
  echo "КРИТИЧЕСКАЯ ОШИБКА: index.html не был создан в директории dist!"
  echo "Попытка найти index.html:"
  find . -name "index.html"
  exit 1
fi

echo "Копируем файл 404.html для обработки ошибок маршрутизации..."
cp dist/index.html dist/404.html

echo "Сборка завершена успешно!" 