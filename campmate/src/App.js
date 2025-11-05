import './App.css';
import ReservationPage from './Component/ReservationPage';
import CampingZonePage from './Component/CampingZonePage';
import LoginPage from './Component/LoginPage';
import AdminsPage from './Component/AdminPage';
import Header from './Component/header';
import SignUpPage from './Component/SignUpPage';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { fetchWithAuth } from './api';

function AppLayout({ user, setUser }) {
  const location = useLocation();
  const hideHeader = location.pathname === "/Login" || location.pathname === "/signup";

  return (
    <>
      {!hideHeader && <Header user={user} setUser={setUser} />}
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Navigate to="/Login" replace />} />
          <Route path="/Login" element={<LoginPage setUser={setUser} />} />
          
          <Route path="/admin" element={user ? <AdminsPage user={user} setUser={setUser} /> : <Navigate to="/Login" />} />
          <Route path="/campingzone" element={user ? <CampingZonePage user={user} /> : <Navigate to="/Login" />} />
          <Route path="/reservation" element={user ? <ReservationPage user={user} /> : <Navigate to="/Login" />} />

          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const autoLogin = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // TODO: 백엔드에 '/api/admins/me' API 구현 필요
          const userData = await fetchWithAuth('/api/admins/me'); 
          setUser(userData);
        } catch (error) {
          console.error("Auto login failed:", error);
          localStorage.removeItem('authToken');
        }
      }
    };
    autoLogin();
  }, []);

  return (
    <div className="App">
      <Router>
        <AppLayout user={user} setUser={setUser} />
      </Router>
    </div>
  );
}

export default App;