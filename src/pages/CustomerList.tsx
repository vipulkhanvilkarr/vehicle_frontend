import React, { useEffect, useState } from "react";
import { userApi } from "../api/userApi";

interface Customer {
  id: number;
  name?: string;
  mobile?: string;
  address?: string;
  username?: string;
  email?: string;
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getGarageCustomers();
      // Handle various response structures
      let list: Customer[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data && Array.isArray(data.results)) {
        list = data.results;
      } else if (data && Array.isArray(data.data)) {
        list = data.data;
      }
      setCustomers(list);
    } catch (err: any) {
      console.error("Failed to fetch customers", err);
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "32px", background: "#f8f9fa", minHeight: "100vh", flex: 1 }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
                <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#1a202c", margin: 0 }}>Customers</h1>
                <p style={{ color: "#718096", margin: "4px 0 0 0" }}>List of all registered customers</p>
            </div>
        </div>

        {error && (
          <div style={{ background: "#fff5f5", color: "#c53030", padding: "12px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #feb2b2" }}>
            {error}
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          {loading ? (
             <div style={{ padding: "40px", textAlign: "center", color: "#718096" }}>Loading customers...</div>
          ) : customers.length === 0 ? (
             <div style={{ padding: "40px", textAlign: "center", color: "#718096" }}>No customers found.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead style={{ background: "#f7fafc", borderBottom: "1px solid #e2e8f0" }}>
                <tr>
                  <th style={{ padding: "16px", textAlign: "left", color: "#4a5568", fontWeight: "600" }}>Name</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#4a5568", fontWeight: "600" }}>Mobile Number</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={customer.id || index} style={{ borderBottom: "1px solid #edf2f7", transition: "background 0.1s" }}>
                    <td style={{ padding: "16px", color: "#2d3748" }}>{customer.name || customer.username || "-"}</td>
                    <td style={{ padding: "16px", color: "#2d3748" }}>{customer.mobile || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
};

export default CustomerList;
