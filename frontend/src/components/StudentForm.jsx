import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudentById, createStudent, updateStudent } from '../api/studentApi';

const StudentForm = ({ mode = 'create', initialId }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    course: '',
    section: '',
  });
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && id) {
      loadStudent(id);
    }
  }, [mode, id]);

  const loadStudent = async (studentId) => {
    setError('');
    setSavedMessage('');
    try {
      const student = await getStudentById(studentId);
      setFormData({
        firstname: student.firstname || '',
        lastname: student.lastname || '',
        course: student.course || '',
        section: student.section || '',
      });
    } catch (err) {
      setError(err.message || 'Failed to load student.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSavedMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSavedMessage('');

    if (!formData.firstname.trim()) {
      setError('First name is required.');
      return;
    }
    if (!formData.lastname.trim()) {
      setError('Last name is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        course: formData.course.trim(),
        section: formData.section.trim(),
      };

      if (mode === 'create') {
        await createStudent(payload);
        setSavedMessage('Student created successfully!');
      } else if (mode === 'edit' && id) {
        await updateStudent(id, payload);
        setSavedMessage('Student updated successfully!');
      }

      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to save student.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition';

  return (
    <div className="fade-slide-in max-w-3xl mx-auto px-4 py-6">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="text-slate-500 hover:text-slate-700 text-sm mb-4 transition"
      >
        &larr; Back to Students
      </button>

      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        {mode === 'create' ? 'Add New Student' : 'Edit Student'}
      </h2>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {savedMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {savedMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Maria"
              />
            </div>
            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Garcia"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="course"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Course
            </label>
            <input
              type="text"
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Computer Science"
            />
          </div>

          <div>
            <label
              htmlFor="section"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Section
            </label>
            <input
              type="text"
              id="section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. A1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving
                ? mode === 'create'
                  ? 'Creating...'
                  : 'Updating...'
                : mode === 'create'
                ? 'Create Student'
                : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
