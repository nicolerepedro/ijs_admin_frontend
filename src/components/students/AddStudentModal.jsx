import { useState, useEffect } from "react";
import { levelLabels, subLevelLabels, gradeOptions } from "../../utils/labels";

const themeColor = "#009150";

const AddStudentModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    studentNo: "",
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    contactNumber: "",
    discountApplied: 0,
    level: "",
    subLevel: "",
    password: "", // hidden, auto-generated
  });

  // ✅ Auto-generate password whenever names change
  useEffect(() => {
    const { firstName, middleName, lastName } = form;
    if (firstName && middleName && lastName) {
      const fn = firstName.trim().toLowerCase();
      const mn = middleName.trim().toLowerCase();
      const ln = lastName.trim().toLowerCase();
      const firstTwoFn = fn.slice(0, 2);
      const firstTwoMn = mn.slice(0, 2);
      const lastTwoLn = ln.slice(-2);
      const fullFnNoSpaces = fn.replace(/\s+/g, "");
      const generatedPassword = `${firstTwoFn}${firstTwoMn}${lastTwoLn}${fullFnNoSpaces}`;
      setForm((prev) => ({ ...prev, password: generatedPassword }));
    }
  }, [form.firstName, form.middleName, form.lastName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>Register New Student</div>

        <div style={bodyStyle}>
          {/* Student Info */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Student No</label>
            <input name="studentNo" value={form.studentNo} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>Middle Name</label>
            <input name="middleName" value={form.middleName} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>Contact Number</label>
            <input name="contactNumber" value={form.contactNumber} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>Discount (%)</label>
            <input
              type="number"
              name="discountApplied"
              min="0"
              max="100"
              value={form.discountApplied}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Level & SubLevel */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Level</label>
            <select name="level" value={form.level} onChange={handleChange} style={inputStyle}>
              <option value="">Select Level</option>
              {Object.entries(levelLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>SubLevel</label>
            <select
              name="subLevel"
              value={form.subLevel}
              onChange={handleChange}
              disabled={!form.level}
              style={inputStyle}
            >
              <option value="">Select SubLevel</option>
              {form.level &&
                gradeOptions[form.level].map((sub) => (
                  <option key={sub} value={sub}>{subLevelLabels[sub]}</option>
                ))}
            </select>
          </div>
        </div>

        <div style={footerStyle}>
          <button style={cancelBtn} onClick={onClose}>Cancel</button>
          <button style={saveBtn} onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
};

// Styles
const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalStyle = { background: "white", borderRadius: "8px", width: "500px", maxWidth: "90%", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", overflow: "hidden", display: "flex", flexDirection: "column" };
const headerStyle = { background: themeColor, color: "white", padding: "1rem", fontWeight: "bold", fontSize: "1.2rem" };
const bodyStyle = { padding: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };
const sectionStyle = { display: "flex", flexDirection: "column" };
const labelStyle = { fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "0.25rem" };
const inputStyle = { padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s ease" };
const footerStyle = { display: "flex", justifyContent: "flex-end", gap: "0.5rem", padding: "1rem", borderTop: "1px solid #eee" };
const cancelBtn = { background: "#ccc", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" };
const saveBtn = { background: themeColor, color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };

export default AddStudentModal;
