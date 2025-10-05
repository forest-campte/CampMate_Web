import React, { useEffect, useState } from "react";

function ReservationPage({ user }) {
    // 이 페이지에서 사용할 상태들을 내부에서 직접 관리합니다.
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // API 요청 시 자동으로 토큰을 헤더에 추가하는 헬퍼 함수
    const fetchWithAuth = (url, options = {}) => {
        const token = localStorage.getItem('authToken');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return fetch(url, { ...options, headers });
    };
    
    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            try {
                const response = await fetchWithAuth('/api/reservations'); // 임시 엔드포인트
                if (!response.ok) {
                    throw new Error('예약 데이터를 불러오는 데 실패했습니다.');
                }
                const data = await response.json();
                setReservations(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        // user 정보가 있을 때만(로그인 되었을 때만) 데이터를 불러옵니다.
        if (user) {
            fetchReservations();
        }
    }, [user]); // user prop이 변경될 때마다 데이터를 다시 불러올 수 있습니다.

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
                                <td>{new Date(reservation.checkIn).toLocaleDateString()}</td>
                                <td>{new Date(reservation.checkOut).toLocaleDateString()}</td>
                                <td>{reservation.status}</td>
                                <td>{new Date(reservation.createDt).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ReservationPage;