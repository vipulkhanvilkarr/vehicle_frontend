import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/userApi";

const CreateCustomer: React.FC = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const navigate = useNavigate();

  const validateMobile = (value: string) => {
    if (!/^\d{10}$/.test(value)) {
      return "Mobile number must be 10 digits";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotification(null);

    const mobileErr = validateMobile(mobile);
    if (mobileErr) {
        setError(mobileErr);
        return;
    }

    setLoading(true);

    try {
      const payload = { name, mobile, address };
      const res = await userApi.createGarageCustomer(payload);
      
      const msg = res?.message || "Customer created successfully!";
      setNotification({ type: "success", message: msg });

      setTimeout(() => {
        setNotification(null);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/vehicles/create"); // Navigate back to vehicle creation or list? Maybe vehicle create is most useful context.
        }, 900);
      }, 1200);

    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.detail || err?.message || "Failed to create customer";
      setError(msg);
      setNotification({ type: "error", message: String(msg) });
      setLoading(false);
    }
  };

  return (
    <main style={{
      flex: 1,
      padding: '32px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
      minHeight: 'auto',
      position: 'relative'
    }}>
      {/* Notification Popup */}
      {notification && (
        <div style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 2000,
            background: notification.type === 'success' ? '#38a169' : '#e53e3e',
            color: '#fff',
            padding: '16px 28px',
            borderRadius: 10,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontWeight: 500
        }}>
           <span>{notification.message}</span>
        </div>
      )}

      {loading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(255,255,255,0.6)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
           <div style={{ width: 40, height: 40, border: '4px solid #ccc', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
           <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '480px'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#1a202c', margin: '0 0 8px 0' }}>Add New Customer</h2>
          <p style={{ fontSize: '13px', color: '#718096', margin: 0 }}>Enter customer details below</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Name */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#2d3748' }}>Name *</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
              placeholder="e.g. Rahul Sharma"
              style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
            />
          </div>

          {/* Mobile */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#2d3748' }}>Mobile *</label>
            <input 
              type="text" 
              value={mobile} 
              onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} 
              required
              placeholder="10 digit mobile number"
              style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
            />
          </div>

          {/* Address */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#2d3748' }}>Address *</label>
            <textarea 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              required
              placeholder="Full address"
              rows={3}
              style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #cbd5e0', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          {error && <div style={{ color: '#c53030', backgroundColor: '#fff5f5', padding: 10, borderRadius: 6, fontSize: 14 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, padding: 12, background: '#fff', border: '1px solid #cbd5e0', borderRadius: 6 }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: 12, background: '#667eea', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}>Create Customer</button>
          </div>

        </form>
      </div>
    </main>
  );
};

export default CreateCustomer;
