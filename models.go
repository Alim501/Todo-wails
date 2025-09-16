package main

import (
	"time"
)

type Priority string

const (
	PriorityLow    Priority = "low"
	PriorityMedium Priority = "medium"
	PriorityHigh   Priority = "high"
)

// основная стурктура задачи
type Task struct {
	ID          int        `json:"id" db:"id"`
	Title       string     `json:"title" db:"title"`
	Description string     `json:"description" db:"description"`
	IsDone      bool       `json:"is_done" db:"is_done"`
	DueAt       *time.Time `json:"due_at" db:"due_at"`
	Priority    Priority   `json:"priority" db:"priority"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
}

// Dto новая задача
type CreateTaskRequest struct {
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Priority    Priority   `json:"priority"`
	DueAt       *time.Time `json:"due_at"`
}

// Dto обновления задач
type UpdateTaskRequest struct {
	ID          int        `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Priority    Priority   `json:"priority"`
	DueAt       *time.Time `json:"due_at"`
}

// Dto фильтрация задач
type TaskFilter struct {
	Priority *Priority `json:"priority,omitempty"`
	IsDone   *bool     `json:"is_done,omitempty"`
	DueDate  *string   `json:"due_date,omitempty"` // "today", "tomorrow", "week"
}
