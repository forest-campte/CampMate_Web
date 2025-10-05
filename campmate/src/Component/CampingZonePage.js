import React, { useState, useEffect } from 'react';

// 캠핑존 추가/수정을 위한 팝업(모달) 컴포넌트
function CampingZoneModal({ zone, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        capacity: 2,
        price: 0,
        type: '오토캠핑',
        defaultSize: '',
        floor: '파쇄석',
        parking: false,
        isActive: true
    });

    useEffect(() => {
        if (zone) {
            // 수정 모드일 때, 기존 데이터를 폼에 채워넣습니다.
            // DB에서 'T'/'F'로 저장된 parking 값을 boolean으로 변환합니다.
            setFormData({
                ...zone,
                parking: zone.parking === 'T',
                isActive: zone.isActive
            });
        }
    }, [zone]);
    
    // 폼 입력값이 변경될 때마다 formData 상태를 업데이트합니다.
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // capacity, price 필드는 숫자로 변환합니다.
        const processedValue = name === 'capacity' || name === 'price' ? parseInt(value, 10) : value;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : processedValue
        }));
    };

    // 폼 제출 시 onSave 함수를 호출합니다.
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>{zone ? '캠핑존 수정' : '새 캠핑존 추가'}</h2>
                <form onSubmit={handleSubmit}>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="캠핑존 이름" required />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="캠핑존 설명" />
                    <input name="capacity" type="number" value={formData.capacity} onChange={handleChange} placeholder="수용 인원" required />
                    <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="가격" required />
                    <input name="defaultSize" value={formData.defaultSize} onChange={handleChange} placeholder="사이트 크기 (예: 6x8m)" required/>

                    <select name="type" value={formData.type} onChange={handleChange} required>
                        <option value="오토캠핑">오토캠핑</option>
                        <option value="글램핑">글램핑</option>
                        <option value="카라반">카라반</option>
                    </select>

                    <select name="floor" value={formData.floor} onChange={handleChange} required>
                        <option value="파쇄석">파쇄석</option>
                        <option value="데크">데크</option>
                        <option value="잔디">잔디</option>
                    </select>

                    <label>
                        <input name="parking" type="checkbox" checked={formData.parking} onChange={handleChange} />
                        주차 가능
                    </label>
                    <label>
                        <input name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} />
                        예약 가능
                    </label>

                    <div className="modal-buttons">
                        <button type="submit">저장</button>
                        <button type="button" onClick={onCancel}>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// 메인 캠핑존 관리 페이지 컴포넌트
function CampingZonePage({ user }) {
    // 이 페이지에서 사용할 상태들을 내부에서 직접 관리합니다.
    const [zones, setZones] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingZone, setEditingZone] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

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

    // 페이지가 처음 로드될 때(마운트될 때) 캠핑존 목록을 서버에서 가져옵니다.
    useEffect(() => {
        const fetchZones = async () => {
            setLoading(true);
            try {
                const response = await fetchWithAuth('/api/zones'); 
                if (!response.ok) throw new Error('데이터를 불러오는 데 실패했습니다.');
                const data = await response.json();
                setZones(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchZones();
    }, []); // 의존성 배열을 비워두어 최초 1회만 실행되도록 합니다.

    const handleAddClick = () => {
        setEditingZone(null); // 수정 모드가 아님을 명시
        setIsModalOpen(true);
        setError("");
    };

    const handleEditClick = (zone) => {
        setEditingZone(zone); // 수정할 zone 데이터를 상태에 저장
        setIsModalOpen(true);
        setError("");
    };

    // 캠핑존 추가 또는 수정 정보를 서버에 저장하는 함수
    const handleSave = async (zoneData) => {
        setError("");
        const url = editingZone ? `/api/zones/${editingZone.id}` : '/api/zones';
        const method = editingZone ? 'PUT' : 'POST';
        // 추가 모드일 때만 로그인된 사용자의 ID를 payload에 담습니다.
        const payload = editingZone ? zoneData : { ...zoneData, adminId: user.id };

        try {
            const response = await fetchWithAuth(url, {
                method: method,
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '데이터 저장에 실패했습니다.');
            }
            const savedZone = await response.json();
            
            if (editingZone) { // 수정의 경우: 기존 목록에서 해당 항목을 교체
                setZones(zones.map(z => z.id === savedZone.id ? savedZone : z));
            } else { // 추가의 경우: 목록의 맨 뒤에 추가
                setZones([...zones, savedZone]);
            }
            setIsModalOpen(false);
            setEditingZone(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingZone(null);
        setError("");
    };

    if (loading) return <div>캠핑존 목록을 불러오는 중...</div>;

    return (
        <div>
            <h2>캠핑존 관리</h2>
            <p>로그인된 이메일: {user ? user.email : ""}</p>
            
            <table border="1" style={{ margin: "20px auto", minWidth: "800px" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>이름</th>
                        <th>가격</th>
                        <th>수용인원</th>
                        <th>상태</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {zones.length === 0 ? (
                        <tr>
                            <td colSpan="6" align="center">등록된 캠핑존이 없습니다.</td>
                        </tr>
                    ) : (
                        zones.map(zone => (
                            <tr key={zone.id}>
                                <td>{zone.id}</td>
                                <td>{zone.name}</td>
                                <td>{zone.price.toLocaleString()} 원</td>
                                <td>{zone.capacity} 명</td>
                                <td>{zone.isActive ? '예약 가능' : '예약 불가'}</td>
                                <td>
                                    <button onClick={() => handleEditClick(zone)}>수정</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <button onClick={handleAddClick}>새 캠핑존 추가</button>

            {isModalOpen && (
                <CampingZoneModal
                    zone={editingZone}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
}

export default CampingZonePage;