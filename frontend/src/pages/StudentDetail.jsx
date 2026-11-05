import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentById, deleteStudent } from '../api/studentApi';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getStudentById(id);
        setStudent(data);
      } catch (err) {
        setError(err.message || 'Failed to load student.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this student? This cannot be undone.')) return;

    setDeleting(true);
    try {
      await deleteStudent(id);
      navigate('/');
    } catch (err) {
      window.alert(`Failed to delete student: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="fade-slide-in max-w-3xl mx-auto px-4 py-6">
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
          <p>Loading student...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fade-slide-in max-w-3xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            &larr; Back to Students
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="fade-slide-in max-w-3xl mx-auto px-4 py-6">
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg">Student not found.</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            &larr; Back to Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-slide-in max-w-3xl mx-auto px-4 py-6">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="text-slate-500 hover:text-slate-700 text-sm mb-4 transition"
      >
        &larr; Back to Students
      </button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Student Details
          </h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
            ID: {student.id}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-500 mb-1">First Name</label>
            <p className="text-lg font-semibold text-slate-800">{student.firstname || '—'}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-500 mb-1">Last Name</label>
            <p className="text-lg font-semibold text-slate-800">{student.lastname || '—'}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-500 mb-1">Course</label>
            <p className="text-lg font-semibold text-slate-800">{student.course || '—'}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-500 mb-1">Section</label>
            <p className="text-lg font-semibold text-slate-800">{student.section || '—'}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(/students//edit)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition shadow"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
