// src/App.tsx
import React, { useEffect } from "react";
import AppRouter from "./router";
import Navbar from "./components/Navbar";
import { useAppSelector, useAppDispatch } from "./hooks";
import { setAuthState } from "./features/auth/authSlice";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(s => s.auth.accessToken);

  useEffect(() => {
    const access = localStorage.getItem("access_token");
    if (access && !token) {
      dispatch(setAuthState({ accessToken: access }));
    }
  }, [dispatch, token]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9f9f9" }}>
      {token && <Navbar />}
      <div style={{ flex: 1 }}>
        <AppRouter />
      </div>
    </div>
  );
};

export default App;
