import { HashRouter as Router, Routes, Route, Navigate } from "react-router";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import TaskList from "./pages/TaskList";
import TaskForm from "./pages/TaskForm";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/new" element={<TaskForm />} />
            <Route path="/tasks/edit/:id" element={<TaskForm />} />
            <Route path="*" element={<Navigate to="/tasks" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
