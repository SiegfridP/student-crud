import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllStudents, deleteStudent } from '../api/studentApi';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load students.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s?.id !== id));
    } catch (err) {
      window.alert(`Failed to delete student: ${err?.message || err}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = students.filter((s) => {
    const q = filter.toLowerCase();
    return (
      !q ||
      (s.firstname || '').toLowerCase().includes(q) ||
      (s.course || '').toLowerCase().includes(q) ||
      (s.section || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="fade-slide-in max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Students</h2>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zM11 13h4m-4-4h4"
            />
          </svg>
          <input
            type="text"
            placeholder="Search students..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">
          <svg
            className="animate-spin w-8 h-8 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth={2}
              strokeDasharray="40 10"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 22a10 10 0 000-20"
            />
          </svg>
          <p>Loading students...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg font-medium">No students found</p>
          <p className="text-sm mt-1">
            {filter
              ? 'Try a different search term.'
              : 'Add your first student to get started.'}
          </p>
          {!filter && (
            <Link
              to="/students/new"
              className="inline-flex items-center gap-2 mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
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
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-xs text-left">
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">First Name</th>
                  <th className="px-4 py-3 font-semibold">Last Name</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Section</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <tr key={student.id}>
                    <td className="px-4 py-3 font-mono text-indigo-600">{student.id}</td>
                    <td className="px-4 py-3 font-medium">{student.firstname}</td>
                    <td className="px-4 py-3">{student.lastname}</td>
                    <td className="px-4 py-3">{student.course || '—'}</td>
                    <td className="px-4 py-3">{student.section || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/students/${student.id}`}
                          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded-md text-xs font-medium transition"
                          title="View"
                        >
                          View
                        </Link>
                        <Link
                          to={`/students/${student.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded-md text-xs font-medium transition"
                          title="Edit"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(student.id)}
                          disabled={deletingId === student.id}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded-md text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          {deletingId === student.id ? (
                            <>
                              <svg
                                className="w-3 h-3 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  strokeDasharray="40 10"
                                />
                              </svg>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
