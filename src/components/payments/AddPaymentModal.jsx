import { useState } from "react";
import StudentSelect from "./StudentSelect.jsx";

const themeColor = "#009150";

// ✅ Mapping dictionary
const semesterLabels = {
  firstSemester: "First Semester",
  secondSemester: "Second Semester",
  summer: "Summer",
};


const AddPaymentModal = ({ students = [], enrollments = [], onClose, onSave }) => {
  const [form, setForm] = useState({
    studentId: "",
    enrollmentId: "",
    tuitionFee: "",
    discountApplied: 0, // auto-filled
    miscFees: {
      computer: 0,
      internet: 0,
      airConditioning: 0,
      developmentFee: 0,
      registration: 0,
      library: 0,
      scienceLab: 0,
      sportsDevelopment: 0,
      insurance: 0,
      medical: 0,
      instructionalMaterials: 0,
      schoolPublication: 0,
      guidanceAndTesting: 0,
      capstoneProject: 0,
    },
    dueDate: "",
    schoolYear: "",
  });

  const handleEnrollmentSelect = (e) => {
    const enrollmentId = e.target.value;
    const selectedEnrollment = enrollments.find((en) => en._id === enrollmentId);

    setForm({
      ...form,
      enrollmentId,
      schoolYear: selectedEnrollment?.schoolYear || "", // ✅ auto-fill from enrollment
    });
  };


  // ✅ Handle student selection: auto-apply discount
  const handleStudentSelect = (id) => {
    const selectedStudent = students.find((s) => s._id === id);
    setForm({
      ...form,
      studentId: id,
      discountApplied: selectedStudent?.discountApplied ?? 0,
      enrollmentId: "", // reset enrollment when student changes
    });
  };

  // ✅ Filter enrollments by selected student and exclude completed
  const filteredEnrollments = enrollments.filter(
    (e) => e.student?._id === form.studentId && e.status !== "completed"
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMiscChange = (e) => {
    setForm({
      ...form,
      miscFees: {
        ...form.miscFees,
        [e.target.name]: Number(e.target.value),
      },
    });
  };

  const handleSubmit = () => {
    if (!form.studentId || !form.enrollmentId || !form.tuitionFee || !form.dueDate) {
      alert("Please fill in required fields");
      return;
    }
    onSave(form);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={headerStyle}>Add Payment</h2>
        <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          
          {/* ✅ Student selection */}
          <label>Student</label>
          <StudentSelect
            students={students}
            value={form.studentId}
            onChange={handleStudentSelect}
          />

          {/* ✅ Enrollment selection with semester */}
          <label>Enrollment</label>
          <select
            style={inputStyle}
            name="enrollmentId"
            value={form.enrollmentId}
            onChange={handleEnrollmentSelect}
            disabled={!form.studentId || filteredEnrollments.length === 0}
          >
            <option value="">Select Enrollment</option>
            {filteredEnrollments.map((e) => (
              <option key={e._id} value={e._id}>
                {e.schoolYear} - {e.gradeLevel} {e.section ?? '-'} ({semesterLabels[e.semester] ?? e.semester})
              </option>
            ))}
          </select>
          {form.studentId && filteredEnrollments.length === 0 && (
            <span style={{ color: "red", fontSize: "0.9rem" }}>
              No active enrollments available (completed enrollments cannot receive payments).
            </span>
          )}

          {/* ✅ Tuition Fee */}
          <label>Tuition Fee</label>
          <input
            style={inputStyle}
            name="tuitionFee"
            type="number"
            value={form.tuitionFee}
            onChange={handleChange}
          />

          {/* ✅ Misc Fees */}
          <h3 style={{ marginTop: "1rem", color: themeColor }}>Miscellaneous Fees</h3>
          {Object.keys(form.miscFees).map((feeKey) => (
            <div key={feeKey} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ flex: 1, textTransform: "capitalize" }}>
                {feeKey.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                style={{ ...inputStyle, flex: 1 }}
                type="number"
                name={feeKey}
                value={form.miscFees[feeKey]}
                onChange={handleMiscChange}
              />
            </div>
          ))}

          {/* ✅ Due Date */}
          <label>Due Date</label>
          <input
            style={inputStyle}
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
          />

          {/* ✅ School Year */}
          <label>School Year</label>
          <input
            style={inputStyle}
            name="schoolYear"
            value={form.schoolYear}
            onChange={handleChange}
          />
        </div>

        <div style={footerStyle}>
          <button style={cancelBtn} onClick={onClose}>Cancel</button>
          <button style={saveBtn} onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};

// ✅ Styles
const overlayStyle = { position:"fixed", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:1000 };
const modalStyle = { background:"white", borderRadius:"8px", width:"600px", maxWidth:"95%", boxShadow:"0 4px 12px rgba(0,0,0,0.2)", overflow:"auto", maxHeight:"90vh" };
const headerStyle = { background: themeColor, color:"white", padding:"1rem", fontWeight:"bold", fontSize:"1.2rem" };
const footerStyle = { display:"flex", justifyContent:"flex-end", gap:"0.5rem", padding:"1rem", borderTop:"1px solid #eee" };
const cancelBtn = { background:"#ccc", border:"none", padding:"0.5rem 1rem", borderRadius:"4px", cursor:"pointer" };
const saveBtn = { background: themeColor, color:"white", border:"none", padding:"0.5rem 1rem", borderRadius:"4px", cursor:"pointer", fontWeight:"bold" };
const inputStyle = { padding:"0.5rem", borderRadius:"4px", border:"1px solid #ccc", width:"100%" };

export default AddPaymentModal;
