import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

const ServiceList = ({ setEditingItem, services, fetchServices }) => {
  // รับ props มาจาก App.jsx เพื่อให้สื่อสารกับหน้า Add ได้

  const handleDelete = async (id) => {
    if (window.confirm("คุณแน่ใจนะว่าจะลบรายการนี้?")) {
      try {
        await axios.delete(`http://localhost:5000/api/services/${id}`);
        fetchServices(); // อัปเดตข้อมูลใหม่
        alert("ลบสำเร็จแล้ว!");
      } catch (err) {
        alert("ลบไม่ได้: " + err.message);
      }
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>รายการอุปกรณ์</h2>
      <div className="list-section-grid">
        {services.map((item) => (
          <div key={item._id} className="item-card">
            <img src={item.cover} alt={item.name} />
            <h3>{item.name}</h3>
            <p style={{ height: "40px", overflow: "hidden", fontSize: "14px", color: "var(--text-muted)" }}>
              {item.description}
            </p>
            <p className="item-price">{item.price.toLocaleString()} ฿</p>
            
            <div className="card-actions">
              <button 
                className="btn-action btn-edit-item"
                onClick={() => { setEditingItem(item); window.scrollTo({top:0, behavior:'smooth'}); }}
              >
                แก้ไข
              </button>
              <button 
                className="btn-action btn-delete-item"
                onClick={() => handleDelete(item._id)}
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;