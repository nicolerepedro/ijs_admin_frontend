import { useState } from "react";
import StudentSelect from "./StudentSelect.jsx";
import { levelLabels, subLevelLabels, gradeOptions } from "../../utils/labels";

const AddEnrollmentModal = ({ students, onClose, onSave }) => {
  const [form, setForm] = useState({
    studentId: "",
    schoolYear: "",
    semester: "firstSemester",
    gradeLevel: "",
    section: "",
    program: "",
    level: "", // ✅ track main level to filter subLevels
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.studentId || !form.schoolYear || !form.gradeLevel) {
      alert("Please fill in required fields");
      return;
    }
    onSave(form);
  };

  return (
    <div style={modalOverlay}>
      <div style={modalCard}>
        <h2 style={modalHeader}>Add Enrollment</h2>
        <div style={formGrid}>
          <label>Student</label>
          <StudentSelect
            students={students}
            onChange={(id) => setForm({ ...form, studentId: id })}
          />

          <label>School Year</label>
          <input
            style={inputStyle}
            name="schoolYear"
            value={form.schoolYear}
            onChange={handleChange}
          />

          <label>Semester</label>
          <select
            style={inputStyle}
            name="semester"
            value={form.semester}
            onChange={handleChange}
          >
            <option value="firstSemester">First Semester</option>
            <option value="secondSemester">Second Semester</option>
            <option value="summer">Summer</option>
          </select>

          <label>Main Level</label>
          <select
            style={inputStyle}
            name="level"
            value={form.level}
            onChange={(e) =>
              setForm({ ...form, level: e.target.value, gradeLevel: "" })
            }
          >
            <option value="">Select Level</option>
            {Object.entries(levelLabels).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>

          <label>Grade Level</label>
          <select
            style={inputStyle}
            name="gradeLevel"
            value={form.gradeLevel}
            onChange={handleChange}
            disabled={!form.level}
          >
            <option value="">Select Grade Level</option>
            {form.level &&
              gradeOptions[form.level].map((sub) => (
                <option key={sub} value={subLevelLabels[sub]}>
                  {subLevelLabels[sub]}
                </option>
              ))}
          </select>

          <label>Section</label>
          <input
            style={inputStyle}
            name="section"
            value={form.section}
            onChange={handleChange}
          />

          <label>Program</label>
          <input
            style={inputStyle}
            name="program"
            value={form.program}
            onChange={handleChange}
          />
        </div>

        <div style={actionsRow}>
          <button style={btnGreen} onClick={handleSubmit}>
            Save
          </button>
          <button style={btnGray} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Styles (same as before)
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};
const modalCard = {
  background: "white",
  padding: "1.5rem",
  borderRadius: "8px",
  width: "400px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};
const modalHeader = { marginBottom: "1rem", color: "#009150" };
const formGrid = { display: "grid", gap: "0.75rem" };
const inputStyle = {
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  width: "100%",
};
const actionsRow = {
  marginTop: "1rem",
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.5rem",
};
const btnGreen = {
  background: "#009150",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
};
const btnGray = {
  background: "#ccc",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
};

export default AddEnrollmentModal;
