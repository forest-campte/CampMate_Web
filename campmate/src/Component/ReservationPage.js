import React, { useEffect, useState } from "react";

function ReservationPage({ user, reservations }) {
    return (
        <div>
            <h2>예약 관리 페이지</h2>

            <table border="1" cellPadding="8" style={{ margin: "auto", minWidth: "700px" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>예약자 이름</th>
                        <th>연락처</th>
                        <th>체크인</th>
                        <th>체크아웃</th>
                        <th>상태</th>
                        <th>생성일</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.length === 0 ? (
                        <tr>
                            <td colSpan="7" align="center">예약 데이터가 없습니다.</td>
                        </tr>
                    ) : (
                        reservations.map(reservation => (
                            <tr key={reservation.id}>
                                <td>{reservation.id}</td>
                                <td>{reservation.customerName}</td>
                                <td>{reservation.customerPhone}</td>
                                <td>{reservation.checkIn}</td>
                                <td>{reservation.checkOut}</td>
                                <td>{reservation.status}</td>
                                <td>{reservation.createDt}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ReservationPage;