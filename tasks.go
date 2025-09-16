package main

import (
	"database/sql"
)

// GetAllTasks получает все задачи
func (a *App) GetAllTasks() ([]Task, error) {
	query := `
	SELECT id, title, description, is_done, due_at, priority, created_at, updated_at
	FROM tasks 
	ORDER BY 
		CASE priority 
			WHEN 'high' THEN 1 
			WHEN 'medium' THEN 2 
			WHEN 'low' THEN 3 
		END,
		created_at DESC
	`

	rows, err := a.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		task, err := scanTask(rows)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, *task)
	}

	return tasks, nil
}

// CreateTask создает новую задачу
func (a *App) CreateTask(req CreateTaskRequest) (*Task, error) {
	query := `
	INSERT INTO tasks (title, description, priority, due_at)
	VALUES ($1, $2, $3, $4)
	RETURNING id, title, description, is_done, due_at, priority, created_at, updated_at
	`

	row := a.db.QueryRow(query, req.Title, req.Description, req.Priority, req.DueAt)
	return scanTaskFromRow(row)
}

// UpdateTask обновляет существующую задачу
func (a *App) UpdateTask(req UpdateTaskRequest) (*Task, error) {
	query := `
	UPDATE tasks 
	SET title = $2, description = $3, priority = $4, due_at = $5
	WHERE id = $1
	RETURNING id, title, description, is_done, due_at, priority, created_at, updated_at
	`

	row := a.db.QueryRow(query, req.ID, req.Title, req.Description, req.Priority, req.DueAt)
	return scanTaskFromRow(row)
}

// ToggleTaskDone переключает статус выполнения задачи
func (a *App) ToggleTaskDone(id int) (*Task, error) {
	query := `
	UPDATE tasks 
	SET is_done = NOT is_done
	WHERE id = $1
	RETURNING id, title, description, is_done, due_at, priority, created_at, updated_at
	`

	row := a.db.QueryRow(query, id)
	return scanTaskFromRow(row)
}

// DeleteTask удаляет задачу
func (a *App) DeleteTask(id int) error {
	query := `DELETE FROM tasks WHERE id = $1`
	result, err := a.db.Exec(query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// GetTask получает задачу по ID
func (a *App) GetTask(id int) (*Task, error) {
	query := `
	SELECT id, title, description, is_done, due_at, priority, created_at, updated_at
	FROM tasks 
	WHERE id = $1
	`

	row := a.db.QueryRow(query, id)
	return scanTaskFromRow(row)
}
