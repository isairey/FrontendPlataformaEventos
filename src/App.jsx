import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import AddService from "./AddService";
import ServiceList from "./ServiceList";
import "./styles.css";

// --- 1. Navbar Component (เมนูบาร์) ---
const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">RENTAL HUB</Link>
        <div className="nav-links">
          <Link to="/">หน้าหลัก</Link>
          {user ? (
            <>
              {/* เมนูนี้จะโผล่เฉพาะตอน Login แล้ว */}
              <Link to="/admin" style={{ color: "var(--primary)", fontWeight: "bold" }}>
                ⚙️ จัดการอุปกรณ์
              </Link>
              <span className="user-name">👤 {user.username}</span>
              <button onClick={logout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">เข้าสู่ระบบ</Link>
              <Link to="/register" className="nav-btn-reg">สมัครสมาชิก</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// --- 2. LoginPage Component (หน้าเข้าสู่ระบบ) ---
const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { username, password });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("เข้าสู่ระบบสำเร็จ!");
      navigate("/admin"); // Login เสร็จให้ไปหน้าจัดการเลย
    } catch (err) {
      alert(err.response?.data || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className="form-card">
      <h2>เข้าสู่ระบบ</h2>
      <form onSubmit={handleLogin}>
        <input className="input-field" type="text" placeholder="ชื่อผู้ใช้" value={username} onChange={e => setUsername(e.target.value)} required />
        <input className="input-field" type="password" placeholder="รหัสผ่าน" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="btn-submit" style={{background: 'var(--primary)'}}>เข้าสู่ระบบ</button>
      </form>
    </div>
  );
};

// --- 3. RegisterPage Component (หน้าสมัครสมาชิก) ---
const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", { username, password });
      alert("สมัครสมาชิกสำเร็จ!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ");
    }
  };

  return (
    <div className="form-card">
      <h2>สมัครสมาชิก</h2>
      <form onSubmit={handleRegister}>
        <input className="input-field" type="text" placeholder="ชื่อผู้ใช้" value={username} onChange={e => setUsername(e.target.value)} required />
        <input className="input-field" type="password" placeholder="รหัสผ่าน" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="btn-submit" style={{background: 'var(--primary)'}}>ลงทะเบียน</button>
      </form>
    </div>
  );
};

// --- 4. Main App Component (ตัวควบคุมหลัก) ---
function App() {
  const [services, setServices] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [user, setUser] = useState(null);

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services");
      setServices(res.data);
    } catch (err) {
      console.error("ดึงข้อมูลไม่สำเร็จ", err);
    }
  };

  useEffect(() => { 
    fetchServices();
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <div className="container">
        <Routes>
          {/* หน้าแสดงรายการอุปกรณ์ให้ลูกค้าทั่วไปดู */}
          <Route path="/" element={
            <>
              <h1 style={{ textAlign: "center", margin: '40px 0' }}>อุปกรณ์ที่มีให้เช่า</h1>
              <ServiceList services={services} setServices={setServices} setEditingItem={setEditingItem} user={user} />
            </>
          } />

          {/* หน้าจัดการอุปกรณ์ (Protected: ต้อง Login เท่านั้น) */}
          <Route path="/admin" element={
            user ? (
              <>
                <h1 style={{ textAlign: "center", marginBottom: '40px' }}>ระบบจัดการอุปกรณ์</h1>
                <AddService editingItem={editingItem} setEditingItem={setEditingItem} fetchServices={fetchServices} />
                <ServiceList services={services} setServices={setServices} setEditingItem={setEditingItem} user={user} />
              </>
            ) : (
              <Navigate to="/login" />
            )
          } />

          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
      <footer className="footer">
        <p>© 2026 RENTAL HUB - All Rights Reserved</p>
      </footer>
    </Router>
  );
}

export default App;