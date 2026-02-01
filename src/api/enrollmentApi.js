import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// =======================
// Enrollment API functions
// =======================

// ✅ Admin: fetch all enrollments
export const fetchEnrollments = async () => {
  const res = await api.get("/enrollments");
  return res.data.enrollments;
};

// ✅ Admin: create enrollment
export const createEnrollment = async (data) => {
  const res = await api.post("/enrollments", data);
  return res.data.enrollment;
};

// ✅ Admin: update enrollment status
export const updateEnrollmentStatus = async ({ enrollmentId, status, remarks }) => {
  const res = await api.patch(`/enrollments/${enrollmentId}/status`, { status, remarks });
  return res.data.enrollment;
};

// ✅ Admin: delete enrollment
export const deleteEnrollment = async (enrollmentId) => {
  const res = await api.delete(`/enrollments/${enrollmentId}`);
  return res.data;
};

// ✅ Admin: fetch enrollments by studentId
export const fetchEnrollmentsByStudentId = async (studentId) => {
  const res = await api.get(`/enrollments/student/${studentId}`);
  return res.data.enrollments;
};
