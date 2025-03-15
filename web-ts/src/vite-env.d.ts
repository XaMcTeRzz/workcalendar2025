/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string
  // добавьте больше переменных окружения по мере необходимости
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 