import React from 'react';

function CampingZonePage({user}) {

    const email = user ? user.email : "";

    return (
        <div>
            <div>
            <h2>캠핑존 관리</h2>
            <p>로그인된 이메일: {email}</p>
        </div>
        </div>
    );
}

export default CampingZonePage;