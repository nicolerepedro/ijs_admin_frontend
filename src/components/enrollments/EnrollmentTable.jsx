import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // ✅ icon set

const themeColor = "#009150";

// ✅ Mapping dictionaries for readability
const semesterLabels = {
  firstSemester: "First Semester",
  secondSemester: "Second Semester",
  summer: "Summer",
};


const statusLabels = {
  enrolled: "Enrolled",
  dropped: "Dropped",
  completed: "Completed",
};

const EnrollmentTable = ({ enrollments, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10; // ✅ show 10 per page

  // ✅ Filter enrollments client-side
  const filteredEnrollments = enrollments.filter((e) => {
    const studentName = e.student
      ? `${e.student.lastName} ${e.student.firstName} ${e.student.middleName ?? ""}`.toLowerCase()
      : "";
    return (
      studentName.includes(search.toLowerCase()) ||
      (e.schoolYear ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (semesterLabels[e.semester] ?? e.semester ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (e.gradeLevel ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (e.section ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (e.program ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (statusLabels[e.status] ?? e.status ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredEnrollments.length / pageSize);
  const paginatedEnrollments = filteredEnrollments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div style={{ overflowX: "auto" }}>
      {/* ✅ Search bar */}
      <input
        type="text"
        placeholder="Search by Student, Year, Semester, Program, or Status..."
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
            <th style={headerStyle}>Student</th>
            <th style={headerStyle}>School Year</th>
            <th style={headerStyle}>Semester</th>
            <th style={headerStyle}>Grade Level</th>
            <th style={headerStyle}>Section</th>
            <th style={headerStyle}>Program</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEnrollments.map((e, idx) => (
            <tr
              key={e._id}
              style={{
                backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white", // striped rows
              }}
            >
              <td style={cellStyle}>
                {e.student
                  ? `${e.student.lastName}, ${e.student.firstName} ${e.student.middleName ?? ""}`
                  : "—"}
              </td>
              <td style={cellStyle}>{e.schoolYear}</td>
              <td style={cellStyle}>{semesterLabels[e.semester] ?? e.semester}</td>
              <td style={cellStyle}>{e.gradeLevel}</td>
              <td style={cellStyle}>{e.section ?? "—"}</td>
              <td style={cellStyle}>{e.program ?? "—"}</td>
              <td style={cellStyle}>{statusLabels[e.status] ?? e.status}</td>
              <td style={cellStyle}>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                  <button
                    style={iconBtn(themeColor)}
                    onClick={() => onEdit(e)}
                    title="Edit Enrollment"
                  >
                    <FaEdit />
                  </button>
                  <button
                    style={iconBtn("red")}
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this enrollment?")) {
                        onDelete(e._id);
                      }
                    }}
                    title="Delete Enrollment"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {paginatedEnrollments.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "1rem", color: "#555" }}>
                No enrollments found
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

const completedBadge = {
  background: "#d4edda",
  color: "#155724",
  padding: "0.25rem 0.5rem",
  borderRadius: "4px",
  fontWeight: "bold",
};

export default EnrollmentTable;
