import React, { useState } from "react";
import axios from "axios";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      alert("เข้าสู่ระบบสำเร็จ!");
    } catch (err) { alert("อีเมลหรือรหัสผ่านผิด"); }
  };

  return (
    <div className="form-card">
      <h2>เข้าสู่ระบบ</h2>
      <form onSubmit={handleLogin}>
        <input className="form-input" type="email" placeholder="อีเมล" onChange={e => setEmail(e.target.value)} />
        <input className="form-input" type="password" placeholder="รหัสผ่าน" onChange={e => setPassword(e.target.value)} />
        <button className="btn-submit-form" style={{background: 'var(--primary)'}}>Login</button>
      </form>
    </div>
  );
};
export default Login;