import api from "./apiClient"; // ✅ your axios instance

// ✅ Fetch all payments (admin)
export const fetchPayments = async () => {
  const res = await api.get("/payments");
  return res.data.payments;
};

// ✅ Create new payment (admin)
export const createPayment = async (paymentData) => {
  const res = await api.post("/payments", paymentData);
  return res.data.payment;
};

// ✅ Update payment (admin)
export const updatePayment = async (id, updates) => {
  const res = await api.patch(`/payments/${id}`, updates);
  return res.data.payment;
};

// ✅ Delete payment (admin)
export const deletePayment = async (id) => {
  const res = await api.delete(`/payments/${id}`);
  return res.data;
};

// ✅ Get payment by ID (admin)
export const fetchPaymentById = async (id) => {
  const res = await api.get(`/payments/${id}`);
  return res.data.payment;
};

// ✅ Get payments for a specific student (admin)
export const fetchStudentPaymentsById = async (studentId) => {
  const res = await api.get(`/payments/student/${studentId}`);
  return res.data.payments;
};

// ✅ Get payments for logged-in student (student role)
export const fetchMyPayments = async () => {
  const res = await api.get("/payments/my");
  return res.data.payments;
};
