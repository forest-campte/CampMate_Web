import './App.css';
import ReservationPage from './Component/ReservationPage';
import CampingZonePage from './Component/CampingZonePage';
import LoginPage from './Component/LoginPage';
import Header from './Component/header';
import SignUpPage  from './Component/SignUpPage';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";

function AppLayout({ user, setUser }) {
  const location = useLocation();

  const hideHeader = location.pathname === "/Login" || location.pathname === "/signup";
  
  return (
      <>
        {!hideHeader && <Header user={user}/>}
        <Routes>
          <Route path="/" element={<Navigate to="/Login" replace />} />
          <Route path="/Login" element={<LoginPage setUser={setUser}/>} />
          <Route path="/campingzone" element={<CampingZonePage user={user}/>} />
          <Route path="/reservation" element={<ReservationPage user={user}/>} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </>
    );
  }

function App() {

  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <Router>
        <AppLayout user={user} setUser={setUser}/>
      </Router>
    </div>
  );
}

export default App;
