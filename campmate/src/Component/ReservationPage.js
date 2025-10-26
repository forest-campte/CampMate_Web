import React, { useEffect, useState } from "react";
import { fetchWithAuth } from '../api';

function ReservationPage({ user }) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // 'R': 예약됨, 'C': 취소됨, 'E': 완료
    const [filterStatus, setFilterStatus] = useState('R'); 

    useEffect(() => {
        const fetchReservations = async () => {
            if (!user || !user.id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");
            try {
                const url = `/api/reservations/admin/${user.id}/status?status=${filterStatus}`;
                const data = await fetchWithAuth(url);
                setReservations(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchReservations();
    }, [user, filterStatus]); // user 또는 filterStatus가 변경될 때마다 데이터를 다시 불러옵니다.

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    if (loading) return <div>예약 목록을 불러오는 중...</div>;
    if (error) return <div style={{ color: 'red' }}>에러: {error}</div>;
    
    return (
        <div>
            <h2>예약 관리 페이지</h2>
            <p>이곳에서 예약 현황을 확인하고 관리할 수 있습니다.</p>

            <div className="filter-container">
                <label htmlFor="status-filter">예약 상태: </label>
                <select id="status-filter" value={filterStatus} onChange={handleFilterChange}>
                    <option value="R">예약됨</option>
                    <option value="C">취소됨</option>
                    <option value="E">이용 완료</option>
                </select>
            </div>

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
                            <td colSpan="7" align="center">해당 상태의 예약 데이터가 없습니다.</td>
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