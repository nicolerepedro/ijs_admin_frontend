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
      // Clear token
      localStorage.removeItem("token");
      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const fetchStudents = async () => {
  const res = await api.get("/admin/students");
  return res.data.students;
};

export const updateDiscount = async ({ studentId, discountApplied }) => {
  const res = await api.patch(`/admin/students/${studentId}/discountApplied`, { discountApplied });
  return res.data.student;
};

export const updateGradePlacement = async ({ studentId, level, subLevel }) => {
  const res = await api.patch(`/admin/students/${studentId}/gradePlacement`, { level, subLevel });
  return res.data.student;
};

export const registerStudent = async (studentData) => {
  const res = await api.post("/student/auth/register", studentData);
  return res.data;
};

export const deleteStudent = async (studentId) => {
  const token = localStorage.getItem("token");
  const res = await api.delete(`/admin/students/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
