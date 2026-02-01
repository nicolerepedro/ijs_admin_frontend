import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import StudentTable from "../../components/students/StudentTable.jsx";
import EditStudentModal from "../../components/students/EditStudentModal.jsx";
import AddStudentModal from "../../components/students/AddStudentModal.jsx";
import {
  fetchStudents,
  updateDiscount,
  updateGradePlacement,
  registerStudent,
  deleteStudent,
} from "../../api/studentApi";

import { toast } from "react-toastify";

const themeColor = "#009150";

const StudentsPage = () => {
  const queryClient = useQueryClient();

  // Edit state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [discount, setDiscount] = useState("");
  const [level, setLevel] = useState("");
  const [subLevel, setSubLevel] = useState("");
  const [activeTab, setActiveTab] = useState("discount");

  // Add state
  const [showAddModal, setShowAddModal] = useState(false);

  // Queries
  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  // Mutations
  const discountMutation = useMutation({
    mutationFn: updateDiscount,
    onSuccess: () => {
        queryClient.invalidateQueries(["students"]);
        toast.success("Discount updated successfully!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update discount"),
  });

  const gradeMutation = useMutation({
    mutationFn: updateGradePlacement,
    onSuccess: () => {
        queryClient.invalidateQueries(["students"]);
        toast.success("Grade placement updated successfully!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update grade placement"),
  });

  const registerMutation = useMutation({
    mutationFn: registerStudent,
    onSuccess: () => {
        queryClient.invalidateQueries(["students"]);
        toast.success("Student registered successfully!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to register student"),
  });

  const deleteMutation = useMutation({ 
    mutationFn: deleteStudent, 
    onSuccess: () => { 
        queryClient.invalidateQueries(["students"]); 
        toast.success("Student deleted successfully!"); 
    }, 
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete student"), });

  // Save edit
  const handleSaveEdit = () => {
    if (!selectedStudent) return;

    if (activeTab === "discount" && discount !== "") {
      discountMutation.mutate({
        studentId: selectedStudent._id,
        discountApplied: Number(discount) / 100,
      });
    }

    if (activeTab === "grade" && level && subLevel) {
      gradeMutation.mutate({
        studentId: selectedStudent._id,
        level,
        subLevel,
      });
    }

    setSelectedStudent(null);
    setDiscount("");
    setLevel("");
    setSubLevel("");
    setActiveTab("discount");
  };

  // Save add
  const handleSaveAdd = (form) => {
    registerMutation.mutate({
      studentNo: form.studentNo,
      firstName: form.firstName,
      lastName: form.lastName,
      middleName: form.middleName,
      email: form.email,
      contactNumber: form.contactNumber,
      password: form.password,
      discountApplied: form.discountApplied / 100, // convert to 0–1
      role: "student",
      gradePlacement: {
        level: form.level,
        subLevel: form.subLevel,
      },
    });
    setShowAddModal(false);
  };

  const handleDelete = (studentId) => { 
    deleteMutation.mutate(studentId); 
  };

  if (isLoading) return <p>Loading students...</p>;
  if (error) return <p style={{ color: "red" }}>Error loading students</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: themeColor }}>Students</h2>

      {/* Add Student button */}
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
        + Add Student
      </button>

      {/* Table */}
      <StudentTable
        students={students}
        onEdit={(s) => {
          setSelectedStudent(s);
          setDiscount((s.discountApplied ?? 0) * 100);
          setLevel(s.gradePlacement?.level ?? "");
          setSubLevel(s.gradePlacement?.subLevel ?? "");
        }}
        onDelete={handleDelete}
      />

      {/* Edit Modal */}
      {selectedStudent && (
        <EditStudentModal
          student={selectedStudent}
          discount={discount}
          setDiscount={setDiscount}
          level={level}
          setLevel={setLevel}
          subLevel={subLevel}
          setSubLevel={setSubLevel}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setSelectedStudent(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveAdd}
        />
      )}
    </div>
  );
};

export default StudentsPage;
