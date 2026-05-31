import { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import LeadsList from "./components/LeadsList";
import AddLead from "./components/AddLead";
import LeadDetail from "./components/LeadDetail";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedLead, setSelectedLead] = useState(null);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const API = "";

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/leads`);
      const data = await res.json();
      setLeads(data);
    } catch {
      showToast("Failed to fetch leads", "error");
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/stats`);
      const data = await res.json();
      setStats(data);
    } catch {}
  };

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, []);

  const addLead = async (lead) => {
    try {
      const res = await fetch(`${API}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (res.ok) {
        showToast("✅ Lead added successfully!");
        fetchLeads(); fetchStats();
        setPage("leads");
      }
    } catch { showToast("Failed to add lead", "error"); }
  };

  const updateLead = async (id, lead) => {
    try {
      const res = await fetch(`${API}/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (res.ok) {
        showToast("✅ Lead updated successfully!");
        fetchLeads(); fetchStats();
        setPage("leads");
      }
    } catch { showToast("Failed to update lead", "error"); }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      await fetch(`${API}/leads/${id}`, { method: "DELETE" });
      showToast("🗑️ Lead deleted!");
      fetchLeads(); fetchStats();
      setPage("leads");
    } catch { showToast("Failed to delete lead", "error"); }
  };

  const viewLead = (lead) => { setSelectedLead(lead); setPage("detail"); };

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">📊</span>
          <span className="logo-text">CRM<span className="logo-accent">Pro</span></span>
        </div>
        <nav className="sidebar-nav">
          {[
            { id: "dashboard", icon: "🏠", label: "Dashboard" },
            { id: "leads", icon: "👥", label: "All Leads" },
            { id: "add", icon: "➕", label: "Add Lead" },
          ].map((item) => (
            <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">VS</div>
            <div>
              <p className="user-name">Vishwesh Shukla</p>
              <p className="user-role">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">
              {page === "dashboard" && "Dashboard"}
              {page === "leads" && "All Leads"}
              {page === "add" && "Add New Lead"}
              {page === "detail" && "Lead Details"}
            </h1>
          </div>
          <div className="topbar-right">
            <button className="btn-primary" onClick={() => setPage("add")}>+ Add Lead</button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="content">
          {loading && <div className="loading">Loading...</div>}
          {page === "dashboard" && <Dashboard stats={stats} leads={leads} onViewLead={viewLead} setPage={setPage} />}
          {page === "leads" && <LeadsList leads={leads} onView={viewLead} onDelete={deleteLead} setPage={setPage} />}
          {page === "add" && <AddLead onAdd={addLead} onCancel={() => setPage("leads")} />}
          {page === "detail" && selectedLead && <LeadDetail lead={selectedLead} onUpdate={updateLead} onDelete={deleteLead} onBack={() => setPage("leads")} />}
        </div>
      </main>

      {/* TOAST */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
