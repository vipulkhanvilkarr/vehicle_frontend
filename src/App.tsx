// src/App.tsx
import React, { useEffect } from "react";
import AppRouter from "./router";

const App: React.FC = () => {
  useEffect(() => {
    // If tokens exist on load, attempt to populate user
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    if (access && refresh) {
      // dispatch getCurrentUser to populate user & roles
      // store.dispatch(getCurrentUser());
      // Instead, you should use useDispatch here if you want to dispatch
    }
  }, []);

  return <AppRouter />;
};

export default App;
