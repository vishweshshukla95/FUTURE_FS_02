export default function Dashboard({ stats, leads, onViewLead, setPage }) {
  const recent = leads.slice(0, 5);
  const statusColor = { New: "#3b82f6", Contacted: "#f59e0b", Converted: "#10b981", Lost: "#ef4444" };

  return (
    <div className="dashboard">
      {/* STATS */}
      <div className="stats-grid">
        {[
          { label: "Total Leads", value: stats.total || 0, icon: "👥", color: "#3b82f6" },
          { label: "New", value: stats.new_leads || 0, icon: "🆕", color: "#6366f1" },
          { label: "Contacted", value: stats.contacted || 0, icon: "📞", color: "#f59e0b" },
          { label: "Converted", value: stats.converted || 0, icon: "✅", color: "#10b981" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ borderTop: `4px solid ${s.color}` }}>
            <div className="stat-icon" style={{ background: `${s.color}15` }}>{s.icon}</div>
            <div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT LEADS */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Leads</h2>
          <button className="btn-link" onClick={() => setPage("leads")}>View All →</button>
        </div>
        {recent.length === 0 ? (
          <div className="empty-state">
            <p>📭 No leads yet. <button className="btn-link" onClick={() => setPage("add")}>Add your first lead!</button></p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Source</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {recent.map((lead) => (
                <tr key={lead.id}>
                  <td><strong>{lead.name}</strong></td>
                  <td>{lead.email || "—"}</td>
                  <td>{lead.source || "—"}</td>
                  <td><span className="badge" style={{ background: `${statusColor[lead.status]}20`, color: statusColor[lead.status] }}>{lead.status}</span></td>
                  <td><button className="btn-sm" onClick={() => onViewLead(lead)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CONVERSION RATE */}
      <div className="card">
        <h2 className="card-title">Conversion Overview</h2>
        <div className="progress-list">
          {[
            { label: "New", value: stats.new_leads || 0, total: stats.total || 1, color: "#3b82f6" },
            { label: "Contacted", value: stats.contacted || 0, total: stats.total || 1, color: "#f59e0b" },
            { label: "Converted", value: stats.converted || 0, total: stats.total || 1, color: "#10b981" },
            { label: "Lost", value: stats.lost || 0, total: stats.total || 1, color: "#ef4444" },
          ].map((item) => (
            <div key={item.label} className="progress-item">
              <div className="progress-header">
                <span>{item.label}</span>
                <span>{item.value} ({Math.round((item.value / item.total) * 100)}%)</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(item.value / item.total) * 100}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
