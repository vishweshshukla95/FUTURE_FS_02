import { useState } from "react";

export default function LeadDetail({ lead, onUpdate, onDelete, onBack }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...lead });
  const statusColor = { New: "#3b82f6", Contacted: "#f59e0b", Converted: "#10b981", Lost: "#ef4444" };

  const handleSave = () => { onUpdate(lead.id, form); setEditing(false); };
  const set = (f, v) => setForm({ ...form, [f]: v });

  return (
    <div className="lead-detail">
      <button className="btn-back" onClick={onBack}>← Back to Leads</button>

      <div className="card">
        <div className="card-header">
          <div className="lead-header-info">
            <div className="lead-avatar">{lead.name[0].toUpperCase()}</div>
            <div>
              <h2 className="lead-name">{lead.name}</h2>
              <span className="badge" style={{ background: `${statusColor[lead.status]}20`, color: statusColor[lead.status] }}>{lead.status}</span>
            </div>
          </div>
          <div className="detail-actions">
            {!editing ? (
              <>
                <button className="btn-outline" onClick={() => setEditing(true)}>✏️ Edit</button>
                <button className="btn-danger" onClick={() => onDelete(lead.id)}>🗑️ Delete</button>
              </>
            ) : (
              <>
                <button className="btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleSave}>💾 Save</button>
              </>
            )}
          </div>
        </div>

        {!editing ? (
          <div className="detail-grid">
            {[
              { label: "📧 Email", value: lead.email || "Not provided" },
              { label: "📞 Phone", value: lead.phone || "Not provided" },
              { label: "🌐 Source", value: lead.source || "Not provided" },
              { label: "📅 Added", value: new Date(lead.created_at).toLocaleDateString() },
            ].map((item) => (
              <div key={item.label} className="detail-item">
                <p className="detail-label">{item.label}</p>
                <p className="detail-value">{item.value}</p>
              </div>
            ))}
            <div className="detail-item full-width">
              <p className="detail-label">📝 Notes</p>
              <p className="detail-value">{lead.notes || "No notes added."}</p>
            </div>
          </div>
        ) : (
          <div className="lead-form">
            <div className="form-grid">
              {[
                { label: "Name", field: "name", type: "text" },
                { label: "Email", field: "email", type: "email" },
                { label: "Phone", field: "phone", type: "text" },
              ].map((f) => (
                <div key={f.field} className="form-group">
                  <label>{f.label}</label>
                  <input type={f.type} value={form[f.field] || ""} onChange={(e) => set(f.field, e.target.value)} />
                </div>
              ))}
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
              <textarea rows={4} value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
