import React, { useEffect, useState } from "react";
import { fetchWithAuth } from '../api'; // 📝 [수정] api.js에서 fetchWithAuth import

function ReservationPage({ user }) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            try {
                // TODO: 백엔드에 현재 로그인한 관리자의 예약만 가져오는 API가 필요합니다.
                const data = await fetchWithAuth('/api/reservations');
                setReservations(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        if (user) {
            fetchReservations();
        }
    }, [user]);

    if (loading) return <div>예약 목록을 불러오는 중...</div>;
    if (error) return <div style={{ color: 'red' }}>에러: {error}</div>;
    
    return (
        <div>
            <h2>예약 관리 페이지</h2>
            <p>이곳에서 예약 현황을 확인하고 관리할 수 있습니다.</p>

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