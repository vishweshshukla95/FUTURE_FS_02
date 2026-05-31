import { useState } from "react";

export default function LeadsList({ leads, onView, onDelete }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const statusColor = { New: "#3b82f6", Contacted: "#f59e0b", Converted: "#10b981", Lost: "#ef4444" };

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.email && l.email.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === "All" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="leads-list">
      {/* FILTERS */}
      <div className="filters">
        <input className="search-input" type="text" placeholder="🔍 Search by name or email..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="filter-tabs">
          {["All", "New", "Contacted", "Converted", "Lost"].map((s) => (
            <button key={s} className={`filter-tab ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Leads ({filtered.length})</h2>
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state">📭 No leads found.</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Source</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr key={lead.id}>
                    <td>{i + 1}</td>
                    <td><strong>{lead.name}</strong></td>
                    <td>{lead.email || "—"}</td>
                    <td>{lead.phone || "—"}</td>
                    <td>{lead.source || "—"}</td>
                    <td>
                      <span className="badge" style={{ background: `${statusColor[lead.status]}20`, color: statusColor[lead.status] }}>
                        {lead.status}
                      </span>
                    </td>
                    <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-sm" onClick={() => onView(lead)}>👁 View</button>
                        <button className="btn-sm danger" onClick={() => onDelete(lead.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
