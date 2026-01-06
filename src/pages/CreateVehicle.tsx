import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vehicleApi } from "../api/vehicleApi";
import { userApi } from "../api/userApi";

const vehicleTypes = [
  { value: 1, label: "Two Wheeler" },
  { value: 2, label: "Three Wheeler" },
  { value: 3, label: "Four Wheeler" },
];

const VEHICLE_NUMBER_REGEX = /^[A-Z0-9]+[0-9]{1,4}$/;

interface User {
  id: number;
  username: string;
  name?: string; // Added name field
  email?: string;
  role?: string;
}

const CreateVehicle: React.FC = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState<number | "">("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleDescription, setVehicleDescription] = useState("");
  const [customerId, setCustomerId] = useState<number | "">("");
  const [customers, setCustomers] = useState<User[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await userApi.getGarageCustomers();
      console.log("DEBUG: Raw API Data:", data);

      let usersList: User[] = [];

      if (Array.isArray(data)) {
        usersList = data;
      } else if (data && Array.isArray(data.results)) {
        usersList = data.results;
      } else if (data && Array.isArray(data.data)) {
        usersList = data.data;
      } else if (data && Array.isArray(data.users)) {
        usersList = data.users;
      }

      if (usersList.length === 0) {
        let debugMsg = "No customers found.";
        if (data && typeof data === 'object' && !Array.isArray(data)) {
            debugMsg += ` API returned object keys: [${Object.keys(data).join(", ")}]`;
        }
        setError(debugMsg); // Show in red box
      }

      setCustomers(usersList);
    } catch (err: any) {
      console.error("Failed to fetch customers", err);
      const msg = err?.response?.data?.detail || err?.message || "Failed to load customers";
        setError(`Failed to fetch customers: ${msg}`);
    }
  };

  // validate on the fly whenever vehicleNumber changes
  const validateVehicleNumber = (value: string) => {
    if (!value) {
      return "Vehicle number is required";
    }
    if (!VEHICLE_NUMBER_REGEX.test(value)) {
      return "Invalid vehicle number. Must end with 1–4 digits and use uppercase letters/numbers (e.g. MH05DU6253)";
    }
    return null;
  };

  const handleVehicleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // automatically convert to uppercase
    const upper = e.target.value.toUpperCase();
    setVehicleNumber(upper);

    // live validation
    const vErr = validateVehicleNumber(upper);
    setValidationError(vErr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // final client-side validation
    const vErr = validateVehicleNumber(vehicleNumber);
    if (vErr) {
      setValidationError(vErr);
      return;
    }

    if (vehicleType === "") {
      setError("Please select vehicle type");
      return;
    }

    if (customerId === "") {
      setError("Please select a customer");
      return;
    }

    setLoading(true);
    setError(null);
    setNotification(null);

    try {
      const payload = {
        vehicle_number: vehicleNumber,
        vehicle_type: typeof vehicleType === "string" ? Number(vehicleType) : vehicleType,
        vehicle_model: vehicleModel,
        vehicle_description: vehicleDescription,
        customer_id: typeof customerId === "string" ? Number(customerId) : customerId,
      };
      
      const res = await vehicleApi.create(payload);
      const msg = res?.message || res?.detail || "Vehicle created successfully!";
      setNotification({ type: "success", message: msg });
      
      // Show loader for 1s, then redirect
      setTimeout(() => {
        setNotification(null);
        setLoading(true); // keep loading state during redirect delay
        setTimeout(() => {
          setLoading(false);
          navigate("/vehicles");
        }, 900);
      }, 1200);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.response?.data?.vehicle_number || err?.message || "Failed to create vehicle";
      setError(msg);
      setNotification({ type: "error", message: String(msg) });
      setTimeout(() => setNotification(null), 3000);
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
      top: '10vh',
      position: 'relative'
    }}>
      {/* Notification Popup */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 2000,
            minWidth: 260,
            background: notification.type === 'success' ? '#38a169' : '#e53e3e',
            color: '#fff',
            padding: '16px 28px 16px 20px',
            borderRadius: 10,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            fontSize: 15,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            animation: 'fadeIn 0.3s',
          }}
        >
          {notification.type === 'success' ? (
            <span style={{ fontSize: 20, marginRight: 8 }}>✔️</span>
          ) : (
            <span style={{ fontSize: 20, marginRight: 8 }}>❌</span>
          )}
          <span>{notification.message}</span>
        </div>
      )}
      {/* Loader overlay after success */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(255,255,255,0.6)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: 56,
            height: 56,
            border: '5px solid #e2e8f0',
            borderTop: '5px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
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
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '600',
            color: '#1a202c',
            margin: '0 0 8px 0'
          }}>
            Create Vehicle
          </h2>
          <p style={{
            fontSize: '13px',
            color: '#718096',
            margin: 0
          }}>
            Add a new vehicle to the system
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {/* Vehicle Number */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#2d3748'
            }}>
              Vehicle Number
              <span style={{ color: '#e53e3e', marginLeft: 4 }}>*</span>
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={handleVehicleNumberChange}
              required
              placeholder="E.g. MH05DU6253"
              style={{
            width: '100%',
            padding: '12px 14px',
            border: validationError ? '2px solid #feb2b2' : '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.15s',
            boxSizing: 'border-box'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = validationError ? '#feb2b2' : '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = validationError ? '#feb2b2' : '#e2e8f0'}
              inputMode="text"
              aria-invalid={!!validationError}
            />
            {validationError && (
              <div style={{
            marginTop: 8,
            color: '#c53030',
            fontSize: 13,
              }}>
            {validationError}
              </div>
            )}
          </div>

          {/* Customer Selection */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#2d3748'
            }}>
              Select Customer
              <span style={{ color: '#e53e3e', marginLeft: 4 }}>*</span>
            </label>
            <select
              value={customerId}
              onChange={e => setCustomerId(Number(e.target.value))}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.15s',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <option value="">Select a customer</option>
              {customers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name || user.username || `User ${user.id}`} {user.email ? `(${user.email})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Type */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#2d3748'
            }}>
              Vehicle Type
              <span style={{ color: '#e53e3e', marginLeft: 4 }}>*</span>
            </label>
            <select
              value={vehicleType}
              onChange={e => setVehicleType(Number(e.target.value))}
              required
              style={{
            width: '100%',
            padding: '12px 14px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.15s',
            boxSizing: 'border-box',
            cursor: 'pointer'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <option value="">Select type</option>
              {vehicleTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Vehicle Model */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#2d3748'
            }}>
              Vehicle Model
              <span style={{ color: '#e53e3e', marginLeft: 4 }}>*</span>
            </label>
            <input
              type="text"
              value={vehicleModel}
              onChange={e => setVehicleModel(e.target.value)}
              required
              placeholder="Enter vehicle model"
              style={{
            width: '100%',
            padding: '12px 14px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.15s',
            boxSizing: 'border-box'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Vehicle Description */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#2d3748'
            }}>
              Vehicle Description
              <span style={{ color: '#718096', marginLeft: 4, fontSize: 13 }}>(optional)</span>
            </label>
            <input
              type="text"
              value={vehicleDescription}
              onChange={e => setVehicleDescription(e.target.value)}
              placeholder="Enter description"
              style={{
            width: '100%',
            padding: '12px 14px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.15s',
            boxSizing: 'border-box'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              color: '#c53030',
              background: '#fff5f5',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              border: '1px solid #feb2b2'
            }}>
              {error}
            </div>
          )}

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '8px'
          }}>
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
              style={{
            flex: 1,
            padding: '12px',
            background: '#fff',
            color: '#4a5568',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !!validationError}
              style={{
            flex: 1,
            padding: '12px',
            background: loading ? '#cbd5e0' : '#667eea',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: loading || !!validationError ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? "Creating..." : "Create Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateVehicle;
