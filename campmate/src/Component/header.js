import React from 'react';
import { Link, useNavigate } from "react-router-dom";

function Header({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("authToken");
        navigate("/Login");
    };

    const welcomeMessage = user && user.name ? `${user.name}님` : "CampMate";

    return (
        <header className="header">
            <div className="header__content">
                <span className="header__logo">{welcomeMessage}</span>
                <nav className="header__nav">
                    <Link to="/reservation" className='header__nav-link'>예약 관리</Link>
                    <Link to="/campingzone" className='header__nav-link'>캠핑존 관리</Link>
                    <Link to="/admin" className='header__nav-link'>계정</Link>
                    {user && (
                        <button onClick={handleLogout} className="header__logout-button">로그아웃</button>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;