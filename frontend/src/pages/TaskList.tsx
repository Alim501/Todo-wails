import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { useTasks } from "../hooks/useTasks";
import { Priority } from "../types/priority";
import { Task } from "../types/task";
import TaskItem from "../components/ui/TaskItem";
import TaskFilter from "../components/ui/TaskFilter";
import ConfirmationModal from "../components/modals/ConfirmationModal";

type FilterStatus = "all" | "pending" | "completed" | "overdue";

function TaskList() {
  const { tasks, loading, error, loadTasks, toggleTask, deleteTask } =
    useTasks();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    loadTasks();
  }, []);

  // Фильтрация задач
  const filteredTasks = useMemo((): Task[] => {
    let filtered = tasks;

    // Фильтр по статусу
    if (filter === "pending") {
      filtered = filtered.filter((task) => !task.is_done);
    } else if (filter === "completed") {
      filtered = filtered.filter((task) => task.is_done);
    } else if (filter === "overdue") {
      const now = new Date();
      filtered = filtered.filter(
        (task) => !task.is_done && task.due_at && new Date(task.due_at) < now
      );
    }

    // Фильтр по приоритету
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    // Поиск
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [tasks, filter, priorityFilter, searchTerm]);

  const handleToggleTask = async (taskId: number): Promise<void> => {
    await toggleTask(taskId);
  };

  const handleDeleteTask = async (taskId: number): Promise<void> => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (taskToDelete !== null) {
      await deleteTask(taskToDelete);
    }
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleDeleteCancel = (): void => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Загрузка задач...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <TaskFilter
          filter={filter}
          priorityFilter={priorityFilter}
          searchTerm={searchTerm}
          onFilterChange={setFilter}
          onPriorityFilterChange={setPriorityFilter}
          onSearchChange={setSearchTerm}
        />

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            ❌ {error}
          </div>
        )}

        {/* Tasks Container */}
        <div className="mb-8">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
              {tasks.length === 0 ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No tasks yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first task to get started!
                  </p>
                  <Link
                    to="/tasks/new"
                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    ➕ Create Task
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No tasks match your filters
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {loading && tasks.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-gray-600">Загрузка задач...</div>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

export default TaskList;
