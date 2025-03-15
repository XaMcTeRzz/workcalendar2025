#!/bin/bash

# Скрипт для автоматичного розгортання на Vercel

# Перевірка наявності Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI не знайдено. Встановлюємо..."
    npm install -g vercel
fi

# Перевірка статусу Git
if [ -n "$(git status --porcelain)" ]; then
    echo "У вас є незакомічені зміни. Комітимо їх..."
    git add .
    echo -n "Введіть повідомлення для коміту: "
    read commit_message
    git commit -m "$commit_message"
fi

# Збірка проекту
echo "Збираємо проект..."
npm run build

# Розгортання на Vercel
echo "Розгортаємо на Vercel..."
vercel --prod

echo "Розгортання завершено!" 