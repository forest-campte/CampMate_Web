import './App.css';
import ReservationPage from './Component/ReservationPage';
import CampingZonePage from './Component/CampingZonePage';
import LoginPage from './Component/LoginPage';
import AdminsPage from './Component/AdminPage';
import Header from './Component/header';
import SignUpPage from './Component/SignUpPage';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { fetchWithAuth } from './api'; // API 요청 통합 함수 import

// AppLayout은 페이지들의 공통적인 레이아웃(예: 헤더 표시 여부)을 관리합니다.
function AppLayout({ user, setUser }) {
  const location = useLocation();
  // 로그인 페이지나 회원가입 페이지에서는 헤더를 숨깁니다.
  const hideHeader = location.pathname === "/Login" || location.pathname === "/signup";

  return (
    <>
      {/* 헤더에 user와 setUser를 전달하여 로그인 상태 표시 및 로그아웃 기능을 활성화합니다. */}
      {!hideHeader && <Header user={user} setUser={setUser} />}
      <Routes>
        {/* 루트 경로는 로그인 페이지로 자동 이동시킵니다. */}
        <Route path="/" element={<Navigate to="/Login" replace />} />
        
        {/* LoginPage에 setUser를 전달하여 로그인 성공 시 App의 user 상태를 변경할 수 있게 합니다. */}
        <Route path="/Login" element={<LoginPage setUser={setUser} />} />
        
        {/* 보호된 라우트: user 상태가 있을 때만 해당 페이지로 접근하고, 없으면 로그인 페이지로 이동시킵니다. */}
        <Route path="/admin" element={user ? <AdminsPage user={user} setUser={setUser} /> : <Navigate to="/Login" />} />
        <Route path="/campingzone" element={user ? <CampingZonePage user={user} /> : <Navigate to="/Login" />} />
        <Route path="/reservation" element={user ? <ReservationPage user={user} /> : <Navigate to="/Login" />} />

        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </>
  );
}

function App() {
  // 앱 전체의 로그인 상태를 관리하는 user state입니다.
  const [user, setUser] = useState(null);

  // 앱이 처음 로드될 때 localStorage를 확인하여 자동 로그인 상태를 복원합니다.
  useEffect(() => {
    const autoLogin = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // TODO: 백엔드에 '/api/admins/me'와 같이 토큰으로 사용자 정보를
          //       가져오는 API 엔드포인트가 필요합니다.
          const userData = await fetchWithAuth('/api/admins/me'); 
          setUser(userData); // 서버에서 받은 실제 사용자 정보로 상태 설정
        } catch (error) {
          console.error("Auto login failed:", error);
          localStorage.removeItem('authToken'); // 유효하지 않은 토큰 삭제
        }
      }
    };
    autoLogin();
  }, []); // 의존성 배열을 비워두어 최초 1회만 실행되도록 합니다.

  return (
    <div className="App">
      <Router>
        {/* AppLayout에 user와 setUser를 전달합니다. */}
        <AppLayout user={user} setUser={setUser} />
      </Router>
    </div>
  );
}

export default App;