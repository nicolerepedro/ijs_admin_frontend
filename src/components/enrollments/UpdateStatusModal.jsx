import { useState } from "react";

const UpdateStatusModal = ({ enrollment, onClose, onSave }) => {
  const [status, setStatus] = useState(enrollment.status);
  const [remarks, setRemarks] = useState(enrollment.remarks || "");

  const handleSubmit = () => {
    onSave(status, remarks);
  };

  return (
    <div style={modalOverlay}>
      <div style={modalCard}>
        <h2 style={modalHeader}>Update Status</h2>
        <p style={{ marginBottom: "1rem" }}>
          <strong>Student:</strong> {enrollment.student?.lastName}, {enrollment.student?.firstName}
        </p>

        <div style={formGrid}>
          <label>Status</label>
          {enrollment.status === "completed" ? (
            // ✅ Show read-only badge if already completed
            <span style={completedBadge}>Completed ✅</span>
          ) : (
            <select
              style={inputStyle}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="enrolled">Enrolled</option>
              <option value="dropped">Dropped</option>
              <option value='completed'>Completed</option>
              {/* ❌ omit "completed" from selectable options */}
            </select>
          )}

          <label>Remarks</label>
          <textarea
            style={{ ...inputStyle, minHeight: "80px" }}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        <div style={actionsRow}>
          <button style={btnGreen} onClick={handleSubmit}>Save</button>
          <button style={btnGray} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ✅ Styles
const modalOverlay = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
};
const modalCard = { background: "white", padding: "1.5rem", borderRadius: "8px", width: "400px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" };
const modalHeader = { marginBottom: "1rem", color: "#009150" };
const formGrid = { display: "grid", gap: "0.75rem" };
const inputStyle = { padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", width: "100%" };
const actionsRow = { marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" };
const btnGreen = { background: "#009150", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" };
const btnGray = { background: "#ccc", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" };
const completedBadge = { padding: "0.5rem", background: "#eee", borderRadius: "4px", fontWeight: "bold", color: "#009150" };

export default UpdateStatusModal;
