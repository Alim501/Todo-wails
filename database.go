package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

// initDB инициализирует подключение к базе данных
func (a *App) initDB() error {
	config := getDBConfig()

	var err error
	a.db, err = sql.Open("postgres", config.ConnectionString())
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}

	// Проверка подключения
	if err = a.db.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}

	// Создание таблиц
	if err = a.createTables(); err != nil {
		return fmt.Errorf("failed to create tables: %w", err)
	}

	return nil
}

// createTables создает необходимые таблицы
func (a *App) createTables() error {
	query := `
	CREATE TABLE IF NOT EXISTS tasks (
		id SERIAL PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		description TEXT,
		is_done BOOLEAN DEFAULT FALSE,
		due_at TIMESTAMP NULL,
		priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	
	-- Функция для автоматического обновления updated_at
	CREATE OR REPLACE FUNCTION update_updated_at_column()
	RETURNS TRIGGER AS $$
	BEGIN
		NEW.updated_at = CURRENT_TIMESTAMP;
		RETURN NEW;
	END;
	$$ language 'plpgsql';
	
	-- Триггер для автоматического обновления updated_at
	DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
	CREATE TRIGGER update_tasks_updated_at
		BEFORE UPDATE ON tasks
		FOR EACH ROW
		EXECUTE FUNCTION update_updated_at_column();
	`

	_, err := a.db.Exec(query)
	return err
}

// closeDB закрывает подключение к базе данных
func (a *App) closeDB() {
	if a.db != nil {
		a.db.Close()
	}
}
