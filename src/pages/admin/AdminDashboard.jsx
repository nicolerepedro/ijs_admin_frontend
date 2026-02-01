// src/pages/admin/AdminDashboard.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "../../api/studentApi";
import { fetchEnrollments } from "../../api/enrollmentApi";
import { fetchPayments } from "../../api/paymentApi";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const themeColor = "#009150";

const semesterLabels = {
  firstSemester: "First Semester",
  secondSemester: "Second Semester",
  summer: "Summer",
};

const AdminDashboard = () => {
  const [selectedYear, setSelectedYear] = useState("");

  // ✅ Fetch data
  const { data: students = [] } = useQuery({ queryKey: ["students"], queryFn: fetchStudents });
  const { data: enrollments = [] } = useQuery({ queryKey: ["enrollments"], queryFn: fetchEnrollments });
  const { data: payments = [] } = useQuery({ queryKey: ["payments"], queryFn: fetchPayments });

  // ✅ Extract available school years
  const schoolYears = [...new Set(enrollments.map((e) => e.schoolYear))];

  // ✅ Filter data by selected year
  const filteredEnrollments = selectedYear
    ? enrollments.filter((e) => e.schoolYear === selectedYear)
    : enrollments;

  const filteredPayments = selectedYear
    ? payments.filter((p) => p.schoolYear === selectedYear)
    : payments;

  // ✅ Compute summaries
  const totalStudents = students.length;
  const totalEnrollments = filteredEnrollments.length;
  const activeEnrollments = filteredEnrollments.filter((e) => e.status === "enrolled").length;
  const droppedEnrollments = filteredEnrollments.filter((e) => e.status === "dropped").length;
  const completedEnrollments = filteredEnrollments.filter((e) => e.status === "completed").length;

  const totalPayments = filteredPayments.length;
  const totalRevenue = filteredPayments.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const overduePayments = filteredPayments.filter((p) => p.status === "overdue").length;

  // ✅ Revenue trend by month
  const revenueByMonth = {};
  filteredPayments.forEach((p) => {
    const month = new Date(p.createdAt).toLocaleString("default", { month: "short", year: "numeric" });
    revenueByMonth[month] = (revenueByMonth[month] || 0) + (p.totalAmount || 0);
  });

  const revenueChartData = {
    labels: Object.keys(revenueByMonth),
    datasets: [
      {
        label: "Revenue",
        data: Object.values(revenueByMonth),
        borderColor: themeColor,
        backgroundColor: "rgba(0,145,80,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } },
  };

  // ✅ Enrollments by semester (stacked bar)
  const semesters = [...new Set(filteredEnrollments.map((e) => e.semester))];
  const enrolledCounts = semesters.map((s) => filteredEnrollments.filter((e) => e.semester === s && e.status === "enrolled").length);
  const droppedCounts = semesters.map((s) => filteredEnrollments.filter((e) => e.semester === s && e.status === "dropped").length);
  const completedCounts = semesters.map((s) => filteredEnrollments.filter((e) => e.semester === s && e.status === "completed").length);

  const enrollmentChartData = {
    labels: semesters.map((s) => semesterLabels[s] ?? s),
    datasets: [
      { label: "Enrolled", data: enrolledCounts, backgroundColor: "#009150" },
      { label: "Dropped", data: droppedCounts, backgroundColor: "#ff9800" },
      { label: "Completed", data: completedCounts, backgroundColor: "#4caf50" },
    ],
  };

  const enrollmentChartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: themeColor }}>Admin Dashboard</h2>
      <p>Overview of students, enrollments, and payments.</p>

      {/* ✅ School Year Filter */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "0.5rem" }}>Filter by School Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="">All Years</option>
          {schoolYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* ✅ Summary widgets */}
      <div style={gridStyle}>
        <SummaryCard title="Total Students" value={totalStudents} />
        <SummaryCard title="Total Enrollments" value={totalEnrollments} />
        <SummaryCard title="Active Enrollments" value={activeEnrollments} />
        <SummaryCard title="Dropped Enrollments" value={droppedEnrollments} />
        <SummaryCard title="Completed Enrollments" value={completedEnrollments} />
        <SummaryCard title="Total Payments" value={totalPayments} />
        <SummaryCard title="Total Revenue" value={`₱${totalRevenue.toLocaleString()}`} />
        <SummaryCard title="Overdue Payments" value={overduePayments} highlight />
      </div>

      {/* ✅ Revenue trend chart */}
      <div style={chartCard}>
        <h3 style={{ marginBottom: "1rem", color: themeColor }}>Revenue Trend</h3>
        <Line data={revenueChartData} options={revenueChartOptions} />
      </div>

      {/* ✅ Enrollments by semester chart */}
      <div style={chartCard}>
        <h3 style={{ marginBottom: "1rem", color: themeColor }}>Enrollments by Semester</h3>
        <Bar data={enrollmentChartData} options={enrollmentChartOptions} />
      </div>
    </div>
  );
};

// ✅ Summary card component
const SummaryCard = ({ title, value, highlight }) => (
  <div
    style={{
      background: highlight ? "#ffe6e6" : "white",
      border: `2px solid ${highlight ? "red" : "#ccc"}`,
      borderRadius: "8px",
      padding: "1rem",
      textAlign: "center",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    }}
  >
    <h3 style={{ marginBottom: "0.5rem", color: "#555" }}>{title}</h3>
    <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: highlight ? "red" : themeColor }}>
      {value}
    </p>
  </div>
);

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1rem",
  marginTop: "1rem",
};

const chartCard = {
  marginTop: "2rem",
  background: "white",
  padding: "1rem",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

export default AdminDashboard;
