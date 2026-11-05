/**
 * Student API client
 *
 * Maps to the Spring Boot backend at /pineda/students.
 * Vite's dev server proxies /pineda/students -> http://localhost:8080,
 * so all calls use a relative path and avoid CORS issues in development.
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

const BASE_PATH = '/pineda/students';

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