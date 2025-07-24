import './App.css';
import ReservationPage from './Component/ReservationPage';
import CampingZonePage from './Component/CampingZonePage';
import LoginPage from './Component/LoginPage';
import Header from './Component/header';
import SignUpPage  from './Component/SignUpPage';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";

function AppLayout({ user, setUser, reservations, setReservations, zones, setZones }) {
  const location = useLocation();

  const hideHeader = location.pathname === "/Login" || location.pathname === "/signup";
  
  return (
      <>
        {!hideHeader && <Header user={user}/>}
        <Routes>
          <Route path="/" element={<Navigate to="/Login" replace />} />
          <Route path="/Login" element={<LoginPage setUser={setUser} setReservations={setReservations} setZones={setZones} />} />
          <Route path="/campingzone" element={<CampingZonePage user={user} zones={zones}/>} />
          <Route path="/reservation" element={<ReservationPage user={user} reservations={reservations}/>} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </>
    );
  }

function App() {

  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [zones, setZones] = useState([]);

  return (
    <div className="App">
      <Router>
        <AppLayout user={user} setUser={setUser} reservations={reservations} setReservations={setReservations} zones={zones} setZones={setZones}/>
      </Router>
    </div>
  );
}

export default App;
