// src/pages/VehicleList.tsx
import React, { useEffect, useState } from "react";
import { vehicleApi } from "../api/vehicleApi";
import { useRoleAccess } from "../utils/roleAccess";
import { useNavigate } from "react-router-dom";

interface Vehicle {
  id: number;
  vehicle_number?: string;
  vehicle_type_name?: string | null;
  vehicle_model?: string | null;
  vehicle_description?: string | null;
}

const VEHICLES_PER_PAGE = 10;

const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );
  const [page, setPage] = useState(1);
  const { isSuperAdmin, isAdmin } = useRoleAccess();
  const navigate = useNavigate();

  const hasAdminAccess = isSuperAdmin || isAdmin;

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // clamp page when vehicles change (e.g., after delete)
    const totalPages = Math.max(1, Math.ceil(vehicles.length / VEHICLES_PER_PAGE));
    if (page > totalPages) setPage(totalPages);
  }, [vehicles, page]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleApi.getAll();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(vehicles.length / VEHICLES_PER_PAGE));
  const paginatedVehicles = vehicles.slice((page - 1) * VEHICLES_PER_PAGE, page * VEHICLES_PER_PAGE);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      const res = await vehicleApi.delete(id);
      const updated = vehicles.filter((v) => v.id !== id);
      setVehicles(updated);

      // clamp page
      const newTotal = Math.max(1, Math.ceil(updated.length / VEHICLES_PER_PAGE));
      if (page > newTotal) setPage(newTotal);

      const msg = res?.message || res?.detail || "Vehicle deleted successfully!";
      setNotification({ type: "success", message: msg });
      setTimeout(() => setNotification(null), 2500);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to delete vehicle";
      setNotification({ type: "error", message: msg });
      setTimeout(() => setNotification(null), 3500);
    }
  };

  if (loading) {
    return (
      <main
        style={{
          flex: 1,
          padding: "48px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
          minHeight: "60vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: "4px solid #e9ecef",
              borderTop: "4px solid #667eea",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
          <p style={{ marginTop: 16, color: "#6c757d", fontSize: 14 }}>Loading vehicles...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          flex: 1,
          padding: "48px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
        }}
      >
        <div
          style={{
            background: "#fff5f5",
            border: "1px solid #feb2b2",
            borderRadius: 8,
            padding: "16px 24px",
            color: "#c53030",
          }}
        >
          {error}
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        flex: 1,
        padding: "32px 16px",
        background: "#f8f9fa",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Notification */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 2000,
            minWidth: 260,
            background: notification.type === "success" ? "#38a169" : "#e53e3e",
            color: "#fff",
            padding: "16px 28px 16px 20px",
            borderRadius: 10,
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            fontSize: 15,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "fadeIn 0.3s",
          }}
        >
          {notification.type === "success" ? <span style={{ fontSize: 20 }}>✔️</span> : <span style={{ fontSize: 20 }}>❌</span>}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: "#1a202c", margin: 0 }}>Vehicle Management</h2>
          <p style={{ margin: "6px 0 0", color: "#718096", fontSize: 13 }}>
            Total: {vehicles.length} — page {page} of {totalPages}
          </p>
        </div>

        {hasAdminAccess && (
          <div>
            <button
              onClick={() => navigate("/vehicles/create")}
              style={{
                padding: "10px 18px",
                background: "#667eea",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Add Vehicle
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          overflow: "hidden",
          maxWidth: 1200,
          margin: "0 auto",
          minHeight: 320,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {vehicles.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "#718096" }}>
            <p style={{ margin: 0, fontSize: 16 }}>No vehicles found.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto", overflowY: "auto", flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#fff" }}>
                    <th style={thStyle}>Sr No.</th>
                    {/* <th style={thStyle}>ID</th> */}
                    <th style={thStyle}>Vehicle Number</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Model</th>
                    <th style={thStyle}>Description</th>
                    {hasAdminAccess && <th style={thStyle}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginatedVehicles.map((vehicle, idx) => {
                    const srNo = (page - 1) * VEHICLES_PER_PAGE + idx + 1;
                    const isEvenRow = idx % 2 === 0;
                    return (
                      <tr
                        key={vehicle.id}
                        style={{
                          background: isEvenRow ? "#fff" : "#f9fafb",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        <td style={tdStyle}>
                          <strong style={{ color: "#4a5568" }}>{srNo}</strong>
                        </td>

                        {/* <td style={tdStyle}>
                          <span style={{ color: "#718096" }}>#{vehicle.id}</span>
                        </td> */}

                        <td style={tdStyle}>
                          <span style={{ color: "#2d3748", fontWeight: 500 }}>{vehicle.vehicle_number ?? "-"}</span>
                        </td>

                        <td style={tdStyle}>
                          <span style={{ color: "#4a5568" }}>{vehicle.vehicle_type_name ?? "-"}</span>
                        </td>

                        <td style={tdStyle}>
                          <span style={{ color: "#4a5568" }}>{vehicle.vehicle_model ?? "-"}</span>
                        </td>

                        <td style={tdStyle}>
                          <span style={{ color: "#4a5568" }}>{vehicle.vehicle_description ?? "-"}</span>
                        </td>

                        {hasAdminAccess && (
                          <td style={tdStyle}>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button
                                onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                                aria-label={`Edit vehicle ${vehicle.id}`}
                                style={btnEditStyle}
                              >
                                Edit
                              </button>

                              {isSuperAdmin && (
                                <button
                                  onClick={() => handleDelete(vehicle.id)}
                                  aria-label={`Delete vehicle ${vehicle.id}`}
                                  style={btnDeleteStyle}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Simple Pagination: below the table */}
            {vehicles.length > VEHICLES_PER_PAGE && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 16,
                  gap: 6,
                  background: "#f8f9fa",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "none",
                    background: page === 1 ? "#e2e8f0" : "#667eea",
                    color: page === 1 ? "#a0aec0" : "#fff",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    aria-current={p === page ? "page" : undefined}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: p === page ? "2px solid #667eea" : "1px solid #e2e8f0",
                      background: p === page ? "#667eea" : "#fff",
                      color: p === page ? "#fff" : "#2d3748",
                      cursor: "pointer",
                      fontWeight: p === page ? 700 : 600,
                      fontSize: 14,
                      margin: "0 4px",
                    }}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "none",
                    background: page === totalPages ? "#e2e8f0" : "#667eea",
                    color: page === totalPages ? "#a0aec0" : "#fff",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

const thStyle: React.CSSProperties = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: 13,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 14,
  color: "#4a5568",
};

const btnEditStyle: React.CSSProperties = {
  padding: "6px 12px",
  background: "#fff",
  color: "#38a169",
  border: "1px solid #38a169",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const btnDeleteStyle: React.CSSProperties = {
  padding: "6px 12px",
  background: "#fff",
  color: "#e53e3e",
  border: "1px solid #e53e3e",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

//
// spinner keyframes (inject once)
//
const styleId = "vehiclelist-spinner-style";
if (!document.getElementById(styleId)) {
  const styleSheet = document.createElement("style");
  styleSheet.id = styleId;
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  `;
  document.head.appendChild(styleSheet);
}

export default VehicleList;
