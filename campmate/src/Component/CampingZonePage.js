import React, { useState, useEffect } from 'react';

// 캠핑존 정보를 입력받는 팝업창(모달) 컴포넌트
function CampingZoneModal({ zone, onSave, onCancel }) {
    // DB 스키마에 맞춰 모든 필드의 초기 상태를 정의합니다.
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        capacity: 2, // 기본값 설정
        price: 0,
        type: '오토캠핑', // 기본값 설정
        default_size: '',
        floor: '파쇄석', // 기본값 설정
        parking: false,
        is_active: true
    });

    // 수정 모드일 때 기존 데이터를 폼에 채워넣음
    useEffect(() => {
        if (zone) {
            setFormData(zone);
        }
    }, [zone]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // 숫자 입력 필드는 숫자로 변환
        const processedValue = name === 'capacity' || name === 'price' ? parseInt(value, 10) : value;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : processedValue
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    // DB 스키마에 맞춰 입력 폼 필드를 업데이트합니다.
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>{zone ? '캠핑존 수정' : '새 캠핑존 추가'}</h2>
                <form onSubmit={handleSubmit}>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="캠핑존 이름" required />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="캠핑존 설명" />
                    <input name="capacity" type="number" value={formData.capacity} onChange={handleChange} placeholder="수용 인원" required />
                    <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="가격" required />
                    <input name="default_size" value={formData.default_size} onChange={handleChange} placeholder="사이트 크기 (예: 6x8m)" required/>

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
                        <input name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange} />
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
function CampingZonePage({ user, zones: initialZones }) {
    const [zones, setZones] = useState(initialZones || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingZone, setEditingZone] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        // TODO: user.id를 사용하여 해당 관리자의 캠핑존 목록을 fetch로 가져오는 로직 추가
        setZones(initialZones || []);
    }, [user, initialZones]);

    const handleAddClick = () => {
        setEditingZone(null); // '추가' 모드이므로 수정할 데이터는 null로 설정
        setIsModalOpen(true); // **[핵심 변경]** 모달을 보이도록 상태 변경
        setError("");
    };

    const handleEditClick = (zone) => {
        setEditingZone(zone);
        setIsModalOpen(true);
        setError("");
    };

    const handleSave = async (zoneData) => {
        setError("");

        if (editingZone) {
            // 수정 모드일 때 (UPDATE)
            try {
                const response = await fetch(`/api/zones/${editingZone.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${your_auth_token}`
                    },
                    body: JSON.stringify(zoneData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '데이터 저장에 실패했습니다.');
                }

                const updatedZone = await response.json();
                setZones(zones.map(z => (z.id === updatedZone.id ? updatedZone : z)));
                setIsModalOpen(false);
                setEditingZone(null);

            } catch (err) {
                console.error('캠핑존 수정 실패:', err);
                setError(err.message);
            }

        } else {
            // 추가 모드일 때 (CREATE)
            try {
                const response = await fetch('/api/zones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${your_auth_token}`
                    },
                    body: JSON.stringify(zoneData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '캠핑존 추가에 실패했습니다.');
                }

                const newZone = await response.json();
                setZones([...zones, newZone]);
                setIsModalOpen(false);

            } catch (err) {
                console.error('캠핑존 추가 실패:', err);
                setError(err.message);
            }
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingZone(null);
        setError("");
    };

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
                                <td>{zone.is_active ? '예약 가능' : '예약 불가'}</td>
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

            {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
        </div>
    );
}

export default CampingZonePage;