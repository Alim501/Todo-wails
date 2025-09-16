package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

// init загружает .env файл при старте программы
func init() {
	// Загружаем .env файл если он существует
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}
}

// ========== ENVIRONMENT FUNCTIONS ==========

// getEnv получает переменную окружения или возвращает значение по умолчанию
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// ========== DATABASE HELPER FUNCTIONS ==========

// scanTask сканирует строку в структуру Task
func scanTask(rows *sql.Rows) (*Task, error) {
	var task Task
	err := rows.Scan(
		&task.ID, &task.Title, &task.Description,
		&task.IsDone, &task.DueAt, &task.Priority,
		&task.CreatedAt, &task.UpdatedAt,
	)
	return &task, err
}

// scanTaskFromRow сканирует одну строку в структуру Task
func scanTaskFromRow(row *sql.Row) (*Task, error) {
	var task Task
	err := row.Scan(
		&task.ID, &task.Title, &task.Description,
		&task.IsDone, &task.DueAt, &task.Priority,
		&task.CreatedAt, &task.UpdatedAt,
	)
	return &task, err
}

// ========== CONFIG FUNCTIONS ==========

type DBConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// getDBConfig получает конфигурацию базы данных из переменных окружения
func getDBConfig() DBConfig {
	return DBConfig{
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     getEnv("DB_PORT", "5432"),
		User:     getEnv("DB_USER", "postgres"),
		Password: getEnv("DB_PASSWORD", "password"),
		DBName:   getEnv("DB_NAME", "todo_app"),
		SSLMode:  getEnv("DB_SSLMODE", "disable"),
	}
}

// ConnectionString формирует строку подключения к PostgreSQL
func (config DBConfig) ConnectionString() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		config.Host, config.Port, config.User, config.Password, config.DBName, config.SSLMode)
}
