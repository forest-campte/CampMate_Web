import React from 'react';
import { Link, useNavigate } from "react-router-dom";

function Header({ user, setUser }) {
    const navigate = useNavigate();

    // 로그아웃 버튼 클릭 시 실행될 함수
    const handleLogout = () => {
        // 1. App의 user 상태를 null로 만들어 로그아웃 상태로 변경
        setUser(null);
        // 2. 브라우저에 저장된 인증 토큰 삭제
        localStorage.removeItem("authToken");
        // 3. 로그인 페이지로 강제 이동
        navigate("/login");
    };

    // user 상태 객체가 있고, 그 안에 name 속성이 있으면 'OOO님'으로, 없으면 'CampMate'로 표시
    const welcomeMessage = user && user.name ? `${user.name}님` : "CampMate";

    return (
        <header>
            <div className="header-container">
                <span className="header-logo">{welcomeMessage}</span>
                <nav>
                    <Link to="/reservation" className='link'>예약 관리</Link>
                    {" | "}
                    <Link to="/campingzone" className='link'>캠핑존 관리</Link>
                    {" | "}
                    <Link to="/admin" className='link'>계정</Link>
                    {/* user 상태가 있을 때(로그인했을 때)만 로그아웃 버튼을 보여줍니다. */}
                    {user && (
                        <>
                            {" | "}
                            <button onClick={handleLogout} className="link-button">로그아웃</button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;