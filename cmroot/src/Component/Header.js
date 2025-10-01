
import React from 'react';
import { Link } from 'react-router-dom';

function Header({ handleLogout }) {
    return (
        // header 태그에 main-header 클래스 적용
        <header className="main-header">
            {/* 내부 div에 header-content 클래스 적용 */}
            <div className="header-content">
                <span className="header-logo">CMRoot</span>
                <nav className="header-nav">
                    <Link to="/admins">Admin 관리</Link>
                </nav>
                <button onClick={handleLogout} className="logout-button">
                    로그아웃
                </button>
            </div>
        </header>
    );
}

export default Header;