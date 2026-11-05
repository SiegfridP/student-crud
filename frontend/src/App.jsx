import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetail from './pages/StudentDetail';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-800 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h1 className="text-xl font-bold tracking-tight">Student CRUD</h1>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link to="/" className="text-slate-300 hover:text-white transition">
              Students
            </Link>
            <Link
              to="/students/new"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition shadow"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Student
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<StudentList />} />
          <Route path="/students/new" element={<StudentForm mode="create" />} />
          <Route path="/students/:id/edit" element={<StudentForm mode="edit" />} />
          <Route path="/students/:id" element={<StudentDetail />} />
        </Routes>
      </main>

      <footer className="text-center text-xs text-slate-400 py-4">
        Student CRUD · Vite + React + Tailwind CSS
      </footer>
    </div>
  );
};

export default App;