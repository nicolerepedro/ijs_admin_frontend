import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import {
  FaHome,
  FaUserGraduate,
  FaClipboardList,
  FaMoneyBill,
  FaSignOutAlt,
  FaSchool,
} from "react-icons/fa";

const themeColor = "#009150";

const AdminLayout = () => {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: collapsed ? "70px" : "220px",
          background: themeColor,
          padding: "1rem",
          color: "white",
          display: "flex",
          flexDirection: "column",
          height: "95vh",
          position: "sticky",
          top: 0,
          transition: "width 0.3s ease",
        }}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        {/* ✅ Branding with fixed height */}
        <div
          style={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <FaSchool size={28} />
          <span
            style={{
              marginLeft: collapsed ? 0 : "0.5rem",
              fontWeight: "bold",
              fontSize: "1.2rem",
              whiteSpace: "nowrap",
              opacity: collapsed ? 0 : 1,
              transform: collapsed ? "translateX(-10px)" : "translateX(0)",
              transition: "opacity 0.3s ease, transform 0.3s ease, margin-left 0.3s ease",
            }}
          >
            IJS Admin
          </span>
        </div>

        <div style={{ flex: 1 }}>
          <nav>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <NavItem to="/admin/dashboard" icon={<FaHome />} label="Dashboard" collapsed={collapsed} delay={0} />
              <NavItem to="/admin/students" icon={<FaUserGraduate />} label="Students" collapsed={collapsed} delay={0.05} />
              <NavItem to="/admin/enrollments" icon={<FaClipboardList />} label="Enrollments" collapsed={collapsed} delay={0.1} />
              <NavItem to="/admin/payments" icon={<FaMoneyBill />} label="Payments" collapsed={collapsed} delay={0.15} />
            </ul>
          </nav>
        </div>

        {/* ✅ Logout pinned at bottom */}
        <button
          onClick={logout}
          title="Logout"
          style={{
            marginTop: "auto",
            padding: "0.5rem",
            background: "white",
            color: themeColor,
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            transition: "all 0.3s ease",
          }}
        >
          <FaSignOutAlt />
          <span
            style={{
              marginLeft: collapsed ? 0 : "0.5rem",
              opacity: collapsed ? 0 : 1,
              transform: collapsed ? "translateX(-10px)" : "translateX(0)",
              transition: "opacity 0.3s ease, transform 0.3s ease, margin-left 0.3s ease",
              whiteSpace: "nowrap",
            }}
          >
            Logout
          </span>
        </button>
      </aside>

      <main
        style={{
          flex: 1,
          padding: "1rem",
          background: "#f9f9f9",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

// ✅ NavItem with stable icon + conditional margin
const NavItem = ({ to, icon, label, collapsed, delay }) => (
  <li>
    <NavLink
      to={to}
      title={label}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        padding: "0.5rem",
        color: isActive ? themeColor : "white",
        background: isActive ? "white" : "transparent",
        textDecoration: "none",
        borderRadius: "4px",
        marginBottom: "0.5rem",
        fontWeight: isActive ? "bold" : "normal",
        transition: "all 0.3s ease",
        boxShadow: isActive ? "0 0 6px rgba(255,255,255,0.6)" : "none",
      })}
    >
      {/* ✅ Icon always visible */}
      <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      {/* ✅ Label slides in/out with stagger */}
      <span
        style={{
          marginLeft: collapsed ? 0 : "0.5rem",
          opacity: collapsed ? 0 : 1,
          transform: collapsed ? "translateX(-10px)" : "translateX(0)",
          transition: `opacity 0.3s ease ${delay}s, transform 0.3s ease ${delay}s, margin-left 0.3s ease ${delay}s`,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </NavLink>
  </li>
);

export default AdminLayout;
