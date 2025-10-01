import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setLoggedInAdmin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        // 입력된 ID가 'root'이고 비밀번호가 'root'인지 확인합니다.
        if (email === 'root' && password === 'root') {
            // TODO: 실제 백엔드 로그인 API 연동 필요
            console.log('관리자 로그인 성공:', { email });
            
            const adminData = { email: email, name: '전체 관리자' };
            setLoggedInAdmin(adminData);
            
            // 로그인 성공 시 '/admins' 관리 페이지로 이동
            navigate('/admins');
        } else {
            // ID 또는 비밀번호가 일치하지 않을 경우 경고창 표시
            alert('ID 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <h2>Campmate 관리자 로그인</h2>
                <input
                    // --- [수정된 부분] ---
                    // type을 "email"에서 "text"로 변경하여 '@' 없이도 입력 가능하도록 합니다.
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ID" // placeholder 텍스트도 "이메일"에서 "ID"로 변경
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                    required
                />
                <button type="submit">로그인</button>
            </form>
        </div>
    );
}

export default LoginPage;