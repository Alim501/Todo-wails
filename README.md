# To-Do List Desktop Application

Десктопное приложение для управления списком задач, разработанное с использованием Wails (Go + React + TypeScript + Tailwind CSS).

### Предварительные требования

- Go 1.18+
- Node.js 16+
- PostgreSQL (для бонусной реализации)
- Wails CLI: `go install github.com/wailsapp/wails/v2/cmd/wails@latest`

### Установка и запуск

1. **Клонирование репозитория**

git clone <your-repo-url>
cd todo-app

2. **Установка зависимостей**
   go mod tidy

cd frontend
npm install
cd ..

3. **Настройка окружения**
   createdb todo_app

cp .env.example .env

# Отредактируйте .env файл с вашими настройками БД
