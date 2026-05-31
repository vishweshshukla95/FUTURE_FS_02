import { useState } from "react";

export default function AddLead({ onAdd, onCancel }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", source: "Website", status: "New", notes: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onAdd(form);
  };

  const set = (field, val) => { setForm({ ...form, [field]: val }); setErrors({ ...errors, [field]: "" }); };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h2 className="card-title">➕ Add New Lead</h2>
      </div>
      <form onSubmit={handleSubmit} className="lead-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" placeholder="e.g. Rahul Sharma" value={form.name} onChange={(e) => set("name", e.target.value)} className={errors.name ? "error" : ""} />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="e.g. rahul@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} className={errors.email ? "error" : ""} />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" placeholder="e.g. +91 9876543210" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Source</label>
            <select value={form.source} onChange={(e) => set("source", e.target.value)}>
              {["Website", "LinkedIn", "Referral", "Cold Call", "Email", "Other"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)}>
              {["New", "Contacted", "Converted", "Lost"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea rows={4} placeholder="Add any notes about this lead..." value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </div>
        <div className="form-actions">
          <button type="button" className="btn-outline" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-primary">Add Lead ✅</button>
        </div>
      </form>
    </div>
  );
}
