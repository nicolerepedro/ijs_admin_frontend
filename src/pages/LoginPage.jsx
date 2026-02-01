import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const themeColor = "#009150";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/staff/auth/login`,
        { username: username.trim(), password: password.trim() }
      );

      if (res.data.success) {
        const { token, staff } = res.data;

        // ✅ Only allow admin role
        if (staff.role.toLowerCase() !== "admin") {
          toast.error("Access denied: only admins can log in here.");
          setLoading(false);
          return;
        }

        // Save token + role
        login(token, staff.role);
        localStorage.setItem("token", token);
        localStorage.setItem("role", staff.role.toLowerCase());

        toast.success("Login successful! Redirecting…", { autoClose: 2000 });
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: themeColor, marginBottom: "0.5rem" }}>Admin Login</h2>
        <p style={{ color: "#6B7280", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
          Please enter your admin credentials to continue
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Username */}
          <div style={{ textAlign: "left" }}>
            <label style={labelStyle}>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={inputStyle}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div style={{ textAlign: "left" }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={inputStyle}
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              ...buttonStyle,
              background: loading ? "#6B7280" : themeColor,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading || !username || !password}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "#6B7280" }}>
          © {new Date().getFullYear()} IJS Payment System
        </p>
      </div>
    </div>
  );
};

// ✅ Styles
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #009150 0%, #00b37a 100%)",
  padding: "1rem",
};

const cardStyle = {
  background: "white",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "400px",
  textAlign: "center",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const labelStyle = {
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "#374151",
  marginBottom: "0.25rem",
};

const inputStyle = {
  padding: "0.65rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
  fontSize: "0.95rem",
  outline: "none",
  transition: "border-color 0.2s ease",
};

const buttonStyle = {
  padding: "0.75rem",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  transition: "background 0.2s ease",
};

export default LoginPage;
