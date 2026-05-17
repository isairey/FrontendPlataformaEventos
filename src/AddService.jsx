import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css"; // มั่นใจว่า import ไฟล์ css

const AddService = ({ editingItem, setEditingItem, fetchServices }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setPrice(editingItem.price);
      setDescription(editingItem.description);
    } else {
      clearForm();
    }
  }, [editingItem]);

  const clearForm = () => {
    setName(""); setPrice(""); setDescription(""); setFile(null);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`http://localhost:5000/api/services/${editingItem._id}`, {
          name, price: Number(price), description
        });
        alert("แก้ไขสำเร็จ!");
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("file", file);
        await axios.post("http://localhost:5000/api/services", formData);
        alert("บันทึกสำเร็จ!");
      }
      clearForm();
      fetchServices();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className={`add-form-section ${editingItem ? "is-editing" : ""}`}>
      <h2 style={{ textAlign: "center", marginTop: 0 }}>
        {editingItem ? "📝 แก้ไขอุปกรณ์" : "➕ เพิ่มอุปกรณ์"}
      </h2>
      <form onSubmit={handleSubmit}>
        <input className="form-input" value={name} type="text" placeholder="ชื่อ" onChange={(e) => setName(e.target.value)} required />
        <input className="form-input" value={price} type="number" placeholder="ราคา" onChange={(e) => setPrice(e.target.value)} required />
        <textarea className="form-input" value={description} placeholder="รายละเอียด" onChange={(e) => setDescription(e.target.value)} required />
        
        {!editingItem && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "12px", display: "block", marginBottom: "5px" }}>รูปภาพอุปกรณ์:</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" className="btn-submit-form" style={{ background: editingItem ? "var(--warning)" : "var(--primary)" }}>
            {editingItem ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}
          </button>
          {editingItem && (
            <button type="button" onClick={clearForm} className="btn-submit-form" style={{ background: "#6c757d" }}>ยกเลิก</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddService;