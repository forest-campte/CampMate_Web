import React from 'react';

function ReservationPage({user}) {

    return (
        <div>
            <h2>예약 관리 페이지</h2>
            <p>로그인된 이메일: {user.email}</p>
            <p>이름: {user.name}</p>
            <p>선호 캠핑 스타일: {user.camping_style}</p>
            <p>선호 캠핑 배경: {user.camping_background}</p>
            <p>선호 캠핑 스타일: {user.camping_style}</p>
            <p>주로 동행하는 대상: {user.camping_type}</p>
            <p>계정 생성일: {user.create_dt}</p>
        </div>
    );
}

export default ReservationPage;