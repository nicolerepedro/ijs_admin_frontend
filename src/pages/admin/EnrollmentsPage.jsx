import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { fetchEnrollments, createEnrollment, updateEnrollmentStatus, deleteEnrollment } from "../../api/enrollmentApi";
import EnrollmentTable from "../../components/enrollments/EnrollmentTable.jsx";
import AddEnrollmentModal from "../../components/enrollments/AddEnrollmentModal.jsx";
import UpdateStatusModal from "../../components/enrollments/UpdateStatusModal.jsx";
import { fetchStudents } from "../../api/studentApi.js";

const themeColor = "#009150";

const EnrollmentsPage = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  // ✅ Fetch
  const { data: enrollments = [], isLoading, error } = useQuery({
    queryKey: ["enrollments"],
    queryFn: fetchEnrollments,
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  })

  // ✅ Mutations
  const createMutation = useMutation({
    mutationFn: createEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries(["enrollments"]);
      toast.success("Enrollment created successfully!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create enrollment"),
  });

  const statusMutation = useMutation({
    mutationFn: updateEnrollmentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["enrollments"]);
      toast.success("Enrollment status updated!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries(["enrollments"]);
      toast.success("Enrollment deleted successfully!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete enrollment"),
  });

  // ✅ Handlers
  const handleAdd = (form) => {
    createMutation.mutate(form);
    setShowAddModal(false);
  };

  const handleUpdateStatus = (enrollmentId, status, remarks) => {
    statusMutation.mutate({ enrollmentId, status, remarks });
    setSelectedEnrollment(null);
  };

  const handleDelete = (enrollmentId) => {
    deleteMutation.mutate(enrollmentId);
  };

  if (isLoading) return <p>Loading enrollments...</p>;
  if (error) return <p style={{ color: "red" }}>Error loading enrollments</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: themeColor }}>Enrollments</h2>

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
        + Add Enrollment
      </button>

      <EnrollmentTable
        enrollments={enrollments}
        onEdit={(e) => setSelectedEnrollment(e)}
        onDelete={handleDelete}
      />

      {showAddModal && (
        <AddEnrollmentModal
          students={students}
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
        />
      )}

      {selectedEnrollment && (
        <UpdateStatusModal
          enrollment={selectedEnrollment}
          onClose={() => setSelectedEnrollment(null)}
          onSave={(status, remarks) => handleUpdateStatus(selectedEnrollment._id, status, remarks)}
        />
      )}
    </div>
  );
};

export default EnrollmentsPage;