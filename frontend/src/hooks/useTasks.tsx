import { useState, useCallback } from "react";
import {
  GetAllTasks,
  CreateTask,
  UpdateTask,
  ToggleTaskDone,
  DeleteTask,
} from "../../wailsjs/go/main/App";
import { Task } from "../types/task";
import { CreateTaskRequest } from "../types/createTask";
import { UpdateTaskRequest } from "../types/updateTask";
import { Priority } from "../types/priority";

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  loadTasks: () => Promise<void>;
  createTask: (
    taskData: Omit<CreateTaskRequest, "due_at"> & { dueDate?: string }
  ) => Promise<Task>;
  updateTask: (
    taskData: Omit<UpdateTaskRequest, "due_at"> & { dueDate?: string }
  ) => Promise<Task>;
  toggleTask: (taskId: number) => Promise<Task | undefined>;
  deleteTask: (taskId: number) => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка всех задач
  const loadTasks = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await GetAllTasks();
      setTasks(
        (tasksData || []).map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          priority: t.priority as Priority,
          due_at: t.due_at || "",
          is_done: t.is_done,
          created_at: t.created_at || "",
          updated_at: t.updated_at || "",
        }))
      );
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Создание новой задачи
  const createTask = async (
    taskData: Omit<CreateTaskRequest, "due_at"> & { dueDate?: string }
  ): Promise<Task> => {
    try {
      setLoading(true);
      setError(null);

      const newTaskFromApi = await CreateTask({
        title: taskData.title,
        description: taskData.description || "",
        priority: taskData.priority || "medium",
        due_at: taskData.dueDate ? new Date(taskData.dueDate) : null,
        convertValues: function (a: any, classs: any, asMap?: boolean) {
          throw new Error("Function not implemented.");
        },
      });
      const newTask: Task = {
        id: newTaskFromApi.id,
        title: newTaskFromApi.title,
        description: newTaskFromApi.description,
        priority: newTaskFromApi.priority as Priority,
        due_at: newTaskFromApi.due_at,
        is_done: newTaskFromApi.is_done,
        created_at: newTaskFromApi.created_at || new Date().toISOString(),
        updated_at: newTaskFromApi.updated_at || new Date().toISOString(),
      };

      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err: any) {
      setError(err.message || "Failed to create task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Обновление задачи
  const updateTask = async (
    taskData: Omit<UpdateTaskRequest, "due_at"> & { dueDate?: string }
  ): Promise<Task> => {
    try {
      setLoading(true);
      setError(null);

      const updatedTaskFromApi = await UpdateTask({
        id: taskData.id,
        title: taskData.title,
        description: taskData.description || "",
        priority: taskData.priority || "medium",
        due_at: taskData.dueDate ? new Date(taskData.dueDate) : null,
        convertValues: function (a: any, classs: any, asMap?: boolean) {
          throw new Error("Function not implemented.");
        },
      });

      const updatedTask: Task = {
        id: updatedTaskFromApi.id,
        title: updatedTaskFromApi.title,
        description: updatedTaskFromApi.description,
        priority: updatedTaskFromApi.priority as Priority,
        due_at: updatedTaskFromApi.due_at,
        is_done: updatedTaskFromApi.is_done,
        created_at: updatedTaskFromApi.created_at || "",
        updated_at: updatedTaskFromApi.updated_at || new Date().toISOString(),
      };

      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      return updatedTask;
    } catch (err: any) {
      setError(err.message || "Failed to update task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Переключение статуса задачи
  const toggleTask = async (taskId: number): Promise<Task | undefined> => {
    try {
      const updatedTaskFromApi = await ToggleTaskDone(taskId);

      const updatedTask: Task = {
        id: updatedTaskFromApi.id,
        title: updatedTaskFromApi.title,
        description: updatedTaskFromApi.description,
        priority: updatedTaskFromApi.priority as Priority,
        due_at: updatedTaskFromApi.due_at,
        is_done: updatedTaskFromApi.is_done,
        created_at: updatedTaskFromApi.created_at || "",
        updated_at: updatedTaskFromApi.updated_at || new Date().toISOString(),
      };

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
      return updatedTask;
    } catch (err: any) {
      setError(err.message || "Failed to toggle task");
      console.error("Error toggling task:", err);
      return undefined;
    }
  };

  // Удаление задачи
  const deleteTask = async (taskId: number): Promise<void> => {
    try {
      await DeleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err: any) {
      setError(err.message || "Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  };
};
