import { useState } from "react";

const themeColor = "#009150";

const UpdatePaymentModal = ({ payment, onClose, onSave }) => {
  const [form, setForm] = useState({
    tuitionFee: payment.tuitionFee,
    discountApplied: payment.discountApplied,
    dueDate: payment.dueDate ? payment.dueDate.slice(0, 10) : "",
    status: payment.status,
    miscFees: {
      computer: payment.miscFees?.computer ?? 0,
      internet: payment.miscFees?.internet ?? 0,
      airConditioning: payment.miscFees?.airConditioning ?? 0,
      developmentFee: payment.miscFees?.developmentFee ?? 0,
      registration: payment.miscFees?.registration ?? 0,
      library: payment.miscFees?.library ?? 0,
      scienceLab: payment.miscFees?.scienceLab ?? 0,
      sportsDevelopment: payment.miscFees?.sportsDevelopment ?? 0,
      insurance: payment.miscFees?.insurance ?? 0,
      medical: payment.miscFees?.medical ?? 0,
      instructionalMaterials: payment.miscFees?.instructionalMaterials ?? 0,
      schoolPublication: payment.miscFees?.schoolPublication ?? 0,
      guidanceAndTesting: payment.miscFees?.guidanceAndTesting ?? 0,
      capstoneProject: payment.miscFees?.capstoneProject ?? 0,
    },
  });

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
    onSave(payment._id, form);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={headerStyle}>Update Payment</h2>
        <div style={bodyStyle}>
          {/* Tuition Fee */}
          <label>Tuition Fee</label>
          <input
            style={inputStyle}
            name="tuitionFee"
            type="number"
            value={form.tuitionFee}
            onChange={handleChange}
          />

          {/* Discount */}
          <label>Discount (0–1)</label>
          <input
            style={inputStyle}
            name="discountApplied"
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={form.discountApplied}
            onChange={handleChange}
          />

          {/* ✅ Misc Fees Section */}
          <h3 style={{ marginTop: "1rem", color: themeColor }}>Miscellaneous Fees</h3>
          {Object.keys(form.miscFees).map((feeKey) => (
            <div
              key={feeKey}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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

          {/* Due Date */}
          <label>Due Date</label>
          <input
            style={inputStyle}
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
          />

          {/* Status */}
          <label>Status</label>
          <select
            style={inputStyle}
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div style={footerStyle}>
          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button style={saveBtn} onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};
const modalStyle = {
  background: "white",
  borderRadius: "8px",
  width: "600px",
  maxWidth: "95%",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  overflow: "auto",
  maxHeight: "90vh",
};
const headerStyle = {
  background: themeColor,
  color: "white",
  padding: "1rem",
  fontWeight: "bold",
  fontSize: "1.2rem",
};
const bodyStyle = {
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};
const footerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.5rem",
  padding: "1rem",
  borderTop: "1px solid #eee",
};
const cancelBtn = {
  background: "#ccc",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
};
const saveBtn = {
  background: themeColor,
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};
const inputStyle = {
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  width: "100%",
};

export default UpdatePaymentModal;
