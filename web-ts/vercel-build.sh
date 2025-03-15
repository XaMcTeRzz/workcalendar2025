#!/bin/bash

# Скрипт для сборки на Vercel с обработкой ошибок
echo "Запуск улучшенной сборки на Vercel..."

# Отключаем строгую проверку ошибок для React
export CI=false
export GENERATE_SOURCEMAP=false
export SKIP_PREFLIGHT_CHECK=true

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
npx tsc --noEmit --skipLibCheck

# Запускаем сборку с явным флагом CI=false
echo "Запускаем сборку приложения..."
CI=false npm run build

# Проверяем успешность сборки
if [ $? -ne 0 ]; then
  echo "Ошибка при сборке! Пробуем альтернативный подход..."
  # Альтернативная сборка без строгого режима
  CI=false SKIP_PREFLIGHT_CHECK=true react-scripts build
fi

# Проверяем наличие index.html в выходной директории
if [ ! -f "build/index.html" ]; then
  echo "КРИТИЧЕСКАЯ ОШИБКА: index.html не был создан!"
  exit 1
fi

echo "Копируем файл 404.html для обработки ошибок маршрутизации..."
cp build/index.html build/404.html

echo "Сборка завершена успешно!" 