import React from 'react';
import "../App.css"
import { Link, useLocation } from "react-router-dom";

function header({user}) {
    const location = useLocation();

    const CampMate = user && user.name ? user.name : "CampMate";

    return (
        <header>
            <div className="header-container">
                <span className="header-logo">{CampMate}</span>
                <nav>
                    <Link to="/reservation" className='link'>예약 관리</Link>
                    {" | "}
                    <Link to="/campingzone" className='link'>캠핑존 관리</Link>
                </nav>
            </div>
        </header>
    );
}

export default header;