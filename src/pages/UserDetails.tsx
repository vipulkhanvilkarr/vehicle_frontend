// src/pages/UserDetails.tsx
import React, { useEffect, useState } from "react";
import { userApi } from "../api/userApi";
// import { authApi } from "../api/api";
// import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  role: string;
}

const USERS_PER_PAGE = 10;
const UserDetails: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
//   const navigate = useNavigate();

  useEffect(() => {
    console.log("[UserDetails] useEffect triggered");
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    console.log("[UserDetails] fetchUsers called");
    try {
      const data = await userApi.getAllUsers();
      console.log("[UserDetails] userApi.getAllUsers response", data);
      setUsers(data);
    } catch (err: any) {
      console.log("[UserDetails] fetchUsers error", err);
      setError(err?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const paginatedUsers = users.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

//   const handleLogout = async () => {
//     try {
//       await authApi.logout();
//       localStorage.clear();
//       navigate("/login", { replace: true });
//     } catch (err) {
//       alert("Logout failed");
//     }
//   };

  if (loading) {
    return (
      <main style={{
        flex: 1,
        padding: '48px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa'
        
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e9ecef',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '16px', color: '#6c757d', fontSize: '14px' }}>Loading users...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{
        flex: 1,
        padding: '48px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa'
      }}>
        <div style={{
          background: '#fff5f5',
          border: '1px solid #feb2b2',
          borderRadius: '8px',
          padding: '16px 24px',
          color: '#c53030'
        }}>
          {error}
        </div>
      </main>
    );
  }

  return (
    <main style={{
      flex: 1,
      padding: '32px 16px',
      background: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1a202c',
          margin: 0
        }}>
          User Management
        </h2>
        {/* <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            background: '#e53e3e',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#c53030';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#e53e3e';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Logout
        </button> */}
      </div>

      {/* Table Card with vertical scrollbar */}
      <div style={{
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '320px',
        maxHeight: '520px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {users.length === 0 ? (
          <div style={{
            padding: '64px 24px',
            textAlign: 'center',
            color: '#718096'
          }}>
            <p style={{ margin: 0, fontSize: '16px' }}>No users found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '600px'
            }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff'
                }}>
                  <th style={{
                    padding: '14px 16px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>ID</th>
                  <th style={{
                    padding: '14px 16px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Username</th>
                  <th style={{
                    padding: '14px 16px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    style={{
                      background: idx % 2 === 0 ? '#fff' : '#f9fafb',
                      borderBottom: '1px solid #e2e8f0',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#f9fafb'}
                  >
                    <td style={{
                      padding: '14px 16px',
                      fontSize: '14px',
                      color: '#718096'
                    }}>
                      #{user.id}
                    </td>
                    <td style={{
                      padding: '14px 16px',
                      fontSize: '14px',
                      color: '#2d3748',
                      fontWeight: '500'
                    }}>
                      {user.username}
                    </td>
                    <td style={{
                      padding: '14px 16px',
                      fontSize: '14px'
                    }}>
                      <span style={{
                        padding: '4px 12px',
                        background: user.role.toLowerCase() === 'super_admin' 
                          ? '#fef3c7' 
                          : user.role.toLowerCase() === 'admin' 
                          ? '#dbeafe' 
                          : '#f0fff4',
                        color: user.role.toLowerCase() === 'super_admin' 
                          ? '#92400e' 
                          : user.role.toLowerCase() === 'admin' 
                          ? '#1e3a8a' 
                          : '#22543d',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 0',
            gap: '8px',
            background: '#f8f9fa',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: page === 1 ? '#e2e8f0' : '#667eea',
                color: page === 1 ? '#a0aec0' : '#fff',
                fontWeight: '500',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: p === page ? '2px solid #667eea' : 'none',
                  background: p === page ? '#e0e7ff' : '#fff',
                  color: p === page ? '#3730a3' : '#2d3748',
                  fontWeight: p === page ? '700' : '500',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: page === totalPages ? '#e2e8f0' : '#667eea',
                color: page === totalPages ? '#a0aec0' : '#fff',
                fontWeight: '500',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

// Add keyframe animation for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.querySelector('style[data-spin-animation]')) {
  styleSheet.setAttribute('data-spin-animation', 'true');
  document.head.appendChild(styleSheet);
}

export default UserDetails;