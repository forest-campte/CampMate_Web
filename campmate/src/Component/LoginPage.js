import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchWithAuth } from '../api'; // api.js에서 import

function LoginPage({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // fetch 대신 통합된 fetchWithAuth 함수 사용
            const data = await fetchWithAuth("/api/admins/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });

            // 서버가 보내준 실제 user 객체로 상태를 설정
            setUser(data.user); 
            // 토큰을 localStorage에 저장
            localStorage.setItem("authToken", data.token);
            
            // 로그인 성공 후 예약 관리 페이지로 이동
            navigate("/reservation");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="container">
                <h2>CampMate<br />관리자 페이지</h2>
                <div>
                    <input type="email" name="email" className="Login_email" value={email} placeholder="이메일 입력" onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <input type="password" name="password" className="Login_pwd" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                    <div className="signup_btn">
                        <Link to="/signup">관리자 등록</Link>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="button">
                    {loading ? "로그인 중..." : "로그인"}
                </button>
                {error && <div style={{ color: "red", whiteSpace: "pre-wrap" }}>{error}</div>}
            </form>
        </div>
    );
}

export default LoginPage;