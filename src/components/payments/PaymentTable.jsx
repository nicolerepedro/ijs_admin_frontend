import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const themeColor = "#009150";

const statusLabels = {
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
  overdue: "Overdue",
};

const PaymentTable = ({ payments, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = payments.filter((p) => {
    const studentName = p.student
      ? `${p.student.lastName} ${p.student.firstName}`.toLowerCase()
      : "";
    return (
      studentName.includes(search.toLowerCase()) ||
      (p.schoolYear ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (statusLabels[p.status] ?? p.status ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ overflowX: "auto" }}>
      <input
        type="text"
        placeholder="Search by Student, Year, or Status..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{
          marginBottom: "0.75rem",
          padding: "0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "100%",
        }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.5rem" }}>
        <thead style={{ background: themeColor, color: "white" }}>
          <tr>
            <th style={headerStyle}>Student</th>
            <th style={headerStyle}>School Year</th>
            <th style={headerStyle}>Tuition Fee</th>
            <th style={headerStyle}>Discount</th>
            <th style={headerStyle}>Misc Total</th>
            <th style={headerStyle}>Total Amount</th>
            <th style={headerStyle}>Due Date</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((p, idx) => {
            const miscTotal = Object.values(p.miscFees || {}).reduce((sum, fee) => sum + fee, 0);
            return (
              <tr key={p._id} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}>
                <td style={cellStyle}>
                  {p.student
                    ? `${p.student.lastName}, ${p.student.firstName}`
                    : "—"}
                </td>
                <td style={cellStyle}>{p.schoolYear}</td>
                <td style={cellStyle}>{p.tuitionFee}</td>
                <td style={cellStyle}>{(p.discountApplied ?? 0) * 100}%</td>
                <td style={cellStyle}>{miscTotal}</td>
                <td style={cellStyle}>{p.totalAmount}</td>
                <td style={cellStyle}>{new Date(p.dueDate).toLocaleDateString()}</td>
                <td style={cellStyle}>{statusLabels[p.status] ?? p.status}</td>
                <td style={cellStyle}>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                    <button
                      style={iconBtn(themeColor)}
                      onClick={() => onEdit(p)}
                      title="Edit Payment"
                    >
                      <FaEdit />
                    </button>
                    <button
                      style={iconBtn("red")}
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this payment?")) {
                          onDelete(p._id);
                        }
                      }}
                      title="Delete Payment"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {paginated.length === 0 && (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", padding: "1rem", color: "#555" }}>
                No payments found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "center", gap: "0.5rem" }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)} style={pageBtn}>
            Prev
          </button>
          <span style={{ alignSelf: "center" }}>
            Page {page} of {totalPages}
          </span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} style={pageBtn}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const headerStyle = { border: "1px solid #ccc", padding: "0.5rem", textAlign: "left" };
const cellStyle = { border: "1px solid #ccc", padding: "0.5rem", verticalAlign: "middle" };
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

export default PaymentTable;
