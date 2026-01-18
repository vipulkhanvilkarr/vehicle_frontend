import React, { useEffect, useState, useMemo } from "react";
import { serviceApi } from "../api/serviceApi";
import { useNavigate } from "react-router-dom";

interface Reminder {
  id: number;
  reminder_day: number;
  reminder_day_display: string;
  scheduled_for: string;
  channel: string;
  channel_display: string;
  status: string;
  status_display: string;
  sent_at?: string | null;
  sent_via?: string | null;
}

interface ReminderSummary {
  total: number;
  pending: number;
  processing: number;
  sent: number;
  failed: number;
  next_scheduled?: { date: string; days_before: number } | null;
}

interface ServiceRecord {
  id: number;
  vehicle_number?: string;
  vehicle_model?: string;
  customer_id?: number;
  customer_name?: string;
  service_type: string;
  service_date: string;
  service_interval_months?: number;
  next_service_date?: string;
  notes?: string;
  reminder_status?: string;
  reminders?: Reminder[];
  reminder_summary?: ReminderSummary | null;
  created_at?: string;
}

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // UI controls: sorting, filtering and reminder modal
  const [sortBy, setSortBy] = useState<string>('service_date');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedReminders, setSelectedReminders] = useState<Reminder[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const resp = await serviceApi.getAll();
      
      // Handle payload structure { success: true, data: [...] }
      if (resp && resp.success && Array.isArray(resp.data)) {
        setServices(resp.data);
      } else if (Array.isArray(resp)) {
        setServices(resp);
      } else if (resp && Array.isArray((resp as any).data)) {
        // Some APIs return { data: [...] } without success flag
        setServices((resp as any).data);
      } else {
        setServices([]);
      }
    } catch (err: any) {
      setError("Failed to fetch service records.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const displayedServices = useMemo(() => {
    let list = [...services];
    if (filterText.trim()) {
      const t = filterText.toLowerCase();
      list = list.filter(s =>
        (s.vehicle_number && s.vehicle_number.toLowerCase().includes(t)) ||
        (s.customer_name && s.customer_name.toLowerCase().includes(t)) ||
        (s.notes && s.notes.toLowerCase().includes(t))
      );
    }
    if (filterStatus !== 'ALL') {
      list = list.filter(s => ((s.reminder_status || '').toUpperCase() === filterStatus));
    }
    const by = sortBy;
    if (by) {
      list.sort((a: any, b: any) => {
        const av = (a as any)[by] ?? '';
        const bv = (b as any)[by] ?? '';
        if (av === bv) return 0;
        if (sortDir === 'asc') return av > bv ? 1 : -1;
        return av < bv ? 1 : -1;
      });
    }
    return list;
  }, [services, filterText, filterStatus, sortBy, sortDir]);

  const getSortIndicator = (col: string) => (sortBy === col ? (sortDir === 'asc' ? '▲' : '▼') : '');

  const toggleSort = (col: string) => {
    if (sortBy === col) setSortDir(s => s === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "#f6ad55";
      case "COMPLETED": return "#48bb78";
      default: return "#718096";
    }
  };

  const formatDate = (iso?: string | null) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return isNaN(d.getTime()) ? iso : d.toLocaleDateString();
    } catch {
      return iso;
    }
  };

  const formatDateTime = (iso?: string | null) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return isNaN(d.getTime()) ? iso : d.toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <main style={{ padding: "32px", background: "#f8f9fa", minHeight: "100vh", flex: 1 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "600" }}>Service History</h1>
          <button 
            onClick={() => navigate("/services/create")}
            style={{ padding: "10px 20px", background: "#667eea", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
          >
            + New Service
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
          <input
            placeholder="Filter by vehicle / customer / notes"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', flex: 1 }}
          />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <option value="ALL">All status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button type="button" onClick={() => { setFilterText(''); setFilterStatus('ALL'); setSortBy('service_date'); setSortDir('desc'); }} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#e2e8f0', cursor: 'pointer' }}>Reset</button>
        </div>

        {error && <div style={{ padding: "16px", background: "#fff5f5", color: "#c53030", borderRadius: "8px", marginBottom: "20px" }}>{error}</div> }

        <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>Loading service records...</div>
          ) : services.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#718096" }}>No service records found.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f7fafc", borderBottom: "1px solid #e2e8f0" }}>
                <tr>
                  <th style={thStyle}>Vehicle</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Service Date</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Interval</th>
                  <th style={thStyle}>Next Service</th>
                  <th style={thStyle}>Reminders</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Notes</th>
                  <th style={thStyle}>Created</th>
                </tr>
              </thead>
              <tbody>
                {displayedServices.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #edf2f7" }}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 700 }}>{s.vehicle_number || "-"}</div>
                      <div style={{ fontSize: 12, color: "#718096" }}>{s.vehicle_model || ""}</div>
                    </td>
                    <td style={tdStyle}>{s.customer_name || (s.customer_id ? `ID ${s.customer_id}` : "-")}</td>
                    <td style={tdStyle}>{formatDate(s.service_date)}</td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: "12px", fontWeight: "600", padding: "4px 8px", background: "#edf2f7", borderRadius: "4px" }}>
                        {s.service_type}
                      </span>
                    </td>
                    <td style={tdStyle}>{s.service_interval_months ? `${s.service_interval_months} Months` : "—"}</td>
                    <td style={tdStyle}>{s.next_service_date ? formatDate(s.next_service_date) : "N/A"}</td>
                    <td style={tdStyle}>
                      {s.reminder_summary ? (
                        <div style={{ fontSize: 13 }}>
                          <div style={{ fontWeight: 700 }}>{s.reminder_summary.total} reminders</div>
                          <div style={{ color: "#718096", fontSize: 12 }}>
                            {s.reminder_summary.sent} sent · {s.reminder_summary.pending} pending
                            {s.reminder_summary.next_scheduled ? (<> · Next: {formatDate(s.reminder_summary.next_scheduled.date)}</>) : null}
                          </div>
                        </div>
                      ) : s.reminders && s.reminders.length > 0 ? (
                        <div style={{ fontSize: 13 }}>{s.reminders.length} reminders</div>
                      ) : (
                        <div style={{ color: "#718096" }}>No reminders</div>
                      )}
                      {(s.reminder_summary?.total || (s.reminders && s.reminders.length)) ? (
                        <div style={{ marginTop: 8 }}>
                          <button type="button" onClick={() => { setSelectedReminders(s.reminders || []); setModalOpen(true); }} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background:'#fff', cursor:'pointer' }}>View Reminders</button>
                        </div>
                      ) : null}
                    </td>
                    <td style={tdStyle}>
                       <span style={{ color: getStatusColor(s.reminder_status || ""), fontWeight: "600", fontSize: "13px" }}>
                        {s.reminder_status || "-"}
                       </span>
                    </td>
                    <td style={tdStyle}>{s.notes || "-"}</td>
                    <td style={tdStyle}>{s.created_at ? formatDateTime(s.created_at) : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {modalOpen && selectedReminders && (
          <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.4)',zIndex:3000,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{background:'#fff',borderRadius:12,width:'90%',maxWidth:720,padding:20,boxShadow:'0 10px 40px rgba(0,0,0,0.2)'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                <h3 style={{margin:0}}>Reminders</h3>
                <button onClick={() => setModalOpen(false)} style={{background:'none',border:'none',cursor:'pointer',fontSize:18}}>✖</button>
              </div>
              <div style={{maxHeight:'60vh',overflow:'auto'}}>
                {selectedReminders.length === 0 ? (
                  <div style={{color:'#718096'}}>No reminders</div>
                ) : (
                  selectedReminders.map(r => (
                    <div key={r.id} style={{padding:'10px 0',borderBottom:'1px solid #eee'}}>
                      <div style={{fontWeight:700}}>{r.reminder_day_display} · {r.channel_display}</div>
                      <div style={{color:'#718096',fontSize:13}}>Scheduled: {formatDate(r.scheduled_for)} · Status: {r.status_display} · Sent: {r.sent_at ? formatDateTime(r.sent_at) : '-'}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

const thStyle: React.CSSProperties = { padding: "16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#4a5568" };
const tdStyle: React.CSSProperties = { padding: "16px", fontSize: "14px", color: "#2d3748" };

export default ServiceList;
