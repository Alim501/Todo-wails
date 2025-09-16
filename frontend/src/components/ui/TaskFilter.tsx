import { Priority } from "../../types/priority";

interface TaskFilterProps {
  filter: "all" | "pending" | "completed" | "overdue";
  priorityFilter: "all" | Priority;
  searchTerm: string;
  onFilterChange: (filter: "all" | "pending" | "completed" | "overdue") => void;
  onPriorityFilterChange: (priority: "all" | Priority) => void;
  onSearchChange: (search: string) => void;
}

function TaskFilter({
  filter,
  priorityFilter,
  searchTerm,
  onFilterChange,
  onPriorityFilterChange,
  onSearchChange,
}: TaskFilterProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
      {/* Search Section */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>
      </div>

      {/* Filter Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Status:
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All", icon: "" },
              { value: "pending", label: "Pending", icon: "📋" },
              { value: "completed", label: "Completed", icon: "✅" },
              { value: "overdue", label: "Overdue", icon: "⏰" },
            ].map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => onFilterChange(value as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  filter === value
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {icon && <span className="mr-1">{icon}</span>}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Priority:
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All", icon: "", color: "" },
              { value: "high", label: "High", icon: "🔴", color: "red" },
              { value: "medium", label: "Medium", icon: "🟡", color: "yellow" },
              { value: "low", label: "Low", icon: "🟢", color: "green" },
            ].map(({ value, label, icon, color }) => (
              <button
                key={value}
                onClick={() => onPriorityFilterChange(value as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  priorityFilter === value
                    ? `bg-${color}-600 text-white shadow-md`
                    : `bg-gray-100 text-gray-700 hover:bg-${color}-50 border border-${color}-200`
                }`}
              >
                {icon && <span className="mr-1">{icon}</span>}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskFilter;