// Этот файл помогает Vercel определить, что проект использует Vite
console.log('Vercel environment setup for Vite project');

// Проверка окружения
if (process.env.VERCEL) {
  console.log('Running on Vercel platform');
  console.log('Node version:', process.version);
  console.log('Environment:', process.env.NODE_ENV);
  
  // Убедиться, что используется правильный фреймворк
  console.log('Ensuring Vite framework is used for this project');
}

// Регистрация статических путей для Vite
export const staticPaths = [
  '/assets',
  '/fonts',
  '/images'
];

// Явно указываем, что это Vite проект
export const isViteProject = true; 