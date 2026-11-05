/**
 * Student API client
 *
 * Maps to the Spring Boot backend at /pineda/students.
 * In development, Vite dev server proxies /pineda/students -> http://localhost:8080.
 * In production (Render), VITE_API_BASE_URL points to the deployed backend.
 *
 * Backend contract (Student entity):
 *   id (Integer), firstname (String), lastname (String), course (String), section (String)
 *
 * Endpoints:
 *   GET    /pineda/students          -> 200 + Array<Student>
 *   GET    /pineda/students/:id      -> 200 + Student | 404 + "Student with id N not found"
 *   POST   /pineda/students          -> 201 + created Student
 *   PUT    /pineda/students/:id      -> 200 + updated Student | 404 + "Student with id N not found."
 *   DELETE /pineda/students/:id      -> 200 + "Student with id N deleted." | 404 + "Student with id N not found."
 */

// Vite inlines import.meta.env.* at build time. In dev, VITE_API_BASE_URL is undefined,
// so we fall back to a relative path that the Vite dev proxy handles.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? '' : 'https://student-crud-backend.onrender.com');
const BASE_PATH = `${API_BASE_URL}/pineda/students`;

/**
 * Normalize an HTTP response error into a consistent rejection.
 * Preserves the message for user-facing display.
 */
const throwIfNotOk = async (response) => {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      // Some endpoints (GET /{id}, PUT, DELETE) return a plain text body on 404.
      const text = await response.text();
      if (text) {
        message = text;
      }
    } catch {
      // ignore: nothing useful in the body
    }

    throw {
      status: response.status,
      message,
      response,
    };
  }
  return response;
};

/**
 * Shared fetch wrapper that validates status and parses JSON.
 */
const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  await throwIfNotOk(response);
  return response.json();
};

/**
 * GET /pineda/students
 * Returns an array of Student objects (backend returns raw JSON array).
 */
export const getAllStudents = async () => {
  return fetchJson(BASE_PATH);
};

/**
 * GET /pineda/students/:id
 * Returns a single Student object, or rejects on 404.
 */
export const getStudentById = async (id) => {
  return fetchJson(`${BASE_PATH}/${id}`);
};

/**
 * POST /pineda/students
 * Creates a new student. Returns the created Student object.
 */
export const createStudent = async (student) => {
  return fetchJson(BASE_PATH, {
    method: 'POST',
    body: JSON.stringify(student),
  });
};

/**
 * PUT /pineda/students/:id
 * Updates an existing student. Returns the updated Student object.
 */
export const updateStudent = async (id, student) => {
  return fetchJson(`${BASE_PATH}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(student),
  });
};

/**
 * DELETE /pineda/students/:id
 * Deletes a student. Returns an object with the status message.
 */
export const deleteStudent = async (id) => {
  const response = await fetch(`${BASE_PATH}/${id}`, { method: 'DELETE' });
  await throwIfNotOk(response);

  let message = 'Student deleted.';
  try {
    const text = await response.text();
    if (text) message = text;
  } catch {
    // ignore
  }

  return { success: true, message };
};