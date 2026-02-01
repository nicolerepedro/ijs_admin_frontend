import { useState } from "react";
import { levelLabels, subLevelLabels } from "../../utils/labels";
import { FaEdit, FaTrash } from "react-icons/fa"; // ✅ icon set

const themeColor = "#009150";

const StudentTable = ({ students, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10; // ✅ show 10 per page

  // ✅ Filter students client-side
  const filteredStudents = students.filter((s) => {
    const fullName = `${s.lastName} ${s.firstName} ${s.middleName ?? ""}`.toLowerCase();
    return (
      s.studentNo.toLowerCase().includes(search.toLowerCase()) ||
      fullName.includes(search.toLowerCase()) ||
      (s.email ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const paginatedStudents = filteredStudents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div style={{ overflowX: "auto" }}>
      {/* ✅ Search bar */}
      <input
        type="text"
        placeholder="Search by Student No, Name, or Email..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // reset to first page when searching
        }}
        style={{
          marginBottom: "0.75rem",
          padding: "0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "100%",
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "0.5rem",
          tableLayout: "fixed",
        }}
      >
        <thead style={{ background: themeColor, color: "white" }}>
          <tr>
            <th style={headerStyle}>Student No</th>
            <th style={headerStyle}>Name</th>
            <th style={headerStyle}>Email</th>
            <th style={headerStyle}>Contact</th>
            <th style={headerStyle}>Grade Placement</th>
            <th style={headerStyle}>Discount</th>
            <th style={headerStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStudents.map((s, idx) => (
            <tr
              key={s._id}
              style={{
                backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white", // striped rows
              }}
            >
              <td style={cellStyle}>{s.studentNo}</td>
              <td style={cellStyle}>{`${s.lastName}, ${s.firstName} ${s.middleName ?? ""}`}</td>
              <td
                style={{
                  ...cellStyle,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={s.email}
              >
                {s.email}
              </td>
              <td style={cellStyle}>{s.contactNumber}</td>
              <td style={{ ...cellStyle, textAlign: "center" }}>
                <div style={{ fontWeight: "bold" }}>
                  {levelLabels[s.gradePlacement?.level]}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#555" }}>
                  {subLevelLabels[s.gradePlacement?.subLevel]}
                </div>
              </td>
              <td style={cellStyle}>{(s.discountApplied ?? 0) * 100}%</td>
              <td style={cellStyle}>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                  <button
                    style={iconBtn(themeColor)}
                    onClick={() => onEdit(s)}
                    title="Edit Student"
                  >
                    <FaEdit />
                  </button>
                  <button
                    style={iconBtn("red")}
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this student?")) {
                        onDelete(s._id);
                      }
                    }}
                    title="Delete Student"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {paginatedStudents.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "1rem", color: "#555" }}>
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Pagination controls */}
      {totalPages > 1 && (
        <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "center", gap: "0.5rem" }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={pageBtn}
          >
            Prev
          </button>
          <span style={{ alignSelf: "center" }}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            style={pageBtn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const headerStyle = {
  border: "1px solid #ccc",
  padding: "0.5rem",
  textAlign: "left",
};

const cellStyle = {
  border: "1px solid #ccc",
  padding: "0.5rem",
  verticalAlign: "middle",
};

const iconBtn = (bgColor) => ({
  background: bgColor,
  color: "white",
  border: "none",
  padding: "0.4rem",
  borderRadius: "4px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const pageBtn = {
  background: themeColor,
  color: "white",
  border: "none",
  padding: "0.4rem 0.75rem",
  borderRadius: "4px",
  cursor: "pointer",
};

export default StudentTable;
