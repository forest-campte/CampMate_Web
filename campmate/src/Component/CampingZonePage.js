import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../api';

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
            setFormData({
                ...zone,
                // DB에서 0/1로 온 값을 true/false로 변환하여 체크박스에 반영
                parking: zone.parking === 1 || zone.parking === true,
                isActive: zone.isActive === 1 || zone.isActive === true,
            });
        } else {
            // 추가 모드일 때 폼 데이터 초기화
            setFormData({
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
        }
    }, [zone]);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const processedValue = name === 'capacity' || name === 'price' ? parseInt(value, 10) : value;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : processedValue
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 저장 시점에 true/false를 0/1로 변환하여 전달
        const dataToSend = {
            ...formData,
            parking: formData.parking ? 1 : 0,
            isActive: formData.isActive ? 1 : 0,
        };
        onSave(dataToSend);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>{zone ? '캠핑존 수정' : '새 캠핑존 추가'}</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name-input">캠핑존 이름</label>
                    <input id="name-input" name="name" value={formData.name} onChange={handleChange} placeholder="캠핑존 이름" required />
                    
                    <label htmlFor="desc-input">캠핑존 설명</label>
                    <textarea id="desc-input" name="description" value={formData.description} onChange={handleChange} placeholder="캠핑존 설명" />

                    <label htmlFor="capacity-input">수용 인원</label>
                    <input id="capacity-input" name="capacity" type="number" value={formData.capacity} onChange={handleChange} placeholder="수용 인원" required />

                    <label htmlFor="price-input">가격 (1박)</label>
                    <input id="price-input" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="가격" required />

                    <label htmlFor="size-input">사이트 크기</label>
                    <input id="size-input" name="defaultSize" value={formData.defaultSize} onChange={handleChange} placeholder="예: 6x8m" required/>

                    <label htmlFor="type-select">캠핑 타입</label>
                    <select id="type-select" name="type" value={formData.type} onChange={handleChange} required>
                        <option value="오토캠핑">오토캠핑</option>
                        <option value="글램핑">글램핑</option>
                        <option value="카라반">카라반</option>
                    </select>

                    <label htmlFor="floor-select">바닥 타입</label>
                    <select id="floor-select" name="floor" value={formData.floor} onChange={handleChange} required>
                        <option value="파쇄석">파쇄석</option>
                        <option value="데크">데크</option>
                        <option value="잔디">잔디</option>
                    </select>

                    <div className="checkbox-group">
                        <label>
                            <input name="parking" type="checkbox" checked={formData.parking} onChange={handleChange} />
                            주차 가능
                        </label>
                        <label>
                            <input name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} />
                            예약 가능
                        </label>
                    </div>

                    <div className="modal-buttons">
                        <button type="submit">저장</button>
                        <button type="button" onClick={onCancel}>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CampingZonePage({ user }) {
    const [zones, setZones] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingZone, setEditingZone] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchZones = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // TODO: 백엔드에 현재 로그인한 관리자의 캠핑존만 가져오는 API 구현 필요
                const data = await fetchWithAuth('/api/zones'); 
                setZones(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchZones();
    }, [user]);

    const handleAddClick = () => {
        setEditingZone(null);
        setIsModalOpen(true);
        setError("");
    };

    const handleEditClick = (zone) => {
        setEditingZone(zone);
        setIsModalOpen(true);
        setError("");
    };

    const handleSave = async (zoneData) => {
        setError("");
        const url = editingZone ? `/api/zones/${editingZone.id}` : '/api/zones';
        const method = editingZone ? 'PUT' : 'POST';
        
        const payload = editingZone 
            ? zoneData 
            : { ...zoneData, adminId: user.id };
        
        try {
            const savedZone = await fetchWithAuth(url, {
                method: method,
                body: JSON.stringify(payload)
            });
            
            if (editingZone) {
                setZones(zones.map(z => z.id === savedZone.id ? savedZone : z));
            } else {
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
                                <td>{zone.price ? zone.price.toLocaleString() : 0} 원</td>
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