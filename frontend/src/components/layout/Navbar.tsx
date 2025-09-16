import { NavLink } from "react-router";

function Navbar() {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">✅ Todo App</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center">
          <NavLink
            to="/tasks/new"
            className={({ isActive }) =>
              `px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-blue-700 text-white shadow-md"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
              }`
            }
          >
            + New Task
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
