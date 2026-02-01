import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { fetchPayments, createPayment, updatePayment, deletePayment } from "../../api/paymentApi";
import { fetchStudents } from "../../api/studentApi";        // ✅ borrow existing studentApi
import { fetchEnrollments } from "../../api/enrollmentApi";  // ✅ borrow existing enrollmentApi
import PaymentTable from "../../components/payments/PaymentTable.jsx";
import AddPaymentModal from "../../components/payments/AddPaymentModal.jsx";
import UpdatePaymentModal from "../../components/payments/UpdatePaymentModal.jsx";

const themeColor = "#009150";

const PaymentsPage = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // ✅ Fetch payments
  const { data: payments = [], isLoading: loadingPayments, error: errorPayments } = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });

  // ✅ Fetch students
  const { data: students = [], isLoading: loadingStudents, error: errorStudents } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  // ✅ Fetch enrollments
  const { data: enrollments = [], isLoading: loadingEnrollments, error: errorEnrollments } = useQuery({
    queryKey: ["enrollments"],
    queryFn: fetchEnrollments,
  });

  // ✅ Mutations
  const createMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries(["payments"]);
      toast.success("Payment created successfully!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create payment"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => updatePayment(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(["payments"]);
      toast.success("Payment updated successfully!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update payment"),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries(["payments"]);
      toast.success("Payment deleted successfully!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete payment"),
  });

  // ✅ Handlers
  const handleAdd = (form) => {
    createMutation.mutate(form);
    setShowAddModal(false);
  };

  const handleUpdate = (id, updates) => {
    updateMutation.mutate({ id, updates });
    setSelectedPayment(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      deleteMutation.mutate(id);
    }
  };

  if (loadingPayments || loadingStudents || loadingEnrollments) return <p>Loading...</p>;
  if (errorPayments || errorStudents || errorEnrollments) return <p style={{ color: "red" }}>Error loading data</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: themeColor }}>Payments</h2>

      <button
        style={{
          background: themeColor,
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          border: "none",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
        onClick={() => setShowAddModal(true)}
      >
        + Add Payment
      </button>

      <PaymentTable
        payments={payments}
        onEdit={(p) => setSelectedPayment(p)}
        onDelete={handleDelete}
      />

      {showAddModal && (
        <AddPaymentModal
          students={students}
          enrollments={enrollments}
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
        />
      )}

      {selectedPayment && (
        <UpdatePaymentModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default PaymentsPage;
