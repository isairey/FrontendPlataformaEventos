import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link bto="/" className="nav-logo">RENTAL HUB</Link>
        <div className="nav-links">
          {user ? (
            <>
              <span>ยินดีต้อนรับ, {user.name}</span>
              <button onClick={logout} className="btn-logout">ออกจากระบบ</button>
            </>
          ) : (
            <>
              <Link to="/login">เข้าสู่ระบบ</Link>
              <Link to="/register" className="btn-reg">ลงทะเบียน</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export const Footer = () => (
  <footer className="footer">
    <p>© 2026 Event Rental System. All rights reserved.</p>
  </footer>
);