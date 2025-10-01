import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Component/LoginPage';
import AdminListPage from './Component/AdminListPage';
import './App.css';

function App() {
    const [loggedInAdmin, setLoggedInAdmin] = useState(null);

    // 로그아웃 함수 정의
    const handleLogout = () => {
        setLoggedInAdmin(null); // 로그인 상태를 null로 변경하여 로그아웃 처리
        // 로그인 페이지로 자동 이동은 아래 Route 설정에서 처리됨
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    
                    <Route 
                        path="/login" 
                        element={<LoginPage setLoggedInAdmin={setLoggedInAdmin} />} 
                    />

                    <Route 
                        path="/admins" 
                        element={
                            loggedInAdmin 
                                ? <AdminListPage handleLogout={handleLogout} /> // 로그아웃 함수를 props로 전달
                                : <Navigate to="/login" />
                        } 
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;