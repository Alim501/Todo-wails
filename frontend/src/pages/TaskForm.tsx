import React, { useState, useEffect } from "react";
import { useTasks } from "../hooks/useTasks";
import { GetTask } from "../../wailsjs/go/main/App";
import { useNavigate, useParams } from "react-router";
import { Priority } from "../types/priority";

interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}

function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { createTask, updateTask, loading } = useTasks();

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const [isLoadingTask, setIsLoadingTask] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      loadTask(parseInt(id));
    }
  }, [isEditing, id]);

  const loadTask = async (taskId: number): Promise<void> => {
    try {
      setIsLoadingTask(true);
      setError(null);
      const task = await GetTask(taskId);

      const validPriority: Priority =
        task.priority === "low" ||
        task.priority === "medium" ||
        task.priority === "high"
          ? task.priority
          : "medium";

      setFormData({
        title: task.title,
        description: task.description,
        priority: validPriority,
        dueDate: task.due_at
          ? new Date(task.due_at).toISOString().split("T")[0]
          : "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to load task");
    } finally {
      setIsLoadingTask(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      if (isEditing && id) {
        await updateTask({
          id: parseInt(id),
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
          dueDate: formData.dueDate || undefined,
        });
      } else {
        await createTask({
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
          dueDate: formData.dueDate || undefined,
        });
      }

      navigate("/tasks");
    } catch (err: any) {
      setError(err.message || "Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    navigate("/tasks");
  };

  if (isLoadingTask) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading task...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditing ? "Edit Task" : "Create New Task"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? "Update your task details" : "Add a new task to your list"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter task title..."
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical"
              placeholder="Enter task description..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isSubmitting}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting
                ? "⏳ Saving..."
                : isEditing
                ? "Update Task"
                : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;