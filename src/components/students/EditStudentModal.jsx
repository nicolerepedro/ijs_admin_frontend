import { levelLabels, subLevelLabels, gradeOptions } from "../../utils/labels";

const themeColor = "#009150";

const EditStudentModal = ({
  student,
  discount,
  setDiscount,
  level,
  setLevel,
  subLevel,
  setSubLevel,
  activeTab,
  setActiveTab,
  onClose,
  onSave,
}) => {
  if (!student) return null;

  return (
    <div
      style={{
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
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          width: "500px",
          maxWidth: "90%",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: themeColor,
            color: "white",
            padding: "1rem",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          Edit Student: {student.lastName}, {student.firstName}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "1rem", margin: "1rem" }}>
          <button
            style={{
              flex: 1,
              padding: "0.5rem",
              background: activeTab === "discount" ? themeColor : "#eee",
              color: activeTab === "discount" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => setActiveTab("discount")}
          >
            Discount
          </button>
          <button
            style={{
              flex: 1,
              padding: "0.5rem",
              background: activeTab === "grade" ? themeColor : "#eee",
              color: activeTab === "grade" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => setActiveTab("grade")}
          >
            Grade Placement
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "1rem" }}>
          {activeTab === "discount" && (
            <label>
              Discount (%)
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginTop: "0.5rem",
                }}
              />
            </label>
          )}

          {activeTab === "grade" && (
            <>
              <label>
                Level
                <select
                  value={level}
                  onChange={(e) => {
                    setLevel(e.target.value);
                    setSubLevel("");
                  }}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    marginTop: "0.5rem",
                  }}
                >
                  <option value="">Select Level</option>
                  {Object.entries(levelLabels).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ marginTop: "1rem" }}>
                SubLevel
                <select
                  value={subLevel}
                  onChange={(e) => setSubLevel(e.target.value)}
                  disabled={!level}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    marginTop: "0.5rem",
                  }}
                >
                  <option value="">Select SubLevel</option>
                  {level &&
                    gradeOptions[level].map((sub) => (
                      <option key={sub} value={sub}>
                        {subLevelLabels[sub]}
                      </option>
                    ))}
                </select>
              </label>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            padding: "1rem",
            borderTop: "1px solid #eee",
          }}
        >
          <button
            style={{
              background: "#ccc",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            style={{
              background: themeColor,
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;
