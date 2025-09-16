import { useState } from "react";
import { Task } from "../../types/task";
import { Priority } from "../../types/priority";
import { Link } from "react-router";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: number) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleToggle = async (): Promise<void> => {
    await onToggle(task.id);
  };

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true);
    await onDelete(task.id);
  };

  const getPriorityIcon = (priority: Priority): string => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4 transition-all duration-200 ${
        task.is_done ? "opacity-60 bg-gray-50" : ""
      } ${isDeleting ? "opacity-40 pointer-events-none" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          {/* Checkbox */}
          <div className="flex items-center h-6 mt-1">
            <input
              type="checkbox"
              checked={task.is_done}
              onChange={handleToggle}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
            />
          </div>

          {/* Priority Icon */}
          <div className="text-2xl mt-0.5">
            {getPriorityIcon(task.priority)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-semibold text-gray-800 mb-2 ${
                task.is_done ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="text-gray-600 mb-3 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 ml-4">
          <Link
            to={`/tasks/edit/${task.id}`}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            title="Edit task"
          >
            ✏️
          </Link>

          <button
            onClick={handleDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
            disabled={isDeleting}
            title="Delete task"
          >
            {isDeleting ? "⏳" : "🗑️"}
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
        <span className={`font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{" "}
          priority
        </span>
      </div>
    </div>
  );
}

export default TaskItem;
